import { JobSearchAgentState, JobApplicationApprovalData, JobListing } from '@/types/agent';

// Mock sample job listings
const mockJobs: JobListing[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    remote: true,
    salary_range: {
      min: 120000,
      max: 160000,
      currency: 'USD'
    },
    description: 'We are looking for a Senior Frontend Developer with strong experience in React, TypeScript, and modern web development practices. You will be responsible for building and maintaining complex user interfaces for our enterprise applications.',
    requirementsSummary: 'React, TypeScript, Redux, 5+ years experience, Strong UI/UX skills',
    matchScore: 92,
    matchDetails: {
      roleMatch: 95,
      skillsMatch: 90,
      experienceMatch: 85,
      locationMatch: 100
    },
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    applicationUrl: 'https://example.com/apply/job-1'
  },
  {
    id: 'job-2',
    title: 'React Developer',
    company: 'WebSolutions Ltd.',
    location: 'New York, NY',
    remote: false,
    salary_range: {
      min: 100000,
      max: 130000,
      currency: 'USD'
    },
    description: 'WebSolutions is seeking a skilled React Developer to join our growing team. You will work on building responsive web applications and collaborate with designers and backend developers to deliver high-quality products.',
    requirementsSummary: 'React, JavaScript, CSS, 3+ years experience, Team player',
    matchScore: 87,
    matchDetails: {
      roleMatch: 90,
      skillsMatch: 85,
      experienceMatch: 95,
      locationMatch: 75
    },
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    applicationUrl: 'https://example.com/apply/job-2'
  },
  {
    id: 'job-3',
    title: 'Frontend Engineer',
    company: 'InnovateTech',
    location: 'Austin, TX',
    remote: true,
    salary_range: {
      min: 110000,
      max: 140000,
      currency: 'USD'
    },
    description: 'InnovateTech is looking for a Frontend Engineer to join our product team. You will be building new features for our SaaS platform and ensuring a great user experience across all devices.',
    requirementsSummary: 'JavaScript, React, Next.js, Performance optimization, Agile',
    matchScore: 85,
    matchDetails: {
      roleMatch: 85,
      skillsMatch: 90,
      experienceMatch: 80,
      locationMatch: 80
    },
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    applicationUrl: 'https://example.com/apply/job-3'
  },
  {
    id: 'job-4',
    title: 'UI Developer',
    company: 'Creative Solutions',
    location: 'Chicago, IL',
    remote: true,
    salary_range: {
      min: 90000,
      max: 120000,
      currency: 'USD'
    },
    description: 'Join our team as a UI Developer and help us create beautiful and intuitive user interfaces. You will work closely with designers and implement their designs using modern frontend technologies.',
    requirementsSummary: 'HTML, CSS, JavaScript, Design systems, Attention to detail',
    matchScore: 78,
    matchDetails: {
      roleMatch: 75,
      skillsMatch: 80,
      experienceMatch: 85,
      locationMatch: 70
    },
    postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    applicationUrl: 'https://example.com/apply/job-4'
  },
  {
    id: 'job-5',
    title: 'Full Stack Developer',
    company: 'Tech Innovators',
    location: 'Seattle, WA',
    remote: false,
    salary_range: {
      min: 115000,
      max: 150000,
      currency: 'USD'
    },
    description: 'We are seeking a Full Stack Developer with strong frontend and backend skills. You will be working on our web applications, APIs, and databases to deliver a complete user experience.',
    requirementsSummary: 'JavaScript, React, Node.js, SQL, AWS, Full stack experience',
    matchScore: 72,
    matchDetails: {
      roleMatch: 70,
      skillsMatch: 75,
      experienceMatch: 80,
      locationMatch: 60
    },
    postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    applicationUrl: 'https://example.com/apply/job-5'
  }
];

