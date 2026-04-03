import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";
import db from "@repo/db/client";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
        return <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white p-4">
            <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Welcome to Paytm Merchant</h1>
            <p className="text-slate-400 text-lg">Please login to view your dashboard and recent transactions.</p>
        </div>
    }

    let merchant = await db.merchant.findUnique({
        where: { email: session.user.email }
    });

    if (!merchant) {
        merchant = await db.merchant.upsert({
            where: { email: session.user.email },
            create: {
                email: session.user.email,
                name: session.user.name || "Merchant",
                auth_type: "Google"
            },
            update: {}
        });
    }

    const merchantId = merchant.id;
    const txs = await db.merchantTransaction.findMany({
        where: { merchantId },
        include: { fromUser: true },
        orderBy: { timestamp: "desc" },
        take: 10
    });

    const totalRevenue = txs.reduce((acc, t) => acc + t.amount, 0);

    return (
        <div className="min-h-screen text-slate-100 p-6 md:p-12 pt-28 bg-gradient-to-br from-slate-950 to-slate-900">
            <h1 className="text-4xl font-extrabold mt-10 mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 shadow-lg shadow-emerald-500/5 hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            💸
                        </div>
                        <h2 className="text-slate-300 font-semibold text-lg">Total Revenue</h2>
                    </div>
                    <p className="text-4xl font-bold text-white mt-4">₹ {(totalRevenue / 100).toFixed(2)}</p>
                </div>
                <div className="bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 shadow-lg shadow-blue-500/5 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                            📊
                        </div>
                        <h2 className="text-slate-300 font-semibold text-lg">Recent Transactions</h2>
                    </div>
                    <p className="text-4xl font-bold text-white mt-4">{txs.length}</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-slate-200">Recent Payments</h2>
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                {txs.length === 0 ? <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                    <span className="text-4xl mb-4 opacity-50">🧾</span>
                    <p className="text-lg">No transactions yet.</p>
                </div> : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/50 border-b border-slate-800 text-slate-300 text-sm uppercase translate-y-px">
                            <tr>
                                <th className="p-5 font-semibold">User</th>
                                <th className="p-5 font-semibold">Amount</th>
                                <th className="p-5 font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-slate-200">
                            {txs.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-800/50 transition-colors group">
                                    <td className="p-5 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm shadow-inner">
                                            {t.fromUser?.name?.[0] || "U"}
                                        </div>
                                        <span className="font-medium group-hover:text-white transition-colors">{t.fromUser?.name || "Unknown User"}</span>
                                    </td>
                                    <td className="p-5 text-emerald-400 font-bold tracking-wide">+ ₹ {(t.amount / 100).toFixed(2)}</td>
                                    <td className="p-5 text-slate-400 whitespace-nowrap">{new Date(t.timestamp).toLocaleDateString(undefined, {
                                        year: 'numeric', month: 'short', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
