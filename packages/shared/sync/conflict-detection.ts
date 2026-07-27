export interface SyncMetadata {
  _syncStatus: 'synced' | 'pending' | 'conflict';
  _lastSyncedAt: string | null;
  _localVersion: number;
  _remoteVersion: number;
}

export function detectConflict(local: SyncMetadata, incomingRemoteVersion: number): boolean {
  return local._syncStatus === 'pending' && incomingRemoteVersion > local._remoteVersion;
}

export function flagAsConflict<T extends SyncMetadata>(record: T): T {
  return { ...record, _syncStatus: 'conflict' as const };
}

export function markAsSynced<T extends SyncMetadata>(record: T, remoteVersion: number): T {
  return {
    ...record,
    _syncStatus: 'synced' as const,
    _lastSyncedAt: new Date().toISOString(),
    _remoteVersion: remoteVersion,
  };
}
