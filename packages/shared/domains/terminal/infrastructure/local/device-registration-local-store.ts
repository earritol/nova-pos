import { getDatabase } from '../../../organization/infrastructure/local/database';
import type { DeviceRegistration } from '../../domain/device-registration';
import type { DeviceRegistrationRepository } from '../../domain/repositories/device-registration-repository';

interface LocalDeviceRegistration extends DeviceRegistration {
  _syncStatus: 'synced' | 'pending' | 'conflict';
  _lastSyncedAt: string | null;
  _localVersion: number;
  _remoteVersion: number;
}

const STORE_NAME = 'device_registrations';

function toLocalRecord(registration: DeviceRegistration): LocalDeviceRegistration {
  return {
    ...registration,
    _syncStatus: 'pending',
    _lastSyncedAt: null,
    _localVersion: 1,
    _remoteVersion: 0,
  };
}

function toDomain(local: LocalDeviceRegistration): DeviceRegistration {
  const { _syncStatus, _lastSyncedAt, _localVersion, _remoteVersion, ...registration } = local;
  return registration;
}

export class DeviceRegistrationLocalStore implements DeviceRegistrationRepository {
  async save(registration: DeviceRegistration): Promise<void> {
    const db = await getDatabase();
    await db.put(STORE_NAME, toLocalRecord(registration));
  }

  async findById(terminalId: string, registrationId: string): Promise<DeviceRegistration | null> {
    const db = await getDatabase();
    const record = await db.get(STORE_NAME, registrationId) as LocalDeviceRegistration | undefined;
    if (!record || record.terminalId !== terminalId) return null;
    return toDomain(record);
  }

  async findByInstallationId(installationId: string): Promise<DeviceRegistration | null> {
    const db = await getDatabase();
    const results = await db.getAllFromIndex(STORE_NAME, 'by_installation_id', installationId) as LocalDeviceRegistration[];
    const found = results[0];
    return found ? toDomain(found) : null;
  }

  async findAllByTerminal(terminalId: string): Promise<DeviceRegistration[]> {
    const db = await getDatabase();
    const all = await db.getAllFromIndex(STORE_NAME, 'by_terminal', terminalId) as LocalDeviceRegistration[];
    return all.map(toDomain);
  }

  async update(registration: DeviceRegistration): Promise<void> {
    const db = await getDatabase();
    const existing = await db.get(STORE_NAME, registration.id) as LocalDeviceRegistration | undefined;
    if (!existing) return;
    const updated: LocalDeviceRegistration = {
      ...existing,
      ...registration,
      _syncStatus: 'pending',
      _localVersion: existing._localVersion + 1,
    };
    await db.put(STORE_NAME, updated);
  }
}
