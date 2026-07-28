import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateCreateTerminal } from '../domain/validation/terminal-validation';
import { suspendTerminal, reactivateTerminal } from '../domain/lifecycle/terminal-lifecycle';
import { createDefaultTerminalConfiguration } from '../domain/terminal-configuration';
import type { Terminal } from '../domain/terminal';
import type { OrganizationConfiguration } from '../../organization/domain/organization-configuration';
import { validCreateTerminalInput, invalidCreateTerminalInput } from './arbitraries';

const orgConfig: OrganizationConfiguration = {
  timeZone: 'America/Mexico_City', currency: 'MXN', language: 'es',
  regionalPreferences: { dateFormat: 'DD/MM/YYYY', numberFormat: '1,234.56', taxLabel: 'RFC' },
};

const makeTerminal = (status: 'active' | 'suspended'): fc.Arbitrary<Terminal> => fc.record({
  id: fc.uuid(),
  organizationId: fc.uuid(),
  branchId: fc.uuid(),
  code: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
  name: fc.string({ minLength: 1, maxLength: 255 }).filter((s) => s.trim().length > 0),
  configuration: fc.constant(createDefaultTerminalConfiguration(orgConfig)),
  status: fc.constant(status),
  createdAt: fc.constant(new Date().toISOString()),
  createdBy: fc.uuid(),
  updatedAt: fc.constant(new Date().toISOString()),
  updatedBy: fc.uuid(),
});

describe('Property 3: Terminal validation rejects invalid input', () => {
  it('rejects invalid CreateTerminalInput', () => {
    fc.assert(fc.property(invalidCreateTerminalInput, (input) => {
      const result = validateCreateTerminal(input);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    }), { numRuns: 100 });
  });

  it('accepts valid CreateTerminalInput', () => {
    fc.assert(fc.property(validCreateTerminalInput, (input) => {
      const result = validateCreateTerminal(input);
      expect(result.valid).toBe(true);
    }), { numRuns: 100 });
  });
});

describe('Property 4: Terminal lifecycle state transitions', () => {
  it('suspends active terminals without dependencies', () => {
    fc.assert(fc.property(makeTerminal('active'), (terminal) => {
      const result = suspendTerminal(terminal, false);
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.status).toBe('suspended');
    }), { numRuns: 100 });
  });

  it('reactivates suspended terminals', () => {
    fc.assert(fc.property(makeTerminal('suspended'), (terminal) => {
      const result = reactivateTerminal(terminal);
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.status).toBe('active');
    }), { numRuns: 100 });
  });

  it('rejects suspending suspended terminals', () => {
    fc.assert(fc.property(makeTerminal('suspended'), (terminal) => {
      const result = suspendTerminal(terminal, false);
      expect(result.success).toBe(false);
    }), { numRuns: 100 });
  });

  it('rejects reactivating active terminals', () => {
    fc.assert(fc.property(makeTerminal('active'), (terminal) => {
      const result = reactivateTerminal(terminal);
      expect(result.success).toBe(false);
    }), { numRuns: 100 });
  });

  it('rejects suspending terminal with dependencies', () => {
    fc.assert(fc.property(makeTerminal('active'), (terminal) => {
      const result = suspendTerminal(terminal, true);
      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.code).toBe('TERMINAL_HAS_DEPENDENCIES');
    }), { numRuns: 100 });
  });
});
