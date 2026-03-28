# BankUi Project Context (Kenyan Edition)

## Vision
A high-fidelity Kenyan mobile banking application inspired by the ADIB aesthetic but localized for the Kenyan market. Features seamless M-Pesa integration, biometric authentication, and native-feeling interactions.

## Technical Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Framer Motion (Haptic Buttons, Pull-to-Refresh, FaceID Simulation, Balance Pulse)
- **State Management:** Zustand (Localized for KES and Kenyan transaction types)
- **Authentication:** Mock Biometric System with session persistence in `localStorage`.
- **Icons:** Lucide-React

## Core Logic & Rules
- **Hydration Guard:** Balance displays use a `mounted` state to prevent SSR flickering.
- **Balance Hub:** A persistent 3-column grid (KES, USD, BTC) at the top of the app. Clicking a currency card sets it as 'Active' for all transactions.
- **Active Currency Pulse:** The active currency in the Hub features a pulsing border and increased contrast.
- **Dynamic Themes:** UI accents (borders, shadows, buttons) automatically shift between ADIB Gold (#D4AF37) and Bitcoin Orange (#F7931A) based on the Hub's selection.
- **Page Transitions:** All navigation uses horizontal slide transitions via `AnimatePresence`.
- **Kenyan Defaults:**
  - User: "Fidel Cedric Odoyo"
  - Account: "011224466880"
  - Key Transactions: Lipa Na M-PESA, PesaLink, KPLC Token.

## Key Files
- `src/components/dashboard/BalanceHub.tsx`: Persistent multi-currency grid.
- `src/app/layout.tsx`: Root layout hosting the global `BalanceHub`.
- `src/components/dashboard/Dashboard.tsx`: Home screen with Pull-to-Refresh and Quick Actions.
- `src/app/login/page.tsx`: Premium biometric login screen.
