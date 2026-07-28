import type { Terminal } from '../../domain/terminal';
import type { TerminalRepository } from '../../domain/repositories/terminal-repository';
import type { AuditService } from '../../../organization/domain/audit';
import type { TenantContext } from '../../../organization/domain/tenant-context';
import type { OrganizationConfiguration } from '../../../organization/domain/organization-configuration';
import type { Result } from '../../../organization/domain/result';
import type { SyncQueue } from '../../../../sync/types';
import { ok, fail } from '../../../organization/domain/result';
import { createDefaultTerminalConfiguration } from '../../domain/terminal-configuration';

export interface RestoreDefaultConfigurationDeps {
  terminalRepository: TerminalRepository;
  auditService: AuditService;
  syncQueue: SyncQueue;
}

export async function restoreDefaultConfiguration(
  tenantContext: TenantContext,
  terminalId: string,
  orgConfig: OrganizationConfiguration,
  deps: RestoreDefaultConfigurationDeps,
): Promise<Result<Terminal>> {
  const existing = await deps.terminalRepository.findById(tenantContext.organizationId, terminalId);
  if (!existing) {
    return fail('TERMINAL_NOT_FOUND', 'Terminal does not exist');
  }

  const now = new Date().toISOString();
  const defaultConfig = createDefaultTerminalConfiguration(orgConfig);

  const updated: Terminal = {
    ...existing,
    configuration: defaultConfig,
    updatedAt: now,
    updatedBy: tenantContext.userId,
  };

  await deps.terminalRepository.update(updated);

  await deps.syncQueue.enqueue({
    entityType: 'terminal',
    entityId: terminalId,
    operationType: 'update',
    payload: updated as unknown as Record<string, unknown>,
    createdAt: now,
  });

  await deps.auditService.record({
    organizationId: tenantContext.organizationId,
    entityType: 'terminal_configuration',
    entityId: terminalId,
    action: 'updated',
    performedBy: tenantContext.userId,
    changes: { restored: { from: false, to: true } },
  });

  return ok(updated);
}
