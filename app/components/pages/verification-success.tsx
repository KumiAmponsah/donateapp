import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function VerificationSuccess() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: 20 
    }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        ✅ Email Verified!
      </Text>
      
      <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 30 }}>
        Your email {email} has been successfully verified.
      </Text>
      
      <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: 30, color: 'green' }}>
        You can now sign in to your account.
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: '#007AFF',
          paddingHorizontal: 30,
          paddingVertical: 15,
          borderRadius: 8,
        }}
        onPress={() => router.replace('/')}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          Sign In Now
        </Text>
      </TouchableOpacity>
    </View>
  );
}