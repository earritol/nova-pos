import type { Terminal } from '../terminal';
import type { Result } from '../../../organization/domain/result';
import { ok, fail } from '../../../organization/domain/result';

export function suspendTerminal(terminal: Terminal, hasDependencies: boolean): Result<Terminal> {
  if (terminal.status !== 'active') {
    return fail('INVALID_STATE_TRANSITION', 'Only active terminals can be suspended');
  }

  if (hasDependencies) {
    return fail('TERMINAL_HAS_DEPENDENCIES', 'Terminal cannot be suspended while it has active sessions or pending operations');
  }

  return ok({ ...terminal, status: 'suspended' as const });
}

export function reactivateTerminal(terminal: Terminal): Result<Terminal> {
  if (terminal.status !== 'suspended') {
    return fail('INVALID_STATE_TRANSITION', 'Only suspended terminals can be reactivated');
  }

  return ok({ ...terminal, status: 'active' as const });
}
