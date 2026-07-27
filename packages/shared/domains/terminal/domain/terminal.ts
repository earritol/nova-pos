import type { TerminalConfiguration } from './terminal-configuration';

export type TerminalStatus = 'active' | 'suspended';

export interface Terminal {
  id: string;
  organizationId: string;
  branchId: string;
  code: string;
  name: string;
  configuration: TerminalConfiguration;
  status: TerminalStatus;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
