'use client';

import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};
const clientReady = () => true;
const serverNotReady = () => false;

/** False on the server and during hydration. True after the client mounts. */
export function useIsClient() {
  return useSyncExternalStore(noopSubscribe, clientReady, serverNotReady);
}

const subscribeAuth = (onStoreChange: () => void) => {
  window.addEventListener('storage', onStoreChange);
  return () => window.removeEventListener('storage', onStoreChange);
};

const readAuthFlag = () => localStorage.getItem('isLoggedIn') === 'true';
const serverAuthFlag = () => false;

/** Reads the simulated sign-in flag. This is demo state, not authentication. */
export function useIsLoggedIn() {
  return useSyncExternalStore(subscribeAuth, readAuthFlag, serverAuthFlag);
}
