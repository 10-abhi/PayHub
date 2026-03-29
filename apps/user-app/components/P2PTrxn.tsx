import React from 'react';

export const P2Ptrxn = (props: {
  P2P: {
    fromUser: number;
    toUser: number;
    amount: number;
    timestamp: Date;
  }[];
}) => {
  const { P2P } = props;

  if (!P2P || P2P.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm shadow-xl">
        <div className="p-8 text-center text-slate-500">
          No P2P transactions were made
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm shadow-xl">
      <div className="p-4">
        <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3">
          {P2P.map((transaction, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-slate-800/50 bg-slate-950/50 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500/10 p-2 rounded-full border border-blue-500/20">
                    <div className="h-4 w-4 text-blue-400 font-bold text-center text-xs leading-4">
                      {transaction.fromUser < transaction.toUser ? '↗' : '↙'}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-slate-200 text-sm">User #{transaction.toUser}</div>
                    <div className="text-xs text-slate-500">
                      From User #{transaction.fromUser}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">
                    + ₹{transaction.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};