import { describe, it, expect } from 'vitest';
import { createOrganization } from '../application/use-cases/create-organization';
import { getOrganization } from '../application/use-cases/get-organization';
import { createBranch } from '../application/use-cases/create-branch';
import { getBranch } from '../application/use-cases/get-branch';
import { listBranches } from '../application/use-cases/list-branches';
import type { OrganizationRepository } from '../domain/repositories/organization-repository';
import type { AuditService, AuditEntry } from '../domain/audit';
import type { Organization } from '../domain/organization';
import type { Branch } from '../domain/branch';

// In-memory implementation that simulates RLS by scoping to organization
class ScopedOrgRepo implements OrganizationRepository {
  private orgStore = new Map<string, Organization>();
  private branchStore = new Map<string, Branch>();

  async save(org: Organization) { this.orgStore.set(org.id, { ...org }); }
  async findById(orgId: string) { return this.orgStore.get(orgId) ?? null; }
  async findByTaxIdentifier(taxId: string, country: string) {
    for (const o of this.orgStore.values()) { if (o.taxIdentifier === taxId && o.country === country) return o; }
    return null;
  }
  async update(org: Organization) { this.orgStore.set(org.id, { ...org }); }

  async saveBranch(_orgId: string, b: Branch) { this.branchStore.set(b.id, { ...b }); }
  async findBranchById(orgId: string, branchId: string) {
    const b = this.branchStore.get(branchId);
    if (!b || b.organizationId !== orgId) return null;
    return b;
  }
  async findBranchByCode(orgId: string, code: string) {
    for (const b of this.branchStore.values()) { if (b.organizationId === orgId && b.code === code) return b; }
    return null;
  }
  async findBranchByName(orgId: string, name: string) {
    for (const b of this.branchStore.values()) { if (b.organizationId === orgId && b.name === name) return b; }
    return null;
  }
  async findAllBranches(orgId: string) {
    return [...this.branchStore.values()].filter((b) => b.organizationId === orgId);
  }
  async updateBranch(_orgId: string, b: Branch) { this.branchStore.set(b.id, { ...b }); }
  async hasActiveDependencies() { return false; }
}

class NoopAuditService implements AuditService {
  async record() {}
  async getHistory(): Promise<AuditEntry[]> { return []; }
}

describe('Integration: RLS tenant isolation', () => {
  it('rejects cross-organization access to organization data', async () => {
    const orgRepo = new ScopedOrgRepo();
    const audit = new NoopAuditService();

    const result = await createOrganization(
      { legalName: 'Org A', commercialName: 'A', taxIdentifier: 'TAX-A', country: 'MEX', timeZone: 'America/Mexico_City', currency: 'MXN' },
      'user-1',
      { organizationRepository: orgRepo, auditService: audit },
    );
    expect(result.success).toBe(true);
    if (!result.success) return;

    // Different tenant context tries to access
    const otherContext = { organizationId: crypto.randomUUID(), userId: 'user-2' };
    const accessResult = await getOrganization(otherContext, { organizationRepository: orgRepo });
    expect(accessResult.success).toBe(false);
    if (!accessResult.success) {
      expect(accessResult.error.code).toBe('ORG_NOT_FOUND');
    }
  });

  it('rejects cross-organization access to branch data', async () => {
    const orgRepo = new ScopedOrgRepo();
    const audit = new NoopAuditService();

    const orgResult = await createOrganization(
      { legalName: 'Org B', commercialName: 'B', taxIdentifier: 'TAX-B', country: 'USA', timeZone: 'America/New_York', currency: 'USD' },
      'user-1',
      { organizationRepository: orgRepo, auditService: audit },
    );
    expect(orgResult.success).toBe(true);
    if (!orgResult.success) return;

    const branchResult = await createBranch(
      orgResult.data.id,
      { name: 'Main', code: 'MAIN', address: '123 St', phone: '555-0100' },
      'user-1',
      { organizationRepository: orgRepo, auditService: audit },
    );
    expect(branchResult.success).toBe(true);
    if (!branchResult.success) return;

    // Different org context
    const otherContext = { organizationId: crypto.randomUUID(), userId: 'user-2' };
    const accessResult = await getBranch(otherContext, branchResult.data.id, { organizationRepository: orgRepo });
    expect(accessResult.success).toBe(false);

    const listResult = await listBranches(otherContext, { organizationRepository: orgRepo });
    expect(listResult.success).toBe(true);
    if (listResult.success) {
      expect(listResult.data).toHaveLength(0);
    }
  });

  it('enforces that every branch belongs to exactly one organization', async () => {
    const orgRepo = new ScopedOrgRepo();
    const audit = new NoopAuditService();

    const org1 = await createOrganization(
      { legalName: 'Org 1', commercialName: '1', taxIdentifier: 'TAX-1', country: 'MEX', timeZone: 'America/Mexico_City', currency: 'MXN' },
      'user-1',
      { organizationRepository: orgRepo, auditService: audit },
    );
    if (!org1.success) return;

    const branch = await createBranch(
      org1.data.id,
      { name: 'Centro', code: 'CENTRO', address: 'Av Central', phone: '555-0001' },
      'user-1',
      { organizationRepository: orgRepo, auditService: audit },
    );
    expect(branch.success).toBe(true);
    if (!branch.success) return;

    // Verify branch is scoped to org1
    const correctContext = { organizationId: org1.data.id, userId: 'user-1' };
    const found = await getBranch(correctContext, branch.data.id, { organizationRepository: orgRepo });
    expect(found.success).toBe(true);

    // Verify branch is not accessible from a different org
    const wrongContext = { organizationId: crypto.randomUUID(), userId: 'user-1' };
    const notFound = await getBranch(wrongContext, branch.data.id, { organizationRepository: orgRepo });
    expect(notFound.success).toBe(false);
  });
});
