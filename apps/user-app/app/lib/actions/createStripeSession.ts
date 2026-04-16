"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import Stripe from "stripe";

const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || process.env.STRIPE_Env || process.env.STRIPE_ENV) as string, {
    apiVersion: "2024-04-10" as any,
});

export async function createStripeSession(amount: number) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
        return {
            success: false,
            message: "Unauthenticated request"
        }
    }

    try {
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Wallet Top-up',
                            description: 'Add funds to your digital wallet',
                        },
                        unit_amount: amount * 100, // Amount in paise
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: process.env.NEXT_PUBLIC_URL ? `${process.env.NEXT_PUBLIC_URL}/transfer` : 'http://localhost:3000/transfer',
            cancel_url: process.env.NEXT_PUBLIC_URL ? `${process.env.NEXT_PUBLIC_URL}/transfer` : 'http://localhost:3000/transfer',
        });

        // The session ID might be longer than usual tokens. Prisma token field is String, which should be fine.
        await prisma.onRampTransaction.create({
            data: {
                provider: "Stripe",
                status: "Processing",
                startTime: new Date(),
                token: stripeSession.id, // We use the stripe session ID as the token to map it later
                userId: Number(session.user.id),
                amount: amount * 100 // Prisma stores it in Paise as well
            }
        });

        return {
            success: true,
            url: stripeSession.url
        }
    } catch (e: any) {
        console.error("Stripe Session Error:", e);
        return {
            success: false,
            message: e.message || "Something went wrong"
        }
    }
}
