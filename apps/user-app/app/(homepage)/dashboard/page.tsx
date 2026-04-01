export const dynamic = "force-dynamic";

import React from 'react';
import { Card } from "@repo/ui/card";
import { getBalance } from '../../lib/actions/getBalance';
import Link from 'next/link';

async function BalanceComponent() {
  const amount = await getBalance();
  const modifiedAmount = Number(amount.amount) / 100;
  return <div className="flex items-baseline">
    <span className="text-3xl font-bold text-white">₹{modifiedAmount.toFixed(2)}</span>
    <span className="ml-2 text-sm text-slate-400">INR</span>
  </div>
}

export default function Dashboard() {
  const recentTransactions = [
    { id: 1, name: "Sarah Johnson", amount: -124.50, date: "Today, 2:30 PM", type: "outgoing" },
    { id: 2, name: "Netflix", amount: -15.99, date: "Yesterday", type: "subscription" },
    { id: 3, name: "Payroll", amount: 2400.00, date: "Mar 10, 2025", type: "incoming" },
    { id: 4, name: "Amazon", amount: -67.32, date: "Mar 8, 2025", type: "outgoing" },
  ];

  const quickActions = [
    { icon: "💸", title: "Send Money", href: "/p2p", color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
    { icon: "📥", title: "Add Money", href: "/transfer", color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
    { icon: "🏪", title: "Pay Merchant", href: "/merchant", color: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
    { icon: "📊", title: "History", href: "/transactions", color: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-8 max-w-4xl">
      {/* Account Balance */}
      <div className="mb-8 p-6 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl shadow-2xl shadow-emerald-500/10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-medium text-white/80">Total Balance</h2>
        </div>
        <BalanceComponent></BalanceComponent>
        <div className="flex mt-6 gap-3">
          <Link href={"/p2p"}>
            <button className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 rounded-xl px-4 py-2 text-sm font-medium text-white transition-all border border-white/10">
              ↗ Send
            </button>
          </Link>
          <Link href={"/transfer"}>
            <button className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 rounded-xl px-4 py-2 text-sm font-medium text-white transition-all border border-white/10">
              + Add Money
            </button>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-slate-200 mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {quickActions.map((action, index) => (
          <Link key={index} href={action.href}>
            <div className={`${action.color} border rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-pointer`}>
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs font-medium">{action.title}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-slate-200">Recent Transactions</h2>
        <Link href="/transactions" className="text-sm text-emerald-400 font-medium hover:text-emerald-300 transition-colors">View All</Link>
      </div>
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="flex justify-between items-center p-4 border-b border-slate-800/50 last:border-b-0 hover:bg-slate-800/30 transition-colors">
            <div className="flex items-center">
              <div className={`rounded-full p-2 mr-3 ${transaction.type === "incoming" ? "bg-emerald-500/10 text-emerald-400" :
                  transaction.type === "subscription" ? "bg-purple-500/10 text-purple-400" : "bg-red-500/10 text-red-400"
                }`}>
                {transaction.type === "incoming" ? "↙" :
                  transaction.type === "subscription" ? "💳" : "↗"}
              </div>
              <div>
                <p className="font-medium text-slate-200 text-sm">{transaction.name}</p>
                <p className="text-xs text-slate-500">{transaction.date}</p>
              </div>
            </div>
            <span className={`font-bold text-sm ${transaction.amount < 0 ? "text-red-400" : "text-emerald-400"
              }`}>
              {transaction.amount < 0 ? "-" : "+"}₹{Math.abs(transaction.amount).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}