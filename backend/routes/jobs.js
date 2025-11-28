import express from 'express';
import axios from 'axios';

const router = express.Router();

// GET /api/jobs - Fetch jobs from ServiceM8 API with fallback to mock data
router.get('/', async (req, res) => {
  try {
    const apiKey = process.env.SERVICEM8_API_KEY;
    
    if (!apiKey) {
      console.log('⚠️ ServiceM8 API key not configured, switching to fallback mode');
      return res.json({ 
        success: false,
        message: 'API key not configured',
        data: getMockJobs(),
        usingMockData: true
      });
    }

    // ATTEMPT the real Axios request to ServiceM8 API
    // Try multiple endpoint variations
    const endpoints = [
      'https://api.servicem8.com/api_1.0/job.json',
      'https://api.servicem8.com/api/1.0/job.json',
      'https://api.servicem8.com/api/job.json'
    ];

    const authString = Buffer.from(`${apiKey}:`).toString('base64');
    
    let lastError = null;
    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Attempting ServiceM8 API call to: ${endpoint}`);
        const response = await axios.get(endpoint, {
          headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        });

        console.log('✅ ServiceM8 API call successful!');
        console.log(`📊 Response status: ${response.status}`);
        console.log(`📦 Data type: ${Array.isArray(response.data) ? 'Array' : typeof response.data}`);
        console.log(`📈 Items count: ${Array.isArray(response.data) ? response.data.length : 'N/A'}`);

        // If successful, return the real data
        return res.json({
          success: true,
          message: 'ServiceM8 API call successful',
          endpoint: endpoint,
          data: response.data,
          usingMockData: false
        });
      } catch (error) {
        lastError = error;
        console.log(`❌ Failed endpoint ${endpoint}:`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message
        });
        // Continue to next endpoint
      }
    }

    // If all endpoints failed, throw the last error
    throw lastError || new Error('All ServiceM8 API endpoints failed');
    
  } catch (error) {
    // WRAP the request in a try/catch block
    // IN THE CATCH BLOCK: Log the API failure clearly
    console.log('⚠️ ServiceM8 API failed, switching to fallback mode');
    console.error('ServiceM8 API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      statusCode: error.response?.statusCode,
      message: error.message,
      responseData: error.response?.data,
      apiKeyPrefix: process.env.SERVICEM8_API_KEY ? `${process.env.SERVICEM8_API_KEY.substring(0, 10)}...` : 'missing'
    });

    // RETURN a hardcoded "Mock Data" JSON array instead
    return res.json({
      success: false,
      message: 'ServiceM8 API unavailable, using mock data',
      error: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message
      },
      data: getMockJobs(),
      usingMockData: true
    });
  }
});

// Mock Data function - mirrors ServiceM8 schema
function getMockJobs() {
  return [
    {
      uuid: '550e8400-e29b-41d4-a716-446655440001',
      generated_job_id: 'JOB-1001',
      status: 'Quote',
      date: '2024-12-15',
      job_address: '123 Main Street, City, State 12345',
      company_name: 'ABC Plumbing Services'
    },
    {
      uuid: '550e8400-e29b-41d4-a716-446655440002',
      generated_job_id: 'JOB-1002',
      status: 'Work Order',
      date: '2024-12-20',
      job_address: '456 Oak Avenue, City, State 12345',
      company_name: 'XYZ HVAC Solutions'
    },
    {
      uuid: '550e8400-e29b-41d4-a716-446655440003',
      generated_job_id: 'JOB-1003',
      status: 'Quote',
      date: '2024-12-25',
      job_address: '789 Pine Road, City, State 12345',
      company_name: 'Premium Electrical Works'
    }
  ];
}

export default router;

