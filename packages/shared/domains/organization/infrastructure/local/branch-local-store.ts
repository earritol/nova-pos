import { getDatabase } from './database';
import type { Branch } from '../../domain/branch';
import type { BranchRepository } from '../../domain/repositories/branch-repository';

export interface LocalBranch extends Branch {
  _syncStatus: 'synced' | 'pending' | 'conflict';
  _lastSyncedAt: string | null;
  _localVersion: number;
  _remoteVersion: number;
}

const STORE_NAME = 'branches';

function toLocalRecord(branch: Branch): LocalBranch {
  return {
    ...branch,
    _syncStatus: 'pending',
    _lastSyncedAt: null,
    _localVersion: 1,
    _remoteVersion: 0,
  };
}

function toDomain(local: LocalBranch): Branch {
  const { _syncStatus, _lastSyncedAt, _localVersion, _remoteVersion, ...branch } = local;
  return branch;
}

export class BranchLocalStore implements BranchRepository {
  async save(branch: Branch): Promise<void> {
    const db = await getDatabase();
    await db.put(STORE_NAME, toLocalRecord(branch));
  }

  async findById(orgId: string, branchId: string): Promise<Branch | null> {
    const db = await getDatabase();
    const record = await db.get(STORE_NAME, branchId) as LocalBranch | undefined;
    if (!record || record.organizationId !== orgId) return null;
    return toDomain(record);
  }

  async findByName(orgId: string, name: string): Promise<Branch | null> {
    const db = await getDatabase();
    const all = await db.getAllFromIndex(STORE_NAME, 'by_org', orgId) as LocalBranch[];
    const found = all.find((b) => b.name === name);
    return found ? toDomain(found) : null;
  }

  async findAllByOrganization(orgId: string): Promise<Branch[]> {
    const db = await getDatabase();
    const all = await db.getAllFromIndex(STORE_NAME, 'by_org', orgId) as LocalBranch[];
    return all.map(toDomain);
  }

  async update(branch: Branch): Promise<void> {
    const db = await getDatabase();
    const existing = await db.get(STORE_NAME, branch.id) as LocalBranch | undefined;
    if (!existing) return;
    const updated: LocalBranch = {
      ...existing,
      ...branch,
      _syncStatus: 'pending',
      _localVersion: existing._localVersion + 1,
    };
    await db.put(STORE_NAME, updated);
  }

  async hasActiveDependencies(_orgId: string, _branchId: string): Promise<boolean> {
    // In the current implementation, no other domain entities exist yet.
    // This will be extended when POS Terminal, Sales, etc. are implemented.
    return false;
  }
}
