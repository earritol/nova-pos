'use client';

import { useEffect, useState } from 'react';

interface OrganizationData {
  id: string;
  legalName: string;
  commercialName: string;
  taxIdentifier: string;
  country: string;
  configuration: {
    timeZone: string;
    currency: string;
    language: string;
    regionalPreferences: {
      dateFormat: string;
      numberFormat: string;
      taxLabel: string;
    };
  };
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  status: string;
}

type SyncStatusInfo = 'synced' | 'pending' | 'conflict';

export function OrganizationView() {
  const [organization, _setOrganization] = useState<OrganizationData | null>(null);
  const [syncStatus, _setSyncStatus] = useState<SyncStatusInfo>('synced');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Load from OrganizationApplicationService via local store
    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!organization) return <p>Organization not found</p>;

  return (
    <article>
      <header>
        <h2>{organization.commercialName}</h2>
        <span aria-label="sync status">{syncStatus === 'synced' ? '✓ Synced' : syncStatus === 'pending' ? '⏳ Pending sync' : '⚠️ Conflict'}</span>
      </header>

      <dl>
        <dt>Legal Name</dt>
        <dd>{organization.legalName}</dd>

        <dt>Commercial Name</dt>
        <dd>{organization.commercialName}</dd>

        <dt>Tax Identifier</dt>
        <dd>{organization.taxIdentifier}</dd>

        <dt>Country</dt>
        <dd>{organization.country}</dd>

        <dt>Status</dt>
        <dd>{organization.status}</dd>

        <dt>Time Zone</dt>
        <dd>{organization.configuration.timeZone}</dd>

        <dt>Currency</dt>
        <dd>{organization.configuration.currency}</dd>

        <dt>Language</dt>
        <dd>{organization.configuration.language}</dd>

        <dt>Date Format</dt>
        <dd>{organization.configuration.regionalPreferences.dateFormat}</dd>

        {organization.contactEmail && (
          <>
            <dt>Contact Email</dt>
            <dd>{organization.contactEmail}</dd>
          </>
        )}

        {organization.contactPhone && (
          <>
            <dt>Contact Phone</dt>
            <dd>{organization.contactPhone}</dd>
          </>
        )}

        {organization.address && (
          <>
            <dt>Address</dt>
            <dd>{organization.address}</dd>
          </>
        )}
      </dl>
    </article>
  );
}
