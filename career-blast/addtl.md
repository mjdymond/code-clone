# Comprehensive Development Instructions for ResumeOptimizer MVP

## Technology Stack Specifications

### Frontend Framework

**React Configuration:**
- Use React 18.2+ with React DOM
- Implement TypeScript with strict mode enabled
- Set up Vite as the build tool for faster development experience
- Configure ESLint with Airbnb rules and Prettier for code formatting

**Component Structure:**
```bash
# Component organization pattern
components/
├── functional/   # Pure functional components
├── container/    # Components with state logic
└── hoc/          # Higher-order components for cross-cutting concerns
```

**Styling Approach:**
- Implement TailwindCSS for utility-first styling
- Create a consistent design system with custom theme extension
- Use CSS modules for component-specific styling when needed
- Implement responsive design with mobile-first approach (min-width: 320px)

### UI Component Library

**Component Library:**
- Use Shadcn UI for base components (built on Radix UI primitives)
- Implement custom theme with ResumeOptimizer brand colors
- Create a component storybook for documentation and testing

**Design System Tokens:**
```javascript
// tailwind.config.js color palette
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    // ... rest of the blue spectrum
    900: '#0c4a6e'
  },
  secondary: {
    // Green spectrum for success states
  },
  neutral: {
    // Gray spectrum for text and backgrounds
  },
  danger: {
    // Red spectrum for errors
  },
  // Additional accent colors
}
```

**Typography:**
- Use Inter as the primary font family
- Implement a typographic scale with appropriate line heights
- Create text components for consistent heading styles

### State Management

**Global State:**
- Implement React Context for domain-specific global state
- Create separate contexts for auth, resume, job, analysis, and UI states
- Use the reducer pattern for complex state logic

**Local State:**
- Use useState and useReducer hooks for component-specific state
- Implement form state with React Hook Form for validation and error handling

**Persistence:**
- Leverage Supabase for server-side state persistence
- Implement local storage for draft saving and offline capabilities
- Use session storage for temporary user preferences

### Authentication

**Auth Configuration:**
- Implement email/password authentication with Supabase Auth
- Add Google OAuth as an alternative sign-in method
- Implement email verification process
- Create protected routes with authentication guards
- Implement password reset functionality

**Session Management:**
- Use JWT tokens stored in secure HTTP-only cookies
- Implement token refresh mechanism
- Add session timeout after 7 days of inactivity
- Create remember me functionality

## Backend Requirements

### Supabase Configuration

**Project Setup:**
- Create a new Supabase project with the proper region (US or EU based on target audience)
- Implement database schema with appropriate indices for performance
- Set up Row Level Security (RLS) policies for all tables
- Enable Supabase Auth with email and OAuth providers

**RLS Policies Example:**
```sql
-- Resume table RLS
CREATE POLICY "Users can view their own resumes"
ON resumes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes"
ON resumes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Similar policies for UPDATE and DELETE
```

**Database Optimization:**
- Create appropriate indexes on frequently queried columns
- Implement database functions for complex operations
- Set up database triggers for maintaining data integrity

### AI Integration

**Model Selection:**
- Primary: OpenAI GPT-4o for resume analysis and rewriting
- Fallback: Anthropic Claude 3 Opus for situations requiring deeper context

**API Integration:**
- Implement a service layer to abstract AI provider details
- Create retry mechanisms with exponential backoff
- Implement prompt template management system
- Add response caching for common analysis patterns

**Prompt Templates:**
- Design system-specific templates for analysis, rewrite, and comparison
- Implement few-shot learning examples in templates
- Create fallback templates for simpler models

**Example Analysis Prompt Structure:**
```javascript
const analysisPrompt = `
You are an expert ATS system and resume optimizer.

RESUME: ${resumeText}

JOB DESCRIPTION: ${jobDescription}

Task: Analyze this resume against the job description and provide:
1. Match score (0-100)
2. Keyword analysis (matched and missing keywords)
3. Skills gap analysis
4. Specific recommendations for improvement

Format your response in JSON as follows:
{
  "matchScore": number,
  "keywordMatches": { "matched": string[], "missing": string[] },
  "skillGaps": string[],
  "recommendations": string[]
}`;
```

### Document Processing

**Library Selection:**
- PDF Parsing: pdf.js for client-side preview, pdf-parse for server-side extraction
- DOCX Parsing: docx-parser for structure extraction
- HTML Conversion: html-to-text for plain text extraction

**Format Support:**
- PDF: Full support with formatting preservation
- DOCX: Full support with formatting preservation
- Plain Text: Basic support with section detection
- Rich Text: Support through HTML conversion

