import type { Organization } from '../../domain/organization';
import type { OrganizationRepository } from '../../domain/repositories/organization-repository';
import type { TenantContext } from '../../domain/tenant-context';
import type { Result } from '../../domain/result';
import { ok, fail } from '../../domain/result';

export interface GetOrganizationDeps {
  organizationRepository: OrganizationRepository;
}

export async function getOrganization(
  tenantContext: TenantContext,
  deps: GetOrganizationDeps,
): Promise<Result<Organization>> {
  const org = await deps.organizationRepository.findById(tenantContext.organizationId);
  if (!org) {
    return fail('ORG_NOT_FOUND', 'Organization does not exist');
  }
  return ok(org);
}
