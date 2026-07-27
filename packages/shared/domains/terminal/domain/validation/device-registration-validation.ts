import type { ValidationResult } from '../../../organization/domain/validation';
import type { FieldError } from '../../../organization/domain/result';

export interface RegisterDeviceInput {
  installationId: string;
  deviceName: string;
  deviceType: string;
  platform: string;
  applicationVersion: string;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateRegisterDevice(data: RegisterDeviceInput): ValidationResult {
  const errors: FieldError[] = [];

  if (!isNonEmptyString(data.installationId)) {
    errors.push({ field: 'installationId', message: 'Installation ID is required' });
  }

  if (!isNonEmptyString(data.deviceName)) {
    errors.push({ field: 'deviceName', message: 'Device name is required' });
  } else if (data.deviceName.length > 255) {
    errors.push({ field: 'deviceName', message: 'Device name must not exceed 255 characters' });
  }

  if (!isNonEmptyString(data.deviceType)) {
    errors.push({ field: 'deviceType', message: 'Device type is required' });
  } else if (data.deviceType.length > 50) {
    errors.push({ field: 'deviceType', message: 'Device type must not exceed 50 characters' });
  }

  if (!isNonEmptyString(data.platform)) {
    errors.push({ field: 'platform', message: 'Platform is required' });
  } else if (data.platform.length > 50) {
    errors.push({ field: 'platform', message: 'Platform must not exceed 50 characters' });
  }

  return { valid: errors.length === 0, errors };
}
