import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateRegisterDevice } from '../domain/validation/device-registration-validation';
import { revokeDevice, deactivateDevice } from '../domain/lifecycle/device-registration-lifecycle';
import type { DeviceRegistration } from '../domain/device-registration';
import { validRegisterDeviceInput, invalidRegisterDeviceInput } from './arbitraries';

const makeDevice = (status: 'active' | 'revoked' | 'inactive'): fc.Arbitrary<DeviceRegistration> => fc.record({
  id: fc.uuid(),
  terminalId: fc.uuid(),
  installationId: fc.uuid(),
  deviceName: fc.string({ minLength: 1 }),
  deviceType: fc.constant('desktop'),
  platform: fc.constant('Windows'),
  applicationVersion: fc.constant('1.0.0'),
  registeredAt: fc.constant(new Date().toISOString()),
  lastSeenAt: fc.constant(new Date().toISOString()),
  status: fc.constant(status),
});

describe('Property 5: Device registration validation', () => {
  it('accepts valid RegisterDeviceInput', () => {
    fc.assert(fc.property(validRegisterDeviceInput, (input) => {
      const result = validateRegisterDevice(input);
      expect(result.valid).toBe(true);
    }), { numRuns: 100 });
  });

  it('rejects invalid RegisterDeviceInput', () => {
    fc.assert(fc.property(invalidRegisterDeviceInput, (input) => {
      const result = validateRegisterDevice(input);
      expect(result.valid).toBe(false);
    }), { numRuns: 100 });
  });
});

describe('Property 8: Device revocation preserves history', () => {
  it('revokes active devices successfully', () => {
    fc.assert(fc.property(makeDevice('active'), (device) => {
      const result = revokeDevice(device);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('revoked');
        expect(result.data.id).toBe(device.id);
        expect(result.data.installationId).toBe(device.installationId);
      }
    }), { numRuns: 100 });
  });

  it('rejects revoking non-active devices', () => {
    fc.assert(fc.property(makeDevice('revoked'), (device) => {
      const result = revokeDevice(device);
      expect(result.success).toBe(false);
    }), { numRuns: 100 });
  });

  it('deactivates active devices', () => {
    fc.assert(fc.property(makeDevice('active'), (device) => {
      const result = deactivateDevice(device);
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.status).toBe('inactive');
    }), { numRuns: 100 });
  });

  it('rejects deactivating inactive devices', () => {
    fc.assert(fc.property(makeDevice('inactive'), (device) => {
      const result = deactivateDevice(device);
      expect(result.success).toBe(false);
    }), { numRuns: 100 });
  });
});
