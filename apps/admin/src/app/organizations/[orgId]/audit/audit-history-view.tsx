'use client';

import { useEffect, useState } from 'react';

interface AuditEntryData {
  id: string;
  action: string;
  performedBy: string;
  performedAt: string;
  changes: Record<string, { from: unknown; to: unknown }>;
}

export function AuditHistoryView() {
  const [entries, _setEntries] = useState<AuditEntryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Load from AuditService.getHistory() sorted by most recent first
    setLoading(false);
  }, []);

  if (loading) return <p>Loading audit history...</p>;
  if (entries.length === 0) return <p>No audit entries found</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Action</th>
          <th>User</th>
          <th>Timestamp</th>
          <th>Changes</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry.id}>
            <td>{entry.action}</td>
            <td>{entry.performedBy}</td>
            <td>{entry.performedAt}</td>
            <td>
              {Object.entries(entry.changes).map(([field, change]) => (
                <div key={field}>
                  <strong>{field}</strong>: {String(change.from)} → {String(change.to)}
                </div>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
