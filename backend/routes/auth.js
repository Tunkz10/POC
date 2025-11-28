import express from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../services/supabase.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ error: 'Email and phone are required' });
    }

    let { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .eq('phone', phone)
      .single();

    if (error || !customer) {
      const { data: newCustomer, error: insertError } = await supabase
        .from('customers')
        .insert([{ email, phone }])
        .select()
        .single();

      if (insertError) {
        return res.status(500).json({ error: 'Failed to create customer' });
      }

      customer = newCustomer;
    }

    const token = jwt.sign(
      { customerId: customer.id, email: customer.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      customer: {
        id: customer.id,
        email: customer.email,
        phone: customer.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { data: customer, error } = await supabase
      .from('customers')
      .select('id, email, phone, created_at')
      .eq('id', decoded.customerId)
      .single();

    if (error || !customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ customer });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;

