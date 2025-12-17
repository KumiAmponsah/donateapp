// C:\Users\cypri\Documents\donateapp\app\components\pages\OrganizationDashboardModal.tsx
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
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { supabase } from '../../../supabase';
import { organizationDashboardStyles } from '../styles/organizationDashboard';

// Types
interface OrganizationStats {
  total_campaigns: number;
  active_campaigns: number;
  completed_campaigns: number;
  total_raised: number;
  total_donations: number;
  total_donors: number;
  pending_approvals: number;
}

interface Campaign {
  id: string;
  title: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  amount_raised: number;
  target_amount: number;
  progress_percentage: number;
  donor_count: number;
  created_at: string;
  admin_approved: boolean;
}

interface RecentDonation {
  id: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  campaign_title: string;
  created_at: string;
}

interface DonorInfo {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  organization_name?: string;
}

interface CampaignInfo {
  title?: string;
}

interface DonationData {
  id: string;
  amount: number;
  created_at: string;
  donor: DonorInfo | null;
  campaign: CampaignInfo | null;
}

interface OrganizationDashboardModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function OrganizationDashboardModal({ visible, onClose }: OrganizationDashboardModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [organizationStats, setOrganizationStats] = useState<OrganizationStats | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'donations'>('overview');

  // Load organization data when modal opens
  useEffect(() => {
    if (visible) {
      loadOrganizationData();
    }
  }, [visible]);

  const loadOrganizationData = useCallback(async () => {
  try {
    setLoading(true);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert('Error', 'Please log in to view dashboard');
      onClose();
      return;
    }

    // Get organization profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, organization_name, is_verified, role')
      .eq('user_id', user.id)
      .single();

    if (profileError) throw profileError;

    if (!profile || profile.role !== 'organization') {
      Alert.alert('Error', 'This dashboard is for organizations only');
      onClose();
      return;
    }

    // Load organization statistics - handle errors individually
    try {
      await loadOrganizationStats(profile.id);
    } catch (statsError) {
      console.error('Error loading stats:', statsError);
      // Set default stats
      setOrganizationStats({
        total_campaigns: 0,
        active_campaigns: 0,
        completed_campaigns: 0,
        total_raised: 0,
        total_donations: 0,
        total_donors: 0,
        pending_approvals: 0
      });
    }

    try {
      await loadCampaigns(profile.id);
    } catch (campaignsError) {
      console.error('Error loading campaigns:', campaignsError);
      setCampaigns([]);
    }

    try {
      await loadRecentDonations(profile.id);
    } catch (donationsError) {
      console.error('Error loading donations:', donationsError);
      setRecentDonations([]);
    }

  } catch (error: any) {
    console.error('Error loading organization data:', error);
    Alert.alert('Error', 'Failed to load organization data');
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}, []);

  const loadOrganizationStats = async (organizationId: string) => {
  try {
    // Get total campaigns
    const { data: campaignsData, error: campaignsError } = await supabase
      .from('campaigns')
      .select('id, status, amount_raised, admin_approved')
      .eq('organization_id', organizationId)
      .eq('is_deleted', false);

    if (campaignsError) throw campaignsError;

    const totalCampaigns = campaignsData?.length || 0;
    const activeCampaigns = campaignsData?.filter(c => c.status === 'active' && c.admin_approved).length || 0;
    const completedCampaigns = campaignsData?.filter(c => c.status === 'completed').length || 0;
    const pendingApprovals = campaignsData?.filter(c => !c.admin_approved).length || 0;

    let totalRaised = 0;
    let totalDonations = 0;
    let uniqueDonors = 0;

    if (campaignsData && campaignsData.length > 0) {
      const campaignIds = campaignsData.map(c => c.id);
      
      // Get donations for these campaigns
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select('amount, donor_id')
        .eq('status', 'completed')
        .eq('is_deleted', false)
        .in('campaign_id', campaignIds);

      if (!donationsError && donationsData) {
        totalRaised = donationsData.reduce((sum, donation) => sum + Number(donation.amount || 0), 0);
        totalDonations = donationsData.length;
        uniqueDonors = new Set(donationsData.map(d => d.donor_id)).size;
      }
    }

    setOrganizationStats({
      total_campaigns: totalCampaigns,
      active_campaigns: activeCampaigns,
      completed_campaigns: completedCampaigns,
      total_raised: totalRaised,
      total_donations: totalDonations,
      total_donors: uniqueDonors,
      pending_approvals: pendingApprovals
    });

  } catch (error) {
    console.error('Error loading organization stats:', error);
    // Set default stats if error occurs
    setOrganizationStats({
      total_campaigns: 0,
      active_campaigns: 0,
      completed_campaigns: 0,
      total_raised: 0,
      total_donations: 0,
      total_donors: 0,
      pending_approvals: 0
    });
  }
};

  const loadCampaigns = async (organizationId: string) => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, title, status, amount_raised, target_amount, donor_count, created_at, admin_approved')
        .eq('organization_id', organizationId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      const transformedCampaigns: Campaign[] = (data || []).map(campaign => ({
        id: campaign.id,
        title: campaign.title,
        status: campaign.status as 'draft' | 'active' | 'completed' | 'cancelled',
        amount_raised: Number(campaign.amount_raised) || 0,
        target_amount: Number(campaign.target_amount) || 0,
        progress_percentage: campaign.target_amount > 0 
          ? (Number(campaign.amount_raised) / Number(campaign.target_amount)) * 100 
          : 0,
        donor_count: campaign.donor_count || 0,
        created_at: campaign.created_at,
        admin_approved: campaign.admin_approved || false
      }));

      setCampaigns(transformedCampaigns);

    } catch (error) {
      console.error('Error loading campaigns:', error);
      throw error;
    }
  };

  const loadRecentDonations = async (organizationId: string) => {
  try {
    // Get campaign IDs for this organization
    const { data: campaignsData, error: campaignsError } = await supabase
      .from('campaigns')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('is_deleted', false);

    if (campaignsError) throw campaignsError;

    if (!campaignsData || campaignsData.length === 0) {
      setRecentDonations([]);
      return;
    }

    const campaignIds = campaignsData.map(c => c.id);

    // Get donations for these campaigns
    const { data: donationsData, error: donationsError } = await supabase
      .from('donations')
      .select(`
        id,
        amount,
        created_at,
        donor_id,
        campaign_id,
        donor:profiles!donations_donor_id_fkey (
          id,
          email,
          first_name,
          last_name,
          organization_name
        ),
        campaign:campaigns!donations_campaign_id_fkey (
          title
        )
      `)
      .in('campaign_id', campaignIds)
      .eq('status', 'completed')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(5);

    if (donationsError) {
      console.error('Supabase error details:', donationsError);
      throw donationsError;
    }

    // FIX: Type the data properly
    const typedDonationsData = donationsData as any[];
    
    const transformedDonations: RecentDonation[] = (typedDonationsData || []).map(donation => {
      // Safely access nested properties with optional chaining
      let donorName = 'Anonymous';
      let donorEmail = '';
      
      if (donation.donor) {
        donorName = donation.donor.organization_name 
          || `${donation.donor.first_name || ''} ${donation.donor.last_name || ''}`.trim()
          || donation.donor.email
          || 'Anonymous';
          
        donorEmail = donation.donor.email || '';
      }
      
      const campaignTitle = donation.campaign?.title || 'Unknown Campaign';

      return {
        id: donation.id,
        donor_name: donorName,
        donor_email: donorEmail,
        amount: Number(donation.amount) || 0,
        campaign_title: campaignTitle,
        created_at: donation.created_at
      };
    });

    setRecentDonations(transformedDonations);

  } catch (error) {
    console.error('Error loading recent donations:', error);
    // Don't throw the error, just log it and return empty array
    setRecentDonations([]);
  }
};

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadOrganizationData();
  }, [loadOrganizationData]);

  const handleCreateCampaign = () => {
    onClose();
    router.push('/components/pages/create-campaign');
  };

  const handleViewCampaign = (campaignId: string) => {
    onClose();
    router.push({
      pathname: '/components/pages/description',
      params: { id: campaignId }
    });
  };

  const formatCurrency = (amount: number) => {
    return `₵${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
      
      <View style={organizationDashboardStyles.modalContainer}>
        {/* Modal Header */}
        <View style={organizationDashboardStyles.modalHeader}>
          <View style={organizationDashboardStyles.modalHeaderLeft}>
            <TouchableOpacity onPress={onClose} style={organizationDashboardStyles.closeButton}>
              <Image
                source={require('../../../assets/images/close.png')}
                style={organizationDashboardStyles.closeIcon}
              />
            </TouchableOpacity>
            <Text style={organizationDashboardStyles.modalTitle}>Organization Dashboard</Text>
          </View>
          <TouchableOpacity onPress={onRefresh} style={organizationDashboardStyles.refreshHeaderButton}>
            <Image
              source={require('../../../assets/images/refresh.png')}
              style={organizationDashboardStyles.refreshIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Dashboard Tabs */}
        <View style={organizationDashboardStyles.tabContainer}>
          <TouchableOpacity
            style={[
              organizationDashboardStyles.tabButton,
              activeTab === 'overview' && organizationDashboardStyles.activeTabButton
            ]}
            onPress={() => setActiveTab('overview')}
          >
            <Image
              source={require('../../../assets/images/dashboard.png')}
              style={[
                organizationDashboardStyles.tabIcon,
                activeTab === 'overview' && organizationDashboardStyles.activeTabIcon
              ]}
            />
            <Text style={[
              organizationDashboardStyles.tabText,
              activeTab === 'overview' && organizationDashboardStyles.activeTabText
            ]}>
              Overview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              organizationDashboardStyles.tabButton,
              activeTab === 'campaigns' && organizationDashboardStyles.activeTabButton
            ]}
            onPress={() => setActiveTab('campaigns')}
          >
            <Image
              source={require('../../../assets/images/campaign.png')}
              style={[
                organizationDashboardStyles.tabIcon,
                activeTab === 'campaigns' && organizationDashboardStyles.activeTabIcon
              ]}
            />
            <Text style={[
              organizationDashboardStyles.tabText,
              activeTab === 'campaigns' && organizationDashboardStyles.activeTabText
            ]}>
              Campaigns
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              organizationDashboardStyles.tabButton,
              activeTab === 'donations' && organizationDashboardStyles.activeTabButton
            ]}
            onPress={() => setActiveTab('donations')}
          >
            <Image
              source={require('../../../assets/images/donation.png')}
              style={[
                organizationDashboardStyles.tabIcon,
                activeTab === 'donations' && organizationDashboardStyles.activeTabIcon
              ]}
            />
            <Text style={[
              organizationDashboardStyles.tabText,
              activeTab === 'donations' && organizationDashboardStyles.activeTabText
            ]}>
              Donations
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={organizationDashboardStyles.scrollView}
          contentContainerStyle={organizationDashboardStyles.scrollContent}
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
            <View style={organizationDashboardStyles.loadingContainer}>
              <ActivityIndicator size="large" color="#4A5568" />
              <Text style={organizationDashboardStyles.loadingText}>Loading dashboard...</Text>
            </View>
          ) : (
            <View style={organizationDashboardStyles.content}>
              {activeTab === 'overview' && organizationStats && (
                <>
                  {/* Create Campaign Button */}
                  <TouchableOpacity
                    style={organizationDashboardStyles.createCampaignButton}
                    onPress={handleCreateCampaign}
                  >
                    <View style={organizationDashboardStyles.createCampaignButtonContent}>
                      <Image
                        source={require('../../../assets/images/add.png')}
                        style={organizationDashboardStyles.createCampaignIcon}
                      />
                      <Text style={organizationDashboardStyles.createCampaignText}>
                        Create New Campaign
                      </Text>
                    </View>
                    <Image
                      source={require('../../../assets/images/chevron-right.png')}
                      style={organizationDashboardStyles.chevronIcon}
                    />
                  </TouchableOpacity>

                  {/* Stats Grid */}
                  <View style={organizationDashboardStyles.statsGrid}>
                    <View style={organizationDashboardStyles.statCard}>
                      <View style={organizationDashboardStyles.statCardHeader}>
                        <Image
                          source={require('../../../assets/images/campaign.png')}
                          style={organizationDashboardStyles.statIcon}
                        />
                        <Text style={organizationDashboardStyles.statTitle}>Total Campaigns</Text>
                      </View>
                      <Text style={organizationDashboardStyles.statValue}>
                        {organizationStats.total_campaigns}
                      </Text>
                      <View style={organizationDashboardStyles.statDetails}>
                        <View style={organizationDashboardStyles.statDetailItem}>
                          <Text style={organizationDashboardStyles.statDetailLabel}>Active:</Text>
                          <Text style={organizationDashboardStyles.statDetailValue}>
                            {organizationStats.active_campaigns}
                          </Text>
                        </View>
                        <View style={organizationDashboardStyles.statDetailItem}>
                          <Text style={organizationDashboardStyles.statDetailLabel}>Completed:</Text>
                          <Text style={organizationDashboardStyles.statDetailValue}>
                            {organizationStats.completed_campaigns}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={organizationDashboardStyles.statCard}>
                      <View style={organizationDashboardStyles.statCardHeader}>
                        <Image
                          source={require('../../../assets/images/money.png')}
                          style={organizationDashboardStyles.statIcon}
                        />
                        <Text style={organizationDashboardStyles.statTitle}>Total Raised</Text>
                      </View>
                      <Text style={organizationDashboardStyles.statValue}>
                        {formatCurrency(organizationStats.total_raised)}
                      </Text>
                      <View style={organizationDashboardStyles.statDetails}>
                        <View style={organizationDashboardStyles.statDetailItem}>
                          <Text style={organizationDashboardStyles.statDetailLabel}>Donations:</Text>
                          <Text style={organizationDashboardStyles.statDetailValue}>
                            {organizationStats.total_donations}
                          </Text>
                        </View>
                        <View style={organizationDashboardStyles.statDetailItem}>
                          <Text style={organizationDashboardStyles.statDetailLabel}>Donors:</Text>
                          <Text style={organizationDashboardStyles.statDetailValue}>
                            {organizationStats.total_donors}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {organizationStats.pending_approvals > 0 && (
                      <View style={[organizationDashboardStyles.statCard, organizationDashboardStyles.pendingCard]}>
                        <View style={organizationDashboardStyles.statCardHeader}>
                          <Image
                            source={require('../../../assets/images/clock.png')}
                            style={organizationDashboardStyles.statIcon}
                          />
                          <Text style={organizationDashboardStyles.statTitle}>Pending Approvals</Text>
                        </View>
                        <Text style={organizationDashboardStyles.statValue}>
                          {organizationStats.pending_approvals}
                        </Text>
                        <Text style={organizationDashboardStyles.pendingText}>
                          {organizationStats.pending_approvals === 1 
                            ? 'Campaign awaiting admin approval'
                            : 'Campaigns awaiting admin approval'
                          }
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Quick Links */}
                  <View style={organizationDashboardStyles.section}>
                    <Text style={organizationDashboardStyles.sectionTitle}>Quick Actions</Text>
                    <View style={organizationDashboardStyles.quickLinks}>
                      <TouchableOpacity 
                        style={organizationDashboardStyles.quickLink}
                        onPress={() => setActiveTab('campaigns')}
                      >
                        <View style={organizationDashboardStyles.quickLinkIconContainer}>
                          <Image
                            source={require('../../../assets/images/campaign.png')}
                            style={organizationDashboardStyles.quickLinkIcon}
                          />
                        </View>
                        <Text style={organizationDashboardStyles.quickLinkText}>View Campaigns</Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={organizationDashboardStyles.quickLink}
                        onPress={() => setActiveTab('donations')}
                      >
                        <View style={organizationDashboardStyles.quickLinkIconContainer}>
                          <Image
                            source={require('../../../assets/images/donation.png')}
                            style={organizationDashboardStyles.quickLinkIcon}
                          />
                        </View>
                        <Text style={organizationDashboardStyles.quickLinkText}>View Donations</Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={organizationDashboardStyles.quickLink}
                        onPress={() => {
                          onClose();
                          router.push('/components/pages/update');
                        }}
                      >
                        <View style={organizationDashboardStyles.quickLinkIconContainer}>
                          <Image
                            source={require('../../../assets/images/update.png')}
                            style={organizationDashboardStyles.quickLinkIcon}
                          />
                        </View>
                        <Text style={organizationDashboardStyles.quickLinkText}>Create Update</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}

              {activeTab === 'campaigns' && (
                <View style={organizationDashboardStyles.section}>
                  <View style={organizationDashboardStyles.sectionHeader}>
                    <Text style={organizationDashboardStyles.sectionTitle}>Your Campaigns</Text>
                    <TouchableOpacity 
                      style={organizationDashboardStyles.createButton}
                      onPress={handleCreateCampaign}
                    >
                      <Image
                        source={require('../../../assets/images/add.png')}
                        style={organizationDashboardStyles.createButtonIcon}
                      />
                      <Text style={organizationDashboardStyles.createButtonText}>Create</Text>
                    </TouchableOpacity>
                  </View>

                  {campaigns.length === 0 ? (
                    <View style={organizationDashboardStyles.emptyState}>
                      <Image
                        source={require('../../../assets/images/empty-campaigns.png')}
                        style={organizationDashboardStyles.emptyStateIcon}
                      />
                      <Text style={organizationDashboardStyles.emptyStateTitle}>No campaigns yet</Text>
                      <Text style={organizationDashboardStyles.emptyStateSubtitle}>
                        Create your first campaign to start receiving donations
                      </Text>
                      <TouchableOpacity 
                        style={organizationDashboardStyles.emptyStateButton}
                        onPress={handleCreateCampaign}
                      >
                        <Text style={organizationDashboardStyles.emptyStateButtonText}>Create Campaign</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    campaigns.map((campaign, index) => (
                      <TouchableOpacity
                        key={campaign.id}
                        style={[
                          organizationDashboardStyles.campaignItem,
                          index === campaigns.length - 1 && organizationDashboardStyles.lastCampaignItem
                        ]}
                        onPress={() => handleViewCampaign(campaign.id)}
                      >
                        <View style={organizationDashboardStyles.campaignHeader}>
                          <Text style={organizationDashboardStyles.campaignTitle} numberOfLines={1}>
                            {campaign.title}
                          </Text>
                          <View style={[
                            organizationDashboardStyles.statusBadge,
                            campaign.status === 'active' && organizationDashboardStyles.statusActive,
                            campaign.status === 'completed' && organizationDashboardStyles.statusCompleted,
                            campaign.status === 'draft' && organizationDashboardStyles.statusDraft,
                            campaign.status === 'cancelled' && organizationDashboardStyles.statusCancelled
                          ]}>
                            <Text style={organizationDashboardStyles.statusText}>
                              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                            </Text>
                          </View>
                        </View>

                        <View style={organizationDashboardStyles.campaignStats}>
                          <View style={organizationDashboardStyles.campaignStat}>
                            <Text style={organizationDashboardStyles.campaignStatLabel}>Raised</Text>
                            <Text style={organizationDashboardStyles.campaignStatValue}>
                              {formatCurrency(campaign.amount_raised)}
                            </Text>
                          </View>
                          <View style={organizationDashboardStyles.campaignStat}>
                            <Text style={organizationDashboardStyles.campaignStatLabel}>Target</Text>
                            <Text style={organizationDashboardStyles.campaignStatValue}>
                              {formatCurrency(campaign.target_amount)}
                            </Text>
                          </View>
                          <View style={organizationDashboardStyles.campaignStat}>
                            <Text style={organizationDashboardStyles.campaignStatLabel}>Donors</Text>
                            <Text style={organizationDashboardStyles.campaignStatValue}>
                              {campaign.donor_count}
                            </Text>
                          </View>
                        </View>

                        {/* Progress Bar */}
                        <View style={organizationDashboardStyles.progressContainer}>
                          <View style={organizationDashboardStyles.progressBar}>
                            <View 
                              style={[
                                organizationDashboardStyles.progressFill,
                                { width: `${Math.min(campaign.progress_percentage, 100)}%` }
                              ]} 
                            />
                          </View>
                          <Text style={organizationDashboardStyles.progressText}>
                            {Math.round(campaign.progress_percentage)}% funded
                          </Text>
                        </View>

                        {!campaign.admin_approved && campaign.status !== 'draft' && (
                          <View style={organizationDashboardStyles.pendingApprovalBanner}>
                            <Image
                              source={require('../../../assets/images/clock.png')}
                              style={organizationDashboardStyles.pendingIcon}
                            />
                            <Text style={organizationDashboardStyles.pendingText}>
                              Awaiting admin approval
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              )}

              {activeTab === 'donations' && (
                <View style={organizationDashboardStyles.section}>
                  <View style={organizationDashboardStyles.sectionHeader}>
                    <Text style={organizationDashboardStyles.sectionTitle}>Recent Donations</Text>
                    <Text style={organizationDashboardStyles.sectionSubtitle}>
                      Last 5 donations across all campaigns
                    </Text>
                  </View>

                  {recentDonations.length === 0 ? (
                    <View style={organizationDashboardStyles.emptyState}>
                      <Image
                        source={require('../../../assets/images/empty-donations.png')}
                        style={organizationDashboardStyles.emptyStateIcon}
                      />
                      <Text style={organizationDashboardStyles.emptyStateTitle}>No donations yet</Text>
                      <Text style={organizationDashboardStyles.emptyStateSubtitle}>
                        Donations will appear here once people start supporting your campaigns
                      </Text>
                    </View>
                  ) : (
                    recentDonations.map((donation, index) => (
                      <View
                        key={donation.id}
                        style={[
                          organizationDashboardStyles.donationItem,
                          index === recentDonations.length - 1 && organizationDashboardStyles.lastDonationItem
                        ]}
                      >
                        <View style={organizationDashboardStyles.donationHeader}>
                          <View style={organizationDashboardStyles.donorInfo}>
                            <View style={organizationDashboardStyles.donorAvatar}>
                              <Text style={organizationDashboardStyles.donorInitials}>
                                {donation.donor_name.charAt(0).toUpperCase()}
                              </Text>
                            </View>
                            <View>
                              <Text style={organizationDashboardStyles.donorName}>
                                {donation.donor_name}
                              </Text>
                              {donation.donor_email && (
                                <Text style={organizationDashboardStyles.donorEmail}>
                                  {donation.donor_email}
                                </Text>
                              )}
                            </View>
                          </View>
                          <Text style={organizationDashboardStyles.donationAmount}>
                            {formatCurrency(donation.amount)}
                          </Text>
                        </View>

                        <Text style={organizationDashboardStyles.donationCampaign}>
                          For: {donation.campaign_title}
                        </Text>

                        <View style={organizationDashboardStyles.donationFooter}>
                          <Text style={organizationDashboardStyles.donationDate}>
                            {formatDate(donation.created_at)}
                          </Text>
                          <Text style={organizationDashboardStyles.donationTime}>
                            {new Date(donation.created_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </Text>
                        </View>
                      </View>
                    ))
                  )}

                  <TouchableOpacity 
                    style={organizationDashboardStyles.viewAllButton}
                    onPress={() => {
                      // TODO: Implement view all donations page
                      Alert.alert('Info', 'View all donations feature coming soon!');
                    }}
                  >
                    <Text style={organizationDashboardStyles.viewAllButtonText}>
                      View All Donations ({recentDonations.length})
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}