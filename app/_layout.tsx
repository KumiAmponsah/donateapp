import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const processUrl = (url: string) => {
      try {
        console.log("=== DEEP LINK PROCESSING ===");
        console.log("Full URL:", url);

        if (!url) return;

        // Handle donate:// scheme
        if (url.startsWith('donate://auth-callback')) {
          console.log("Auth callback deep link detected");
          
          // Extract hash from the URL
          const hashIndex = url.indexOf('#');
          if (hashIndex > -1) {
            const hash = url.substring(hashIndex + 1);
            console.log("Extracted hash:", hash.substring(0, 50) + "...");
            
            // Parse the hash parameters
            const params = new URLSearchParams(hash);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            const type = params.get('type');
            
            console.log("Parsed tokens:", { 
              accessToken: !!accessToken, 
              refreshToken: !!refreshToken, 
              type 
            });
            
            // Navigate to auth-callback with params
            // Use replace instead of push to avoid back navigation issues
            router.replace({
              pathname: "/auth-callback",
              params: {
                access_token: accessToken,
                refresh_token: refreshToken,
                type: type
              }
            });
          }
          return;
        }
      } catch (e) {
        console.log("Deep link error", e);
      }
    };

    // Initial open
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("Initial URL on app start:", url);
        processUrl(url);
      }
    });

    // Listener for in-app opens
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("URL event received:", url);
      processUrl(url);
    });

    return () => subscription.remove();
  }, []);

  return (
    <>
      <StatusBar style="light" backgroundColor="black" />
      <View style={{ height: 32, backgroundColor: "black" }} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}