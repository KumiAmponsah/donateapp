// C:\Users\cypri\Documents\donateapp\app\types\admin.ts
export interface AdminStats {
  total_users: number;          // Change these to accept BIGINT/any number
  total_organizations: number;
  pending_organizations: number;
  total_campaigns: number;
  pending_campaigns: number;
  total_donations: number;
  total_amount_raised: number;
  blocked_users: number;
  total_updates: number;
  pending_updates: number;
}

// OR create a separate interface for database results
export interface AdminStatsDB {
  total_users: bigint | number;
  total_organizations: bigint | number;
  pending_organizations: bigint | number;
  total_campaigns: bigint | number;
  pending_campaigns: bigint | number;
  total_donations: bigint | number;
  total_amount_raised: number;
  blocked_users: bigint | number;
  total_updates: bigint | number;
  pending_updates: bigint | number;
}

export interface PendingApproval {
  type: 'organization' | 'campaign' | 'update';
  id: string;
  title: string;
  description: string;
  organization_name: string;
  organization_id: string;
  created_at: string;
  status: string;
  requires_admin_approval: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  is_verified: boolean;
  is_blocked: boolean;
  organization_name: string | null;
  created_at: string;
}

export interface AdminProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}