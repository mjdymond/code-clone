'use client';

/**
 * Agents Demo Page
 * 
 * This page showcases the RecruiterProgressTracker component and other agent-related
 * components with interactive controls for testing different states and configurations.
 */

import React, { useState } from 'react';
import RecruiterProgressTracker from '@/components/agent/RecruiterProgressTracker';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AgentsDemo() {
  // State for the demo controls
  const [currentStep, setCurrentStep] = useState(3);
  const [totalSteps, setTotalSteps] = useState(5);
  const [statusText, setStatusText] = useState("Writing summary...");
  const [useCopilot, setUseCopilot] = useState(false);
  const [agentName, setAgentName] = useState("recruiter_agent");
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Agent Components</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Recruiter Progress Tracker</h2>
          <p className="text-gray-600 mb-6">
            A sleek, dark-themed component that visualizes agent workflow progress
            for the CareerHQ recruiter process.
          </p>
          
          <div className="flex justify-center mb-8">
            <RecruiterProgressTracker 
              currentStep={currentStep}
              totalSteps={totalSteps}
              statusText={statusText}
              {...(useCopilot ? { agentName } : {})}
            />
          </div>
        </div>
        
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Demo Controls</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="current-step">Current Step: {currentStep}</Label>
                </div>
                <Slider 
                  id="current-step"
                  min={1} 
                  max={totalSteps} 
                  step={1} 
                  value={[currentStep]} 
                  onValueChange={(values) => setCurrentStep(values[0])} 
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="total-steps">Total Steps: {totalSteps}</Label>
                </div>
                <Slider 
                  id="total-steps"
                  min={2} 
                  max={10} 
                  step={1} 
                  value={[totalSteps]} 
                  onValueChange={(values) => {
                    const newTotal = values[0];
                    setTotalSteps(newTotal);
                    if (currentStep > newTotal) {
                      setCurrentStep(newTotal);
                    }
                  }} 
                />
              </div>
              
              <div>
                <Label htmlFor="status-text" className="block mb-2">Status Text</Label>
                <Input 
                  id="status-text"
                  value={statusText} 
                  onChange={(e) => setStatusText(e.target.value)} 
                  className="mb-4"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="copilot-mode" 
                  checked={useCopilot}
                  onCheckedChange={setUseCopilot}
                />
                <Label htmlFor="copilot-mode">Use CopilotKit Integration</Label>
              </div>
              
              {useCopilot && (
                <div>
                  <Label htmlFor="agent-name" className="block mb-2">Agent Name</Label>
                  <Input 
                    id="agent-name"
                    value={agentName} 
                    onChange={(e) => setAgentName(e.target.value)} 
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
