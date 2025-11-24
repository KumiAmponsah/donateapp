import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import Homepage from "./components/pages/homepage";
import Profile from "./components/pages/profile";
import Updates from './components/pages/update';

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const router = useRouter();

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <Homepage activeTab={activeTab} onTabPress={handleTabPress} />;
      case 'profile':
        return <Profile activeTab={activeTab} onTabPress={handleTabPress} />;
      case 'updates':
        return <Updates activeTab={activeTab} onTabPress={handleTabPress} />;
      default:
        return <Homepage activeTab={activeTab} onTabPress={handleTabPress} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Add a temporary register button for testing */}
      <TouchableOpacity 
        style={{
          position: 'absolute',
          top: 40,
          right: 20,
          backgroundColor: '#2563eb',
          padding: 10,
          borderRadius: 8,
          zIndex: 1000,
        }}
        onPress={() => router.push('/components/pages/register')}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>Register</Text>
      </TouchableOpacity>
      
      {renderActiveScreen()}
    </View>
  );
}