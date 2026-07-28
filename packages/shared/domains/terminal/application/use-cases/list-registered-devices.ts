import type { DeviceRegistration } from '../../domain/device-registration';
import type { DeviceRegistrationRepository } from '../../domain/repositories/device-registration-repository';
import type { Result } from '../../../organization/domain/result';
import { ok } from '../../../organization/domain/result';

export interface ListRegisteredDevicesDeps {
  deviceRegistrationRepository: DeviceRegistrationRepository;
}

export async function listRegisteredDevices(
  terminalId: string,
  deps: ListRegisteredDevicesDeps,
): Promise<Result<DeviceRegistration[]>> {
  const registrations = await deps.deviceRegistrationRepository.findAllByTerminal(terminalId);
  return ok(registrations);
}
