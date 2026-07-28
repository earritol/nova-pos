import type { DeviceRegistration } from '../../domain/device-registration';
import type { DeviceRegistrationRepository } from '../../domain/repositories/device-registration-repository';
import type { AuditService } from '../../../organization/domain/audit';
import type { RegisterDeviceInput } from '../../domain/validation/device-registration-validation';
import type { Result } from '../../../organization/domain/result';
import type { SyncQueue } from '../../../../sync/types';
import { ok, fail } from '../../../organization/domain/result';
import { validateRegisterDevice } from '../../domain/validation/device-registration-validation';

export interface RegisterDeviceDeps {
  deviceRegistrationRepository: DeviceRegistrationRepository;
  auditService: AuditService;
  syncQueue: SyncQueue;
}

export async function registerDevice(
  orgId: string,
  terminalId: string,
  input: RegisterDeviceInput,
  actorId: string,
  deps: RegisterDeviceDeps,
): Promise<Result<DeviceRegistration>> {
  const validation = validateRegisterDevice(input);
  if (!validation.valid) {
    return fail('VALIDATION_ERROR', 'Invalid device registration data', validation.errors);
  }

  const existingByInstallation = await deps.deviceRegistrationRepository.findByInstallationId(input.installationId);

  if (existingByInstallation) {
    if (existingByInstallation.terminalId === terminalId) {
      const now = new Date().toISOString();
      const updated: DeviceRegistration = {
        ...existingByInstallation,
        deviceName: input.deviceName,
        deviceType: input.deviceType,
        platform: input.platform,
        applicationVersion: input.applicationVersion,
        lastSeenAt: now,
        status: 'active',
      };
      await deps.deviceRegistrationRepository.update(updated);

      await deps.syncQueue.enqueue({
        entityType: 'device_registration',
        entityId: updated.id,
        operationType: 'update',
        payload: updated as unknown as Record<string, unknown>,
        createdAt: now,
      });

      await deps.auditService.record({
        organizationId: orgId,
        entityType: 'device_registration',
        entityId: updated.id,
        action: 'updated',
        performedBy: actorId,
        changes: { reRegistered: { from: false, to: true } },
      });

      return ok(updated);
    }

    return fail('INSTALLATION_ID_CONFLICT', 'Installation ID is already registered to another terminal');
  }

  const now = new Date().toISOString();
  const registration: DeviceRegistration = {
    id: crypto.randomUUID(),
    terminalId,
    installationId: input.installationId,
    deviceName: input.deviceName,
    deviceType: input.deviceType,
    platform: input.platform,
    applicationVersion: input.applicationVersion,
    registeredAt: now,
    lastSeenAt: now,
    status: 'active',
  };

  await deps.deviceRegistrationRepository.save(registration);

  await deps.syncQueue.enqueue({
    entityType: 'device_registration',
    entityId: registration.id,
    operationType: 'create',
    payload: registration as unknown as Record<string, unknown>,
    createdAt: now,
  });

  await deps.auditService.record({
    organizationId: orgId,
    entityType: 'device_registration',
    entityId: registration.id,
    action: 'created',
    performedBy: actorId,
    changes: {},
  });

  return ok(registration);
}
