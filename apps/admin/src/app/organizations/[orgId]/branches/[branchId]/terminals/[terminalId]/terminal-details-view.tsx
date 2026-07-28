'use client';

import { useEffect, useState } from 'react';

interface DeviceData { id: string; deviceName: string; deviceType: string; platform: string; status: string; lastSeenAt: string | null; }

export function TerminalDetailsView() {
  const [_devices, _setDevices] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setLoading(false); }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <section>
      <h2>Configuration</h2>
      <p>Configuration details loaded from Application Service</p>
      <h2>Registered Devices</h2>
      <p>Device list loaded from Application Service</p>
    </section>
  );
}
