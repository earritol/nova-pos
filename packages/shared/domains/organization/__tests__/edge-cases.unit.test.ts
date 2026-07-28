import { describe, it, expect } from 'vitest';
import { validateCreateOrganization, validateUpdateOrganization } from '../domain/validation/organization-validation';
import { validateCreateBranch, validateUpdateBranch } from '../domain/validation/branch-validation';
import { suspendOrganization, reactivateOrganization } from '../domain/lifecycle/organization-lifecycle';
import { deactivateBranch, reactivateBranch } from '../domain/lifecycle/branch-lifecycle';
import { getDefaultConfiguration } from '../domain/organization-configuration';
import type { Organization } from '../domain/organization';
import type { Branch } from '../domain/branch';

const baseOrg: Organization = {
  id: '1', legalName: 'Test', commercialName: 'Test Co', taxIdentifier: 'TAX1',
  country: 'MEX', configuration: getDefaultConfiguration('MEX'),
  contactEmail: null, contactPhone: null, address: null,
  status: 'active', createdAt: '2026-01-01T00:00:00Z', createdBy: 'u1',
  updatedAt: '2026-01-01T00:00:00Z', updatedBy: 'u1',
};

const baseBranch: Branch = {
  id: '1', organizationId: '1', name: 'Main', code: 'MAIN',
  address: 'Addr', phone: '555', status: 'active',
  createdAt: '2026-01-01T00:00:00Z', createdBy: 'u1',
  updatedAt: '2026-01-01T00:00:00Z', updatedBy: 'u1',
};

describe('Organization validation edge cases', () => {
  it('rejects legalName at max+1 length', () => {
    const result = validateCreateOrganization({
      legalName: 'a'.repeat(256), commercialName: 'Valid', taxIdentifier: 'TAX',
      country: 'MEX', timeZone: 'America/Mexico_City', currency: 'MXN',
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]!.field).toBe('legalName');
  });

  it('accepts legalName at max length', () => {
    const result = validateCreateOrganization({
      legalName: 'a'.repeat(255), commercialName: 'Valid', taxIdentifier: 'TAX',
      country: 'MEX', timeZone: 'America/Mexico_City', currency: 'MXN',
    });
    expect(result.valid).toBe(true);
  });

  it('rejects whitespace-only commercialName in update', () => {
    const result = validateUpdateOrganization({ commercialName: '   ' });
    expect(result.valid).toBe(false);
    expect(result.errors[0]!.field).toBe('commercialName');
  });

  it('accepts empty update (no fields provided)', () => {
    const result = validateUpdateOrganization({});
    expect(result.valid).toBe(true);
  });
});

describe('Branch validation edge cases', () => {
  it('rejects branch code at max+1 length', () => {
    const result = validateCreateBranch({ name: 'Valid', code: 'a'.repeat(51), address: 'Addr', phone: '555' });
    expect(result.valid).toBe(false);
    expect(result.errors[0]!.field).toBe('code');
  });

  it('accepts branch code at max length', () => {
    const result = validateCreateBranch({ name: 'Valid', code: 'a'.repeat(50), address: 'Addr', phone: '555' });
    expect(result.valid).toBe(true);
  });

  it('rejects all empty fields simultaneously', () => {
    const result = validateCreateBranch({ name: '', code: '', address: '', phone: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBe(4);
  });

  it('accepts update with no fields (empty partial)', () => {
    const result = validateUpdateBranch({});
    expect(result.valid).toBe(true);
  });
});

describe('Organization lifecycle edge cases', () => {
  it('double suspension fails', () => {
    const suspended = { ...baseOrg, status: 'suspended' as const };
    const result = suspendOrganization(suspended);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.code).toBe('INVALID_STATE_TRANSITION');
  });

  it('double reactivation fails', () => {
    const result = reactivateOrganization(baseOrg);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.code).toBe('INVALID_STATE_TRANSITION');
  });
});

describe('Branch lifecycle edge cases', () => {
  it('deactivation with dependencies fails', () => {
    const result = deactivateBranch(baseBranch, true);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.code).toBe('BRANCH_HAS_DEPENDENCIES');
  });

  it('deactivation of inactive branch fails', () => {
    const inactive = { ...baseBranch, status: 'inactive' as const };
    const result = deactivateBranch(inactive, false);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.code).toBe('INVALID_STATE_TRANSITION');
  });

  it('reactivation of active branch fails', () => {
    const result = reactivateBranch(baseBranch);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.code).toBe('INVALID_STATE_TRANSITION');
  });
});

describe('Configuration defaults', () => {
  it('returns MEX defaults for unknown country', () => {
    const config = getDefaultConfiguration('UNKNOWN');
    expect(config.currency).toBe('MXN');
    expect(config.timeZone).toBe('America/Mexico_City');
  });

  it('returns correct defaults for COL', () => {
    const config = getDefaultConfiguration('COL');
    expect(config.currency).toBe('COP');
    expect(config.language).toBe('es');
    expect(config.timeZone).toBe('America/Bogota');
  });
});
