'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBankStore, EXCHANGE_RATES } from '@/lib/store';
import { Send, Plus, PieChart, TrendingUp, Smartphone, QrCode, CreditCard, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuickSend } from './QuickSend';
import { TransactionSkeleton } from './TransactionSkeleton';
import { HapticButton } from '@/components/ui/HapticButton';

export const Dashboard = ({ onSendClick }: { onSendClick: (accNum?: string) => void }) => {
  const { currentCurrency, userName, transactionHistory } = useBankStore();
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isBTC = currentCurrency === 'BTC';
  const isUSD = currentCurrency === 'USD';
  
  const accentBg = isBTC ? 'bg-orange-50 text-[#F7931A]' : (isUSD ? 'bg-blue-50 text-[#003366]' : 'bg-gold/10 text-[#D4AF37]');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLoading(false);
    }, 1500);
  };

  const quickActions = [
    { label: isBTC ? 'Send BTC' : 'To M-Pesa', icon: Smartphone, color: accentBg, action: () => onSendClick() },
    { label: 'Pay Bill', icon: CreditCard, color: 'bg-blue-50 text-blue-600' },
    { label: 'Buy Airtime', icon: Plus, color: 'bg-orange-50 text-orange-600' },
    { label: 'Scan QR', icon: QrCode, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-6 pt-6 pb-32 flex flex-col gap-8 no-scrollbar relative"
    >
      {/* Pull to Refresh Indicator */}
      <motion.div 
        style={{ top: isRefreshing ? 20 : -40 }}
        className="absolute left-0 right-0 flex justify-center z-50 transition-all"
      >
        <div className="bg-white shadow-lg rounded-full p-2 border border-gray-100">
          <RefreshCw size={20} className={`text-[#003366] ${isRefreshing ? 'animate-spin' : ''}`} />
        </div>
      </motion.div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Habari,</h2>
          <h1 className="text-2xl font-black text-[#003366] tracking-tight">{userName.split(' ')[0]}</h1>
        </motion.div>
        <HapticButton onClick={handleRefresh}>
          <div className="relative">
            <div className={`w-12 h-12 rounded-[20px] flex items-center justify-center text-white font-black text-xl shadow-lg transition-colors ${isBTC ? 'bg-[#F7931A]' : 'bg-[#003366]'}`}>
              {userName[0]}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
          </div>
        </HapticButton>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-4 gap-4 px-2">
        {quickActions.map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <HapticButton 
              onClick={item.action}
              className="flex flex-col items-center gap-2 group w-full"
            >
              <div className={`w-14 h-14 ${item.color} rounded-[22px] flex items-center justify-center shadow-sm group-active:scale-90 transition-all border border-transparent group-hover:border-current/10`}>
                <item.icon size={24} />
              </div>
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">{item.label}</span>
            </HapticButton>
          </motion.div>
        ))}
      </div>

      {/* Quick Send Row */}
      <QuickSend onSendClick={onSendClick} />

      {/* Activity List */}
      <div className="flex flex-col gap-6 px-1">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-[#003366] text-sm uppercase tracking-[0.2em]">Recent Activity</h3>
          <button className="text-[#D4AF37] text-xs font-black uppercase tracking-widest">History</button>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TransactionSkeleton />
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
              {transactionHistory.filter(txn => txn.currency === currentCurrency).length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-xs font-bold uppercase tracking-widest bg-white rounded-[32px] border border-dashed border-gray-200">
                  No activity for {currentCurrency}
                </div>
              ) : (
                transactionHistory
                  .filter(txn => txn.currency === currentCurrency)
                  .map((txn) => (
                    <motion.div
                      layout
                      key={txn.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-5 bg-white rounded-[32px] border border-gray-50 hover:shadow-xl transition-all active:scale-[0.98] group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform ${
                            txn.type === 'debit' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                          }`}
                        >
                          {txn.type === 'debit' ? <Send size={20} className="rotate-[-45deg]" /> : <Plus size={20} />}
                        </div>
                        <div className="flex flex-col">
                          <p className="font-black text-[#003366] text-sm tracking-tight group-hover:text-blue-600 transition-colors">
                            {txn.receiverName}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {new Date(txn.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })} • {txn.id.split('-').pop()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-base ${txn.type === 'debit' ? 'text-red-500' : 'text-green-500'}`}>
                          {txn.type === 'debit' ? '-' : '+'}
                          <span className="text-[10px] mr-0.5 font-bold uppercase">{txn.currency}</span>
                          {txn.amount.toLocaleString(undefined, { minimumFractionDigits: isBTC ? 4 : 0 })}
                        </p>
                        <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em]">{txn.status}</p>
                      </div>
                    </motion.div>
                  ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
