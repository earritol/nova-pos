'use client';

import { useEffect, useState } from 'react';

interface BranchData {
  id: string;
  name: string;
  address: string;
  phone: string;
  status: 'active' | 'inactive';
}

export function BranchListView() {
  const [branches, _setBranches] = useState<BranchData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Load from OrganizationApplicationService via local store
    setLoading(false);
  }, []);

  if (loading) return <p>Loading branches...</p>;
  if (branches.length === 0) return <p>No branches found</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>Phone</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {branches.map((branch) => (
          <tr key={branch.id}>
            <td>{branch.name}</td>
            <td>{branch.address}</td>
            <td>{branch.phone}</td>
            <td>{branch.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
