import type { Branch } from '../branch';
import type { Result } from '../result';
import { ok, fail } from '../result';

export function deactivateBranch(branch: Branch, hasDependencies: boolean): Result<Branch> {
  if (branch.status !== 'active') {
    return fail('INVALID_STATE_TRANSITION', 'Only active branches can be deactivated');
  }

  if (hasDependencies) {
    return fail('BRANCH_HAS_DEPENDENCIES', 'Branch cannot be deactivated while it has unresolved operational dependencies');
  }

  return ok({ ...branch, status: 'inactive' as const });
}

export function reactivateBranch(branch: Branch): Result<Branch> {
  if (branch.status !== 'inactive') {
    return fail('INVALID_STATE_TRANSITION', 'Only inactive branches can be reactivated');
  }

  return ok({ ...branch, status: 'active' as const });
}
