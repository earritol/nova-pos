import type { Organization } from '../organization';

export interface OrganizationRepository {
  save(org: Organization): Promise<void>;
  findById(orgId: string): Promise<Organization | null>;
  findByTaxIdentifier(taxId: string, country: string): Promise<Organization | null>;
  update(org: Organization): Promise<void>;
}
