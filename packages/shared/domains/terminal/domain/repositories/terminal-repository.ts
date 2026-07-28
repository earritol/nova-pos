import type { Terminal } from '../terminal';

export interface TerminalRepository {
  save(terminal: Terminal): Promise<void>;
  findById(orgId: string, terminalId: string): Promise<Terminal | null>;
  findByCode(orgId: string, code: string): Promise<Terminal | null>;
  findAllByBranch(orgId: string, branchId: string): Promise<Terminal[]>;
  update(terminal: Terminal): Promise<void>;
  hasActiveDependencies(orgId: string, terminalId: string): Promise<boolean>;
}
