export default function TransactionPage() {
    return <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
            Transactions
        </h1>
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-800 p-8 text-center shadow-xl">
            <span className="text-4xl mb-4 block opacity-50">🧾</span>
            <p className="text-slate-400">Transaction history will appear here.</p>
        </div>
    </div>
}