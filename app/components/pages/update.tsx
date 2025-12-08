import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { updateStyles } from '../styles/update';
import Footer from './footer';

// ----------------------
// CLEAN UPDATE TYPE (ONLY UI FIELDS)
// ----------------------

interface UpdateItem {
  id: string;
  title: string;
  description: string;
  date: string;
  organization: string;
  image?: any;
  category: string;
  readTime: number;
}

interface UpdateTabProps {
  update: UpdateItem;
  isLast: boolean;
}

// ----------------------
// DATE FORMATTER (FRONTEND ONLY)
// ----------------------

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// ----------------------
// UPDATE CARD COMPONENT
// ----------------------

const UpdateTab: React.FC<UpdateTabProps> = ({ update, isLast }) => {
  return (
    <TouchableOpacity
      style={[updateStyles.updateCard, isLast && updateStyles.lastUpdateCard]}
      activeOpacity={0.9}
    >
      <View style={updateStyles.cardAccent} />

      <View style={updateStyles.cardContent}>
        <View style={updateStyles.cardHeader}>
          <View style={updateStyles.organizationContainer}>
            <View style={updateStyles.organizationDot} />
            <Text style={updateStyles.organizationText}>
              {update.organization}
            </Text>
          </View>
          <Text style={updateStyles.dateText}>{formatDate(update.date)}</Text>
        </View>

        <Text style={updateStyles.updateTitle}>{update.title}</Text>

        <Text style={updateStyles.updateDescription} numberOfLines={2}>
          {update.description}
        </Text>

        <View style={updateStyles.cardFooter}>
          <View style={updateStyles.categoryContainer}>
            <View style={updateStyles.categoryPill}>
              <Text style={updateStyles.categoryText}>
                {update.category}
              </Text>
            </View>
          </View>

          <Text style={updateStyles.readTimeText}>{update.readTime} min read</Text>
        </View>

        <View style={updateStyles.progressLine} />
      </View>
    </TouchableOpacity>
  );
};

// ----------------------
// MAIN UPDATES UI (STATIC FRONTEND)
// ----------------------

interface UpdatesProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

export default function Updates({ activeTab, onTabPress }: UpdatesProps) {
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // PURE STATIC FRONTEND DATA
    const mockData: UpdateItem[] = [
      {
        id: "1",
        title: "New Water Pump Installed",
        description: "A new solar-powered water pump has been successfully installed...",
        date: new Date().toISOString(),
        organization: "Hope Foundation",
        image: require('../../../assets/images/campaign-water.jpg'),
        category: "Infrastructure",
        readTime: 3
      },
      {
        id: "2",
        title: "Children Receive School Supplies",
        description: "Over 150 children received new school supplies this week...",
        date: new Date(Date.now() - 86400000).toISOString(),
        organization: "Helping Hands",
        image: require('../../../assets/images/campaign-water.jpg'),
        category: "Education",
        readTime: 2
      }
    ];

    setUpdates(mockData);
    setLoading(false);
  }, []);

  return (
    <View style={updateStyles.mainContainer}>
      <ScrollView style={updateStyles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
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
              {updates.map((item, index) => (
                <View key={item.id} style={updateStyles.timelineItem}>
                  <View style={updateStyles.timelineLineContainer}>
                    <View style={updateStyles.timelineDot} />
                    {index !== updates.length - 1 && (
                      <View style={updateStyles.timelineLine} />
                    )}
                  </View>

                  <UpdateTab update={item} isLast={index === updates.length - 1} />
                </View>
              ))}

              {updates.length === 0 && (
                <View style={updateStyles.noUpdatesContainer}>
                  <Text style={updateStyles.noUpdatesText}>No updates available.</Text>
                  <Text style={updateStyles.noUpdatesSubtext}>
                    Check back later for more information.
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={updateStyles.bottomSpacing} />
      </ScrollView>

      <Footer activeTab={activeTab} onTabPress={onTabPress} />
    </View>
  );
}
