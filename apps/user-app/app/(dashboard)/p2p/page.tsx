import { SendCard } from "../../../components/SendCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { P2Ptrxn } from "../../../components/P2PTrxn";
import Prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";

type Balance = {
  amount: number;
  locked: number;
};

type P2PTransaction = {
  amount: number;
  toUser: number;
  fromUser: number;
  timestamp: Date;
};

async function getBalance(): Promise<Balance> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      redirect("/auth/signin");
    }

    const balance = await Prisma.balance.findFirst({
      where: {
        userId: Number(session.user.id)
      }
    });

    return {
      amount: balance?.amount ?? 0,
      locked: balance?.locked ?? 0
    };
  } catch (error) {
    console.error("Error fetching balance:", error);
    return { amount: 0, locked: 0 };
  }
}

async function getP2PTransactions(): Promise<P2PTransaction[]> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return [];
    }

    const transactions = await Prisma.p2pTransfer.findMany({
      where: {
        fromUserId: Number(session.user.id)
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 5
    });

    return transactions.map(t => ({
      amount: t.amount/100,
      toUser: t.toUserId,
      fromUser: t.fromUserId,
      timestamp: t.timestamp
    }));
  } catch (error) {
    console.error("Error fetching P2P transactions:", error);
    return [];
  }
}

export default async function P2PTransferPage() {
  try {
    const [balance, transactions] = await Promise.all([
      getBalance(),
      getP2PTransactions()
    ]);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-3xl text-[#6a51a6] font-bold mb-4">
          P2P Transfer
        </h1>
        6
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <SendCard />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow">
              <BalanceCard amount={balance.amount} locked={balance.locked} />
            </div>
            
            <div className="bg-white rounded-lg shadow">
            <h1 className="text-2xl text-[#6a51a6] font-bold mb-4">
              P2P History</h1>
              <P2Ptrxn P2P={transactions} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering P2P transfer page:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-gray-600">
            Please try refreshing the page or contact support if the issue persists.
          </p>
        </div>
      </div>
    );
  }
}