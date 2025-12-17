// C:\Users\cypri\Documents\donateapp\app\components\pages\create-campaign.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SafeAreaWrapper from '../common/SafeAreaWrapper';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../../supabase';
import { Platform } from 'react-native';

export default function CreateCampaign() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_amount: '',
    start_date: '',
    end_date: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to validate date format (YYYY-MM-DD)
  const isValidDateFormat = (dateString: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const [year, month, day] = dateString.split('-').map(Number);
    
    // Check if date is valid
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
  };

  // Helper function to format date for display
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please allow photo access to upload campaign images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.8,
      aspect: [16, 9],
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setUploadingImage(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not logged in');

      // Get file extension
      const fileExt = uri.split('.').pop()?.toLowerCase() ?? 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      const mimeType = `image/${fileExt}`;

      // Use FormData approach (same as profile upload)
      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        type: mimeType,
        name: fileName,
      } as any);

      const { error: uploadError } = await supabase.storage
        .from('campaigns')
        .upload(filePath, formData, {
          contentType: mimeType,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('campaigns')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a campaign title');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter a campaign description');
      return;
    }
    if (!formData.target_amount || parseFloat(formData.target_amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount');
      return;
    }
    if (!formData.start_date) {
      Alert.alert('Error', 'Please enter a start date');
      return;
    }
    
    // Validate date format
    if (!isValidDateFormat(formData.start_date)) {
      Alert.alert('Error', 'Please enter a valid start date in YYYY-MM-DD format');
      return;
    }
    
    if (formData.end_date && !isValidDateFormat(formData.end_date)) {
      Alert.alert('Error', 'Please enter a valid end date in YYYY-MM-DD format');
      return;
    }
    
    // Validate date range
    if (formData.end_date && formData.end_date <= formData.start_date) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }

    try {
      setLoading(true);

      // Check if user is an organization
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'Please log in to create a campaign');
        return;
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        throw profileError;
      }

      if (!profile || profile.role !== 'organization') {
        Alert.alert('Permission Denied', 'Only organizations can create campaigns');
        return;
      }


      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
      }


      const { error } = await supabase.from('campaigns').insert({
        organization_id: profile.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        image_url: imageUrl,
        target_amount: parseFloat(formData.target_amount),
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        status: 'active',
        amount_raised: 0,
        donor_count: 0,
        progress_percentage: 0,
        created_by: user.id,
      });

      if (error) throw error;

      Alert.alert(
        'Success',
        'Campaign created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error: any) {
      console.error('Create campaign error:', error);
      Alert.alert('Error', error.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <StatusBar style="dark" />
      <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
            <Text style={{ fontSize: 16, color: '#4A5568', fontWeight: '600' }}>← Cancel</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#2D3748' }}>
              Create Campaign
            </Text>
          </View>
          <View style={{ width: 60 }} /> 
        </View>

       
        <View style={{ marginBottom: 25 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#4A5568', marginBottom: 8 }}>
            Campaign Image (Optional)
          </Text>
          <TouchableOpacity
            onPress={pickImage}
            style={{
              height: 200,
              backgroundColor: '#F7FAFC',
              borderRadius: 12,
              borderWidth: 2,
              borderColor: '#E2E8F0',
              borderStyle: 'dashed',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {uploadingImage ? (
              <View style={{ alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#4A5568" />
                <Text style={{ marginTop: 10, color: '#718096', fontSize: 14 }}>
                  Uploading image...
                </Text>
              </View>
            ) : image ? (
              <>
                <Image
                  source={{ uri: image }}
                  style={{ width: '100%', height: '100%', borderRadius: 10 }}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: 15,
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => setImage(null)}
                >
                  <Text style={{ color: 'white', fontSize: 18 }}>×</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 48, color: '#CBD5E0' }}>+</Text>
                <Text style={{ marginTop: 8, color: '#718096', fontSize: 14 }}>
                  Add Campaign Image
                </Text>
                <Text style={{ marginTop: 4, color: '#A0AEC0', fontSize: 12, textAlign: 'center' }}>
                  Tap to select an image
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

    
        <View style={{ gap: 20 }}>
      
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#4A5568', marginBottom: 8 }}>
              Campaign Title *
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
              placeholder="Enter campaign title"
              placeholderTextColor="#A0AEC0"
              value={formData.title}
              onChangeText={(value) => handleChange('title', value)}
              maxLength={100}
            />
          </View>

      
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#4A5568', marginBottom: 8 }}>
              Description *
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
                height: 120,
                textAlignVertical: 'top',
              }}
              placeholder="Describe your campaign in detail..."
              placeholderTextColor="#A0AEC0"
              value={formData.description}
              onChangeText={(value) => handleChange('description', value)}
              multiline
              maxLength={1000}
            />
          </View>

       
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#4A5568', marginBottom: 8 }}>
              Target Amount (₵) *
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
              placeholder="0.00"
              placeholderTextColor="#A0AEC0"
              value={formData.target_amount}
              onChangeText={(value) => handleChange('target_amount', value)}
              keyboardType="numeric"
            />
          </View>

       
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#4A5568', marginBottom: 8 }}>
              Start Date *
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
              placeholder="YYYY-MM-DD (e.g., 2024-01-15)"
              placeholderTextColor="#A0AEC0"
              value={formData.start_date}
              onChangeText={(value) => handleChange('start_date', value)}
            />
            {formData.start_date && (
              <Text style={{ marginTop: 4, fontSize: 12, color: '#718096' }}>
                Display: {formatDateForDisplay(formData.start_date)}
              </Text>
            )}
          </View>

        
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#4A5568', marginBottom: 8 }}>
              End Date (Optional)
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
              placeholder="YYYY-MM-DD (e.g., 2024-12-31)"
              placeholderTextColor="#A0AEC0"
              value={formData.end_date}
              onChangeText={(value) => handleChange('end_date', value)}
            />
            {formData.end_date && (
              <>
                <Text style={{ marginTop: 4, fontSize: 12, color: '#718096' }}>
                  Display: {formatDateForDisplay(formData.end_date)}
                </Text>
                <TouchableOpacity
                  style={{ alignSelf: 'flex-end', marginTop: 4 }}
                  onPress={() => handleChange('end_date', '')}
                >
                  <Text style={{ fontSize: 12, color: '#F56565' }}>
                    Clear end date
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>


        <TouchableOpacity
          style={{
            backgroundColor: '#4A5568',
            borderRadius: 25,
            paddingVertical: 16,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 30,
            marginBottom: 50,
            opacity: (loading || uploadingImage) ? 0.7 : 1,
          }}
          onPress={handleSubmit}
          disabled={loading || uploadingImage}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' }}>
              Create Campaign
            </Text>
          )}
        </TouchableOpacity>

       
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <Text style={{ fontSize: 12, color: '#718096', textAlign: 'center' }}>
            * Required fields
          </Text>
          <Text style={{ fontSize: 12, color: '#718096', textAlign: 'center', marginTop: 4 }}>
            Date format: YYYY-MM-DD (e.g., 2024-01-15)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}