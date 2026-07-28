export type AuditAction = 'created' | 'updated' | 'deactivated' | 'reactivated' | 'suspended';

export interface AuditEntry {
  id: string;
  organizationId: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  performedBy: string;
  performedAt: string;
  changes: Record<string, { from: unknown; to: unknown }>;
}

export interface AuditService {
  record(entry: Omit<AuditEntry, 'id' | 'performedAt'>): Promise<void>;
  getHistory(entityType: string, entityId: string): Promise<AuditEntry[]>;
}
