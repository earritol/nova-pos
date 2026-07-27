export type DeviceRegistrationStatus = 'active' | 'revoked' | 'inactive';

export interface DeviceRegistration {
  id: string;
  terminalId: string;
  installationId: string;
  deviceName: string;
  deviceType: string;
  platform: string;
  applicationVersion: string;
  registeredAt: string;
  lastSeenAt: string | null;
  status: DeviceRegistrationStatus;
}
