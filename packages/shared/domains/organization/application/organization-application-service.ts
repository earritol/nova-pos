import type { Organization } from '../domain/organization';
import type { Branch } from '../domain/branch';
import type { OrganizationRepository } from '../domain/repositories/organization-repository';
import type { BranchRepository } from '../domain/repositories/branch-repository';
import type { AuditService } from '../domain/audit';
import type { TenantContext } from '../domain/tenant-context';
import type { Result } from '../domain/result';
import type { CreateOrganizationInput } from '../domain/validation/organization-validation';
import type { UpdateOrganizationInput } from '../domain/validation/organization-validation';
import type { CreateBranchInput } from '../domain/validation/branch-validation';
import type { UpdateBranchInput } from '../domain/validation/branch-validation';
import type { ConfigurationInput } from './use-cases/update-configuration';
import { createOrganization } from './use-cases/create-organization';
import { getOrganization } from './use-cases/get-organization';
import { updateOrganization } from './use-cases/update-organization';
import { updateConfiguration } from './use-cases/update-configuration';
import { suspendOrganizationUseCase } from './use-cases/suspend-organization';
import { reactivateOrganizationUseCase } from './use-cases/reactivate-organization';
import { createBranch } from './use-cases/create-branch';
import { getBranch } from './use-cases/get-branch';
import { listBranches } from './use-cases/list-branches';
import { updateBranch } from './use-cases/update-branch';
import { deactivateBranchUseCase } from './use-cases/deactivate-branch';
import { reactivateBranchUseCase } from './use-cases/reactivate-branch';

export interface OrganizationApplicationServiceDeps {
  organizationRepository: OrganizationRepository;
  branchRepository: BranchRepository;
  auditService: AuditService;
}

export class OrganizationApplicationService {
  private readonly orgRepo: OrganizationRepository;
  private readonly branchRepo: BranchRepository;
  private readonly auditService: AuditService;

  constructor(deps: OrganizationApplicationServiceDeps) {
    this.orgRepo = deps.organizationRepository;
    this.branchRepo = deps.branchRepository;
    this.auditService = deps.auditService;
  }

  async createOrganization(input: CreateOrganizationInput, userId: string): Promise<Result<Organization>> {
    return createOrganization(input, userId, {
      organizationRepository: this.orgRepo,
      auditService: this.auditService,
    });
  }

  async getOrganization(tenantContext: TenantContext): Promise<Result<Organization>> {
    return getOrganization(tenantContext, { organizationRepository: this.orgRepo });
  }

  async updateOrganization(tenantContext: TenantContext, input: UpdateOrganizationInput): Promise<Result<Organization>> {
    return updateOrganization(tenantContext, input, {
      organizationRepository: this.orgRepo,
      auditService: this.auditService,
    });
  }

  async updateConfiguration(tenantContext: TenantContext, input: ConfigurationInput): Promise<Result<Organization>> {
    return updateConfiguration(tenantContext, input, {
      organizationRepository: this.orgRepo,
      auditService: this.auditService,
    });
  }

  async suspendOrganization(tenantContext: TenantContext): Promise<Result<Organization>> {
    return suspendOrganizationUseCase(tenantContext, {
      organizationRepository: this.orgRepo,
      auditService: this.auditService,
    });
  }

  async reactivateOrganization(tenantContext: TenantContext): Promise<Result<Organization>> {
    return reactivateOrganizationUseCase(tenantContext, {
      organizationRepository: this.orgRepo,
      auditService: this.auditService,
    });
  }

  async createBranch(orgId: string, input: CreateBranchInput, userId: string): Promise<Result<Branch>> {
    return createBranch(orgId, input, userId, {
      branchRepository: this.branchRepo,
      auditService: this.auditService,
    });
  }

  async getBranch(tenantContext: TenantContext, branchId: string): Promise<Result<Branch>> {
    return getBranch(tenantContext, branchId, { branchRepository: this.branchRepo });
  }

  async listBranches(tenantContext: TenantContext): Promise<Result<Branch[]>> {
    return listBranches(tenantContext, { branchRepository: this.branchRepo });
  }

  async updateBranch(tenantContext: TenantContext, branchId: string, input: UpdateBranchInput): Promise<Result<Branch>> {
    return updateBranch(tenantContext, branchId, input, {
      branchRepository: this.branchRepo,
      auditService: this.auditService,
    });
  }

  async deactivateBranch(tenantContext: TenantContext, branchId: string): Promise<Result<Branch>> {
    return deactivateBranchUseCase(tenantContext, branchId, {
      branchRepository: this.branchRepo,
      auditService: this.auditService,
    });
  }

  async reactivateBranch(tenantContext: TenantContext, branchId: string): Promise<Result<Branch>> {
    return reactivateBranchUseCase(tenantContext, branchId, {
      branchRepository: this.branchRepo,
      auditService: this.auditService,
    });
  }
}
