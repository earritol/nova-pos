import type { OrganizationConfiguration } from '../../organization/domain/organization-configuration';

export interface TerminalConfiguration {
  currency: string;
  language: string;
  timezone: string;
  offlineEnabled: boolean;
  syncInterval: number;
  receiptPrinterEnabled: boolean;
  cashDrawerEnabled: boolean;
  barcodeScannerEnabled: boolean;
}

export function createDefaultTerminalConfiguration(orgConfig: OrganizationConfiguration): TerminalConfiguration {
  return {
    currency: orgConfig.currency,
    language: orgConfig.language,
    timezone: orgConfig.timeZone,
    offlineEnabled: true,
    syncInterval: 30,
    receiptPrinterEnabled: false,
    cashDrawerEnabled: false,
    barcodeScannerEnabled: false,
  };
}
