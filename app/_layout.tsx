import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useRouter } from "expo-router";
import * as Linking from 'expo-linking';
import { useEffect } from 'react';

// Function to parse hash parameters from URL
const parseHashParams = (url: string) => {
  const hashIndex = url.indexOf('#');
  if (hashIndex === -1) return {};
  
  const hash = url.substring(hashIndex + 1);
  const params: Record<string, string> = {};
  
  hash.split('&').forEach(param => {
    const [key, value] = param.split('=');
    if (key && value) {
      params[key] = decodeURIComponent(value);
    }
  });
  
  return params;
};

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Handle deep links when app is already running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('Deep link received:', url);
      
      if (url.startsWith('donate://auth/callback')) {
        // Parse the URL to extract parameters from both query and hash
        const parsed = Linking.parse(url);
        const hashParams = parseHashParams(url);
        
        console.log('Parsed deep link:', parsed);
        console.log('Hash parameters:', hashParams);
        
        // Combine both query params and hash params
        const allParams = { ...parsed.queryParams, ...hashParams };
        
        // Navigate to auth callback with all parameters
        router.push({
          pathname: '/auth-callback',
          params: allParams as any,
        });
      }
    });

    // Handle deep links when app is launched from closed state
    Linking.getInitialURL().then((url) => {
      if (url && url.startsWith('donate://auth/callback')) {
        const parsed = Linking.parse(url);
        const hashParams = parseHashParams(url);
        const allParams = { ...parsed.queryParams, ...hashParams };
        
        console.log('Initial deep link:', parsed);
        console.log('Initial hash parameters:', hashParams);
        
        router.push({
          pathname: '/auth-callback',
          params: allParams as any,
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [router]);

  return (
    <>
      <StatusBar style="light" backgroundColor="black" />
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 32,
        backgroundColor: 'black',
        zIndex: 999,
      }} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}