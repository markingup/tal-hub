# TALHub

A Next.js 15 application for tenant-landlord dispute management, built with UNIX principles for modular, maintainable code.

## Overview

TALHub is a comprehensive platform that helps tenants and landlords manage disputes, track cases, share documents, and communicate effectively. The system includes role-based access control, real-time messaging, document management, and deadline tracking.

## Stack

- **Next.js 15** with App Router and Turbopack
- **TypeScript** with strict mode
- **Tailwind CSS** for styling
- **Supabase** for backend services (Auth, Database, Storage, Realtime)
- **React Query** for data fetching and caching
- **Zod** for validation
- **React Hook Form** for form handling
- **Lucide React** for icons
- **Radix UI** for accessible components

## Features

- **Authentication**: Magic link authentication with role-based access
- **Case Management**: Create and manage tenant-landlord disputes
- **Document Sharing**: Secure file upload and sharing with access control
- **Real-time Messaging**: Live chat within cases
- **Deadline Tracking**: Task management and reminders
- **Role-based Access**: Tenant, Landlord, Lawyer, and Admin roles
- **Responsive Design**: Mobile-first approach with dark/light themes

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main application dashboard
│   ├── onboarding/        # User onboarding flow
│   ├── help/              # Help and support pages
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components (Radix + Tailwind)
│   ├── auth-provider.tsx  # Authentication context
│   ├── case-card.tsx      # Case display components
│   ├── document-*.tsx     # Document management
│   ├── message-*.tsx      # Messaging components
│   └── deadline-*.tsx     # Deadline management
├── lib/                   # Utility functions and configurations
│   ├── actions/           # Server actions
│   ├── hooks/             # Custom React hooks
│   ├── supabase/          # Supabase client configuration
│   └── utils.ts           # Utility functions
└── docs/                  # Documentation
    ├── Supabase_Setup_Engineering_Notes_mvp.md
    └── mock-data.md
```

## Database Schema

The application uses Supabase with the following core entities:

- **profiles**: User profiles with role information
- **cases**: Dispute cases with metadata
- **case_participants**: Many-to-many relationship for case access
- **documents**: File metadata and storage paths
- **messages**: Real-time messaging within cases
- **deadlines**: Task and deadline tracking
- **consultations**: Lawyer consultation requests (Phase 2)
- **payments**: Payment tracking (Phase 2)

## UNIX Principles Applied

1. **Do One Thing Well**: Each module/component has a single responsibility
2. **Work Together**: Components are loosely coupled and composable
3. **Text as Interface**: Configuration through environment variables and JSON
4. **KISS**: Simple solutions over complex ones
5. **Rule of Silence**: Minimal logging, clear error messages
6. **Rule of Repair**: Fail fast with helpful error information
7. **Rule of Economy**: Focus on readability and maintainability

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tal-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL migrations (see `docs/Supabase_Setup_Engineering_Notes_mvp.md`)
   - Set up Row Level Security (RLS) policies
   - Configure storage bucket `talhub-docs`
   - Set up authentication with magic links

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing the Setup

1. **Create test users**: Sign up with different email addresses to test different roles
2. **Verify RLS**: Ensure users can only see cases they&apos;re participants in
3. **Test messaging**: Send messages between users in the same case
4. **Upload documents**: Test file upload and access control
5. **Check deadlines**: Create and manage deadlines within cases

## Development Guidelines

- Follow UNIX principles in all code
- Keep components small and focused
- Use TypeScript strict mode
- Prefer composition over inheritance
- Write clear, self-documenting code
- Fail fast with helpful error messages
- Test RLS policies thoroughly
- Use React Query for all data fetching
- Implement proper error boundaries

## Testing

The application includes mock data for development and testing:

- **Test Users**: tenant@example.com, landlord@example.com, lawyer@example.com
- **Sample Cases**: Non-payment dispute and renovation case
- **Mock Documents**: Sample files for testing upload/download
- **Test Messages**: Pre-populated conversations
- **Sample Deadlines**: Various task deadlines

See `docs/mock-data.md` for detailed information about the test data.

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the UNIX principles and coding guidelines
4. Test your changes thoroughly
5. Submit a pull request

## Support

- **Documentation**: See `docs/` folder for detailed setup guides
- **Help Page**: Visit `/help` for user guides and FAQ
- **Issues**: Report bugs and feature requests via GitHub issues

## License

[Add your license information here]