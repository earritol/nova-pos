import type { SyncQueue } from './types';
import type { SyncMetadata } from './conflict-detection';

export type SyncStatusInfo = 'synced' | 'pending' | 'conflict';

export class SyncStatusTracker {
  private readonly queue: SyncQueue;
  private listeners: Array<(pendingCount: number) => void> = [];

  constructor(queue: SyncQueue) {
    this.queue = queue;
  }

  async getPendingCount(): Promise<number> {
    return this.queue.getPendingCount();
  }

  getRecordStatus(record: SyncMetadata): SyncStatusInfo {
    return record._syncStatus;
  }

  onChange(listener: (pendingCount: number) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  async notifyChange(): Promise<void> {
    const count = await this.getPendingCount();
    for (const listener of this.listeners) {
      listener(count);
    }
  }
}
