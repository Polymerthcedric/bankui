import { create } from 'zustand';

export type Currency = 'KES' | 'USD' | 'BTC';

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  receiver: string;
  receiverName: string;
  date: string;
  type: 'debit' | 'credit';
  status: 'completed' | 'pending';
}

interface Account {
  accountNumber: string;
  name: string;
  balance: number;
}

interface BankStore {
  // Current User State
  balances: Record<Currency, number>;
  currentCurrency: Currency;
  userAccountNumber: string;
  userName: string;
  transactionHistory: Transaction[];
  
  // Simulated "Database" of other accounts
  otherAccounts: Account[];
  
  // Actions
  findAccount: (accNum: string) => Account | undefined;
  executeTransfer: (amount: number, receiverAccNum: string, currency?: Currency) => { success: boolean; message: string };
  setCurrency: (currency: Currency) => void;
}

// Mock Exchange Rates (Reference: 1 BTC = 9,500,000 KES, 1 USD = 130 KES)
export const EXCHANGE_RATES = {
  USD_TO_KES: 130,
  BTC_TO_KES: 9500000,
};

export const useBankStore = create<BankStore>((set, get) => ({
  userName: 'Fidel Cedric Odoyo',
  balances: {
    KES: 750000.00, // Kenyan Shilling balance
    USD: 5769.23,   // ~750,000 KES
    BTC: 0.0789,    // ~750,000 KES
  },
  currentCurrency: 'KES',
  userAccountNumber: '011224466880',
  transactionHistory: [
    {
      id: 'MPESA-TXN-42A9',
      amount: 4500.00,
      currency: 'KES',
      receiver: '254712345678',
      receiverName: 'Lipa Na M-PESA - Galana',
      date: new Date().toISOString(),
      type: 'debit',
      status: 'completed',
    },
    {
      id: 'PESALINK-TXN-11B2',
      amount: 12500.00,
      currency: 'KES',
      receiver: '011088882222',
      receiverName: 'PesaLink - James Maina',
      date: new Date().toISOString(),
      type: 'debit',
      status: 'completed',
    },
    {
      id: 'KPLC-TOKEN-77X3',
      amount: 2000.00,
      currency: 'KES',
      receiver: '42233110099',
      receiverName: 'KPLC Prepaid Token',
      date: new Date().toISOString(),
      type: 'debit',
      status: 'completed',
    },
  ],
  
  // Simulated receiver database (Kenyan context)
  otherAccounts: [
    { accountNumber: '254712345678', name: 'Zaid - M-Pesa Wallet', balance: 1200 },
    { accountNumber: '011088882222', name: 'James Maina - NCBA', balance: 4500 },
    { accountNumber: '011099991111', name: 'Maryam Rashid - Equity', balance: 10000 },
    { accountNumber: 'bc1qtestaddressforbitcoinwallet', name: 'Binance Wallet', balance: 0.5 },
  ],

  findAccount: (accNum) => {
    return get().otherAccounts.find(acc => acc.accountNumber === accNum);
  },

  executeTransfer: (amount, receiverAccNum, currency) => {
    const state = get();
    const activeCurrency = currency || state.currentCurrency;
    const receiver = state.findAccount(receiverAccNum);
    const parsedAmount = Number(amount);

    // Skip receiver validation for BTC if it looks like a wallet address
    const isCrypto = activeCurrency === 'BTC' && receiverAccNum.startsWith('bc1');
    
    if (!receiver && !isCrypto) {
      return { success: false, message: 'Invalid Account Number' };
    }

    if (parsedAmount > state.balances[activeCurrency]) {
      return { success: false, message: `Insufficient ${activeCurrency} Balance` };
    }

    const prefix = activeCurrency === 'BTC' ? 'CRYPTO' : (receiverAccNum.startsWith('254') ? 'MPESA' : 'PESALINK');
    const txnId = `${prefix}-TXN-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    const newTransaction: Transaction = {
      id: txnId,
      amount: parsedAmount,
      currency: activeCurrency,
      receiver: receiverAccNum,
      receiverName: isCrypto ? 'External BTC Wallet' : (receiver?.name || 'Unknown'),
      date: new Date().toISOString(),
      type: 'debit',
      status: 'completed',
    };

    set((state) => {
      const newBalances = {
        ...state.balances,
        [activeCurrency]: state.balances[activeCurrency] - parsedAmount,
      };
      
      return {
        balances: newBalances,
        transactionHistory: [newTransaction, ...state.transactionHistory],
      };
    });

    console.log(`New ${activeCurrency} Balance:`, get().balances[activeCurrency]);

    return { success: true, message: `Transfer Successful. ID: ${txnId}` };
  },

  setCurrency: (currency) => set({ currentCurrency: currency }),
}));
