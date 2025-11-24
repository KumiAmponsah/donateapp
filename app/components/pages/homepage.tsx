import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { homepageStyles } from '../styles/homepageStyles';
import Footer from './footer';
import { StatusBar } from "expo-status-bar";
import { useRouter } from 'expo-router';

// Define TypeScript interface for Campaign
interface Campaign {
  id: number;
  title: string;
  description: string;
  image: any;
  progress: number;
  raised: number;
  target: number;
  donors?: number;
}

// Complete campaign data array with proper typing and donor counts
const campaignData: Campaign[] = [
  { 
    id: 1, 
    title: "Clean Water", 
    description: "Providing clean water (likely referring to water treatment and sanitation) in rural areas typically involves a combination of solar-powered systems, borehole drilling, water purification technologies like filtration and chlorination, and community-focused initiatives such as WASH education. Effective solutions are sustainable, community-involved, and tailored to local contexts to address challenges like pollution and long distances to water sources.", 
    image: require('../../../assets/images/campaign-water.jpg'), 
    progress: 70, 
    raised: 70000, 
    target: 100000,
    donors: 1250
  },
  { 
    id: 2, 
    title: "Education for All", 
    description: "Building schools and providing educational resources for underprivileged children in remote villages. This initiative focuses on constructing safe learning environments, supplying books and technology, and training local teachers to ensure quality education reaches every child regardless of their geographical or economic background.", 
    image: require('../../../assets/images/second.jpg'), 
    progress: 45, 
    raised: 45000, 
    target: 100000,
    donors: 890
  },
  { 
    id: 3, 
    title: "Healthcare Access", 
    description: "Establishing mobile medical clinics and community health centers in areas with limited healthcare facilities. This project provides essential medical services, vaccinations, maternal care, and health education to improve overall community health outcomes and reduce preventable diseases.", 
    image: require('../../../assets/images/third.jpg'), 
    progress: 60, 
    raised: 120000, 
    target: 200000,
    donors: 1560
  },
  { 
    id: 4, 
    title: "Food Security", 
    description: "Implementing sustainable agriculture programs and food distribution networks to combat hunger. This initiative teaches farming techniques, provides seeds and tools, and establishes community gardens to ensure families have consistent access to nutritious food throughout the year.", 
    image: require('../../../assets/images/fourth.jpg'), 
    progress: 35, 
    raised: 52500, 
    target: 150000,
    donors: 720
  },
  { 
    id: 5, 
    title: "Renewable Energy", 
    description: "Installing solar power systems in off-grid communities to provide clean, reliable electricity. This project focuses on solar panels for homes, schools, and clinics, enabling better education, healthcare, and economic opportunities while reducing environmental impact.", 
    image: require('../../../assets/images/fifth.jpg'), 
    progress: 80, 
    raised: 160000, 
    target: 200000,
    donors: 2100
  },
  { 
    id: 6, 
    title: "Women Empowerment", 
    description: "Creating economic opportunities and skill development programs for women in marginalized communities. This initiative provides vocational training, micro-loans, and business mentorship to help women achieve financial independence and become community leaders.", 
    image: require('../../../assets/images/sixth.jpg'), 
    progress: 55, 
    raised: 82500, 
    target: 150000,
    donors: 980
  },
  { 
    id: 7, 
    title: "Disaster Relief", 
    description: "Providing immediate emergency response and long-term recovery support for communities affected by natural disasters. This fund ensures quick deployment of food, shelter, medical aid, and helps rebuild infrastructure to restore normalcy in affected regions.", 
    image: require('../../../assets/images/seventh.jpg'), 
    progress: 25, 
    raised: 75000, 
    target: 300000,
    donors: 430
  }
];

// Define props interface for CampaignTab component
interface CampaignTabProps {
  campaign: Campaign;
  isLast: boolean;
}

