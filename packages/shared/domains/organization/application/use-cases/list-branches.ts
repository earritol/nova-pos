import type { Branch } from '../../domain/branch';
import type { OrganizationRepository } from '../../domain/repositories/organization-repository';
import type { TenantContext } from '../../domain/tenant-context';
import type { Result } from '../../domain/result';
import { ok } from '../../domain/result';

export interface ListBranchesDeps {
  organizationRepository: OrganizationRepository;
}

export async function listBranches(
  tenantContext: TenantContext,
  deps: ListBranchesDeps,
): Promise<Result<Branch[]>> {
  const branches = await deps.organizationRepository.findAllBranches(tenantContext.organizationId);
  return ok(branches);
}
