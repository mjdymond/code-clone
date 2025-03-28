'use client';

import { create } from 'zustand';
import { AgentState, ApprovalData, JobListing, ResumeAgentState, JobSearchAgentState, TaskRegistry } from '@/types/agent';

interface AppState {
  // Agents state
  agents: Record<string, AgentState>;
  setAgentState: (agentName: string, state: AgentState) => void;
  
  // Task registry
  taskRegistry: TaskRegistry;
  setTaskRegistry: (registry: TaskRegistry) => void;
  
  // Resume state
  resumeText: string;
  setResumeText: (text: string) => void;
  jobDescription: string;
  setJobDescription: (text: string) => void;
  
  // Job search state
  selectedJob: JobListing | null;
  setSelectedJob: (job: JobListing | null) => void;
  comparedJobs: JobListing[];
  addComparedJob: (job: JobListing) => void;
  removeComparedJob: (jobId: string) => void;
  clearComparedJobs: () => void;
  
  // Approval state
  pendingApproval: ApprovalData | null;
  setPendingApproval: (data: ApprovalData | null) => void;
  
  // Connection state
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  
  // Modal states
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  // Agents state
  agents: {},
  setAgentState: (agentName, state) => 
    set((prevState) => ({
      agents: {
        ...prevState.agents,
        [agentName]: state
      }
    })),
  
  // Task registry
  taskRegistry: { tasks: [], overall_completion: 0 },
  setTaskRegistry: (registry) => set({ taskRegistry: registry }),
  
  // Resume state
  resumeText: '',
  setResumeText: (text) => set({ resumeText: text }),
  jobDescription: '',
  setJobDescription: (text) => set({ jobDescription: text }),
  
  // Job search state
  selectedJob: null,
  setSelectedJob: (job) => set({ selectedJob: job }),
  comparedJobs: [],
  addComparedJob: (job) => set((state) => {
    if (state.comparedJobs.some(j => j.id === job.id)) {
      return state; // Job already in comparison list
    }
    return { comparedJobs: [...state.comparedJobs, job] };
  }),
  removeComparedJob: (jobId) => set((state) => ({
    comparedJobs: state.comparedJobs.filter(job => job.id !== jobId)
  })),
  clearComparedJobs: () => set({ comparedJobs: [] }),
  
  // Approval state
  pendingApproval: null,
  setPendingApproval: (data) => set({ pendingApproval: data }),
  
  // Connection state
  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),
  
  // Modal states
  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),
}));

// Selector helpers for typed agent states
export const useResumeAgentState = (): ResumeAgentState => {
  return useStore(state => (state.agents.resume_agent || {}) as ResumeAgentState);
};

export const useJobSearchAgentState = (): JobSearchAgentState => {
  return useStore(state => (state.agents.job_search_agent || {}) as JobSearchAgentState);
};

export const useTaskRegistryState = (): TaskRegistry => {
  return useStore(state => state.taskRegistry);
};

export const usePendingApproval = (): ApprovalData | null => {
  return useStore(state => state.pendingApproval);
};
