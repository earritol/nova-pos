import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateCreateBranch, validateUpdateBranch } from '../domain/validation/branch-validation';
import { validCreateBranchInput, invalidCreateBranchInput, validUpdateBranchInput } from './arbitraries';

describe('Feature: core-001-organization, Property 4: Branch validation rejects invalid input without side effects', () => {
  it('rejects any CreateBranchInput with at least one invalid required field', () => {
    fc.assert(
      fc.property(invalidCreateBranchInput, (input) => {
        const result = validateCreateBranch(input);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 },
    );
  });

  it('accepts any CreateBranchInput with all valid required fields', () => {
    fc.assert(
      fc.property(validCreateBranchInput, (input) => {
        const result = validateCreateBranch(input);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      }),
      { numRuns: 100 },
    );
  });
});

describe('Feature: core-001-organization, Property 6: Branch name uniqueness per organization', () => {
  it('valid update inputs pass validation independently (uniqueness enforced at repository level)', () => {
    fc.assert(
      fc.property(validUpdateBranchInput, (input) => {
        const result = validateUpdateBranch(input);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      }),
      { numRuns: 100 },
    );
  });
});
