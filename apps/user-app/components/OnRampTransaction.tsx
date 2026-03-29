"use client"
import { Card } from "@repo/ui/card"

//Added type can be wrong tho
// type Statuss =  {
//    Success : String,
//    failure : String,
//    Processing : String
// }

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        status: string,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center py-8 text-slate-500">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2 space-y-3">
            {transactions.map(t => <div key={`${t.time.toISOString()}-${t.amount}-${t.provider}`} className="flex justify-between items-center p-3 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <div>
                    <div className="text-sm text-slate-200 font-medium">
                        Received INR
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">
                        {t.time.toDateString()}
                    </div>
                </div>
                <div className="text-emerald-400 font-bold">
                    + ₹ {(t.amount / 100).toFixed(2)}
                </div>
            </div>)}
        </div>
    </Card>
}