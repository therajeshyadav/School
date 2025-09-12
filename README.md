# SchoolHub - School Management System

A comprehensive school management platform built with Next.js and MySQL, featuring secure authentication and school directory management capabilities.

## Features

### 🔐 Authentication System
- *Email OTP Login*: Secure 6-digit OTP authentication with 10-minute expiry
- *Protected Routes*: Only authenticated users can add/edit schools
- *Session Management*: JWT-based authentication with secure cookies
- *User Registration*: Simple signup process with email verification

### 🏫 School Management
- *Add Schools*: Complete form with validation for adding new schools (authenticated users only)
- *Browse Schools*: Public directory of all schools with search functionality
- *Edit Schools*: Update school information (authenticated users only)
- *Delete Schools*: Remove schools from directory (authenticated users only)

### 🎨 User Experience
- *Responsive Design*: Works seamlessly on desktop and mobile devices
- *Modern UI*: Built with Tailwind CSS and Radix UI components
- *Real-time Search*: Search schools by name, city, or state
- *Image Upload*: Support for school images with Cloudinary integration
- *Loading States*: Smooth user experience with loading indicators
- *Error Handling*: Comprehensive error handling and user feedback

## Tech Stack

- *Frontend*: Next.js 15.5.2 with App Router (JavaScript)
- *Styling*: Tailwind CSS
- *UI Components*: Radix UI
- *Form Handling*: React Hook Form with Zod validation
- *Authentication*: JWT with secure cookies
- *Email Service*: Nodemailer for OTP delivery
- *Database*: MySQL (Railway)
- *Image Storage*: Cloudinary
- *Icons*: Lucide React
- *Deployment*: Vercel (Frontend) + Railway (Database)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MySQL Server

### Installation

1. Clone the repository:
bash
git clone <repository-url>
cd nextjs-school-management


2. Install dependencies:
bash
npm install


3. Set up MySQL Database:
   - Install MySQL Server if not already installed
   - Create a database named school_management
   - The application will automatically create the required tables on first run

4. Set up environment variables:
bash
cp .env.example .env.local


Fill in your credentials in .env.local:

# Database Configuration
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
DB_PORT=3306

# Authentication
JWT_SECRET=your_jwt_secret_key

# Email Configuration (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


5. Run the development server:
bash
npm run dev


Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

### Schools Table
The application automatically creates this table:
sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  contact VARCHAR(20) NOT NULL,
  image TEXT,
  email_id VARCHAR(255) NOT NULL,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


### Users Table
For authentication system:
sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


