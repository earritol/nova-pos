import type { SyncQueue, SyncOperation } from './types';

export interface RemotePusher {
  push(operation: SyncOperation): Promise<void>;
}

export interface ConnectivityDetector {
  isOnline(): boolean;
}

export class SyncEngine {
  private readonly queue: SyncQueue;
  private readonly remotePusher: RemotePusher;
  private readonly connectivity: ConnectivityDetector;
  private readonly maxRetryDelay = 30000;
  private running = false;

  constructor(queue: SyncQueue, remotePusher: RemotePusher, connectivity: ConnectivityDetector) {
    this.queue = queue;
    this.remotePusher = remotePusher;
    this.connectivity = connectivity;
  }

  async processQueue(): Promise<void> {
    if (this.running) return;
    if (!this.connectivity.isOnline()) return;

    this.running = true;
    try {
      let operation = await this.queue.dequeue();
      while (operation) {
        try {
          await this.remotePusher.push(operation);
          await this.queue.markCompleted(operation.id);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          await this.queue.markFailed(operation.id, message);
          break;
        }
        if (!this.connectivity.isOnline()) break;
        operation = await this.queue.dequeue();
      }
    } finally {
      this.running = false;
    }
  }

  getRetryDelay(attempts: number): number {
    const baseDelay = 1000;
    const delay = Math.min(baseDelay * Math.pow(2, attempts), this.maxRetryDelay);
    return delay;
  }
}
