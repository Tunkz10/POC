// Test script to verify ServiceM8 API connection
// Run with: node test-servicem8.js

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const apiKey = process.env.SERVICEM8_API_KEY;

if (!apiKey) {
  console.error('❌ SERVICEM8_API_KEY not found in .env file');
  process.exit(1);
}

console.log('🔑 API Key found:', `${apiKey.substring(0, 10)}...`);
console.log('');

const authString = Buffer.from(`${apiKey}:`).toString('base64');

// Test different endpoint formats
const endpoints = [
  'https://api.servicem8.com/api/job.json',
  'https://api.servicem8.com/api/1.0/job.json',
  'https://api.servicem8.com/api/job',
  'https://api.servicem8.com/api/1.0/job',
];

async function testEndpoint(url) {
  try {
    console.log(`Testing: ${url}`);
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log(`✅ SUCCESS! Status: ${response.status}`);
    console.log(`   Response type: ${Array.isArray(response.data) ? 'Array' : typeof response.data}`);
    if (Array.isArray(response.data)) {
      console.log(`   Jobs count: ${response.data.length}`);
      if (response.data.length > 0) {
        console.log(`   Sample job keys: ${Object.keys(response.data[0]).slice(0, 5).join(', ')}`);
      }
    }
    console.log('');
    return true;
  } catch (error) {
    const status = error.response?.status;
    const statusText = error.response?.statusText;
    const data = error.response?.data;
    
    console.log(`❌ FAILED! Status: ${status || 'No response'} - ${statusText || error.message}`);
    if (data) {
      console.log(`   Response: ${JSON.stringify(data).substring(0, 200)}`);
    }
    console.log('');
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing ServiceM8 API endpoints...\n');
  
  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint);
    if (success) {
      console.log(`\n✅ Working endpoint found: ${endpoint}`);
      console.log('Update SERVICEM8_BASE_URL in backend/services/serviceM8.js to use this endpoint.');
      return;
    }
  }
  
  console.log('\n❌ All endpoints failed. Please check:');
  console.log('   1. Your API key is correct in .env file');
  console.log('   2. API key has Jobs API permissions in ServiceM8');
  console.log('   3. Your ServiceM8 account has API access enabled');
  console.log('   4. Check ServiceM8 API documentation for your account type');
}

runTests();

