'use client';

import { useState } from 'react';

export function TerminalLifecycleActions() {
  const [status, setStatus] = useState<'active' | 'suspended'>('active');
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSuspend() {
    if (!confirming) { setConfirming(true); return; }
    setError(null);
    setStatus('suspended');
    setConfirming(false);
  }

  async function handleReactivate() {
    setError(null);
    setStatus('active');
  }

  return (
    <section>
      <p>Current status: <strong>{status}</strong></p>
      {error && <p role="alert">{error}</p>}
      {status === 'active' && (
        <div>
          {confirming && <p>Are you sure you want to suspend this terminal?</p>}
          <button onClick={handleSuspend}>{confirming ? 'Confirm Suspension' : 'Suspend Terminal'}</button>
          {confirming && <button onClick={() => setConfirming(false)}>Cancel</button>}
        </div>
      )}
      {status === 'suspended' && (
        <button onClick={handleReactivate}>Reactivate Terminal</button>
      )}
    </section>
  );
}
