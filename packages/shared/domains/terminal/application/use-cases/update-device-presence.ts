import type { DeviceRegistration } from '../../domain/device-registration';
import type { DeviceRegistrationRepository } from '../../domain/repositories/device-registration-repository';
import type { Result } from '../../../organization/domain/result';
import type { SyncQueue } from '../../../../sync/types';
import { ok, fail } from '../../../organization/domain/result';

export interface UpdateDevicePresenceDeps {
  deviceRegistrationRepository: DeviceRegistrationRepository;
  syncQueue: SyncQueue;
}

export async function updateDevicePresence(
  terminalId: string,
  registrationId: string,
  deps: UpdateDevicePresenceDeps,
): Promise<Result<DeviceRegistration>> {
  const existing = await deps.deviceRegistrationRepository.findById(terminalId, registrationId);
  if (!existing) {
    return fail('DEVICE_NOT_FOUND', 'Device registration does not exist');
  }

  if (existing.status !== 'active') {
    return fail('DEVICE_NOT_ACTIVE', 'Presence updates are only accepted from active devices');
  }

  const updated: DeviceRegistration = {
    ...existing,
    lastSeenAt: new Date().toISOString(),
  };

  await deps.deviceRegistrationRepository.update(updated);

  await deps.syncQueue.enqueue({
    entityType: 'device_registration',
    entityId: registrationId,
    operationType: 'update',
    payload: { lastSeenAt: updated.lastSeenAt },
    createdAt: updated.lastSeenAt!,
  });

  return ok(updated);
}
