import type { Branch } from '../../domain/branch';
import type { OrganizationRepository } from '../../domain/repositories/organization-repository';
import type { AuditService } from '../../domain/audit';
import type { Result } from '../../domain/result';
import type { CreateBranchInput } from '../../domain/validation/branch-validation';
import { ok, fail } from '../../domain/result';
import { validateCreateBranch } from '../../domain/validation/branch-validation';

export interface CreateBranchDeps {
  organizationRepository: OrganizationRepository;
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

  const existingByCode = await deps.organizationRepository.findBranchByCode(orgId, input.code);
  if (existingByCode) {
    return fail('DUPLICATE_BRANCH_CODE', 'Branch code already exists in this organization');
  }

  const existingByName = await deps.organizationRepository.findBranchByName(orgId, input.name);
  if (existingByName) {
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

  await deps.organizationRepository.saveBranch(orgId, branch);

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
