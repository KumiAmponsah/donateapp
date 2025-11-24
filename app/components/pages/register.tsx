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
import { registerStyles } from '../styles/registerStyles';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'donor' as 'donor' | 'charity_admin',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return false;
    }
    if (!formData.lastName.trim()) {
      Alert.alert('Error', 'Please enter your last name');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

const handleRegister = async () => {
  if (!validateForm()) return;

  setLoading(true);
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          user_type: formData.userType,
        },
        emailRedirectTo: 'exp+donate://expo-development-client/?url=http://localhost:8081',
      },
    });

    if (authError) throw authError;

    Alert.alert(
      'Check Your Email',
      'We sent you a confirmation email. Please check your inbox and click the link to verify your account.',
      [
        {
          text: 'OK',
          onPress: () => router.push('/components/pages/login'),
        },
      ]
    );
  } catch (error: any) {
    Alert.alert('Error', error.message || 'An error occurred during registration');
  } finally {
    setLoading(false);
  }
};

const handleResendConfirmation = async (email: string) => {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: 'exp+donate://expo-development-client/?url=http://localhost:8081/auth/callback',
    },
  });
  
  if (error) {
    Alert.alert('Error', 'Failed to resend confirmation email');
  } else {
    Alert.alert('Success', 'Confirmation email sent!');
  }
};

  const handleLoginRedirect = () => {
    router.push('/components/pages/login');
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
                source={require('../../../assets/images/back.png')}
                style={registerStyles.backIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text style={registerStyles.headerTitle}>Create Account</Text>
            <View style={registerStyles.placeholder} />
          </View>

          {/* Form */}
          <View style={registerStyles.formContainer}>
            {/* User Type Selection */}
            <Text style={registerStyles.sectionLabel}>I want to:</Text>
            <View style={registerStyles.userTypeContainer}>
              <TouchableOpacity
                style={[
                  registerStyles.userTypeButton,
                  formData.userType === 'donor' && registerStyles.userTypeButtonActive,
                ]}
                onPress={() => handleInputChange('userType', 'donor')}
              >
                <Text
                  style={[
                    registerStyles.userTypeText,
                    formData.userType === 'donor' && registerStyles.userTypeTextActive,
                  ]}
                >
                  Donate
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  registerStyles.userTypeButton,
                  formData.userType === 'charity_admin' && registerStyles.userTypeButtonActive,
                ]}
                onPress={() => handleInputChange('userType', 'charity_admin')}
              >
                <Text
                  style={[
                    registerStyles.userTypeText,
                    formData.userType === 'charity_admin' && registerStyles.userTypeTextActive,
                  ]}
                >
                  Raise Funds
                </Text>
              </TouchableOpacity>
            </View>

            {/* Name Fields */}
            <View style={registerStyles.nameContainer}>
              <View style={registerStyles.nameField}>
                <Text style={registerStyles.label}>First Name</Text>
                <TextInput
                  style={registerStyles.input}
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  autoCapitalize="words"
                />
              </View>
              <View style={registerStyles.nameField}>
                <Text style={registerStyles.label}>Last Name</Text>
                <TextInput
                  style={registerStyles.input}
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email */}
            <View style={registerStyles.inputContainer}>
              <Text style={registerStyles.label}>Email Address</Text>
              <TextInput
                style={registerStyles.input}
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Phone */}
            <View style={registerStyles.inputContainer}>
              <Text style={registerStyles.label}>Phone Number</Text>
              <TextInput
                style={registerStyles.input}
                placeholder="Enter your phone number"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </View>

            {/* Password */}
            <View style={registerStyles.inputContainer}>
              <Text style={registerStyles.label}>Password</Text>
              <TextInput
                style={registerStyles.input}
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            {/* Confirm Password */}
            <View style={registerStyles.inputContainer}>
              <Text style={registerStyles.label}>Confirm Password</Text>
              <TextInput
                style={registerStyles.input}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={registerStyles.registerButton}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={registerStyles.registerButtonText}>
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            {/* Login Redirect */}
            <View style={registerStyles.loginContainer}>
              <Text style={registerStyles.loginText}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={handleLoginRedirect}>
                <Text style={registerStyles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Terms */}
            <Text style={registerStyles.termsText}>
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}