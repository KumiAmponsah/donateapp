import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { signinStyles as styles } from '../styles/signin';
import { supabase } from '../../../supabase';
import SafeAreaWrapper from '../common/SafeAreaWrapper';

interface SignInProps {
  onLogin: () => void;
  onSignUpPress: () => void;
}

export default function SignIn({ onLogin, onSignUpPress }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  // Prevent multiple clicks
  if (loading) return;
  
  if (!email.trim() || !password.trim()) {
    Alert.alert('Error', 'Please enter email and password');
    return;
  }

  setLoading(true);
  
  try {
    console.log("🔐 Attempting login with:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      console.log("❌ Login error:", error.message);
      
      if (error.message.includes('Invalid login credentials')) {
        Alert.alert('Login Failed', 'Invalid email or password');
      } else if (error.message.includes('Email not confirmed')) {
        Alert.alert(
          'Email Not Confirmed',
          'Please check your email and click the confirmation link to verify your account.',
          [
            { 
              text: 'Resend Confirmation', 
              onPress: () => resendConfirmationEmail(email) 
            },
            { text: 'OK' }
          ]
        );
      } else {
        Alert.alert('Error', error.message);
      }
      
      setLoading(false);
      return;
    }

    if (data.user && data.session) {
      console.log("✅ Login successful for:", data.user.email);
      
      // Wait a moment to ensure session is persisted
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Double-check session before calling onLogin
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log("✅ Session verified, calling onLogin");
        onLogin();
      } else {
        console.log("⚠️ Session not found after login, retrying...");
        // Retry once
        setTimeout(() => {
          onLogin();
        }, 500);
      }
    }
  } catch (error: any) {
    console.error("🔥 Login exception:", error);
    Alert.alert('Error', error.message || 'Failed to sign in');
  } finally {
    // Always reset loading state
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }
};

  const resendConfirmationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: 'donate://auth-callback',
        },
      });
      
      if (error) throw error;
      Alert.alert('Success', 'Confirmation email has been resent!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend email');
    }
  };

  return (
    <SafeAreaWrapper backgroundColor="#FFFFFF">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                  editable={!loading}
                />
              </View>

              <TouchableOpacity 
                style={[styles.loginButton, loading && styles.disabledButton]} 
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <TouchableOpacity 
                  onPress={onSignUpPress} 
                  disabled={loading}
                  style={styles.signUpLink}
                >
                  <Text style={styles.linkText}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
}