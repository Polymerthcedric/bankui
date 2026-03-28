'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useBankStore, Currency } from '@/lib/store';
import { Bitcoin, DollarSign, Wallet } from 'lucide-react';

export const BalanceHub = () => {
  const { balances, currentCurrency, setCurrency, userAccountNumber } = useBankStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[180px] w-full bg-[#003366] animate-pulse" />;

  const currencies: { type: Currency; icon: any; label: string }[] = [
    { type: 'KES', icon: Wallet, label: 'Shillings' },
    { type: 'USD', icon: DollarSign, label: 'Dollars' },
    { type: 'BTC', icon: Bitcoin, label: 'Bitcoin' },
  ];

  return (
    <div className="bg-[#003366] pt-8 pb-6 px-6 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
      
      <div className="grid grid-cols-3 gap-3 relative z-10">
        {currencies.map((curr) => {
          const isActive = currentCurrency === curr.type;
          
          return (
            <motion.button
              key={curr.type}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrency(curr.type)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${
                isActive 
                  ? 'bg-white/15 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
                  : 'bg-white/5 border-white/10 opacity-60 hover:opacity-80'
              }`}
            >
              {/* Pulse Animation for Active Card */}
              {isActive && (
                <motion.div
                  layoutId="pulse"
                  className="absolute inset-0 border-2 border-[#D4AF37] rounded-2xl"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              <div className={`p-2 rounded-xl ${isActive ? 'text-[#D4AF37]' : 'text-white/40'}`}>
                <curr.icon size={18} strokeWidth={isActive ? 3 : 2} />
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-0.5">
                  {curr.type}
                </span>
                <span className={`text-sm font-black text-white tracking-tighter ${isActive ? 'scale-110' : ''}`}>
                  {balances[curr.type].toLocaleString(undefined, { 
                    maximumFractionDigits: curr.type === 'BTC' ? 4 : 0 
                  })}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center items-center gap-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Account:</p>
        <p className="font-mono text-[11px] font-bold text-[#D4AF37] tracking-widest">{userAccountNumber}</p>
      </div>
    </div>
  );
};
