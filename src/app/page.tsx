'use client';

import React, { useState } from 'react';
import { Dashboard } from "@/components/dashboard/Dashboard";
import { TransferScreen } from "@/components/dashboard/TransferScreen";

export default function Home() {
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [prefillAcc, setPrefillAcc] = useState<string | undefined>(undefined);
  const [transferSessionKey, setTransferSessionKey] = useState(0);

  const handleSendClick = (accNum?: string) => {
    setPrefillAcc(accNum);
    setTransferSessionKey((count) => count + 1);
    setIsTransferOpen(true);
  };

  return (
    <>
      <Dashboard onSendClick={handleSendClick} />
      <TransferScreen 
        key={transferSessionKey}
        isOpen={isTransferOpen} 
        onClose={() => setIsTransferOpen(false)} 
        prefillAcc={prefillAcc}
      />
    </>
  );
}
