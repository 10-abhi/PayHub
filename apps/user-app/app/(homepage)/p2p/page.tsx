export const dynamic = "force-dynamic";

import { SendCard } from "../../../components/SendCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { P2Ptrxn } from "../../../components/P2PTrxn";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { getBalance } from "../../lib/actions/getBalance";

type P2PTransaction = {
  amount: number;
  toUser: number;
  fromUser: number;
  timestamp: Date;
};

async function getP2PTransactions(): Promise<P2PTransaction[]> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return [];
    }
    
    const transactions = await prisma.p2pTransfer.findMany({
      where: {
        fromUserId: Number(session.user.id)
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 5
    });
    
    return transactions.map((t: { amount: number; toUserId: number ; fromUserId: number ; timestamp : Date } )=> ({
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
          P2P Transfer
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <SendCard />
          </div>
          
          <div className="space-y-6">
            <BalanceCard amount={balance.amount ?? 0} locked={balance.locked ?? 0} />
            <div>
              <h2 className="text-lg font-semibold text-slate-200 mb-4">
                P2P History
              </h2>
              <P2Ptrxn P2P={transactions} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering P2P transfer page:", error);
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