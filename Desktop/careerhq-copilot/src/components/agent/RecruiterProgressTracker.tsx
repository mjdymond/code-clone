'use client';

import React, { useState } from 'react';
import { Mail, Globe, FileText } from 'lucide-react';
import { useCareerAgent } from '@/hooks/useCopilotIntegration';

interface RecruiterProgressTrackerProps {
  agentName?: string;
  currentStep?: number;
  totalSteps?: number;
  statusText?: string;
  className?: string;
}

/**
 * RecruiterProgressTracker with CopilotKit Integration
 * 
 * Uses bidirectional state sharing to visualize real-time progress
 * of the recruiting agent workflow within CareerHQ.
 * 
 * Can be used in two modes:
 * 1. With CopilotKit integration (provide agentName)
 * 2. With direct props (provide currentStep, totalSteps, statusText)
 */
export default function RecruiterProgressTracker({
  agentName,
  currentStep = 3,
  totalSteps = 5,
  statusText = "Writing summary...",
  className = ""
}: RecruiterProgressTrackerProps) {
  // Create a safe wrapper with error handling
  const [error, setError] = useState(false);
  
  // Use the CoAgent hook (real or mock) for state management
  const initialState = {
    currentStep,
    totalSteps,
    currentAction: statusText,
    completedSteps: Array.from({ length: currentStep }, (_, i) => i + 1),
    startTime: new Date().toISOString()
  };
  
  // Use a try-catch block to handle any potential errors
  let agentState: any = {};
  try {
    // Use our career agent hook (which will use either real CopilotKit or mock)
    const result = useCareerAgent({
      name: agentName || 'recruiter_progress_tracker',
      initialState
    });
    agentState = result.state;
  } catch (err) {
    console.error('Error in RecruiterProgressTracker:', err);
    setError(true);
    agentState = initialState;
  }
  
  // Always ensure we have a valid state object with fallbacks
  const state = {
    currentStep: agentState?.currentStep ?? currentStep,
    totalSteps: agentState?.totalSteps ?? totalSteps,
    currentAction: agentState?.currentAction ?? statusText,
    completedSteps: agentState?.completedSteps ?? Array.from({ length: currentStep }, (_, i) => i + 1)
  };
  
  // Compute steps array safely
  const steps = Array.from({ length: state.totalSteps || 1 }, (_, i) => i + 1);
  
  // If there was an error, show a simplified version
  if (error) {
    return (
      <div className={`bg-black text-white rounded-3xl p-6 w-full max-w-md shadow-lg ${className}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recruiter</h2>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Mail size={18} className="text-white" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-10">
          {[1, 2, 3].map((step, index) => (
            <React.Fragment key={step}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {index < 2 && (
                <div className="h-1 flex-grow mx-1 bg-blue-500"></div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-2"></div>
            <p className="text-2xl text-gray-400 font-light">Progress Summary</p>
          </div>
          <div className="text-xl text-gray-400">
            <span className="text-white">3</span> of 3
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-black text-white rounded-3xl p-6 w-full max-w-md shadow-lg ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Recruiter</h2>
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Mail size={18} className="text-white" />
          </div>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Globe size={18} className="text-white" />
          </div>
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <FileText size={18} className="text-white" />
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-10">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${state.completedSteps.includes(step) ? 'bg-blue-500' : 'bg-transparent border-2 border-gray-600'}`}>
              {state.completedSteps.includes(step) && (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            
            {index < steps.length - 1 && (
              <div className={`h-1 flex-grow mx-1 ${step < state.currentStep ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-2"></div>
          <p className="text-2xl text-gray-400 font-light">{state.currentAction}</p>
        </div>
        <div className="text-xl text-gray-400">
          <span className="text-white">{state.completedSteps.length}</span> of {state.totalSteps}
        </div>
      </div>
    </div>
  );
}
