'use client';

import React from 'react';

export const TransactionSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
            <div className="flex flex-col gap-2">
              <div className="w-24 h-4 bg-gray-100 rounded-md" />
              <div className="w-16 h-3 bg-gray-50 rounded-md" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-20 h-5 bg-gray-100 rounded-md" />
            <div className="w-12 h-3 bg-gray-50 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};
