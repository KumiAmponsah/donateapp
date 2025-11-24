import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { footerStyles } from '../styles/footerStyles';

interface FooterProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

export default function Footer({ activeTab, onTabPress }: FooterProps) {
  return (
    <View style={footerStyles.footerContainer}>
      {/* Home Tab */}
      <TouchableOpacity 
        style={footerStyles.tabButton}
        onPress={() => onTabPress('home')}
      >
        <Image 
          source={require('../../../assets/images/home.png')}
          style={[
            footerStyles.tabIcon,
            activeTab === 'home' && footerStyles.activeTabIcon
          ]}
          resizeMode="contain"
        />
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
      >
        <Image 
          source={require('../../../assets/images/updates.png')}
          style={[
            footerStyles.tabIcon,
            activeTab === 'updates' && footerStyles.activeTabIcon
          ]}
          resizeMode="contain"
        />
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
      >
        <Image 
          source={require('../../../assets/images/user.png')}
          style={[
            footerStyles.tabIcon,
            activeTab === 'profile' && footerStyles.activeTabIcon
          ]}
          resizeMode="contain"
        />
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