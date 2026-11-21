import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');

function loadWorker(fetchImpl) {
  const listeners = {};
  const stores = new Map();
  const state = { skipped: false, claimed: false };
  const keyOf = (request) => {
    const raw = typeof request === 'string' ? request : request.url;
    return new URL(raw, 'https://bankui.test').pathname;
  };

  const cacheApi = {
    open: async (name) => {
      if (!stores.has(name)) stores.set(name, new Map());
      const entries = stores.get(name);
      return {
        addAll: async (paths) => {
          for (const path of paths) entries.set(path, { shell: path });
        },
        put: async (request, response) => {
          entries.set(keyOf(request), response);
        },
        match: async (request) => entries.get(keyOf(request)),
      };
    },
    keys: async () => [...stores.keys()],
    delete: async (name) => stores.delete(name),
    match: async (request) => {
      for (const entries of stores.values()) {
        const value = entries.get(keyOf(request));
        if (value) return value;
      }
      return undefined;
    },
  };

  const selfMock = {
    location: { origin: 'https://bankui.test' },
    addEventListener: (type, fn) => {
      listeners[type] = fn;
    },
    skipWaiting: () => {
      state.skipped = true;
      return Promise.resolve();
    },
    clients: {
      claim: () => {
        state.claimed = true;
        return Promise.resolve();
      },
    },
  };

  vm.runInNewContext(source, {
    self: selfMock,
    caches: cacheApi,
    fetch: fetchImpl,
    URL,
    Promise,
    Response: { error: () => ({ error: true }) },
  });

  return { listeners, state, stores };
}

async function dispatch(listener, event) {
  const pending = [];
  listener({ ...event, waitUntil: (promise) => pending.push(promise) });
  await Promise.all(pending);
}

test('install activates the new worker without waiting for tab close', async () => {
  const worker = loadWorker();
  await dispatch(worker.listeners.install, {});
  assert.equal(worker.state.skipped, true);
});

test('activate deletes old caches and takes control of clients', async () => {
  const worker = loadWorker();
  worker.stores.set('bankui-cache-v3', new Map([['/old.js', {}]]));
  await dispatch(worker.listeners.activate, {});
  assert.equal(worker.stores.has('bankui-cache-v3'), false);
  assert.equal(worker.state.claimed, true);
});

test('a failed navigation falls back to the cached page', async () => {
  const worker = loadWorker(() => Promise.reject(new Error('offline')));
  await dispatch(worker.listeners.install, {});

  let result;
  worker.listeners.fetch({
    request: {
      method: 'GET',
      mode: 'navigate',
      url: 'https://bankui.test/menu',
    },
    respondWith: (promise) => {
      result = promise;
    },
  });
  const response = await result;
  assert.equal(response.shell, '/menu');
});

test('assets always use the network and are never cached', async () => {
  const asset = { ok: true, clone: () => ({}) };
  const worker = loadWorker(() => Promise.resolve(asset));
  await dispatch(worker.listeners.install, {});

  let result;
  worker.listeners.fetch({
    request: {
      method: 'GET',
      mode: 'same-origin',
      url: 'https://bankui.test/_next/static/chunks/main.js',
    },
    respondWith: (promise) => {
      result = promise;
    },
  });
  const response = await result;
  assert.equal(response, asset);

  const cached = await worker.stores.get('bankui-cache-v4').has('/_next/static/chunks/main.js');
  assert.equal(cached, false);
});
