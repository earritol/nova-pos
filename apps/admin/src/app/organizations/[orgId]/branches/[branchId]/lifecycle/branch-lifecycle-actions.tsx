'use client';

import { useState } from 'react';

export function BranchLifecycleActions() {
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  async function handleDeactivate() {
    if (!confirming) { setConfirming(true); return; }
    setError(null);
    // TODO: Call OrganizationApplicationService.deactivateBranch()
    // On BRANCH_HAS_DEPENDENCIES error, display the error
    setStatus('inactive');
    setConfirming(false);
  }

  async function handleReactivate() {
    setError(null);
    // TODO: Call OrganizationApplicationService.reactivateBranch()
    setStatus('active');
  }

  return (
    <section>
      <p>Current status: <strong>{status}</strong></p>

      {error && <p role="alert">{error}</p>}

      {status === 'active' && (
        <div>
          {confirming && <p>Are you sure you want to deactivate this branch?</p>}
          <button onClick={handleDeactivate}>
            {confirming ? 'Confirm Deactivation' : 'Deactivate Branch'}
          </button>
          {confirming && <button onClick={() => setConfirming(false)}>Cancel</button>}
        </div>
      )}

      {status === 'inactive' && (
        <button onClick={handleReactivate}>Reactivate Branch</button>
      )}
    </section>
  );
}
