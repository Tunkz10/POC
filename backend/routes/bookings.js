import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getServiceM8Jobs, getServiceM8JobById } from '../services/serviceM8.js';
import { supabase } from '../services/supabase.js';

const router = express.Router();

// Test endpoint to verify ServiceM8 API connection (remove in production)
router.get('/test-api', async (req, res) => {
  try {
    const apiKey = process.env.SERVICEM8_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'ServiceM8 API key not configured' });
    }

    const { getServiceM8Jobs } = await import('../services/serviceM8.js');
    const jobs = await getServiceM8Jobs(apiKey);
    
    res.json({ 
      success: true, 
      message: 'ServiceM8 API connection successful',
      jobsCount: Array.isArray(jobs) ? jobs.length : 'non-array response',
      sampleJob: Array.isArray(jobs) && jobs.length > 0 ? jobs[0] : null
    });
  } catch (error) {
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
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'ServiceM8 API key not configured',
        bookings: [] 
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
      // Pass customer email/phone so mock data matches logged-in user
      jobs = await getServiceM8Jobs(apiKey, customerData.email, customerData.phone);
      console.log('ServiceM8 API response received:', Array.isArray(jobs) ? `${jobs.length} jobs` : 'non-array response');
    } catch (error) {
      console.error('ServiceM8 API error:', error.message);
      serviceM8Error = error.message;
      // Continue with empty jobs array for POC demonstration
      jobs = [];
    }
    
    // Filter jobs by customer email/phone
    const filteredJobs = Array.isArray(jobs) 
      ? jobs.filter(job => {
          const jobEmail = job.job_email?.toLowerCase();
          const jobPhone = job.job_phone?.replace(/\D/g, '');
          const customerEmail = customerData.email?.toLowerCase();
          const customerPhone = customerData.phone?.replace(/\D/g, '');

          return (jobEmail === customerEmail) || (jobPhone === customerPhone);
        })
      : [];

    // Return bookings with optional error message
    res.json({ 
      bookings: filteredJobs,
      ...(serviceM8Error && { serviceM8Error })
    });
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

