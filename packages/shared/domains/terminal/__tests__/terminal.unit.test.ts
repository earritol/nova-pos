import { describe, it, expect } from 'vitest';
import { validateCreateTerminal, validateUpdateTerminal } from '../domain/validation/terminal-validation';
import { createDefaultTerminalConfiguration } from '../domain/terminal-configuration';
import type { OrganizationConfiguration } from '../../organization/domain/organization-configuration';

const orgConfig: OrganizationConfiguration = {
  timeZone: 'America/Mexico_City', currency: 'MXN', language: 'es',
  regionalPreferences: { dateFormat: 'DD/MM/YYYY', numberFormat: '1,234.56', taxLabel: 'RFC' },
};

describe('Terminal Validation', () => {
  it('validates code max length', () => {
    const result = validateCreateTerminal({ code: 'a'.repeat(51), name: 'Valid' });
    expect(result.valid).toBe(false);
    expect(result.errors[0]!.field).toBe('code');
  });

  it('validates name max length', () => {
    const result = validateCreateTerminal({ code: 'VALID', name: 'a'.repeat(256) });
    expect(result.valid).toBe(false);
    expect(result.errors[0]!.field).toBe('name');
  });

  it('validates whitespace-only code', () => {
    const result = validateCreateTerminal({ code: '   ', name: 'Valid' });
    expect(result.valid).toBe(false);
  });

  it('accepts valid update with partial fields', () => {
    const result = validateUpdateTerminal({ name: 'New Name' });
    expect(result.valid).toBe(true);
  });

  it('rejects empty update code', () => {
    const result = validateUpdateTerminal({ code: '' });
    expect(result.valid).toBe(false);
  });
});

describe('TerminalConfiguration Defaults', () => {
  it('inherits currency from organization', () => {
    const config = createDefaultTerminalConfiguration(orgConfig);
    expect(config.currency).toBe('MXN');
  });

  it('inherits language from organization', () => {
    const config = createDefaultTerminalConfiguration(orgConfig);
    expect(config.language).toBe('es');
  });

  it('inherits timezone from organization', () => {
    const config = createDefaultTerminalConfiguration(orgConfig);
    expect(config.timezone).toBe('America/Mexico_City');
  });

  it('defaults peripherals to disabled', () => {
    const config = createDefaultTerminalConfiguration(orgConfig);
    expect(config.receiptPrinterEnabled).toBe(false);
    expect(config.cashDrawerEnabled).toBe(false);
    expect(config.barcodeScannerEnabled).toBe(false);
  });

  it('defaults offline to enabled', () => {
    const config = createDefaultTerminalConfiguration(orgConfig);
    expect(config.offlineEnabled).toBe(true);
  });

  it('defaults sync interval to 30 seconds', () => {
    const config = createDefaultTerminalConfiguration(orgConfig);
    expect(config.syncInterval).toBe(30);
  });
});
