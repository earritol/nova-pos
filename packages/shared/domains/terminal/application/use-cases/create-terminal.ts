import type { Terminal } from '../../domain/terminal';
import type { TerminalRepository } from '../../domain/repositories/terminal-repository';
import type { AuditService } from '../../../organization/domain/audit';
import type { Result } from '../../../organization/domain/result';
import type { CreateTerminalInput } from '../../domain/validation/terminal-validation';
import type { OrganizationConfiguration } from '../../../organization/domain/organization-configuration';
import type { SyncQueue } from '../../../../sync/types';
import { ok, fail } from '../../../organization/domain/result';
import { validateCreateTerminal } from '../../domain/validation/terminal-validation';
import { createDefaultTerminalConfiguration } from '../../domain/terminal-configuration';

export interface CreateTerminalDeps {
  terminalRepository: TerminalRepository;
  auditService: AuditService;
  syncQueue: SyncQueue;
}

export async function createTerminal(
  orgId: string,
  branchId: string,
  input: CreateTerminalInput,
  actorId: string,
  orgConfig: OrganizationConfiguration,
  deps: CreateTerminalDeps,
): Promise<Result<Terminal>> {
  const validation = validateCreateTerminal(input);
  if (!validation.valid) {
    return fail('VALIDATION_ERROR', 'Invalid terminal data', validation.errors);
  }

  const existing = await deps.terminalRepository.findByCode(orgId, input.code);
  if (existing) {
    return fail('DUPLICATE_TERMINAL_CODE', 'Terminal code already exists in this organization');
  }

  const now = new Date().toISOString();
  const configuration = createDefaultTerminalConfiguration(orgConfig);

  const terminal: Terminal = {
    id: crypto.randomUUID(),
    organizationId: orgId,
    branchId,
    code: input.code,
    name: input.name,
    configuration,
    status: 'active',
    createdAt: now,
    createdBy: actorId,
    updatedAt: now,
    updatedBy: actorId,
  };

  await deps.terminalRepository.save(terminal);

  await deps.syncQueue.enqueue({
    entityType: 'terminal',
    entityId: terminal.id,
    operationType: 'create',
    payload: terminal as unknown as Record<string, unknown>,
    createdAt: now,
  });

  await deps.auditService.record({
    organizationId: orgId,
    entityType: 'terminal',
    entityId: terminal.id,
    action: 'created',
    performedBy: actorId,
    changes: {},
  });

  return ok(terminal);
}
