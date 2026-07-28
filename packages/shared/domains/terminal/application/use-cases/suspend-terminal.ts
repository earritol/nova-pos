import type { Terminal } from '../../domain/terminal';
import type { TerminalRepository } from '../../domain/repositories/terminal-repository';
import type { AuditService } from '../../../organization/domain/audit';
import type { TenantContext } from '../../../organization/domain/tenant-context';
import type { Result } from '../../../organization/domain/result';
import type { SyncQueue } from '../../../../sync/types';
import { fail } from '../../../organization/domain/result';
import { suspendTerminal as applyTransition } from '../../domain/lifecycle/terminal-lifecycle';

export interface SuspendTerminalDeps {
  terminalRepository: TerminalRepository;
  auditService: AuditService;
  syncQueue: SyncQueue;
}

export async function suspendTerminalUseCase(
  tenantContext: TenantContext,
  terminalId: string,
  deps: SuspendTerminalDeps,
): Promise<Result<Terminal>> {
  const existing = await deps.terminalRepository.findById(tenantContext.organizationId, terminalId);
  if (!existing) {
    return fail('TERMINAL_NOT_FOUND', 'Terminal does not exist');
  }

  const hasDeps = await deps.terminalRepository.hasActiveDependencies(tenantContext.organizationId, terminalId);
  const result = applyTransition(existing, hasDeps);
  if (!result.success) return result;

  const now = new Date().toISOString();
  const updated = { ...result.data, updatedAt: now, updatedBy: tenantContext.userId };

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
    entityType: 'terminal',
    entityId: terminalId,
    action: 'suspended',
    performedBy: tenantContext.userId,
    changes: { status: { from: 'active', to: 'suspended' } },
  });

  return { success: true, data: updated };
}
