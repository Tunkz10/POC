import axios from 'axios';

// ServiceM8 API Base URL - Try multiple endpoint formats
const SERVICEM8_ENDPOINTS = [
  'https://api.servicem8.com/api_1.0',
  'https://api.servicem8.com/api/1.0',
  'https://api.servicem8.com/api'
];

// Demo/Mock mode - set to true to use mock data instead of real API
// Set SERVICEM8_USE_MOCK=true in .env to force mock mode
const USE_MOCK_DATA = process.env.SERVICEM8_USE_MOCK === 'true' || false;

if (USE_MOCK_DATA) {
  console.log('📦 MOCK MODE ENABLED: Using mock data instead of ServiceM8 API');
}

// Mock job data for POC demonstration
// Accepts customer email/phone to match mock jobs with logged-in user
const getMockJobs = (customerEmail = null, customerPhone = null) => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Use provided customer data or fallback to defaults
  const email = customerEmail || 'customer@example.com';
  const phone = customerPhone || '+1234567890';

  return [
    {
      uuid: 'mock-job-001',
      job_number: 'JOB-2024-001',
      status: 'Scheduled',
      date: tomorrow.toISOString().split('T')[0],
      time: '09:00',
      description: 'Plumbing repair - Leaky faucet in kitchen',
      job_address: '123 Main Street, City, State 12345',
      job_email: email,
      job_phone: phone,
      created_at: now.toISOString(),
    },
    {
      uuid: 'mock-job-002',
      job_number: 'JOB-2024-002',
      status: 'In Progress',
      date: now.toISOString().split('T')[0],
      time: '14:30',
      description: 'HVAC maintenance - Annual service check',
      job_address: '456 Oak Avenue, City, State 12345',
      job_email: email,
      job_phone: phone,
      created_at: new Date(now.getTime() - 86400000).toISOString(),
    },
    {
      uuid: 'mock-job-003',
      job_number: 'JOB-2024-003',
      status: 'Completed',
      date: new Date(now.getTime() - 172800000).toISOString().split('T')[0],
      time: '10:00',
      description: 'Electrical work - Install new light fixtures',
      job_address: '789 Pine Road, City, State 12345',
      job_email: email,
      job_phone: phone,
      created_at: new Date(now.getTime() - 259200000).toISOString(),
    },
  ];
};

