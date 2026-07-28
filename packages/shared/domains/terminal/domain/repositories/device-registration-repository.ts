import type { DeviceRegistration } from '../device-registration';

export interface DeviceRegistrationRepository {
  save(registration: DeviceRegistration): Promise<void>;
  findById(terminalId: string, registrationId: string): Promise<DeviceRegistration | null>;
  findByInstallationId(installationId: string): Promise<DeviceRegistration | null>;
  findAllByTerminal(terminalId: string): Promise<DeviceRegistration[]>;
  update(registration: DeviceRegistration): Promise<void>;
}
