import type { Organization } from '../../domain/organization';
import type { OrganizationConfiguration } from '../../domain/organization-configuration';
import type { OrganizationRepository } from '../../domain/repositories/organization-repository';
import type { AuditService } from '../../domain/audit';
import type { TenantContext } from '../../domain/tenant-context';
import type { Result } from '../../domain/result';
import { ok, fail } from '../../domain/result';

export type ConfigurationInput = Partial<OrganizationConfiguration>;

export interface UpdateConfigurationDeps {
  organizationRepository: OrganizationRepository;
  auditService: AuditService;
}

export async function updateConfiguration(
  tenantContext: TenantContext,
  input: ConfigurationInput,
  deps: UpdateConfigurationDeps,
): Promise<Result<Organization>> {
  const existing = await deps.organizationRepository.findById(tenantContext.organizationId);
  if (!existing) {
    return fail('ORG_NOT_FOUND', 'Organization does not exist');
  }

  const now = new Date().toISOString();
  const changes: Record<string, { from: unknown; to: unknown }> = {};
  const newConfig = { ...existing.configuration };

  if (input.timeZone !== undefined && input.timeZone !== existing.configuration.timeZone) {
    changes['configuration.timeZone'] = { from: existing.configuration.timeZone, to: input.timeZone };
    newConfig.timeZone = input.timeZone;
  }
  if (input.currency !== undefined && input.currency !== existing.configuration.currency) {
    changes['configuration.currency'] = { from: existing.configuration.currency, to: input.currency };
    newConfig.currency = input.currency;
  }
  if (input.language !== undefined && input.language !== existing.configuration.language) {
    changes['configuration.language'] = { from: existing.configuration.language, to: input.language };
    newConfig.language = input.language;
  }
  if (input.regionalPreferences !== undefined) {
    changes['configuration.regionalPreferences'] = { from: existing.configuration.regionalPreferences, to: input.regionalPreferences };
    newConfig.regionalPreferences = input.regionalPreferences;
  }

  const updated: Organization = {
    ...existing,
    configuration: newConfig,
    updatedAt: now,
    updatedBy: tenantContext.userId,
  };

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
