import type { Branch } from '../../domain/branch';
import type { BranchRepository } from '../../domain/repositories/branch-repository';
import type { AuditService } from '../../domain/audit';
import type { TenantContext } from '../../domain/tenant-context';
import type { UpdateBranchInput } from '../../domain/validation/branch-validation';
import type { Result } from '../../domain/result';
import { ok, fail } from '../../domain/result';
import { validateUpdateBranch } from '../../domain/validation/branch-validation';

export interface UpdateBranchDeps {
  branchRepository: BranchRepository;
  auditService: AuditService;
}

export async function updateBranch(
  tenantContext: TenantContext,
  branchId: string,
  input: UpdateBranchInput,
  deps: UpdateBranchDeps,
): Promise<Result<Branch>> {
  const validation = validateUpdateBranch(input);
  if (!validation.valid) {
    return fail('VALIDATION_ERROR', 'Invalid branch data', validation.errors);
  }

  const existing = await deps.branchRepository.findById(tenantContext.organizationId, branchId);
  if (!existing) {
    return fail('BRANCH_NOT_FOUND', 'Branch does not exist');
  }

  if (input.name !== undefined && input.name !== existing.name) {
    const duplicate = await deps.branchRepository.findByName(tenantContext.organizationId, input.name);
    if (duplicate) {
      return fail('DUPLICATE_BRANCH_NAME', 'Branch name already exists in this organization');
    }
  }

  const now = new Date().toISOString();
  const changes: Record<string, { from: unknown; to: unknown }> = {};
  const updated: Branch = { ...existing, updatedAt: now, updatedBy: tenantContext.userId };

  if (input.name !== undefined && input.name !== existing.name) {
    changes['name'] = { from: existing.name, to: input.name };
    updated.name = input.name;
  }
  if (input.address !== undefined && input.address !== existing.address) {
    changes['address'] = { from: existing.address, to: input.address };
    updated.address = input.address;
  }
  if (input.phone !== undefined && input.phone !== existing.phone) {
    changes['phone'] = { from: existing.phone, to: input.phone };
    updated.phone = input.phone;
  }

  await deps.branchRepository.update(updated);

  await deps.auditService.record({
    organizationId: tenantContext.organizationId,
    entityType: 'branch',
    entityId: branchId,
    action: 'updated',
    performedBy: tenantContext.userId,
    changes,
  });

  return ok(updated);
}
