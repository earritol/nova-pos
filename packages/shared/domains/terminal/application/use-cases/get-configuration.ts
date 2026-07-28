import type { TerminalConfiguration } from '../../domain/terminal-configuration';
import type { TerminalRepository } from '../../domain/repositories/terminal-repository';
import type { TenantContext } from '../../../organization/domain/tenant-context';
import type { Result } from '../../../organization/domain/result';
import { ok, fail } from '../../../organization/domain/result';

export interface GetConfigurationDeps {
  terminalRepository: TerminalRepository;
}

export async function getTerminalConfiguration(
  tenantContext: TenantContext,
  terminalId: string,
  deps: GetConfigurationDeps,
): Promise<Result<TerminalConfiguration>> {
  const terminal = await deps.terminalRepository.findById(tenantContext.organizationId, terminalId);
  if (!terminal) {
    return fail('TERMINAL_NOT_FOUND', 'Terminal does not exist');
  }
  return ok(terminal.configuration);
}
