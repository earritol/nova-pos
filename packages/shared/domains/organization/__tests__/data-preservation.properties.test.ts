import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { createOrganization } from '../application/use-cases/create-organization';
import { createBranch } from '../application/use-cases/create-branch';
import { suspendOrganizationUseCase } from '../application/use-cases/suspend-organization';
import { deactivateBranchUseCase } from '../application/use-cases/deactivate-branch';
import { getOrganization } from '../application/use-cases/get-organization';
import { getBranch } from '../application/use-cases/get-branch';
import { getDefaultConfiguration } from '../domain/organization-configuration';
import { InMemoryOrganizationRepository, InMemoryBranchRepository, InMemoryAuditService } from './fakes';
import { validCreateOrganizationInput, validCreateBranchInput } from './arbitraries';

describe('Feature: core-001-organization, Property 15: Data preservation across status changes', () => {
  it('suspended organization data remains accessible', () => {
    fc.assert(
      fc.asyncProperty(validCreateOrganizationInput, fc.uuid(), async (input, userId) => {
        const localOrgRepo = new InMemoryOrganizationRepository();
        const localAudit = new InMemoryAuditService();
        const created = await createOrganization(input, userId, { organizationRepository: localOrgRepo, auditService: localAudit });
        if (!created.success) return;
        const tenantContext = { organizationId: created.data.id, userId };
        await suspendOrganizationUseCase(tenantContext, { organizationRepository: localOrgRepo, auditService: localAudit });
        const found = await getOrganization(tenantContext, { organizationRepository: localOrgRepo });
        expect(found.success).toBe(true);
        if (found.success) {
          expect(found.data.status).toBe('suspended');
          expect(found.data.legalName).toBe(input.legalName);
        }
      }),
      { numRuns: 100 },
    );
  });

  it('deactivated branch data remains accessible', () => {
    fc.assert(
      fc.asyncProperty(validCreateOrganizationInput, validCreateBranchInput, fc.uuid(), async (orgInput, branchInput, userId) => {
        const localOrgRepo = new InMemoryOrganizationRepository();
        const localBranchRepo = new InMemoryBranchRepository();
        const localAudit = new InMemoryAuditService();
        const orgResult = await createOrganization(orgInput, userId, { organizationRepository: localOrgRepo, auditService: localAudit });
        if (!orgResult.success) return;
        const branchResult = await createBranch(orgResult.data.id, branchInput, userId, { branchRepository: localBranchRepo, auditService: localAudit });
        if (!branchResult.success) return;
        const tenantContext = { organizationId: orgResult.data.id, userId };
        await deactivateBranchUseCase(tenantContext, branchResult.data.id, { branchRepository: localBranchRepo, auditService: localAudit });
        const found = await getBranch(tenantContext, branchResult.data.id, { branchRepository: localBranchRepo });
        expect(found.success).toBe(true);
        if (found.success) {
          expect(found.data.status).toBe('inactive');
          expect(found.data.name).toBe(branchInput.name);
        }
      }),
      { numRuns: 100 },
    );
  });
});

describe('Feature: core-001-organization, Property 17: Configuration country-based defaults', () => {
  it('created organization has configuration with country defaults', () => {
    fc.assert(
      fc.asyncProperty(validCreateOrganizationInput, fc.uuid(), async (input, userId) => {
        const localOrgRepo = new InMemoryOrganizationRepository();
        const localAudit = new InMemoryAuditService();
        const result = await createOrganization(input, userId, { organizationRepository: localOrgRepo, auditService: localAudit });
        if (!result.success) return;
        const defaults = getDefaultConfiguration(input.country);
        expect(result.data.configuration.language).toBe(defaults.language);
        expect(result.data.configuration.regionalPreferences).toEqual(defaults.regionalPreferences);
      }),
      { numRuns: 100 },
    );
  });
});

describe('Feature: core-001-organization, Property 18: Branch organization immutability', () => {
  it('branch organizationId is preserved after creation', () => {
    fc.assert(
      fc.asyncProperty(validCreateOrganizationInput, validCreateBranchInput, fc.uuid(), async (orgInput, branchInput, userId) => {
        const localOrgRepo = new InMemoryOrganizationRepository();
        const localBranchRepo = new InMemoryBranchRepository();
        const localAudit = new InMemoryAuditService();
        const orgResult = await createOrganization(orgInput, userId, { organizationRepository: localOrgRepo, auditService: localAudit });
        if (!orgResult.success) return;
        const branchResult = await createBranch(orgResult.data.id, branchInput, userId, { branchRepository: localBranchRepo, auditService: localAudit });
        if (!branchResult.success) return;
        const tenantContext = { organizationId: orgResult.data.id, userId };
        const found = await getBranch(tenantContext, branchResult.data.id, { branchRepository: localBranchRepo });
        expect(found.success).toBe(true);
        if (found.success) {
          expect(found.data.organizationId).toBe(orgResult.data.id);
        }
      }),
      { numRuns: 100 },
    );
  });
});
