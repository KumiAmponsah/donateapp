import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from 'expo-router';
import Homepage from "./components/pages/homepage";
import Profile from "./components/pages/profile";
import Updates from './components/pages/update';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' }}>
          Welcome to DonateApp
        </Text>
        
        <TouchableOpacity 
          style={{
            backgroundColor: '#2563eb',
            padding: 15,
            borderRadius: 8,
            marginBottom: 15,
            width: '100%',
            alignItems: 'center',
          }}
          onPress={() => router.push('/components/pages/login')}
        >
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Sign In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{
            backgroundColor: '#059669',
            padding: 15,
            borderRadius: 8,
            width: '100%',
            alignItems: 'center',
          }}
          onPress={() => router.push('/components/pages/register')}
        >
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Create Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {renderActiveScreen()}
    </View>
  );
}