**Formatting Preservation:**
- Implement custom parsers to maintain document structure
- Store original formatting metadata alongside content
- Create a unified document model for different formats

**Implementation Example:**
```typescript
// Document parsing service
const parseDocument = async (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return parsePDF(file);
    case 'docx':
      return parseDOCX(file);
    case 'txt':
      return parsePlainText(file);
    default:
      throw new Error(`Unsupported file format: ${extension}`);
  }
};
```

### Web Scraping

**Technology Selection:**
- Server-side: Puppeteer for headless browser automation
- Edge Functions: Cheerio for lightweight HTML parsing

**Target Job Boards:**
- Primary: LinkedIn, Indeed, Glassdoor
- Secondary: ZipRecruiter, Monster, Company career pages

**Scraping Strategy:**
- Implement site-specific parsers for major job boards
- Create a general-purpose parser for unknown sites
- Add intelligent fallbacks when structure detection fails

**Rate Limiting & Protection:**
- Implement request throttling with configurable delays
- Add proxy rotation for high-volume scraping
- Create browser fingerprint randomization
- Implement CAPTCHA detection with manual fallback notification

**Implementation Example:**
```typescript
// Job scraper service
const scrapeJobListing = async (url: string) => {
  // Detect job board from URL
  const jobBoard = detectJobBoard(url);
  
  // Select appropriate scraper
  const scraper = getScraperForJobBoard(jobBoard);
  
  // Handle rate limiting
  await throttleRequest(jobBoard);
  
  try {
    // Perform scraping
    const jobData = await scraper.scrape(url);
    return processJobData(jobData);
  } catch (error) {
    // Implement fallback strategy
    return fallbackScraper.scrape(url);
  }
};
```

## Testing Requirements

### Testing Framework

**Unit Testing:**
- Use Vitest for component and utility testing
- Implement Jest for server-side function testing
- Create mock services for external dependencies

**Integration Testing:**
- Use React Testing Library for component integration
- Implement Supertest for API endpoint testing
- Create test database with seeded test data

**End-to-End Testing:**
- Set up Cypress for critical user flows
- Implement test recording for debugging
- Create realistic test fixtures

**Testing Directory Structure:**
```bash
__tests__/
├── unit/              # Unit tests
├── integration/       # Integration tests
├── e2e/               # End-to-end tests
└── fixtures/          # Test data and mocks
```

### Test Coverage Requirements

**Critical Paths:**
- User authentication flow: 100% coverage
- Resume upload and parsing: 90% coverage
- Job scraping functionality: 90% coverage
- Analysis and rewrite core logic: 85% coverage

**Overall Coverage Targets:**
- Unit tests: Minimum 80% coverage
- Integration tests: Key user flows covered
- E2E tests: Core user journeys covered

**Test Implementation Example:**
```typescript
// Unit test for resume parser
describe('Resume Parser', () => {
  test('should correctly parse PDF resume', async () => {
    // Test setup with fixture
    const pdfFile = new File([pdfBuffer], 'resume.pdf', { type: 'application/pdf' });
    
    // Execute parser
    const result = await parsePDF(pdfFile);
    
    // Assertions
    expect(result).toHaveProperty('sections');
    expect(result.sections).toContainEqual(expect.objectContaining({
      type: 'education',
      content: expect.any(String)
    }));
  });
  
  // Additional test cases...
});
```

## Deployment Considerations

### Environment Configuration

**Environment Setup:**
- Development: Local environment with Supabase local instance
- Staging: Vercel preview deployments with staging Supabase project
- Production: Vercel production deployment with production Supabase

**Environment Variables:**
- Create .env.local for local development
- Configure Vercel environment variables for deployment
- Implement environment-specific configurations

**Environment Variable Structure:**
```bash
# Core configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# API keys
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Feature flags
ENABLE_JOB_SEARCH=
ENABLE_PREMIUM_FEATURES=

# Performance settings
MAX_UPLOAD_SIZE_MB=
AI_TIMEOUT_MS=
```

### CI/CD Requirements

**GitHub Actions Workflow:**
- Set up automated testing on pull requests
- Implement linting and type checking
- Configure Vercel preview deployments
- Implement production deployment protection

**Deployment Process:**
- Implement automated migrations for database changes
- Configure staged rollouts for critical updates
- Create rollback procedures for emergency situations

**Example GitHub Actions Workflow:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, development]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
        
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Monitoring and Analytics

**Error Tracking:**
- Implement Sentry for error monitoring
- Create custom error boundaries for React components
- Set up error alerting for critical issues

**Analytics Implementation:**
- Use Plausible Analytics for privacy-focused usage tracking
- Implement custom event tracking for key user actions
- Create conversion funnels for core user flows

