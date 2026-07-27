import type { Branch } from '../../domain/branch';
import type { BranchRepository } from '../../domain/repositories/branch-repository';
import type { TenantContext } from '../../domain/tenant-context';
import type { Result } from '../../domain/result';
import { ok } from '../../domain/result';

export interface ListBranchesDeps {
  branchRepository: BranchRepository;
}

export async function listBranches(
  tenantContext: TenantContext,
  deps: ListBranchesDeps,
): Promise<Result<Branch[]>> {
  const branches = await deps.branchRepository.findAllByOrganization(tenantContext.organizationId);
  return ok(branches);
}
