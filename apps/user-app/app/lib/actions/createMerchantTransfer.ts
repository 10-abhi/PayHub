"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";
import { Prisma } from '@prisma/client';

export async function createMerchantTransfer(merchantEmail: string, amount: number) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return {
            message: "No active session - please log in",
            error: "NO_SESSION"
        }
    }
    const from = session.user.id;
  
    const merchant = await prisma.merchant.findUnique({
        where: {
            email: merchantEmail
        }
    });

    if (!merchant) {
        return {
            message: "Merchant not found"
        }
    }

    try {
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;

            const fromBalance = await tx.balance.findUnique({
                where: { userId: Number(from) },
            });

            if (!fromBalance || fromBalance.amount < amount) {
                throw new Error('Insufficient funds');
            }

            await tx.balance.update({
                where: { userId: Number(from) },
                data: { amount: { decrement: amount } },
            });

            // Merchants do not have a balance table, so we just log the transaction
            await tx.merchantTransaction.create({
                data: {
                    fromUserId: Number(from),
                    merchantId: merchant.id,
                    amount: amount,
                    timestamp: new Date(),
                }
            });
        });
        
        return { message: "Success" };

    } catch (error: any) {
        console.log(error);
        return { message: error?.message || "Error while sending" };
    }
}
