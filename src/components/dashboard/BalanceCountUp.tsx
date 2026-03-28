'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export const BalanceCountUp = ({ value, currency }: { value: number; currency: string }) => {
  const [mounted, setMounted] = useState(false);
  const isBTC = currency === 'BTC';
  
  const springValue = useSpring(0, {
    stiffness: 40,
    damping: 15,
    restDelta: 0.0001,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      springValue.set(value);
    }
  }, [value, springValue, mounted]);

  const displayValue = useTransform(springValue, (latest) => {
    return latest.toLocaleString(undefined, {
      minimumFractionDigits: isBTC ? 6 : 2,
      maximumFractionDigits: isBTC ? 6 : 2,
    });
  });

  if (!mounted) {
    return (
      <div className="text-4xl font-black tracking-tighter flex items-baseline opacity-0">
        <span className="text-xl font-medium mr-1">{currency}</span>
        <span>0.00</span>
      </div>
    );
  }

  return (
    <div className="text-4xl font-black tracking-tighter flex items-baseline">
      <span className="text-xl font-medium mr-1 opacity-90">{currency}</span>
      <motion.span>{displayValue}</motion.span>
    </div>
  );
};
