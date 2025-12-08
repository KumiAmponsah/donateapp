import React, { useEffect, useState } from 'react'; 
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'; 
import { homepageStyles } from '../styles/homepageStyles'; 
import Footer from './footer'; 
import { StatusBar } from "expo-status-bar"; 
import { useRouter } from 'expo-router';

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
}

interface UserData {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface Stats {
  totalRaised: number;
  totalDonors: number;
  activeCampaigns: number;
}

// ----------------------
// CAMPAIGN CARD
// ----------------------

const CampaignTab: React.FC<{ campaign: Campaign; isLast: boolean }> = ({ campaign, isLast }) => { 
  const router = useRouter(); 

  const handleDonatePress = () => { 
    router.push({ 
      pathname: '/components/pages/description', 
      params: { id: campaign.id }
    }); 
  }; 

  const imageSource = campaign.image_url 
    ? { uri: campaign.image_url }
    : require('../../../assets/images/campaign-water.jpg');

  return ( 
    <View style={[homepageStyles.campaignTab, isLast && homepageStyles.lastCampaignTab]}> 
      <View style={homepageStyles.campaignImageContainer}> 
        <Image  
          source={imageSource}  
          style={homepageStyles.campaignImage} 
          resizeMode="cover" 
        /> 
      </View> 

      <View style={homepageStyles.campaignContent}> 
        <Text style={homepageStyles.campaignTitle}>{campaign.title}</Text> 
         
        {campaign.charity && (
          <Text style={homepageStyles.charityName}>by {campaign.charity.organization_name}</Text>
        )}
         
        <Text style={homepageStyles.campaignDescription} numberOfLines={3}> 
          {campaign.description} 
        </Text> 
         
        <View style={homepageStyles.progressBarContainer}> 
          <View style={homepageStyles.progressBar}> 
            <View style={[homepageStyles.progressFill, { width: `${campaign.progress_percentage}%` }]} /> 
          </View> 
          <Text style={homepageStyles.progressPercentage}>{Math.round(campaign.progress_percentage)}%</Text> 
        </View> 
         
        <View style={homepageStyles.amountContainer}> 
          <Text style={homepageStyles.amountRaised}>₵{campaign.amount_raised.toLocaleString()} raised</Text> 
          <Text style={homepageStyles.amountTarget}>of ₵{campaign.target_amount.toLocaleString()}</Text> 
        </View> 
         
        <Text style={homepageStyles.donorCount}>{campaign.donor_count} donors</Text>
         
        <TouchableOpacity  
          style={homepageStyles.donateButton} 
          onPress={handleDonatePress}
        > 
          <Text style={homepageStyles.donateButtonText}>Donate Now</Text> 
          <Image  
            source={require('../../../assets/images/heart.png')} 
            style={homepageStyles.heartIcon} 
            resizeMode="contain" 
          /> 
        </TouchableOpacity> 
      </View> 
    </View> 
  ); 
}; 

// ----------------------
// PROFILE SECTION
// ----------------------

const ProfileSection: React.FC<{ userData: UserData | null }> = ({ userData }) => {
  const getFullName = () => {
    if (!userData) return 'User';
    return `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'User';
  };

  const getInitials = () => {
    if (!userData) return 'U';
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
        </View> 
      </View> 

      <View style={homepageStyles.rightContainer}> 
        <View style={homepageStyles.iconCircle}> 
          <Image  
            source={require('../../../assets/images/bell.png')} 
            style={homepageStyles.icon} 
            resizeMode="contain" 
          /> 
        </View> 
         
        <View style={homepageStyles.iconCircle}> 
          <Image  
            source={require('../../../assets/images/navigation.png')} 
            style={homepageStyles.icon} 
            resizeMode="contain" 
          /> 
        </View> 
      </View> 
    </View>
  );
};

// ----------------------
// STATS SECTION
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
          <Text style={homepageStyles.statLabel}>Donors</Text>
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
          </Text
          >
          <Text style={homepageStyles.statLabel}>Active Campaigns</Text>
        </View>
      </View>
    </View>
  </View>
);

// ----------------------
// MAIN HOMEPAGE (STATIC DATA)
// ----------------------

interface HomepageProps { 
  activeTab: string; 
  onTabPress: (tabName: string) => void; 
} 

export default function Homepage({ activeTab, onTabPress }: HomepageProps) { 
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalRaised: 125000,
    totalDonors: 320,
    activeCampaigns: 3
  });
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Mock profile
    setUserData({
      id: "1",
      email: "demo@example.com",
      first_name: "John",
      last_name: "Doe",
      phone: null,
      avatar_url: null,
      created_at: ""
    });

    // Mock campaigns
    setCampaigns([
      {
        id: "1",
        title: "Clean Water for All",
        description: "Help provide clean water to rural communities.",
        image_url: null,
        progress_percentage: 65,
        amount_raised: 65000,
        target_amount: 100000,
        donor_count: 120,
        charity: { organization_name: "Hope Foundation" }
      },
      {
        id: "2",
        title: "Feed a Child",
        description: "Donate to support weekly food packages for children.",
        image_url: null,
        progress_percentage: 80,
        amount_raised: 80000,
        target_amount: 100000,
        donor_count: 200,
        charity: { organization_name: "Helping Hands" }
      }
    ]);
  }, []);

  return ( 
    <View style={homepageStyles.mainContainer}> 
      <StatusBar style="dark" /> 
      <View style={homepageStyles.container}> 
        <ScrollView  
          style={homepageStyles.scrollView}  
          contentContainerStyle={homepageStyles.scrollViewContent} 
          showsVerticalScrollIndicator={true} 
        > 
          <View style={homepageStyles.content}> 
            <ProfileSection userData={userData} />
            <StatsSection stats={stats} />

            {campaigns.map((campaign, index) => ( 
              <CampaignTab  
                key={campaign.id}  
                campaign={campaign}  
                isLast={index === campaigns.length - 1} 
              /> 
            ))}

            {campaigns.length === 0 && (
              <Text style={homepageStyles.noCampaignsText}>No active campaigns found.</Text>
            )}
          </View> 
        </ScrollView> 
         
        <Footer activeTab={activeTab} onTabPress={onTabPress} /> 
      </View> 
    </View> 
  ); 
}
