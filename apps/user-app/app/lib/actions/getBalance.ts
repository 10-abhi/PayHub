import prisma from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"

type balanceType =
    { id: number; userId: number; amount: number; locked: number; }
export async function getBalance() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user.id) {
            return {
                message: "Unauthenticated request"
            }
        }
        const balance = await prisma.balance.findFirst({
            where: {
                userId: Number(session.user.id)
            }
        }) as balanceType | null

        return {
            amount: balance?.amount ?? 0,
            locked: balance?.locked ?? 0
        };
    } catch (error) {

        console.error("Error fetching balance:", error);
        return { amount: 0, locked: 0 };

    }
}