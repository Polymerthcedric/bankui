'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ArrowRightLeft, CreditCard, Menu as MenuIcon } from 'lucide-react';

export const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Transfers', icon: ArrowRightLeft, href: '/transfers' },
    { name: 'Payments', icon: CreditCard, href: '/payments' },
    { name: 'Menu', icon: MenuIcon, href: '/menu' },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-[480px] bg-[#003366] text-white flex justify-around items-center py-4 rounded-t-2xl shadow-lg sm:absolute z-[100]">
      {navItems.map(({ name, icon: Icon, href }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={name}
            href={href}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              isActive ? 'text-[#FFD700] scale-110' : 'text-gray-400 opacity-70 hover:opacity-100'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] font-bold uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-0'}`}>
              {name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
