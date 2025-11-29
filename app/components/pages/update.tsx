import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { updateStyles } from '../styles/update';
import Footer from './footer';
import { supabase } from '../../lib/supabase';

// Define TypeScript interface for Update
interface Update {
  id: string;
  title: string;
  content: string;
  created_at: string;
  charity: {
    organization_name: string;
  } | null; // Make charity nullable to match database response
  image_url: string | null;
  category: string;
  is_public: boolean;
  is_featured: boolean;
  read_time_minutes: number;
}

// Database response interface
interface UpdateResponse {
  id: string;
  campaign_id: string | null;
  charity_id: string | null;
  title: string;
  content: string;
  image_url: string | null;
  category: string;
  is_public: boolean;
  is_featured: boolean;
  view_count: number;
  like_count: number;
  read_time_minutes: number;
  created_at: string;
  updated_at: string;
  charity: {
    organization_name: string;
  } | null;
}

// Define props interface for UpdateTab component
interface UpdateTabProps {
  update: Update;
  isLast: boolean;
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }
};

// Reusable Update Component with distinct card design
const UpdateTab: React.FC<UpdateTabProps> = ({ update, isLast }) => {
  const readTime = update.read_time_minutes || 1;
  
  // Fallback image if update image is not available
  const imageSource = update.image_url 
    ? { uri: update.image_url }
    : require('../../../assets/images/campaign-water.jpg');

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
            <Text style={updateStyles.organizationText}>
              {update.charity?.organization_name || 'Organization'}
            </Text>
          </View>
          <Text style={updateStyles.dateText}>{formatDate(update.created_at)}</Text>
        </View>

        {/* Title */}
        <Text style={updateStyles.updateTitle}>{update.title}</Text>

        {/* Description */}
        <Text style={updateStyles.updateDescription} numberOfLines={2}>
          {update.content}
        </Text>

        {/* Footer with Category and Read Time */}
        <View style={updateStyles.cardFooter}>
          <View style={updateStyles.categoryContainer}>
            <View style={[
              updateStyles.categoryPill,
              update.is_featured && updateStyles.newCategoryPill
            ]}>
              <Text style={updateStyles.categoryText}>
                {update.category || 'General'}
                {update.is_featured && ' • Featured'}
              </Text>
            </View>
          </View>
          <Text style={updateStyles.readTimeText}>
            {readTime} min read
          </Text>
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
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('campaign_updates')
        .select(`
          *,
          charity:charity_foundations(organization_name)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our Update interface
      const transformedData: Update[] = (data || []).map((item: UpdateResponse) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        created_at: item.created_at,
        charity: item.charity,
        image_url: item.image_url,
        category: item.category,
        is_public: item.is_public,
        is_featured: item.is_featured,
        read_time_minutes: item.read_time_minutes
      }));
      
      setUpdates(transformedData);
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

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
              <Text style={updateStyles.statPillNumber}>{updates.length}</Text>
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

          {loading ? (
            <View style={updateStyles.loadingContainer}>
              <Text style={updateStyles.loadingText}>Loading updates...</Text>
            </View>
          ) : (
            <View style={updateStyles.updatesList}>
              {updates.map((update, index) => (
                <View key={update.id} style={updateStyles.timelineItem}>
                  {/* Timeline line and dot */}
                  <View style={updateStyles.timelineLineContainer}>
                    <View style={updateStyles.timelineDot} />
                    {index !== updates.length - 1 && (
                      <View style={updateStyles.timelineLine} />
                    )}
                  </View>
                  
                  {/* Update Card */}
                  <UpdateTab 
                    update={update} 
                    isLast={index === updates.length - 1}
                  />
                </View>
              ))}

              {updates.length === 0 && (
                <View style={updateStyles.noUpdatesContainer}>
                  <Text style={updateStyles.noUpdatesText}>
                    No updates available yet.
                  </Text>
                  <Text style={updateStyles.noUpdatesSubtext}>
                    Check back later for news from our partner organizations.
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={updateStyles.bottomSpacing} />
      </ScrollView>
      
      {/* Footer */}
      <Footer activeTab={activeTab} onTabPress={onTabPress} />
    </View>
  );
}