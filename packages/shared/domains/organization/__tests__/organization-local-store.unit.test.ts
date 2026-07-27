import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { OrganizationLocalStore } from '../infrastructure/local/organization-local-store';
import type { Organization } from '../domain/organization';

function createOrg(overrides: Partial<Organization> = {}): Organization {
  return {
    id: crypto.randomUUID(),
    legalName: 'Test Legal',
    tradeName: 'Test Trade',
    taxIdentifier: 'TAX123',
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

describe('OrganizationLocalStore', () => {
  let store: OrganizationLocalStore;

  beforeEach(() => {
    store = new OrganizationLocalStore();
  });

  it('saves and retrieves an organization by ID', async () => {
    const org = createOrg();
    await store.save(org);
    const found = await store.findById(org.id);
    expect(found).not.toBeNull();
    expect(found!.id).toBe(org.id);
    expect(found!.legalName).toBe(org.legalName);
  });

  it('returns null for non-existent ID', async () => {
    const found = await store.findById('non-existent');
    expect(found).toBeNull();
  });

  it('finds organization by tax identifier and country', async () => {
    const org = createOrg({ taxIdentifier: 'UNIQUE123', country: 'MEX' });
    await store.save(org);
    const found = await store.findByTaxIdentifier('UNIQUE123', 'MEX');
    expect(found).not.toBeNull();
    expect(found!.id).toBe(org.id);
  });

  it('returns null when tax identifier does not match', async () => {
    const org = createOrg({ taxIdentifier: 'ABC', country: 'MEX' });
    await store.save(org);
    const found = await store.findByTaxIdentifier('ABC', 'USA');
    expect(found).toBeNull();
  });

  it('updates an existing organization', async () => {
    const org = createOrg();
    await store.save(org);
    const updated = { ...org, tradeName: 'Updated Trade' };
    await store.update(updated);
    const found = await store.findById(org.id);
    expect(found!.tradeName).toBe('Updated Trade');
  });
});
