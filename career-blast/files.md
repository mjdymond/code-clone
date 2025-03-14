Project Organization
resume-optimizer/
├── client/               # Frontend application
│   └── ...
├── server/               # Backend services & functions
│   └── ...
├── shared/               # Shared types and utilities
│   └── ...
└── docs/                 # Documentation
    └── ...

Frontend Application (/client)
client/
├── public/               # Static assets
│   ├── favicon.ico       # Site favicon
│   ├── logo.svg          # Application logo
│   └── robots.txt        # Search engine directives
│
├── src/                  # Source code
│   ├── api/              # API integration services
│   │   ├── auth.ts       # Authentication API calls
│   │   ├── resumes.ts    # Resume management API calls
│   │   ├── jobs.ts       # Job management API calls
│   │   ├── analysis.ts   # Analysis API calls
│   │   ├── rewrite.ts    # Resume rewrite API calls
│   │   └── search.ts     # Job search API calls
│   │
│   ├── components/       # Reusable UI components
│   │   ├── common/       # Shared UI elements
│   │   │   ├── Button.tsx       # Custom button component
│   │   │   ├── Card.tsx         # Card container component
│   │   │   ├── Loader.tsx       # Loading indicator
│   │   │   ├── Modal.tsx        # Modal dialog component
│   │   │   └── Notification.tsx # Notification component
│   │   │
│   │   ├── layout/       # Layout components
│   │   │   ├── Header.tsx       # Application header
│   │   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   │   └── Footer.tsx       # Application footer
│   │   │
│   │   ├── editor/       # Resume editor components
│   │   │   ├── ResumeEditor.tsx # Main editor component
│   │   │   ├── Toolbar.tsx      # Editor toolbar
│   │   │   ├── FormatControls.tsx # Formatting controls
│   │   │   └── SectionControls.tsx # Section management
│   │   │
│   │   ├── job/          # Job description components
│   │   │   ├── JobViewer.tsx    # Job description viewer
│   │   │   ├── CompanyInfo.tsx  # Company information
│   │   │   └── ScrapeForm.tsx   # URL input for scraping
│   │   │
│   │   ├── analysis/     # Analysis components
│   │   │   ├── MatchScore.tsx   # Match score display
│   │   │   ├── KeywordMatch.tsx # Keyword highlighting
│   │   │   └── Recommendations.tsx # Recommendation display
│   │   │
│   │   ├── rewrite/      # Rewrite components
│   │   │   ├── RewriteView.tsx  # Rewrite display
│   │   │   ├── Comparison.tsx   # Before/after comparison
│   │   │   └── SuggestionCard.tsx # Suggestion component
│   │   │
│   │   └── search/       # Job search components
│   │       ├── SearchForm.tsx   # Search input form
│   │       ├── ResultsList.tsx  # Search results display
│   │       └── SavedSearches.tsx # Saved searches management
│   │
│   ├── context/          # React context providers
│   │   ├── AuthContext.tsx      # Authentication context
│   │   ├── ResumeContext.tsx    # Resume management context
│   │   └── UIContext.tsx        # UI state management
│   │
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.ts           # Authentication hook
│   │   ├── useResume.ts         # Resume data hook
│   │   ├── useJobSearch.ts      # Job search hook
│   │   └── useAnalysis.ts       # Analysis data hook
│   │
│   ├── pages/            # Application pages
│   │   ├── auth/               # Authentication pages
│   │   │   ├── Login.tsx       # Login page
│   │   │   ├── Register.tsx    # Registration page
│   │   │   └── ResetPassword.tsx # Password reset
│   │   │
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── Dashboard.tsx   # Main dashboard
│   │   │   ├── ResumeList.tsx  # Resume management
│   │   │   └── JobList.tsx     # Saved jobs
│   │   │
│   │   ├── editor/            # Editor pages
│   │   │   ├── ResumeEditor.tsx # Main editor page
│   │   │   └── Upload.tsx      # Resume upload page
│   │   │
│   │   ├── analysis/          # Analysis pages
│   │   │   ├── AnalysisView.tsx # Analysis results
│   │   │   └── RewriteView.tsx  # Rewrite results
│   │   │
│   │   └── search/            # Search pages
│   │       └── JobSearch.tsx   # Job search page
│   │
│   ├── services/         # Client-side services
│   │   ├── storage.ts          # Local storage handling
│   │   ├── formatting.ts       # Text formatting utilities
│   │   └── analytics.ts        # Client-side analytics
│   │
│   ├── styles/           # CSS and styling
│   │   ├── globals.css         # Global styles
│   │   └── tailwind.css        # Tailwind imports
│   │
│   ├── utils/            # Utility functions
│   │   ├── formatting.ts       # Text formatting utilities
│   │   ├── validation.ts       # Form validation
│   │   └── parsing.ts          # Data parsing utilities
│   │
│   ├── App.tsx           # Main application component
│   ├── index.tsx         # Application entry point
│   └── routes.tsx        # Application routing
│
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── package.json          # Frontend dependencies
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite bundler configuration

