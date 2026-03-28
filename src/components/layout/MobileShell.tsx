import React from 'react';

interface MobileShellProps {
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-[480px] min-h-screen bg-white shadow-2xl relative flex flex-col sm:rounded-3xl sm:my-8 sm:min-h-[850px] overflow-hidden">
        {children}
      </div>
    </div>
  );
};
