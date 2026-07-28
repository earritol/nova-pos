import type { OrganizationConfiguration } from './organization-configuration';

export type OrganizationStatus = 'active' | 'suspended';

export interface Organization {
  id: string;
  legalName: string;
  commercialName: string;
  taxIdentifier: string;
  country: string;
  configuration: OrganizationConfiguration;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  status: OrganizationStatus;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
