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
      <div className="w-full max-w-md mx-auto rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 text-center text-gray-500">
          No P2P transactions were made
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4">
        <div className="max-h-[400px] overflow-y-auto pr-2">
          <div className="space-y-4">
            {P2P.map((transaction, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <div className="h-4 w-4 text-blue-600">
                        {transaction.fromUser < transaction.toUser ? '↗' : '↙'}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">User #{transaction.toUser}</div>
                      <div className="text-sm text-gray-500">
                        From User #{transaction.fromUser}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      + ₹{transaction.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(transaction.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};