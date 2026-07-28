import type { Terminal } from '../../domain/terminal';
import type { TerminalConfiguration } from '../../domain/terminal-configuration';
import type { TerminalRepository } from '../../domain/repositories/terminal-repository';
import type { AuditService } from '../../../organization/domain/audit';
import type { TenantContext } from '../../../organization/domain/tenant-context';
import type { Result } from '../../../organization/domain/result';
import type { SyncQueue } from '../../../../sync/types';
import { ok, fail } from '../../../organization/domain/result';

export type ConfigurationInput = Partial<TerminalConfiguration>;

export interface UpdateConfigurationDeps {
  terminalRepository: TerminalRepository;
  auditService: AuditService;
  syncQueue: SyncQueue;
}

export async function updateTerminalConfiguration(
  tenantContext: TenantContext,
  terminalId: string,
  input: ConfigurationInput,
  deps: UpdateConfigurationDeps,
): Promise<Result<Terminal>> {
  const existing = await deps.terminalRepository.findById(tenantContext.organizationId, terminalId);
  if (!existing) {
    return fail('TERMINAL_NOT_FOUND', 'Terminal does not exist');
  }

  const now = new Date().toISOString();
  const changes: Record<string, { from: unknown; to: unknown }> = {};
  const newConfig = { ...existing.configuration };

  if (input.currency !== undefined && input.currency !== existing.configuration.currency) {
    changes['configuration.currency'] = { from: existing.configuration.currency, to: input.currency };
    newConfig.currency = input.currency;
  }
  if (input.language !== undefined && input.language !== existing.configuration.language) {
    changes['configuration.language'] = { from: existing.configuration.language, to: input.language };
    newConfig.language = input.language;
  }
  if (input.timezone !== undefined && input.timezone !== existing.configuration.timezone) {
    changes['configuration.timezone'] = { from: existing.configuration.timezone, to: input.timezone };
    newConfig.timezone = input.timezone;
  }
  if (input.offlineEnabled !== undefined && input.offlineEnabled !== existing.configuration.offlineEnabled) {
    changes['configuration.offlineEnabled'] = { from: existing.configuration.offlineEnabled, to: input.offlineEnabled };
    newConfig.offlineEnabled = input.offlineEnabled;
  }
  if (input.syncInterval !== undefined && input.syncInterval !== existing.configuration.syncInterval) {
    changes['configuration.syncInterval'] = { from: existing.configuration.syncInterval, to: input.syncInterval };
    newConfig.syncInterval = input.syncInterval;
  }
  if (input.receiptPrinterEnabled !== undefined && input.receiptPrinterEnabled !== existing.configuration.receiptPrinterEnabled) {
    changes['configuration.receiptPrinterEnabled'] = { from: existing.configuration.receiptPrinterEnabled, to: input.receiptPrinterEnabled };
    newConfig.receiptPrinterEnabled = input.receiptPrinterEnabled;
  }
  if (input.cashDrawerEnabled !== undefined && input.cashDrawerEnabled !== existing.configuration.cashDrawerEnabled) {
    changes['configuration.cashDrawerEnabled'] = { from: existing.configuration.cashDrawerEnabled, to: input.cashDrawerEnabled };
    newConfig.cashDrawerEnabled = input.cashDrawerEnabled;
  }
  if (input.barcodeScannerEnabled !== undefined && input.barcodeScannerEnabled !== existing.configuration.barcodeScannerEnabled) {
    changes['configuration.barcodeScannerEnabled'] = { from: existing.configuration.barcodeScannerEnabled, to: input.barcodeScannerEnabled };
    newConfig.barcodeScannerEnabled = input.barcodeScannerEnabled;
  }

  const updated: Terminal = { ...existing, configuration: newConfig, updatedAt: now, updatedBy: tenantContext.userId };

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
    changes,
  });

  return ok(updated);
}
