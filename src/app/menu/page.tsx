'use client';

import React, { useState } from 'react';
import { User, Bell, Settings, Shield, LogOut, ChevronRight, HelpCircle, Copy, CheckCircle2, Info } from 'lucide-react';
import { useBankStore } from '@/lib/store';
import { HapticButton } from '@/components/ui/HapticButton';

export default function MenuPage() {
  const { userName, otherAccounts } = useBankStore();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const menuItems = [
    { name: 'Personal Information', icon: User },
    { name: 'Security & Privacy', icon: Shield },
    { name: 'Notifications', icon: Bell },
    { name: 'General Settings', icon: Settings },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 pt-12 pb-32 flex flex-col gap-8 no-scrollbar">
      {/* Profile Header */}
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-gradient-to-tr from-[#003366] to-[#0055aa] rounded-[28px] flex items-center justify-center text-white font-black text-4xl shadow-xl border-4 border-white">
          {userName[0]}
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#003366] tracking-tight">{userName}</h1>
          <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em]">Platinum Member</p>
        </div>
      </div>

      {/* Demo Credentials Hub (FOR DEMONSTRATIONS) */}
      <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Info size={48} />
        </div>
        <h3 className="text-[#D4AF37] text-xs font-black uppercase tracking-[0.2em] mb-4">Demo Accounts Hub</h3>
        <p className="text-white/50 text-[10px] mb-6 leading-relaxed">Use these numbers in the "Send" screen to demonstrate real-time account verification and balance updates.</p>
        
        <div className="flex flex-col gap-3">
          {otherAccounts.map((acc, i) => (
            <div key={i} className="bg-white/5 rounded-2xl p-4 flex justify-between items-center border border-white/10 group">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest">{acc.name.split(' - ')[1] || 'M-Pesa'}</span>
                <span className="font-mono text-sm font-bold">{acc.accountNumber}</span>
                <span className="text-[10px] text-white/40">{acc.name.split(' - ')[0]}</span>
              </div>
              <HapticButton 
                onClick={() => handleCopy(acc.accountNumber, i)}
                className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
              >
                {copiedIndex === i ? <CheckCircle2 size={16} className="text-green-400" /> : <Copy size={16} className="text-white/60" />}
              </HapticButton>
            </div>
          ))}
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex flex-col gap-2">
        {menuItems.map((item, i) => (
          <HapticButton 
            key={i} 
            className="w-full flex items-center justify-between p-5 bg-white rounded-[28px] border border-gray-100 shadow-sm transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-2.5 rounded-xl text-[#003366]">
                <item.icon size={20} />
              </div>
              <span className="font-bold text-[#003366] tracking-tight">{item.name}</span>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#003366] transition-colors" />
          </HapticButton>
        ))}
      </div>

      <HapticButton 
        onClick={() => {
          localStorage.removeItem('isLoggedIn');
          window.location.href = '/login';
        }}
        className="w-full flex items-center justify-center gap-4 p-6 bg-red-50 rounded-[28px] text-red-600 font-black uppercase tracking-widest text-xs shadow-sm"
      >
        <LogOut size={20} />
        <span>Log Out Account</span>
      </HapticButton>

      <div className="text-center mt-4">
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.4em]">BankUi v2.1.0 • KENYAN EDITION</p>
      </div>
    </div>
  );
}
