import type { Branch } from '../../domain/branch';
import type { BranchRepository } from '../../domain/repositories/branch-repository';
import type { AuditService } from '../../domain/audit';
import type { TenantContext } from '../../domain/tenant-context';
import type { Result } from '../../domain/result';
import { fail } from '../../domain/result';
import { deactivateBranch as applyTransition } from '../../domain/lifecycle/branch-lifecycle';

export interface DeactivateBranchDeps {
  branchRepository: BranchRepository;
  auditService: AuditService;
}

export async function deactivateBranchUseCase(
  tenantContext: TenantContext,
  branchId: string,
  deps: DeactivateBranchDeps,
): Promise<Result<Branch>> {
  const existing = await deps.branchRepository.findById(tenantContext.organizationId, branchId);
  if (!existing) {
    return fail('BRANCH_NOT_FOUND', 'Branch does not exist');
  }

  const hasDeps = await deps.branchRepository.hasActiveDependencies(tenantContext.organizationId, branchId);
  const result = applyTransition(existing, hasDeps);
  if (!result.success) return result;

  const now = new Date().toISOString();
  const updated = { ...result.data, updatedAt: now, updatedBy: tenantContext.userId };

  await deps.branchRepository.update(updated);

  await deps.auditService.record({
    organizationId: tenantContext.organizationId,
    entityType: 'branch',
    entityId: branchId,
    action: 'deactivated',
    performedBy: tenantContext.userId,
    changes: { status: { from: 'active', to: 'inactive' } },
  });

  return { success: true, data: updated };
}
