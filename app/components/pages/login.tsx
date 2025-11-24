import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { registerStyles } from '../styles/registerStyles'; // Reuse styles
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        Alert.alert('Success', 'Login successful!');
        // You can navigate to the main app here
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={registerStyles.mainContainer}>
        <StatusBar style="dark" />
        <ScrollView
          style={registerStyles.container}
          contentContainerStyle={registerStyles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={registerStyles.header}>
            <TouchableOpacity 
              style={registerStyles.backButton}
              onPress={() => router.back()}
            >
              <Image
                source={require('../../../assets/images/back-arrow.png')}
                style={registerStyles.backIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text style={registerStyles.headerTitle}>Sign In</Text>
            <View style={registerStyles.placeholder} />
          </View>

          {/* Form */}
          <View style={registerStyles.formContainer}>
            <View style={registerStyles.inputContainer}>
              <Text style={registerStyles.label}>Email Address</Text>
              <TextInput
                style={registerStyles.input}
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => setFormData(prev => ({ ...prev, email: value }))}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={registerStyles.inputContainer}>
              <Text style={registerStyles.label}>Password</Text>
              <TextInput
                style={registerStyles.input}
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(value) => setFormData(prev => ({ ...prev, password: value }))}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={registerStyles.registerButton}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={registerStyles.registerButtonText}>
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            <View style={registerStyles.loginContainer}>
              <Text style={registerStyles.loginText}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/components/pages/register')}>
                <Text style={registerStyles.loginLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}