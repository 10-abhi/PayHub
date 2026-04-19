import express from "express";
const app = express();
import db from "@repo/db/client"
import { z } from 'zod'
import 'dotenv/config'
import Stripe from 'stripe';

const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || process.env.STRIPE_ENV) as string, {
    apiVersion: '2024-04-10' as any
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

const paymentSchema = z.object({
    token: z.string(),
    userId: z.number(),
    amount: z.number(),
});

app.post("/stripeWebhook", express.raw({ type: 'application/json' }), async (req, res): Promise<void> => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed.`, err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        try {
            const token = session.id;

            // First we need to find the OnRampTransaction to get the userId and amount
            const transaction = await db.onRampTransaction.findUnique({
                where: { token: token }
            });

            if (transaction && transaction.status === "Processing") {
                await db.$transaction([
                    db.balance.updateMany({
                        where: { userId: transaction.userId },
                        data: {
                            amount: { increment: transaction.amount }
                        }
                    }),
                    db.onRampTransaction.update({
                        where: { token: token },
                        data: { status: "Success" }
                    })
                ]);
                console.log("Transaction updated successfully")
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error processing webhook database update" });
            return;
        }
    }

    res.json({ received: true });
});

app.use(express.json());
app.post("/hdfcWebhook", async (req, res) => {

    //Todo : Add zod validation // completed

    const data = req.body;
    const success = data.parse(paymentSchema);
    if (!success) {
        res.json({
            mesaage: "Schema is not valid"
        })
    }

    const paymentInformation = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    }

    console.log(paymentInformation);

    try {
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({
            message: "Captured"
        })
    } catch (error) {
        console.error(error);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});