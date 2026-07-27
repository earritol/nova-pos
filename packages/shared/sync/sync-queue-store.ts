import { openDB, type IDBPDatabase } from 'idb';
import type { SyncOperation, SyncQueue } from './types';

const DB_NAME = 'nova-pos';
const STORE_NAME = 'sync_queue';
const DB_VERSION = 1;

async function getDb(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('by_status', 'status');
        store.createIndex('by_created', 'createdAt');
      }
    },
  });
}

export class SyncQueueStore implements SyncQueue {
  async enqueue(operation: Omit<SyncOperation, 'id' | 'status' | 'attempts' | 'lastAttemptAt' | 'error'>): Promise<void> {
    const db = await getDb();
    const entry: SyncOperation = {
      ...operation,
      id: crypto.randomUUID(),
      status: 'pending',
      attempts: 0,
      lastAttemptAt: null,
      error: null,
    };
    await db.put(STORE_NAME, entry);
  }

  async dequeue(): Promise<SyncOperation | null> {
    const db = await getDb();
    const all = await db.getAllFromIndex(STORE_NAME, 'by_status', 'pending') as SyncOperation[];
    if (all.length === 0) return null;
    const sorted = all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const next = sorted[0]!;
    const updated: SyncOperation = { ...next, status: 'in_progress' };
    await db.put(STORE_NAME, updated);
    return updated;
  }

  async markCompleted(operationId: string): Promise<void> {
    const db = await getDb();
    const existing = await db.get(STORE_NAME, operationId) as SyncOperation | undefined;
    if (!existing) return;
    const updated: SyncOperation = { ...existing, status: 'completed' };
    await db.put(STORE_NAME, updated);
  }

  async markFailed(operationId: string, error: string): Promise<void> {
    const db = await getDb();
    const existing = await db.get(STORE_NAME, operationId) as SyncOperation | undefined;
    if (!existing) return;
    const updated: SyncOperation = {
      ...existing,
      status: 'pending',
      attempts: existing.attempts + 1,
      lastAttemptAt: new Date().toISOString(),
      error,
    };
    await db.put(STORE_NAME, updated);
  }

  async getPendingCount(): Promise<number> {
    const db = await getDb();
    const all = await db.getAllFromIndex(STORE_NAME, 'by_status', 'pending') as SyncOperation[];
    return all.length;
  }
}
