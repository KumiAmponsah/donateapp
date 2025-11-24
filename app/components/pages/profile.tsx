import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { profileStyles } from '../styles/profile';
import { StatusBar } from "expo-status-bar";
import Footer from './footer';

interface ProfileProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

export default function Profile({ activeTab, onTabPress }: ProfileProps) {
  // Mock user data
  const userData = {
    name: "Herbert Asare Amponsah",
    email: "herbert.amponsah@example.com",
    phone: "+233 24 123 4567",
    joinDate: "January 2024",
    totalDonations: 12,
    totalAmount: "₵ 2,450.00",
    memberLevel: "Gold Donor"
  };

  const donationHistory = [
    { id: 1, campaign: "Clean Water", amount: "₵ 500.00", date: "15 Mar 2024", status: "Completed" },
    { id: 2, campaign: "Education for All", amount: "₵ 750.00", date: "28 Feb 2024", status: "Completed" },
    { id: 3, campaign: "Healthcare Access", amount: "₵ 1,200.00", date: "10 Jan 2024", status: "Completed" },
  ];

  return (
    <View style={profileStyles.mainContainer}>
      <StatusBar style="dark" />
      <ScrollView 
        style={profileStyles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
        >

        <View style={profileStyles.content}>
          {/* Header Section */}
          <View style={profileStyles.header}>
            <View style={profileStyles.profileImageContainer}>
              <View style={profileStyles.profileImage}>
                <Text style={profileStyles.profileInitials}>HA</Text>
              </View>
              <TouchableOpacity style={profileStyles.editImageButton}>
                <Image 
                  source={require('../../../assets/images/edit.png')}
                  style={profileStyles.cameraIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            
            <Text style={profileStyles.userName}>{userData.name}</Text>
            <Text style={profileStyles.memberLevel}>{userData.memberLevel}</Text>
            
            <TouchableOpacity style={profileStyles.editProfileButton}>
              <Text style={profileStyles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Cards */}
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
                <Text style={profileStyles.statNumber}>{userData.totalDonations}</Text>
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
                <Text style={profileStyles.statNumber}>{userData.totalAmount}</Text>
                <Text style={profileStyles.statLabel}>Total Given</Text>
              </View>
            </View>
          </View>

          {/* Personal Information Section */}
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
                <Text style={profileStyles.infoValue}>{userData.email}</Text>
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
                <Text style={profileStyles.infoValue}>{userData.phone}</Text>
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
                <Text style={profileStyles.infoValue}>{userData.joinDate}</Text>
              </View>
            </View>
          </View>

          {/* Recent Donations Section */}
          <View style={profileStyles.section}>
            <View style={profileStyles.sectionHeader}>
              <Text style={profileStyles.sectionTitle}>Recent Donations</Text>
              <TouchableOpacity>
                <Text style={profileStyles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {donationHistory.map((donation, index) => (
              <View 
                key={donation.id} 
                style={[
                  profileStyles.donationItem,
                  index === donationHistory.length - 1 && profileStyles.lastDonationItem
                ]}
              >
                <View style={profileStyles.donationContent}>
                  <Text style={profileStyles.donationCampaign}>{donation.campaign}</Text>
                  <Text style={profileStyles.donationDate}>{donation.date}</Text>
                </View>
                <View style={profileStyles.donationAmountContainer}>
                  <Text style={profileStyles.donationAmount}>{donation.amount}</Text>
                  <View style={profileStyles.statusBadge}>
                    <Text style={profileStyles.statusText}>{donation.status}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Settings Section */}
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

            <TouchableOpacity style={profileStyles.settingsItem}>
              <View style={profileStyles.settingsLeft}>
                <View style={profileStyles.settingsIconWrapper}>
                  <Image 
                    source={require('../../../assets/images/user.png')}
                    style={profileStyles.settingsIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={profileStyles.settingsText}>Help & Support</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[profileStyles.settingsItem, profileStyles.lastSettingsItem]}>
              <View style={profileStyles.settingsLeft}>
                <View style={[profileStyles.settingsIconWrapper, profileStyles.logoutIconWrapper]}>
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