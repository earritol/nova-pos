'use client';

import { useEffect, useState } from 'react';

interface DeviceData {
  id: string;
  deviceName: string;
  deviceType: string;
  platform: string;
  applicationVersion: string;
  status: string;
  lastSeenAt: string | null;
}

export function DeviceListView() {
  const [devices, _setDevices] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setLoading(false); }, []);

  if (loading) return <p>Loading devices...</p>;
  if (devices.length === 0) return <p>No devices registered</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Platform</th>
          <th>Version</th>
          <th>Status</th>
          <th>Last Seen</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {devices.map((d) => (
          <tr key={d.id}>
            <td>{d.deviceName}</td>
            <td>{d.deviceType}</td>
            <td>{d.platform}</td>
            <td>{d.applicationVersion}</td>
            <td>{d.status}</td>
            <td>{d.lastSeenAt ?? 'Never'}</td>
            <td>{d.status === 'active' && <button>Revoke</button>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
