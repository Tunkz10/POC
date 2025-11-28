# Technical Notes

## What Was Built

A production-ready Customer Portal POC demonstrating:

- **Next.js 14 Frontend** with App Router, Tailwind CSS, and client-side routing
- **Express.js Backend** with RESTful API endpoints, JWT authentication, and middleware
- **ServiceM8 API Integration** - Attempts real API calls to ServiceM8's job endpoint, with graceful fallback to mock data due to trial account API restrictions (403 Forbidden errors)
- **Supabase Integration** for customer and message persistence
- **Token-based Authentication** using JWT with 7-day expiration
- **Message System** allowing customers to send messages tied to specific bookings

## Important Architectural Decisions

### Backend Architecture
- **Separation of Concerns**: Routes handle HTTP, services handle business logic, middleware handles cross-cutting concerns
- **Service Layer Pattern**: `serviceM8.js` and `supabase.js` encapsulate external API interactions
- **JWT Authentication**: Stateless token-based auth stored in localStorage on frontend
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Frontend Architecture
- **App Router**: Using Next.js 14 App Router for modern routing and layouts
- **Client Components**: All interactive pages use 'use client' directive
- **API Abstraction**: `lib/api.js` provides a clean interface to backend endpoints
- **Minimal UI**: Functional Tailwind CSS styling without over-engineering

### ServiceM8 Integration
- **ServiceM8 API Issue**: The ServiceM8 API is currently returning 403 Forbidden / Access Denied errors due to trial account restrictions. API access is disabled on free trial accounts.
- **Mock Data Solution**: The application gracefully handles this by falling back to mock data that mirrors the ServiceM8 schema, allowing the POC to function fully without real API access.
- **Real API Call Attempt**: The code still attempts real API calls to `https://api.servicem8.com/api_1.0/job.json` (visible in `backend/routes/jobs.js`) to demonstrate proper integration, but automatically switches to mock data on failure.
- **Basic Auth Implementation**: Uses Base64-encoded API key in Authorization header as per ServiceM8 documentation (ready for when API access is enabled).
- **Customer Filtering**: Backend filters jobs by matching customer email/phone with job contact info (works with both real and mock data).
- **Error Handling**: Graceful fallback to mock data ensures the POC remains fully functional despite ServiceM8 API limitations.

### Data Flow
1. Customer logs in with email/phone → Backend creates/retrieves customer in Supabase → Returns JWT
2. Frontend stores JWT in localStorage → Includes in Authorization header for subsequent requests
3. Bookings request → Backend attempts ServiceM8 API call → On 403/error, falls back to mock data → Filters by customer contact info → Returns filtered list
4. Booking detail → Backend attempts ServiceM8 API call → On error, uses mock data → Verifies customer access → Returns job data
5. Messages → Stored in Supabase with customer_id and booking_id foreign keys

## Assumptions

1. **ServiceM8 API Format**: Assumes jobs have `job_email`, `job_phone`, `job_number`, `status`, `date`, `time`, `description`, and `job_address` fields
2. **Customer Matching**: Assumes customers can be matched to bookings by exact email or phone number match
3. **Phone Format**: Phone numbers are normalized (digits only) for comparison
4. **Single API Key**: One ServiceM8 API key is used for all customers (typical for a customer portal scenario)
5. **Booking ID**: Uses ServiceM8's `uuid` field as the booking identifier

## Limitations Due to 5-Hour Constraint

1. **No Password Authentication**: Login uses only email/phone verification (acceptable for POC)
2. **No File Upload**: Attachment viewing is mentioned but not implemented (would require ServiceM8 attachments API)
3. **No Real-time Updates**: Messages don't refresh automatically (would need WebSockets or polling)
4. **No Pagination**: Bookings list loads all jobs at once (could be slow with many bookings)
5. **Basic Error Messages**: Error handling is functional but could be more user-friendly
6. **No Loading States**: Some operations lack visual feedback
7. **No Input Validation**: Frontend validation is minimal (relying on backend)
8. **No Testing**: No unit or integration tests included
9. **No Deployment Config**: No Docker, CI/CD, or deployment scripts
10. **Hardcoded Filtering**: Customer-to-booking matching logic is simplistic

## How AI Assisted

- Generated complete codebase structure and implementation
- Created all backend routes, services, and middleware
- Built all frontend pages and components
- Provided Supabase schema and configuration
- Created documentation and setup instructions

## How to Extend to Production

### Security Enhancements
- Add rate limiting to API endpoints
- Implement CSRF protection
- Add input sanitization and validation
- Use HTTPS in production
- Implement refresh token rotation
- Add password-based authentication with hashing

### Performance
- Add pagination to bookings list
- Implement caching for ServiceM8 API calls
- Add database query optimization
- Implement lazy loading for large lists
- Add service worker for offline support

### Features
- Real-time message updates (WebSockets or Server-Sent Events)
- File attachment viewing and upload
- Email notifications for new messages
- Booking status change notifications
- Customer profile management
- Search and filter bookings
- Export bookings to PDF/CSV

### Infrastructure
- Add Docker containers for easy deployment
- Set up CI/CD pipeline
- Add monitoring and logging (e.g., Sentry, DataDog)
- Implement database backups
- Add health check endpoints
- Set up staging environment

### Testing
- Unit tests for services and utilities
- Integration tests for API endpoints
- E2E tests for critical user flows
- Load testing for API endpoints

### Code Quality
- Add ESLint and Prettier configuration
- Set up pre-commit hooks
- Add TypeScript for type safety
- Implement proper logging strategy
- Add API documentation (Swagger/OpenAPI)

