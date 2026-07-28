import type { Branch } from '../../domain/branch';
import type { BranchRepository } from '../../domain/repositories/branch-repository';
import type { AuditService } from '../../domain/audit';
import type { Result } from '../../domain/result';
import type { CreateBranchInput } from '../../domain/validation/branch-validation';
import { ok, fail } from '../../domain/result';
import { validateCreateBranch } from '../../domain/validation/branch-validation';

export interface CreateBranchDeps {
  branchRepository: BranchRepository;
  auditService: AuditService;
}

export async function createBranch(
  orgId: string,
  input: CreateBranchInput,
  userId: string,
  deps: CreateBranchDeps,
): Promise<Result<Branch>> {
  const validation = validateCreateBranch(input);
  if (!validation.valid) {
    return fail('VALIDATION_ERROR', 'Invalid branch data', validation.errors);
  }

  const existing = await deps.branchRepository.findByName(orgId, input.name);
  if (existing) {
    return fail('DUPLICATE_BRANCH_NAME', 'Branch name already exists in this organization');
  }

  const now = new Date().toISOString();

  const branch: Branch = {
    id: crypto.randomUUID(),
    organizationId: orgId,
    name: input.name,
    code: input.code,
    address: input.address,
    phone: input.phone,
    status: 'active',
    createdAt: now,
    createdBy: userId,
    updatedAt: now,
    updatedBy: userId,
  };

  await deps.branchRepository.save(branch);

  await deps.auditService.record({
    organizationId: orgId,
    entityType: 'branch',
    entityId: branch.id,
    action: 'created',
    performedBy: userId,
    changes: {},
  });

  return ok(branch);
}
