'use client';

import React from 'react';
import { useBankStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export const QuickSend = ({ onSendClick }: { onSendClick: (accNum?: string) => void }) => {
  const { otherAccounts } = useBankStore();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center px-2">
        <h3 className="font-black text-[#003366] text-xs uppercase tracking-[0.15em]">Quick Send</h3>
        <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Manage</button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-2">
        <button 
          onClick={() => onSendClick()}
          className="flex flex-col items-center gap-2 group shrink-0"
        >
          <div className="w-16 h-16 bg-white border-2 border-dashed border-gray-200 rounded-[24px] flex items-center justify-center text-gray-400 group-hover:border-[#003366] group-hover:text-[#003366] transition-all group-active:scale-90">
            <Plus size={24} />
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">New</span>
        </button>

        {otherAccounts.map((acc, i) => (
          <motion.button
            key={acc.accountNumber}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSendClick(acc.accountNumber)}
            className="flex flex-col items-center gap-2 group shrink-0"
          >
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-[24px] border border-blue-100 flex items-center justify-center text-[#003366] font-black text-xl shadow-sm group-hover:shadow-md transition-all group-active:scale-90">
                {acc.name[0]}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-50">
                <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
            <span className="text-[10px] font-black text-[#003366] tracking-tight truncate w-16 text-center">
              {acc.name.split(' ')[0]}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
