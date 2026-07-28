import type { Organization } from '../../domain/organization';
import type { OrganizationRepository } from '../../domain/repositories/organization-repository';
import type { AuditService } from '../../domain/audit';
import type { Result } from '../../domain/result';
import type { CreateOrganizationInput } from '../../domain/validation/organization-validation';
import { ok, fail } from '../../domain/result';
import { validateCreateOrganization } from '../../domain/validation/organization-validation';
import { getDefaultConfiguration } from '../../domain/organization-configuration';

export interface CreateOrganizationDeps {
  organizationRepository: OrganizationRepository;
  auditService: AuditService;
}

export async function createOrganization(
  input: CreateOrganizationInput,
  userId: string,
  deps: CreateOrganizationDeps,
): Promise<Result<Organization>> {
  const validation = validateCreateOrganization(input);
  if (!validation.valid) {
    return fail('VALIDATION_ERROR', 'Invalid organization data', validation.errors);
  }

  const existing = await deps.organizationRepository.findByTaxIdentifier(input.taxIdentifier, input.country);
  if (existing) {
    return fail('DUPLICATE_TAX_ID', 'Tax identifier is already registered for this country');
  }

  const now = new Date().toISOString();
  const configuration = getDefaultConfiguration(input.country);

  const org: Organization = {
    id: crypto.randomUUID(),
    legalName: input.legalName,
    commercialName: input.commercialName,
    taxIdentifier: input.taxIdentifier,
    country: input.country,
    configuration: {
      ...configuration,
      timeZone: input.timeZone,
      currency: input.currency,
    },
    contactEmail: input.contactEmail ?? null,
    contactPhone: input.contactPhone ?? null,
    address: input.address ?? null,
    status: 'active',
    createdAt: now,
    createdBy: userId,
    updatedAt: now,
    updatedBy: userId,
  };

  await deps.organizationRepository.save(org);

  await deps.auditService.record({
    organizationId: org.id,
    entityType: 'organization',
    entityId: org.id,
    action: 'created',
    performedBy: userId,
    changes: {},
  });

  return ok(org);
}
