export interface RegionalPreferences {
  dateFormat: string;
  numberFormat: string;
  taxLabel: string;
}

export interface OrganizationConfiguration {
  timeZone: string;
  currency: string;
  language: string;
  regionalPreferences: RegionalPreferences;
}

export interface CountryDefaults {
  timeZone: string;
  currency: string;
  language: string;
  regionalPreferences: RegionalPreferences;
}

export const COUNTRY_DEFAULTS: Record<string, CountryDefaults> = {
  MEX: {
    timeZone: 'America/Mexico_City',
    currency: 'MXN',
    language: 'es',
    regionalPreferences: {
      dateFormat: 'DD/MM/YYYY',
      numberFormat: '1,234.56',
      taxLabel: 'RFC',
    },
  },
  USA: {
    timeZone: 'America/New_York',
    currency: 'USD',
    language: 'en',
    regionalPreferences: {
      dateFormat: 'MM/DD/YYYY',
      numberFormat: '1,234.56',
      taxLabel: 'EIN',
    },
  },
  COL: {
    timeZone: 'America/Bogota',
    currency: 'COP',
    language: 'es',
    regionalPreferences: {
      dateFormat: 'DD/MM/YYYY',
      numberFormat: '1.234,56',
      taxLabel: 'NIT',
    },
  },
};

export function getDefaultConfiguration(country: string): OrganizationConfiguration {
  const defaults = COUNTRY_DEFAULTS[country];
  if (!defaults) {
    const fallback = COUNTRY_DEFAULTS['MEX']!;
    return fallback;
  }
  return defaults;
}
