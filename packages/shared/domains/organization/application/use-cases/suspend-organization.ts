import type { Organization } from '../../domain/organization';
import type { OrganizationRepository } from '../../domain/repositories/organization-repository';
import type { AuditService } from '../../domain/audit';
import type { TenantContext } from '../../domain/tenant-context';
import type { Result } from '../../domain/result';
import { fail } from '../../domain/result';
import { suspendOrganization as applyTransition } from '../../domain/lifecycle/organization-lifecycle';

export interface SuspendOrganizationDeps {
  organizationRepository: OrganizationRepository;
  auditService: AuditService;
}

export async function suspendOrganizationUseCase(
  tenantContext: TenantContext,
  deps: SuspendOrganizationDeps,
): Promise<Result<Organization>> {
  const existing = await deps.organizationRepository.findById(tenantContext.organizationId);
  if (!existing) {
    return fail('ORG_NOT_FOUND', 'Organization does not exist');
  }

  const result = applyTransition(existing);
  if (!result.success) return result;

  const now = new Date().toISOString();
  const updated = { ...result.data, updatedAt: now, updatedBy: tenantContext.userId };

  await deps.organizationRepository.update(updated);

  await deps.auditService.record({
    organizationId: tenantContext.organizationId,
    entityType: 'organization',
    entityId: tenantContext.organizationId,
    action: 'suspended',
    performedBy: tenantContext.userId,
    changes: { status: { from: 'active', to: 'suspended' } },
  });

  return { success: true, data: updated };
}