// Reusable Campaign Component with proper typing
const CampaignTab: React.FC<CampaignTabProps> = ({ campaign, isLast }) => {
  const router = useRouter();

  const handleDonatePress = () => {
    // Navigate to campaign description page with campaign ID
    router.push({
      pathname: '/components/pages/description',
      params: { id: campaign.id.toString() }
    });
  };

  return (
    <View style={[
      homepageStyles.campaignTab,
      isLast && homepageStyles.lastCampaignTab
    ]}>
      {/* Campaign Image - Top Half */}
      <View style={homepageStyles.campaignImageContainer}>
        <Image 
          source={campaign.image} 
          style={homepageStyles.campaignImage}
          resizeMode="cover"
        />
      </View>

      {/* Campaign Content - Bottom Half */}
      <View style={homepageStyles.campaignContent}>
        {/* Title */}
        <Text style={homepageStyles.campaignTitle}>{campaign.title}</Text>
        
        {/* Description */}
        <Text style={homepageStyles.campaignDescription} numberOfLines={3}>
          {campaign.description}
        </Text>
        
        {/* Progress Bar */}
        <View style={homepageStyles.progressBarContainer}>
          <View style={homepageStyles.progressBar}>
            <View style={[homepageStyles.progressFill, { width: `${campaign.progress}%` }]} />
          </View>
          <Text style={homepageStyles.progressPercentage}>{campaign.progress}%</Text>
        </View>
        
        {/* Amount Raised */}
        <View style={homepageStyles.amountContainer}>
          <Text style={homepageStyles.amountRaised}>₵{campaign.raised.toLocaleString()} raised</Text>
          <Text style={homepageStyles.amountTarget}>of ₵{campaign.target.toLocaleString()}</Text>
        </View>
        
        {/* Donate Button with Heart Icon */}
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

interface HomepageProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

export default function Homepage({ activeTab, onTabPress }: HomepageProps) {
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
            {/* Profile and Icons Section */}
            <View style={homepageStyles.profileContainer}>
              {/* Left side - Profile circle and text */}
              <View style={homepageStyles.leftContainer}>
                {/* Profile Circle */}
                <View style={homepageStyles.circle}>
                  <Image 
                    source={require('../../../assets/images/person.png')}
                    style={homepageStyles.icon}
                    resizeMode="contain"
                  />
                </View>

                {/* Text container */}
                <View style={homepageStyles.textContainer}>
                  <Text style={homepageStyles.welcomeText}>Welcome back</Text>
                  <Text style={homepageStyles.nameText}>Herbert Asare Amponsah</Text>
                </View>
              </View>

              {/* Right side - Two icon circles */}
              <View style={homepageStyles.rightContainer}>
                {/* First circle with bell icon */}
                <View style={homepageStyles.iconCircle}>
                  <Image 
                    source={require('../../../assets/images/bell.png')}
                    style={homepageStyles.icon}
                    resizeMode="contain"
                  />
                </View>
                
                {/* Second circle with navigation icon */}
                <View style={homepageStyles.iconCircle}>
                  <Image 
                    source={require('../../../assets/images/navigation.png')}
                    style={homepageStyles.icon}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>

            {/* Stats Section - Now vertical layout */}
            <View style={homepageStyles.statsContainer}>
              {/* Total Raised */}
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
                    <Text style={homepageStyles.amountText} numberOfLines={1} adjustsFontSizeToFit>
                      ₵ 980,000,000,000.00
                    </Text>
                    <Text style={homepageStyles.statLabel}>Total Raised</Text>
                  </View>
                </View>
              </View>

              {/* Donors */}
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
                    <Text style={homepageStyles.numberText} numberOfLines={1} adjustsFontSizeToFit>
                      300,000,000
                    </Text>
                    <Text style={homepageStyles.statLabel}>Donors</Text>
                  </View>
                </View>
              </View>

              {/* Active Campaigns */}
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
                    <Text style={homepageStyles.numberText} numberOfLines={1} adjustsFontSizeToFit>
                      {campaignData.length}
                    </Text>
                    <Text style={homepageStyles.statLabel}>Active Campaigns</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Campaign Tabs - Dynamically rendered */}
            {campaignData.map((campaign, index) => (
              <CampaignTab 
                key={campaign.id} 
                campaign={campaign} 
                isLast={index === campaignData.length - 1}
              />
            ))}
          </View>
        </ScrollView>
        
        {/* Footer */}
        <Footer activeTab={activeTab} onTabPress={onTabPress} />
      </View>
    </View>
  );
}