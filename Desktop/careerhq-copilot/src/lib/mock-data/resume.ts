import { ResumeAgentState, ResumeApprovalData } from '@/types/agent';

// Mock resume analysis steps
export const mockResumeData = {
  analysisSteps: [
    // Step 1: Initial state
    {
      name: 'resume_agent',
      status: 'thinking',
      completion_percentage: 10,
      current_task: 'Parsing resume content',
      thinking: 'Analyzing resume structure and identifying sections...',
    } as ResumeAgentState,
    
    // Step 2: Sections identified
    {
      name: 'resume_agent',
      status: 'thinking',
      completion_percentage: 25,
      current_task: 'Identifying sections',
      thinking: 'Found sections: Summary, Work Experience, Education, Skills.\nNow extracting key information from each section...',
    } as ResumeAgentState,
    
    // Step 3: Analyzing content
    {
      name: 'resume_agent',
      status: 'thinking',
      completion_percentage: 40,
      current_task: 'Analyzing content',
      thinking: 'Analyzing work experience: Found 3 positions.\nExtracting accomplishments and responsibilities...\nLooking for quantifiable achievements...',
    } as ResumeAgentState,
    
    // Step 4: Skills analysis
    {
      name: 'resume_agent',
      status: 'thinking',
      completion_percentage: 60,
      current_task: 'Analyzing skills',
      thinking: 'Identified core skills: JavaScript, React, TypeScript, Next.js, Node.js\nComparing with job requirements...',
    } as ResumeAgentState,
    
    // Step 5: Keyword matching
    {
      name: 'resume_agent',
      status: 'thinking',
      completion_percentage: 75,
      current_task: 'Matching keywords',
      thinking: 'Matching resume content against common ATS keywords...\nFound matches for: JavaScript, React, Frontend, UI/UX\nMissing important keywords: CI/CD, Jest, Redux',
      keywordMatches: [
        { keyword: 'JavaScript', found: true, importance: 95, context: 'Skills section' },
        { keyword: 'React', found: true, importance: 90, context: 'Skills and Work Experience' },
        { keyword: 'TypeScript', found: true, importance: 85, context: 'Skills section' },
        { keyword: 'Frontend', found: true, importance: 80, context: 'Job title' },
        { keyword: 'CI/CD', found: false, importance: 75 },
        { keyword: 'Jest', found: false, importance: 70 },
        { keyword: 'Redux', found: false, importance: 65 },
      ],
    } as ResumeAgentState,
    
    // Step 6: Identifying strengths
    {
      name: 'resume_agent',
      status: 'thinking',
      completion_percentage: 85,
      current_task: 'Identifying strengths and weaknesses',
      thinking: 'Analyzing resume for strengths and weaknesses...\nStrengths: Strong technical skills, quantified achievements\nWeaknesses: Some lengthy bullet points, missing some keywords',
      keywordMatches: [
        { keyword: 'JavaScript', found: true, importance: 95, context: 'Skills section' },
        { keyword: 'React', found: true, importance: 90, context: 'Skills and Work Experience' },
        { keyword: 'TypeScript', found: true, importance: 85, context: 'Skills section' },
        { keyword: 'Frontend', found: true, importance: 80, context: 'Job title' },
        { keyword: 'CI/CD', found: false, importance: 75 },
        { keyword: 'Jest', found: false, importance: 70 },
        { keyword: 'Redux', found: false, importance: 65 },
      ],
      strengths: [
        { text: 'Strong technical background with modern frontend technologies', confidence: 90, section: 'Skills' },
        { text: 'Quantified achievements in previous roles', confidence: 85, section: 'Work Experience' },
        { text: 'Clear progression of responsibilities', confidence: 80, section: 'Work Experience' },
      ],
      weaknesses: [
        { text: 'Some bullet points are too lengthy', confidence: 75, section: 'Work Experience', suggestion: 'Limit bullet points to 1-2 lines for better readability' },
        { text: 'Missing important keywords for the target role', confidence: 85, section: 'Skills', suggestion: 'Add missing keywords like CI/CD, Jest, and Redux if you have experience with them' },
        { text: 'Education section lacks detail', confidence: 70, section: 'Education', suggestion: 'Add relevant coursework or projects if recent graduate' },
      ],
    } as ResumeAgentState,
    
    // Step 7: Completion
    {
      name: 'resume_agent',
      status: 'thinking',
      completion_percentage: 95,
      current_task: 'Finalizing analysis',
      thinking: 'Calculating ATS compatibility score...\nGenerating improvement suggestions...\nPreparing final report...',
      keywordMatches: [
        { keyword: 'JavaScript', found: true, importance: 95, context: 'Skills section' },
        { keyword: 'React', found: true, importance: 90, context: 'Skills and Work Experience' },
        { keyword: 'TypeScript', found: true, importance: 85, context: 'Skills section' },
        { keyword: 'Frontend', found: true, importance: 80, context: 'Job title' },
        { keyword: 'CI/CD', found: false, importance: 75 },
        { keyword: 'Jest', found: false, importance: 70 },
        { keyword: 'Redux', found: false, importance: 65 },
      ],
      strengths: [
        { text: 'Strong technical background with modern frontend technologies', confidence: 90, section: 'Skills' },
        { text: 'Quantified achievements in previous roles', confidence: 85, section: 'Work Experience' },
        { text: 'Clear progression of responsibilities', confidence: 80, section: 'Work Experience' },
      ],
      weaknesses: [
        { text: 'Some bullet points are too lengthy', confidence: 75, section: 'Work Experience', suggestion: 'Limit bullet points to 1-2 lines for better readability' },
        { text: 'Missing important keywords for the target role', confidence: 85, section: 'Skills', suggestion: 'Add missing keywords like CI/CD, Jest, and Redux if you have experience with them' },
        { text: 'Education section lacks detail', confidence: 70, section: 'Education', suggestion: 'Add relevant coursework or projects if recent graduate' },
      ],
      atsScore: 78,
      improvements: [
        {
          section: 'Work Experience',
          originalText: 'Developed and maintained multiple React-based web applications with complex user interfaces and integrated with RESTful APIs to provide dynamic data visualization and interactive user experiences.',
          improvedText: 'Developed 5+ React applications with complex UIs, integrating RESTful APIs for data visualization and increasing user engagement by 32%.',
          reason: 'Original bullet point is too lengthy and lacks specific metrics',
          impact: 'high'
        },
        {
          section: 'Skills',
          originalText: 'JavaScript, React, TypeScript, Next.js, Node.js, HTML, CSS',
          improvedText: 'JavaScript, React, TypeScript, Next.js, Node.js, Redux, Jest, CI/CD, HTML, CSS',
          reason: 'Missing important keywords that are often screened by ATS',
          impact: 'high'
        },
        {
          section: 'Education',
          originalText: 'Bachelor of Science in Computer Science, University of Technology',
          improvedText: 'Bachelor of Science in Computer Science, University of Technology\nRelevant coursework: Data Structures, Algorithms, Web Development, UI/UX Design',
          reason: 'Education section lacks details about relevant coursework',
          impact: 'medium'
        }
      ]
    } as ResumeAgentState,
    
    // Step 8: Complete state
    {
      name: 'resume_agent',
      status: 'complete',
      completion_percentage: 100,
      keywordMatches: [
        { keyword: 'JavaScript', found: true, importance: 95, context: 'Skills section' },
        { keyword: 'React', found: true, importance: 90, context: 'Skills and Work Experience' },
        { keyword: 'TypeScript', found: true, importance: 85, context: 'Skills section' },
        { keyword: 'Frontend', found: true, importance: 80, context: 'Job title' },
        { keyword: 'CI/CD', found: false, importance: 75 },
        { keyword: 'Jest', found: false, importance: 70 },
        { keyword: 'Redux', found: false, importance: 65 },
      ],
      strengths: [
        { text: 'Strong technical background with modern frontend technologies', confidence: 90, section: 'Skills' },
        { text: 'Quantified achievements in previous roles', confidence: 85, section: 'Work Experience' },
        { text: 'Clear progression of responsibilities', confidence: 80, section: 'Work Experience' },
      ],
      weaknesses: [
        { text: 'Some bullet points are too lengthy', confidence: 75, section: 'Work Experience', suggestion: 'Limit bullet points to 1-2 lines for better readability' },
        { text: 'Missing important keywords for the target role', confidence: 85, section: 'Skills', suggestion: 'Add missing keywords like CI/CD, Jest, and Redux if you have experience with them' },
        { text: 'Education section lacks detail', confidence: 70, section: 'Education', suggestion: 'Add relevant coursework or projects if recent graduate' },
      ],
      atsScore: 78,
      improvements: [
        {
          section: 'Work Experience',
          originalText: 'Developed and maintained multiple React-based web applications with complex user interfaces and integrated with RESTful APIs to provide dynamic data visualization and interactive user experiences.',
          improvedText: 'Developed 5+ React applications with complex UIs, integrating RESTful APIs for data visualization and increasing user engagement by 32%.',
          reason: 'Original bullet point is too lengthy and lacks specific metrics',
          impact: 'high'
        },
        {
          section: 'Skills',
          originalText: 'JavaScript, React, TypeScript, Next.js, Node.js, HTML, CSS',
          improvedText: 'JavaScript, React, TypeScript, Next.js, Node.js, Redux, Jest, CI/CD, HTML, CSS',
          reason: 'Missing important keywords that are often screened by ATS',
          impact: 'high'
        },
        {
          section: 'Education',
          originalText: 'Bachelor of Science in Computer Science, University of Technology',
          improvedText: 'Bachelor of Science in Computer Science, University of Technology\nRelevant coursework: Data Structures, Algorithms, Web Development, UI/UX Design',
          reason: 'Education section lacks details about relevant coursework',
          impact: 'medium'
        }
      ],
      waiting_for_approval: true,
      approval_type: 'resume_improvements'
    } as ResumeAgentState,
  ],
  
  // Mock approval request
  approvalRequest: {
    type: 'resume_improvements',
    improvements: [
      {
        section: 'Work Experience',
        originalText: 'Developed and maintained multiple React-based web applications with complex user interfaces and integrated with RESTful APIs to provide dynamic data visualization and interactive user experiences.',
        improvedText: 'Developed 5+ React applications with complex UIs, integrating RESTful APIs for data visualization and increasing user engagement by 32%.',
        reason: 'Original bullet point is too lengthy and lacks specific metrics',
        impact: 'high'
      },
      {
        section: 'Skills',
        originalText: 'JavaScript, React, TypeScript, Next.js, Node.js, HTML, CSS',
        improvedText: 'JavaScript, React, TypeScript, Next.js, Node.js, Redux, Jest, CI/CD, HTML, CSS',
        reason: 'Missing important keywords that are often screened by ATS',
        impact: 'high'
      },
      {
        section: 'Education',
        originalText: 'Bachelor of Science in Computer Science, University of Technology',
        improvedText: 'Bachelor of Science in Computer Science, University of Technology\nRelevant coursework: Data Structures, Algorithms, Web Development, UI/UX Design',
        reason: 'Education section lacks details about relevant coursework',
        impact: 'medium'
      }
    ],
    originalResume: `John Doe
Frontend Developer
johndoe@example.com | (555) 123-4567 | linkedin.com/in/johndoe

Summary
Frontend Developer with 4 years of experience building responsive web applications using React and modern JavaScript frameworks. Passionate about creating intuitive user interfaces and optimizing application performance.

Work Experience
Senior Frontend Developer | TechCorp Inc. | Jan 2023 - Present
- Developed and maintained multiple React-based web applications with complex user interfaces and integrated with RESTful APIs to provide dynamic data visualization and interactive user experiences.
- Collaborated with UX designers to implement responsive designs and ensure cross-browser compatibility.
- Refactored legacy codebase to use TypeScript, improving code quality and reducing bugs by 40%.

Frontend Developer | WebSolutions Ltd. | Mar 2021 - Dec 2022
- Built responsive single-page applications using React and Next.js.
- Implemented state management using Context API and Redux.
- Worked with backend developers to design and consume RESTful APIs.

Junior Developer | Digital Creations | Jun 2019 - Feb 2021
- Maintained existing websites and fixed cross-browser compatibility issues.
- Implemented UI components based on design specifications.
- Assisted in migrating legacy applications to modern JavaScript frameworks.

Education
Bachelor of Science in Computer Science, University of Technology

Skills
JavaScript, React, TypeScript, Next.js, Node.js, HTML, CSS`,
    improvedResume: `John Doe
Frontend Developer
johndoe@example.com | (555) 123-4567 | linkedin.com/in/johndoe

Summary
Frontend Developer with 4 years of experience building responsive web applications using React and modern JavaScript frameworks. Passionate about creating intuitive user interfaces and optimizing application performance.

Work Experience
Senior Frontend Developer | TechCorp Inc. | Jan 2023 - Present
- Developed 5+ React applications with complex UIs, integrating RESTful APIs for data visualization and increasing user engagement by 32%.
- Collaborated with UX designers to implement responsive designs and ensure cross-browser compatibility.
- Refactored legacy codebase to use TypeScript, improving code quality and reducing bugs by 40%.

Frontend Developer | WebSolutions Ltd. | Mar 2021 - Dec 2022
- Built responsive single-page applications using React and Next.js.
- Implemented state management using Context API and Redux.
- Worked with backend developers to design and consume RESTful APIs.

Junior Developer | Digital Creations | Jun 2019 - Feb 2021
- Maintained existing websites and fixed cross-browser compatibility issues.
- Implemented UI components based on design specifications.
- Assisted in migrating legacy applications to modern JavaScript frameworks.

Education
Bachelor of Science in Computer Science, University of Technology
Relevant coursework: Data Structures, Algorithms, Web Development, UI/UX Design

Skills
JavaScript, React, TypeScript, Next.js, Node.js, Redux, Jest, CI/CD, HTML, CSS`
  } as ResumeApprovalData
};
