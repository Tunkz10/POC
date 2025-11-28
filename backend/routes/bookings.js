import express from 'express';
import axios from 'axios';
import { authenticateToken } from '../middleware/auth.js';
import { getServiceM8Jobs, getServiceM8JobById } from '../services/serviceM8.js';
import { supabase } from '../services/supabase.js';

const router = express.Router();

// Test endpoint to verify ServiceM8 API connection (remove in production)
router.get('/test-api', async (req, res) => {
  try {
    const apiKey = process.env.SERVICEM8_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        success: false,
        error: 'ServiceM8 API key not configured',
        apiKeyPrefix: 'missing'
      });
    }

    console.log('🧪 Testing ServiceM8 API connection...');
    console.log(`🔑 API Key prefix: ${apiKey.substring(0, 10)}...`);

    // Test direct API call first
    const endpoints = [
      'https://api.servicem8.com/api_1.0/job.json',
      'https://api.servicem8.com/api/1.0/job.json',
      'https://api.servicem8.com/api/job.json'
    ];

    const authString = Buffer.from(`${apiKey}:`).toString('base64');
    const results = [];

    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Testing endpoint: ${endpoint}`);
        const response = await axios.get(endpoint, {
          headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });

        results.push({
          endpoint,
          success: true,
          status: response.status,
          statusText: response.statusText,
          dataType: Array.isArray(response.data) ? 'Array' : typeof response.data,
          itemsCount: Array.isArray(response.data) ? response.data.length : 'N/A',
          sampleData: Array.isArray(response.data) && response.data.length > 0 
            ? response.data[0] 
            : response.data
        });

        console.log(`✅ Success with endpoint: ${endpoint}`);
      } catch (error) {
        results.push({
          endpoint,
          success: false,
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message,
          responseData: error.response?.data
        });
        console.log(`❌ Failed endpoint ${endpoint}:`, error.response?.status, error.message);
      }
    }

    // Also test the service function
    const { getServiceM8Jobs } = await import('../services/serviceM8.js');
    let serviceResult = null;
    try {
      const jobs = await getServiceM8Jobs(apiKey);
      serviceResult = {
        success: true,
        jobsCount: Array.isArray(jobs) ? jobs.length : 'non-array response',
        dataType: Array.isArray(jobs) ? 'Array' : typeof jobs,
        sampleJob: Array.isArray(jobs) && jobs.length > 0 ? jobs[0] : jobs
      };
    } catch (error) {
      serviceResult = {
        success: false,
        error: error.message
      };
    }
    
    res.json({ 
      success: results.some(r => r.success) || serviceResult?.success,
      message: 'ServiceM8 API test results',
      apiKeyPrefix: `${apiKey.substring(0, 10)}...`,
      directApiTests: results,
      serviceFunctionTest: serviceResult,
      recommendation: results.some(r => r.success) 
        ? '✅ API is working! Use the successful endpoint.'
        : '⚠️ All endpoints failed. Check API key and account permissions.'
    });
  } catch (error) {
    console.error('Test API error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      details: error.stack
    });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const apiKey = process.env.SERVICEM8_API_KEY;
    const useMock = process.env.SERVICEM8_USE_MOCK === 'true';
    
    // If no API key or mock mode enabled, use mock data directly
    if (!apiKey || useMock) {
      console.log('📦 Using mock data (no API key or mock mode enabled)');
      
      // Get customer info for personalized mock data
      const customer = await supabase
        .from('customers')
        .select('email, phone')
        .eq('id', req.user.customerId)
        .single();

      const customerData = customer.data || {};
      
      // Import and use mock data
      const { getServiceM8Jobs } = await import('../services/serviceM8.js');
      const mockJobs = await getServiceM8Jobs(null, customerData.email, customerData.phone);
      
      return res.json({ 
        bookings: Array.isArray(mockJobs) ? mockJobs : [],
        serviceM8Error: !apiKey ? 'ServiceM8 API key not configured. Using demo mode.' : null
      });
    }

    // Get customer info first
    const customer = await supabase
      .from('customers')
      .select('email, phone')
      .eq('id', req.user.customerId)
      .single();

    if (customer.error) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const customerData = customer.data;

    // Try to fetch from ServiceM8 API
    let jobs = [];
    let serviceM8Error = null;
    
    try {
      console.log('Fetching jobs from ServiceM8 API...');
      console.log(`Customer: ${customerData.email}, ${customerData.phone}`);
      
      // Pass customer email/phone so mock data matches logged-in user
      jobs = await getServiceM8Jobs(apiKey, customerData.email, customerData.phone);
      
      console.log('ServiceM8 API response received:', Array.isArray(jobs) ? `${jobs.length} jobs` : 'non-array response');
      
      // Ensure we always have an array
      if (!Array.isArray(jobs)) {
        console.log('⚠️ Response is not an array, converting to array or using mock data');
        jobs = [];
      }
      
      // If no jobs returned, the function should have returned mock data
      // But if it's still empty, we'll use mock data here too
      if (jobs.length === 0) {
        console.log('📦 No jobs in response, ensuring mock data is used');
        // Import and use mock data directly as fallback
        const { getServiceM8Jobs } = await import('../services/serviceM8.js');
        // Force mock mode by calling with a flag or just use the mock function
        // Actually, getServiceM8Jobs should already return mock data on error
        // So if we get here with empty array, something else is wrong
        console.log('⚠️ Got empty jobs array - this should not happen if fallback worked');
      }
    } catch (error) {
      console.error('ServiceM8 API error in route handler:', error.message);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack?.substring(0, 200),
        errorType: error.constructor?.name
      });
      
      // Set a user-friendly error message
      serviceM8Error = 'ServiceM8 API unavailable. Using demo mode with mock data.';
      
      // Force mock data on any error
      console.log('📦 Forcing mock data due to error in route handler');
      jobs = []; // Will trigger mock data below
    }
    
    // Final safety check - if still no jobs, use mock data
    if (!Array.isArray(jobs) || jobs.length === 0) {
      console.log('📦 Final fallback: Using mock data directly');
      // Get mock data from service
      const { getServiceM8Jobs } = await import('../services/serviceM8.js');
      jobs = await getServiceM8Jobs(null, customerData.email, customerData.phone);
      serviceM8Error = serviceM8Error || 'Using demo data';
    }
    
    // For mock data, don't filter - just return all mock jobs
    // (Mock data is already personalized to the customer)
    const filteredJobs = Array.isArray(jobs) ? jobs : [];

    // If no bookings and we had an error, ensure we return empty array with error message
    // The frontend will show the appropriate message
    const response = { 
      bookings: filteredJobs || []
    };
    
    if (serviceM8Error) {
      response.serviceM8Error = serviceM8Error;
    }
    
    // If no bookings found, ensure we still return empty array (not undefined)
    if (!response.bookings || response.bookings.length === 0) {
      response.bookings = [];
    }
    
    res.json(response);
  } catch (error) {
    console.error('Bookings error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch bookings',
      bookings: []
    });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const apiKey = process.env.SERVICEM8_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'ServiceM8 API key not configured' });
    }

    const customer = await supabase
      .from('customers')
      .select('email, phone')
      .eq('id', req.user.customerId)
      .single();

    if (customer.error) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const customerData = customer.data;
    const job = await getServiceM8JobById(apiKey, id, customerData.email, customerData.phone);
    const jobEmail = job.job_email?.toLowerCase();
    const jobPhone = job.job_phone?.replace(/\D/g, '');
    const customerEmail = customerData.email?.toLowerCase();
    const customerPhone = customerData.phone?.replace(/\D/g, '');

    if (jobEmail !== customerEmail && jobPhone !== customerPhone) {
      return res.status(403).json({ error: 'Access denied to this booking' });
    }

    res.json({ booking: job });
  } catch (error) {
    console.error('Booking detail error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch booking details' });
  }
});

export default router;

