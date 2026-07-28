import { getDatabase } from './database';
import type { Organization } from '../../domain/organization';
import type { Branch } from '../../domain/branch';
import type { OrganizationRepository } from '../../domain/repositories/organization-repository';

export interface LocalOrganization extends Organization {
  _syncStatus: 'synced' | 'pending' | 'conflict';
  _lastSyncedAt: string | null;
  _localVersion: number;
  _remoteVersion: number;
}

export interface LocalBranch extends Branch {
  _syncStatus: 'synced' | 'pending' | 'conflict';
  _lastSyncedAt: string | null;
  _localVersion: number;
  _remoteVersion: number;
}

const ORG_STORE = 'organizations';
const BRANCH_STORE = 'branches';

function toLocalOrgRecord(org: Organization): LocalOrganization {
  return {
    ...org,
    _syncStatus: 'pending',
    _lastSyncedAt: null,
    _localVersion: 1,
    _remoteVersion: 0,
  };
}

function toOrgDomain(local: LocalOrganization): Organization {
  const { _syncStatus, _lastSyncedAt, _localVersion, _remoteVersion, ...org } = local;
  return org;
}

function toLocalBranchRecord(branch: Branch): LocalBranch {
  return {
    ...branch,
    _syncStatus: 'pending',
    _lastSyncedAt: null,
    _localVersion: 1,
    _remoteVersion: 0,
  };
}

function toBranchDomain(local: LocalBranch): Branch {
  const { _syncStatus, _lastSyncedAt, _localVersion, _remoteVersion, ...branch } = local;
  return branch;
}

export class OrganizationLocalStore implements OrganizationRepository {
  // Organization operations

  async save(org: Organization): Promise<void> {
    const db = await getDatabase();
    await db.put(ORG_STORE, toLocalOrgRecord(org));
  }

  async findById(orgId: string): Promise<Organization | null> {
    const db = await getDatabase();
    const record = await db.get(ORG_STORE, orgId) as LocalOrganization | undefined;
    return record ? toOrgDomain(record) : null;
  }

  async findByTaxIdentifier(taxId: string, country: string): Promise<Organization | null> {
    const db = await getDatabase();
    const all = await db.getAll(ORG_STORE) as LocalOrganization[];
    const found = all.find((o) => o.taxIdentifier === taxId && o.country === country);
    return found ? toOrgDomain(found) : null;
  }

  async update(org: Organization): Promise<void> {
    const db = await getDatabase();
    const existing = await db.get(ORG_STORE, org.id) as LocalOrganization | undefined;
    if (!existing) return;
    const updated: LocalOrganization = {
      ...existing,
      ...org,
      _syncStatus: 'pending',
      _localVersion: existing._localVersion + 1,
    };
    await db.put(ORG_STORE, updated);
  }

  // Branch operations

  async saveBranch(_orgId: string, branch: Branch): Promise<void> {
    const db = await getDatabase();
    await db.put(BRANCH_STORE, toLocalBranchRecord(branch));
  }

  async findBranchById(orgId: string, branchId: string): Promise<Branch | null> {
    const db = await getDatabase();
    const record = await db.get(BRANCH_STORE, branchId) as LocalBranch | undefined;
    if (!record || record.organizationId !== orgId) return null;
    return toBranchDomain(record);
  }

  async findBranchByCode(orgId: string, code: string): Promise<Branch | null> {
    const db = await getDatabase();
    const all = await db.getAllFromIndex(BRANCH_STORE, 'by_org', orgId) as LocalBranch[];
    const found = all.find((b) => b.code === code);
    return found ? toBranchDomain(found) : null;
  }

  async findBranchByName(orgId: string, name: string): Promise<Branch | null> {
    const db = await getDatabase();
    const all = await db.getAllFromIndex(BRANCH_STORE, 'by_org', orgId) as LocalBranch[];
    const found = all.find((b) => b.name === name);
    return found ? toBranchDomain(found) : null;
  }

  async findAllBranches(orgId: string): Promise<Branch[]> {
    const db = await getDatabase();
    const all = await db.getAllFromIndex(BRANCH_STORE, 'by_org', orgId) as LocalBranch[];
    return all.map(toBranchDomain);
  }

  async updateBranch(_orgId: string, branch: Branch): Promise<void> {
    const db = await getDatabase();
    const existing = await db.get(BRANCH_STORE, branch.id) as LocalBranch | undefined;
    if (!existing) return;
    const updated: LocalBranch = {
      ...existing,
      ...branch,
      _syncStatus: 'pending',
      _localVersion: existing._localVersion + 1,
    };
    await db.put(BRANCH_STORE, updated);
  }

  async hasActiveDependencies(_orgId: string, _branchId: string): Promise<boolean> {
    // Will be extended when POS Terminal, Sales, etc. are implemented.
    return false;
  }
}
