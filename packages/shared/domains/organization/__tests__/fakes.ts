import type { Organization } from '../domain/organization';
import type { Branch } from '../domain/branch';
import type { OrganizationRepository } from '../domain/repositories/organization-repository';
import type { AuditEntry, AuditService } from '../domain/audit';

export class InMemoryOrganizationRepository implements OrganizationRepository {
  private orgStore = new Map<string, Organization>();
  private branchStore = new Map<string, Branch>();

  // Organization operations

  async save(org: Organization): Promise<void> {
    this.orgStore.set(org.id, { ...org });
  }

  async findById(orgId: string): Promise<Organization | null> {
    return this.orgStore.get(orgId) ?? null;
  }

  async findByTaxIdentifier(taxId: string, country: string): Promise<Organization | null> {
    for (const org of this.orgStore.values()) {
      if (org.taxIdentifier === taxId && org.country === country) return org;
    }
    return null;
  }

  async update(org: Organization): Promise<void> {
    this.orgStore.set(org.id, { ...org });
  }

  // Branch operations

  async saveBranch(_orgId: string, branch: Branch): Promise<void> {
    this.branchStore.set(branch.id, { ...branch });
  }

  async findBranchById(orgId: string, branchId: string): Promise<Branch | null> {
    const b = this.branchStore.get(branchId);
    if (!b || b.organizationId !== orgId) return null;
    return b;
  }

  async findBranchByCode(orgId: string, code: string): Promise<Branch | null> {
    for (const b of this.branchStore.values()) {
      if (b.organizationId === orgId && b.code === code) return b;
    }
    return null;
  }

  async findBranchByName(orgId: string, name: string): Promise<Branch | null> {
    for (const b of this.branchStore.values()) {
      if (b.organizationId === orgId && b.name === name) return b;
    }
    return null;
  }

  async findAllBranches(orgId: string): Promise<Branch[]> {
    return [...this.branchStore.values()].filter((b) => b.organizationId === orgId);
  }

  async updateBranch(_orgId: string, branch: Branch): Promise<void> {
    this.branchStore.set(branch.id, { ...branch });
  }

  async hasActiveDependencies(_orgId: string, _branchId: string): Promise<boolean> {
    return false;
  }

  clear(): void {
    this.orgStore.clear();
    this.branchStore.clear();
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
