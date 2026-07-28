import type { Terminal } from '../../domain/terminal';
import type { TerminalRepository } from '../../domain/repositories/terminal-repository';
import type { TenantContext } from '../../../organization/domain/tenant-context';
import type { Result } from '../../../organization/domain/result';
import { ok } from '../../../organization/domain/result';

export interface ListTerminalsDeps {
  terminalRepository: TerminalRepository;
}

export async function listTerminals(
  tenantContext: TenantContext,
  branchId: string,
  deps: ListTerminalsDeps,
): Promise<Result<Terminal[]>> {
  const terminals = await deps.terminalRepository.findAllByBranch(tenantContext.organizationId, branchId);
  return ok(terminals);
}
