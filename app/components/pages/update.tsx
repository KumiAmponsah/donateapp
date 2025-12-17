// C:\Users\cypri\Documents\donateapp\app\components\pages\update.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { updateStyles } from '../styles/update';
import Footer from './footer';
import ScreenContainer from '../common/ScreenContainer';
import { supabase } from '../../../supabase';
import { useRouter } from 'expo-router';
import CreateUpdateModal from './CreateUpdateModal';

// ----------------------
// UPDATE TYPE WITH DATABASE FIELDS
// ----------------------

interface UpdateItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
  organization: {
    id: string;
    organization_name: string;
    avatar_url?: string;
  };
  image_url: string | null;
  category: string;
  read_time_minutes: number;
  campaign_id: string | null;
  campaign_title?: string;
}

interface UpdateTabProps {
  update: UpdateItem;
  isLast: boolean;
  onPress?: () => void;
}

// ----------------------
// DATE FORMATTER
// ----------------------

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
};

// ----------------------
// UPDATE CARD COMPONENT
// ----------------------

const UpdateTab: React.FC<UpdateTabProps> = ({ update, isLast, onPress }) => {
  return (
    <TouchableOpacity
      style={[updateStyles.updateCard, isLast && updateStyles.lastUpdateCard]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={updateStyles.cardAccent} />

      <View style={updateStyles.cardContent}>
        <View style={updateStyles.cardHeader}>
          <View style={updateStyles.organizationContainer}>
            {update.organization.avatar_url ? (
              <Image
                source={{ uri: update.organization.avatar_url }}
                style={updateStyles.organizationAvatar}
              />
            ) : (
              <View style={updateStyles.organizationAvatarPlaceholder}>
                <Text style={updateStyles.organizationAvatarText}>
                  {update.organization.organization_name.substring(0, 2).toUpperCase()}
                </Text>
              </View>
            )}
            <View>
              <Text style={updateStyles.organizationText}>
                {update.organization.organization_name}
              </Text>
              {update.campaign_title && (
                <Text style={updateStyles.campaignText}>
                  For: {update.campaign_title}
                </Text>
              )}
            </View>
          </View>
          <Text style={updateStyles.dateText}>{formatDate(update.created_at)}</Text>
        </View>

        <Text style={updateStyles.updateTitle}>{update.title}</Text>

        <Text style={updateStyles.updateDescription} numberOfLines={2}>
          {update.content}
        </Text>

        <View style={updateStyles.cardFooter}>
          <View style={updateStyles.categoryContainer}>
            <View style={updateStyles.categoryPill}>
              <Text style={updateStyles.categoryText}>
                {update.category || 'General'}
              </Text>
            </View>
          </View>

          <Text style={updateStyles.readTimeText}>
            {update.read_time_minutes || 2} min read
          </Text>
        </View>

        <View style={updateStyles.progressLine} />
      </View>

      {update.image_url && (
        <Image
          source={{ uri: update.image_url }}
          style={updateStyles.updateImage}
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  );
};

// ----------------------
// MAIN UPDATES COMPONENT WITH SUPABASE INTEGRATION
// ----------------------

interface UpdatesProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

export default function Updates({ activeTab, onTabPress }: UpdatesProps) {
  const router = useRouter();
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>(['all']);
  const [showCreateUpdateModal, setShowCreateUpdateModal] = useState(false);

  // Fetch updates from Supabase
  const fetchUpdates = useCallback(async () => {
    try {
      setLoading(true);

      // Build query
      let query = supabase
        .from('updates')
        .select(`
          *,
          organization:profiles!updates_organization_id_fkey (
            id,
            organization_name,
            avatar_url
          ),
          campaign:campaigns!updates_campaign_id_fkey (
            title
          )
        `)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      // Apply category filter if not "all"
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching updates:', error);
        Alert.alert('Error', 'Failed to load updates');
        return;
      }

      // Transform data to match our interface
      const transformedUpdates: UpdateItem[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        created_at: item.created_at,
        organization: {
          id: item.organization.id,
          organization_name: item.organization.organization_name || 'Unknown Organization',
          avatar_url: item.organization.avatar_url
        },
        image_url: item.image_url,
        category: item.category || 'general',
        read_time_minutes: item.read_time_minutes || 2,
        campaign_id: item.campaign_id,
        campaign_title: item.campaign?.title
      }));

      setUpdates(transformedUpdates);

      // Extract unique categories
      const uniqueCategories = ['all', ...new Set(transformedUpdates.map(u => u.category))];
      setCategories(uniqueCategories);

    } catch (error) {
      console.error('Error in fetchUpdates:', error);
      Alert.alert('Error', 'Failed to load updates');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory]);

  // Fetch user profile to determine if they're an organization
  const fetchUserProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      return data?.role;
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, []);

  const loadUpdates = useCallback(async () => {
    await fetchUpdates();
  }, [fetchUpdates]);

  useEffect(() => {
    loadUpdates();
  }, [loadUpdates]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadUpdates();
  }, [loadUpdates]);

  const handleUpdatePress = (update: UpdateItem) => {
    router.push({
      pathname: '/components/pages/update-detail',
      params: { id: update.id }
    });
  };

  const handleFilterPress = async () => {
    Alert.alert(
      'Filter Updates',
      'Select a category to filter by:',
      categories.map(category => ({
        text: category === 'all' ? 'All Updates' : category.charAt(0).toUpperCase() + category.slice(1),
        onPress: () => {
          setSelectedCategory(category);
          setLoading(true);
        }
      })),
      { cancelable: true }
    );
  };

  const handleCreateUpdate = async () => {
    const userRole = await fetchUserProfile();
    
    if (userRole !== 'organization') {
      Alert.alert(
        'Permission Required',
        'Only organizations can create updates. Please switch to an organization account.'
      );
      return;
    }
    
    setShowCreateUpdateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateUpdateModal(false);
    loadUpdates();
  };

  return (
    <ScreenContainer>
      <ScrollView
        style={updateStyles.container}
        contentContainerStyle={updateStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4A5568"
          />
        }
      >
        {/* Header */}
        <View style={updateStyles.header}>
          <View style={updateStyles.headerContent}>
            <Text style={updateStyles.headerTitle}>Updates & News</Text>
            <Text style={updateStyles.headerSubtitle}>
              Latest developments from our partner organizations
            </Text>
          </View>

          <TouchableOpacity
            style={updateStyles.headerStats}
            activeOpacity={0.7}
            onPress={handleFilterPress}
          >
            <View style={updateStyles.statPill}>
              <Text style={updateStyles.statPillNumber}>{updates.length}</Text>
              <Text style={updateStyles.statPillLabel}>
                {selectedCategory === 'all' ? 'Updates' : selectedCategory}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Create Update Button (for organizations) */}
        <TouchableOpacity
          style={updateStyles.createUpdateButton}
          onPress={handleCreateUpdate}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../assets/images/add.png')}
            style={updateStyles.createUpdateIcon}
          />
          <Text style={updateStyles.createUpdateText}>Create Update</Text>
        </TouchableOpacity>

        {/* Timeline Section */}
        <View style={updateStyles.timelineContainer}>
          <View style={updateStyles.timelineHeader}>
            <Text style={updateStyles.timelineTitle}>Recent Activity</Text>
            <TouchableOpacity
              style={updateStyles.timelineFilter}
              activeOpacity={0.7}
              onPress={handleFilterPress}
            >
              <Text style={updateStyles.timelineFilterText}>
                {selectedCategory === 'all' 
                  ? 'All Updates' 
                  : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
                }
              </Text>
              <Image
                source={require('../../../assets/images/filter.png')}
                style={updateStyles.filterIcon}
              />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={updateStyles.loadingContainer}>
              <ActivityIndicator size="large" color="#4A5568" />
              <Text style={updateStyles.loadingText}>Loading updates...</Text>
            </View>
          ) : (
            <View style={updateStyles.updatesList}>
              {updates.map((item, index) => (
                <View key={item.id} style={updateStyles.timelineItem}>
                  <View style={updateStyles.timelineLineContainer}>
                    <View style={[
                      updateStyles.timelineDot,
                      { backgroundColor: getCategoryColor(item.category) }
                    ]} />
                    {index !== updates.length - 1 && (
                      <View style={updateStyles.timelineLine} />
                    )}
                  </View>

                  <UpdateTab
                    update={item}
                    isLast={index === updates.length - 1}
                    onPress={() => handleUpdatePress(item)}
                  />
                </View>
              ))}

              {updates.length === 0 && (
                <View style={updateStyles.noUpdatesContainer}>
                  <Image
                    source={require('../../../assets/images/empty-updates.png')}
                    style={updateStyles.emptyIcon}
                  />
                  <Text style={updateStyles.noUpdatesText}>
                    {selectedCategory === 'all' 
                      ? 'No updates available' 
                      : `No updates in ${selectedCategory} category`
                    }
                  </Text>
                  <Text style={updateStyles.noUpdatesSubtext}>
                    Check back later for the latest news from our partners
                  </Text>
                  {selectedCategory !== 'all' && (
                    <TouchableOpacity
                      style={updateStyles.clearFilterButton}
                      onPress={() => {
                        setSelectedCategory('all');
                        setLoading(true);
                      }}
                    >
                      <Text style={updateStyles.clearFilterText}>
                        Clear Filter
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={updateStyles.refreshButton}
                    onPress={onRefresh}
                  >
                    <Text style={updateStyles.refreshButtonText}>Refresh</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={updateStyles.bottomSpacing} />
      </ScrollView>

      {/* Modal for Create Update */}
      <Modal
        visible={showCreateUpdateModal}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <CreateUpdateModal 
          onClose={handleCloseModal}
          onUpdateCreated={loadUpdates}
        />
      </Modal>

      <Footer activeTab={activeTab} onTabPress={onTabPress} />
    </ScreenContainer>
  );
}

// Helper function to get color based on category
const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'general': '#4A5568',
    'progress': '#48BB78',
    'milestone': '#4299E1',
    'event': '#ED8936',
    'announcement': '#9F7AEA',
    'emergency': '#F56565',
    'infrastructure': '#4A5568',
    'education': '#4299E1',
    'health': '#F56565',
    'agriculture': '#48BB78',
  };
  return colorMap[category] || '#4A5568';
};