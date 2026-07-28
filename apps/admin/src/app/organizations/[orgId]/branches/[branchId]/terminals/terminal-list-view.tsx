'use client';

import { useEffect, useState } from 'react';

interface TerminalData {
  id: string;
  code: string;
  name: string;
  status: 'active' | 'suspended';
}

export function TerminalListView() {
  const [terminals, _setTerminals] = useState<TerminalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <p>Loading terminals...</p>;
  if (terminals.length === 0) return <p>No terminals found</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {terminals.map((t) => (
          <tr key={t.id}>
            <td>{t.code}</td>
            <td>{t.name}</td>
            <td>{t.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
