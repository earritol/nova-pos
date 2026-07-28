import type { Organization } from '../organization';
import type { Branch } from '../branch';

export interface OrganizationRepository {
  // Organization operations
  save(org: Organization): Promise<void>;
  findById(orgId: string): Promise<Organization | null>;
  findByTaxIdentifier(taxId: string, country: string): Promise<Organization | null>;
  update(org: Organization): Promise<void>;

  // Branch operations (coordinated through aggregate)
  saveBranch(orgId: string, branch: Branch): Promise<void>;
  findBranchById(orgId: string, branchId: string): Promise<Branch | null>;
  findBranchByCode(orgId: string, code: string): Promise<Branch | null>;
  findBranchByName(orgId: string, name: string): Promise<Branch | null>;
  findAllBranches(orgId: string): Promise<Branch[]>;
  updateBranch(orgId: string, branch: Branch): Promise<void>;
  hasActiveDependencies(orgId: string, branchId: string): Promise<boolean>;
}
