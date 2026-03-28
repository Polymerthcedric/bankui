'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, ShieldCheck, Lock, Smartphone } from 'lucide-react';
import { HapticButton } from '@/components/ui/HapticButton';

export default function LoginPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    setIsScanning(true);
    
    // Simulate FaceID/Fingerprint Scan
    setTimeout(() => {
      setScanComplete(true);
      setTimeout(() => {
        localStorage.setItem('isLoggedIn', 'true');
        router.push('/');
      }, 800);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#003366] flex flex-col items-center justify-between p-10 text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

      {/* Logo Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-[28px] mx-auto flex items-center justify-center shadow-2xl mb-6">
          <ShieldCheck size={40} className="text-[#003366]" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">BankUi</h1>
        <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.4em] mt-1">Secured by ADIB</p>
      </motion.div>

      {/* Welcome Section */}
      <div className="w-full flex flex-col gap-2 text-center">
        <h2 className="text-4xl font-black tracking-tight">Welcome Back,</h2>
        <p className="text-white/60 text-sm font-medium">Log in to your secure account</p>
      </div>

      {/* Biometric Button */}
      <div className="w-full flex flex-col items-center gap-8">
        <HapticButton 
          onClick={handleLogin}
          className="w-24 h-24 bg-white/10 rounded-[32px] flex items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl group hover:bg-white/20 transition-all"
        >
          <Fingerprint size={48} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
        </HapticButton>
        <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Tap to sign in with FaceID</p>
      </div>

      {/* Footer Info */}
      <div className="mb-8 flex flex-col gap-6 w-full max-w-xs">
        <HapticButton className="w-full h-14 bg-white text-[#003366] rounded-[22px] font-black text-sm uppercase tracking-widest shadow-xl">
           Use Access Code
        </HapticButton>
        <div className="flex justify-between px-4">
           <button className="text-[10px] font-bold uppercase tracking-widest text-white/40">Forgot Pin?</button>
           <button className="text-[10px] font-bold uppercase tracking-widest text-white/40">Need Help?</button>
        </div>
      </div>

      {/* Scanning Overlay */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#003366]/95 backdrop-blur-xl z-[200] flex flex-col items-center justify-center gap-12"
          >
            <div className="relative">
              {/* Pulse Rings */}
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 border-4 border-[#D4AF37] rounded-full"
              />
              <motion.div 
                animate={{ scale: [1.2, 1.8, 1.2], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute inset-0 border-4 border-[#D4AF37] rounded-full"
              />
              
              <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center relative border-2 border-white/20">
                <AnimatePresence mode="wait">
                  {scanComplete ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-green-400"
                    >
                      <ShieldCheck size={64} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="scanning"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-[#D4AF37]"
                    >
                      <Fingerprint size={64} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                {scanComplete ? 'Verified' : 'Scanning FaceID...'}
              </h3>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Biometric Authentication</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
