import type { DeviceRegistration } from '../../domain/device-registration';
import type { DeviceRegistrationRepository } from '../../domain/repositories/device-registration-repository';
import type { AuditService } from '../../../organization/domain/audit';
import type { TenantContext } from '../../../organization/domain/tenant-context';
import type { Result } from '../../../organization/domain/result';
import type { SyncQueue } from '../../../../sync/types';
import { fail } from '../../../organization/domain/result';
import { revokeDevice as applyTransition } from '../../domain/lifecycle/device-registration-lifecycle';

export interface RevokeDeviceDeps {
  deviceRegistrationRepository: DeviceRegistrationRepository;
  auditService: AuditService;
  syncQueue: SyncQueue;
}

export async function revokeDeviceUseCase(
  tenantContext: TenantContext,
  terminalId: string,
  registrationId: string,
  deps: RevokeDeviceDeps,
): Promise<Result<DeviceRegistration>> {
  const existing = await deps.deviceRegistrationRepository.findById(terminalId, registrationId);
  if (!existing) {
    return fail('DEVICE_NOT_FOUND', 'Device registration does not exist');
  }

  const result = applyTransition(existing);
  if (!result.success) return result;

  await deps.deviceRegistrationRepository.update(result.data);

  await deps.syncQueue.enqueue({
    entityType: 'device_registration',
    entityId: registrationId,
    operationType: 'update',
    payload: result.data as unknown as Record<string, unknown>,
    createdAt: new Date().toISOString(),
  });

  await deps.auditService.record({
    organizationId: tenantContext.organizationId,
    entityType: 'device_registration',
    entityId: registrationId,
    action: 'deactivated',
    performedBy: tenantContext.userId,
    changes: { status: { from: 'active', to: 'revoked' } },
  });

  return { success: true, data: result.data };
}
