import { describe, it, expect } from 'vitest';
import { validateRegisterDevice } from '../domain/validation/device-registration-validation';
import { revokeDevice, deactivateDevice } from '../domain/lifecycle/device-registration-lifecycle';
import type { DeviceRegistration } from '../domain/device-registration';

const activeDevice: DeviceRegistration = {
  id: '1', terminalId: 't1', installationId: 'inst-1',
  deviceName: 'POS Desktop', deviceType: 'desktop', platform: 'Windows',
  applicationVersion: '1.0.0', registeredAt: '2026-01-01T00:00:00Z',
  lastSeenAt: '2026-01-01T00:00:00Z', status: 'active',
};

describe('DeviceRegistration Validation', () => {
  it('accepts valid input', () => {
    const result = validateRegisterDevice({
      installationId: 'inst-123', deviceName: 'My Device',
      deviceType: 'tablet', platform: 'Android', applicationVersion: '2.0',
    });
    expect(result.valid).toBe(true);
  });

  it('rejects empty installationId', () => {
    const result = validateRegisterDevice({
      installationId: '', deviceName: 'Device',
      deviceType: 'desktop', platform: 'Windows', applicationVersion: '1.0',
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]!.field).toBe('installationId');
  });

  it('rejects device name exceeding max length', () => {
    const result = validateRegisterDevice({
      installationId: 'id', deviceName: 'a'.repeat(256),
      deviceType: 'desktop', platform: 'Windows', applicationVersion: '1.0',
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]!.field).toBe('deviceName');
  });
});

describe('DeviceRegistration Lifecycle', () => {
  it('revokes an active device', () => {
    const result = revokeDevice(activeDevice);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe('revoked');
  });

  it('deactivates an active device', () => {
    const result = deactivateDevice(activeDevice);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe('inactive');
  });

  it('cannot revoke a revoked device', () => {
    const result = revokeDevice({ ...activeDevice, status: 'revoked' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.code).toBe('INVALID_STATE_TRANSITION');
  });

  it('cannot deactivate an inactive device', () => {
    const result = deactivateDevice({ ...activeDevice, status: 'inactive' });
    expect(result.success).toBe(false);
  });
});
