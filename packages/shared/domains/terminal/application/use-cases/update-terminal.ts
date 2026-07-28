import type { Terminal } from '../../domain/terminal';
import type { TerminalRepository } from '../../domain/repositories/terminal-repository';
import type { AuditService } from '../../../organization/domain/audit';
import type { TenantContext } from '../../../organization/domain/tenant-context';
import type { UpdateTerminalInput } from '../../domain/validation/terminal-validation';
import type { Result } from '../../../organization/domain/result';
import type { SyncQueue } from '../../../../sync/types';
import { ok, fail } from '../../../organization/domain/result';
import { validateUpdateTerminal } from '../../domain/validation/terminal-validation';

export interface UpdateTerminalDeps {
  terminalRepository: TerminalRepository;
  auditService: AuditService;
  syncQueue: SyncQueue;
}

export async function updateTerminal(
  tenantContext: TenantContext,
  terminalId: string,
  input: UpdateTerminalInput,
  deps: UpdateTerminalDeps,
): Promise<Result<Terminal>> {
  const validation = validateUpdateTerminal(input);
  if (!validation.valid) {
    return fail('VALIDATION_ERROR', 'Invalid terminal data', validation.errors);
  }

  const existing = await deps.terminalRepository.findById(tenantContext.organizationId, terminalId);
  if (!existing) {
    return fail('TERMINAL_NOT_FOUND', 'Terminal does not exist');
  }

  if (input.code !== undefined && input.code !== existing.code) {
    const duplicate = await deps.terminalRepository.findByCode(tenantContext.organizationId, input.code);
    if (duplicate) {
      return fail('DUPLICATE_TERMINAL_CODE', 'Terminal code already exists in this organization');
    }
  }

  const now = new Date().toISOString();
  const changes: Record<string, { from: unknown; to: unknown }> = {};
  const updated: Terminal = { ...existing, updatedAt: now, updatedBy: tenantContext.userId };

  if (input.code !== undefined && input.code !== existing.code) {
    changes['code'] = { from: existing.code, to: input.code };
    updated.code = input.code;
  }
  if (input.name !== undefined && input.name !== existing.name) {
    changes['name'] = { from: existing.name, to: input.name };
    updated.name = input.name;
  }

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
    action: 'updated',
    performedBy: tenantContext.userId,
    changes,
  });

  return ok(updated);
}
