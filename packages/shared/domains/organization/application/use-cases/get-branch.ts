import type { Branch } from '../../domain/branch';
import type { BranchRepository } from '../../domain/repositories/branch-repository';
import type { TenantContext } from '../../domain/tenant-context';
import type { Result } from '../../domain/result';
import { ok, fail } from '../../domain/result';

export interface GetBranchDeps {
  branchRepository: BranchRepository;
}

export async function getBranch(
  tenantContext: TenantContext,
  branchId: string,
  deps: GetBranchDeps,
): Promise<Result<Branch>> {
  const branch = await deps.branchRepository.findById(tenantContext.organizationId, branchId);
  if (!branch) {
    return fail('BRANCH_NOT_FOUND', 'Branch does not exist');
  }
  return ok(branch);
}
