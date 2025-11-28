import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { supabase } from '../services/supabase.js';

const router = express.Router();

router.get('/:bookingId', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const customerId = req.user.customerId;

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('customer_id', customerId)
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }

    res.json({ messages: messages || [] });
  } catch (error) {
    console.error('Messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/:bookingId', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { message } = req.body;
    const customerId = req.user.customerId;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const { data: newMessage, error } = await supabase
      .from('messages')
      .insert([{
        customer_id: customerId,
        booking_id: bookingId,
        message: message.trim()
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to create message' });
    }

    res.status(201).json({ message: newMessage });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

export default router;

