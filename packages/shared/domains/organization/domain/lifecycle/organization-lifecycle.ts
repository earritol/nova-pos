import type { Organization } from '../organization';
import type { Result } from '../result';
import { ok, fail } from '../result';

export function suspendOrganization(org: Organization): Result<Organization> {
  if (org.status !== 'active') {
    return fail('INVALID_STATE_TRANSITION', 'Only active organizations can be suspended');
  }

  return ok({ ...org, status: 'suspended' as const });
}

export function reactivateOrganization(org: Organization): Result<Organization> {
  if (org.status !== 'suspended') {
    return fail('INVALID_STATE_TRANSITION', 'Only suspended organizations can be reactivated');
  }

  return ok({ ...org, status: 'active' as const });
}
