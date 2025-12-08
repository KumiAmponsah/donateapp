import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import SignIn from "./components/pages/signin";
import SignUp from "./components/pages/signup";
import Homepage from "./components/pages/homepage";
import Profile from "./components/pages/profile";
import Updates from './components/pages/update';
import { supabase } from "../supabase";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session when app starts
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          setIsLoggedIn(false);
        } else if (session) {
          console.log("User is already logged in:", session.user.email);
          setIsLoggedIn(true);
        } else {
          console.log("No existing session found");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        
        if (session) {
          console.log("User logged in:", session.user.email);
          setIsLoggedIn(true);
        } else {
          console.log("User logged out");
          setIsLoggedIn(false);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    console.log("Manual login triggered");
    setIsLoggedIn(true);
  };

  const goToSignUp = () => {
    setShowSignUp(true);
  };

  const goToSignIn = () => {
    setShowSignUp(false);
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

  // Show loading indicator while checking auth
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  // Show sign in first
  if (!isLoggedIn) {
    if (showSignUp) {
      return <SignUp onSignInPress={goToSignIn} />;
    }
    return <SignIn onLogin={handleLogin} onSignUpPress={goToSignUp} />;
  }

  // Return homepage with tab navigation
  return (
    <View style={{ flex: 1 }}>
      {renderActiveScreen()}
    </View>
  );
}