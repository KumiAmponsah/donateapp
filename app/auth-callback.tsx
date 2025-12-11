import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, ActivityIndicator, Alert } from "react-native";

export default function AuthCallback() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Processing authentication...");
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    console.log("=== AUTH CALLBACK STARTED ===");
    
    const handleAuthCallback = async () => {
      try {
        let accessToken = params.access_token as string;
        let refreshToken = params.refresh_token as string;
        let type = params.type as string;
        
        console.log("Type:", type);

        // If this is an email confirmation (signup)
        if (type === 'signup' && accessToken && refreshToken) {
          setStatus("Email confirmed! Please sign in...");
          
          // 1. First, sign out to clear the auto-created session
          await supabase.auth.signOut();
          
          // 2. Show success message
          Alert.alert(
            "Email Confirmed ✅",
            "Your email has been verified successfully! You can now sign in with your credentials.",
            [{ 
              text: "Sign In", 
              onPress: () => {
                router.replace("/");
              }
            }]
          );
          
          // 3. Redirect to sign-in page
          setTimeout(() => {
            router.replace("/");
          }, 2000);
          return;
        }
        
        // If this is a regular login (not email confirmation)
        if (accessToken && refreshToken && type !== 'signup') {
          setStatus("Logging in...");
          
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) {
            console.error("Error setting session:", error);
            Alert.alert("Authentication Error", error.message);
            router.replace("/");
            return;
          }
          
          console.log("Logged in successfully:", data?.user?.email);
          setStatus("Login successful! Redirecting...");
          
          setTimeout(() => {
            router.replace("/");
          }, 1500);
          return;
        }
        
        // Default: redirect to sign-in
        setStatus("Redirecting to sign in...");
        setTimeout(() => {
          router.replace("/");
        }, 1000);
        
      } catch (error: any) {
        console.error("Auth callback error:", error);
        Alert.alert("Error", error.message || "Something went wrong");
        router.replace("/");
      }
    };
    
    handleAuthCallback();
  }, [params]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 20, fontSize: 16 }}>{status}</Text>
    </View>
  );
}