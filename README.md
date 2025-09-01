# Next.js School Management System

A modern school management system built with Next.js and MySQL, featuring school registration and directory browsing capabilities.

## Features

- **Add Schools**: Complete form with validation for adding new schools
- **Browse Schools**: Grid-based display of all schools with search functionality
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **Real-time Search**: Search schools by name, city, or state
- **Image Upload**: Support for school images with preview

## Tech Stack

- **Frontend**: Next.js 13+ with App Router (JavaScript)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form with Zod validation
- **Database**: MySQL
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MySQL Server

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nextjs-school-management
```

2. Install dependencies:
```bash
npm install
```

3. Set up MySQL Database:
   - Install MySQL Server if not already installed
   - Create a database named `school_management`
   - The application will automatically create the required tables on first run

4. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your MySQL credentials in `.env.local`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=school_management
DB_PORT=3306
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

### Schools Table
The application automatically creates this table:
```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  contact VARCHAR(20) NOT NULL,
  image TEXT,
  email_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── schools/          # Schools API endpoints
│   │   └── upload/           # Image upload API
│   ├── add-school/           # Add school page
│   ├── show-schools/         # Schools directory page
│   ├── globals.css           # Global styles
│   ├── layout.js             # Root layout
│   └── page.js               # Home page
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── Navigation.js         # Navigation component
│   ├── SchoolCard.js         # School card component
│   ├── SchoolForm.js         # School form component
│   └── SchoolGrid.js         # Schools grid component
├── lib/
│   ├── database.js           # MySQL database connection
│   ├── schoolService.js      # School-related API calls
│   └── utils.js              # Utility functions
├── hooks/
│   └── use-toast.js          # Toast notification hook
└── public/
    └── schoolImages/         # Uploaded school images
```

## API Endpoints

### GET /api/schools
- Fetch all schools
- Query parameter: `search` for filtering

### POST /api/schools
- Create a new school
- Accepts FormData with school information

### POST /api/upload
- Upload school images
- Returns image URL for storage

## Features in Detail

### School Registration Form (addSchool.jsx)
- Form validation using Zod schema
- Email validation
- Phone number validation
- Image upload with preview
- Responsive design
- Success/error feedback

### Schools Directory (showSchools.jsx)
- Grid layout similar to e-commerce sites
- Search functionality
- Responsive cards
- Image display with fallback
- Loading states

### Navigation
- Responsive navigation bar
- Active page highlighting
- Mobile-friendly design

## File Upload

Images are stored in the `public/schoolImages/` directory and served statically. The upload API handles:
- File validation
- Unique filename generation
- Directory creation
- Error handling

## Environment Variables

Required environment variables:
- `DB_HOST`: MySQL host (default: localhost)
- `DB_USER`: MySQL username (default: root)
- `DB_PASSWORD`: MySQL password
- `DB_NAME`: Database name (default: school_management)
- `DB_PORT`: MySQL port (default: 3306)

## Deployment

The application can be deployed to any platform that supports Next.js with server-side functionality:

- **Vercel** (with MySQL database)
- **Railway** (with MySQL addon)
- **Heroku** (with ClearDB MySQL)
- **DigitalOcean App Platform**

Make sure to:
1. Set up your MySQL database
2. Configure environment variables
3. Ensure the deployment platform supports file uploads

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
