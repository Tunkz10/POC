import axios from 'axios';

// ServiceM8 API Base URL
// If you get 404 errors, try these alternatives:
// - https://api.servicem8.com/api/1.0
// - https://api.servicem8.com/api (current)
const SERVICEM8_BASE_URL = 'https://api.servicem8.com/api';

// Demo/Mock mode - set to true to use mock data instead of real API
const USE_MOCK_DATA = process.env.SERVICEM8_USE_MOCK === 'true' || false;

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
  // Use mock data if enabled or if API access is denied
  if (USE_MOCK_DATA) {
    console.log('📦 Using MOCK ServiceM8 data for POC demonstration');
    return getMockJobs(customerEmail, customerPhone);
  }

  try {
    const authString = Buffer.from(`${apiKey}:`).toString('base64');
    
    const response = await axios.get(`${SERVICEM8_BASE_URL}/job.json`, {
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    const status = error.response?.status;
    const statusText = error.response?.statusText;
    const data = error.response?.data;
    
    // Check for access denied - fallback to mock data for free trial accounts
    const responseText = typeof data === 'string' ? data : JSON.stringify(data || '');
    if (responseText.includes('access_denied')) {
      console.log('⚠️ ServiceM8 API access denied (likely free trial limitation)');
      console.log('📦 Falling back to MOCK data for POC demonstration');
      return getMockJobs(customerEmail, customerPhone);
    }
    
    console.error('ServiceM8 API Error Details:', {
      status,
      statusText,
      url: `${SERVICEM8_BASE_URL}/job.json`,
      message: error.message,
      apiKeyPrefix: apiKey ? `${apiKey.substring(0, 10)}...` : 'missing'
    });
    
    if (status === 404) {
      console.log('⚠️ ServiceM8 API endpoint not found');
      console.log('📦 Falling back to MOCK data for POC demonstration');
      return getMockJobs(customerEmail, customerPhone);
    } else if (status === 401 || status === 403) {
      console.log('⚠️ ServiceM8 API authentication failed');
      console.log('📦 Falling back to MOCK data for POC demonstration');
      return getMockJobs(customerEmail, customerPhone);
    } else {
      // For other errors, also fallback to mock
      console.log('⚠️ ServiceM8 API error, using mock data');
      return getMockJobs(customerEmail, customerPhone);
    }
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

  try {
    const authString = Buffer.from(`${apiKey}:`).toString('base64');
    
    const response = await axios.get(`${SERVICEM8_BASE_URL}/job/${jobId}.json`, {
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    const status = error.response?.status;
    const statusText = error.response?.statusText;
    const data = error.response?.data;
    
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
      url: `${SERVICEM8_BASE_URL}/job/${jobId}.json`,
      message: error.message
    });
    
    // Fallback to mock data
    const mockJobs = getMockJobs(customerEmail, customerPhone);
    const job = mockJobs.find(j => j.uuid === jobId);
    if (job) return job;
    
    throw new Error(`ServiceM8 API error (${status || 'unknown'}): ${statusText || error.message}`);
  }
};

