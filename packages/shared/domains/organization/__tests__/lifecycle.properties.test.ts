import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { suspendOrganization, reactivateOrganization } from '../domain/lifecycle/organization-lifecycle';
import { deactivateBranch, reactivateBranch } from '../domain/lifecycle/branch-lifecycle';
import type { Organization } from '../domain/organization';
import type { Branch } from '../domain/branch';
import type { OrganizationConfiguration } from '../domain/organization-configuration';

const baseConfig: OrganizationConfiguration = {
  timeZone: 'America/Mexico_City',
  currency: 'MXN',
  language: 'es',
  regionalPreferences: { dateFormat: 'DD/MM/YYYY', numberFormat: '1,234.56', taxLabel: 'RFC' },
};

const activeOrg: fc.Arbitrary<Organization> = fc.record({
  id: fc.uuid(),
  legalName: fc.string({ minLength: 1 }),
  commercialName: fc.string({ minLength: 1 }),
  taxIdentifier: fc.string({ minLength: 1 }),
  country: fc.constant('MEX'),
  configuration: fc.constant(baseConfig),
  contactEmail: fc.constant(null),
  contactPhone: fc.constant(null),
  address: fc.constant(null),
  status: fc.constant('active' as const),
  createdAt: fc.constant(new Date().toISOString()),
  createdBy: fc.uuid(),
  updatedAt: fc.constant(new Date().toISOString()),
  updatedBy: fc.uuid(),
});

const suspendedOrg: fc.Arbitrary<Organization> = activeOrg.map((org) => ({
  ...org,
  status: 'suspended' as const,
}));

const activeBranch: fc.Arbitrary<Branch> = fc.record({
  id: fc.uuid(),
  organizationId: fc.uuid(),
  name: fc.string({ minLength: 1 }),
  code: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
  address: fc.string({ minLength: 1 }),
  phone: fc.string({ minLength: 1 }),
  status: fc.constant('active' as const),
  createdAt: fc.constant(new Date().toISOString()),
  createdBy: fc.uuid(),
  updatedAt: fc.constant(new Date().toISOString()),
  updatedBy: fc.uuid(),
});

const inactiveBranch: fc.Arbitrary<Branch> = activeBranch.map((b) => ({
  ...b,
  status: 'inactive' as const,
}));

describe('Feature: core-001-organization, Property 9: Branch lifecycle state transitions', () => {
  it('deactivating an active branch with no dependencies sets status to inactive', () => {
    fc.assert(
      fc.property(activeBranch, (branch) => {
        const result = deactivateBranch(branch, false);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.status).toBe('inactive');
        }
      }),
      { numRuns: 100 },
    );
  });

  it('reactivating an inactive branch sets status to active', () => {
    fc.assert(
      fc.property(inactiveBranch, (branch) => {
        const result = reactivateBranch(branch);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.status).toBe('active');
        }
      }),
      { numRuns: 100 },
    );
  });
});

describe('Feature: core-001-organization, Property 10: Organization lifecycle state transitions', () => {
  it('suspending an active organization sets status to suspended', () => {
    fc.assert(
      fc.property(activeOrg, (org) => {
        const result = suspendOrganization(org);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.status).toBe('suspended');
        }
      }),
      { numRuns: 100 },
    );
  });

  it('reactivating a suspended organization sets status to active', () => {
    fc.assert(
      fc.property(suspendedOrg, (org) => {
        const result = reactivateOrganization(org);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.status).toBe('active');
        }
      }),
      { numRuns: 100 },
    );
  });
});

describe('Feature: core-001-organization, Property 11: Invalid state transitions are rejected', () => {
  it('reactivating an already-active branch returns an error', () => {
    fc.assert(
      fc.property(activeBranch, (branch) => {
        const result = reactivateBranch(branch);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.code).toBe('INVALID_STATE_TRANSITION');
        }
      }),
      { numRuns: 100 },
    );
  });

  it('deactivating a branch with dependencies returns BRANCH_HAS_DEPENDENCIES', () => {
    fc.assert(
      fc.property(activeBranch, (branch) => {
        const result = deactivateBranch(branch, true);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.code).toBe('BRANCH_HAS_DEPENDENCIES');
        }
      }),
      { numRuns: 100 },
    );
  });

  it('suspending a suspended organization returns an error', () => {
    fc.assert(
      fc.property(suspendedOrg, (org) => {
        const result = suspendOrganization(org);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.code).toBe('INVALID_STATE_TRANSITION');
        }
      }),
      { numRuns: 100 },
    );
  });

  it('reactivating an active organization returns an error', () => {
    fc.assert(
      fc.property(activeOrg, (org) => {
        const result = reactivateOrganization(org);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.code).toBe('INVALID_STATE_TRANSITION');
        }
      }),
      { numRuns: 100 },
    );
  });
});