**Performance Monitoring:**
- Implement Web Vitals tracking
- Set up Supabase query performance monitoring
- Create custom performance metrics for AI operations

## MVP Scope Boundaries

### Feature Limitations

**Mock vs. Full Implementation:**
- Mock: Job application tracking interface (UI only)
- Mock: Premium subscription flows
- Full: Resume parsing and analysis
- Full: Job description scraping
- Full: Resume optimization suggestions

**Feature Flags:**
- Implement feature flag system for controlled rollout
- Create admin interface for flag management
- Define flag-dependent routes and components

**Feature Flag Implementation:**
```typescript
// Feature flag hook
const useFeatureFlag = (flagName: string) => {
  const [isEnabled, setIsEnabled] = useState(false);
  
  useEffect(() => {
    const checkFlag = async () => {
      // Fetch from Supabase or config
      const flags = await getFeatureFlags();
      setIsEnabled(flags[flagName] || false);
    };
    
    checkFlag();
  }, [flagName]);
  
  return isEnabled;
};

// Usage
const JobSearchFeature = () => {
  const isJobSearchEnabled = useFeatureFlag('enableJobSearch');
  
  if (!isJobSearchEnabled) {
    return <ComingSoonBanner feature="Job Search" />;
  }
  
  return <JobSearchImplementation />;
};
```

### Performance Expectations

**Document Processing:**
- Maximum file size: 10MB
- Processing time: < 3 seconds for standard documents
- Support for documents up to 20 pages

**AI Operations:**
- Analysis response time: < 15 seconds
- Rewrite response time: < 30 seconds
- Graceful degradation for complex documents

**Response Time Requirements:**
- Page load: < 2 seconds
- UI interactions: < 100ms
- Form submissions: < 1 second
- Search operations: < 3 seconds

### Error Handling

**Critical Error Paths:**
- Document upload failures: Provide specific format/size guidance
- Parsing errors: Offer alternative upload formats
- Scraping failures: Provide manual entry fallback
- AI timeouts: Implement retry with simpler analysis

**User Feedback:**
- Implement toast notifications for transient messages
- Create modal dialogs for blocking errors
- Add inline validation with specific error guidance
- Provide progress indicators for long-running operations

**Error Handling Example:**
```typescript
// Resume upload error handling
const handleResumeUpload = async (file: File) => {
  setUploadStatus('uploading');
  
  try {
    // Validate file
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }
    
    // Process file
    const parsedResume = await parseResume(file);
    setResume(parsedResume);
    setUploadStatus('success');
    
  } catch (error) {
    // Handle specific errors
    if (error.message.includes('format')) {
      setUploadStatus('format_error');
      showToast('Unsupported file format. Please upload PDF or DOCX files.');
    } else if (error.message.includes('parse')) {
      setUploadStatus('parse_error');
      showModal({
        title: 'Unable to read resume',
        message: 'We had trouble reading your resume. Try uploading a different format or use our manual editor.',
        actions: [
          { label: 'Try Again', action: resetUpload },
          { label: 'Use Manual Editor', action: openEditor }
        ]
      });
    } else {
      // Generic error
      setUploadStatus('error');
      showToast('An error occurred. Please try again.');
      logError(error);
    }
  }
};
```

### Mobile Responsiveness

**Responsive Approach:**
- Implement mobile-first design methodology
- Create responsive layouts with Tailwind breakpoints
- Design simplified mobile experiences for complex features

**Screen Size Support:**
- Mobile: 320px minimum width
- Tablet: 768px minimum width
- Desktop: 1024px minimum width
- Large desktop: 1440px minimum width

**Feature Adaptation:**
- Simplify document editor for mobile view
- Adapt analysis display for smaller screens
- Implement touch-friendly controls for mobile users

## Additional Implementation Notes

### Accessibility Requirements

- Implement ARIA labels for interactive elements
- Ensure keyboard navigation throughout the application
- Maintain color contrast ratios for text readability
- Support screen readers with semantic HTML

### Internationalization

- Structure application for future multilingual support
- Implement locale-aware date and number formatting
- Create a translation framework for future language expansion

### Security Considerations

- Implement Content Security Policy
- Add rate limiting for authentication attempts
- Create secure file upload validation
- Implement XSS protection for user-generated content

### Performance Optimization

- Implement code splitting for route-based chunks
- Configure proper caching headers for static assets
- Utilize image optimization for uploaded content
- Implement progressive loading for large documents

By following these comprehensive instructions, your development team should have a clear understanding of the technical requirements and implementation details needed to build a successful MVP for ResumeOptimizer.