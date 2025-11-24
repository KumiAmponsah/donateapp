import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { signInStyles } from '../styles/signinStyles';
import { supabase } from '../../lib/supabase';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        Alert.alert('Sign In Failed', error.message);
        return;
      }

      if (data.user) {
        Alert.alert('Success', 'Signed in successfully!');
        router.replace('/components/pages/homepage');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset feature coming soon!');
  };

  return (
    <KeyboardAvoidingView
      style={signInStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <ScrollView 
        contentContainerStyle={signInStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={signInStyles.header}>
          <Image
            source={require('../../../assets/images/charity-icon.png')}
            style={signInStyles.logo}
            resizeMode="contain"
          />
          <Text style={signInStyles.title}>Welcome Back</Text>
          <Text style={signInStyles.subtitle}>
            Sign in to continue making a difference
          </Text>
        </View>

        {/* Form */}
        <View style={signInStyles.form}>
          <View style={signInStyles.inputContainer}>
            <Text style={signInStyles.label}>Email Address</Text>
            <TextInput
              style={signInStyles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={signInStyles.inputContainer}>
            <Text style={signInStyles.label}>Password</Text>
            <TextInput
              style={signInStyles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={signInStyles.forgotPassword}
            onPress={handleForgotPassword}
          >
            <Text style={signInStyles.forgotPasswordText}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              signInStyles.signInButton,
              loading && signInStyles.signInButtonDisabled
            ]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={signInStyles.signInButtonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={signInStyles.divider}>
          <View style={signInStyles.dividerLine} />
          <Text style={signInStyles.dividerText}>OR</Text>
          <View style={signInStyles.dividerLine} />
        </View>

        {/* Sign Up Link */}
        <View style={signInStyles.footer}>
          <Text style={signInStyles.footerText}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/components/pages/register')}>
            <Text style={signInStyles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}