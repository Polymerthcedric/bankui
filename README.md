# BankUi — ADIB-Inspired Banking Demo (Kenyan Edition)

A high-fidelity, mobile-first Kenyan banking application demo built with **Next.js 16** and **React 19**. Features a full biometric login, multi-currency balance hub (KES/USD/BTC), animated transfers with M-Pesa/PesaLink simulation, and a sleek ADIB-inspired gold theme.

## Features

- **FaceID Biometric Login** — Tap-to-scan animation with pulsing rings and session persistence
- **Multi-Currency Balance Hub** — Collapsible 3-column grid (KES, USD, BTC) with pulsing gold border on active currency
- **Swipeable Card Carousel** — Drag-to-swipe virtual bank cards with masked account numbers
- **Send Money Flow** — 3-step bottom sheet (details → confirm → result) with real-time account validation
- **Dynamic Theming** — UI accents shift between ADIB Gold (#D4AF37) and Bitcoin Orange (#F7931A) based on selected currency
- **Bill Pay Dashboard** — Electricity, Mobile, Internet, Rent categories (visual demo)
- **Demo Accounts Hub** — Pre-populated mock accounts with copy-to-clipboard
- **PWA Support** — Offline caching via service worker, add-to-home-screen
- **Page Transitions** — Smooth horizontal slide animations via Framer Motion `AnimatePresence`
- **Persistent State** — All balances and transactions stored in Zustand + localStorage

## Tech Stack

| | |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **UI** | React 19, Tailwind CSS v4, Framer Motion |
| **State** | Zustand v5 |
| **Icons** | Lucide React |
| **Fonts** | Geist (via next/font) |
| **PWA** | Service Worker + Web App Manifest |

## Getting Started

```bash
npm install
npm run dev       # → http://localhost:3000
```

No backend, database, or environment variables required — all data is mocked in-browser.

### Login

Tap the fingerprint icon on the login screen to simulate FaceID authentication. Session persists in `localStorage`.

### Demo Accounts

| Name | Account | Type |
|------|---------|------|
| Zaid | 254712345678 | M-Pesa Wallet |
| James Maina | 011088882222 | NCBA Bank |
| Maryam Rashid | 011099991111 | Equity Bank |
| BTC Wallet | bc1qtest... | Bitcoin |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (auth guard, BalanceHub, BottomNav, SW)
│   ├── page.tsx            # Dashboard (quick actions, recent activity)
│   ├── login/page.tsx      # Biometric FaceID login
│   ├── menu/page.tsx       # Profile, demo accounts, logout
│   ├── payments/page.tsx   # Bill pay categories
│   └── transfers/page.tsx  # Send money + transfer history
├── components/
│   ├── dashboard/
│   │   ├── BalanceHub.tsx       # Multi-currency header
│   │   ├── BalanceCountUp.tsx   # Animated number counter
│   │   ├── CardCarousel.tsx     # Swipeable card carousel
│   │   ├── Dashboard.tsx        # Home screen
│   │   ├── QuickSend.tsx        # Quick contact row
│   │   ├── TransferScreen.tsx   # Multi-step transfer sheet
│   │   └── TransactionSkeleton.tsx
│   ├── layout/
│   │   ├── BottomNav.tsx        # 4-tab bottom navigation
│   │   └── MobileShell.tsx      # Phone mockup wrapper
│   └── ui/
│       └── HapticButton.tsx     # Press-feedback button
└── lib/
    └── store.ts             # Zustand store (balances, transactions, accounts)
```

## Build & Deploy

```bash
npm run build
npm start
```

Designed as a portfolio/demo project — not intended for production use.

## License

MIT
