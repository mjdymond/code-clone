import { AgentState, ResumeAgentState, JobSearchAgentState, ApprovalData, TaskRegistry } from '@/types/agent';

/**
 * Utility to test complete workflows in the application
 * This helps verify that state flows correctly through the agent process
 */
export class WorkflowTester {
  private eventHandlers: Record<string, ((data: any) => void)[]> = {
    'agent_update': [],
    'task_update': [],
    'approval_request': [],
    'connection': [],
    'error': []
  };
  
  private agentStates: Record<string, AgentState> = {};
  private taskRegistry: TaskRegistry = { tasks: [], overall_completion: 0 };
  private pendingApproval: ApprovalData | null = null;
  private isConnected = false;
  
  private eventLog: {
    timestamp: Date;
    type: string;
    data: any;
  }[] = [];

  /**
   * Register a handler for specific event types
   */
  public on<T>(eventType: string, handler: (data: T) => void): WorkflowTester {
    if (!this.eventHandlers[eventType]) {
      this.eventHandlers[eventType] = [];
    }
    
    this.eventHandlers[eventType].push(handler as any);
    return this;
  }
  
  /**
   * Emit an event to all registered handlers
   */
  private emit(eventType: string, data: any): void {
    const event = {
      timestamp: new Date(),
      type: eventType,
      data
    };
    
    this.eventLog.push(event);
    
    // Update internal state
    if (eventType === 'agent_update') {
      const agentState = data as AgentState;
      this.agentStates[agentState.name] = agentState;
    } else if (eventType === 'task_update') {
      this.taskRegistry = data as TaskRegistry;
    } else if (eventType === 'approval_request') {
      this.pendingApproval = data as ApprovalData;
    } else if (eventType === 'connection') {
      this.isConnected = data.status === 'connected';
    }
    
    // Call handlers
    if (this.eventHandlers[eventType]) {
      this.eventHandlers[eventType].forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in ${eventType} handler:`, error);
        }
      });
    }
  }
  
  /**
   * Start a resume analysis workflow test
   */
  public startResumeWorkflow(resume: string, jobDescription?: string): void {
    this.emit('connection', { status: 'connected' });
    
    // Initial agent state
    const initialState: ResumeAgentState = {
      name: 'resume_agent',
      status: 'idle',
      completion_percentage: 0
    };
    
    this.emit('agent_update', initialState);
    
    // Initial task registry
    const initialTaskRegistry: TaskRegistry = {
      tasks: [
        {
          id: 'task-1',
          name: 'Parse Resume',
          status: 'pending',
          assigned_to: 'resume_agent',
          completion_percentage: 0,
          created_at: new Date().toISOString(),
        },
        {
          id: 'task-2',
          name: 'Analyze Content',
          status: 'pending',
          assigned_to: 'resume_agent',
          depends_on: ['task-1'],
          completion_percentage: 0,
          created_at: new Date().toISOString(),
        },
        {
          id: 'task-3',
          name: 'Generate Improvements',
          status: 'pending',
          assigned_to: 'resume_agent',
          depends_on: ['task-2'],
          completion_percentage: 0,
          created_at: new Date().toISOString(),
        }
      ],
      overall_completion: 0
    };
    
    this.emit('task_update', initialTaskRegistry);
    
    // Simulate the resume analysis workflow
    this.simulateResumeWorkflow(resume, jobDescription);
  }
  
  /**
   * Start a job search workflow test
   */
  public startJobSearchWorkflow(criteria: any): void {
    this.emit('connection', { status: 'connected' });
    
    // Initial agent state
    const initialState: JobSearchAgentState = {
      name: 'job_search_agent',
      status: 'idle',
      completion_percentage: 0
    };
    
    this.emit('agent_update', initialState);
    
    // Initial task registry
    const initialTaskRegistry: TaskRegistry = {
      tasks: [
        {
          id: 'task-1',
          name: 'Process Search Criteria',
          status: 'pending',
          assigned_to: 'job_search_agent',
          completion_percentage: 0,
          created_at: new Date().toISOString(),
        },
        {
          id: 'task-2',
          name: 'Search Jobs Database',
          status: 'pending',
          assigned_to: 'job_search_agent',
          depends_on: ['task-1'],
          completion_percentage: 0,
          created_at: new Date().toISOString(),
        },
        {
          id: 'task-3',
          name: 'Rank Results',
          status: 'pending',
          assigned_to: 'job_search_agent',
          depends_on: ['task-2'],
          completion_percentage: 0,
          created_at: new Date().toISOString(),
        }
      ],
      overall_completion: 0
    };
    
    this.emit('task_update', initialTaskRegistry);
    
    // Simulate the job search workflow
    this.simulateJobSearchWorkflow(criteria);
  }
  
  /**
   * Simulate the resume analysis workflow with realistic timing
   */
  private simulateResumeWorkflow(resume: string, jobDescription?: string): void {
    // Task 1: Parse Resume
    setTimeout(() => {
      // Update task status
      const tasks = [...this.taskRegistry.tasks];
      tasks[0] = { ...tasks[0], status: 'in_progress', completion_percentage: 20 };
      this.emit('task_update', { ...this.taskRegistry, tasks, overall_completion: 5 });
      
      // Update agent state
      this.emit('agent_update', {
        ...this.agentStates['resume_agent'],
        status: 'thinking',
        current_task: 'Parsing resume content',
        completion_percentage: 10,
        thinking: 'Parsing the resume document...\nExtracting sections...\nIdentifying key components...'
      });
    }, 500);
    
    setTimeout(() => {
      // Update task status
      const tasks = [...this.taskRegistry.tasks];
      tasks[0] = { ...tasks[0], status: 'completed', completion_percentage: 100, completed_at: new Date().toISOString() };
      tasks[1] = { ...tasks[1], status: 'in_progress', completion_percentage: 10 };
      this.emit('task_update', { ...this.taskRegistry, tasks, overall_completion: 33 });
      
      // Update agent state
      this.emit('agent_update', {
        ...this.agentStates['resume_agent'],
        status: 'thinking',
        current_task: 'Analyzing resume content',
        completion_percentage: 35,
        thinking: 'Analyzing resume sections...\nIdentifying strengths and weaknesses...\nChecking keyword matches...'
      });
    }, 2000);
    
    setTimeout(() => {
      // Update agent state with strengths and weaknesses
      this.emit('agent_update', {
        ...this.agentStates['resume_agent'],
        status: 'thinking',
        current_task: 'Analyzing resume content',
        completion_percentage: 50,
        thinking: 'Analyzing resume sections...\nIdentifying strengths and weaknesses...\nChecking keyword matches...\nCalculating ATS compatibility score...',
        strengths: [
          { text: 'Strong technical skills section with relevant technologies', section: 'Skills' },
          { text: 'Clear employment history with quantifiable achievements', section: 'Experience' },
        ],
        weaknesses: [
          { text: 'Summary section is too generic', section: 'Summary', suggestion: 'Add specific achievements and skills' },
          { text: 'Missing keywords related to leadership', section: 'Experience', suggestion: 'Incorporate leadership terms' },
        ],
        keywordMatches: [
          { keyword: 'React', found: true, count: 3 },
          { keyword: 'TypeScript', found: true, count: 2 },
          { keyword: 'leadership', found: false, count: 0 },
        ]
      });
      
      // Update task status
      const tasks = [...this.taskRegistry.tasks];
      tasks[1] = { ...tasks[1], status: 'completed', completion_percentage: 100, completed_at: new Date().toISOString() };
      tasks[2] = { ...tasks[2], status: 'in_progress', completion_percentage: 30 };
      this.emit('task_update', { ...this.taskRegistry, tasks, overall_completion: 66 });
    }, 4000);
    
    setTimeout(() => {
      // Update agent state with ATS score
      this.emit('agent_update', {
        ...this.agentStates['resume_agent'],
        status: 'thinking',
        current_task: 'Generating improvements',
        completion_percentage: 75,
        thinking: 'Analyzing ATS compatibility...\nGenerating targeted improvements...\nPrioritizing suggestions by impact...',
        atsScore: 68,
      });
    }, 5000);
    
    setTimeout(() => {
      // Final agent state before approval
      const finalState = {
        ...this.agentStates['resume_agent'],
        status: 'waiting',
        waiting_for_approval: true,
        approval_type: 'resume_improvements',
        current_task: 'Waiting for approval',
        completion_percentage: 90,
        thinking: '',
        results: {
          improvements: [
            { id: 'imp-1', section: 'Summary', original: 'Experienced software developer with a passion for creating great applications.', improved: 'Senior React TypeScript developer with 5+ years experience delivering high-performance web applications that reduced load times by 40% and increased user engagement by 25%.', impact: 'high' },
            { id: 'imp-2', section: 'Experience', original: 'Led development team on e-commerce project.', improved: 'Led cross-functional team of 6 developers in rebuilding the company\'s e-commerce platform, resulting in 35% increase in conversion and $2.3M additional annual revenue.', impact: 'high' },
            { id: 'imp-3', section: 'Skills', original: 'React, JavaScript, CSS', improved: 'React, TypeScript, Next.js, Redux, CSS-in-JS, Performance Optimization, CI/CD, Jest, Testing Library', impact: 'medium' },
          ],
          originalResume: resume,
          improvedResume: resume.replace('Experienced software developer', 'Senior React TypeScript developer'),
        }
      };
      
      this.emit('agent_update', finalState);
      
      // Update task status
      const tasks = [...this.taskRegistry.tasks];
      tasks[2] = { ...tasks[2], status: 'completed', completion_percentage: 100, completed_at: new Date().toISOString() };
      this.emit('task_update', { ...this.taskRegistry, tasks, overall_completion: 100 });
      
      // Send approval request
      this.emit('approval_request', {
        type: 'resume_improvements',
        improvements: finalState.results.improvements,
        originalResume: finalState.results.originalResume,
        improvedResume: finalState.results.improvedResume,
      });
    }, 6000);
  }
  
  /**
   * Simulate the job search workflow with realistic timing
   */
  private simulateJobSearchWorkflow(criteria: any): void {
    // Implementation similar to resume workflow but with job search steps
    // Abbreviated for brevity but would include:
    // - Processing search criteria
    // - Searching jobs database
    // - Ranking and returning results
    // - Requesting approval for job application
    setTimeout(() => {
      // Update task status
      const tasks = [...this.taskRegistry.tasks];
      tasks[0] = { ...tasks[0], status: 'in_progress', completion_percentage: 50 };
      this.emit('task_update', { ...this.taskRegistry, tasks, overall_completion: 10 });
      
      // Update agent state
      this.emit('agent_update', {
        ...this.agentStates['job_search_agent'],
        status: 'thinking',
        current_task: 'Processing search criteria',
        completion_percentage: 20,
        thinking: 'Analyzing search criteria...\nExtracting key requirements...\nIdentifying location preferences...'
      });
    }, 500);
    
    // Additional steps would follow...
  }
  
  /**
   * Get the current event log for debugging
   */
  public getEventLog(): any[] {
    return [...this.eventLog];
  }
  
  /**
   * Get the current state for a specific agent
   */
  public getAgentState(agentName: string): AgentState | undefined {
    return this.agentStates[agentName];
  }
  
  /**
   * Get the current task registry
   */
  public getTaskRegistry(): TaskRegistry {
    return this.taskRegistry;
  }
  
  /**
   * Get the current pending approval
   */
  public getPendingApproval(): ApprovalData | null {
    return this.pendingApproval;
  }
  
  /**
   * Submit an approval decision
   */
  public submitApproval(approved: boolean, feedback?: string): void {
    if (!this.pendingApproval) {
      throw new Error('No pending approval to submit');
    }
    
    // Handle approval based on type
    if (this.pendingApproval.type === 'resume_improvements') {
      // Resume improvements approval
      if (approved) {
        // Update agent state
        this.emit('agent_update', {
          ...this.agentStates['resume_agent'],
          status: 'complete',
          waiting_for_approval: false,
          approval_type: undefined,
          current_task: 'Completed',
          completion_percentage: 100,
        });
      } else {
        // Update agent state for rejection
        this.emit('agent_update', {
          ...this.agentStates['resume_agent'],
          status: 'thinking',
          waiting_for_approval: false,
          approval_type: undefined,
          current_task: 'Revising improvements',
          completion_percentage: 80,
          thinking: 'Revising improvements based on feedback...\nAdjusting suggestions...'
        });
        
        // Simulate revised improvements later
        setTimeout(() => {
          // This would then lead to a new approval request
        }, 3000);
      }
    } else if (this.pendingApproval.type === 'job_application') {
      // Job application approval handling would go here
    }
    
    // Clear the pending approval
    this.pendingApproval = null;
  }
  
  /**
   * Reset the tester state
   */
  public reset(): void {
    this.agentStates = {};
    this.taskRegistry = { tasks: [], overall_completion: 0 };
    this.pendingApproval = null;
    this.isConnected = false;
    this.eventLog = [];
  }
}

// Create a singleton instance for use throughout the app
export const workflowTester = new WorkflowTester();
