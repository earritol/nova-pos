import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { BranchLocalStore } from '../infrastructure/local/branch-local-store';
import type { Branch } from '../domain/branch';

const ORG_ID = '00000000-0000-0000-0000-000000000001';

function createBranch(overrides: Partial<Branch> = {}): Branch {
  return {
    id: crypto.randomUUID(),
    organizationId: ORG_ID,
    name: 'Main Branch',
    address: '123 Main St',
    phone: '555-0100',
    status: 'active',
    createdAt: new Date().toISOString(),
    createdBy: crypto.randomUUID(),
    updatedAt: new Date().toISOString(),
    updatedBy: crypto.randomUUID(),
    ...overrides,
  };
}

describe('BranchLocalStore', () => {
  let store: BranchLocalStore;

  beforeEach(() => {
    store = new BranchLocalStore();
  });

  it('saves and retrieves a branch by ID', async () => {
    const branch = createBranch();
    await store.save(branch);
    const found = await store.findById(ORG_ID, branch.id);
    expect(found).not.toBeNull();
    expect(found!.id).toBe(branch.id);
    expect(found!.name).toBe(branch.name);
  });

  it('returns null for non-existent branch', async () => {
    const found = await store.findById(ORG_ID, 'non-existent');
    expect(found).toBeNull();
  });

  it('returns null when orgId does not match', async () => {
    const branch = createBranch();
    await store.save(branch);
    const found = await store.findById('different-org', branch.id);
    expect(found).toBeNull();
  });

  it('finds a branch by name within organization', async () => {
    const branch = createBranch({ name: 'Centro' });
    await store.save(branch);
    const found = await store.findByName(ORG_ID, 'Centro');
    expect(found).not.toBeNull();
    expect(found!.name).toBe('Centro');
  });

  it('lists all branches for an organization', async () => {
    const id1 = crypto.randomUUID();
    const id2 = crypto.randomUUID();
    await store.save(createBranch({ id: id1, name: 'Branch A' }));
    await store.save(createBranch({ id: id2, name: 'Branch B' }));
    const all = await store.findAllByOrganization(ORG_ID);
    const ids = all.map((b) => b.id);
    expect(ids).toContain(id1);
    expect(ids).toContain(id2);
  });

  it('updates an existing branch', async () => {
    const branch = createBranch();
    await store.save(branch);
    await store.update({ ...branch, name: 'Updated' });
    const found = await store.findById(ORG_ID, branch.id);
    expect(found!.name).toBe('Updated');
  });

  it('hasActiveDependencies returns false (no dependent domains yet)', async () => {
    const result = await store.hasActiveDependencies(ORG_ID, 'any-id');
    expect(result).toBe(false);
  });
});