Backend Services (/server)
server/
├── supabase/             # Supabase configuration
│   ├── migrations/       # Database migrations
│   │   ├── 001_initial_schema.sql    # Initial schema
│   │   └── 002_indexes.sql           # Database indexes
│   │
│   ├── functions/        # Supabase Edge Functions
│   │   ├── resume-parser/    # Resume parsing function
│   │   │   ├── index.ts      # Function entry point
│   │   │   └── parser.ts     # Document parsing logic
│   │   │
│   │   ├── job-scraper/      # Job scraping function
│   │   │   ├── index.ts      # Function entry point
│   │   │   └── scraper.ts    # Web scraping logic
│   │   │
│   │   ├── resume-analyzer/  # Resume analysis function
│   │   │   ├── index.ts      # Function entry point
│   │   │   └── analyzer.ts   # Analysis logic
│   │   │
│   │   ├── resume-rewriter/  # Resume rewriting function
│   │   │   ├── index.ts      # Function entry point
│   │   │   └── rewriter.ts   # Rewriting logic
│   │   │
│   │   └── job-search/       # Job search function
│   │       ├── index.ts      # Function entry point
│   │       └── search.ts     # Search logic
│   │
│   ├── policies/         # Database access policies
│   │   ├── users.sql         # User table policies
│   │   ├── resumes.sql       # Resume table policies
│   │   ├── jobs.sql          # Job table policies
│   │   ├── analyses.sql      # Analysis table policies
│   │   └── rewrites.sql      # Rewrite table policies
│   │
│   ├── types/            # Generated Supabase types
│   │   └── supabase.ts       # Generated database types
│   │
│   └── seed/             # Database seed data
│       └── demo_data.sql     # Demo data for testing
│
├── lib/                  # Shared server libraries
│   ├── ai/               # AI integration services
│   │   ├── openai.ts         # OpenAI API integration
│   │   ├── prompt-templates.ts # AI prompt templates
│   │   └── response-parser.ts # AI response parsing
│   │
│   ├── document/         # Document processing
│   │   ├── pdf.ts           # PDF handling
│   │   ├── docx.ts          # DOCX handling
│   │   └── html.ts          # HTML conversion
│   │
│   ├── scraping/         # Web scraping utilities
│   │   ├── browser.ts       # Headless browser setup
│   │   ├── selectors.ts     # Common CSS selectors
│   │   └── extraction.ts    # Content extraction
│   │
│   └── utils/            # Server utilities
│       ├── error-handling.ts # Error handling
│       ├── validation.ts     # Input validation
│       └── logging.ts        # Server-side logging
│
├── api/                  # API routes (if needed beyond Supabase)
│   ├── auth/             # Authentication endpoints
│   ├── resumes/          # Resume management endpoints
│   ├── jobs/             # Job management endpoints
│   ├── analysis/         # Analysis endpoints
│   └── search/           # Search endpoints
│
├── config/               # Server configuration
│   ├── environment.ts    # Environment variables
│   └── constants.ts      # Application constants
│
├── package.json          # Backend dependencies
└── tsconfig.json         # TypeScript configuration

Shared Code (/shared)
shared/
├── types/                # Shared TypeScript types
│   ├── user.ts           # User-related types
│   ├── resume.ts         # Resume-related types
│   ├── job.ts            # Job-related types
│   ├── analysis.ts       # Analysis-related types
│   └── api.ts            # API request/response types
│
├── constants/            # Shared constants
│   ├── endpoints.ts      # API endpoints
│   └── enums.ts          # Shared enumerations
│
└── utils/                # Shared utilities
    ├── formatting.ts     # Text formatting utilities
    └── validation.ts     # Shared validation logic

Documentation (/docs)
docs/
├── architecture/         # Architecture documentation
│   ├── overview.md       # System overview
│   ├── database.md       # Database schema
│   └── api.md            # API documentation
│
├── development/          # Development guides
│   ├── setup.md          # Development environment setup
│   ├── workflow.md       # Development workflow
│   └── testing.md        # Testing guidelines
│
├── deployment/           # Deployment documentation
│   ├── staging.md        # Staging environment
│   └── production.md     # Production environment
│
└── user/                 # User documentation
    ├── getting-started.md # Getting started guide
    └── features.md        # Feature documentation