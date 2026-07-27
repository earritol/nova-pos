import type { SupabaseClient } from '@supabase/supabase-js';
import type { Branch } from '../../domain/branch';
import type { BranchRepository } from '../../domain/repositories/branch-repository';

export class BranchRemoteRepository implements BranchRepository {
  constructor(private readonly client: SupabaseClient) {}

  async save(branch: Branch): Promise<void> {
    const { error } = await this.client.from('branches').insert({
      id: branch.id,
      organization_id: branch.organizationId,
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      status: branch.status,
      created_at: branch.createdAt,
      created_by: branch.createdBy,
      updated_at: branch.updatedAt,
      updated_by: branch.updatedBy,
    });
    if (error) throw new Error(error.message);
  }

  async findById(orgId: string, branchId: string): Promise<Branch | null> {
    const { data, error } = await this.client
      .from('branches')
      .select('*')
      .eq('id', branchId)
      .eq('organization_id', orgId)
      .single();
    if (error || !data) return null;
    return this.toDomain(data);
  }

  async findByName(orgId: string, name: string): Promise<Branch | null> {
    const { data, error } = await this.client
      .from('branches')
      .select('*')
      .eq('organization_id', orgId)
      .eq('name', name)
      .single();
    if (error || !data) return null;
    return this.toDomain(data);
  }

  async findAllByOrganization(orgId: string): Promise<Branch[]> {
    const { data, error } = await this.client
      .from('branches')
      .select('*')
      .eq('organization_id', orgId);
    if (error || !data) return [];
    return data.map((row: Record<string, unknown>) => this.toDomain(row));
  }

  async update(branch: Branch): Promise<void> {
    const { error } = await this.client
      .from('branches')
      .update({
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        status: branch.status,
        updated_at: branch.updatedAt,
        updated_by: branch.updatedBy,
      })
      .eq('id', branch.id);
    if (error) throw new Error(error.message);
  }

  async hasActiveDependencies(_orgId: string, _branchId: string): Promise<boolean> {
    // Will be extended when POS Terminal, Sales domains are implemented
    return false;
  }

  private toDomain(row: Record<string, unknown>): Branch {
    return {
      id: row['id'] as string,
      organizationId: row['organization_id'] as string,
      name: row['name'] as string,
      address: row['address'] as string,
      phone: row['phone'] as string,
      status: row['status'] as 'active' | 'inactive',
      createdAt: row['created_at'] as string,
      createdBy: row['created_by'] as string,
      updatedAt: row['updated_at'] as string,
      updatedBy: row['updated_by'] as string,
    };
  }
}
