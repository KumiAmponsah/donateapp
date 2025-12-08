import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { profileStyles } from '../styles/profile';
import { StatusBar } from "expo-status-bar";
import Footer from './footer';
import * as ImagePicker from 'expo-image-picker';

interface ProfileProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

export default function Profile({ activeTab, onTabPress }: ProfileProps) {
  // Dummy user data (no backend)
  const [user, setUser] = useState({
    first_name: "John",
    last_name: "Doe",
    email: "johndoe@example.com",
    phone: "+233 555 123 456",
    avatar_url: null as string | null,
  });

  // Dummy donor data
  const [donor] = useState({
    total_donations: 2500,
    total_donation_count: 12,
    member_since: "2023-01-10",
  });

  const [uploading, setUploading] = useState(false);

  // Pick image — only local preview, no upload
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted")
        return Alert.alert("Permission Denied", "Camera roll permission needed");

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.canceled && result.assets[0]) {
        setUploading(true);
        setUser(prev => ({ ...prev, avatar_url: result.assets[0].uri }));
        setUploading(false);
      }
    } catch (error) {
      Alert.alert("Error", "Unable to pick image");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logged Out", "This is a frontend-only mock. No backend logout performed.");
  };

  const getInitials = () =>
    `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();

  const getFullName = () =>
    `${user.first_name} ${user.last_name}`;

  const getMemberLevel = () => {
    const total = donor.total_donations;
    if (total >= 5000) return "Gold Donor";
    if (total >= 1000) return "Silver Donor";
    return "Bronze Donor";
  };

  return (
    <View style={profileStyles.mainContainer}>
      <StatusBar style="dark" />
      <ScrollView
        style={profileStyles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
      >
        <View style={profileStyles.content}>
          {/* Header */}
          <View style={profileStyles.header}>
            <View style={profileStyles.profileImageContainer}>
              {user.avatar_url ? (
                <Image
                  source={{ uri: user.avatar_url }}
                  style={profileStyles.profileImage}
                />
              ) : (
                <View style={profileStyles.profileImage}>
                  <Text style={profileStyles.profileInitials}>{getInitials()}</Text>
                </View>
              )}

              <TouchableOpacity
                style={profileStyles.editImageButton}
                onPress={pickImage}
                disabled={uploading}
              >
                <Image
                  source={require('../../../assets/images/edit.png')}
                  style={profileStyles.cameraIcon}
                  resizeMode="contain"
                />
                {uploading && (
                  <View style={profileStyles.uploadingOverlay}>
                    <Text style={profileStyles.uploadingText}>Loading...</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <Text style={profileStyles.userName}>{getFullName()}</Text>
            <Text style={profileStyles.memberLevel}>{getMemberLevel()}</Text>
          </View>

          {/* Stats */}
          <View style={profileStyles.statsContainer}>
            <View style={profileStyles.statCard}>
              <View style={profileStyles.statIconWrapper}>
                <Image
                  source={require('../../../assets/images/donation.png')}
                  style={profileStyles.statIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={profileStyles.statTextContainer}>
                <Text style={profileStyles.statNumber}>{donor.total_donation_count}</Text>
                <Text style={profileStyles.statLabel}>Total Donations</Text>
              </View>
            </View>

            <View style={profileStyles.statCard}>
              <View style={profileStyles.statIconWrapper}>
                <Image
                  source={require('../../../assets/images/profit.png')}
                  style={profileStyles.statIconprofit}
                  resizeMode="contain"
                />
              </View>
              <View style={profileStyles.statTextContainer}>
                <Text style={profileStyles.statNumber}>
                  ₵ {donor.total_donations.toLocaleString()}
                </Text>
                <Text style={profileStyles.statLabel}>Total Given</Text>
              </View>
            </View>
          </View>

          {/* Personal Info */}
          <View style={profileStyles.section}>
            <Text style={profileStyles.sectionTitle}>Personal Information</Text>

            <View style={profileStyles.infoItem}>
              <View style={profileStyles.infoIconWrapper}>
                <Image
                  source={require('../../../assets/images/email.png')}
                  style={profileStyles.infoIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={profileStyles.infoContent}>
                <Text style={profileStyles.infoLabel}>Email</Text>
                <Text style={profileStyles.infoValue}>{user.email}</Text>
              </View>
            </View>

            <View style={profileStyles.infoItem}>
              <View style={profileStyles.infoIconWrapper}>
                <Image
                  source={require('../../../assets/images/phone-call.png')}
                  style={profileStyles.infoIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={profileStyles.infoContent}>
                <Text style={profileStyles.infoLabel}>Phone</Text>
                <Text style={profileStyles.infoValue}>{user.phone}</Text>
              </View>
            </View>

            <View style={profileStyles.infoItem}>
              <View style={profileStyles.infoIconWrapper}>
                <Image
                  source={require('../../../assets/images/calendar.png')}
                  style={profileStyles.infoIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={profileStyles.infoContent}>
                <Text style={profileStyles.infoLabel}>Member Since</Text>
                <Text style={profileStyles.infoValue}>
                  {new Date(donor.member_since).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Settings */}
          <View style={profileStyles.section}>
            <Text style={profileStyles.sectionTitle}>Settings</Text>

            <TouchableOpacity style={profileStyles.settingsItem}>
              <View style={profileStyles.settingsLeft}>
                <View style={profileStyles.settingsIconWrapper}>
                  <Image
                    source={require('../../../assets/images/bell.png')}
                    style={profileStyles.settingsIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={profileStyles.settingsText}>Notifications</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={profileStyles.settingsItem}>
              <View style={profileStyles.settingsLeft}>
                <View style={profileStyles.settingsIconWrapper}>
                  <Image
                    source={require('../../../assets/images/security.png')}
                    style={profileStyles.settingsIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={profileStyles.settingsText}>Privacy & Security</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[profileStyles.settingsItem, profileStyles.lastSettingsItem]}
              onPress={handleLogout}
            >
              <View style={profileStyles.settingsLeft}>
                <View
                  style={[profileStyles.settingsIconWrapper, profileStyles.logoutIconWrapper]}
                >
                  <Image
                    source={require('../../../assets/images/logout.png')}
                    style={profileStyles.logoutIcon}
                    resizeMode="contain"
                  />
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