export const getServiceM8Jobs = async (apiKey, customerEmail = null, customerPhone = null) => {
  try {
    // Use mock data if enabled or if API access is denied
    if (USE_MOCK_DATA) {
      console.log('📦 Using MOCK ServiceM8 data for POC demonstration');
      return getMockJobs(customerEmail, customerPhone);
    }

    if (!apiKey) {
      console.log('⚠️ No API key provided, using mock data');
      return getMockJobs(customerEmail, customerPhone);
    }

    // Try multiple endpoint formats
    const authString = Buffer.from(`${apiKey}:`).toString('base64');
    let lastError = null;

  for (const baseUrl of SERVICEM8_ENDPOINTS) {
    try {
      const endpoint = `${baseUrl}/job.json`;
      console.log(`🔄 Attempting ServiceM8 API: ${endpoint}`);
      
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('✅ ServiceM8 API call successful!');
      console.log(`📊 Endpoint: ${endpoint}`);
      console.log(`📦 Jobs received: ${Array.isArray(response.data) ? response.data.length : 'N/A'}`);
      
      return response.data;
    } catch (error) {
      lastError = error;
      const status = error.response?.status;
      const statusText = error.response?.statusText;
      const data = error.response?.data;
      
      console.log(`❌ Failed endpoint ${baseUrl}:`, {
        status,
        statusText,
        message: error.message
      });

      // If this is a successful auth but wrong endpoint (404), continue trying
      // If it's auth failure (401/403), we can stop trying
      if (status === 401 || status === 403) {
        console.log('⚠️ Authentication failed - stopping endpoint attempts');
        break;
      }
    }
  }

  // All endpoints failed - ALWAYS return mock data
  const status = lastError?.response?.status;
  const statusText = lastError?.response?.statusText;
  const data = lastError?.response?.data;
  
  console.error('ServiceM8 API Error Details:', {
    status: status || 'No status (timeout/network error)',
    statusText: statusText || 'No status text',
    message: lastError?.message || 'Unknown error',
    apiKeyPrefix: apiKey ? `${apiKey.substring(0, 10)}...` : 'missing',
    triedEndpoints: SERVICEM8_ENDPOINTS,
    errorType: lastError?.code || 'Unknown'
  });
  
  // Check for access denied - fallback to mock data for free trial accounts
  if (data) {
    const responseText = typeof data === 'string' ? data : JSON.stringify(data || '');
    if (responseText.includes('access_denied')) {
      console.log('⚠️ ServiceM8 API access denied (likely free trial limitation)');
      console.log('📦 Falling back to MOCK data for POC demonstration');
      return getMockJobs(customerEmail, customerPhone);
    }
  }
  
  if (status === 404) {
    console.log('⚠️ ServiceM8 API endpoint not found');
  } else if (status === 401 || status === 403) {
    console.log('⚠️ ServiceM8 API authentication failed - check API key and account permissions');
  } else if (lastError?.code === 'ECONNABORTED' || lastError?.code === 'ETIMEDOUT') {
    console.log('⚠️ ServiceM8 API request timed out');
  } else if (lastError?.code === 'ENOTFOUND' || lastError?.code === 'ECONNREFUSED') {
    console.log('⚠️ ServiceM8 API connection failed');
  } else {
    console.log('⚠️ ServiceM8 API error occurred');
  }
  
  // ALWAYS fallback to mock data on any error
  console.log('📦 Falling back to MOCK data for POC demonstration');
  return getMockJobs(customerEmail, customerPhone);
  } catch (error) {
    // Catch any unexpected errors (like ReferenceError for undefined variables)
    console.error('⚠️ Unexpected error in getServiceM8Jobs:', error.message);
    console.error('Error type:', error.constructor.name);
    console.error('Stack:', error.stack?.substring(0, 300));
    
    // Always return mock data on any error
    console.log('📦 Falling back to MOCK data due to error');
    return getMockJobs(customerEmail, customerPhone);
  }
};

export const getServiceM8JobById = async (apiKey, jobId, customerEmail = null, customerPhone = null) => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    console.log('📦 Using MOCK ServiceM8 data for POC demonstration');
    const mockJobs = getMockJobs(customerEmail, customerPhone);
    const job = mockJobs.find(j => j.uuid === jobId);
    if (job) return job;
    throw new Error('Job not found');
  }

  // Try multiple endpoint formats
  const authString = Buffer.from(`${apiKey}:`).toString('base64');
  let lastError = null;

  for (const baseUrl of SERVICEM8_ENDPOINTS) {
    try {
      const endpoint = `${baseUrl}/job/${jobId}.json`;
      console.log(`🔄 Attempting ServiceM8 API: ${endpoint}`);
      
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('✅ ServiceM8 API call successful!');
      return response.data;
    } catch (error) {
      lastError = error;
      const status = error.response?.status;
      
      // If auth failure, stop trying other endpoints
      if (status === 401 || status === 403) {
        break;
      }
    }
  }

  // All endpoints failed - handle error
  const status = lastError?.response?.status;
  const statusText = lastError?.response?.statusText;
  const data = lastError?.response?.data;
  
  // Check for access denied - fallback to mock data
  const responseText = typeof data === 'string' ? data : JSON.stringify(data || '');
  if (responseText.includes('access_denied') || status === 404 || status === 401 || status === 403) {
    console.log('⚠️ ServiceM8 API access issue, using mock data');
    const mockJobs = getMockJobs(customerEmail, customerPhone);
    const job = mockJobs.find(j => j.uuid === jobId);
    if (job) return job;
    throw new Error('Job not found');
  }
  
  console.error('ServiceM8 API Error Details:', {
    status,
    statusText,
    jobId,
    message: lastError?.message
  });
  
  // Fallback to mock data
  const mockJobs = getMockJobs(customerEmail, customerPhone);
  const job = mockJobs.find(j => j.uuid === jobId);
  if (job) return job;
  
  throw new Error(`ServiceM8 API error (${status || 'unknown'}): ${statusText || lastError?.message}`);
};

