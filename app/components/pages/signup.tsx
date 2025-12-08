import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { signupStyles as styles } from '../styles/signup';
import { supabase } from '../../../supabase';


interface SignUpProps {
  onSignInPress: () => void;
}

type UserType = 'donor' | 'organization';

export default function SignUp({ onSignInPress }: SignUpProps) {
  const [userType, setUserType] = useState<UserType>('donor');
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [foundationName, setFoundationName] = useState('');
  const [yearEstablished, setYearEstablished] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // Validation
    if (userType === 'donor') {
      if (!fullName.trim()) {
        Alert.alert('Please enter full name');
        return;
      }
    } else {
      if (!foundationName.trim()) {
        Alert.alert('Please enter foundation name');
        return;
      }
      if (!yearEstablished.trim()) {
        Alert.alert('Please enter year established');
        return;
      }
    }

    if (!contact.trim()) {
      Alert.alert('Please enter contact information');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Please enter email');
      return;
    }
    if (!password) {
      Alert.alert('Please enter password');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType,
            full_name:
              userType === 'donor' ? fullName : foundationName,
            contact: contact,
            ...(userType === 'organization' && {
              year_established: yearEstablished,
            }),
          },
// Try this simple redirect instead
            emailRedirectTo: 'donate://auth-callback'
         
        },
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('No user returned from signup');
      }

      // Wait for the trigger to create the profile
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the profile created by the trigger
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: userType,
          phone: contact,
          ...(userType === 'donor'
            ? {
                first_name: fullName.split(' ')[0] || fullName,
                last_name:
                  fullName.split(' ').slice(1).join(' ') || '',
              }
            : {
                organization_name: foundationName,
                year_established: parseInt(yearEstablished),
                contact_email: email,
              }),
        })
        .eq('user_id', data.user.id);

      if (profileError) {
        console.log(
          'Profile update warning (non-critical):',
          profileError.message
        );
        // Don't throw here - the user is created, just profile update might fail
      }

      Alert.alert(
        'Check your email!',
        'We sent you a confirmation email. Click the link to verify your account.',
        [{ text: 'OK', onPress: onSignInPress }]
      );

      // Clear form
      setFullName('');
      setContact('');
      setFoundationName('');
      setYearEstablished('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {/* User Type Selection */}
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            userType === 'donor' && styles.typeButtonActive,
          ]}
          onPress={() => setUserType('donor')}
          disabled={loading}
        >
          <Text
            style={[
              styles.typeText,
              userType === 'donor' && styles.typeTextActive,
            ]}
          >
            Donor
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            userType === 'organization' &&
              styles.typeButtonActive,
          ]}
          onPress={() => setUserType('organization')}
          disabled={loading}
        >
          <Text
            style={[
              styles.typeText,
              userType === 'organization' &&
                styles.typeTextActive,
            ]}
          >
            Foundation
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {/* Donor Fields */}
        {userType === 'donor' ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#000"
              value={fullName}
              onChangeText={setFullName}
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Contact (Phone Number)"
              placeholderTextColor="#000"
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
              editable={!loading}
            />
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Foundation Name"
              placeholderTextColor="#000"
              value={foundationName}
              onChangeText={setFoundationName}
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Year Established"
              placeholderTextColor="#000"
              value={yearEstablished}
              onChangeText={setYearEstablished}
              keyboardType="numeric"
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Contact (Email or Phone)"
              placeholderTextColor="#000"
              value={contact}
              onChangeText={setContact}
              keyboardType="email-address"
              editable={!loading}
            />
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#000"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password (min. 6 characters)"
          placeholderTextColor="#000"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#000"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[
            styles.signupButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {userType === 'donor'
                ? 'Sign Up as Donor'
                : 'Register Foundation'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSignInPress}
          disabled={loading}
        >
          <Text style={styles.linkText}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
