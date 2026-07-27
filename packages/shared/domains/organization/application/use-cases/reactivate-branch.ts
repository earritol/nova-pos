import type { Branch } from '../../domain/branch';
import type { BranchRepository } from '../../domain/repositories/branch-repository';
import type { AuditService } from '../../domain/audit';
import type { TenantContext } from '../../domain/tenant-context';
import type { Result } from '../../domain/result';
import { fail } from '../../domain/result';
import { reactivateBranch as applyTransition } from '../../domain/lifecycle/branch-lifecycle';

export interface ReactivateBranchDeps {
  branchRepository: BranchRepository;
  auditService: AuditService;
}

export async function reactivateBranchUseCase(
  tenantContext: TenantContext,
  branchId: string,
  deps: ReactivateBranchDeps,
): Promise<Result<Branch>> {
  const existing = await deps.branchRepository.findById(tenantContext.organizationId, branchId);
  if (!existing) {
    return fail('BRANCH_NOT_FOUND', 'Branch does not exist');
  }

  const result = applyTransition(existing);
  if (!result.success) return result;

  const now = new Date().toISOString();
  const updated = { ...result.data, updatedAt: now, updatedBy: tenantContext.userId };

  await deps.branchRepository.update(updated);

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
