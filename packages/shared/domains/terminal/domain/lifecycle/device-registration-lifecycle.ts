import type { DeviceRegistration } from '../device-registration';
import type { Result } from '../../../organization/domain/result';
import { ok, fail } from '../../../organization/domain/result';

export function revokeDevice(registration: DeviceRegistration): Result<DeviceRegistration> {
  if (registration.status !== 'active') {
    return fail('INVALID_STATE_TRANSITION', 'Only active device registrations can be revoked');
  }

  return ok({ ...registration, status: 'revoked' as const });
}

export function deactivateDevice(registration: DeviceRegistration): Result<DeviceRegistration> {
  if (registration.status !== 'active') {
    return fail('INVALID_STATE_TRANSITION', 'Only active device registrations can be deactivated');
  }

  return ok({ ...registration, status: 'inactive' as const });
}
