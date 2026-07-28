import type { Branch } from '../../domain/branch';
import type { OrganizationRepository } from '../../domain/repositories/organization-repository';
import type { AuditService } from '../../domain/audit';
import type { TenantContext } from '../../domain/tenant-context';
import type { Result } from '../../domain/result';
import { fail } from '../../domain/result';
import { reactivateBranch as applyTransition } from '../../domain/lifecycle/branch-lifecycle';

export interface ReactivateBranchDeps {
  organizationRepository: OrganizationRepository;
  auditService: AuditService;
}

export async function reactivateBranchUseCase(
  tenantContext: TenantContext,
  branchId: string,
  deps: ReactivateBranchDeps,
): Promise<Result<Branch>> {
  const existing = await deps.organizationRepository.findBranchById(tenantContext.organizationId, branchId);
  if (!existing) {
    return fail('BRANCH_NOT_FOUND', 'Branch does not exist');
  }

  const result = applyTransition(existing);
  if (!result.success) return result;

  const now = new Date().toISOString();
  const updated = { ...result.data, updatedAt: now, updatedBy: tenantContext.userId };

  await deps.organizationRepository.updateBranch(tenantContext.organizationId, updated);

  await deps.auditService.record({
    organizationId: tenantContext.organizationId,
    entityType: 'branch',
    entityId: branchId,
    action: 'reactivated',
    performedBy: tenantContext.userId,
    changes: { status: { from: 'inactive', to: 'active' } },
  });

  return { success: true, data: updated };
}
