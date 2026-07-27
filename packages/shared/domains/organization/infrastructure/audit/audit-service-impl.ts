import { getDatabase } from '../local/database';
import type { AuditEntry, AuditService } from '../../domain/audit';

const STORE_NAME = 'audit_log';

export class AuditServiceImpl implements AuditService {
  async record(entry: Omit<AuditEntry, 'id' | 'performedAt'>): Promise<void> {
    const db = await getDatabase();
    const fullEntry: AuditEntry = {
      ...entry,
      id: crypto.randomUUID(),
      performedAt: new Date().toISOString(),
    };
    await db.put(STORE_NAME, fullEntry);
  }

  async getHistory(entityType: string, entityId: string): Promise<AuditEntry[]> {
    const db = await getDatabase();
    const all = await db.getAllFromIndex(STORE_NAME, 'by_entity', [entityType, entityId]) as AuditEntry[];
    return all.sort((a, b) => b.performedAt.localeCompare(a.performedAt));
  }
}