### OTP Table
For OTP verification:
sql
CREATE TABLE otp_verification (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


## Project Structure

*Main Directories:*

- **app/** - Next.js App Router structure
  - **api/** - API routes
    - **auth/** - Authentication endpoints (signup, OTP, login, logout)
    - **schools/** - School management endpoints
    - **upload/** - Image upload API
  - **add-school/** - Add school page (protected)
  - **edit-school/** - Edit school page (protected)
  - **show-schools/** - Schools directory (public)
  - **login/** - Login page
  - **signup/** - Registration page
  - **middleware.js** - Route protection
  - **layout.js** - Root layout
  - **page.js** - Home page

- **components/** - React components
  - **ui/** - Reusable UI components
  - **Navigation.js** - Navigation bar
  - **SchoolCard.js** - School display card
  - **SchoolForm.js** - School form
  - **SchoolGrid.js** - Schools grid
  - **LoadingSpinner.js** - Loading component

- **context/** - React contexts
  - **AuthContext.js** - Authentication state

- **lib/** - Utility libraries
  - **auth.js** - JWT utilities
  - **cloudinary.js** - Image upload config
  - **database.js** - MySQL connection
  - **schoolService.js** - School API calls
  - **utils.js** - Helper functions

- **public/** - Static assets
  - **schoolImages/** - Uploaded images

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/signup
- Register a new user
- Body: { name, email, phone }

#### POST /api/auth/send-otp
- Send OTP to email
- Body: { email }

#### POST /api/auth/verify-otp
- Verify OTP and login
- Body: { email, otp }

#### GET /api/auth/me
- Get current user information
- Requires authentication

#### POST /api/auth/logout
- Logout user
- Clears authentication cookie

### School Management Endpoints

#### GET /api/schools
- Fetch all schools (public)
- Query parameter: search for filtering

#### POST /api/schools
- Create a new school (authenticated users only)
- Accepts FormData with school information

#### GET /api/schools/[id]
- Get specific school details

#### PUT /api/schools/[id]
- Update school information (authenticated users only)

#### DELETE /api/schools/[id]
- Delete school (authenticated users only)

### File Upload

#### POST /api/upload
- Upload school images to Cloudinary
- Returns image URL for storage

## Features in Detail

### Authentication System
- *Email OTP Login*: Secure 6-digit OTP with 10-minute expiry
- *User Registration*: Simple signup with email verification
- *Session Management*: JWT-based authentication with secure cookies
- *Route Protection*: Middleware-based route protection
- *Auto-logout*: Session expires after 1 hour

### School Management
- *Add Schools*: Complete form with validation (authenticated users only)
- *Edit Schools*: Update school information (authenticated users only)
- *Delete Schools*: Remove schools from directory (authenticated users only)
- *View Schools*: Public directory with search functionality

### User Interface
- *Responsive Design*: Works on all device sizes
- *Modern UI*: Built with Tailwind CSS and Radix UI
- *Loading States*: Smooth user experience with loading indicators
- *Error Handling*: Comprehensive error handling and user feedback
- *Image Upload*: Cloudinary integration for school images
- *Search Functionality*: Real-time search by name, city, or state

## Security Features

### Authentication & Authorization
- *JWT Tokens*: Secure token-based authentication
- *Route Protection*: Middleware protects sensitive routes
- *Session Management*: Automatic session expiry
- *OTP Security*: Time-limited OTP with expiry
- *Input Validation*: Comprehensive form validation with Zod

### Data Protection
- *SQL Injection Prevention*: Parameterized queries
- *XSS Protection*: Input sanitization
- *CSRF Protection*: Secure cookie handling
- *Environment Variables*: Sensitive data in environment variables

## Environment Variables

### Required Environment Variables:

#### Database Configuration
- DB_HOST: MySQL host
- DB_USER: MySQL username
- DB_PASSWORD: MySQL password
- DB_NAME: Database name
- DB_PORT: MySQL port (default: 3306)

#### Authentication
- JWT_SECRET: Secret key for JWT token signing

#### Email Configuration (for OTP)
- EMAIL_HOST: SMTP server (e.g., smtp.gmail.com)
- EMAIL_PORT: SMTP port (default: 587)
- EMAIL_USER: Your email address
- EMAIL_PASS: Your email app password

#### Cloudinary (for image uploads)
- CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name
- CLOUDINARY_API_KEY: Your Cloudinary API key
- CLOUDINARY_API_SECRET: Your Cloudinary API secret

## Deployment

### Current Deployment Setup:
- *Frontend*: Vercel (Next.js application)
- *Database*: Railway (MySQL database)
- *Image Storage*: Cloudinary

### Deployment Steps:

#### 1. Deploy to Vercel:
bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard


#### 2. Set up Railway Database:
1. Create Railway account
2. Create new MySQL database
3. Copy connection details
4. Set environment variables in Vercel

#### 3. Configure Cloudinary:
1. Create Cloudinary account
2. Get API credentials
3. Set environment variables in Vercel

### Environment Variables for Production:
Set these in your deployment platform:
- All database variables
- JWT_SECRET
- Email configuration
- Cloudinary credentials

### Build Configuration:
The application uses:
- output: 'standalone' for optimized builds
- Dynamic rendering for authenticated routes
- Build-time database connection handling

## User Flow

### For Public Users:
1. *Browse Schools*: View all schools in the directory
2. *Search Schools*: Search by name, city, or state
3. *View Details*: Click on school cards to see details

### For Authenticated Users:
1. *Sign Up*: Register with name, email, and phone
2. *Login*: Enter email to receive OTP, verify OTP to login
3. *Add Schools*: Create new school entries with full details
4. *Edit Schools*: Update existing school information
5. *Delete Schools*: Remove schools from the directory
6. *Logout*: End session securely

## Technical Implementation

### Authentication Flow:
1. User enters email → OTP sent via email
2. User enters OTP → JWT token generated
3. Token stored in secure HTTP-only cookie
4. Middleware validates token for protected routes
5. Session expires after 1 hour

### Security Measures:
- JWT tokens with expiration
- HTTP-only cookies for token storage
- Route protection middleware
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## Live Demo

*Live Application*: [Your Vercel Deployment URL]
*GitHub Repository*: [Your GitHub Repository URL]

## Assignment Completion

This project successfully implements:
- ✅ Email OTP authentication system
- ✅ Protected routes for school management
- ✅ Public school directory
- ✅ Secure user session management
- ✅ Modern, responsive UI
- ✅ Comprehensive error handling
- ✅ Production-ready deployment

## License

This project is licensed under the MIT License.
