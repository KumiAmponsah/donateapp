import React, { useState } from 'react';  
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Alert, Linking } from 'react-native';  
import { descriptionStyles } from '../styles/description';  
import { useLocalSearchParams, useRouter } from 'expo-router';  
import { StatusBar } from 'expo-status-bar';  

// Define TypeScript interface for Campaign  
interface Campaign {  
  id: number;  
  title: string;  
  description: string;  
  image: any;  
  progress: number;  
  raised: number;  
  target: number;  
  donors?: number;  
}

// Paystack configuration from environment variables
const PAYSTACK_CONFIG = {
  publicKey: process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || 'fallback_public_key_for_development',
  backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000',
};

const campaignData = [ 
  { id: 1, title: "Clean Water", description: "Providing clean water (likely referring to water treatment and sanitation) in rural areas typically involves a combination of solar-powered systems, borehole drilling, water purification technologies like filtration and chlorination, and community-focused initiatives such as WASH education. Effective solutions are sustainable, community-involved, and tailored to local contexts to address challenges like pollution and long distances to water sources.", image: require('../../../assets/images/campaign-water.jpg'), progress: 70, raised: 70000, target: 100000, donors: 1250 }, 
  { id: 2, title: "Education for All", description: "Building schools and providing educational resources for underprivileged children in remote villages. This initiative focuses on constructing safe learning environments, supplying books and technology, and training local teachers to ensure quality education reaches every child regardless of their geographical or economic background.", image: require('../../../assets/images/second.jpg'), progress: 45, raised: 45000, target: 100000, donors: 890 }, 
  { id: 3, title: "Healthcare Access", description: "Establishing mobile medical clinics and community health centers in areas with limited healthcare facilities. This project provides essential medical services, vaccinations, maternal care, and health education to improve overall community health outcomes and reduce preventable diseases.", image: require('../../../assets/images/third.jpg'), progress: 60, raised: 120000, target: 200000, donors: 1560 }, 
  { id: 4, title: "Food Security", description: "Implementing sustainable agriculture programs and food distribution networks to combat hunger. This initiative teaches farming techniques, provides seeds and tools, and establishes community gardens to ensure families have consistent access to nutritious food throughout the year.", image: require('../../../assets/images/fourth.jpg'), progress: 35, raised: 52500, target: 150000, donors: 720 }, 
  { id: 5, title: "Renewable Energy", description: "Installing solar power systems in off-grid communities to provide clean, reliable electricity. This project focuses on solar panels for homes, schools, and clinics, enabling better education, healthcare, and economic opportunities while reducing environmental impact.", image: require('../../../assets/images/fifth.jpg'), progress: 80, raised: 160000, target: 200000, donors: 2100 }, 
  { id: 6, title: "Women Empowerment", description: "Creating economic opportunities and skill development programs for women in marginalized communities. This initiative provides vocational training, micro-loans, and business mentorship to help women achieve financial independence and become community leaders.", image: require('../../../assets/images/sixth.jpg'), progress: 55, raised: 82500, target: 150000, donors: 980 }, 
  { id: 7, title: "Disaster Relief", description: "Providing immediate emergency response and long-term recovery support for communities affected by natural disasters. This fund ensures quick deployment of food, shelter, medical aid, and helps rebuild infrastructure to restore normalcy in affected regions.", image: require('../../../assets/images/seventh.jpg'), progress: 25, raised: 75000, target: 300000, donors: 430 } 
]; 

