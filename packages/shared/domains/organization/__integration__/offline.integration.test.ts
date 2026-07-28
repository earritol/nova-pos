import 'fake-indexeddb/auto';
import { describe, it, expect } from 'vitest';
import { OrganizationLocalStore } from '../infrastructure/local/organization-local-store';
import type { Organization } from '../domain/organization';
import type { Branch } from '../domain/branch';

function makeOrg(overrides: Partial<Organization> = {}): Organization {
  return {
    id: crypto.randomUUID(),
    legalName: 'Test Legal',
    commercialName: 'Test Trade',
    taxIdentifier: 'RFC-' + crypto.randomUUID().slice(0, 8),
    country: 'MEX',
    configuration: {
      timeZone: 'America/Mexico_City',
      currency: 'MXN',
      language: 'es',
      regionalPreferences: { dateFormat: 'DD/MM/YYYY', numberFormat: '1,234.56', taxLabel: 'RFC' },
    },
    contactEmail: null,
    contactPhone: null,
    address: null,
    status: 'active',
    createdAt: new Date().toISOString(),
    createdBy: crypto.randomUUID(),
    updatedAt: new Date().toISOString(),
    updatedBy: crypto.randomUUID(),
    ...overrides,
  };
}

function makeBranch(orgId: string, overrides: Partial<Branch> = {}): Branch {
  return {
    id: crypto.randomUUID(),
    organizationId: orgId,
    name: 'Branch ' + crypto.randomUUID().slice(0, 4),
    code: 'BR-' + crypto.randomUUID().slice(0, 4),
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

describe('Integration: Offline read/write', () => {
  it('creates an organization offline and reads it back from local store', async () => {
    const store = new OrganizationLocalStore();
    const org = makeOrg();
    await store.save(org);
    const found = await store.findById(org.id);
    expect(found).not.toBeNull();
    expect(found!.id).toBe(org.id);
    expect(found!.legalName).toBe(org.legalName);
    expect(found!.commercialName).toBe(org.commercialName);
    expect(found!.taxIdentifier).toBe(org.taxIdentifier);
    expect(found!.country).toBe(org.country);
    expect(found!.status).toBe('active');
  });

  it('creates a branch offline and lists branches correctly', async () => {
    const store = new OrganizationLocalStore();
    const orgId = crypto.randomUUID();
    const branch1 = makeBranch(orgId);
    const branch2 = makeBranch(orgId);
    await store.saveBranch(orgId, branch1);
    await store.saveBranch(orgId, branch2);
    const all = await store.findAllBranches(orgId);
    const ids = all.map((b) => b.id);
    expect(ids).toContain(branch1.id);
    expect(ids).toContain(branch2.id);
  });

  it('updates organization offline and reads the updated data', async () => {
    const store = new OrganizationLocalStore();
    const org = makeOrg();
    await store.save(org);
    const updated = { ...org, commercialName: 'Updated Commercial name' };
    await store.update(updated);
    const found = await store.findById(org.id);
    expect(found!.commercialName).toBe('Updated Commercial name');
  });
});
