'use client';

import { useState } from 'react';
import { WorkflowTester } from '@/components/debug/WorkflowTester';
import { DebugPanel } from '@/components/debug/DebugPanel';
import RecruiterProgressTracker from '@/components/agent/RecruiterProgressTracker';
// Import our test utilities with safer implementation
import { simulateResumeAgentWorkflow, completeResumeWorkflow } from '@/utils/testing/recruiterTrackerTest';
import { Button } from '@/components/ui/button';

export default function DebugPage() {
  return (
    <div className="container max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Debug & Testing Tools</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Workflow Testing</h2>
          <p className="text-gray-600 mb-4">
            Use these tools to test complete workflows without requiring the backend.
            The workflow tester simulates agent responses and state updates.
          </p>
          <WorkflowTester />
        </section>
        
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recruiter Progress Tracker Testing</h2>
          <p className="text-gray-600 mb-4">
            Test the recruiter progress tracker component with simulated agent state updates.
          </p>
          
          <div className="mt-4 space-y-6">
            <div className="flex space-x-4">
              <Button 
                onClick={() => {
                  try {
                    const cleanup = simulateResumeAgentWorkflow(2000);
                    // Store cleanup function to cancel simulation if needed
                    if (typeof window !== 'undefined') {
                      window.trackerCleanup = cleanup;
                    }
                  } catch (error) {
                    console.error('Error starting simulation:', error);
                  }
                }}
                variant="outline"
              >
                Start Simulation
              </Button>
              
              <Button 
                onClick={() => {
                  try {
                    // Clean up any running simulation
                    if (typeof window !== 'undefined' && window.trackerCleanup) {
                      window.trackerCleanup();
                      window.trackerCleanup = null;
                    }
                    // Set to complete state
                    completeResumeWorkflow();
                  } catch (error) {
                    console.error('Error completing workflow:', error);
                  }
                }}
                variant="outline"
              >
                Complete Workflow
              </Button>
            </div>
            
            <div className="mt-6">
              <RecruiterProgressTracker agentName="resume_agent" />
            </div>
          </div>
        </section>
        
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <p className="text-gray-600 mb-4">
            The debug panel is also accessible globally from any page in the application
            by clicking the Debug button in the bottom right corner.
          </p>
          
          <div className="flex flex-col items-end">
            <div className="w-full max-w-sm">
              <DebugPanel />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
