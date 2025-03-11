"use client"
import React from 'react';
import Link from 'next/link';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, title }) => {
  return (
    <Link href={href} className="flex flex-col items-center mx-4 text-slate-700 hover:text-slate-900">
      <div className="mb-1">{icon}</div>
      <span className="text-xs">{title}</span>
    </Link>
  );
};

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-1/2 transform -translate-x-1/2 z-10 bg-white shadow-md rounded-b-lg px-6 py-3">
      <div className="flex items-center justify-center">
        <NavItem href="/dashboard" icon={<HomeIcon />} title="Home" />
        <NavItem href="/transfer" icon={<TransferIcon />} title="Transfer" />
        <NavItem href="/transactions" icon={<TransactionsIcon />} title="Transactions" />
        <NavItem href="/p2p" icon={<P2PTransactionIcon />} title="P2P" />
      </div>
    </nav>
  );
};

export default Navbar;

// Icons Fetched from https://heroicons.com/
function HomeIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
}

function TransferIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
}

function TransactionsIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
}

function P2PTransactionIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
  </svg>
}