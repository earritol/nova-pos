import type { SupabaseClient } from '@supabase/supabase-js';
import type { Organization } from '../../domain/organization';
import type { Branch } from '../../domain/branch';
import type { OrganizationRepository } from '../../domain/repositories/organization-repository';

export class OrganizationRemoteRepository implements OrganizationRepository {
  constructor(private readonly client: SupabaseClient) {}

  // Organization operations

  async save(org: Organization): Promise<void> {
    const { error } = await this.client.from('organizations').insert({
      id: org.id,
      legal_name: org.legalName,
      commercial_name: org.commercialName,
      tax_identifier: org.taxIdentifier,
      country: org.country,
      time_zone: org.configuration.timeZone,
      currency: org.configuration.currency,
      language: org.configuration.language,
      regional_preferences: org.configuration.regionalPreferences,
      contact_email: org.contactEmail,
      contact_phone: org.contactPhone,
      address: org.address,
      status: org.status,
      created_at: org.createdAt,
      created_by: org.createdBy,
      updated_at: org.updatedAt,
      updated_by: org.updatedBy,
    });
    if (error) throw new Error(error.message);
  }

  async findById(orgId: string): Promise<Organization | null> {
    const { data, error } = await this.client
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single();
    if (error || !data) return null;
    return this.toOrgDomain(data);
  }

  async findByTaxIdentifier(taxId: string, country: string): Promise<Organization | null> {
    const { data, error } = await this.client
      .from('organizations')
      .select('*')
      .eq('tax_identifier', taxId)
      .eq('country', country)
      .single();
    if (error || !data) return null;
    return this.toOrgDomain(data);
  }

  async update(org: Organization): Promise<void> {
    const { error } = await this.client
      .from('organizations')
      .update({
        legal_name: org.legalName,
        commercial_name: org.commercialName,
        tax_identifier: org.taxIdentifier,
        country: org.country,
        time_zone: org.configuration.timeZone,
        currency: org.configuration.currency,
        language: org.configuration.language,
        regional_preferences: org.configuration.regionalPreferences,
        contact_email: org.contactEmail,
        contact_phone: org.contactPhone,
        address: org.address,
        status: org.status,
        updated_at: org.updatedAt,
        updated_by: org.updatedBy,
      })
      .eq('id', org.id);
    if (error) throw new Error(error.message);
  }

  // Branch operations

  async saveBranch(_orgId: string, branch: Branch): Promise<void> {
    const { error } = await this.client.from('branches').insert({
      id: branch.id,
      organization_id: branch.organizationId,
      name: branch.name,
      code: branch.code,
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

  async findBranchById(orgId: string, branchId: string): Promise<Branch | null> {
    const { data, error } = await this.client
      .from('branches')
      .select('*')
      .eq('id', branchId)
      .eq('organization_id', orgId)
      .single();
    if (error || !data) return null;
    return this.toBranchDomain(data);
  }

  async findBranchByCode(orgId: string, code: string): Promise<Branch | null> {
    const { data, error } = await this.client
      .from('branches')
      .select('*')
      .eq('organization_id', orgId)
      .eq('code', code)
      .single();
    if (error || !data) return null;
    return this.toBranchDomain(data);
  }

  async findBranchByName(orgId: string, name: string): Promise<Branch | null> {
    const { data, error } = await this.client
      .from('branches')
      .select('*')
      .eq('organization_id', orgId)
      .eq('name', name)
      .single();
    if (error || !data) return null;
    return this.toBranchDomain(data);
  }

  async findAllBranches(orgId: string): Promise<Branch[]> {
    const { data, error } = await this.client
      .from('branches')
      .select('*')
      .eq('organization_id', orgId);
    if (error || !data) return [];
    return data.map((row: Record<string, unknown>) => this.toBranchDomain(row));
  }

  async updateBranch(_orgId: string, branch: Branch): Promise<void> {
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

  private toOrgDomain(row: Record<string, unknown>): Organization {
    return {
      id: row['id'] as string,
      legalName: row['legal_name'] as string,
      commercialName: row['commercial_name'] as string,
      taxIdentifier: row['tax_identifier'] as string,
      country: row['country'] as string,
      configuration: {
        timeZone: row['time_zone'] as string,
        currency: row['currency'] as string,
        language: row['language'] as string,
        regionalPreferences: row['regional_preferences'] as { dateFormat: string; numberFormat: string; taxLabel: string },
      },
      contactEmail: row['contact_email'] as string | null,
      contactPhone: row['contact_phone'] as string | null,
      address: row['address'] as string | null,
      status: row['status'] as 'active' | 'suspended',
      createdAt: row['created_at'] as string,
      createdBy: row['created_by'] as string,
      updatedAt: row['updated_at'] as string,
      updatedBy: row['updated_by'] as string,
    };
  }

  private toBranchDomain(row: Record<string, unknown>): Branch {
    return {
      id: row['id'] as string,
      organizationId: row['organization_id'] as string,
      name: row['name'] as string,
      code: row['code'] as string,
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
