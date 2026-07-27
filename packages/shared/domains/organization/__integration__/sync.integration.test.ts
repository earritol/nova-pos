import { describe, it, expect } from 'vitest';

type SyncStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
interface SyncOperation {
  id: string;
  entityType: 'organization' | 'branch';
  entityId: string;
  operationType: 'create' | 'update';
  payload: Record<string, unknown>;
  status: SyncStatus;
  createdAt: string;
  attempts: number;
  lastAttemptAt: string | null;
  error: string | null;
}
interface SyncQueue {
  enqueue(operation: Omit<SyncOperation, 'id' | 'status' | 'attempts' | 'lastAttemptAt' | 'error'>): Promise<void>;
  dequeue(): Promise<SyncOperation | null>;
  markCompleted(operationId: string): Promise<void>;
  markFailed(operationId: string, error: string): Promise<void>;
  getPendingCount(): Promise<number>;
}

class InMemorySyncQueue implements SyncQueue {
  operations: SyncOperation[] = [];

  async enqueue(op: Omit<SyncOperation, 'id' | 'status' | 'attempts' | 'lastAttemptAt' | 'error'>): Promise<void> {
    this.operations.push({
      ...op, id: crypto.randomUUID(), status: 'pending', attempts: 0, lastAttemptAt: null, error: null,
    });
  }
  async dequeue(): Promise<SyncOperation | null> {
    const p = this.operations.find((o) => o.status === 'pending');
    if (!p) return null;
    p.status = 'in_progress';
    return { ...p };
  }
  async markCompleted(id: string): Promise<void> {
    const op = this.operations.find((o) => o.id === id);
    if (op) op.status = 'completed';
  }
  async markFailed(id: string, error: string): Promise<void> {
    const op = this.operations.find((o) => o.id === id);
    if (op) { op.status = 'pending'; op.attempts += 1; op.lastAttemptAt = new Date().toISOString(); op.error = error; }
  }
  async getPendingCount(): Promise<number> {
    return this.operations.filter((o) => o.status === 'pending').length;
  }
}

describe('Integration: Sync flow', () => {
  it('offline change enqueues sync operation and completes on push', async () => {
    const queue = new InMemorySyncQueue();
    await queue.enqueue({
      entityType: 'organization',
      entityId: crypto.randomUUID(),
      operationType: 'create',
      payload: { legalName: 'Test' },
      createdAt: new Date().toISOString(),
    });

    expect(await queue.getPendingCount()).toBe(1);

    const op = await queue.dequeue();
    expect(op).not.toBeNull();
    expect(op!.status).toBe('in_progress');

    // Simulate successful remote push
    await queue.markCompleted(op!.id);
    expect(await queue.getPendingCount()).toBe(0);
    expect(queue.operations.find((o) => o.id === op!.id)!.status).toBe('completed');
  });

  it('sync failure increments attempts and retries on next connectivity', async () => {
    const queue = new InMemorySyncQueue();
    await queue.enqueue({
      entityType: 'branch',
      entityId: crypto.randomUUID(),
      operationType: 'update',
      payload: { name: 'Branch Update' },
      createdAt: new Date().toISOString(),
    });

    const op = await queue.dequeue();
    expect(op).not.toBeNull();

    // First failure
    await queue.markFailed(op!.id, 'Network timeout');
    expect(await queue.getPendingCount()).toBe(1);
    const failed = queue.operations.find((o) => o.id === op!.id)!;
    expect(failed.attempts).toBe(1);
    expect(failed.error).toBe('Network timeout');

    // Second attempt succeeds
    const retry = await queue.dequeue();
    expect(retry).not.toBeNull();
    await queue.markCompleted(retry!.id);
    expect(await queue.getPendingCount()).toBe(0);
  });
});
