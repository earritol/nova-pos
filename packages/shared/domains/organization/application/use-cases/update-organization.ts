import type { Organization } from '../../domain/organization';
import type { OrganizationRepository } from '../../domain/repositories/organization-repository';
import type { AuditService } from '../../domain/audit';
import type { Result } from '../../domain/result';
import type { TenantContext } from '../../domain/tenant-context';
import type { UpdateOrganizationInput } from '../../domain/validation/organization-validation';
import { ok, fail } from '../../domain/result';
import { validateUpdateOrganization } from '../../domain/validation/organization-validation';

export interface UpdateOrganizationDeps {
  organizationRepository: OrganizationRepository;
  auditService: AuditService;
}

export async function updateOrganization(
  tenantContext: TenantContext,
  input: UpdateOrganizationInput,
  deps: UpdateOrganizationDeps,
): Promise<Result<Organization>> {
  const validation = validateUpdateOrganization(input);
  if (!validation.valid) {
    return fail('VALIDATION_ERROR', 'Invalid organization data', validation.errors);
  }

  const existing = await deps.organizationRepository.findById(tenantContext.organizationId);
  if (!existing) {
    return fail('ORG_NOT_FOUND', 'Organization does not exist');
  }

  const now = new Date().toISOString();
  const changes: Record<string, { from: unknown; to: unknown }> = {};

  const updated: Organization = { ...existing, updatedAt: now, updatedBy: tenantContext.userId };

  if (input.legalName !== undefined && input.legalName !== existing.legalName) {
    changes['legalName'] = { from: existing.legalName, to: input.legalName };
    updated.legalName = input.legalName;
  }
  if (input.commercialName !== undefined && input.commercialName !== existing.commercialName) {
    changes['commercialName'] = { from: existing.commercialName, to: input.commercialName };
    updated.commercialName = input.commercialName;
  }
  if (input.taxIdentifier !== undefined && input.taxIdentifier !== existing.taxIdentifier) {
    changes['taxIdentifier'] = { from: existing.taxIdentifier, to: input.taxIdentifier };
    updated.taxIdentifier = input.taxIdentifier;
  }
  if (input.contactEmail !== undefined && input.contactEmail !== existing.contactEmail) {
    changes['contactEmail'] = { from: existing.contactEmail, to: input.contactEmail };
    updated.contactEmail = input.contactEmail ?? null;
  }
  if (input.contactPhone !== undefined && input.contactPhone !== existing.contactPhone) {
    changes['contactPhone'] = { from: existing.contactPhone, to: input.contactPhone };
    updated.contactPhone = input.contactPhone ?? null;
  }
  if (input.address !== undefined && input.address !== existing.address) {
    changes['address'] = { from: existing.address, to: input.address };
    updated.address = input.address ?? null;
  }
  if (input.timeZone !== undefined && input.timeZone !== existing.configuration.timeZone) {
    changes['timeZone'] = { from: existing.configuration.timeZone, to: input.timeZone };
    updated.configuration = { ...updated.configuration, timeZone: input.timeZone };
  }
  if (input.currency !== undefined && input.currency !== existing.configuration.currency) {
    changes['currency'] = { from: existing.configuration.currency, to: input.currency };
    updated.configuration = { ...updated.configuration, currency: input.currency };
  }

  await deps.organizationRepository.update(updated);

  await deps.auditService.record({
    organizationId: tenantContext.organizationId,
    entityType: 'organization',
    entityId: tenantContext.organizationId,
    action: 'updated',
    performedBy: tenantContext.userId,
    changes,
  });

  return ok(updated);
}
