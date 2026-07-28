import { getDatabase } from '../../../organization/infrastructure/local/database';
import type { Terminal } from '../../domain/terminal';
import type { TerminalRepository } from '../../domain/repositories/terminal-repository';

interface LocalTerminal extends Terminal {
  _syncStatus: 'synced' | 'pending' | 'conflict';
  _lastSyncedAt: string | null;
  _localVersion: number;
  _remoteVersion: number;
}

const STORE_NAME = 'terminals';

function toLocalRecord(terminal: Terminal): LocalTerminal {
  return {
    ...terminal,
    _syncStatus: 'pending',
    _lastSyncedAt: null,
    _localVersion: 1,
    _remoteVersion: 0,
  };
}

function toDomain(local: LocalTerminal): Terminal {
  const { _syncStatus, _lastSyncedAt, _localVersion, _remoteVersion, ...terminal } = local;
  return terminal;
}

export class TerminalLocalStore implements TerminalRepository {
  async save(terminal: Terminal): Promise<void> {
    const db = await getDatabase();
    await db.put(STORE_NAME, toLocalRecord(terminal));
  }

  async findById(orgId: string, terminalId: string): Promise<Terminal | null> {
    const db = await getDatabase();
    const record = await db.get(STORE_NAME, terminalId) as LocalTerminal | undefined;
    if (!record || record.organizationId !== orgId) return null;
    return toDomain(record);
  }

  async findByCode(orgId: string, code: string): Promise<Terminal | null> {
    const db = await getDatabase();
    const all = await db.getAllFromIndex(STORE_NAME, 'by_org', orgId) as LocalTerminal[];
    const found = all.find((t) => t.code === code);
    return found ? toDomain(found) : null;
  }

  async findAllByBranch(orgId: string, branchId: string): Promise<Terminal[]> {
    const db = await getDatabase();
    const all = await db.getAllFromIndex(STORE_NAME, 'by_branch', [orgId, branchId]) as LocalTerminal[];
    return all.map(toDomain);
  }

  async update(terminal: Terminal): Promise<void> {
    const db = await getDatabase();
    const existing = await db.get(STORE_NAME, terminal.id) as LocalTerminal | undefined;
    if (!existing) return;
    const updated: LocalTerminal = {
      ...existing,
      ...terminal,
      _syncStatus: 'pending',
      _localVersion: existing._localVersion + 1,
    };
    await db.put(STORE_NAME, updated);
  }

  async hasActiveDependencies(_orgId: string, _terminalId: string): Promise<boolean> {
    // Will be extended when Session Management domain is implemented
    return false;
  }
}
