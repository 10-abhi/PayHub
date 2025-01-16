import express from "express";
const app = express();
import db from "@repo/db/client"

app.use(express.json());
app.post("/hdfcWebhook" , async (req,res)=>{
    //Todo : Add zod validation
    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
    const paymentInformation = {
        token : req.body.token,
        userId : req.body.user_identifier,
        amount : req.body.amount
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
            message:"Error while processing webhook"
        })
    }
})

app.listen(3001);