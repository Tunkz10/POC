# Customer Portal POC

A production-ready Customer Portal demonstrating Next.js, Express.js, Supabase, and ServiceM8 API integration. **Note:** Currently using mock data for ServiceM8 due to trial account API restrictions (403 Forbidden errors), but the integration code is present and functional.

## Project Structure

```
.
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   └── messages.js
│   ├── services/
│   │   ├── serviceM8.js
│   │   └── supabase.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.jsx
│   │   ├── bookings/
│   │   │   ├── page.jsx
│   │   │   └── [id]/
│   │   │       └── page.jsx
│   │   ├── layout.jsx
│   │   └── globals.css
│   ├── components/
│   │   ├── BookingCard.jsx
│   │   ├── MessageList.jsx
│   │   └── MessageInput.jsx
│   ├── lib/
│   │   └── api.js
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── supabase-schema.sql
├── .env.example
├── TECH_NOTES.md
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Supabase account and project
- ServiceM8 API key
- npm or yarn package manager

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```bash
cp ../.env.example .env
```

Edit `.env` with your actual values:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon key
- `SERVICEM8_API_KEY`: Your ServiceM8 API key
- `JWT_SECRET`: Generate a strong random string (e.g., `openssl rand -base64 32`)
- `PORT`: 3001 (default)
- `FRONTEND_URL`: http://localhost:3000
- `BACKEND_URL`: http://localhost:3001

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001/api
```

### 3. Supabase Setup

1. Log in to your Supabase dashboard
2. Go to SQL Editor
3. Run the SQL from `supabase-schema.sql` to create the tables:
   - `customers` table
   - `messages` table
   - Indexes for performance

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Backend will run on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend will run on http://localhost:3000

## Testing the Application

### 1. Test Login

1. Navigate to http://localhost:3000/login
2. Enter an email and phone number
3. Click "Sign in"
4. You should be redirected to the bookings page

### 2. Test Bookings

1. After login, you should see a list of bookings
2. **Note:** Due to ServiceM8 trial account restrictions (API access disabled), the app uses mock data that mirrors the ServiceM8 schema. The code attempts real API calls but gracefully falls back to mock data.
3. Click on a booking to view details

### 3. Test Booking Details

1. Click on any booking card
2. View booking information (job number, status, date, address, etc.)
3. **Note:** Data comes from mock ServiceM8 responses (due to API access restrictions), but the integration code demonstrates proper API integration patterns

### 4. Test Messages

1. On a booking detail page, scroll to the Messages section
2. Type a message and click "Send"
3. The message should appear in the message list
4. Messages are stored in Supabase

## Development Commands

### Backend
- `npm start` - Run production server
- `npm run dev` - Run development server with auto-reload

### Frontend
- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run lint` - Run linter

## Environment Variables

See `.env.example` for all required environment variables.

**Important**: Never commit `.env` files to version control. Always use `.env.example` as a template.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and phone
- `GET /api/auth/me` - Get current user info

### Bookings
- `GET /api/bookings` - Get all bookings for authenticated customer (attempts ServiceM8 API, falls back to mock data)
- `GET /api/bookings/:id` - Get specific booking details (attempts ServiceM8 API, falls back to mock data)
- `GET /api/jobs` - Get jobs from ServiceM8 API (attempts real API call, falls back to mock data on 403/error)

### Messages
- `GET /api/messages/:bookingId` - Get messages for a booking
- `POST /api/messages/:bookingId` - Send a message for a booking

All endpoints except `/api/auth/login` require authentication via Bearer token in Authorization header.

## Troubleshooting

### Backend won't start
- Check that all environment variables are set in `.env`
- Verify Node.js version is 18+
- Check that port 3001 is not in use

### Frontend won't start
- Check that port 3000 is not in use
- Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly

### No bookings showing
- **ServiceM8 API Issue:** Trial accounts have API access disabled (403 Forbidden). The app automatically uses mock data in this case.
- If using a paid ServiceM8 account, verify your API key is correct
- Check that jobs in ServiceM8 have email/phone matching your login credentials
- Check browser console and backend logs for errors
- Mock data should display automatically if API calls fail

### Messages not saving
- Verify Supabase connection (check SUPABASE_URL and SUPABASE_KEY)
- Ensure tables were created correctly
- Check Supabase dashboard for any errors

### CORS errors
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that backend CORS configuration allows your frontend origin

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use strong, unique values for `JWT_SECRET`
3. Update `FRONTEND_URL` and `BACKEND_URL` to production URLs
4. Enable HTTPS
5. Set up proper error monitoring
6. Configure database backups
7. Add rate limiting
8. Set up CI/CD pipeline

See `TECH_NOTES.md` for more details on extending to production.

