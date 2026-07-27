import type { ValidationResult } from '../validation';
import type { FieldError } from '../result';
import { COUNTRY_DEFAULTS } from '../organization-configuration';

export interface CreateOrganizationInput {
  legalName: string;
  tradeName: string;
  taxIdentifier: string;
  country: string;
  timeZone: string;
  currency: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  address?: string | null;
}

export interface UpdateOrganizationInput {
  legalName?: string;
  tradeName?: string;
  taxIdentifier?: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  timeZone?: string;
  currency?: string;
}

function getSupportedCountries(): string[] {
  return Object.keys(COUNTRY_DEFAULTS);
}

function getSupportedCurrencies(): string[] {
  return Object.values(COUNTRY_DEFAULTS).map((d) => d.currency);
}

function getSupportedTimeZones(): string[] {
  return Object.values(COUNTRY_DEFAULTS).map((d) => d.timeZone);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validateCreateOrganization(data: CreateOrganizationInput): ValidationResult {
  const errors: FieldError[] = [];

  if (!isNonEmptyString(data.legalName)) {
    errors.push({ field: 'legalName', message: 'Legal name is required' });
  } else if (data.legalName.length > 255) {
    errors.push({ field: 'legalName', message: 'Legal name must not exceed 255 characters' });
  }

  if (!isNonEmptyString(data.tradeName)) {
    errors.push({ field: 'tradeName', message: 'Trade name is required' });
  } else if (data.tradeName.length > 255) {
    errors.push({ field: 'tradeName', message: 'Trade name must not exceed 255 characters' });
  }

  if (!isNonEmptyString(data.taxIdentifier)) {
    errors.push({ field: 'taxIdentifier', message: 'Tax identifier is required' });
  } else if (data.taxIdentifier.length > 100) {
    errors.push({ field: 'taxIdentifier', message: 'Tax identifier must not exceed 100 characters' });
  }

  if (!isNonEmptyString(data.country)) {
    errors.push({ field: 'country', message: 'Country is required' });
  } else if (!getSupportedCountries().includes(data.country)) {
    errors.push({ field: 'country', message: 'Country must be a valid ISO 3166-1 alpha-3 code' });
  }

  if (!isNonEmptyString(data.timeZone)) {
    errors.push({ field: 'timeZone', message: 'Time zone is required' });
  } else if (!getSupportedTimeZones().includes(data.timeZone)) {
    errors.push({ field: 'timeZone', message: 'Time zone must be a valid IANA timezone' });
  }

  if (!isNonEmptyString(data.currency)) {
    errors.push({ field: 'currency', message: 'Currency is required' });
  } else if (!getSupportedCurrencies().includes(data.currency)) {
    errors.push({ field: 'currency', message: 'Currency must be a valid ISO 4217 code' });
  }

  if (data.contactEmail != null && data.contactEmail !== '') {
    if (!validateEmail(data.contactEmail)) {
      errors.push({ field: 'contactEmail', message: 'Contact email must be a valid email address' });
    }
  }

  if (data.contactPhone != null && data.contactPhone !== '') {
    if (data.contactPhone.length > 50) {
      errors.push({ field: 'contactPhone', message: 'Contact phone must not exceed 50 characters' });
    }
  }

  if (data.address != null && data.address !== '') {
    if (data.address.length > 500) {
      errors.push({ field: 'address', message: 'Address must not exceed 500 characters' });
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateUpdateOrganization(data: UpdateOrganizationInput): ValidationResult {
  const errors: FieldError[] = [];

  if (data.legalName !== undefined) {
    if (!isNonEmptyString(data.legalName)) {
      errors.push({ field: 'legalName', message: 'Legal name cannot be empty' });
    } else if (data.legalName.length > 255) {
      errors.push({ field: 'legalName', message: 'Legal name must not exceed 255 characters' });
    }
  }

  if (data.tradeName !== undefined) {
    if (!isNonEmptyString(data.tradeName)) {
      errors.push({ field: 'tradeName', message: 'Trade name cannot be empty' });
    } else if (data.tradeName.length > 255) {
      errors.push({ field: 'tradeName', message: 'Trade name must not exceed 255 characters' });
    }
  }

  if (data.taxIdentifier !== undefined) {
    if (!isNonEmptyString(data.taxIdentifier)) {
      errors.push({ field: 'taxIdentifier', message: 'Tax identifier cannot be empty' });
    } else if (data.taxIdentifier.length > 100) {
      errors.push({ field: 'taxIdentifier', message: 'Tax identifier must not exceed 100 characters' });
    }
  }

  if (data.timeZone !== undefined) {
    if (!isNonEmptyString(data.timeZone)) {
      errors.push({ field: 'timeZone', message: 'Time zone cannot be empty' });
    } else if (!getSupportedTimeZones().includes(data.timeZone)) {
      errors.push({ field: 'timeZone', message: 'Time zone must be a valid IANA timezone' });
    }
  }

  if (data.currency !== undefined) {
    if (!isNonEmptyString(data.currency)) {
      errors.push({ field: 'currency', message: 'Currency cannot be empty' });
    } else if (!getSupportedCurrencies().includes(data.currency)) {
      errors.push({ field: 'currency', message: 'Currency must be a valid ISO 4217 code' });
    }
  }

  if (data.contactEmail != null && data.contactEmail !== '') {
    if (!validateEmail(data.contactEmail)) {
      errors.push({ field: 'contactEmail', message: 'Contact email must be a valid email address' });
    }
  }

  if (data.contactPhone != null && data.contactPhone !== '') {
    if (data.contactPhone.length > 50) {
      errors.push({ field: 'contactPhone', message: 'Contact phone must not exceed 50 characters' });
    }
  }

  if (data.address != null && data.address !== '') {
    if (data.address.length > 500) {
      errors.push({ field: 'address', message: 'Address must not exceed 500 characters' });
    }
  }

  return { valid: errors.length === 0, errors };
}
