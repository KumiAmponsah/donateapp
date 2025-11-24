const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Security middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Replace with your actual domain
    : ['http://localhost:3000', 'http://localhost:19006'],
  credentials: true
}));

app.use(express.json());

// Paystack configuration from environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = process.env.PAYSTACK_BASE_URL || 'https://api.paystack.co';

// Validate environment variables on startup
if (!PAYSTACK_SECRET_KEY) {
  console.error('❌ PAYSTACK_SECRET_KEY is missing in environment variables');
  process.exit(1);
}

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize payment endpoint
app.post('/initialize-payment', async (req, res) => {
  try {
    const { amount, email, phone, currency, channels, campaign_id, campaign_title } = req.body;
    
    console.log('Received payment request:', { 
      amount, 
      email, 
      phone: phone ? '***' + phone.slice(-3) : 'not provided',
      currency,
      campaign_id 
    });

    // Validate required fields
    if (!amount || !email) {
      return res.status(400).json({
        success: false,
        error: 'Amount and email are required'
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        amount: Math.round(amount * 100), // Convert to smallest currency unit
        email: email,
        currency: currency || 'GHS',
        channels: channels || ['card', 'mobile_money'],
        metadata: {
          campaign_id: campaign_id,
          campaign_title: campaign_title,
          customer_phone: phone,
          timestamp: new Date().toISOString()
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log('Paystack initialization successful for reference:', response.data.data.reference);

    res.json({ 
      success: true,
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
      access_code: response.data.data.access_code
    });
  } catch (error) {
    console.error('Payment initialization error:', {
      message: error.message,
      response: error.response?.data,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({ 
      success: false,
      error: error.response?.data?.message || 'Payment initialization failed'
    });
  }
});

// Verify payment endpoint
app.get('/verify-payment/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    
    if (!reference) {
      return res.status(400).json({
        success: false,
        error: 'Payment reference is required'
      });
    }

    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
        },
        timeout: 10000
      }
    );

    const verification = response.data;

    if (verification.data.status === 'success') {
      console.log(`Payment verified successfully for reference: ${reference}`);
      res.json({
        success: true,
        data: verification.data,
        message: 'Payment verified successfully'
      });
    } else {
      console.log(`Payment failed or pending for reference: ${reference}`);
      res.json({
        success: false,
        data: verification.data,
        message: verification.data.gateway_response || 'Payment failed or pending'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', {
      reference: req.params.reference,
      message: error.message,
      response: error.response?.data
    });
    
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({ 
      success: false,
      error: error.response?.data?.message || 'Payment verification failed'
    });
  }
});

// Webhook endpoint for Paystack
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const crypto = require('crypto');
  
  // Verify webhook signature for security
  const signature = req.headers['x-paystack-signature'];
  if (!signature) {
    console.warn('Webhook received without signature');
    return res.sendStatus(400);
  }

  const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY)
                     .update(req.body)
                     .digest('hex');
  
  if (hash !== signature) {
    console.error('Invalid webhook signature');
    return res.sendStatus(400);
  }

  try {
    const event = JSON.parse(req.body);
    
    console.log('Webhook received:', event.event, event.data.reference);
    
    if (event.event === 'charge.success') {
      // Handle successful payment
      console.log('Payment successful via webhook:', {
        reference: event.data.reference,
        amount: event.data.amount,
        email: event.data.customer.email
      });
      
      // TODO: Update your database, send confirmation email, etc.
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.sendStatus(400);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Paystack Backend API is running!',
    status: 'OK',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// FIXED: 404 handler - Use express built-in approach
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Paystack integration ready`);
  console.log(`💻 Local: http://localhost:${PORT}`);
});