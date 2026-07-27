'use client';

import { useState } from 'react';

export function OrganizationLifecycleActions() {
  const [status, setStatus] = useState<'active' | 'suspended'>('active');
  const [confirming, setConfirming] = useState(false);

  async function handleSuspend() {
    if (!confirming) { setConfirming(true); return; }
    // TODO: Call OrganizationApplicationService.suspendOrganization()
    setStatus('suspended');
    setConfirming(false);
  }

  async function handleReactivate() {
    // TODO: Call OrganizationApplicationService.reactivateOrganization()
    setStatus('active');
  }

  return (
    <section>
      <p>Current status: <strong>{status}</strong></p>

      {status === 'active' && (
        <div>
          {confirming && <p>Are you sure you want to suspend this organization? Transactional operations will be blocked.</p>}
          <button onClick={handleSuspend}>
            {confirming ? 'Confirm Suspension' : 'Suspend Organization'}
          </button>
          {confirming && <button onClick={() => setConfirming(false)}>Cancel</button>}
        </div>
      )}

      {status === 'suspended' && (
        <button onClick={handleReactivate}>Reactivate Organization</button>
      )}
    </section>
  );
}
