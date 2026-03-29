"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, title, isActive }) => {
  return (
    <Link href={href} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${isActive ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'}`}>
      <div>{icon}</div>
      <span className="text-[10px] font-medium">{title}</span>
    </Link>
  );
};

const Navbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl shadow-black/40 rounded-full px-3 py-2 flex gap-1">
      <NavItem href="/dashboard" icon={<HomeIcon />} title="Home" isActive={pathname === '/dashboard'} />
      <NavItem href="/transfer" icon={<TransferIcon />} title="Transfer" isActive={pathname === '/transfer'} />
      <NavItem href="/transactions" icon={<TransactionsIcon />} title="History" isActive={pathname === '/transactions'} />
      <NavItem href="/p2p" icon={<P2PTransactionIcon />} title="P2P" isActive={pathname === '/p2p'} />
      <NavItem href="/merchant" icon={<StoreIcon />} title="Merchant" isActive={pathname === '/merchant'} />
    </nav>
  );
};

export default Navbar;

// Icons Fetched from https://heroicons.com/
function HomeIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
}

function TransferIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
}

function TransactionsIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
}

function P2PTransactionIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
  </svg>
}

function StoreIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a2.25 2.25 0 0 0-4.5 0V21m12-10.5V21h-3v-7.5a2.25 2.25 0 0 0-4.5 0V21H3v-10.5m18 0-9-5.25-9 5.25m18 0c0 .414-.336.75-.75.75H3.75c-.414 0-.75-.336-.75-.75" />
  </svg>
}