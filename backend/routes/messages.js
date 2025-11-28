import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { supabase } from '../services/supabase.js';

const router = express.Router();

/**
 * GET /api/messages/:bookingId
 * Get messages for a specific booking
 * 
 * NOTE: Messages are stored in Supabase and work independently of ServiceM8 API.
 * This works with both real ServiceM8 bookings and mock data bookings.
 * The bookingId can be any valid identifier (ServiceM8 UUID or mock booking ID).
 */
router.get('/:bookingId', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const customerId = req.user.customerId;

    console.log(`📨 Fetching messages for booking: ${bookingId}, customer: ${customerId}`);

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('customer_id', customerId)
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error fetching messages:', error);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }

    console.log(`✅ Retrieved ${messages?.length || 0} messages for booking ${bookingId}`);
    res.json({ messages: messages || [] });
  } catch (error) {
    console.error('Messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

/**
 * POST /api/messages/:bookingId
 * Send a message for a specific booking
 * 
 * NOTE: Messages are saved to Supabase and work independently of ServiceM8 API.
 * This works with both real ServiceM8 bookings and mock data bookings.
 * Messages are persisted regardless of whether the booking is from ServiceM8 or mock data.
 */
router.post('/:bookingId', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { message } = req.body;
    const customerId = req.user.customerId;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`💬 Saving message for booking: ${bookingId}, customer: ${customerId}`);

    const { data: newMessage, error } = await supabase
      .from('messages')
      .insert([{
        customer_id: customerId,
        booking_id: bookingId, // Works with both ServiceM8 UUIDs and mock booking IDs
        message: message.trim()
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating message:', error);
      return res.status(500).json({ error: 'Failed to create message' });
    }

    console.log(`✅ Message saved successfully for booking ${bookingId}`);
    res.status(201).json({ message: newMessage });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

export default router;

