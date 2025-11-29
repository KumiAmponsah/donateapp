import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { profileStyles } from '../styles/profile';
import { StatusBar } from "expo-status-bar";
import Footer from './footer';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

interface ProfileProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
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

interface DonorData {
  total_donations: number;
  total_donation_count: number;
  member_since: string;
}

export default function Profile({ activeTab, onTabPress }: ProfileProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [donor, setDonor] = useState<DonorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchUserData(); }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return router.replace('/components/pages/login');

      const { data: userData } = await supabase.from('users').select('*').eq('id', authUser.id).single();
      const { data: donorData } = await supabase.from('donors').select('*').eq('user_id', authUser.id).single();

      setUser(userData);
      if (donorData) setDonor(donorData);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") return Alert.alert("Permission Denied", "Camera roll permission needed");

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Unable to pick image");
    }
  };

  const uploadProfilePicture = async (uri: string) => {
    if (!user) return;
    
    setUploading(true);
    try {
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Create FormData for React Native
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        name: fileName,
        type: `image/${fileExt}`,
      } as any);

      // Upload to Supabase storage using FormData
      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(fileName, formData, { 
          contentType: `image/${fileExt}`,
          upsert: true 
        });

      if (uploadError) {
        console.log('Upload error details:', uploadError);
        throw uploadError;
      }

      // Get public URL with cache busting
      const { data: urlData } = supabase.storage.from('user-avatars').getPublicUrl(fileName);
      const timestamp = new Date().getTime();
      const avatarUrlWithCache = `${urlData.publicUrl}?t=${timestamp}`;
      
      // Update user record with avatar URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: avatarUrlWithCache })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update local state immediately with cache-busted URL
      setUser(prev => prev ? { ...prev, avatar_url: avatarUrlWithCache } : null);
      Alert.alert('Success', 'Profile picture updated!');
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('Error', error.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/components/pages/login');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'U';
  };

  const getFullName = () => {
    if (!user) return 'User';
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User';
  };

  const getMemberLevel = () => {
    const total = donor?.total_donations || 0;
    if (total >= 5000) return 'Gold Donor';
    if (total >= 1000) return 'Silver Donor';
    return 'Bronze Donor';
  };

  if (loading) {
    return (
      <View style={profileStyles.mainContainer}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={profileStyles.mainContainer}>
      <StatusBar style="dark" />
      <ScrollView style={profileStyles.container} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={true}>
        <View style={profileStyles.content}>
          <View style={profileStyles.header}>
            <View style={profileStyles.profileImageContainer}>
              {user?.avatar_url ? (
                <Image 
                  source={{ 
                    uri: user.avatar_url,
                    cache: 'reload' // Force reload to avoid cached images
                  }} 
                  style={profileStyles.profileImage} 
                  key={user.avatar_url} // Add key to force re-render when URL changes
                />
              ) : (
                <View style={profileStyles.profileImage}>
                  <Text style={profileStyles.profileInitials}>{getInitials()}</Text>
                </View>
              )}
              <TouchableOpacity style={profileStyles.editImageButton} onPress={pickImage} disabled={uploading}>
                <Image source={require('../../../assets/images/edit.png')} style={profileStyles.cameraIcon} resizeMode="contain" />
                {uploading && (
                  <View style={profileStyles.uploadingOverlay}>
                    <Text style={profileStyles.uploadingText}>Uploading...</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            
            <Text style={profileStyles.userName}>{getFullName()}</Text>
            <Text style={profileStyles.memberLevel}>{getMemberLevel()}</Text>
          </View>

          <View style={profileStyles.statsContainer}>
            <View style={profileStyles.statCard}>
              <View style={profileStyles.statIconWrapper}>
                <Image source={require('../../../assets/images/donation.png')} style={profileStyles.statIcon} resizeMode="contain" />
              </View>
              <View style={profileStyles.statTextContainer}>
                <Text style={profileStyles.statNumber}>{donor?.total_donation_count || 0}</Text>
                <Text style={profileStyles.statLabel}>Total Donations</Text>
              </View>
            </View>

            <View style={profileStyles.statCard}>
              <View style={profileStyles.statIconWrapper}>
                <Image source={require('../../../assets/images/profit.png')} style={profileStyles.statIconprofit} resizeMode="contain" />
              </View>
              <View style={profileStyles.statTextContainer}>
                <Text style={profileStyles.statNumber}>₵ {(donor?.total_donations || 0).toLocaleString()}</Text>
                <Text style={profileStyles.statLabel}>Total Given</Text>
              </View>
            </View>
          </View>

          <View style={profileStyles.section}>
            <Text style={profileStyles.sectionTitle}>Personal Information</Text>
            
            <View style={profileStyles.infoItem}>
              <View style={profileStyles.infoIconWrapper}>
                <Image source={require('../../../assets/images/email.png')} style={profileStyles.infoIcon} resizeMode="contain" />
              </View>
              <View style={profileStyles.infoContent}>
                <Text style={profileStyles.infoLabel}>Email</Text>
                <Text style={profileStyles.infoValue}>{user?.email || 'Not provided'}</Text>
              </View>
            </View>

            <View style={profileStyles.infoItem}>
              <View style={profileStyles.infoIconWrapper}>
                <Image source={require('../../../assets/images/phone-call.png')} style={profileStyles.infoIcon} resizeMode="contain" />
              </View>
              <View style={profileStyles.infoContent}>
                <Text style={profileStyles.infoLabel}>Phone</Text>
                <Text style={profileStyles.infoValue}>{user?.phone || 'Not provided'}</Text>
              </View>
            </View>

            <View style={profileStyles.infoItem}>
              <View style={profileStyles.infoIconWrapper}>
                <Image source={require('../../../assets/images/calendar.png')} style={profileStyles.infoIcon} resizeMode="contain" />
              </View>
              <View style={profileStyles.infoContent}>
                <Text style={profileStyles.infoLabel}>Member Since</Text>
                <Text style={profileStyles.infoValue}>
                  {donor?.member_since ? new Date(donor.member_since).toLocaleDateString() : 'Recently'}
                </Text>
              </View>
            </View>
          </View>

          <View style={profileStyles.section}>
            <Text style={profileStyles.sectionTitle}>Settings</Text>
            
            <TouchableOpacity style={profileStyles.settingsItem}>
              <View style={profileStyles.settingsLeft}>
                <View style={profileStyles.settingsIconWrapper}>
                  <Image source={require('../../../assets/images/bell.png')} style={profileStyles.settingsIcon} resizeMode="contain" />
                </View>
                <Text style={profileStyles.settingsText}>Notifications</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={profileStyles.settingsItem}>
              <View style={profileStyles.settingsLeft}>
                <View style={profileStyles.settingsIconWrapper}>
                  <Image source={require('../../../assets/images/security.png')} style={profileStyles.settingsIcon} resizeMode="contain" />
                </View>
                <Text style={profileStyles.settingsText}>Privacy & Security</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[profileStyles.settingsItem, profileStyles.lastSettingsItem]} onPress={handleLogout}>
              <View style={profileStyles.settingsLeft}>
                <View style={[profileStyles.settingsIconWrapper, profileStyles.logoutIconWrapper]}>
                  <Image source={require('../../../assets/images/logout.png')} style={profileStyles.logoutIcon} resizeMode="contain" />
                </View>
                <Text style={profileStyles.logoutText}>Log Out</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Footer activeTab={activeTab} onTabPress={onTabPress} />
    </View>
  );
}