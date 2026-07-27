import { getDatabase } from './database';
import type { Organization } from '../../domain/organization';
import type { OrganizationRepository } from '../../domain/repositories/organization-repository';

export interface LocalOrganization extends Organization {
  _syncStatus: 'synced' | 'pending' | 'conflict';
  _lastSyncedAt: string | null;
  _localVersion: number;
  _remoteVersion: number;
}

const STORE_NAME = 'organizations';

function toLocalRecord(org: Organization): LocalOrganization {
  return {
    ...org,
    _syncStatus: 'pending',
    _lastSyncedAt: null,
    _localVersion: 1,
    _remoteVersion: 0,
  };
}

function toDomain(local: LocalOrganization): Organization {
  const { _syncStatus, _lastSyncedAt, _localVersion, _remoteVersion, ...org } = local;
  return org;
}

export class OrganizationLocalStore implements OrganizationRepository {
  async save(org: Organization): Promise<void> {
    const db = await getDatabase();
    await db.put(STORE_NAME, toLocalRecord(org));
  }

  async findById(orgId: string): Promise<Organization | null> {
    const db = await getDatabase();
    const record = await db.get(STORE_NAME, orgId) as LocalOrganization | undefined;
    return record ? toDomain(record) : null;
  }

  async findByTaxIdentifier(taxId: string, country: string): Promise<Organization | null> {
    const db = await getDatabase();
    const all = await db.getAll(STORE_NAME) as LocalOrganization[];
    const found = all.find((o) => o.taxIdentifier === taxId && o.country === country);
    return found ? toDomain(found) : null;
  }

  async update(org: Organization): Promise<void> {
    const db = await getDatabase();
    const existing = await db.get(STORE_NAME, org.id) as LocalOrganization | undefined;
    if (!existing) return;
    const updated: LocalOrganization = {
      ...existing,
      ...org,
      _syncStatus: 'pending',
      _localVersion: existing._localVersion + 1,
    };
    await db.put(STORE_NAME, updated);
  }
}
