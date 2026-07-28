import type { SupabaseClient } from '@supabase/supabase-js';
import type { Terminal } from '../../domain/terminal';
import type { TerminalConfiguration } from '../../domain/terminal-configuration';
import type { TerminalRepository } from '../../domain/repositories/terminal-repository';

export class TerminalRemoteRepository implements TerminalRepository {
  constructor(private readonly client: SupabaseClient) {}

  async save(terminal: Terminal): Promise<void> {
    const { error } = await this.client.from('terminals').insert(toRow(terminal));
    if (error) throw new Error(error.message);
  }

  async findById(orgId: string, terminalId: string): Promise<Terminal | null> {
    const { data, error } = await this.client
      .from('terminals')
      .select('*')
      .eq('id', terminalId)
      .eq('organization_id', orgId)
      .single();
    if (error || !data) return null;
    return toDomain(data);
  }

  async findByCode(orgId: string, code: string): Promise<Terminal | null> {
    const { data, error } = await this.client
      .from('terminals')
      .select('*')
      .eq('organization_id', orgId)
      .eq('code', code)
      .single();
    if (error || !data) return null;
    return toDomain(data);
  }

  async findAllByBranch(orgId: string, branchId: string): Promise<Terminal[]> {
    const { data, error } = await this.client
      .from('terminals')
      .select('*')
      .eq('organization_id', orgId)
      .eq('branch_id', branchId);
    if (error || !data) return [];
    return data.map((row: Record<string, unknown>) => toDomain(row));
  }

  async update(terminal: Terminal): Promise<void> {
    const { error } = await this.client
      .from('terminals')
      .update(toRow(terminal))
      .eq('id', terminal.id);
    if (error) throw new Error(error.message);
  }

  async hasActiveDependencies(_orgId: string, _terminalId: string): Promise<boolean> {
    return false;
  }
}

function toRow(terminal: Terminal): Record<string, unknown> {
  return {
    id: terminal.id,
    organization_id: terminal.organizationId,
    branch_id: terminal.branchId,
    code: terminal.code,
    name: terminal.name,
    configuration: terminal.configuration,
    status: terminal.status,
    created_at: terminal.createdAt,
    created_by: terminal.createdBy,
    updated_at: terminal.updatedAt,
    updated_by: terminal.updatedBy,
  };
}

function toDomain(row: Record<string, unknown>): Terminal {
  const config = row['configuration'] as TerminalConfiguration;
  return {
    id: row['id'] as string,
    organizationId: row['organization_id'] as string,
    branchId: row['branch_id'] as string,
    code: row['code'] as string,
    name: row['name'] as string,
    configuration: config,
    status: row['status'] as 'active' | 'suspended',
    createdAt: row['created_at'] as string,
    createdBy: row['created_by'] as string,
    updatedAt: row['updated_at'] as string,
    updatedBy: row['updated_by'] as string,
  };
}
