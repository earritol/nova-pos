import type { Organization } from '../domain/organization';
import type { Branch } from '../domain/branch';
import type { OrganizationRepository } from '../domain/repositories/organization-repository';
import type { BranchRepository } from '../domain/repositories/branch-repository';
import type { AuditEntry, AuditService } from '../domain/audit';

export class InMemoryOrganizationRepository implements OrganizationRepository {
  private store = new Map<string, Organization>();

  async save(org: Organization): Promise<void> {
    this.store.set(org.id, { ...org });
  }

  async findById(orgId: string): Promise<Organization | null> {
    return this.store.get(orgId) ?? null;
  }

  async findByTaxIdentifier(taxId: string, country: string): Promise<Organization | null> {
    for (const org of this.store.values()) {
      if (org.taxIdentifier === taxId && org.country === country) return org;
    }
    return null;
  }

  async update(org: Organization): Promise<void> {
    this.store.set(org.id, { ...org });
  }

  clear(): void {
    this.store.clear();
  }
}

export class InMemoryBranchRepository implements BranchRepository {
  private store = new Map<string, Branch>();

  async save(branch: Branch): Promise<void> {
    this.store.set(branch.id, { ...branch });
  }

  async findById(orgId: string, branchId: string): Promise<Branch | null> {
    const b = this.store.get(branchId);
    if (!b || b.organizationId !== orgId) return null;
    return b;
  }

  async findByName(orgId: string, name: string): Promise<Branch | null> {
    for (const b of this.store.values()) {
      if (b.organizationId === orgId && b.name === name) return b;
    }
    return null;
  }

  async findAllByOrganization(orgId: string): Promise<Branch[]> {
    return [...this.store.values()].filter((b) => b.organizationId === orgId);
  }

  async update(branch: Branch): Promise<void> {
    this.store.set(branch.id, { ...branch });
  }

  async hasActiveDependencies(_orgId: string, _branchId: string): Promise<boolean> {
    return false;
  }

  clear(): void {
    this.store.clear();
  }
}

export class InMemoryAuditService implements AuditService {
  entries: AuditEntry[] = [];

  async record(entry: Omit<AuditEntry, 'id' | 'performedAt'>): Promise<void> {
    this.entries.push({
      ...entry,
      id: crypto.randomUUID(),
      performedAt: new Date().toISOString(),
    });
  }

  async getHistory(entityType: string, entityId: string): Promise<AuditEntry[]> {
    return this.entries
      .filter((e) => e.entityType === entityType && e.entityId === entityId)
      .sort((a, b) => b.performedAt.localeCompare(a.performedAt));
  }

  clear(): void {
    this.entries = [];
  }
}
