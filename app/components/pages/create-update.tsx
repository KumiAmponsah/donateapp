// C:\Users\cypri\Documents\donateapp\app\components\pages\create-update.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SafeAreaWrapper from '../common/SafeAreaWrapper';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../../supabase';

export default function CreateUpdate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [readTime, setReadTime] = useState('2');

  const categories = [
    { value: 'general', label: 'General Update' },
    { value: 'progress', label: 'Progress Report' },
    { value: 'milestone', label: 'Milestone Reached' },
    { value: 'event', label: 'Event' },
    { value: 'announcement', label: 'Announcement' },
    { value: 'emergency', label: 'Emergency Alert' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'education', label: 'Education' },
    { value: 'health', label: 'Health' },
    { value: 'agriculture', label: 'Agriculture' },
  ];

  useEffect(() => {
    fetchUserProfile();
    fetchCampaigns();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'Please log in to create updates');
        router.back();
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data.role !== 'organization') {
        Alert.alert('Error', 'Only organizations can create updates');
        router.back();
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile');
      router.back();
    }
  };

  const fetchCampaigns = async () => {
    try {
      if (!userProfile) return;

      const { data, error } = await supabase
        .from('campaigns')
        .select('id, title, status')
        .eq('organization_id', userProfile.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Allow photo access to upload images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.8,
      aspect: [16, 9],
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!imageUri || !userProfile) return null;

    try {
      const fileExt = imageUri.split('.').pop()?.toLowerCase() ?? 'jpg';
      const fileName = `${userProfile.id}_${Date.now()}.${fileExt}`;
      const filePath = `${userProfile.id}/${fileName}`;
      const mimeType = `image/${fileExt}`;

      const formData = new FormData();
      formData.append("file", {
        uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
        type: mimeType,
        name: fileName,
      } as any);

      const { error: uploadError, data } = await supabase.storage
        .from('campaigns')
        .upload(filePath, formData, {
          contentType: mimeType,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('campaigns')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Error', 'Please enter content');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      if (imageUri) {
        imageUrl = await uploadImage();
      }

      const updateData: any = {
        organization_id: userProfile.id,
        title: title.trim(),
        content: content.trim(),
        category,
        read_time_minutes: parseInt(readTime) || 2,
        created_by: userProfile.user_id,
      };

      if (selectedCampaign) {
        updateData.campaign_id = selectedCampaign;
      }

      if (imageUrl) {
        updateData.image_url = imageUrl;
      }

      const { error } = await supabase
        .from('updates')
        .insert([updateData]);

      if (error) throw error;

      Alert.alert(
        'Success!',
        'Update created successfully',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/components/pages/update')
          }
        ]
      );
    } catch (error) {
      console.error('Error creating update:', error);
      Alert.alert('Error', 'Failed to create update');
    } finally {
      setLoading(false);
    }
  };

  const calculateReadTime = () => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    setReadTime(minutes.toString());
  };

  return (
    <SafeAreaWrapper>
      <StatusBar style="dark" />
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
     
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ fontSize: 16, color: '#4A5568', marginRight: 20 }}>← Cancel</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2D3748' }}>
            Create Update
          </Text>
        </View>

     
        <View style={{ gap: 20 }}>
       
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#4A5568', marginBottom: 8 }}>
              Title *
            </Text>
            <TextInput
              style={{
                backgroundColor: '#F7FAFC',
                borderRadius: 10,
                padding: 15,
                fontSize: 16,
                color: '#2D3748',
                borderWidth: 1,
                borderColor: '#E2E8F0',
              }}
              placeholder="Enter update title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#A0AEC0"
              maxLength={200}
            />
            <Text style={{ fontSize: 12, color: '#718096', marginTop: 5, textAlign: 'right' }}>
              {title.length}/200
            </Text>
          </View>

          {/* Content */}
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#4A5568', marginBottom: 8 }}>
              Content *
            </Text>
            <TextInput
              style={{
                backgroundColor: '#F7FAFC',
                borderRadius: 10,
                padding: 15,
                fontSize: 16,
                color: '#2D3748',
                borderWidth: 1,
                borderColor: '#E2E8F0',
                minHeight: 200,
                textAlignVertical: 'top',
              }}
              placeholder="Share your update with the community..."
              value={content}
              onChangeText={setContent}
              onChange={calculateReadTime}
              placeholderTextColor="#A0AEC0"
              multiline
              numberOfLines={10}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
              <Text style={{ fontSize: 12, color: '#718096' }}>
                Read time: ~{readTime} min
              </Text>
              <Text style={{ fontSize: 12, color: '#718096' }}>
                {content.trim().split(/\s+/).length} words
              </Text>
            </View>
          </View>

          {/* Category */}
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#4A5568', marginBottom: 8 }}>
              Category
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={{ flexDirection: 'row', gap: 10 }}
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={{
                    backgroundColor: category === cat.value ? '#4A5568' : '#F7FAFC',
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: category === cat.value ? '#4A5568' : '#E2E8F0',
                  }}
                  onPress={() => setCategory(cat.value)}
                >
                  <Text style={{
                    color: category === cat.value ? '#FFFFFF' : '#4A5568',
                    fontSize: 14,
                    fontWeight: '500',
                  }}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Campaign (Optional) */}
          {campaigns.length > 0 && (
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#4A5568', marginBottom: 8 }}>
                Link to Campaign (Optional)
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {campaigns.map((campaign) => (
                  <TouchableOpacity
                    key={campaign.id}
                    style={{
                      backgroundColor: selectedCampaign === campaign.id ? '#4A5568' : '#F7FAFC',
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: selectedCampaign === campaign.id ? '#4A5568' : '#E2E8F0',
                    }}
                    onPress={() => setSelectedCampaign(
                      selectedCampaign === campaign.id ? '' : campaign.id
                    )}
                  >
                    <Text style={{
                      color: selectedCampaign === campaign.id ? '#FFFFFF' : '#4A5568',
                      fontSize: 14,
                      fontWeight: '500',
                    }}>
                      {campaign.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Image Upload */}
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#4A5568', marginBottom: 8 }}>
              Image (Optional)
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#F7FAFC',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#E2E8F0',
                borderStyle: imageUri ? 'solid' : 'dashed',
                height: 200,
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
              onPress={pickImage}
              activeOpacity={0.7}
            >
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              ) : (
                <>
                  <Image
                    source={require('../../../assets/images/add-image.png')}
                    style={{ width: 60, height: 60, tintColor: '#CBD5E0', marginBottom: 10 }}
                  />
                  <Text style={{ color: '#718096', fontSize: 14 }}>
                    Tap to add an image
                  </Text>
                </>
              )}
            </TouchableOpacity>
            {imageUri && (
              <TouchableOpacity
                style={{ marginTop: 10, alignSelf: 'flex-end' }}
                onPress={() => setImageUri(null)}
              >
                <Text style={{ color: '#F56565', fontSize: 14 }}>
                  Remove Image
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#4A5568',
              borderRadius: 25,
              paddingVertical: 16,
              alignItems: 'center',
              marginTop: 20,
              opacity: loading ? 0.7 : 1,
            }}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' }}>
                Publish Update
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}