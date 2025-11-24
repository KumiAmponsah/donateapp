import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { updateStyles } from '../styles/update';
import Footer from './footer';

// Define TypeScript interface for Update
interface Update {
  id: number;
  title: string;
  description: string;
  date: string;
  organization: string;
  image: any;
  category: string;
  isNew?: boolean;
  readTime: string;
}

// Update data array with proper typing
const updateData: Update[] = [
  {
    id: 1,
    title: "Clean Water Project Reaches 10,000 Beneficiaries",
    description: "Our clean water initiative has successfully provided access to safe drinking water for over 10,000 people in rural communities. New water purification systems have been installed across 15 villages, dramatically reducing waterborne diseases.",
    date: "2 hours ago",
    organization: "Water for Life",
    image: require('../../../assets/images/campaign-water.jpg'),
    category: "Project Update",
    isNew: true,
    readTime: "2 min read"
  },
  {
    id: 2,
    title: "Education Program Expansion to 5 New Regions",
    description: "We're excited to announce the expansion of our Education for All program. This will provide educational resources to an additional 2,000 children in remote areas with new schools and learning materials.",
    date: "1 day ago",
    organization: "Education First",
    image: require('../../../assets/images/second.jpg'),
    category: "Announcement",
    readTime: "3 min read"
  },
  {
    id: 3,
    title: "Healthcare Centers Now Fully Operational",
    description: "All three mobile medical clinics are now fully operational and serving communities in the northern region. Over 500 patients received medical care in the first week of operations.",
    date: "2 days ago",
    organization: "Health Aid International",
    image: require('../../../assets/images/third.jpg'),
    category: "Progress Report",
    readTime: "2 min read"
  },
  {
    id: 4,
    title: "New Partnership with Local Farmers Cooperative",
    description: "We've partnered with local agricultural cooperatives to enhance our food security program. This collaboration will help sustain community gardens and improve farming techniques for long-term sustainability.",
    date: "3 days ago",
    organization: "Food Security Network",
    image: require('../../../assets/images/fourth.jpg'),
    category: "Partnership",
    readTime: "4 min read"
  }
];

// Define props interface for UpdateTab component
interface UpdateTabProps {
  update: Update;
  isLast: boolean;
}

// Reusable Update Component with distinct card design
const UpdateTab: React.FC<UpdateTabProps> = ({ update, isLast }) => {
  return (
    <TouchableOpacity 
      style={[
        updateStyles.updateCard,
        isLast && updateStyles.lastUpdateCard
      ]}
      activeOpacity={0.9}
    >
      {/* Left border accent based on category */}
      <View style={updateStyles.cardAccent} />
      
      {/* Card Content */}
      <View style={updateStyles.cardContent}>
        {/* Header with Organization and Date */}
        <View style={updateStyles.cardHeader}>
          <View style={updateStyles.organizationContainer}>
            <View style={updateStyles.organizationDot} />
            <Text style={updateStyles.organizationText}>{update.organization}</Text>
          </View>
          <Text style={updateStyles.dateText}>{update.date}</Text>
        </View>

        {/* Title */}
        <Text style={updateStyles.updateTitle}>{update.title}</Text>

        {/* Description */}
        <Text style={updateStyles.updateDescription} numberOfLines={2}>
          {update.description}
        </Text>

        {/* Footer with Category and Read Time */}
        <View style={updateStyles.cardFooter}>
          <View style={updateStyles.categoryContainer}>
            <View style={[
              updateStyles.categoryPill,
              update.isNew && updateStyles.newCategoryPill
            ]}>
              <Text style={updateStyles.categoryText}>
                {update.category}
                {update.isNew && ' • New'}
              </Text>
            </View>
          </View>
          <Text style={updateStyles.readTimeText}>{update.readTime}</Text>
        </View>

        {/* Progress line at bottom */}
        <View style={updateStyles.progressLine} />
      </View>
    </TouchableOpacity>
  );
};

interface UpdatesProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

export default function Updates({ activeTab, onTabPress }: UpdatesProps) {
  return (
    <View style={updateStyles.mainContainer}>
      <ScrollView 
        style={updateStyles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={updateStyles.header}>
          <View style={updateStyles.headerContent}>
            <Text style={updateStyles.headerTitle}>Updates & News</Text>
            <Text style={updateStyles.headerSubtitle}>
              Latest developments from our partner organizations
            </Text>
          </View>
          <View style={updateStyles.headerStats}>
            <View style={updateStyles.statPill}>
              <Text style={updateStyles.statPillNumber}>{updateData.length}</Text>
              <Text style={updateStyles.statPillLabel}>Updates</Text>
            </View>
          </View>
        </View>

        {/* Timeline Section */}
        <View style={updateStyles.timelineContainer}>
          <View style={updateStyles.timelineHeader}>
            <Text style={updateStyles.timelineTitle}>Recent Activity</Text>
            <View style={updateStyles.timelineFilter}>
              <Text style={updateStyles.timelineFilterText}>All Updates</Text>
              <Image 
                source={require('../../../assets/images/bell.png')}
                style={updateStyles.filterIcon}
              />
            </View>
          </View>

          {/* Updates List */}
          <View style={updateStyles.updatesList}>
            {updateData.map((update, index) => (
              <View key={update.id} style={updateStyles.timelineItem}>
                {/* Timeline line and dot */}
                <View style={updateStyles.timelineLineContainer}>
                  <View style={updateStyles.timelineDot} />
                  {index !== updateData.length - 1 && (
                    <View style={updateStyles.timelineLine} />
                  )}
                </View>
                
                {/* Update Card */}
                <UpdateTab 
                  update={update} 
                  isLast={index === updateData.length - 1}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={updateStyles.bottomSpacing} />
      </ScrollView>
      
      {/* Footer */}
      <Footer activeTab={activeTab} onTabPress={onTabPress} />
    </View>
  );
}