'use client';

import React from 'react';
import { CreditCard, Zap, Smartphone, Wifi, Home } from 'lucide-react';

export default function PaymentsPage() {
  const categories = [
    { name: 'Electricity', icon: Zap, color: 'bg-yellow-50 text-yellow-600' },
    { name: 'Mobile', icon: Smartphone, color: 'bg-blue-50 text-blue-600' },
    { name: 'Internet', icon: Wifi, color: 'bg-purple-50 text-purple-600' },
    { name: 'Rent', icon: Home, color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 pt-12 pb-32 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-black text-[#003366]">Payments</h1>
        <p className="text-gray-400 text-sm">Pay your bills & utilities</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat, i) => (
          <button key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 flex flex-col gap-4 items-center group active:scale-95 transition-all shadow-sm">
            <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center shadow-sm`}>
              <cat.icon size={28} />
            </div>
            <span className="font-bold text-[#003366] text-sm uppercase tracking-wider">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 p-8 bg-gradient-to-br from-[#003366] to-[#004488] rounded-[40px] text-white flex flex-col gap-4 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8"></div>
        <CreditCard size={32} className="opacity-40" />
        <div>
          <h3 className="text-lg font-black leading-tight">Automate Your<br/>Monthly Payments</h3>
          <p className="text-white/60 text-xs mt-2 font-medium">Never miss a deadline again with our ADIB Smart-Pay feature.</p>
        </div>
        <button className="bg-[#D4AF37] w-full py-4 rounded-2xl font-black text-sm shadow-lg shadow-black/20 uppercase tracking-widest mt-2 active:scale-[0.98]">
           Setup Now
        </button>
      </div>
    </div>
  );
}
