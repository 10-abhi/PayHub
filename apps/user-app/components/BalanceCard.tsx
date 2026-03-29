"use client"
import { Card } from "@repo/ui/card";

export const BalanceCard = ({amount, locked}: {
    amount: number;
    locked: number;
}) => {
    return <Card title={"Balance"}>
        <div className="flex justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="text-slate-400 text-sm">Unlocked balance</div>
            <div className="text-emerald-400 font-bold">₹ {(amount / 100).toFixed(2)}</div>
        </div>
        <div className="flex justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="text-slate-400 text-sm">Total Locked Balance</div>
            <div className="text-amber-400 font-bold">₹ {(locked / 100).toFixed(2)}</div>
        </div>
        <div className="flex justify-between pt-1">
            <div className="text-slate-300 text-sm font-medium">Total Balance</div>
            <div className="text-white font-bold text-lg">₹ {((locked + amount) / 100).toFixed(2)}</div>
        </div>
    </Card>
}