export default function CampaignDescription() {  
  const router = useRouter();  
  const params = useLocalSearchParams();  
  const campaignId = parseInt(params.id as string);  

  const [donationAmount, setDonationAmount] = useState('');  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'mobile'>('card');  
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');  
  const [email, setEmail] = useState('');  
  const [isProcessing, setIsProcessing] = useState(false); 

  const campaign = campaignData.find(camp => camp.id === campaignId);  

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
      const paymentData = { 
        amount: parseFloat(donationAmount), 
        email: email, 
        phone: mobileMoneyNumber, 
        currency: 'GHS', 
        channels: selectedPaymentMethod === 'mobile' ? ['mobile_money'] : ['card'], 
        campaign_id: campaign?.id, 
        campaign_title: campaign?.title 
      }; 

      const response = await fetch(`${PAYSTACK_CONFIG.backendUrl}/initialize-payment`, { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
        }, 
        body: JSON.stringify(paymentData), 
      }); 

      const result = await response.json(); 

      if (result.success) { 
        return result; 
      } else { 
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
          Alert.alert( 
            'Donation Successful!',  
            `Thank you for donating ₵${donationAmount} to ${campaign?.title}`, 
            [{ text: 'OK', onPress: () => router.back() }] 
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

  if (!campaign) {  
    return (  
      <View style={descriptionStyles.mainContainer}> 
        <Text style={descriptionStyles.errorText}>Campaign not found</Text> 
        <TouchableOpacity style={descriptionStyles.backButton} onPress={() => router.back()}> 
          <Text style={descriptionStyles.backButtonText}>Go Back</Text> 
        </TouchableOpacity> 
      </View> 
    );  
  }  

  return (  
    <View style={descriptionStyles.mainContainer}> 
      <StatusBar style="dark" /> 
      <ScrollView style={descriptionStyles.container}> 
        {/* Back Button */}  
        <TouchableOpacity   
          style={descriptionStyles.backButton}  
          onPress={() => router.back()}  
        >  
          <Text style={descriptionStyles.backButtonText}>← Back</Text>  
        </TouchableOpacity>  
  
        {/* Campaign Image */}  
        <View style={descriptionStyles.imageContainer}>  
          <Image   
            source={campaign.image}   
            style={descriptionStyles.campaignImage}  
            resizeMode="cover"  
          />  
        </View>  
  
        {/* Campaign Details */}  
        <View style={descriptionStyles.content}>  
          <Text style={descriptionStyles.title}>{campaign.title}</Text>  
            
          {/* Campaign Stats */}  
          <View style={descriptionStyles.statsContainer}>  
            <View style={descriptionStyles.statItem}>  
              <Text style={descriptionStyles.statValue}>₵{campaign.raised.toLocaleString()}</Text>  
              <Text style={descriptionStyles.statLabel}>Raised</Text>  
            </View>  
            <View style={descriptionStyles.statItem}>  
              <Text style={descriptionStyles.statValue}>{campaign.donors?.toLocaleString()}</Text>  
              <Text style={descriptionStyles.statLabel}>Donors</Text>  
            </View>  
            <View style={descriptionStyles.statItem}>  
              <Text style={descriptionStyles.statValue}>{campaign.progress}%</Text>  
              <Text style={descriptionStyles.statLabel}>Progress</Text>  
            </View>  
          </View>  
  
          {/* Progress Bar */}  
          <View style={descriptionStyles.progressSection}>  
            <View style={descriptionStyles.progressBarContainer}>  
              <View style={descriptionStyles.progressBar}>  
                <View   
                  style={[  
                    descriptionStyles.progressFill,   
                    { width: `${campaign.progress}%` }  
                  ]}   
                />  
              </View>  
              <Text style={descriptionStyles.progressText}>  
                ₵{campaign.raised.toLocaleString()} of ₵{campaign.target.toLocaleString()}  
              </Text>  
            </View>  
          </View>  
  
          {/* Description */}  
          <Text style={descriptionStyles.description}>  
            {campaign.description}  
          </Text>  
  
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
                  />  
                  <Text style={descriptionStyles.mobileMoneyNote}>  
                    You will receive a prompt on your phone to complete the payment  
                  </Text>  
                </View>  
              )}  
            </View>  
  
            {/* Donate Button */}  
            <TouchableOpacity   
              style={[ 
                descriptionStyles.donateButton, 
                isProcessing && { opacity: 0.7 } 
              ]}  
              onPress={handleDonate} 
              disabled={isProcessing} 
            >  
              <Text style={descriptionStyles.donateButtonText}>  
                {isProcessing ? 'Processing...' : `Donate ₵${donationAmount || '0.00'}`} 
              </Text>  
            </TouchableOpacity>  
 
            <Text style={[descriptionStyles.mobileMoneyNote, {textAlign: 'center', marginTop: 10}]}> 
              You will be redirected to Paystack to complete your payment securely 
            </Text> 
          </View>  
        </View>  
      </ScrollView>  
  
      {/* Footer with white background */}  
      <View style={descriptionStyles.footer} />  
    </View>  
  );  
} 