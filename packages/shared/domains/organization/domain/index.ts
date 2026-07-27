export type { FieldError, AppError, Result } from './result';
export { ok, fail } from './result';
export type { TenantContext } from './tenant-context';
export type { ValidationResult } from './validation';
export type { Organization, OrganizationStatus } from './organization';
export type {
  OrganizationConfiguration,
  RegionalPreferences,
  CountryDefaults,
} from './organization-configuration';
export { getDefaultConfiguration, COUNTRY_DEFAULTS } from './organization-configuration';
export type { Branch, BranchStatus } from './branch';
export type { OrganizationRepository } from './repositories/organization-repository';
export type { BranchRepository } from './repositories/branch-repository';
export type { AuditEntry, AuditAction, AuditService } from './audit';
export type {
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from './validation/organization-validation';
export {
  validateCreateOrganization,
  validateUpdateOrganization,
} from './validation/organization-validation';
export type {
  CreateBranchInput,
  UpdateBranchInput,
} from './validation/branch-validation';
export {
  validateCreateBranch,
  validateUpdateBranch,
} from './validation/branch-validation';
export {
  suspendOrganization,
  reactivateOrganization,
} from './lifecycle/organization-lifecycle';
export {
  deactivateBranch,
  reactivateBranch,
} from './lifecycle/branch-lifecycle';
