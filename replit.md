# Health4All - Fitness & Wellness Tracker

## Overview

Health4All is a comprehensive fitness and wellness tracking application that enables users to monitor workouts, track health metrics, log hiking sessions, and visualize their progress over time. The application follows a "motivational minimalism" design philosophy inspired by leading fitness apps like Strava, Nike Training Club, and Apple Fitness+, featuring a vibrant orange primary brand color with dark mode support.

The application serves both casual users seeking general wellness tracking and fitness enthusiasts wanting detailed workout planning and performance analytics. Key features include personalized workout scheduling, daily health metrics logging (heart rate, steps, calories), dedicated hiking mode with elevation tracking, and comprehensive progress visualization through charts and statistics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **React 18** with TypeScript for type-safe component development
- **Wouter** for lightweight client-side routing
- **TanStack Query v5** for server state management and data fetching
- **React Hook Form** with Zod validation for form handling
- **Vite** as the build tool and development server

**UI Framework:**
- **shadcn/ui** components built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Recharts** for data visualization and progress charts
- Custom theme system supporting light/dark modes with CSS variables

**Component Structure:**
- Page-based routing with dedicated routes for Dashboard, Profile, Workouts, Health, Hiking, and Progress
- Shared UI components library in `client/src/components/ui/`
- Custom hooks for authentication (`useAuth`) and mobile detection (`useIsMobile`)
- Form components leverage controlled inputs with validation schemas

**State Management:**
- TanStack Query handles all server state with automatic caching and refetching
- Query keys follow REST-like patterns (`["/api/workouts"]`, `["/api/health-metrics"]`)
- Optimistic updates and cache invalidation on mutations
- Session-based authentication state managed through query results

### Backend Architecture

**Technology Stack:**
- **Node.js** with **Express.js** for the REST API server
- **TypeScript** for type safety across the stack
- **Drizzle ORM** for database operations with type-safe queries
- **Neon Serverless PostgreSQL** as the database provider

**Authentication:**
- **Replit Auth** (OpenID Connect) for user authentication
- **Passport.js** with OpenID Client strategy
- **express-session** with PostgreSQL session store (`connect-pg-simple`)
- Session cookies with 1-week TTL, httpOnly and secure flags

**API Design:**
- RESTful endpoints under `/api/*` namespace
- Authentication middleware (`isAuthenticated`) protects all routes
- Consistent JSON responses with error handling middleware
- Request logging with duration tracking for API calls

**Database Schema:**
- **users** - Core user profiles from Replit Auth
- **fitnessProfiles** - Extended user fitness data (goals, preferences, measurements)
- **workouts** - Scheduled and completed workout sessions
- **healthMetrics** - Daily health tracking (heart rate, steps, calories)
- **hikingSessions** - Specialized hiking activity logs with elevation data
- **notifications** - User notification system
- **sessions** - PostgreSQL-backed session storage

**Data Access Layer:**
- Storage interface (`IStorage`) abstracts database operations
- Drizzle ORM provides type-safe query building
- Foreign key relationships with cascade deletes for data integrity
- Timestamp tracking for created/updated records

### External Dependencies

**Database:**
- **Neon Serverless PostgreSQL** - Cloud PostgreSQL with connection pooling via WebSockets
- Configured through `DATABASE_URL` environment variable
- Drizzle Kit for schema management and migrations

**Authentication:**
- **Replit Auth (OIDC)** - OAuth 2.0 / OpenID Connect provider
- Requires `REPL_ID`, `ISSUER_URL`, and `SESSION_SECRET` environment variables
- Handles user profile management and session lifecycle

**UI Component Libraries:**
- **Radix UI** - Accessible, unstyled component primitives (dialogs, dropdowns, forms, etc.)
- **Lucide React** - Icon library for consistent iconography
- **Recharts** - Declarative charting library for progress visualization

**Google Fonts:**
- **Inter** - Display and heading typography
- **DM Sans** - Body text and UI labels
- **JetBrains Mono** - Monospace for metrics and data display

**Development Tools:**
- **Vite Plugins** - Runtime error overlay, Replit cartographer, dev banner
- **ESBuild** - Fast JavaScript bundler for production builds
- **tsx** - TypeScript execution for development server

**Build & Deployment:**
- Development mode runs Vite dev server with HMR
- Production build bundles client with Vite and server with ESBuild
- Static assets served from `dist/public` in production
- ESM module format throughout the codebase