export const dynamic = "force-dynamic";

import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransaction";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
type OnRampTransactionDB = NonNullable<Awaited<ReturnType<typeof prisma.onRampTransaction.findFirst>>>;


type Balance = {
  amount: number;
  locked: number;
};

type Transaction = {
  time: Date;
  amount: number;
  status: string;
  provider: string;
};

async function getBalance(): Promise<Balance> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { amount: 0, locked: 0 };
    }
    
    const balance = await prisma.balance.findFirst({
      where: {
        userId: Number(session.user.id)
      }
    });
    
    return {
      amount: balance?.amount || 0,
      locked: balance?.locked || 0
    };
  } catch (error) {
    console.error("Error fetching balance:", error);
    return { amount: 0, locked: 0 };
  }
}

async function getOnRampTransactions(): Promise<Transaction[]> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return [];
    }
    
    const txns = await prisma.onRampTransaction.findMany({
      where: {
        userId: Number(session.user.id)
      },
      orderBy: {
        startTime: 'desc'
      },
      take: 10
    });
    
    return txns.map( (t: OnRampTransactionDB)  => ({
      time: t.startTime,
      amount: t.amount,
      status: t.status.toString(),
      provider: t.provider
    }));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export default async function TransferPage() {
  try {
    const [balance, transactions] = await Promise.all([
      getBalance(),
      getOnRampTransactions()
    ]);
    
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
          Transfer
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <AddMoney />
          </div>
          
          <div className="space-y-6">
            <BalanceCard amount={balance.amount} locked={balance.locked} />
            <OnRampTransactions transactions={transactions} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering transfer page:", error);
    return (
      <div className="container mx-auto px-4 py-8 min-h-[70vh] flex items-center justify-center">
        <div className="bg-slate-900/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-800 shadow-xl text-center max-w-md w-full">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-slate-200 mb-2">
            Something went wrong
          </h2>
          <div className="text-slate-400 text-sm">
            Please try refreshing the page or contact support if the issue persists.
          </div>
        </div>
      </div>
    );
  }
}