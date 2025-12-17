// C:\Users\cypri\Documents\donateapp\app\components\pages\homepage.tsx
import React, { useEffect, useState, useCallback } from 'react'; 
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native'; 
import { homepageStyles } from '../styles/homepageStyles'; 
import Footer from './footer'; 
import { StatusBar } from "expo-status-bar"; 
import { useRouter } from 'expo-router';
import ScreenContainer from '../common/ScreenContainer';
import { supabase } from '../../../supabase';

// ----------------------
// INTERFACES
// ----------------------

interface Charity {
  organization_name: string;
}

interface Campaign { 
  id: string; 
  title: string; 
  description: string; 
  image_url: string | null;
  progress_percentage: number; 
  amount_raised: number; 
  target_amount: number; 
  donor_count: number;
  charity: Charity | null;
  status: string;
}

// Update your CampaignStats interface
interface CampaignStats {
  c_id: string;  // Changed from campaign_id
  c_title: string;
  c_description: string;
  c_image_url: string | null;
  c_amount_raised: number;
  c_target_amount: number;
  c_progress_percentage: number;
  c_donor_count: number;
  c_organization_name: string;
  c_status: string;
}
interface UserData {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  role: string;
  organization_name: string | null;
}

interface Stats {
  totalRaised: number;
  totalDonors: number;
  activeCampaigns: number;
}

// ----------------------
// CAMPAIGN CARD (Updated with better description)
// ----------------------

const CampaignTab: React.FC<{ campaign: Campaign; isLast: boolean }> = ({ campaign, isLast }) => { 
  const router = useRouter(); 

  const handleCardPress = () => { 
    router.push({ 
      pathname: '/components/pages/description', 
      params: { id: campaign.id }
    }); 
  };

  const handleDonatePress = (e: any) => { 
    e.stopPropagation();
    router.push({ 
      pathname: '/components/pages/description', 
      params: { id: campaign.id }
    }); 
  }; 

  const imageSource = campaign.image_url 
    ? { uri: campaign.image_url }
    : require('../../../assets/images/campaign-water.jpg');

  return ( 
    <TouchableOpacity
      style={[homepageStyles.campaignTab, isLast && homepageStyles.lastCampaignTab]}
      onPress={handleCardPress}
      activeOpacity={0.9}
    > 
      <View style={homepageStyles.campaignImageContainer}> 
        <Image  
          source={imageSource}  
          style={homepageStyles.campaignImage} 
          resizeMode="cover" 
        /> 
      </View> 

      <View style={homepageStyles.campaignContent}> 
        <Text style={homepageStyles.campaignTitle}>{campaign.title}</Text> 
         
        {campaign.charity && campaign.charity.organization_name && (
          <Text style={homepageStyles.charityName}>
            by {campaign.charity.organization_name}
          </Text>
        )}
         
        <Text style={homepageStyles.campaignDescription} numberOfLines={3}> 
          {campaign.description} 
        </Text> 
         
        <View style={homepageStyles.progressBarContainer}> 
          <View style={homepageStyles.progressBar}> 
            <View style={[homepageStyles.progressFill, { width: `${Math.min(campaign.progress_percentage, 100)}%` }]} /> 
          </View> 
          <Text style={homepageStyles.progressPercentage}>
            {Math.round(Math.min(campaign.progress_percentage, 100))}%
          </Text> 
        </View> 
         
        <View style={homepageStyles.amountContainer}> 
          <Text style={homepageStyles.amountRaised}>
            ₵{campaign.amount_raised.toLocaleString()} raised
          </Text> 
          <Text style={homepageStyles.amountTarget}>
            of ₵{campaign.target_amount.toLocaleString()}
          </Text> 
        </View> 
         
        {/* Updated donor count description */}
        <Text style={homepageStyles.donorCount}>
          {campaign.donor_count} supporter{campaign.donor_count !== 1 ? 's' : ''}
        </Text>
        <Text style={homepageStyles.donorSubtext}>
          (Individuals & organizations who donated)
        </Text>
         
        <TouchableOpacity  
          style={homepageStyles.donateButton} 
          onPress={handleDonatePress}
          activeOpacity={0.7}
        > 
          <Text style={homepageStyles.donateButtonText}>Donate Now</Text> 
          <Image  
            source={require('../../../assets/images/heart.png')} 
            style={homepageStyles.heartIcon} 
            resizeMode="contain" 
          /> 
        </TouchableOpacity> 
      </View> 
    </TouchableOpacity> 
  ); 
};

// ----------------------
// PROFILE SECTION
// ----------------------

