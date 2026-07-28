import type { ValidationResult } from '../validation';
import type { FieldError } from '../result';

export interface CreateBranchInput {
  name: string;
  code: string;
  address: string;
  phone: string;
}

export interface UpdateBranchInput {
  name?: string;
  address?: string;
  phone?: string;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateCreateBranch(data: CreateBranchInput): ValidationResult {
  const errors: FieldError[] = [];

  if (!isNonEmptyString(data.name)) {
    errors.push({ field: 'name', message: 'Branch name is required' });
  } else if (data.name.length > 255) {
    errors.push({ field: 'name', message: 'Branch name must not exceed 255 characters' });
  }

  if (!isNonEmptyString(data.code)) {
    errors.push({ field: 'code', message: 'Branch code is required' });
  } else if (data.code.length > 50) {
    errors.push({ field: 'code', message: 'Branch code must not exceed 50 characters' });
  }

  if (!isNonEmptyString(data.address)) {
    errors.push({ field: 'address', message: 'Address is required' });
  } else if (data.address.length > 500) {
    errors.push({ field: 'address', message: 'Address must not exceed 500 characters' });
  }

  if (!isNonEmptyString(data.phone)) {
    errors.push({ field: 'phone', message: 'Phone is required' });
  } else if (data.phone.length > 50) {
    errors.push({ field: 'phone', message: 'Phone must not exceed 50 characters' });
  }

  return { valid: errors.length === 0, errors };
}

export function validateUpdateBranch(data: UpdateBranchInput): ValidationResult {
  const errors: FieldError[] = [];

  if (data.name !== undefined) {
    if (!isNonEmptyString(data.name)) {
      errors.push({ field: 'name', message: 'Branch name cannot be empty' });
    } else if (data.name.length > 255) {
      errors.push({ field: 'name', message: 'Branch name must not exceed 255 characters' });
    }
  }

  if (data.address !== undefined) {
    if (!isNonEmptyString(data.address)) {
      errors.push({ field: 'address', message: 'Address cannot be empty' });
    } else if (data.address.length > 500) {
      errors.push({ field: 'address', message: 'Address must not exceed 500 characters' });
    }
  }

  if (data.phone !== undefined) {
    if (!isNonEmptyString(data.phone)) {
      errors.push({ field: 'phone', message: 'Phone cannot be empty' });
    } else if (data.phone.length > 50) {
      errors.push({ field: 'phone', message: 'Phone must not exceed 50 characters' });
    }
  }

  return { valid: errors.length === 0, errors };
}
