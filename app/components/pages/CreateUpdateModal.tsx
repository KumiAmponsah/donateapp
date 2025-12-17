// C:\Users\cypri\Documents\donateapp\app\components\pages\CreateUpdateModal.tsx
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
  Modal,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../../supabase';

interface CreateUpdateModalProps {
  onClose: () => void;
  onUpdateCreated: () => void;
}

export default function CreateUpdateModal({ onClose, onUpdateCreated }: CreateUpdateModalProps) {
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
        onClose();
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
        onClose();
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile');
      onClose();
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
            onPress: () => {
              onUpdateCreated();
              onClose();
            }
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
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Modal Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Update</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Title */}
          <View>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter update title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#A0AEC0"
              maxLength={200}
            />
            <Text style={styles.charCount}>{title.length}/200</Text>
          </View>

          {/* Content */}
          <View>
            <Text style={styles.label}>Content *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Share your update with the community..."
              value={content}
              onChangeText={setContent}
              onChange={calculateReadTime}
              placeholderTextColor="#A0AEC0"
              multiline
              numberOfLines={10}
            />
            <View style={styles.contentInfo}>
              <Text style={styles.infoText}>Read time: ~{readTime} min</Text>
              <Text style={styles.infoText}>
                {content.trim().split(/\s+/).length} words
              </Text>
            </View>
          </View>

          {/* Category */}
          <View>
            <Text style={styles.label}>Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryButton,
                    category === cat.value && styles.categoryButtonActive
                  ]}
                  onPress={() => setCategory(cat.value)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    category === cat.value && styles.categoryButtonTextActive
                  ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Campaign (Optional) */}
          {campaigns.length > 0 && (
            <View>
              <Text style={styles.label}>Link to Campaign (Optional)</Text>
              <View style={styles.campaignContainer}>
                {campaigns.map((campaign) => (
                  <TouchableOpacity
                    key={campaign.id}
                    style={[
                      styles.campaignButton,
                      selectedCampaign === campaign.id && styles.campaignButtonActive
                    ]}
                    onPress={() => setSelectedCampaign(
                      selectedCampaign === campaign.id ? '' : campaign.id
                    )}
                  >
                    <Text style={[
                      styles.campaignButtonText,
                      selectedCampaign === campaign.id && styles.campaignButtonTextActive
                    ]}>
                      {campaign.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Image Upload */}
          <View>
            <Text style={styles.label}>Image (Optional)</Text>
            <TouchableOpacity
              style={[styles.imageUpload, imageUri && styles.imageUploadFilled]}
              onPress={pickImage}
              activeOpacity={0.7}
            >
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              ) : (
                <>
                  <Image
                    source={require('../../../assets/images/add-image.png')}
                    style={styles.imagePlaceholder}
                  />
                  <Text style={styles.imageUploadText}>Tap to add an image</Text>
                </>
              )}
            </TouchableOpacity>
            {imageUri && (
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImageUri(null)}
              >
                <Text style={styles.removeImageText}>Remove Image</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Publish Update</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#4A5568',
    lineHeight: 28,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  content: {
    gap: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#2D3748',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textArea: {
    minHeight: 200,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#718096',
    marginTop: 5,
    textAlign: 'right',
  },
  contentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  infoText: {
    fontSize: 12,
    color: '#718096',
  },
  categoryScroll: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 10,
  },
  categoryButton: {
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryButtonActive: {
    backgroundColor: '#4A5568',
    borderColor: '#4A5568',
  },
  categoryButtonText: {
    color: '#4A5568',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  campaignContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  campaignButton: {
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  campaignButtonActive: {
    backgroundColor: '#4A5568',
    borderColor: '#4A5568',
  },
  campaignButtonText: {
    color: '#4A5568',
    fontSize: 14,
    fontWeight: '500',
  },
  campaignButtonTextActive: {
    color: '#FFFFFF',
  },
  imageUpload: {
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageUploadFilled: {
    borderStyle: 'solid',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    tintColor: '#CBD5E0',
    marginBottom: 10,
  },
  imageUploadText: {
    color: '#718096',
    fontSize: 14,
  },
  removeImageButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  removeImageText: {
    color: '#F56565',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#4A5568',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});