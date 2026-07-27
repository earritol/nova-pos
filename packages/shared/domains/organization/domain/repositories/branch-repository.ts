import type { Branch } from '../branch';

export interface BranchRepository {
  save(branch: Branch): Promise<void>;
  findById(orgId: string, branchId: string): Promise<Branch | null>;
  findByName(orgId: string, name: string): Promise<Branch | null>;
  findAllByOrganization(orgId: string): Promise<Branch[]>;
  update(branch: Branch): Promise<void>;
  hasActiveDependencies(orgId: string, branchId: string): Promise<boolean>;
}
