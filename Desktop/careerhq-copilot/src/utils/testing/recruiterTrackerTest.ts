/**
 * Test utilities for the RecruiterProgressTracker component
 * 
 * This file provides helper functions to simulate agent state updates
 * for testing the RecruiterProgressTracker component.
 */

/**
 * Test utilities for the RecruiterProgressTracker component
 * Using a safer approach that doesn't rely directly on store implementation
 */

// Dynamic import to avoid issues during SSR
let _store: any = null;

// Function to safely get the store
const getStore = () => {
  if (typeof window === 'undefined') return null;
  
  if (!_store) {
    try {
      // Dynamically import the store
      _store = require('@/lib/store').useStore;
    } catch (error) {
      console.error('Failed to import store:', error);
      return null;
    }
  }
  
  return _store;
};

/**
 * Simulates a resume agent workflow with progress updates
 * 
 * @param delay - Time in ms between state updates
 * @returns A cleanup function to stop the simulation
 */
export function simulateResumeAgentWorkflow(delay = 2000) {
  // Safely get the store
  const store = getStore();
  
  // Make sure store is available and has the expected methods
  if (!store || !store.getState || !store.getState().setAgentState) {
    console.error('Store not available or missing setAgentState method');
    return () => {}; // Return empty cleanup function
  }
  
  const setState = store.getState().setAgentState;
  
  // Initial state
  setState('resume_agent', {
    name: 'resume_agent',
    status: 'thinking',
    completion_percentage: 20,
    current_task: 'Analyzing resume content',
    thinking: 'Extracting skills and experience from resume...',
    results: null,
    error: null,
    waiting_for_approval: false,
    currentStep: 1,
    totalSteps: 5,
    currentAction: 'Analyzing resume',
    completedSteps: [1],
  });
  
  // Step two - after delay
  const step2Timeout = setTimeout(() => {
    setState('resume_agent', {
      name: 'resume_agent',
      status: 'thinking',
      completion_percentage: 40,
      current_task: 'Identifying strengths and weaknesses',
      thinking: 'Evaluating skills against industry standards...',
      results: {
        skills: ['JavaScript', 'React', 'TypeScript'],
        experience: ['5 years frontend development', '3 years team leadership']
      },
      error: null,
      waiting_for_approval: false,
      currentStep: 2,
      totalSteps: 5,
      currentAction: 'Identifying key strengths',
      completedSteps: [1, 2],
    });
  }, delay);
  
  // Step three - after 2*delay
  const step3Timeout = setTimeout(() => {
    setState('resume_agent', {
      name: 'resume_agent',
      status: 'thinking',
      completion_percentage: 60,
      current_task: 'Generating improvements',
      thinking: 'Creating tailored suggestions based on job market trends...',
      results: {
        skills: ['JavaScript', 'React', 'TypeScript'],
        experience: ['5 years frontend development', '3 years team leadership'],
        strengths: ['Technical expertise', 'Leadership experience'],
        weaknesses: ['Limited backend experience', 'No cloud certification']
      },
      error: null,
      waiting_for_approval: false,
      currentStep: 3,
      totalSteps: 5, 
      currentAction: 'Writing summary',
      completedSteps: [1, 2, 3],
    });
  }, delay * 2);
  
  // Step four - after 3*delay
  const step4Timeout = setTimeout(() => {
    setState('resume_agent', {
      name: 'resume_agent',
      status: 'waiting',
      completion_percentage: 80,
      current_task: 'Awaiting improvement approval',
      thinking: 'Generated improvement suggestions for review...',
      results: {
        skills: ['JavaScript', 'React', 'TypeScript'],
        experience: ['5 years frontend development', '3 years team leadership'],
        strengths: ['Technical expertise', 'Leadership experience'],
        weaknesses: ['Limited backend experience', 'No cloud certification'],
        improvements: [
          { section: 'Skills', suggestion: 'Add TypeScript and React testing experience' },
          { section: 'Summary', suggestion: 'Highlight project management experience' }
        ]
      },
      error: null,
      waiting_for_approval: true,
      approval_type: 'resume_improvements',
      currentStep: 4,
      totalSteps: 5,
      currentAction: 'Waiting for approval',
      completedSteps: [1, 2, 3],
    });
  }, delay * 3);
  
  // Cleanup function to cancel any pending timeouts
  return () => {
    clearTimeout(step2Timeout);
    clearTimeout(step3Timeout);
    clearTimeout(step4Timeout);
  };
}

/**
 * Updates the agent state to final completion step
 */
export function completeResumeWorkflow() {
  // Safely get the store
  const store = getStore();
  
  // Make sure store is available and has the expected methods
  if (!store || !store.getState || !store.getState().setAgentState) {
    console.error('Store not available or missing setAgentState method');
    return;
  }
  
  const setState = store.getState().setAgentState;
  
  setState('resume_agent', {
    name: 'resume_agent',
    status: 'complete',
    completion_percentage: 100,
    current_task: 'Resume optimization complete',
    thinking: null,
    results: {
      skills: ['JavaScript', 'React', 'TypeScript'],
      experience: ['5 years frontend development', '3 years team leadership'],
      strengths: ['Technical expertise', 'Leadership experience'],
      weaknesses: ['Limited backend experience', 'No cloud certification'],
      improvements: [
        { section: 'Skills', suggestion: 'Add TypeScript and React testing experience' },
        { section: 'Summary', suggestion: 'Highlight project management experience' }
      ],
      improvedResume: '/* Improved resume content would go here */'
    },
    error: null,
    waiting_for_approval: false,
    currentStep: 5,
    totalSteps: 5,
    currentAction: 'Optimization complete',
    completedSteps: [1, 2, 3, 4, 5],
  });
}
