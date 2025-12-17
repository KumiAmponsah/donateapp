// C:\Users\cypri\Documents\donateapp\app\components\pages\admin.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { supabase } from '../../../supabase';
import { adminStyles } from '../styles/admin';

// Add these interfaces at the top of admin.tsx instead:
interface AdminStats {
  total_users: number;
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

interface PendingApproval {
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

interface AdminUser {
  id: string;
  email: string;
  role: string;
  is_verified: boolean;
  is_blocked: boolean;
  organization_name: string | null;
  created_at: string;
}

interface AdminModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AdminModal({ visible, onClose }: AdminModalProps) {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PendingApproval | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [activeTabInner, setActiveTabInner] = useState<'dashboard' | 'approvals' | 'users'>('dashboard');

  // Check if user is admin when modal opens
  useEffect(() => {
    if (visible) {
      checkAdminAccess();
    }
  }, [visible]);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Access Denied', 'Please log in to access admin dashboard');
        onClose();
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin access:', error);
        Alert.alert('Error', 'Failed to check permissions');
        onClose();
        return;
      }

      if (profile?.role !== 'admin') {
        Alert.alert('Access Denied', 'You must be an admin to access this page.');
        onClose();
        return;
      }

      loadData();
    } catch (error) {
      console.error('Error checking admin access:', error);
      Alert.alert('Error', 'Failed to check permissions');
      onClose();
    }
  };

  // Load data function
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load stats
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_admin_dashboard_stats');
      
      if (statsError) {
        console.error('Stats error:', statsError);
        throw statsError;
      }
      
      // Convert BIGINT to number
      if (statsData && statsData.length > 0) {
        const stats = statsData[0];
        setStats({
          total_users: Number(stats.total_users) || 0,
          total_organizations: Number(stats.total_organizations) || 0,
          pending_organizations: Number(stats.pending_organizations) || 0,
          total_campaigns: Number(stats.total_campaigns) || 0,
          pending_campaigns: Number(stats.pending_campaigns) || 0,
          total_donations: Number(stats.total_donations) || 0,
          total_amount_raised: Number(stats.total_amount_raised) || 0,
          blocked_users: Number(stats.blocked_users) || 0,
          total_updates: Number(stats.total_updates) || 0,
          pending_updates: Number(stats.pending_updates) || 0
        });
      }

      // Load pending approvals
      const { data: approvalsData, error: approvalsError } = await supabase
        .rpc('get_pending_approvals');
      
      if (approvalsError) {
        console.error('Approvals error:', approvalsError);
        throw approvalsError;
      }
      setPendingApprovals(approvalsData || []);

      // Load all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, email, role, is_verified, is_blocked, organization_name, created_at')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (usersError) {
        console.error('Users error:', usersError);
        throw usersError;
      }
      setUsers(usersData || []);

    } catch (error) {
      console.error('Error loading admin data:', error);
      Alert.alert('Error', 'Failed to load admin data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const handleApprove = async (type: string, id: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let success = false;
    let errorMessage = ''; // Initialize as empty string

    switch (type) {
      case 'organization':
        const { error: orgError } = await supabase
          .rpc('approve_organization', {
            org_id: id,
            admin_user_id: user.id
          });
        success = !orgError;
        errorMessage = orgError?.message || ''; // Add fallback empty string
        break;

      case 'campaign':
        const { error: campaignError } = await supabase
          .rpc('approve_campaign', {
            campaign_id: id,
            admin_user_id: user.id
          });
        success = !campaignError;
        errorMessage = campaignError?.message || ''; // Add fallback empty string
        break;

      case 'update':
        const { error: updateError } = await supabase
          .rpc('approve_update', {
            update_id: id,
            admin_user_id: user.id
          });
        success = !updateError;
        errorMessage = updateError?.message || ''; // Add fallback empty string
        break;
    }

    if (success) {
      Alert.alert('Success', 'Approved successfully');
      loadData();
    } else {
      Alert.alert('Error', `Failed to approve: ${errorMessage || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Error approving:', error);
    Alert.alert('Error', `Failed to approve: ${error.message || 'Unknown error'}`);
  }
};

  const handleReject = async () => {
    if (!selectedItem || !rejectionReason.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .rpc('reject_campaign', {
          campaign_id: selectedItem.id,
          admin_user_id: user.id,
          rejection_reason: rejectionReason
        });

      if (error) throw error;

      Alert.alert('Success', 'Campaign rejected');
      setShowRejectModal(false);
      setRejectionReason('');
      loadData();
    } catch (error: any) {
      console.error('Error rejecting:', error);
      Alert.alert('Error', `Failed to reject: ${error.message || 'Unknown error'}`);
    }
  };

  const handleBlockUser = async () => {
    if (!selectedUser || !blockReason.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .rpc('toggle_user_block', {
          target_user_id: selectedUser.id,
          admin_user_id: user.id,
          block_reason: blockReason,
          block: true
        });

      if (error) throw error;

      Alert.alert('Success', 'User blocked successfully');
      setShowBlockModal(false);
      setBlockReason('');
      loadData();
    } catch (error: any) {
      console.error('Error blocking user:', error);
      Alert.alert('Error', `Failed to block: ${error.message || 'Unknown error'}`);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .rpc('toggle_user_block', {
          target_user_id: userId,
          admin_user_id: user.id,
          block: false
        });

      if (error) throw error;

      Alert.alert('Success', 'User unblocked successfully');
      loadData();
    } catch (error: any) {
      console.error('Error unblocking user:', error);
      Alert.alert('Error', `Failed to unblock: ${error.message || 'Unknown error'}`);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'organization':
        return require('../../../assets/images/organization.png');
      case 'campaign':
        return require('../../../assets/images/campaign.png');
      case 'update':
        return require('../../../assets/images/update.png');
      default:
        return require('../../../assets/images/user.png');
    }
  };

  const getIconColorForType = (type: string) => {
    switch (type) {
      case 'organization':
        return '#4299E1';
      case 'campaign':
        return '#48BB78';
      case 'update':
        return '#ED8936';
      default:
        return '#4A5568';
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <StatusBar style="dark" />
      
      <View style={adminStyles.modalContainer}>
        {/* Modal Header */}
        <View style={adminStyles.modalHeader}>
          <View style={adminStyles.modalHeaderLeft}>
            <TouchableOpacity onPress={onClose} style={adminStyles.closeButton}>
              <Image
                source={require('../../../assets/images/close.png')}
                style={adminStyles.closeIcon}
              />
            </TouchableOpacity>
            <Text style={adminStyles.modalTitle}>Admin Dashboard</Text>
          </View>
          <TouchableOpacity onPress={onRefresh} style={adminStyles.refreshHeaderButton}>
            <Image
              source={require('../../../assets/images/refresh.png')}
              style={adminStyles.refreshIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Admin Tabs */}
        <View style={adminStyles.tabContainer}>
          <TouchableOpacity
            style={[
              adminStyles.tabButton,
              activeTabInner === 'dashboard' && adminStyles.activeTabButton
            ]}
            onPress={() => setActiveTabInner('dashboard')}
          >
            <View style={[
              adminStyles.tabIconContainer,
              activeTabInner === 'dashboard' && adminStyles.activeTabIconContainer
            ]}>
              <Image
                source={require('../../../assets/images/dashboard.png')}
                style={[
                  adminStyles.tabIcon,
                  activeTabInner === 'dashboard' && adminStyles.activeTabIcon
                ]}
              />
            </View>
            <Text style={[
              adminStyles.tabText,
              activeTabInner === 'dashboard' && adminStyles.activeTabText
            ]}>
              Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              adminStyles.tabButton,
              activeTabInner === 'approvals' && adminStyles.activeTabButton
            ]}
            onPress={() => setActiveTabInner('approvals')}
          >
            <View style={[
              adminStyles.tabIconContainer,
              activeTabInner === 'approvals' && adminStyles.activeTabIconContainer
            ]}>
              <Image
                source={require('../../../assets/images/approval.png')}
                style={[
                  adminStyles.tabIcon,
                  activeTabInner === 'approvals' && adminStyles.activeTabIcon
                ]}
              />
            </View>
            <Text style={[
              adminStyles.tabText,
              activeTabInner === 'approvals' && adminStyles.activeTabText
            ]}>
              Approvals {pendingApprovals.length > 0 && (
                <Text style={adminStyles.badgeCount}> ({pendingApprovals.length})</Text>
              )}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              adminStyles.tabButton,
              activeTabInner === 'users' && adminStyles.activeTabButton
            ]}
            onPress={() => setActiveTabInner('users')}
          >
            <View style={[
              adminStyles.tabIconContainer,
              activeTabInner === 'users' && adminStyles.activeTabIconContainer
            ]}>
              <Image
                source={require('../../../assets/images/users.png')}
                style={[
                  adminStyles.tabIcon,
                  activeTabInner === 'users' && adminStyles.activeTabIcon
                ]}
              />
            </View>
            <Text style={[
              adminStyles.tabText,
              activeTabInner === 'users' && adminStyles.activeTabText
            ]}>
              Users
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={adminStyles.scrollView}
          contentContainerStyle={adminStyles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#4A5568"
              colors={['#4A5568']}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={adminStyles.loadingContainer}>
              <ActivityIndicator size="large" color="#4A5568" />
              <Text style={adminStyles.loadingText}>Loading admin dashboard...</Text>
            </View>
          ) : (
            <View style={adminStyles.content}>
              {activeTabInner === 'dashboard' && stats && (
                <>
                  {/* Stats Grid */}
                  <View style={adminStyles.statsGrid}>
                    <View style={adminStyles.statCard}>
                      <View style={adminStyles.statCardHeader}>
                        <Image
                          source={require('../../../assets/images/users.png')}
                          style={adminStyles.statIcon}
                        />
                        <Text style={adminStyles.statTitle}>Total Users</Text>
                      </View>
                      <Text style={adminStyles.statValue}>{stats.total_users.toLocaleString()}</Text>
                      <View style={adminStyles.statTrend}>
                        <Image
                          source={require('../../../assets/images/trend-up.png')}
                          style={adminStyles.trendIcon}
                        />
                        <Text style={adminStyles.trendText}>+12% from last month</Text>
                      </View>
                    </View>

                    <View style={adminStyles.statCard}>
                      <View style={adminStyles.statCardHeader}>
                        <Image
                          source={require('../../../assets/images/organization.png')}
                          style={adminStyles.statIcon}
                        />
                        <Text style={adminStyles.statTitle}>Organizations</Text>
                      </View>
                      <Text style={adminStyles.statValue}>{stats.total_organizations.toLocaleString()}</Text>
                      <View style={adminStyles.statDetails}>
                        <View style={adminStyles.statDetailItem}>
                          <Text style={adminStyles.statDetailLabel}>Active:</Text>
                          <Text style={adminStyles.statDetailValue}>
                            {stats.total_organizations - stats.pending_organizations}
                          </Text>
                        </View>
                        <View style={adminStyles.statDetailItem}>
                          <Text style={adminStyles.statDetailLabel}>Pending:</Text>
                          <Text style={[adminStyles.statDetailValue, adminStyles.pendingValue]}>
                            {stats.pending_organizations}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={[adminStyles.statCard, adminStyles.statCardWide]}>
                      <View style={adminStyles.statCardHeader}>
                        <Image
                          source={require('../../../assets/images/campaign.png')}
                          style={adminStyles.statIcon}
                        />
                        <Text style={adminStyles.statTitle}>Campaigns</Text>
                      </View>
                      <Text style={adminStyles.statValue}>{stats.total_campaigns.toLocaleString()}</Text>
                      <View style={adminStyles.statDetails}>
                        <View style={adminStyles.statDetailItem}>
                          <Text style={adminStyles.statDetailLabel}>Active:</Text>
                          <Text style={adminStyles.statDetailValue}>
                            {stats.total_campaigns - stats.pending_campaigns}
                          </Text>
                        </View>
                        <View style={adminStyles.statDetailItem}>
                          <Text style={adminStyles.statDetailLabel}>Pending:</Text>
                          <Text style={[adminStyles.statDetailValue, adminStyles.pendingValue]}>
                            {stats.pending_campaigns}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={adminStyles.statCard}>
                      <View style={adminStyles.statCardHeader}>
                        <Image
                          source={require('../../../assets/images/money.png')}
                          style={adminStyles.statIcon}
                        />
                        <Text style={adminStyles.statTitle}>Total Raised</Text>
                      </View>
                      <Text style={adminStyles.statValue}>₵{stats.total_amount_raised.toLocaleString()}</Text>
                      <View style={adminStyles.statTrend}>
                        <Image
                          source={require('../../../assets/images/trend-up.png')}
                          style={adminStyles.trendIcon}
                        />
                        <Text style={adminStyles.trendText}>+8.5% from last month</Text>
                      </View>
                    </View>

                    <View style={adminStyles.statCard}>
                      <View style={adminStyles.statCardHeader}>
                        <Image
                          source={require('../../../assets/images/donation.png')}
                          style={adminStyles.statIcon}
                        />
                        <Text style={adminStyles.statTitle}>Donations</Text>
                      </View>
                      <Text style={adminStyles.statValue}>{stats.total_donations.toLocaleString()}</Text>
                      <View style={adminStyles.statTrend}>
                        <Image
                          source={require('../../../assets/images/trend-up.png')}
                          style={adminStyles.trendIcon}
                        />
                        <Text style={adminStyles.trendText}>+15% from last month</Text>
                      </View>
                    </View>
                  </View>

                  {/* Quick Actions */}
                  <View style={adminStyles.section}>
                    <View style={adminStyles.sectionHeader}>
                      <Text style={adminStyles.sectionTitle}>Quick Actions</Text>
                    </View>
                    
                    <TouchableOpacity
                      style={adminStyles.quickActionButton}
                      onPress={() => setActiveTabInner('approvals')}
                      activeOpacity={0.7}
                    >
                      <View style={adminStyles.quickActionLeft}>
                        <View style={[adminStyles.quickActionIcon, { backgroundColor: '#F6E05E20' }]}>
                          <Image
                            source={require('../../../assets/images/approval.png')}
                            style={[adminStyles.quickActionIconImage, { tintColor: '#D69E2E' }]}
                          />
                        </View>
                        <View>
                          <Text style={adminStyles.quickActionTitle}>Pending Approvals</Text>
                          <Text style={adminStyles.quickActionSubtitle}>
                            {pendingApprovals.length} items need your attention
                          </Text>
                        </View>
                      </View>
                      <Image
                        source={require('../../../assets/images/chevron-right.png')}
                        style={adminStyles.chevronIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {activeTabInner === 'approvals' && (
                <View style={adminStyles.section}>
                  <View style={adminStyles.sectionHeader}>
                    <Text style={adminStyles.sectionTitle}>Pending Approvals</Text>
                    <TouchableOpacity onPress={loadData} style={adminStyles.refreshButton}>
                      <Image
                        source={require('../../../assets/images/refresh.png')}
                        style={adminStyles.refreshButtonIcon}
                      />
                      <Text style={adminStyles.refreshButtonText}>Refresh</Text>
                    </TouchableOpacity>
                  </View>

                  {pendingApprovals.length === 0 ? (
                    <View style={adminStyles.emptyState}>
                      <Image
                        source={require('../../../assets/images/check-circle.png')}
                        style={adminStyles.emptyStateIcon}
                      />
                      <Text style={adminStyles.emptyStateTitle}>All caught up!</Text>
                      <Text style={adminStyles.emptyStateSubtitle}>No pending approvals at the moment.</Text>
                    </View>
                  ) : (
                    pendingApprovals.map((item, index) => (
                      <View
                        key={item.id}
                        style={[
                          adminStyles.approvalItem,
                          index === pendingApprovals.length - 1 && adminStyles.lastApprovalItem
                        ]}
                      >
                        <View style={adminStyles.approvalItemLeft}>
                          <View
                            style={[
                              adminStyles.approvalIconContainer,
                              { backgroundColor: `${getIconColorForType(item.type)}15` }
                            ]}
                          >
                            <Image
                              source={getIconForType(item.type)}
                              style={[
                                adminStyles.approvalIcon,
                                { tintColor: getIconColorForType(item.type) }
                              ]}
                            />
                          </View>
                          <View style={adminStyles.approvalContent}>
                            <View style={adminStyles.approvalHeader}>
                              <Text style={adminStyles.approvalTitle} numberOfLines={1}>
                                {item.title}
                              </Text>
                              <View style={[
                                adminStyles.typeBadge,
                                item.type === 'organization' && adminStyles.typeBadgeOrg,
                                item.type === 'campaign' && adminStyles.typeBadgeCampaign,
                                item.type === 'update' && adminStyles.typeBadgeUpdate
                              ]}>
                                <Text style={adminStyles.typeBadgeText}>
                                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                </Text>
                              </View>
                            </View>
                            <Text style={adminStyles.approvalOrganization} numberOfLines={1}>
                              {item.organization_name}
                            </Text>
                            <Text style={adminStyles.approvalDate}>
                              {new Date(item.created_at).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>

                        <View style={adminStyles.approvalActions}>
                          {item.type === 'campaign' && (
                            <TouchableOpacity
                              style={adminStyles.rejectButton}
                              onPress={() => {
                                setSelectedItem(item);
                                setShowRejectModal(true);
                              }}
                            >
                              <Image
                                source={require('../../../assets/images/x-circle.png')}
                                style={adminStyles.actionButtonIcon}
                              />
                              <Text style={adminStyles.rejectButtonText}>Reject</Text>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity
                            style={adminStyles.approveButton}
                            onPress={() => handleApprove(item.type, item.id)}
                          >
                            <Image
                              source={require('../../../assets/images/check-circle.png')}
                              style={adminStyles.actionButtonIcon}
                            />
                            <Text style={adminStyles.approveButtonText}>Approve</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              )}

              {activeTabInner === 'users' && (
                <View style={adminStyles.section}>
                  <View style={adminStyles.sectionHeader}>
                    <Text style={adminStyles.sectionTitle}>All Users</Text>
                    <TouchableOpacity onPress={loadData} style={adminStyles.refreshButton}>
                      <Image
                        source={require('../../../assets/images/refresh.png')}
                        style={adminStyles.refreshButtonIcon}
                      />
                      <Text style={adminStyles.refreshButtonText}>Refresh</Text>
                    </TouchableOpacity>
                  </View>

                  {users.map((user, index) => (
                    <View
                      key={user.id}
                      style={[
                        adminStyles.userItem,
                        index === users.length - 1 && adminStyles.lastUserItem
                      ]}
                    >
                      <View style={adminStyles.userItemLeft}>
                        <View style={adminStyles.userAvatarContainer}>
                          <Image
                            source={require('../../../assets/images/user.png')}
                            style={adminStyles.userAvatar}
                          />
                          {user.is_blocked && (
                            <View style={adminStyles.blockedOverlay}>
                              <Image
                                source={require('../../../assets/images/block.png')}
                                style={adminStyles.blockedIcon}
                              />
                            </View>
                          )}
                        </View>
                        <View style={adminStyles.userContent}>
                          <View style={adminStyles.userHeader}>
                            <Text style={adminStyles.userName} numberOfLines={1}>
                              {user.organization_name || user.email}
                            </Text>
                            <View style={adminStyles.userBadges}>
                              {user.is_blocked && (
                                <View style={adminStyles.blockedBadge}>
                                  <Text style={adminStyles.blockedBadgeText}>Blocked</Text>
                                </View>
                              )}
                              {!user.is_blocked && user.role === 'organization' && !user.is_verified && (
                                <View style={adminStyles.pendingBadge}>
                                  <Text style={adminStyles.pendingBadgeText}>Pending</Text>
                                </View>
                              )}
                              {!user.is_blocked && user.role === 'organization' && user.is_verified && (
                                <View style={adminStyles.verifiedBadge}>
                                  <Text style={adminStyles.verifiedBadgeText}>Verified</Text>
                                </View>
                              )}
                              {user.role === 'admin' && (
                                <View style={adminStyles.adminBadge}>
                                  <Text style={adminStyles.adminBadgeText}>Admin</Text>
                                </View>
                              )}
                            </View>
                          </View>
                          <Text style={adminStyles.userEmail} numberOfLines={1}>
                            {user.email}
                          </Text>
                          <View style={adminStyles.userDetails}>
                            <Text style={adminStyles.userRole}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Text>
                            <Text style={adminStyles.userDot}>•</Text>
                            <Text style={adminStyles.userDate}>
                              Joined {new Date(user.created_at).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={adminStyles.userActions}>
                        {user.is_blocked ? (
                          <TouchableOpacity
                            style={adminStyles.unblockButton}
                            onPress={() => handleUnblockUser(user.id)}
                          >
                            <Image
                              source={require('../../../assets/images/unlock.png')}
                              style={adminStyles.userActionIcon}
                            />
                            <Text style={adminStyles.unblockButtonText}>Unblock</Text>
                          </TouchableOpacity>
                        ) : user.role !== 'admin' ? (
                          <TouchableOpacity
                            style={adminStyles.blockUserButton}
                            onPress={() => {
                              setSelectedUser(user);
                              setShowBlockModal(true);
                            }}
                          >
                            <Image
                              source={require('../../../assets/images/block.png')}
                              style={adminStyles.userActionIcon}
                            />
                            <Text style={adminStyles.blockUserButtonText}>Block</Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>

      {/* Reject Modal */}
      <Modal
        visible={showRejectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={adminStyles.modalOverlay}>
          <View style={adminStyles.modalContent}>
            <Text style={adminStyles.modalTitle}>Reject Campaign</Text>
            <Text style={adminStyles.modalSubtitle}>
              Please provide a reason for rejecting this campaign:
            </Text>
            <TextInput
              style={adminStyles.modalInput}
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChangeText={setRejectionReason}
              multiline
              numberOfLines={4}
              placeholderTextColor="#A0AEC0"
            />
            <View style={adminStyles.modalButtons}>
              <TouchableOpacity
                style={[adminStyles.modalButton, adminStyles.modalButtonCancel]}
                onPress={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
              >
                <Text style={adminStyles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[adminStyles.modalButton, adminStyles.modalButtonConfirm]}
                onPress={handleReject}
                disabled={!rejectionReason.trim()}
              >
                <Text style={adminStyles.modalButtonConfirmText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Block User Modal */}
      <Modal
        visible={showBlockModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBlockModal(false)}
      >
        <View style={adminStyles.modalOverlay}>
          <View style={adminStyles.modalContent}>
            <Text style={adminStyles.modalTitle}>Block User</Text>
            <Text style={adminStyles.modalSubtitle}>
              Please provide a reason for blocking this user:
            </Text>
            <TextInput
              style={adminStyles.modalInput}
              placeholder="Enter block reason..."
              value={blockReason}
              onChangeText={setBlockReason}
              multiline
              numberOfLines={4}
              placeholderTextColor="#A0AEC0"
            />
            <View style={adminStyles.modalButtons}>
              <TouchableOpacity
                style={[adminStyles.modalButton, adminStyles.modalButtonCancel]}
                onPress={() => {
                  setShowBlockModal(false);
                  setBlockReason('');
                }}
              >
                <Text style={adminStyles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[adminStyles.modalButton, adminStyles.modalButtonConfirm]}
                onPress={handleBlockUser}
                disabled={!blockReason.trim()}
              >
                <Text style={adminStyles.modalButtonConfirmText}>Block User</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}