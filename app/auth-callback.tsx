import { useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from './lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback params:', params);
        
        // Get the URL parameters from the deep link
        const { 
          access_token, 
          refresh_token, 
          type,
          expires_at,
          token_type 
        } = params;

        console.log('Token details:', {
          access_token: access_token ? 'present' : 'missing',
          refresh_token: refresh_token ? 'present' : 'missing',
          type,
          expires_at,
          token_type
        });

        if (type === 'signup' && access_token && refresh_token) {
          // Set the session with the tokens
          const { error } = await supabase.auth.setSession({
            access_token: access_token as string,
            refresh_token: refresh_token as string,
          });

          if (error) {
            console.error('Session set error:', error);
            throw error;
          }

          // Get the current user to verify
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error('Get user error:', userError);
            throw userError;
          }

          console.log('User verified:', user);

          if (user) {
            Alert.alert(
              'Email Verified!',
              'Your email has been successfully verified. You can now login to your account.',
              [{ text: 'OK', onPress: () => router.replace('/components/pages/login') }]
            );
          } else {
            throw new Error('No user found after verification');
          }
        } else {
          console.error('Missing required parameters:', {
            type, 
            hasAccessToken: !!access_token, 
            hasRefreshToken: !!refresh_token 
          });
          throw new Error('Invalid verification link');
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        Alert.alert(
          'Verification Failed',
          error.message || 'There was an issue verifying your email. Please try again.',
          [{ text: 'OK', onPress: () => router.replace('/components/pages/login') }]
        );
      }
    };

    handleAuthCallback();
  }, [params, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={{ marginTop: 10 }}>Verifying your email...</Text>
    </View>
  );
}