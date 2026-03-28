import React from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-xl">
      <h1 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-3 mb-4">
        {title}
      </h1>
      <div>{children}</div>
    </div>
  );
}