const ProfileSection: React.FC<{ userData: UserData | null }> = ({ userData }) => {
  const router = useRouter();

  const getFullName = () => {
    if (!userData) return 'User';
    
    if (userData.role === 'organization' && userData.organization_name) {
      return userData.organization_name;
    }
    
    return `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'User';
  };

  const getInitials = () => {
    if (!userData) return 'U';
    
    if (userData.role === 'organization' && userData.organization_name) {
      return userData.organization_name.substring(0, 2).toUpperCase();
    }
    
    return `${userData.first_name?.[0] || ''}${userData.last_name?.[0] || ''}`.toUpperCase() || 'U';
  };

  return (
    <View style={homepageStyles.profileContainer}>
      <View style={homepageStyles.leftContainer}>
        <View style={homepageStyles.circle}>
          {userData?.avatar_url ? (
            <Image  
              source={{ uri: userData.avatar_url }} 
              style={homepageStyles.userAvatar} 
              resizeMode="cover" 
            /> 
          ) : (
            <View style={homepageStyles.initialsContainer}>
              <Text style={homepageStyles.initialsText}>{getInitials()}</Text>
            </View>
          )}
        </View>

        <View style={homepageStyles.textContainer}> 
          <Text style={homepageStyles.welcomeText}>Welcome back</Text> 
          <Text style={homepageStyles.nameText}>{getFullName()}</Text> 
          {userData?.role === 'organization' && (
            <Text style={homepageStyles.roleText}>Organization</Text>
          )}
        </View> 
      </View> 

      <View style={homepageStyles.rightContainer}> 
        <TouchableOpacity
          style={homepageStyles.iconCircle}
          onPress={() => console.log('Notifications pressed')}
          activeOpacity={0.7}
        > 
          <Image  
            source={require('../../../assets/images/bell.png')} 
            style={homepageStyles.icon} 
            resizeMode="contain" 
          /> 
        </TouchableOpacity> 
         
        <TouchableOpacity
          style={homepageStyles.iconCircle}
          onPress={() => console.log('Search pressed')}
          activeOpacity={0.7}
        > 
          <Image  
            source={require('../../../assets/images/search.png')} 
            style={homepageStyles.icon} 
            resizeMode="contain" 
          /> 
        </TouchableOpacity> 
      </View> 
    </View>
  );
};

// ----------------------
// STATS SECTION (Updated with better descriptions)
// ----------------------

const StatsSection: React.FC<{ stats: Stats }> = ({ stats }) => (
  <View style={homepageStyles.statsContainer}>
    <View style={homepageStyles.statItem}>
      <View style={homepageStyles.statItemContent}>
        <View style={homepageStyles.iconWrapper}>
          <Image  
            source={require('../../../assets/images/profit.png')} 
            style={homepageStyles.statIcon} 
            resizeMode="contain" 
          /> 
        </View>
        <View style={homepageStyles.textContent}>
          <Text style={homepageStyles.amountText}>
            ₵ {stats.totalRaised.toLocaleString()}
          </Text>
          <Text style={homepageStyles.statLabel}>Total Raised</Text>
          <Text style={homepageStyles.statSubtext}>
            All successful donations
          </Text>
        </View>
      </View>
    </View>

    <View style={homepageStyles.statItem}>
      <View style={homepageStyles.statItemContent}>
        <View style={homepageStyles.iconWrapper}>
          <Image  
            source={require('../../../assets/images/donors.png')} 
            style={homepageStyles.statIcon} 
            resizeMode="contain" 
          /> 
        </View>
        <View style={homepageStyles.textContent}>
          <Text style={homepageStyles.numberText}>
            {stats.totalDonors.toLocaleString()}
          </Text>
          <Text style={homepageStyles.statLabel}>Registered Donors</Text>
          <Text style={homepageStyles.statSubtext}>
            Users with donor role
          </Text>
        </View>
      </View>
    </View>

    <View style={homepageStyles.lastStatItem}>
      <View style={homepageStyles.statItemContent}>
        <View style={homepageStyles.iconWrapper}>
          <Image  
            source={require('../../../assets/images/target.png')} 
            style={homepageStyles.statIcon} 
            resizeMode="contain" 
          /> 
        </View>
        <View style={homepageStyles.textContent}>
          <Text style={homepageStyles.numberText}>
            {stats.activeCampaigns}
          </Text>
          <Text style={homepageStyles.statLabel}>Active Campaigns</Text>
          <Text style={homepageStyles.statSubtext}>
            Currently accepting donations
          </Text>
        </View>
      </View>
    </View>
  </View>
);

// ----------------------
// MAIN HOMEPAGE (Updated with correct queries)
// ----------------------


interface HomepageProps { 
  activeTab: string; 
  onTabPress: (tabName: string) => void; 
} 

export default function Homepage({ activeTab, onTabPress }: HomepageProps) { 
  const router = useRouter(); 

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalRaised: 0,
    totalDonors: 0,
    activeCampaigns: 0
  });
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No user logged in');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setUserData(data);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  }, []);

  
  // Fetch campaigns using the secure public function
// Fetch campaigns using the secure public function
const fetchCampaigns = useCallback(async () => {
  try {
    // Use the public function that bypasses RLS for stats
    const { data, error } = await supabase
      .rpc('get_campaign_stats') as { data: CampaignStats[] | null; error: any };

    if (error) {
      console.error('Error fetching campaign stats:', error);
      console.log('Falling back to direct query...');
      
      // Fallback: Fetch campaigns directly from the database
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select(`
          *,
          charity:profiles!campaigns_organization_id_fkey (
            organization_name
          )
        `)
        .eq('status', 'active') 
        .eq('is_deleted', false) 
        .order('created_at', { ascending: false });

      if (campaignsError) {
        console.error('Error fetching campaigns fallback:', campaignsError);
        return;
      }

      const transformedCampaigns: Campaign[] = (campaignsData || []).map(campaign => ({
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        image_url: campaign.image_url,
        progress_percentage: Number(campaign.progress_percentage) || 0,
        amount_raised: Number(campaign.amount_raised) || 0,
        target_amount: Number(campaign.target_amount) || 0,
        donor_count: campaign.donor_count || 0,
        charity: campaign.charity ? {
          organization_name: campaign.charity.organization_name
        } : null,
        status: campaign.status
      }));

      setCampaigns(transformedCampaigns);
      return;
    }

    // Transform the RPC data
    // Transform the RPC data with new column names
const transformedCampaigns: Campaign[] = (data || []).map((campaign: CampaignStats) => ({
  id: campaign.c_id,  // Changed from campaign_id
  title: campaign.c_title,
  description: campaign.c_description,
  image_url: campaign.c_image_url,
  progress_percentage: Number(campaign.c_progress_percentage) || 0,
  amount_raised: Number(campaign.c_amount_raised) || 0,
  target_amount: Number(campaign.c_target_amount) || 0,
  donor_count: campaign.c_donor_count || 0,
  charity: campaign.c_organization_name ? {
    organization_name: campaign.c_organization_name
  } : null,
  status: campaign.c_status
}));

    setCampaigns(transformedCampaigns);
    
    console.log('Campaigns loaded via function:', transformedCampaigns.map(c => ({
      title: c.title,
      amount_raised: c.amount_raised,
      donor_count: c.donor_count
    })));
    
  } catch (error) {
    console.error('Error in fetchCampaigns:', error);
  }
}, []);

// // Fallback function (keep your existing logic as backup)
// const fetchCampaignsFallback = async () => {
//   try {
//     // Your existing fetchCampaigns logic here
//     // (Keep it as backup in case the function doesn't exist)
//   } catch (error) {
//     console.error('Error in fetchCampaignsFallback:', error);
//   }
// };

  // Fetch accurate stats
  const fetchStats = useCallback(async () => {
    try {
      // 1. Total Raised: Sum of all completed donations
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select('amount, campaign_id')
        .eq('status', 'completed')
        .eq('is_deleted', false);

      if (donationsError) {
        console.error('Error fetching donations:', donationsError);
      }

      // 2. Total Registered Donors: Count of users with 'donor' role
      const { data: donorsData, error: donorsError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'donor')
        .eq('is_deleted', false);

      if (donorsError) {
        console.error('Error fetching donors:', donorsError);
      }

      // 3. Active Campaigns
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select('id', { count: 'exact' })
        .eq('status', 'active')
        .eq('is_deleted', false);

      if (campaignsError) {
        console.error('Error fetching campaigns count:', campaignsError);
      }

      // Calculate stats
      const totalRaised = donationsData?.reduce((sum, donation) => sum + Number(donation.amount || 0), 0) || 0;
      const totalDonors = donorsData?.length || 0;
      const activeCampaigns = campaignsData?.length || 0;

      // Log stats for debugging
      console.log('Stats loaded:', {
        totalRaised,
        totalDonors,
        activeCampaigns,
        totalDonationsCount: donationsData?.length || 0
      });

      setStats({
        totalRaised,
        totalDonors,
        activeCampaigns
      });
    } catch (error) {
      console.error('Error in fetchStats:', error);
    }
  }, []);

  // DEBUG FUNCTION: Check database directly for the problematic campaign
  const debugCampaignData = useCallback(async () => {
    try {
      // Find the campaign you're having issues with
      const { data: problemCampaigns, error } = await supabase
        .from('campaigns')
        .select('id, title, amount_raised, donor_count')
        .eq('status', 'active')
        .eq('is_deleted', false);

      if (error) {
        console.error('Error debugging campaigns:', error);
        return;
      }

      console.log('Database campaigns data:', problemCampaigns);

      // For each campaign, check donations
      for (const campaign of problemCampaigns || []) {
        const { data: donations, error: donationsError } = await supabase
          .from('donations')
          .select('id, donor_id, amount, created_at, status')
          .eq('campaign_id', campaign.id)
          .eq('status', 'completed')
          .eq('is_deleted', false);

        if (donationsError) {
          console.error(`Error checking donations for campaign ${campaign.id}:`, donationsError);
          continue;
        }

        console.log(`Campaign: ${campaign.title} (${campaign.id})`);
        console.log(`- Database amount_raised: ${campaign.amount_raised}`);
        console.log(`- Database donor_count: ${campaign.donor_count}`);
        console.log(`- Actual donations found: ${donations?.length || 0}`);
        
        if (donations && donations.length > 0) {
          const totalAmount = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
          const uniqueDonors = new Set(donations.map(d => d.donor_id)).size;
          
          console.log(`- Calculated amount from donations: ${totalAmount}`);
          console.log(`- Unique donors from donations: ${uniqueDonors}`);
          console.log(`- Individual donations:`);
          donations.forEach(d => {
            console.log(`  * Donor: ${d.donor_id}, Amount: ${d.amount}, Date: ${d.created_at}`);
          });
        }
        
        console.log('---');
      }
    } catch (error) {
      console.error('Error in debugCampaignData:', error);
    }
  }, []);

  // Load all data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUserProfile(),
        fetchCampaigns(),
        fetchStats()
      ]);
      
      // Run debug function to check data
      await debugCampaignData();
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchUserProfile, fetchCampaigns, fetchStats, debugCampaignData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <ScreenContainer>
        <View style={homepageStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A5568" />
          <Text style={homepageStyles.loadingText}>Loading campaigns...</Text>
        </View>
        <Footer activeTab={activeTab} onTabPress={onTabPress} />
      </ScreenContainer>
    );
  }

  return ( 
    <ScreenContainer>
      <StatusBar style="dark" /> 
      
      <ScrollView  
        style={homepageStyles.scrollView}  
        contentContainerStyle={homepageStyles.scrollViewContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4A5568"
          />
        }
      > 
        <View style={homepageStyles.content}> 
          <ProfileSection userData={userData} />

          {userData?.role === 'organization' && (
            <TouchableOpacity
              style={{
                backgroundColor: '#4A5568',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 12,
                marginBottom: 25,
                gap: 10,
              }}
              onPress={() => router.push({ pathname: '/components/pages/create-campaign' })}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../../assets/images/add.png')}
                style={{ width: 20, height: 20, tintColor: '#FFFFFF' }}
              />
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
                Create Campaign
              </Text>
            </TouchableOpacity>
          )}

          <StatsSection stats={stats} />

          <View style={homepageStyles.campaignsHeader}>
            <Text style={homepageStyles.campaignsTitle}>Featured Campaigns</Text>
            <Text style={homepageStyles.campaignsSubtitle}>
              Support these amazing causes
            </Text>
          </View>

          {campaigns.length > 0 ? (
            campaigns.map((campaign, index) => ( 
              <CampaignTab  
                key={campaign.id}  
                campaign={campaign}  
                isLast={index === campaigns.length - 1} 
              /> 
            ))
          ) : (
            <View style={homepageStyles.noCampaignsContainer}>
              <Image
                source={require('../../../assets/images/empty-campaigns.png')}
                style={homepageStyles.emptyCampaignsIcon}
              />
              <Text style={homepageStyles.noCampaignsText}>No active campaigns found</Text>
              <Text style={homepageStyles.noCampaignsSubtext}>
                Check back later for new campaigns
              </Text>
              <TouchableOpacity 
                style={homepageStyles.refreshButton}
                onPress={onRefresh}
                activeOpacity={0.7}
              >
                <Text style={homepageStyles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          )}

          {campaigns.length > 0 && campaigns.length < 3 && (
            <View style={homepageStyles.moreComingContainer}>
              <Text style={homepageStyles.moreComingText}>
                More campaigns coming soon!
              </Text>
            </View>
          )}
        </View> 
      </ScrollView> 
       
      <Footer activeTab={activeTab} onTabPress={onTabPress} /> 
    </ScreenContainer>
  ); 
}