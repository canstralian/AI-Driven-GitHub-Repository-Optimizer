# CLAUDE.MD - AI-Driven GitHub Repository Optimizer

## Project Overview
The AI-Driven GitHub Repository Optimizer is a full-stack web application that leverages AI to analyze, optimize, and provide insights for GitHub repositories. It helps developers improve code quality, documentation, repository structure, and overall maintainability through automated analysis and recommendations.

## Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM
- **UI Components**: Radix UI + Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Forms**: React Hook Form + Zod validation
- **GitHub Integration**: Octokit REST API + GitHub App Authentication
- **Testing**: Jest + React Testing Library + Python pytest

### Architecture Pattern
The project follows a monorepo structure with clear separation:
- **Client**: React SPA in `/client` directory
- **Server**: Express API in `/server` directory
- **Shared**: Common schemas and types in `/shared` directory
- **Tests**: Unit and integration tests in `/tests` directory

## Database Schema

### Tables

#### `github_installations`
Stores GitHub App installation data:
- `id` (serial, primary key)
- `installationId` (integer) - GitHub App installation ID
- `accountName` (text) - GitHub account name
- `installedAt` (timestamp) - Installation timestamp

#### `repositories`
Stores analyzed repository data:
- `id` (serial, primary key)
- `url` (text) - Repository URL
- `name` (text) - Repository name
- `installationId` (integer) - Foreign key to installations
- `lastAnalyzed` (timestamp) - Last analysis timestamp
- `qualityScore` (integer) - Calculated quality score
- `metrics` (jsonb) - Analysis metrics (JSON)
- `recommendations` (jsonb) - AI recommendations (JSON)
- `files` (jsonb) - File structure data (JSON)

## Project Structure

```
/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and helpers
│   │   └── pages/         # Page components
├── server/                # Backend Express application
│   ├── index.ts          # Express app entry point (port 5000)
│   ├── routes.ts         # API route definitions
│   ├── db.ts             # Database connection setup
│   ├── storage.ts        # Database operations layer
│   ├── vite.ts           # Vite dev server setup
│   └── lib/
│       └── github.ts     # GitHub API integration
├── shared/                # Shared code between client/server
│   └── schema.ts         # Database schema & Zod validators
├── tests/                 # Test files
│   ├── conftest.py       # Pytest configuration
│   └── test_storage.py   # Storage layer tests
├── .github/              # GitHub workflows and configs
├── package.json          # Node dependencies & scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build configuration
├── drizzle.config.ts     # Drizzle ORM configuration
└── tailwind.config.ts    # Tailwind CSS configuration
```

## Key Files and Their Purposes

### Server Files

#### `server/index.ts` (server/index.ts:1)
- Main Express application entry point
- Sets up middleware (JSON parsing, logging, error handling)
- Registers API routes
- Configures Vite dev server in development mode
- Serves static files in production
- **IMPORTANT**: Always runs on port 5000

#### `server/routes.ts` (server/routes.ts:1)
- Defines all API endpoints
- Handles GitHub webhook events
- Manages repository analysis and retrieval
- Implements rate limiting for security

#### `server/db.ts` (server/db.ts:1)
- Configures Neon PostgreSQL connection
- Sets up Drizzle ORM instance
- Requires `DATABASE_URL` environment variable

#### `server/storage.ts` (server/storage.ts:1)
- Data access layer for database operations
- Handles CRUD operations for repositories and installations

#### `server/lib/github.ts` (server/lib/github.ts:1)
- GitHub API integration
- Handles GitHub App authentication
- Manages repository data fetching

### Shared Files

#### `shared/schema.ts` (shared/schema.ts:1)
- Drizzle ORM schema definitions
- Zod validation schemas
- TypeScript types for entities

### Configuration Files

#### `package.json` (package.json:1)
- Project dependencies
- Scripts: `dev`, `build`, `start`, `check`, `db:push`, `lint`, `format`, `test`

#### `tsconfig.json` (tsconfig.json:1)
- TypeScript compiler options
- Module resolution configuration

#### `drizzle.config.ts` (drizzle.config.ts:1)
- Database migration configuration
- Schema path definitions

## Development Guidelines

### Code Style
- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier (run `npm run format`)
- **Linting**: ESLint (run `npm run lint`)
- **Pre-commit**: Husky + lint-staged for automatic formatting

### Best Practices
1. **Type Safety**: Always use TypeScript types, avoid `any`
2. **Validation**: Use Zod schemas for runtime validation
3. **Database**: Use Drizzle ORM, never write raw SQL
4. **Error Handling**: Implement proper error boundaries and handling
5. **Security**:
   - Rate limiting is implemented via express-rate-limit
   - Never expose sensitive error details to clients
   - Validate all user inputs
6. **Testing**: Write tests for new features and bug fixes

### Environment Variables
Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string (Neon)
- `GITHUB_APP_ID`: GitHub App ID (for OAuth)
- `GITHUB_PRIVATE_KEY`: GitHub App private key
- `GITHUB_CLIENT_ID`: GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET`: GitHub OAuth client secret
- `NODE_ENV`: Environment (development/production)

## Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production (client + server)
npm start        # Run production server
npm run check    # TypeScript type checking
npm run db:push  # Push database schema changes
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
npm test         # Run Jest tests
```

## Testing

### JavaScript/TypeScript Tests
- Framework: Jest + React Testing Library
- Configuration: `jest.config.js`
- Run: `npm test`

### Python Tests
- Framework: pytest
- Configuration: `tests/conftest.py`
- Test files: `tests/test_*.py`

## API Endpoints

The application exposes several API endpoints (defined in `server/routes.ts`):
- GitHub webhook endpoints for app installation and events
- Repository analysis endpoints
- Repository data retrieval endpoints

## UI Components

The project uses:
- **Radix UI**: Unstyled accessible components
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **Framer Motion**: Animation library

## Common Development Tasks

### Adding a New Feature
1. Define database schema changes in `shared/schema.ts`
2. Run `npm run db:push` to apply schema changes
3. Implement server logic in `server/routes.ts` or new files
4. Add storage layer methods in `server/storage.ts`
5. Create React components in `client/src/components`
6. Add validation schemas using Zod
7. Write tests
8. Lint and format code

### Debugging
- Server logs are output to console with request/response logging
- Error middleware catches and logs all server errors
- React DevTools for frontend debugging
- Database queries can be logged via Drizzle

### Database Migrations
- Schema is defined in `shared/schema.ts`
- Use `npm run db:push` to sync schema with database
- Drizzle Kit handles migrations

## Known Issues and Considerations

1. **Port Configuration**: Server ALWAYS runs on port 5000 (hardcoded)
2. **Database**: Requires Neon PostgreSQL (uses WebSocket connection)
3. **GitHub App**: Requires GitHub App setup for full functionality
4. **Rate Limiting**: Implemented on API endpoints for security

## Resources

- **Drizzle ORM**: https://orm.drizzle.team
- **Radix UI**: https://www.radix-ui.com
- **TanStack Query**: https://tanstack.com/query
- **Octokit**: https://octokit.github.io/rest.js
- **Vite**: https://vitejs.dev

## Getting Help

- Check the README.md for basic setup instructions
- Review existing code for patterns and conventions
- Check package.json for available scripts
- Review test files for usage examples
