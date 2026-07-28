export type BranchStatus = 'active' | 'inactive';

export interface Branch {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  status: BranchStatus;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
