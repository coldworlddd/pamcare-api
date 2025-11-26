# Pam Care AI - Backend API

A comprehensive healthcare management backend built with NestJS, featuring appointment booking, patient reports, pharmacy information, and AI-powered chat assistance.

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: MySQL
- **ORM**: Prisma
- **Cache**: Redis
- **AI**: OpenAI GPT-4o
- **Authentication**: JWT, Passport.js (Google OAuth)
- **Email**: Nodemailer (SMTP)

## Features

### Authentication
- Email/SMTP registration with verification code
- Google OAuth login
- JWT-based authentication
- Refresh token support

### User Profile
- First Name and Last Name
- Profile Picture upload
- Profile management

### Appointment Booking
- Create, read, update, delete appointments
- Appointment status management (Pending, Confirmed, Cancelled, Completed)
- User-specific appointment filtering

### Patient Reports
- Upload and manage patient reports
- Support for multiple report types (Lab Results, Diagnosis, Prescription, General)
- File upload support

### Pharmacy
- Medication information database
- Search medications by name or description
- View medication details (dosage, side effects, indications, contraindications)

### AI Chat
- GPT-4o powered healthcare assistant
- Chat session management
- Conversation history

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- Redis (v6.0 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pam-care
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   - Database connection string
   - JWT secret
   - Redis configuration
   - SMTP credentials
   - Google OAuth credentials
   - OpenAI API key

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate
   ```

5. **Create upload directories**
   ```bash
   npm run setup
   ```
   This will create the necessary upload directories for profile pictures and reports.

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/register` - Register with email
- `POST /auth/verify-code` - Verify email code
- `POST /auth/login` - Login with email/password
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user profile

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile
- `PUT /users/profile/picture` - Upload profile picture

### Appointments
- `POST /appointments` - Create appointment
- `GET /appointments` - List appointments (with pagination)
- `GET /appointments/:id` - Get appointment details
- `PATCH /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Delete appointment

### Reports
- `POST /reports` - Create report
- `POST /reports/upload` - Upload report file
- `GET /reports` - List reports (with pagination)
- `GET /reports/:id` - Get report details
- `PATCH /reports/:id` - Update report
- `DELETE /reports/:id` - Delete report

### Pharmacy
- `POST /pharmacy` - Add medication (admin)
- `GET /pharmacy` - List medications (with pagination and search)
- `GET /pharmacy/:id` - Get medication details
- `PATCH /pharmacy/:id` - Update medication (admin)
- `DELETE /pharmacy/:id` - Delete medication (admin)

### Chat
- `POST /chat/sessions` - Create chat session
- `GET /chat/sessions` - List chat sessions (with pagination)
- `GET /chat/sessions/:id` - Get chat session with messages
- `POST /chat/messages` - Send message to AI
- `DELETE /chat/sessions/:id` - Delete chat session

## Environment Variables

See `.env.example` for all required environment variables:

- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT expiration time
- `REDIS_HOST` - Redis host
- `REDIS_PORT` - Redis port
- `REDIS_PASSWORD` - Redis password (optional)
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `SMTP_FROM` - Email sender address
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GOOGLE_CALLBACK_URL` - Google OAuth callback URL
- `OPENAI_API_KEY` - OpenAI API key
- `PORT` - Server port (default: 3000)
- `BASE_URL` - Base URL for file serving
- `MAX_FILE_SIZE` - Maximum file upload size in bytes

## Database Schema

The application uses Prisma ORM with the following main models:

- **User** - User accounts and profiles
- **Appointment** - Appointment bookings
- **PatientReport** - Patient medical reports
- **Medication** - Medication information
- **ChatSession** - AI chat sessions
- **ChatMessage** - Chat messages

See `prisma/schema.prisma` for the complete schema.

## Project Structure

```
src/
├── auth/              # Authentication module
│   ├── dto/          # Data transfer objects
│   ├── strategies/   # Passport strategies
│   └── ...
├── users/            # User profile module
├── appointments/     # Appointment booking module
├── reports/          # Patient reports module
├── pharmacy/         # Pharmacy/medication module
├── chat/             # AI chat module
├── prisma/           # Prisma service
├── redis/            # Redis service
└── common/           # Shared utilities
```

## Development

### Prisma Studio
View and edit your database:
```bash
npm run prisma:studio
```

### Linting
```bash
npm run lint
```

### Testing
```bash
npm run test
```

## Security Considerations

- All routes except `/auth/register`, `/auth/login`, `/auth/google`, and `/auth/google/callback` require JWT authentication
- Passwords are hashed using bcrypt
- File uploads are validated for size and type
- CORS is enabled for cross-origin requests

## License

MIT

## Support

For issues and questions, please open an issue in the repository.

