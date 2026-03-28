'use client';

import React, { useState } from 'react';
import { TransferScreen } from "@/components/dashboard/TransferScreen";
import { ArrowRightLeft, History, Users } from 'lucide-react';
import { useBankStore } from '@/lib/store';
import { QuickSend } from '@/components/dashboard/QuickSend';

export default function TransfersPage() {
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [prefillAcc, setPrefillAcc] = useState<string | undefined>(undefined);
  const { transactionHistory, currentCurrency } = useBankStore();

  const handleSendClick = (accNum?: string) => {
    setPrefillAcc(accNum);
    setIsTransferOpen(true);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 pt-12 pb-32 flex flex-col gap-8 no-scrollbar">
      <div>
        <h1 className="text-2xl font-black text-[#003366] tracking-tight">Transfers</h1>
        <p className="text-gray-400 text-sm font-medium">Send money globally or locally</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => handleSendClick()}
          className="bg-[#003366] p-7 rounded-[32px] text-white flex flex-col gap-4 items-start group active:scale-95 transition-all shadow-xl shadow-blue-900/20"
        >
          <div className="bg-white/10 p-2.5 rounded-2xl">
             <ArrowRightLeft size={24} />
          </div>
          <span className="font-black text-sm uppercase tracking-wider">New Send</span>
        </button>

        <button className="bg-white p-7 rounded-[32px] text-[#003366] border border-gray-100 flex flex-col gap-4 items-start group active:scale-95 transition-all shadow-sm">
          <div className="bg-blue-50 p-2.5 rounded-2xl">
             <Users size={24} />
          </div>
          <span className="font-black text-sm uppercase tracking-wider">Contacts</span>
        </button>
      </div>

      <QuickSend onSendClick={handleSendClick} />

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-[#003366]">
          <h3 className="font-black text-sm uppercase tracking-[0.2em]">Transfer History</h3>
        </div>
        
        <div className="flex flex-col gap-4">
          {transactionHistory.filter(txn => txn.type === 'debit').length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100 italic">
              No recent transfers found
            </div>
          ) : (
            transactionHistory
              .filter(txn => txn.type === 'debit')
              .map(txn => (
                <div key={txn.id} className="p-5 bg-white rounded-[32px] border border-gray-50 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-[#003366] rounded-2xl flex items-center justify-center font-black">
                        {txn.receiverName[0]}
                      </div>
                      <div>
                        <p className="font-black text-[#003366] text-sm tracking-tight">{txn.receiverName}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(txn.date).toLocaleDateString()}</p>
                      </div>
                   </div>
                   <p className="font-black text-red-500">
                     -{txn.amount} <span className="text-[10px]">{txn.currency}</span>
                   </p>
                </div>
              ))
          )}
        </div>
      </div>

      <TransferScreen 
        isOpen={isTransferOpen} 
        onClose={() => setIsTransferOpen(false)} 
        prefillAcc={prefillAcc}
      />
    </div>
  );
}
