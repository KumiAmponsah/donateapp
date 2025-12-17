import React, { useCallback, useEffect, useState, memo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  RefreshControl,
} from "react-native";
import { useRouter } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

import { supabase } from "../../../supabase";
import { profileStyles } from "../styles/profile";
import Footer from "./footer";
import ScreenContainer from "../common/ScreenContainer";
import OrganizationDashboardModal from './OrganizationDashboardModal';
import AdminModal from './admin';
// ------------------------------
//      TYPES
// ------------------------------

interface ProfileProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: "donor" | "organization" | "admin";
  is_verified: boolean;

  organization_name: string | null;
  organization_description: string | null;
  year_established: number | null;
  contact_email: string | null;
  website: string | null;
  address: string | null;

  total_donations: number;
  total_donation_count: number;
  member_since: string;

  created_at: string;
  updated_at: string;

  total_received: number;
  total_received_count: number;
}

// ------------------------------
//      COMPONENT
// ------------------------------

export default function Profile({ activeTab, onTabPress }: ProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showOrgDashboard, setShowOrgDashboard] = useState(false);
  
  // ------------------------------
  //      FETCH PROFILE
  // ------------------------------

  const fetchProfile = useCallback(async () => {
    try {
      const { data: auth } = await supabase.auth.getUser();

      if (!auth.user) {
        Alert.alert("Error", "No logged-in user.");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", auth.user.id)
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (e) {
      console.error("Profile fetch error:", e);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfile();
  }, [fetchProfile]);

  // ------------------------------
  //      IMAGE COMPRESSION
  // ------------------------------

  const compressImage = async (uri: string) => {
    try {
      const result = await manipulateAsync(
        uri,
        [{ resize: { width: 1000 } }],
        {
          compress: 0.7,
          format: SaveFormat.JPEG,
        }
      );

      return result.uri;
    } catch (e) {
      console.log("Compression failed, using original image.");
      return uri;
    }
  };

  // ------------------------------
  //      IMAGE UPLOAD
  // ------------------------------

  const uploadImage = async (uri: string) => {
    try {
      setUploading(true);
      setUploadProgress(0);
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("User not logged in");

      const fileExt = uri.split(".").pop()?.toLowerCase() ?? "jpg";
      const fileName = `${auth.user.id}.${fileExt}`;
      const filePath = `${auth.user.id}/${fileName}`;
      const mimeType = `image/${fileExt}`;

      const formData = new FormData();
      formData.append("file", {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        type: mimeType,
        name: fileName,
      } as any);

      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(filePath, formData, {
          contentType: mimeType,
          upsert: true,
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadErr) throw uploadErr;

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const timestamp = new Date().getTime();
      const avatarUrlWithCacheBust = `${publicUrlData.publicUrl}?t=${timestamp}`;

      const { error: updateErr } = await supabase
        .from("profiles")
        .update({
          avatar_url: avatarUrlWithCacheBust,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", auth.user.id);

      if (updateErr) throw updateErr;

      if (profile) {
        setProfile({
          ...profile,
          avatar_url: avatarUrlWithCacheBust,
          updated_at: new Date().toISOString(),
        });
      }

      Alert.alert("Success", "Profile picture updated!");
    } catch (error: any) {
      console.error("Upload error:", error);
      Alert.alert("Upload Error", error.message || "Failed to upload image");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  };

  // ------------------------------
  //      PICK IMAGE
  // ------------------------------

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Denied", "Allow photo access to upload your avatar");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      const originalUri = result.assets[0].uri;
      const compressedUri = await compressImage(originalUri);
      uploadImage(compressedUri);
    }
  };

  // ------------------------------
  //      LOGOUT
  // ------------------------------

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) throw error;
              Alert.alert("Logged out", "You have been signed out.");
            } catch {
              Alert.alert("Error", "Unable to log out.");
            }
          }
        }
      ]
    );
  };

  // ------------------------------
  // Helper Functions
  // ------------------------------

  const getInitials = () => {
    if (!profile) return "?";

    const f = profile.first_name?.[0] ?? "";
    const l = profile.last_name?.[0] ?? "";
    const fallback = profile.email?.[0]?.toUpperCase() ?? "?";

    return (f + l).toUpperCase() || fallback;
  };

  const getFullName = () => {
    if (!profile) return "";

    if (profile.role === "organization" && profile.organization_name)
      return profile.organization_name;

    return `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || profile.email;
  };

  const memberLevel = () => {
    if (!profile) return "";
    if (profile.role === "organization") return "Organization";

    const total = profile.total_donations;
    if (total >= 5000) return "Gold Donor";
    if (total >= 1000) return "Silver Donor";
    return "Bronze Donor";
  };

  const cedis = (n: number) => `₵ ${n.toLocaleString()}`;

  // ------------------------------
  //      LOADING
  // ------------------------------

  if (loading) {
    return (
      <ScreenContainer>
        <View style={profileStyles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={profileStyles.loadingText}>Loading profile...</Text>
        </View>
        <Footer activeTab={activeTab} onTabPress={onTabPress} />
      </ScreenContainer>
    );
  }

  if (!profile) {
    return (
      <ScreenContainer>
        <View style={profileStyles.errorContainer}>
          <Text style={profileStyles.errorText}>No profile found.</Text>
          <TouchableOpacity 
            style={profileStyles.retryButton}
            onPress={() => {
              setLoading(true);
              fetchProfile();
            }}
          >
            <Text style={profileStyles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
        <Footer activeTab={activeTab} onTabPress={onTabPress} />
      </ScreenContainer>
    );
  }

  // ------------------------------
  //      UI
  // ------------------------------

  return (
    <ScreenContainer>
      <StatusBar style="dark" />

      <ScrollView
        style={profileStyles.container}
        contentContainerStyle={[
          profileStyles.contentContainer,
          { paddingBottom: 90 }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4A5568"
          />
        }
      >
        <View style={profileStyles.content}>
          {/* HEADER */}
          <View style={profileStyles.header}>
            <View style={profileStyles.profileImageContainer}>
              {profile.avatar_url ? (
                <Image
                  source={{ uri: profile.avatar_url }}
                  style={profileStyles.profileImage}
                />
              ) : (
                <View style={profileStyles.profileImagePlaceholder}>
                  <Text style={profileStyles.profileInitials}>{getInitials()}</Text>
                </View>
              )}

              <TouchableOpacity
                style={profileStyles.editImageButton}
                onPress={pickImage}
                disabled={uploading || refreshing}
              >
                <Image
                  source={require("../../../assets/images/edit.png")}
                  style={profileStyles.cameraIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Progress Indicator */}
            {uploading && (
              <View style={profileStyles.progressContainer}>
                <View style={profileStyles.progressBar}>
                  <View 
                    style={[
                      profileStyles.progressFill, 
                      { width: `${uploadProgress}%` }
                    ]} 
                  />
                </View>
                <Text style={profileStyles.progressText}>
                  Uploading... {uploadProgress}%
                </Text>
                <ActivityIndicator 
                  size="small" 
                  color="#4A5568" 
                  style={profileStyles.progressSpinner}
                />
              </View>
            )}

            <Text style={profileStyles.userName}>{getFullName()}</Text>
            <Text style={profileStyles.memberLevel}>
              {profile.role === "organization" ? "Organization Account" : memberLevel()}
            </Text>

            {profile.role === "organization" && profile.is_verified && (
              <View style={profileStyles.verifiedBadge}>
                <Text style={profileStyles.verifiedText}>✓ Verified Organization</Text>
              </View>
            )}
          </View>

           <View>
  {/* ORGANIZATION DASHBOARD BUTTON - Only visible to verified organizations */}
  {profile.role === 'organization' && profile.is_verified && (
    <TouchableOpacity
      style={{
        backgroundColor: '#48BB78',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 15,
        gap: 10,
      }}
      onPress={() => setShowOrgDashboard(true)}
      activeOpacity={0.7}
    >
      <Image
        source={require("../../../assets/images/dashboard.png")}
        style={{ width: 20, height: 20, tintColor: '#FFFFFF' }}
      />
      <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
        Organization Dashboard
      </Text>
    </TouchableOpacity>
  )}

  {/* PENDING VERIFICATION MESSAGE - For unverified organizations */}
  {profile.role === 'organization' && !profile.is_verified && (
    <View style={{
      backgroundColor: '#FEEBC8',
      padding: 16,
      borderRadius: 12,
      marginTop: 15,
      borderWidth: 1,
      borderColor: '#F6AD55',
    }}>
      <Text style={{
        color: '#D69E2E',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
      }}>
        ⏳ Your organization account is pending verification. 
        You'll gain access to the dashboard once approved by an admin.
      </Text>
    </View>
  )}

  {/* ADMIN BUTTON - Only visible to admins */}
  {profile.role === 'admin' && (
    <TouchableOpacity
      style={{
        backgroundColor: '#4A5568',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 15,
        gap: 10,
      }}
      onPress={() => setShowAdminModal(true)}
      activeOpacity={0.7}
    >
      <Image
        source={require("../../../assets/images/admin.png")}
        style={{ width: 20, height: 20, tintColor: '#FFFFFF' }}
      />
      <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
        Admin Dashboard
      </Text>
    </TouchableOpacity>
  )}

  {/* Organization Dashboard Modal */}
  <OrganizationDashboardModal 
    visible={showOrgDashboard}
    onClose={() => setShowOrgDashboard(false)}
  />

  {/* Admin Modal */}
  <AdminModal 
    visible={showAdminModal}
    onClose={() => setShowAdminModal(false)}
  />
</View>
          {/* INFO */}
          <View style={profileStyles.section}>
            <Text style={profileStyles.sectionTitle}>
              {profile.role === "organization"
                ? "Organization Information"
                : "Personal Information"}
            </Text>

            <InfoItem
              icon={require("../../../assets/images/email.png")}
              label="Email"
              value={profile.email}
            />

            {profile.role === "organization" && profile.contact_email && (
              <InfoItem
                icon={require("../../../assets/images/email.png")}
                label="Contact Email"
                value={profile.contact_email}
              />
            )}

            {profile.phone && (
              <InfoItem
                icon={require("../../../assets/images/phone-call.png")}
                label="Phone"
                value={profile.phone}
              />
            )}

            {profile.role === "organization" && profile.year_established && (
              <InfoItem
                icon={require("../../../assets/images/calendar.png")}
                label="Year Established"
                value={String(profile.year_established)}
              />
            )}

            <InfoItem
              icon={require("../../../assets/images/calendar.png")}
              label="Member Since"
              value={new Date(profile.member_since).toLocaleDateString()}
            />
          </View>

          {/* LOGOUT */}
          <View style={profileStyles.section}>
            <Text style={profileStyles.sectionTitle}>Account</Text>

            <SettingsItem
              icon={require("../../../assets/images/logout.png")}
              label="Log Out"
              logout
              onPress={handleLogout}
            />
          </View>
        </View>
      </ScrollView>

      <Footer activeTab={activeTab} onTabPress={onTabPress} />
    </ScreenContainer>
  );
}

// -------------------------------------------------------
// REUSABLE COMPONENTS
// -------------------------------------------------------

const InfoItem = memo(
  ({
    icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string;
  }) => (
    <View style={profileStyles.infoItem}>
      <View style={profileStyles.infoIconWrapper}>
        <Image source={icon} style={profileStyles.infoIcon} />
      </View>

      <View style={profileStyles.infoContent}>
        <Text style={profileStyles.infoLabel}>{label}</Text>
        <Text style={profileStyles.infoValue}>{value}</Text>
      </View>
    </View>
  )
);

const SettingsItem = memo(
  ({
    icon,
    label,
    logout = false,
    onPress,
  }: {
    icon: any;
    label: string;
    logout?: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        profileStyles.settingsItem,
        logout && profileStyles.lastSettingsItem,
      ]}
      activeOpacity={0.7}
    >
      <View style={profileStyles.settingsLeft}>
        <View
          style={[
            profileStyles.settingsIconWrapper,
            logout && profileStyles.logoutIconWrapper,
          ]}
        >
          <Image
            source={icon}
            style={logout ? profileStyles.logoutIcon : profileStyles.settingsIcon}
          />
        </View>

        <Text style={logout ? profileStyles.logoutText : profileStyles.settingsText}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  )
);