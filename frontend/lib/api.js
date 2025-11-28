// Ensure API_BASE_URL always ends with /api
let API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

// Remove trailing slash if present
API_BASE_URL = API_BASE_URL.replace(/\/$/, '');

// Ensure /api is included
if (!API_BASE_URL.endsWith('/api')) {
  // If it doesn't end with /api, add it
  API_BASE_URL = API_BASE_URL.endsWith('/') 
    ? API_BASE_URL + 'api' 
    : API_BASE_URL + '/api';
}

export const api = {
  async request(endpoint, options = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  },

  async login(email, phone) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, phone }),
    });
    
    if (typeof window !== 'undefined' && data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  },

  async getMe() {
    return this.request('/auth/me');
  },

  async getBookings() {
    return this.request('/bookings');
  },

  async getBooking(id) {
    return this.request(`/bookings/${id}`);
  },

  async getMessages(bookingId) {
    return this.request(`/messages/${bookingId}`);
  },

  async sendMessage(bookingId, message) {
    return this.request(`/messages/${bookingId}`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
};

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

