import type { ValidationResult } from '../../../organization/domain/validation';
import type { FieldError } from '../../../organization/domain/result';

export interface CreateTerminalInput {
  code: string;
  name: string;
}

export interface UpdateTerminalInput {
  code?: string;
  name?: string;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateCreateTerminal(data: CreateTerminalInput): ValidationResult {
  const errors: FieldError[] = [];

  if (!isNonEmptyString(data.code)) {
    errors.push({ field: 'code', message: 'Terminal code is required' });
  } else if (data.code.length > 50) {
    errors.push({ field: 'code', message: 'Terminal code must not exceed 50 characters' });
  }

  if (!isNonEmptyString(data.name)) {
    errors.push({ field: 'name', message: 'Terminal name is required' });
  } else if (data.name.length > 255) {
    errors.push({ field: 'name', message: 'Terminal name must not exceed 255 characters' });
  }

  return { valid: errors.length === 0, errors };
}

export function validateUpdateTerminal(data: UpdateTerminalInput): ValidationResult {
  const errors: FieldError[] = [];

  if (data.code !== undefined) {
    if (!isNonEmptyString(data.code)) {
      errors.push({ field: 'code', message: 'Terminal code cannot be empty' });
    } else if (data.code.length > 50) {
      errors.push({ field: 'code', message: 'Terminal code must not exceed 50 characters' });
    }
  }

  if (data.name !== undefined) {
    if (!isNonEmptyString(data.name)) {
      errors.push({ field: 'name', message: 'Terminal name cannot be empty' });
    } else if (data.name.length > 255) {
      errors.push({ field: 'name', message: 'Terminal name must not exceed 255 characters' });
    }
  }

  return { valid: errors.length === 0, errors };
}
