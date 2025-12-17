// C:\Users\cypri\Documents\donateapp\app\components\pages\update-detail.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import SafeAreaWrapper from '../common/SafeAreaWrapper';
import { supabase } from '../../../supabase';

interface UpdateDetail {
  id: string;
  title: string;
  content: string;
  created_at: string;
  organization: {
    organization_name: string;
    avatar_url?: string;
  };
  image_url: string | null;
  category: string;
  read_time_minutes: number;
  campaign_title?: string;
}

export default function UpdateDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const updateId = params.id as string;

  const [update, setUpdate] = useState<UpdateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedUpdates, setRelatedUpdates] = useState<UpdateDetail[]>([]);

  useEffect(() => {
    fetchUpdateDetail();
  }, [updateId]);

  const fetchUpdateDetail = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('updates')
        .select(`
          *,
          organization:profiles!updates_organization_id_fkey (
            organization_name,
            avatar_url
          ),
          campaign:campaigns!updates_campaign_id_fkey (
            title
          )
        `)
        .eq('id', updateId)
        .eq('is_deleted', false)
        .single();

      if (error) throw error;

      setUpdate({
        id: data.id,
        title: data.title,
        content: data.content,
        created_at: data.created_at,
        organization: {
          organization_name: data.organization.organization_name,
          avatar_url: data.organization.avatar_url
        },
        image_url: data.image_url,
        category: data.category,
        read_time_minutes: data.read_time_minutes,
        campaign_title: data.campaign?.title
      });

      // Fetch related updates (same organization)
      const { data: relatedData } = await supabase
        .from('updates')
        .select(`
          *,
          organization:profiles!updates_organization_id_fkey (
            organization_name,
            avatar_url
          ),
          campaign:campaigns!updates_campaign_id_fkey (
            title
          )
        `)
        .eq('organization_id', data.organization_id)
        .neq('id', updateId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(3);

      setRelatedUpdates(relatedData?.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        created_at: item.created_at,
        organization: {
          organization_name: item.organization.organization_name,
          avatar_url: item.organization.avatar_url
        },
        image_url: item.image_url,
        category: item.category,
        read_time_minutes: item.read_time_minutes,
        campaign_title: item.campaign?.title
      })) || []);

    } catch (error) {
      console.error('Error fetching update detail:', error);
      Alert.alert('Error', 'Failed to load update');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!update) return;

    try {
      await Share.share({
        message: `${update.title}\n\n${update.content.substring(0, 200)}...\n\nShared from DonateApp`,
        url: update.image_url || undefined,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaWrapper>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4A5568" />
          <Text style={{ marginTop: 10, color: '#718096' }}>Loading update...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (!update) {
    return (
      <SafeAreaWrapper>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, color: '#4A5568', marginBottom: 20 }}>
            Update not found
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#4A5568', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
            onPress={() => router.back()}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper disableBottom>
      <StatusBar style="dark" />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Back Button and Share */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: '#4A5568', fontSize: 16 }}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare}>
            <Text style={{ color: '#4A5568', fontSize: 16 }}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Image */}
        {update.image_url && (
          <Image
            source={{ uri: update.image_url }}
            style={{ width: '100%', height: 250 }}
            resizeMode="cover"
          />
        )}

        {/* Content */}
        <View style={{ padding: 20 }}>
          {/* Category */}
          <Text style={{ color: '#718096', fontSize: 12, textTransform: 'uppercase', marginBottom: 10 }}>
            {update.category}
          </Text>

          {/* Title */}
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#2D3748', marginBottom: 15 }}>
            {update.title}
          </Text>

          {/* Organization */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            {update.organization.avatar_url ? (
              <Image
                source={{ uri: update.organization.avatar_url }}
                style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
              />
            ) : (
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#4A5568', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                  {update.organization.organization_name.substring(0, 2).toUpperCase()}
                </Text>
              </View>
            )}
            <View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#4A5568' }}>
                {update.organization.organization_name}
              </Text>
              <Text style={{ fontSize: 12, color: '#718096' }}>
                {new Date(update.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Campaign Info */}
          {update.campaign_title && (
            <View style={{ backgroundColor: '#F7FAFC', padding: 15, borderRadius: 8, marginBottom: 20 }}>
              <Text style={{ fontSize: 12, color: '#718096', marginBottom: 5 }}>Related Campaign</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#4A5568' }}>
                {update.campaign_title}
              </Text>
            </View>
          )}

          {/* Content */}
          <Text style={{ fontSize: 16, lineHeight: 24, color: '#4A5568' }}>
            {update.content}
          </Text>
        </View>

        {/* Related Updates */}
        {relatedUpdates.length > 0 && (
          <View style={{ padding: 20, paddingTop: 40 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#2D3748', marginBottom: 15 }}>
              More from {update.organization.organization_name}
            </Text>
            {relatedUpdates.map((relatedUpdate) => (
              <TouchableOpacity
                key={relatedUpdate.id}
                style={{ backgroundColor: '#F7FAFC', padding: 15, borderRadius: 8, marginBottom: 10 }}
                onPress={() => router.push(`/components/pages/update-detail?id=${relatedUpdate.id}`)}
              >
                <Text style={{ fontSize: 14, color: '#718096', marginBottom: 5 }}>
                  {new Date(relatedUpdate.created_at).toLocaleDateString()}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#4A5568' }}>
                  {relatedUpdate.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
}