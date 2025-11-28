import express from 'express';
import axios from 'axios';

const router = express.Router();

// GET /api/jobs - Fetch jobs from ServiceM8 API with fallback to mock data
router.get('/', async (req, res) => {
  try {
    const apiKey = process.env.SERVICEM8_API_KEY;
    
    if (!apiKey) {
      console.log('ServiceM8 API failed, switching to fallback mode');
      return res.json(getMockJobs());
    }

    // ATTEMPT the real Axios request to ServiceM8 API
    const authString = Buffer.from(`${apiKey}:`).toString('base64');
    
    const response = await axios.get('https://api.servicem8.com/api_1.0/job.json', {
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      }
    });

    // If successful, return the real data
    return res.json(response.data);
    
  } catch (error) {
    // WRAP the request in a try/catch block
    // IN THE CATCH BLOCK: Log the API failure clearly
    console.log('ServiceM8 API failed, switching to fallback mode');
    console.error('ServiceM8 API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message
    });

    // RETURN a hardcoded "Mock Data" JSON array instead
    return res.json(getMockJobs());
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

