import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { createOrganization } from '../application/use-cases/create-organization';
import { createBranch } from '../application/use-cases/create-branch';
import { updateOrganization } from '../application/use-cases/update-organization';
import { updateBranch } from '../application/use-cases/update-branch';
import { InMemoryOrganizationRepository, InMemoryAuditService } from './fakes';
import { validCreateOrganizationInput, validCreateBranchInput } from './arbitraries';

describe('Feature: core-001-organization, Property 1: Organization creation round-trip', () => {
  let orgRepo: InMemoryOrganizationRepository;
  let auditService: InMemoryAuditService;

  beforeEach(() => {
    orgRepo = new InMemoryOrganizationRepository();
    auditService = new InMemoryAuditService();
  });

  it('creating an organization and retrieving it returns matching data', () => {
    fc.assert(
      fc.asyncProperty(validCreateOrganizationInput, fc.uuid(), async (input, userId) => {
        orgRepo.clear();
        auditService.clear();
        const result = await createOrganization(input, userId, { organizationRepository: orgRepo, auditService });
        expect(result.success).toBe(true);
        if (!result.success) return;
        const org = result.data;
        expect(org.status).toBe('active');
        expect(org.legalName).toBe(input.legalName);
        expect(org.commercialName).toBe(input.commercialName);
        expect(org.taxIdentifier).toBe(input.taxIdentifier);
        expect(org.createdBy).toBe(userId);
        expect(org.id).toBeTruthy();
        const found = await orgRepo.findById(org.id);
        expect(found).not.toBeNull();
        expect(found!.id).toBe(org.id);
      }),
      { numRuns: 100 },
    );
  });
});

describe('Feature: core-001-organization, Property 2: Branch creation round-trip', () => {
  let orgRepo: InMemoryOrganizationRepository;
  let auditService: InMemoryAuditService;

  beforeEach(() => {
    orgRepo = new InMemoryOrganizationRepository();
    auditService = new InMemoryAuditService();
  });

  it('creating a branch and retrieving it returns matching data', () => {
    fc.assert(
      fc.asyncProperty(validCreateOrganizationInput, validCreateBranchInput, fc.uuid(), async (orgInput, branchInput, userId) => {
        orgRepo.clear();
        auditService.clear();
        const orgResult = await createOrganization(orgInput, userId, { organizationRepository: orgRepo, auditService });
        if (!orgResult.success) return;
        const result = await createBranch(orgResult.data.id, branchInput, userId, { organizationRepository: orgRepo, auditService });
        expect(result.success).toBe(true);
        if (!result.success) return;
        const branch = result.data;
        expect(branch.status).toBe('active');
        expect(branch.organizationId).toBe(orgResult.data.id);
        expect(branch.name).toBe(branchInput.name);
        expect(branch.createdBy).toBe(userId);
        const found = await orgRepo.findBranchById(orgResult.data.id, branch.id);
        expect(found).not.toBeNull();
      }),
      { numRuns: 100 },
    );
  });
});

describe('Feature: core-001-organization, Property 7: Organization update persists changes correctly', () => {
  let orgRepo: InMemoryOrganizationRepository;
  let auditService: InMemoryAuditService;

  beforeEach(() => {
    orgRepo = new InMemoryOrganizationRepository();
    auditService = new InMemoryAuditService();
  });

  it('updating an organization persists changes and advances updatedAt', () => {
    fc.assert(
      fc.asyncProperty(validCreateOrganizationInput, fc.uuid(), async (input, userId) => {
        orgRepo.clear();
        auditService.clear();
        const created = await createOrganization(input, userId, { organizationRepository: orgRepo, auditService });
        if (!created.success) return;
        const tenantContext = { organizationId: created.data.id, userId };
        const result = await updateOrganization(tenantContext, { commercialName: 'Updated' }, { organizationRepository: orgRepo, auditService });
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data.commercialName).toBe('Updated');
        expect(result.data.updatedAt >= created.data.updatedAt).toBe(true);
        expect(result.data.updatedBy).toBe(userId);
      }),
      { numRuns: 100 },
    );
  });
});

describe('Feature: core-001-organization, Property 8: Branch update persists changes correctly', () => {
  let orgRepo: InMemoryOrganizationRepository;
  let auditService: InMemoryAuditService;

  beforeEach(() => {
    orgRepo = new InMemoryOrganizationRepository();
    auditService = new InMemoryAuditService();
  });

  it('updating a branch persists changes and advances updatedAt', () => {
    fc.assert(
      fc.asyncProperty(validCreateOrganizationInput, validCreateBranchInput, fc.uuid(), async (orgInput, branchInput, userId) => {
        orgRepo.clear();
        auditService.clear();
        const orgResult = await createOrganization(orgInput, userId, { organizationRepository: orgRepo, auditService });
        if (!orgResult.success) return;
        const branchResult = await createBranch(orgResult.data.id, branchInput, userId, { organizationRepository: orgRepo, auditService });
        if (!branchResult.success) return;
        const tenantContext = { organizationId: orgResult.data.id, userId };
        const result = await updateBranch(tenantContext, branchResult.data.id, { phone: '999-0000' }, { organizationRepository: orgRepo, auditService });
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data.phone).toBe('999-0000');
        expect(result.data.updatedAt >= branchResult.data.updatedAt).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});
