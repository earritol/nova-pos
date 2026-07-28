import type { SupabaseClient } from '@supabase/supabase-js';
import type { DeviceRegistration } from '../../domain/device-registration';
import type { DeviceRegistrationRepository } from '../../domain/repositories/device-registration-repository';

export class DeviceRegistrationRemoteRepository implements DeviceRegistrationRepository {
  constructor(private readonly client: SupabaseClient) {}

  async save(registration: DeviceRegistration): Promise<void> {
    const { error } = await this.client.from('device_registrations').insert(toRow(registration));
    if (error) throw new Error(error.message);
  }

  async findById(terminalId: string, registrationId: string): Promise<DeviceRegistration | null> {
    const { data, error } = await this.client
      .from('device_registrations')
      .select('*')
      .eq('id', registrationId)
      .eq('terminal_id', terminalId)
      .single();
    if (error || !data) return null;
    return toDomain(data);
  }

  async findByInstallationId(installationId: string): Promise<DeviceRegistration | null> {
    const { data, error } = await this.client
      .from('device_registrations')
      .select('*')
      .eq('installation_id', installationId)
      .single();
    if (error || !data) return null;
    return toDomain(data);
  }

  async findAllByTerminal(terminalId: string): Promise<DeviceRegistration[]> {
    const { data, error } = await this.client
      .from('device_registrations')
      .select('*')
      .eq('terminal_id', terminalId);
    if (error || !data) return [];
    return data.map((row: Record<string, unknown>) => toDomain(row));
  }

  async update(registration: DeviceRegistration): Promise<void> {
    const { error } = await this.client
      .from('device_registrations')
      .update(toRow(registration))
      .eq('id', registration.id);
    if (error) throw new Error(error.message);
  }
}

function toRow(registration: DeviceRegistration): Record<string, unknown> {
  return {
    id: registration.id,
    terminal_id: registration.terminalId,
    installation_id: registration.installationId,
    device_name: registration.deviceName,
    device_type: registration.deviceType,
    platform: registration.platform,
    application_version: registration.applicationVersion,
    registered_at: registration.registeredAt,
    last_seen_at: registration.lastSeenAt,
    status: registration.status,
  };
}

function toDomain(row: Record<string, unknown>): DeviceRegistration {
  return {
    id: row['id'] as string,
    terminalId: row['terminal_id'] as string,
    installationId: row['installation_id'] as string,
    deviceName: row['device_name'] as string,
    deviceType: row['device_type'] as string,
    platform: row['platform'] as string,
    applicationVersion: row['application_version'] as string,
    registeredAt: row['registered_at'] as string,
    lastSeenAt: row['last_seen_at'] as string | null,
    status: row['status'] as 'active' | 'revoked' | 'inactive',
  };
}
