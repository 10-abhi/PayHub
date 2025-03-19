// app/transfer/page.tsx
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
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl text-[#6a51a6] font-bold mb-6">
          Transfer
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg h-full">
              <AddMoney />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
              <BalanceCard amount={balance.amount} locked={balance.locked} />
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
              <h2 className="text-xl text-[#331c6b] font-semibold mb-4">
                Transaction History
              </h2>
              <OnRampTransactions transactions={transactions} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering transfer page:", error);
    return (
      <div className="container mx-auto px-4 py-8 mt-16 min-h-[70vh] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-red-500 mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <div className="text-gray-600">
            Please try refreshing the page or contact support if the issue persists.
          </div>
        </div>
      </div>
    );
  }
}