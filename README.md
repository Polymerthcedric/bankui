# BankUI

A mobile banking interface prototype built with Next.js and React. It uses sample balances and simulated sign-in and transfer flows. It does not connect to a bank or move money.

## Run locally

```sh
npm install
npm run dev
```

The app opens at [http://localhost:3000](http://localhost:3000).

## Checks

```sh
npm run lint
npm run build
```

Both commands pass on Next.js 16.4.6. `npm audit` reports 0 vulnerabilities with the committed lockfile.

## Demo limits

- The sign-in button sets an `isLoggedIn` value in `localStorage`. The layout reads that value to show the dashboard. This is demo state, not authentication. Any visitor can set the value.
- Balances, account numbers, names, and transaction history are sample data in `src/lib/store.ts`. A transfer changes browser state only. No database, ledger, bank API, or payment provider is involved.
- The FaceID prompt is a timed animation. It does not read a fingerprint or a face.
- The menu labels, account names, and "Platinum Member" text are sample content.
- There is no server-side validation, rate limiting, or audit trail. Do not enter real credentials or real account numbers.

The service worker uses a network-first fetch handler. It serves a cached shell only when the network fails. It removes old caches on activation. This avoids serving stale JavaScript after a deploy.
