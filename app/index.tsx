// C:\Users\cypri\Documents\donateapp\app\index.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SignIn from "./components/pages/signin";
import SignUp from "./components/pages/signup";
import Homepage from "./components/pages/homepage";
import Profile from "./components/pages/profile";
import Updates from './components/pages/update';
import { supabase } from "../supabase";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  
  // Add these refs to track state
  const authChecked = useRef(false);
  const isInitialAuthCheck = useRef(true);

  useEffect(() => {
    // Only run this once
    if (authChecked.current) return;
    
    const initializeAuth = async () => {
      try {
        console.log("🔐 Initial auth check started...");
        
        // 1. Check for stored auth state first (fast local check)
        const storedAuth = await AsyncStorage.getItem('auth_state');
        if (storedAuth === 'logged_in') {
          console.log("📱 Found stored auth state: logged_in");
          setIsLoggedIn(true);
          setLoading(false);
          authChecked.current = true;
          return;
        }
        
        // 2. Check for valid session
        const authCheck = new Promise(async (resolve) => {
          try {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
              console.log("❌ Session check error:", error.message);
              resolve({ session: null });
            } else {
              console.log("✅ Session check result:", session ? "Valid session" : "No session");
              resolve({ session });
            }
          } catch (e) {
            console.log("❌ Auth check exception:", e);
            resolve({ session: null });
          }
        });
        
        // Timeout the auth check to prevent hanging
        const timeoutPromise = new Promise(resolve => {
          setTimeout(() => {
            console.log("⏰ Auth check timeout");
            resolve({ session: null });
          }, 3000);
        });
        
        const { session } = await Promise.race([authCheck, timeoutPromise]) as any;
        
        if (session) {
          console.log("👤 User found:", session.user.email);
          setIsLoggedIn(true);
          // Store auth state for faster next startup
          await AsyncStorage.setItem('auth_state', 'logged_in');
        } else {
          console.log("👤 No user session found");
          setIsLoggedIn(false);
          await AsyncStorage.removeItem('auth_state');
        }
        
      } catch (error) {
        console.error("🔥 Auth initialization error:", error);
        setIsLoggedIn(false);
        await AsyncStorage.removeItem('auth_state');
      } finally {
        authChecked.current = true;
        setLoading(false);
        isInitialAuthCheck.current = false;
        console.log("✅ Auth initialization complete");
      }
    };
    
    initializeAuth();
    
    // 3. Set up auth state listener with proper cleanup
    let isListenerActive = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isListenerActive) return;
        
        console.log("🔄 Auth state changed:", event);
        
        // Debounce to prevent rapid state changes
        const debounceTimeout = setTimeout(async () => {
          if (session) {
            console.log("🔄 Listener: User logged in:", session.user?.email);
            if (isListenerActive) {
              setIsLoggedIn(true);
              // Store auth state
              await AsyncStorage.setItem('auth_state', 'logged_in');
            }
          } else {
            console.log("🔄 Listener: User logged out");
            if (isListenerActive) {
              setIsLoggedIn(false);
              // Clear auth state
              await AsyncStorage.removeItem('auth_state');
            }
          }
        }, 100);
        
        // Cleanup function
        return () => clearTimeout(debounceTimeout);
      }
    );

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up auth listeners");
      isListenerActive = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    console.log("🚀 Manual login triggered");
    
    // Use a different approach for manual login
    // Instead of immediately setting state, check session first
    const verifyAndLogin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("✅ Manual login verified, session exists");
          setIsLoggedIn(true);
          // Store auth state
          await AsyncStorage.setItem('auth_state', 'logged_in');
        } else {
          console.log("⚠️ Manual login: No session found, forcing login");
          // Force login after a delay to ensure auth state updates
          setTimeout(() => {
            setIsLoggedIn(true);
          }, 500);
        }
      } catch (error) {
        console.error("❌ Manual login verification error:", error);
        // Fallback to setting login state
        setTimeout(() => {
          setIsLoggedIn(true);
        }, 500);
      }
    };
    
    await verifyAndLogin();
  };

  const goToSignUp = () => {
    console.log("📝 Going to sign up");
    setShowSignUp(true);
  };

  const goToSignIn = () => {
    console.log("🔑 Going to sign in");
    setShowSignUp(false);
  };

  const handleTabPress = (tabName: string) => {
    console.log("🏷️ Tab pressed:", tabName);
    setActiveTab(tabName);
  };

  const renderActiveScreen = () => {
    console.log("🎬 Rendering active screen:", activeTab);
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
    console.log("⏳ Showing loading indicator");
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 20, fontSize: 16, color: "#333" }}>Initializing app...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  console.log("🚀 App rendering. isLoggedIn:", isLoggedIn, "showSignUp:", showSignUp);
  
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {!isLoggedIn ? (
          showSignUp ? (
            <SignUp onSignInPress={goToSignIn} />
          ) : (
            <SignIn onLogin={handleLogin} onSignUpPress={goToSignUp} />
          )
        ) : (
          renderActiveScreen()
        )}
      </View>
    </SafeAreaProvider>
  );
}