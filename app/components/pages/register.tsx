import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { registerStyles } from '../styles/registerStyles';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { supabase, checkEmailAvailability } from '../../lib/supabase'; // Import the function

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
    userType: 'donor' as 'donor' | 'charity_admin',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return Alert.alert('Error', 'Please enter your first name');
    if (!formData.lastName.trim()) return Alert.alert('Error', 'Please enter your last name');
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) return Alert.alert('Error', 'Please enter a valid email');
    if (!formData.phone.trim()) return Alert.alert('Error', 'Please enter your phone number');
    if (formData.password.length < 6) return Alert.alert('Error', 'Password must be at least 6 characters');
    if (formData.password !== formData.confirmPassword) return Alert.alert('Error', 'Passwords do not match');
    return true;
  };

  const handleRegister = async () => {
  if (!validateForm()) return;

  setLoading(true);
  try {
    console.log('Starting registration for:', formData.email);
    
    const emailAvailable = await checkEmailAvailability(formData.email);
    console.log('Email available result:', emailAvailable);
    
    if (!emailAvailable) {
      Alert.alert('Email Already Exists', 'This email address is already registered. Please use a different email or try signing in.');
      setLoading(false);
      return;
    }

    console.log('Proceeding with Supabase signup...');
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email.toLowerCase(),
      password: formData.password,
      options: {
        data: { 
          first_name: formData.firstName, 
          last_name: formData.lastName, 
          phone: formData.phone, 
          user_type: formData.userType 
        },
        emailRedirectTo: 'donate://auth/callback',
      },
    });

    if (authError) {
      console.log('Supabase auth error:', authError);
      if (authError.message.includes('already registered') || authError.message.includes('user_exists')) {
        Alert.alert('Email Already Exists', 'This email address is already registered. Please use a different email or try signing in.');
        return;
      }
      throw authError;
    }

    console.log('Supabase auth success:', authData);

    if (authData.user) {
      Alert.alert(
        'Check Your Email', 
        'We sent you a confirmation email. Please check your inbox and click the verification link to verify your account.',
        [{ text: 'OK', onPress: () => router.push('/components/pages/login') }]
      );
    }
  } catch (error: any) {
    console.log('Registration catch error:', error);
    Alert.alert('Registration Failed', error.message || 'An error occurred during registration. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={registerStyles.mainContainer}>
        <StatusBar style="dark" />
        <ScrollView style={registerStyles.container} contentContainerStyle={registerStyles.scrollViewContent} showsVerticalScrollIndicator={false}>
          <View style={registerStyles.header}>
            <TouchableOpacity style={registerStyles.backButton} onPress={() => router.back()}>
              <Image source={require('../../../assets/images/back.png')} style={registerStyles.backIcon} resizeMode="contain" />
            </TouchableOpacity>
            <Text style={registerStyles.headerTitle}>Create Account</Text>
            <View style={registerStyles.placeholder} />
          </View>

          <View style={registerStyles.formContainer}>
            <Text style={registerStyles.sectionLabel}>I want to:</Text>
            <View style={registerStyles.userTypeContainer}>
              <TouchableOpacity style={[registerStyles.userTypeButton, formData.userType === 'donor' && registerStyles.userTypeButtonActive]} onPress={() => handleInputChange('userType', 'donor')}>
                <Text style={[registerStyles.userTypeText, formData.userType === 'donor' && registerStyles.userTypeTextActive]}>Donate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[registerStyles.userTypeButton, formData.userType === 'charity_admin' && registerStyles.userTypeButtonActive]} onPress={() => handleInputChange('userType', 'charity_admin')}>
                <Text style={[registerStyles.userTypeText, formData.userType === 'charity_admin' && registerStyles.userTypeTextActive]}>Raise Funds</Text>
              </TouchableOpacity>
            </View>

            <View style={registerStyles.nameContainer}>
              <View style={registerStyles.nameField}>
                <Text style={registerStyles.label}>First Name</Text>
                <TextInput 
                  style={registerStyles.input} 
                  placeholder="First name" 
                  value={formData.firstName} 
                  onChangeText={(value) => handleInputChange('firstName', value)} 
                  autoCapitalize="words" 
                />
              </View>
              <View style={registerStyles.nameField}>
                <Text style={registerStyles.label}>Last Name</Text>
                <TextInput 
                  style={registerStyles.input} 
                  placeholder="Last name" 
                  value={formData.lastName} 
                  onChangeText={(value) => handleInputChange('lastName', value)} 
                  autoCapitalize="words" 
                />
              </View>
            </View>

            <View style={registerStyles.inputContainer}>
              <Text style={registerStyles.label}>Email</Text>
              <TextInput 
                style={registerStyles.input} 
                placeholder="Email address" 
                value={formData.email} 
                onChangeText={(value) => handleInputChange('email', value)} 
                keyboardType="email-address" 
                autoCapitalize="none" 
                autoComplete="email"
              />
            </View>

            <View style={registerStyles.inputContainer}>
              <Text style={registerStyles.label}>Phone</Text>
              <TextInput 
                style={registerStyles.input} 
                placeholder="Phone number" 
                value={formData.phone} 
                onChangeText={(value) => handleInputChange('phone', value)} 
                keyboardType="phone-pad" 
              />
            </View>

            <View style={registerStyles.inputContainer}>
              <Text style={registerStyles.label}>Password</Text>
              <TextInput 
                style={registerStyles.input} 
                placeholder="Create password" 
                value={formData.password} 
                onChangeText={(value) => handleInputChange('password', value)} 
                secureTextEntry 
              />
            </View>

            <View style={registerStyles.inputContainer}>
              <Text style={registerStyles.label}>Confirm Password</Text>
              <TextInput 
                style={registerStyles.input} 
                placeholder="Confirm password" 
                value={formData.confirmPassword} 
                onChangeText={(value) => handleInputChange('confirmPassword', value)} 
                secureTextEntry 
              />
            </View>

            <TouchableOpacity style={registerStyles.registerButton} onPress={handleRegister} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={registerStyles.registerButtonText}>Create Account</Text>}
            </TouchableOpacity>

            <View style={registerStyles.loginContainer}>
              <Text style={registerStyles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/components/pages/login')}>
                <Text style={registerStyles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}