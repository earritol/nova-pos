import type { Terminal } from '../../domain/terminal';
import type { TerminalRepository } from '../../domain/repositories/terminal-repository';
import type { TenantContext } from '../../../organization/domain/tenant-context';
import type { Result } from '../../../organization/domain/result';
import { ok, fail } from '../../../organization/domain/result';

export interface GetTerminalDetailsDeps {
  terminalRepository: TerminalRepository;
}

export async function getTerminalDetails(
  tenantContext: TenantContext,
  terminalId: string,
  deps: GetTerminalDetailsDeps,
): Promise<Result<Terminal>> {
  const terminal = await deps.terminalRepository.findById(tenantContext.organizationId, terminalId);
  if (!terminal) {
    return fail('TERMINAL_NOT_FOUND', 'Terminal does not exist');
  }
  return ok(terminal);
}
