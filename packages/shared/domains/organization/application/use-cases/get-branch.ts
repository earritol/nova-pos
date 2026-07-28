import type { Branch } from '../../domain/branch';
import type { OrganizationRepository } from '../../domain/repositories/organization-repository';
import type { TenantContext } from '../../domain/tenant-context';
import type { Result } from '../../domain/result';
import { ok, fail } from '../../domain/result';

export interface GetBranchDeps {
  organizationRepository: OrganizationRepository;
}

export async function getBranch(
  tenantContext: TenantContext,
  branchId: string,
  deps: GetBranchDeps,
): Promise<Result<Branch>> {
  const branch = await deps.organizationRepository.findBranchById(tenantContext.organizationId, branchId);
  if (!branch) {
    return fail('BRANCH_NOT_FOUND', 'Branch does not exist');
  }
  return ok(branch);
}
