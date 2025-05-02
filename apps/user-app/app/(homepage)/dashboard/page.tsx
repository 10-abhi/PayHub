export const dynamic = "force-dynamic";

import React from 'react';
import { Card } from "@repo/ui/card";
import { FiDollarSign, FiArrowUpRight, FiArrowDownLeft, FiUsers, FiCreditCard, FiBell, FiBarChart2 } from 'react-icons/fi';
import { getBalance } from '../../lib/actions/getBalance';
import Link from 'next/link';

async function BalanceComponent() {
  const amount = await getBalance();
  const modifiedAmount = Number(amount.amount)/100;
  return <div className="flex items-baseline">
    <span className="text-3xl font-bold">${modifiedAmount}</span>
    <span className="ml-2 text-sm opacity-80">USD</span>
  </div>

}

export default function Dashboard() {
  // Mock data for the dashboard
  // const balance = 4567.89;
  // const amount =  await getBalance();
  const recentTransactions = [
    { id: 1, name: "Sarah Johnson", amount: -124.50, date: "Today, 2:30 PM", type: "outgoing" },
    { id: 2, name: "Netflix", amount: -15.99, date: "Yesterday", type: "subscription" },
    { id: 3, name: "Payroll", amount: 2400.00, date: "Mar 10, 2025", type: "incoming" },
    { id: 4, name: "Amazon", amount: -67.32, date: "Mar 8, 2025", type: "outgoing" },
  ];

  const quickActions = [
    { icon: <FiDollarSign size={20} />, title: "Send Money", color: "bg-blue-100 text-blue-600" },
    { icon: <FiArrowDownLeft size={20} />, title: "Request", color: "bg-green-100 text-green-600" },
    { icon: <FiUsers size={20} />, title: "Split Bill", color: "bg-purple-100 text-purple-600" },
    { icon: <FiCreditCard size={20} />, title: "Cards", color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      {/* Account Balance */}
      <Card title="Total Balance">
        <div className="mb-6 p-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium opacity-90">Total Balance</h2>
            <FiBell size={20} className="opacity-80" />
          </div>
          <BalanceComponent></BalanceComponent>
          <div className="flex mt-6 gap-3">
            <Link href={"/p2p"}>
            <button className="flex items-center justify-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-4 py-2 text-sm font-medium transition-all">
              <FiArrowUpRight size={16} />
              Send
            </button>
            </Link>
            
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h2>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {quickActions.map((action, index) => (
          <Card key={index} title={action.title}>
            <div className={`${action.color} p-2 rounded-full mb-2`}>
              {action.icon}
            </div>
            <span className="text-xs font-medium text-gray-700">{action.title}</span>
          </Card>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
        <a href="/transactions" className="text-sm text-blue-600 font-medium">View All</a>
      </div>
      <Card title="Recent Transactions">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="flex justify-between items-center p-4">
            <div className="flex items-center">
              <div className={`rounded-full p-2 mr-3 ${transaction.type === "incoming" ? "bg-green-100" :
                  transaction.type === "subscription" ? "bg-purple-100" : "bg-red-100"
                }`}>
                {transaction.type === "incoming" ?
                  <FiArrowDownLeft size={16} className="text-green-600" /> :
                  transaction.type === "subscription" ?
                    <FiCreditCard size={16} className="text-purple-600" /> :
                    <FiArrowUpRight size={16} className="text-red-600" />
                }
              </div>
              <div>
                <p className="font-medium text-gray-800">{transaction.name}</p>
                <p className="text-xs text-gray-500">{transaction.date}</p>
              </div>
            </div>
            <span className={`font-semibold ${transaction.amount < 0 ? "text-red-600" : "text-green-600"
              }`}>
              {transaction.amount < 0 ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
            </span>
          </div>
        ))}
      </Card>

      {/* Spending Overview */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Spending Overview</h2>
        <select className="text-sm text-gray-600 border rounded-md px-2 py-1">
          <option>This Month</option>
          <option>Last Month</option>
          <option>Last 3 Months</option>
        </select>
      </div>
      <Card title="Spending Overview">
        <div className="flex justify-center items-center h-48">
          <FiBarChart2 size={24} className="mr-2" />
          <span>Spending chart will display here</span>
        </div>
      </Card>
     
      {/* Spacing for navbar */}
      <div className="h-16"></div>
    </div>
  );
}