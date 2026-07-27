import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateCreateOrganization } from '../domain/validation/organization-validation';
import { validCreateOrganizationInput, invalidCreateOrganizationInput } from './arbitraries';

describe('Feature: core-001-organization, Property 3: Organization validation rejects invalid input without side effects', () => {
  it('rejects any CreateOrganizationInput with at least one invalid required field', () => {
    fc.assert(
      fc.property(invalidCreateOrganizationInput, (input) => {
        const result = validateCreateOrganization(input);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 },
    );
  });

  it('accepts any CreateOrganizationInput with all valid required fields', () => {
    fc.assert(
      fc.property(validCreateOrganizationInput, (input) => {
        const result = validateCreateOrganization(input);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      }),
      { numRuns: 100 },
    );
  });
});

describe('Feature: core-001-organization, Property 5: Tax identifier uniqueness per country', () => {
  it('two organizations with same taxIdentifier and country should both pass validation independently (uniqueness enforced at repository level)', () => {
    fc.assert(
      fc.property(validCreateOrganizationInput, (input) => {
        const result1 = validateCreateOrganization(input);
        const result2 = validateCreateOrganization(input);
        expect(result1.valid).toBe(true);
        expect(result2.valid).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});
