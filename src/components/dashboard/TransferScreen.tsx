'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Search, Bitcoin, DollarSign, Wallet } from 'lucide-react';
import { useBankStore, Currency } from '@/lib/store';

export const TransferScreen = ({ isOpen, onClose, prefillAcc }: { isOpen: boolean; onClose: () => void; prefillAcc?: string }) => {
  const { findAccount, executeTransfer, currentCurrency } = useBankStore();
  
  const [step, setStep] = useState<'details' | 'confirm' | 'result'>('details');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currentCurrency);
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState<{ name: string; accountNumber: string } | null>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const isBTC = selectedCurrency === 'BTC';
  const isUSD = selectedCurrency === 'USD';
  const accentColor = isBTC ? '#F7931A' : (isUSD ? '#003366' : '#D4AF37');
  const accentShadow = isBTC ? 'shadow-orange-200' : (isUSD ? 'shadow-blue-200' : 'shadow-gold/20');

  useEffect(() => {
    if (isOpen) {
      setSelectedCurrency(currentCurrency);
      if (prefillAcc) setAccountNumber(prefillAcc);
    }
  }, [isOpen, currentCurrency, prefillAcc]);

  useEffect(() => {
    if (!accountNumber) {
      setReceiver(null);
      setError('');
      return;
    }

    if (isBTC) {
      if (accountNumber.startsWith('bc1') && accountNumber.length >= 26) {
        setReceiver({ name: 'External BTC Wallet', accountNumber });
        setError('');
      } else {
        setReceiver(null);
        setError('Invalid BTC address');
      }
    } else {
      if (accountNumber.length >= 8) {
        const found = findAccount(accountNumber);
        if (found) {
          setReceiver(found);
          setError('');
        } else if (accountNumber.length >= 12) {
          setError('Account not found');
          setReceiver(null);
        } else {
          setReceiver(null);
          setError('');
        }
      } else {
        setReceiver(null);
        setError('');
      }
    }
  }, [accountNumber, selectedCurrency, isBTC, findAccount]);

  const handleTransfer = () => {
    if ((!receiver && !isBTC) || !amount || isNaN(Number(amount))) return;
    const result = executeTransfer(Number(amount), accountNumber, selectedCurrency);
    setStatus(result);
    setStep('result');
  };

  const reset = () => {
    setStep('details');
    setAccountNumber('');
    setAmount('');
    setReceiver(null);
    setError('');
    setStatus(null);
    onClose();
  };

  const currencies: { val: Currency; label: string; icon: any }[] = [
    { val: 'KES', label: 'Shillings', icon: Wallet },
    { val: 'USD', label: 'US Dollars', icon: DollarSign },
    { val: 'BTC', label: 'Bitcoin', icon: Bitcoin },
  ];

  const inputClasses = `w-full h-16 bg-slate-50 text-slate-900 border-2 rounded-3xl px-6 font-bold text-xl placeholder-slate-400 focus:ring-4 focus:ring-opacity-10 transition-all outline-none shadow-inner`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={reset}
            className="absolute inset-0 bg-black/60 z-[110] backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[48px] z-[120] p-8 pt-6 ${step === 'result' ? 'h-full' : 'min-h-[80%]'} shadow-2xl flex flex-col transition-all duration-500`}
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
            
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-[#003366] tracking-tight">
                {step === 'result' ? '' : 'New Transaction'}
              </h2>
              <button onClick={reset} className="p-3 bg-gray-100 rounded-[20px] text-gray-500 hover:bg-gray-200 transition-colors"><X size={24} /></button>
            </div>

            {step === 'details' && (
              <div className="flex flex-col gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-4 block ml-1">
                    Select Asset
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {currencies.map((curr) => (
                      <button
                        key={curr.val}
                        onClick={() => {
                          setSelectedCurrency(curr.val);
                          setAccountNumber('');
                          setReceiver(null);
                        }}
                        className={`flex flex-col items-center gap-2 p-5 rounded-[28px] border-2 transition-all active:scale-95 ${
                          selectedCurrency === curr.val 
                            ? (curr.val === 'BTC' ? 'border-[#F7931A] bg-[#F7931A]/10 text-[#F7931A]' : 'border-[#003366] bg-[#003366]/10 text-[#003366]')
                            : 'border-gray-50 bg-gray-50 text-gray-300'
                        }`}
                      >
                        <curr.icon size={24} strokeWidth={selectedCurrency === curr.val ? 2.5 : 2} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{curr.val}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-3 block ml-1">
                    {isBTC ? 'Wallet Address' : 'Account Number'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={isBTC ? 42 : 12}
                      placeholder={isBTC ? 'bc1q...' : 'Enter Account/M-Pesa'}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className={inputClasses}
                      style={{ borderColor: accentColor }}
                    />
                    <div className={`absolute right-6 top-1/2 -translate-y-1/2`} style={{ color: accentColor }}>
                      {isBTC ? <Bitcoin size={24} /> : <Search size={24} />}
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-2 px-2 flex items-center gap-1.5"><AlertCircle size={14}/>{error}</p>}
                </div>

                {receiver && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="p-5 bg-green-50 rounded-[32px] border-2 border-green-100 flex items-center gap-4 shadow-sm"
                  >
                    <div className="w-14 h-14 bg-green-600 rounded-[20px] flex items-center justify-center text-white font-black text-2xl shadow-lg">
                      {receiver.name[0]}
                    </div>
                    <div>
                      <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Confirmed Identity</p>
                      <p className="font-black text-[#003366] text-lg tracking-tight truncate max-w-[180px]">{receiver.name}</p>
                    </div>
                  </motion.div>
                )}

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-3 block ml-1">
                    Amount to Send
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={inputClasses}
                      style={{ borderColor: accentColor }}
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 font-black opacity-20 text-xl uppercase italic" style={{ color: accentColor }}>
                      {selectedCurrency}
                    </div>
                  </div>
                </div>

                <button
                  disabled={!receiver || !amount || Number(amount) <= 0}
                  onClick={() => setStep('confirm')}
                  className={`w-full h-18 text-white rounded-[28px] font-black text-xl mt-4 shadow-2xl active:scale-95 transition-all disabled:opacity-30 disabled:grayscale py-5 ${accentShadow}`}
                  style={{ backgroundColor: accentColor }}
                >
                  Authorize Transfer
                </button>
              </div>
            )}

            {step === 'confirm' && (
              <div className="flex flex-col gap-10 text-center pt-8">
                <div className="flex flex-col gap-4">
                  <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Confirming Payment</p>
                  <h3 className={`text-6xl font-black tracking-tighter`} style={{ color: accentColor }}>
                    {Number(amount).toFixed(isBTC ? 4 : 2)} <span className="text-2xl ml-1">{selectedCurrency}</span>
                  </h3>
                </div>
                
                <div className="bg-slate-50 p-8 rounded-[44px] flex flex-col gap-8 border-2 border-slate-100 relative">
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-200 -translate-y-1/2 border-dashed border-t"></div>
                  <div className="flex justify-between items-center z-10">
                    <span className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Recipient</span>
                    <span className="font-black text-[#003366] text-lg">{receiver?.name}</span>
                  </div>
                  <div className="flex justify-between items-center z-10">
                    <span className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Method</span>
                    <span className="font-mono text-[#003366] text-xs font-bold truncate ml-8 bg-white px-4 py-2 rounded-2xl border border-slate-200">{isBTC ? 'Blockchain' : 'Internal Transfer'}</span>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                   <button
                    onClick={() => setStep('details')}
                    className="flex-1 h-18 bg-slate-100 text-slate-500 rounded-[28px] font-black text-lg py-5"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleTransfer}
                    className={`flex-[2] h-18 text-white rounded-[28px] font-black text-xl shadow-2xl py-5 ${accentShadow}`}
                    style={{ backgroundColor: isBTC ? '#F7931A' : '#D4AF37' }}
                  >
                    Confirm & Send
                  </button>
                </div>
              </div>
            )}

            {step === 'result' && (
              <div className="flex flex-col items-center justify-center flex-1 gap-10 text-center px-4">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 8, stiffness: 100 }}
                  className={`w-36 h-36 rounded-[54px] flex items-center justify-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] ${status?.success ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    {status?.success ? <CheckCircle2 size={80} strokeWidth={2.5} /> : <AlertCircle size={80} strokeWidth={2.5} />}
                  </motion.div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col gap-4"
                >
                  <h3 className="text-5xl font-black text-[#003366] tracking-tighter">
                    {status?.success ? 'Transfer Sent!' : 'Transfer Failed'}
                  </h3>
                  <p className="text-gray-400 font-bold px-10 leading-relaxed uppercase tracking-widest text-[10px]">{status?.message}</p>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  onClick={reset}
                  className="w-full h-18 bg-[#003366] text-white rounded-[28px] font-black text-xl shadow-2xl shadow-blue-900/40 mt-6 py-5 active:scale-95 transition-all"
                >
                  Finish
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
