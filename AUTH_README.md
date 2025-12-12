# Email OTP Authentication API

A complete NestJS authentication system using email-based OTP verification with automatic user registration and JWT token management.

## Features

- 🔐 **Email OTP Authentication** - 4-digit OTP codes sent via email
- 👤 **Automatic User Registration** - Seamless onboarding for new users
- 🖼️ **Profile Image Upload** - Cloudinary integration for image storage
- 🔑 **JWT Tokens** - Long-lived tokens (90 days) for session management
- 📧 **Professional Emails** - Beautiful HTML email templates
- 🛡️ **Security** - Hashed OTP codes, protected routes, validation

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=90d

# SMTP Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@pamcare.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

> **Note:** For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.

### 3. Run Database Migration

```bash
npx prisma migrate dev
```

### 4. Start the Server

```bash
npm run start:dev
```

Server will start on `http://localhost:4321`

## API Endpoints

### Send OTP

```bash
POST /auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Verify OTP

```bash
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "1234"
}
```

**Response (Existing User):**
```json
{
  "userExists": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (New User):**
```json
{
  "userExists": false,
  "message": "Please complete registration"
}
```

### Complete Registration

```bash
POST /auth/complete-registration
Content-Type: multipart/form-data

email: user@example.com
first_name: John
last_name: Doe
profile_image: [file]
```

### Get Current User (Protected)

```bash
GET /auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

## Authentication Flow

### New User Registration

1. User enters email → `POST /auth/send-otp`
2. User receives 4-digit OTP via email
3. User enters OTP → `POST /auth/verify-otp`
4. System responds with `userExists: false`
5. User completes registration → `POST /auth/complete-registration`
6. System returns JWT token

### Existing User Login

1. User enters email → `POST /auth/send-otp`
2. User receives 4-digit OTP via email
3. User enters OTP → `POST /auth/verify-otp`
4. System responds with `userExists: true` and JWT token
5. User is logged in

## Protecting Routes

Use the `JwtAuthGuard` to protect your endpoints:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller('protected')
export class ProtectedController {
  @Get()
  @UseGuards(JwtAuthGuard)
  getProtectedData(@Request() req) {
    // req.user contains authenticated user data
    return { message: 'This is protected data', user: req.user };
  }
}
```

## Database Schema

### Users Table
- `id` - Auto-increment primary key
- `email` - Unique email address
- `first_name` - User's first name
- `last_name` - User's last name
- `profile_image` - Cloudinary URL (optional)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### OTP Codes Table
- `id` - Auto-increment primary key
- `email` - Email address (indexed)
- `code` - Hashed OTP code
- `expires_at` - Expiration time (10 minutes)
- `verified` - Verification status
- `created_at` - Creation timestamp

## Security Features

- ✅ OTP codes are hashed with bcrypt
- ✅ OTP expires after 10 minutes
- ✅ JWT tokens with configurable expiration
- ✅ Protected routes with guards
- ✅ Input validation with class-validator
- ✅ Automatic cleanup of used OTPs

## Tech Stack

- **NestJS** - Backend framework
- **Prisma** - Database ORM
- **Passport JWT** - Authentication strategy
- **Nodemailer** - Email sending
- **Cloudinary** - Image storage
- **Bcrypt** - Password/OTP hashing
- **Class Validator** - DTO validation

## Project Structure

```
src/
├── auth/              # Authentication module
│   ├── dto/          # Data transfer objects
│   ├── guards/       # Route guards
│   ├── strategies/   # Passport strategies
│   └── ...
├── cloudinary/       # Image upload service
├── email/            # Email service
├── prisma/           # Database service
└── types/            # TypeScript definitions
```

## Development

```bash
# Development mode
npm run start:dev

# Build
npm run build

# Production mode
npm run start:prod
```

## Testing with cURL

See [walkthrough.md](file:///Users/vickel/.gemini/antigravity/brain/7e5ba59a-ebdc-452d-aae6-9e58b55e1e87/walkthrough.md) for detailed testing examples.

## License

UNLICENSED
