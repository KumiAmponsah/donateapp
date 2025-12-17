import React from 'react';
import { View, TouchableOpacity, Image, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { footerStyles } from '../styles/footerStyles';

interface FooterProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

export default function Footer({ activeTab, onTabPress }: FooterProps) {
  const insets = useSafeAreaInsets();
  
  // Calculate total bottom padding
  // For iOS: Use safe area insets (for notch/dynamic island)
  // For Android: Add extra padding for navigation buttons + minimum safe area
  const bottomPadding = Platform.OS === 'ios' 
    ? Math.max(insets.bottom, 10)  // Minimum 10 on iOS
    : Math.max(insets.bottom + 10, 20);  // Extra 10px for Android nav buttons, minimum 20

  return (
    <View style={[
      footerStyles.footerContainer,
      {
        paddingBottom: bottomPadding,
        height: 60 + bottomPadding, // Footer content height + safe area padding
      }
    ]}>
      {/* Home Tab */}
      <TouchableOpacity 
        style={footerStyles.tabButton}
        onPress={() => onTabPress('home')}
        activeOpacity={0.7}
      >
        <View style={footerStyles.iconContainer}>
          <Image 
            source={require('../../../assets/images/home.png')}
            style={[
              footerStyles.tabIcon,
              activeTab === 'home' && footerStyles.activeTabIcon
            ]}
            resizeMode="contain"
          />
        </View>
        <Text style={[
          footerStyles.tabText,
          activeTab === 'home' && footerStyles.activeTabText
        ]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* Updates Tab */}
      <TouchableOpacity 
        style={footerStyles.tabButton}
        onPress={() => onTabPress('updates')}
        activeOpacity={0.7}
      >
        <View style={footerStyles.iconContainer}>
          <Image 
            source={require('../../../assets/images/updates.png')}
            style={[
              footerStyles.tabIcon,
              activeTab === 'updates' && footerStyles.activeTabIcon
            ]}
            resizeMode="contain"
          />
        </View>
        <Text style={[
          footerStyles.tabText,
          activeTab === 'updates' && footerStyles.activeTabText
        ]}>
          Updates
        </Text>
      </TouchableOpacity>

      {/* Profile Tab */}
      <TouchableOpacity 
        style={footerStyles.tabButton}
        onPress={() => onTabPress('profile')}
        activeOpacity={0.7}
      >
        <View style={footerStyles.iconContainer}>
          <Image 
            source={require('../../../assets/images/user.png')}
            style={[
              footerStyles.tabIcon,
              activeTab === 'profile' && footerStyles.activeTabIcon
            ]}
            resizeMode="contain"
          />
        </View>
        <Text style={[
          footerStyles.tabText,
          activeTab === 'profile' && footerStyles.activeTabText
        ]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}