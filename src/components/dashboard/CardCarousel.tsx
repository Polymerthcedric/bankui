'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useBankStore, Currency } from '@/lib/store';
import { ShieldCheck, Bitcoin, DollarSign, Wallet } from 'lucide-react';
import { BalanceCountUp } from './BalanceCountUp';

const CARD_WIDTH = 320;
const CARD_GAP = 20;

export const CardCarousel = () => {
  const { balances, currentCurrency, setCurrency, userAccountNumber } = useBankStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currencies: Currency[] = ['KES', 'USD', 'BTC'];
  const activeIndex = currencies.indexOf(currentCurrency);

  const currencyInfo = {
    KES: { label: 'Kenyan Shilling', icon: Wallet, color: 'from-[#FFD700] via-[#D4AF37] to-[#B8860B]', accent: '#D4AF37' },
    USD: { label: 'US Dollar', icon: DollarSign, color: 'from-[#003366] via-[#004488] to-[#0055aa]', accent: '#003366' },
    BTC: { label: 'Bitcoin', icon: Bitcoin, color: 'from-[#F7931A] via-[#E87E04] to-[#D35400]', accent: '#F7931A' },
  };

  const x = useMotionValue(0);
  const dragX = useSpring(x, { stiffness: 300, damping: 30 });

  const handleDragEnd = (event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -100 || velocity < -500) {
      if (activeIndex < currencies.length - 1) {
        setCurrency(currencies[activeIndex + 1]);
      }
    } else if (offset > 100 || velocity > 500) {
      if (activeIndex > 0) {
        setCurrency(currencies[activeIndex - 1]);
      }
    }
  };

  return (
    <div className="relative w-full h-[280px] flex flex-col items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-full flex items-center justify-center overflow-visible">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          style={{ x }}
          className="flex items-center justify-center cursor-grab active:cursor-grabbing px-12"
        >
          {currencies.map((curr, i) => {
            const isActive = i === activeIndex;
            const distance = Math.abs(i - activeIndex);
            
            return (
              <motion.div
                key={curr}
                animate={{
                  scale: isActive ? 1 : 0.85,
                  x: (i - activeIndex) * (CARD_WIDTH + CARD_GAP),
                  opacity: isActive ? 1 : 0.4,
                  zIndex: isActive ? 10 : 0,
                  rotateY: (i - activeIndex) * 15,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                whileTap={{ scale: 0.95 }}
                className={`absolute w-[320px] h-[200px] bg-gradient-to-br ${currencyInfo[curr].color} p-8 rounded-[40px] shadow-2xl flex flex-col gap-8 text-white border-4 ${isActive ? 'border-white/20' : 'border-transparent'} relative overflow-hidden`}
              >
                {/* Glassmorphism Overlays */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                
                <div className="flex justify-between items-start z-10">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-80 mb-1">
                      {currencyInfo[curr].label}
                    </p>
                    <BalanceCountUp value={balances[curr]} currency={curr} />
                  </div>
                  <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-xl border border-white/20 shadow-inner">
                    {curr === 'BTC' ? <Bitcoin size={20} /> : <p className="text-[10px] font-black tracking-widest italic uppercase">{curr}</p>}
                  </div>
                </div>
                
                <div className="flex justify-between items-end z-10 mt-auto">
                  <div className="flex flex-col gap-1">
                    <p className="font-mono text-sm tracking-[0.2em] opacity-90 text-white/80">
                      {curr === 'BTC' ? 'BC1Q ' : '•••• •••• '} {userAccountNumber.slice(-4)}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-white/80" />
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Secured Account</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</p>
                     <p className="text-xs font-black">ACTIVE</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      
      {/* Pagination Dots */}
      <div className="mt-8 flex gap-2">
        {currencies.map((_, i) => (
          <motion.div 
            key={i} 
            animate={{
              width: i === activeIndex ? 24 : 6,
              backgroundColor: i === activeIndex ? currencyInfo[currencies[i]].accent : '#E2E8F0'
            }}
            className="h-1.5 rounded-full transition-all duration-300"
          />
        ))}
      </div>
    </div>
  );
};