// Mock job search steps
export const mockJobSearchData = {
  searchSteps: [
    // Step 1: Initial state
    {
      name: 'job_search_agent',
      status: 'thinking',
      completion_percentage: 10,
      current_task: 'Analyzing search criteria',
      thinking: 'Processing search criteria: Role = Frontend Developer, Location = San Francisco, Remote = true',
      searchCriteria: {
        role: 'Frontend Developer',
        location: 'San Francisco',
        skills: ['React', 'TypeScript', 'JavaScript'],
        experience: 'Mid-level',
        remote: true,
        salary: {
          min: 100000,
          max: 150000,
          currency: 'USD'
        }
      }
    } as JobSearchAgentState,
    
    // Step 2: Searching job databases
    {
      name: 'job_search_agent',
      status: 'thinking',
      completion_percentage: 30,
      current_task: 'Searching job databases',
      thinking: 'Searching for jobs matching criteria...\nQuerying multiple job databases...\nMatching against skills and requirements...',
      searchCriteria: {
        role: 'Frontend Developer',
        location: 'San Francisco',
        skills: ['React', 'TypeScript', 'JavaScript'],
        experience: 'Mid-level',
        remote: true,
        salary: {
          min: 100000,
          max: 150000,
          currency: 'USD'
        }
      }
    } as JobSearchAgentState,
    
    // Step 3: Analyzing results
    {
      name: 'job_search_agent',
      status: 'thinking',
      completion_percentage: 60,
      current_task: 'Analyzing search results',
      thinking: 'Found 12 potential matches...\nCalculating match scores based on skills, location, and experience...\nRanking jobs by overall match quality...',
      searchCriteria: {
        role: 'Frontend Developer',
        location: 'San Francisco',
        skills: ['React', 'TypeScript', 'JavaScript'],
        experience: 'Mid-level',
        remote: true,
        salary: {
          min: 100000,
          max: 150000,
          currency: 'USD'
        }
      }
    } as JobSearchAgentState,
    
    // Step 4: Preparing results
    {
      name: 'job_search_agent',
      status: 'thinking',
      completion_percentage: 85,
      current_task: 'Preparing results',
      thinking: 'Filtering top matches...\nGathering detailed information for each position...\nPreparing match analysis for top candidates...',
      searchCriteria: {
        role: 'Frontend Developer',
        location: 'San Francisco',
        skills: ['React', 'TypeScript', 'JavaScript'],
        experience: 'Mid-level',
        remote: true,
        salary: {
          min: 100000,
          max: 150000,
          currency: 'USD'
        }
      },
      results: mockJobs.slice(0, 2) // First two jobs as initial results
    } as JobSearchAgentState,
    
    // Step 5: Complete
    {
      name: 'job_search_agent',
      status: 'complete',
      completion_percentage: 100,
      searchCriteria: {
        role: 'Frontend Developer',
        location: 'San Francisco',
        skills: ['React', 'TypeScript', 'JavaScript'],
        experience: 'Mid-level',
        remote: true,
        salary: {
          min: 100000,
          max: 150000,
          currency: 'USD'
        }
      },
      results: mockJobs, // All jobs in final results
      totalResults: mockJobs.length
    } as JobSearchAgentState,
  ],
  
  // Mock job application approval
  approvalRequest: {
    type: 'job_application',
    job: mockJobs[0], // Using first job (highest match)
    coverLetter: `Dear Hiring Manager,

I am writing to express my interest in the Senior Frontend Developer position at TechCorp Inc. With over 5 years of experience in building responsive web applications using React and modern JavaScript frameworks, I believe I am a strong match for this role.

My experience with React, TypeScript, and Redux aligns perfectly with your requirements. In my current role at WebDev Solutions, I have successfully led the development of complex user interfaces for enterprise applications, improving performance by 40% and reducing bug reports by implementing TypeScript.

I am particularly excited about the opportunity to work on your enterprise applications and contribute to your team's success. I am confident that my technical skills, attention to detail, and collaborative approach would make me a valuable addition to TechCorp.

Thank you for considering my application. I look forward to the possibility of discussing how my background, skills, and experience would be a good match for this position.

Sincerely,
John Doe`,
    resume: `John Doe
Frontend Developer
johndoe@example.com | (555) 123-4567 | linkedin.com/in/johndoe

Summary
Frontend Developer with 5 years of experience building responsive web applications using React and modern JavaScript frameworks. Passionate about creating intuitive user interfaces and optimizing application performance.

Work Experience
Senior Frontend Developer | WebDev Solutions | Jan 2022 - Present
- Developed 5+ React applications with complex UIs, integrating RESTful APIs for data visualization and increasing user engagement by 32%.
- Collaborated with UX designers to implement responsive designs and ensure cross-browser compatibility.
- Refactored legacy codebase to use TypeScript, improving code quality and reducing bugs by 40%.

Frontend Developer | WebSolutions Ltd. | Mar 2020 - Dec 2021
- Built responsive single-page applications using React and Next.js.
- Implemented state management using Context API and Redux.
- Worked with backend developers to design and consume RESTful APIs.

Junior Developer | Digital Creations | Jun 2018 - Feb 2020
- Maintained existing websites and fixed cross-browser compatibility issues.
- Implemented UI components based on design specifications.
- Assisted in migrating legacy applications to modern JavaScript frameworks.

Education
Bachelor of Science in Computer Science, University of Technology
Relevant coursework: Data Structures, Algorithms, Web Development, UI/UX Design

Skills
JavaScript, React, TypeScript, Next.js, Node.js, Redux, Jest, CI/CD, HTML, CSS`,
    applicationDetails: {
      email: 'johndoe@example.com',
      name: 'John Doe',
      phone: '(555) 123-4567',
      additionalQuestions: {
        'Years of React experience': '4+ years',
        'Are you authorized to work in the United States?': 'Yes',
        'When can you start?': 'Two weeks after offer acceptance',
        'Salary expectations': '$135,000 - $150,000 per year'
      }
    }
  } as JobApplicationApprovalData
};
