// C:\Users\cypri\Documents\donateapp\app\components\pages\description.tsx
import React, { useState, useEffect } from 'react';  
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  Linking,
  ActivityIndicator 
} from 'react-native';  
import { descriptionStyles } from '../styles/description';  
import { useLocalSearchParams, useRouter } from 'expo-router';  
import { StatusBar } from 'expo-status-bar';  
import SafeAreaWrapper from '../common/SafeAreaWrapper';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../../../supabase';

// Define TypeScript interface for Campaign  
interface Campaign {  
  id: string;  
  title: string;  
  description: string;  
  image_url: string | null;
  progress_percentage: number;  
  amount_raised: number;  
  target_amount: number;  
  donor_count: number;
  organization_name: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
}

// Paystack configuration from environment variables
const PAYSTACK_CONFIG = {
  publicKey: process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || 'fallback_public_key_for_development',
  backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000',
};

export default function CampaignDescription() {  
  const router = useRouter();  
  const params = useLocalSearchParams();  
  const campaignId = params.id as string;  

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [donationAmount, setDonationAmount] = useState('');  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'mobile'>('card');  
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');  
  const [email, setEmail] = useState('');  
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Fetch campaign data
  useEffect(() => {
    fetchCampaignData();
    fetchUserProfile();
  }, [campaignId]);

  const fetchCampaignData = async () => {
    try {
      setLoading(true);
      
      // Fetch campaign with organization details
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          profiles!campaigns_organization_id_fkey (
            organization_name
          )
        `)
        .eq('id', campaignId)
        .eq('is_deleted', false)
        .single();

      if (error) {
        console.error('Error fetching campaign:', error);
        Alert.alert('Error', 'Failed to load campaign details');
        return;
      }

      // Transform the data
      const campaignData: Campaign = {
        id: data.id,
        title: data.title,
        description: data.description,
        image_url: data.image_url,
        progress_percentage: Number(data.progress_percentage) || 0,
        amount_raised: Number(data.amount_raised) || 0,
        target_amount: Number(data.target_amount) || 0,
        donor_count: data.donor_count || 0,
        organization_name: data.profiles?.organization_name || null,
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status
      };

      setCampaign(campaignData);
    } catch (error) {
      console.error('Error in fetchCampaignData:', error);
      Alert.alert('Error', 'Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile for email prefill
  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setUserProfile(data);
      // Prefill email if user has one
      if (data.email) {
        setEmail(data.email);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const initializePayment = async () => {
    // Validate environment variables
    if (!PAYSTACK_CONFIG.publicKey || PAYSTACK_CONFIG.publicKey === 'fallback_public_key_for_development') {
      Alert.alert('Configuration Error', 'Payment system not properly configured');
      return null;
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) { 
      Alert.alert('Error', 'Please enter a valid donation amount'); 
      return null; 
    } 

    if (!email) { 
      Alert.alert('Error', 'Please enter your email address'); 
      return null; 
    } 

    if (selectedPaymentMethod === 'mobile' && !mobileMoneyNumber) { 
      Alert.alert('Error', 'Please enter your mobile money number'); 
      return null; 
    } 

    setIsProcessing(true); 

    try {
      // First, get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'Please log in to make a donation');
        setIsProcessing(false);
        return null;
      }

      // Create a donation record first
      const donationData = {
        donor_id: userProfile?.id, // From profiles table
        campaign_id: campaignId,
        amount: parseFloat(donationAmount),
        status: 'pending',
        payment_method: selectedPaymentMethod === 'mobile' ? 'mobile_money' : 'card',
        created_by: user.id
      };

      const { data: donation, error: donationError } = await supabase
        .from('donations')
        .insert([donationData])
        .select()
        .single();

      if (donationError) {
        console.error('Error creating donation record:', donationError);
        Alert.alert('Error', 'Failed to process donation');
        setIsProcessing(false);
        return null;
      }

      // Prepare payment data for backend
      const paymentData = { 
        amount: parseFloat(donationAmount) * 100, // Convert to pesewas
        email: email, 
        phone: mobileMoneyNumber, 
        currency: 'GHS', 
        channels: selectedPaymentMethod === 'mobile' ? ['mobile_money'] : ['card'], 
        donation_id: donation.id,
        campaign_id: campaignId,
        campaign_title: campaign?.title,
        metadata: {
          donation_id: donation.id,
          user_id: user.id,
          campaign_id: campaignId
        }
      }; 

      // Call your backend to initialize Paystack payment
      const response = await fetch(`${PAYSTACK_CONFIG.backendUrl}/initialize-payment`, { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
        }, 
        body: JSON.stringify(paymentData), 
      }); 

      const result = await response.json(); 

      if (result.success) { 
        // Update donation with payment reference
        await supabase
          .from('donations')
          .update({
            transaction_id: result.reference,
            provider_reference: result.reference,
            provider: 'paystack'
          })
          .eq('id', donation.id);

        return result; 
      } else { 
        // Update donation status to failed
        await supabase
          .from('donations')
          .update({ status: 'failed' })
          .eq('id', donation.id);

        Alert.alert('Payment Error', result.error || 'Failed to initialize payment'); 
        return null; 
      } 
    } catch (error) { 
      console.error('Payment initialization error:', error); 
      Alert.alert('Network Error', 'Failed to connect to payment server'); 
      return null; 
    } finally { 
      setIsProcessing(false); 
    } 
  }; 

  const handleDonate = async () => { 
    const paymentResult = await initializePayment(); 
     
    if (paymentResult && paymentResult.authorization_url) { 
      const canOpen = await Linking.canOpenURL(paymentResult.authorization_url); 
       
      if (canOpen) { 
        await Linking.openURL(paymentResult.authorization_url); 
        checkPaymentStatus(paymentResult.reference); 
      } else { 
        Alert.alert('Error', 'Cannot open payment page'); 
      } 
    } 
  }; 

  const checkPaymentStatus = async (reference: string) => { 
    setTimeout(async () => { 
      try { 
        const response = await fetch(`${PAYSTACK_CONFIG.backendUrl}/verify-payment/${reference}`); 
        const result = await response.json(); 
         
        if (result.success) { 
          // Update donation status in Supabase
          await supabase
            .from('donations')
            .update({ 
              status: 'completed',
              transaction_id: reference
            })
            .eq('transaction_id', reference);

          Alert.alert( 
            'Donation Successful!',  
            `Thank you for donating ₵${donationAmount} to ${campaign?.title}`, 
            [{ 
              text: 'OK', 
              onPress: () => {
                // Refresh campaign data to update stats
                fetchCampaignData();
                // Optionally navigate back
                // router.back();
              }
            }] 
          ); 
        } else { 
          Alert.alert('Payment Pending', 'Your payment is being processed. Please check your email for confirmation.'); 
        } 
      } catch (error) { 
        console.error('Status check error:', error); 
      } 
    }, 3000); 
  }; 

  const presetAmounts = [50, 100, 200, 500, 1000];  

  if (loading) {
    return (
      <SafeAreaWrapper>
        <View style={descriptionStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A5568" />
          <Text style={descriptionStyles.loadingText}>Loading campaign...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (!campaign) {  
    return (  
      <SafeAreaWrapper>
        <View style={descriptionStyles.errorContainer}> 
          <Text style={descriptionStyles.errorText}>Campaign not found</Text> 
          <TouchableOpacity 
            style={descriptionStyles.backButtonAlt} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          > 
            <Text style={descriptionStyles.backButtonText}>Go Back</Text> 
          </TouchableOpacity> 
        </View> 
      </SafeAreaWrapper>
    );  
  }  

  // Calculate days remaining if end_date exists
  const getDaysRemaining = () => {
    if (!campaign.end_date) return null;
    const endDate = new Date(campaign.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining();
  const imageSource = campaign.image_url 
    ? { uri: campaign.image_url }
    : require('../../../assets/images/campaign-water.jpg');

  return (  
    <SafeAreaWrapper disableBottom>
      <StatusBar style="dark" /> 
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={descriptionStyles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={descriptionStyles.scrollContent}
        > 
          {/* Back Button */}  
          <TouchableOpacity   
            style={descriptionStyles.backButton}  
            onPress={() => router.back()}  
            activeOpacity={0.7}
          >  
            <Text style={descriptionStyles.backButtonText}>← Back</Text>  
          </TouchableOpacity>  
  
          {/* Campaign Image */}  
          <View style={descriptionStyles.imageContainer}>  
            <Image   
              source={imageSource}   
              style={descriptionStyles.campaignImage}  
              resizeMode="cover"  
            />  
          </View>  
  
          {/* Campaign Details */}  
          <View style={descriptionStyles.content}>  
            <Text style={descriptionStyles.title}>{campaign.title}</Text>  
            
            {/* Organization Name */}
            {campaign.organization_name && (
              <View style={descriptionStyles.organizationContainer}>
                <Text style={descriptionStyles.organizationText}>
                  Organized by: {campaign.organization_name}
                </Text>
              </View>
            )}
              
            {/* Campaign Stats */}  
            <View style={descriptionStyles.statsContainer}>  
              <View style={descriptionStyles.statItem}>  
                <Text style={descriptionStyles.statValue}>
                  ₵{campaign.amount_raised.toLocaleString()}
                </Text>  
                <Text style={descriptionStyles.statLabel}>Raised</Text>  
              </View>  
              <View style={descriptionStyles.statItem}>  
                <Text style={descriptionStyles.statValue}>
                  {campaign.donor_count.toLocaleString()}
                </Text>  
                <Text style={descriptionStyles.statLabel}>Donors</Text>  
              </View>  
              <View style={descriptionStyles.statItem}>  
                <Text style={descriptionStyles.statValue}>
                  {Math.round(campaign.progress_percentage)}%
                </Text>  
                <Text style={descriptionStyles.statLabel}>Progress</Text>  
              </View>  
            </View>  

            {/* Days Remaining */}
            {daysRemaining !== null && (
              <View style={descriptionStyles.daysRemainingContainer}>
                <Text style={descriptionStyles.daysRemainingText}>
                  {daysRemaining === 0 
                    ? "Ends today!" 
                    : `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining`
                  }
                </Text>
              </View>
            )}
  
            {/* Progress Bar */}  
            <View style={descriptionStyles.progressSection}>  
              <View style={descriptionStyles.progressBarContainer}>  
                <View style={descriptionStyles.progressBar}>  
                  <View   
                    style={[  
                      descriptionStyles.progressFill,   
                      { width: `${Math.min(campaign.progress_percentage, 100)}%` }  
                    ]}   
                  />  
                </View>  
                <Text style={descriptionStyles.progressText}>  
                  ₵{campaign.amount_raised.toLocaleString()} of ₵{campaign.target_amount.toLocaleString()}  
                </Text>  
              </View>  
            </View>  
  
            {/* Description */}  
            <Text style={descriptionStyles.description}>  
              {campaign.description}  
            </Text>  

            {/* Campaign Status Badge */}
            <View style={[
              descriptionStyles.statusBadge,
              campaign.status === 'completed' ? descriptionStyles.statusCompleted :
              campaign.status === 'active' ? descriptionStyles.statusActive :
              descriptionStyles.statusDraft
            ]}>
              <Text style={descriptionStyles.statusText}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </Text>
            </View>
  
            {/* Donation Section */}  
            <View style={descriptionStyles.donationSection}>  
              <Text style={descriptionStyles.sectionTitle}>Make a Donation</Text>  
                
              {/* Email Input - REQUIRED for Paystack */} 
              <View style={descriptionStyles.amountSection}> 
                <Text style={descriptionStyles.amountLabel}>Your Email *</Text> 
                <TextInput 
                  style={descriptionStyles.amountInput} 
                  placeholder="your@email.com" 
                  keyboardType="email-address" 
                  value={email} 
                  onChangeText={setEmail} 
                  placeholderTextColor="#A0AEC0" 
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!userProfile?.email} // Not editable if pre-filled from profile
                /> 
              </View> 
                
              {/* Amount Input */}  
              <View style={descriptionStyles.amountSection}>  
                <Text style={descriptionStyles.amountLabel}>Enter Amount (₵)</Text>  
                <TextInput  
                  style={descriptionStyles.amountInput}  
                  placeholder="0.00"  
                  keyboardType="numeric"  
                  value={donationAmount}  
                  onChangeText={setDonationAmount}  
                  placeholderTextColor="#A0AEC0"  
                />  
                  
                {/* Quick Amount Buttons */}  
                <View style={descriptionStyles.presetAmounts}>  
                  {presetAmounts.map((amount) => (  
                    <TouchableOpacity  
                      key={amount}  
                      style={descriptionStyles.presetButton}  
                      onPress={() => setDonationAmount(amount.toString())}  
                      activeOpacity={0.7}
                    >  
                      <Text style={descriptionStyles.presetButtonText}>₵{amount}</Text>  
                    </TouchableOpacity>  
                  ))}  
                </View>  
              </View>  
  
              {/* Payment Method Selection */}  
              <View style={descriptionStyles.paymentSection}>  
                <Text style={descriptionStyles.sectionTitle}>Payment Method</Text>  
                  
                <TouchableOpacity  
                  style={[  
                    descriptionStyles.paymentOption,  
                    selectedPaymentMethod === 'card' && descriptionStyles.paymentOptionSelected  
                  ]}  
                  onPress={() => setSelectedPaymentMethod('card')}  
                  activeOpacity={0.7}
                >  
                  <View style={descriptionStyles.radioContainer}>  
                    <View style={descriptionStyles.radio}>  
                      {selectedPaymentMethod === 'card' && (  
                        <View style={descriptionStyles.radioSelected} />  
                      )}  
                    </View>  
                    <Text style={descriptionStyles.paymentOptionText}>Credit/Debit Card</Text>  
                  </View>  
                  <Image   
                    source={require('../../../assets/images/credit-card.png')}  
                    style={descriptionStyles.paymentIcon}  
                  />  
                </TouchableOpacity>  
  
                <TouchableOpacity  
                  style={[  
                    descriptionStyles.paymentOption,  
                    selectedPaymentMethod === 'mobile' && descriptionStyles.paymentOptionSelected  
                  ]}  
                  onPress={() => setSelectedPaymentMethod('mobile')}  
                  activeOpacity={0.7}
                >  
                  <View style={descriptionStyles.radioContainer}>  
                    <View style={descriptionStyles.radio}>  
                      {selectedPaymentMethod === 'mobile' && (  
                        <View style={descriptionStyles.radioSelected} />  
                      )}  
                    </View>  
                    <Text style={descriptionStyles.paymentOptionText}>MTN Mobile Money</Text>  
                  </View>  
                  <Image   
                    source={require('../../../assets/images/mobile-money.png')}  
                    style={descriptionStyles.paymentIcon}  
                  />  
                </TouchableOpacity>  
  
                {/* Mobile Money Form */}  
                {selectedPaymentMethod === 'mobile' && (  
                  <View style={descriptionStyles.paymentForm}>  
                    <TextInput  
                      style={descriptionStyles.input}  
                      placeholder="MTN Mobile Money Number (e.g., 0241234567)"  
                      keyboardType="phone-pad"  
                      value={mobileMoneyNumber}  
                      onChangeText={setMobileMoneyNumber}  
                      placeholderTextColor="#A0AEC0"  
                      autoComplete="tel"
                    />  
                    <Text style={descriptionStyles.mobileMoneyNote}>  
                      You will receive a prompt on your phone to complete the payment  
                    </Text>  
                  </View>  
                )}  
              </View>  

              {/* Login Reminder */}
              {!userProfile && (
                <View style={descriptionStyles.loginReminder}>
                  <Text style={descriptionStyles.loginReminderText}>
                    Note: You'll need to be logged in to complete your donation
                  </Text>
                </View>
              )}
  
              {/* Donate Button */}  
              <TouchableOpacity   
                style={[ 
                  descriptionStyles.donateButton, 
                  (isProcessing || campaign.status !== 'active') && descriptionStyles.donateButtonDisabled
                ]}  
                onPress={campaign.status === 'active' ? handleDonate : undefined} 
                disabled={isProcessing || campaign.status !== 'active'} 
                activeOpacity={0.7}
              >  
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={descriptionStyles.donateButtonText}>  
                    {campaign.status !== 'active' 
                      ? `Campaign ${campaign.status}` 
                      : `Donate ₵${donationAmount || '0.00'}`
                    }
                  </Text>  
                )}
              </TouchableOpacity>  
 
              <Text style={[descriptionStyles.mobileMoneyNote, {textAlign: 'center', marginTop: 10}]}> 
                You will be redirected to Paystack to complete your payment securely 
              </Text> 
            </View>  
          </View>  
        </ScrollView>  
      </KeyboardAvoidingView>
    </SafeAreaWrapper>  
  );  
}