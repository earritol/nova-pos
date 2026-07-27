import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { createOrganization } from '../application/use-cases/create-organization';
import { updateOrganization } from '../application/use-cases/update-organization';
import { suspendOrganizationUseCase } from '../application/use-cases/suspend-organization';
import { InMemoryOrganizationRepository, InMemoryAuditService } from './fakes';
import { validCreateOrganizationInput } from './arbitraries';

describe('Feature: core-001-organization, Property 13: Audit trail completeness', () => {
  it('every mutation produces an audit entry', () => {
    fc.assert(
      fc.asyncProperty(validCreateOrganizationInput, fc.uuid(), async (input, userId) => {
        const localOrgRepo = new InMemoryOrganizationRepository();
        const localAudit = new InMemoryAuditService();
        const result = await createOrganization(input, userId, { organizationRepository: localOrgRepo, auditService: localAudit });
        if (!result.success) return;
        expect(localAudit.entries.length).toBeGreaterThanOrEqual(1);
        const entry = localAudit.entries[0]!;
        expect(entry.action).toBe('created');
        expect(entry.entityType).toBe('organization');
        expect(entry.performedBy).toBe(userId);
      }),
      { numRuns: 100 },
    );
  });

  it('update produces audit entry with changes', () => {
    fc.assert(
      fc.asyncProperty(validCreateOrganizationInput, fc.uuid(), async (input, userId) => {
        const localOrgRepo = new InMemoryOrganizationRepository();
        const localAudit = new InMemoryAuditService();
        const created = await createOrganization(input, userId, { organizationRepository: localOrgRepo, auditService: localAudit });
        if (!created.success) return;
        const tenantContext = { organizationId: created.data.id, userId };
        await updateOrganization(tenantContext, { tradeName: 'NewName' }, { organizationRepository: localOrgRepo, auditService: localAudit });
        const updateEntries = localAudit.entries.filter((e) => e.action === 'updated');
        expect(updateEntries.length).toBeGreaterThanOrEqual(1);
      }),
      { numRuns: 100 },
    );
  });
});

describe('Feature: core-001-organization, Property 14: Audit history ordering', () => {
  it('getHistory returns entries in descending order', () => {
    fc.assert(
      fc.asyncProperty(validCreateOrganizationInput, fc.uuid(), async (input, userId) => {
        const localOrgRepo = new InMemoryOrganizationRepository();
        const localAudit = new InMemoryAuditService();
        const created = await createOrganization(input, userId, { organizationRepository: localOrgRepo, auditService: localAudit });
        if (!created.success) return;
        const tenantContext = { organizationId: created.data.id, userId };
        await updateOrganization(tenantContext, { tradeName: 'V2' }, { organizationRepository: localOrgRepo, auditService: localAudit });
        await suspendOrganizationUseCase(tenantContext, { organizationRepository: localOrgRepo, auditService: localAudit });
        const history = await localAudit.getHistory('organization', created.data.id);
        for (let i = 0; i < history.length - 1; i++) {
          expect(history[i]!.performedAt >= history[i + 1]!.performedAt).toBe(true);
        }
      }),
      { numRuns: 50 },
    );
  });
});
