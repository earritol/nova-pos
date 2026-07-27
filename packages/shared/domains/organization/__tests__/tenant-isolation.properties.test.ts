import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { createOrganization } from '../application/use-cases/create-organization';
import { getOrganization } from '../application/use-cases/get-organization';
import { createBranch } from '../application/use-cases/create-branch';
import { getBranch } from '../application/use-cases/get-branch';
import { listBranches } from '../application/use-cases/list-branches';
import { InMemoryOrganizationRepository, InMemoryBranchRepository, InMemoryAuditService } from './fakes';
import { validCreateOrganizationInput, validCreateBranchInput } from './arbitraries';

describe('Feature: core-001-organization, Property 12: Tenant isolation enforcement', () => {
  let orgRepo: InMemoryOrganizationRepository;
  let branchRepo: InMemoryBranchRepository;
  let auditService: InMemoryAuditService;

  beforeEach(() => {
    orgRepo = new InMemoryOrganizationRepository();
    branchRepo = new InMemoryBranchRepository();
    auditService = new InMemoryAuditService();
  });

  it('cannot access an organization belonging to a different tenant', () => {
    fc.assert(
      fc.asyncProperty(validCreateOrganizationInput, fc.uuid(), fc.uuid(), async (input, userId, otherUserId) => {
        orgRepo.clear();
        auditService.clear();
        const result = await createOrganization(input, userId, { organizationRepository: orgRepo, auditService });
        if (!result.success) return;
        const otherContext = { organizationId: crypto.randomUUID(), userId: otherUserId };
        const accessResult = await getOrganization(otherContext, { organizationRepository: orgRepo });
        expect(accessResult.success).toBe(false);
        if (!accessResult.success) {
          expect(accessResult.error.code).toBe('ORG_NOT_FOUND');
        }
      }),
      { numRuns: 100 },
    );
  });

  it('cannot access a branch belonging to a different organization', () => {
    fc.assert(
      fc.asyncProperty(validCreateOrganizationInput, validCreateBranchInput, fc.uuid(), async (orgInput, branchInput, userId) => {
        orgRepo.clear();
        branchRepo.clear();
        auditService.clear();
        const orgResult = await createOrganization(orgInput, userId, { organizationRepository: orgRepo, auditService });
        if (!orgResult.success) return;
        const branchResult = await createBranch(orgResult.data.id, branchInput, userId, { branchRepository: branchRepo, auditService });
        if (!branchResult.success) return;
        const otherContext = { organizationId: crypto.randomUUID(), userId };
        const accessResult = await getBranch(otherContext, branchResult.data.id, { branchRepository: branchRepo });
        expect(accessResult.success).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  it('listing branches for a different organization returns empty', () => {
    fc.assert(
      fc.asyncProperty(validCreateOrganizationInput, validCreateBranchInput, fc.uuid(), async (orgInput, branchInput, userId) => {
        orgRepo.clear();
        branchRepo.clear();
        auditService.clear();
        const orgResult = await createOrganization(orgInput, userId, { organizationRepository: orgRepo, auditService });
        if (!orgResult.success) return;
        await createBranch(orgResult.data.id, branchInput, userId, { branchRepository: branchRepo, auditService });
        const otherContext = { organizationId: crypto.randomUUID(), userId };
        const listResult = await listBranches(otherContext, { branchRepository: branchRepo });
        expect(listResult.success).toBe(true);
        if (listResult.success) {
          expect(listResult.data).toHaveLength(0);
        }
      }),
      { numRuns: 100 },
    );
  });
});
