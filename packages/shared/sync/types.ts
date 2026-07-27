export type SyncStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface SyncOperation {
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

export interface SyncQueue {
  enqueue(operation: Omit<SyncOperation, 'id' | 'status' | 'attempts' | 'lastAttemptAt' | 'error'>): Promise<void>;
  dequeue(): Promise<SyncOperation | null>;
  markCompleted(operationId: string): Promise<void>;
  markFailed(operationId: string, error: string): Promise<void>;
  getPendingCount(): Promise<number>;
}
