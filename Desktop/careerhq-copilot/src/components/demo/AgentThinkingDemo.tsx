'use client';

import React, { useState, useEffect } from 'react';
import { AgentThinking } from '@/components/common/AgentThinking';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { InputRange } from '@/components/ui/input-range';
import { useStore } from '@/lib/store';

export function AgentThinkingDemo() {
  const [autoThink, setAutoThink] = useState(false);
  const [speed, setSpeed] = useState(50);
  
  const setAgentState = useStore(state => state.setAgentState);
  
  // Sample thinking processes for demonstration
  const thinkingSteps = [
    "Analyzing resume content...",
    "Analyzing resume content...\nIdentifying key skills mentioned in the document.",
    "Analyzing resume content...\nIdentifying key skills mentioned in the document.\nExtracted skills: JavaScript, React, TypeScript, Node.js, AWS",
    "Analyzing resume content...\nIdentifying key skills mentioned in the document.\nExtracted skills: JavaScript, React, TypeScript, Node.js, AWS\n\nNow comparing with job requirements...",
    "Analyzing resume content...\nIdentifying key skills mentioned in the document.\nExtracted skills: JavaScript, React, TypeScript, Node.js, AWS\n\nNow comparing with job requirements...\nFound strong matches for: JavaScript, React, TypeScript",
    "Analyzing resume content...\nIdentifying key skills mentioned in the document.\nExtracted skills: JavaScript, React, TypeScript, Node.js, AWS\n\nNow comparing with job requirements...\nFound strong matches for: JavaScript, React, TypeScript\nIdentified gaps in: Python, Docker, Kubernetes",
    "Analyzing resume content...\nIdentifying key skills mentioned in the document.\nExtracted skills: JavaScript, React, TypeScript, Node.js, AWS\n\nNow comparing with job requirements...\nFound strong matches for: JavaScript, React, TypeScript\nIdentified gaps in: Python, Docker, Kubernetes\n\nGenerating suggestions for improvement...",
  ];
  
  // Sample insights that appear as the agent thinks
  const insights = [
    "Strong frontend development background detected",
    "Could benefit from highlighting TypeScript experience more prominently",
    "Consider adding specific React project accomplishments",
    "Missing crucial DevOps skills for this role",
    "Recommendation: Add section on willingness to learn new technologies"
  ];
  
  // Function to simulate agent thinking
  const simulateThinking = () => {
    let step = 0;
    let insightIndex = 0;
    
    // Initial state - agent starting to think
    setAgentState('demo_agent', {
      status: 'thinking',
      thinking: thinkingSteps[0],
      insights: [],
      completion_percentage: 0
    });
    
    // Calculate timing based on speed
    const interval = Math.max(3000 - (speed * 25), 500);
    
    // Update thinking in intervals
    const timer = setInterval(() => {
      step++;
      
      if (step < thinkingSteps.length) {
        // Add insights periodically
        const currentInsights = [];
        if (step >= 2 && insightIndex < insights.length) {
          for (let i = 0; i <= Math.min(insightIndex, insights.length - 1); i++) {
            currentInsights.push(insights[i]);
          }
          insightIndex++;
        }
        
        // Update state with new thinking and insights
        setAgentState('demo_agent', {
          status: 'thinking',
          thinking: thinkingSteps[step],
          insights: currentInsights,
          completion_percentage: Math.floor((step / (thinkingSteps.length - 1)) * 100)
        });
      } else {
        // Final state - thinking complete
        setAgentState('demo_agent', {
          status: 'complete',
          thinking: thinkingSteps[thinkingSteps.length - 1],
          insights: insights,
          completion_percentage: 100
        });
        
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  };
  
  // Auto-simulate when enabled
  useEffect(() => {
    if (autoThink) {
      const cleanup = simulateThinking();
      return cleanup;
    }
  }, [autoThink]);
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Agent Thinking Visualization</h3>
        <p className="text-gray-600 mb-6">
          This component provides real-time visibility into agent reasoning processes,
          a key element of transparent AI interfaces.
        </p>
        
        <div className="mb-6">
          <AgentThinking 
            agentName="demo_agent"
            title="Resume Analysis" 
            initiallyExpanded={true}
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-think">Auto-Simulate Thinking</Label>
            <Switch 
              id="auto-think"
              checked={autoThink}
              onCheckedChange={setAutoThink}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="speed">Simulation Speed</Label>
              <span className="text-sm text-gray-500">
                {speed < 33 ? 'Slow' : speed < 66 ? 'Medium' : 'Fast'}
              </span>
            </div>
            <InputRange
              id="speed"
              min={0}
              max={100}
              step={1}
              value={speed}
              onChange={setSpeed}
              disabled={autoThink}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              onClick={simulateThinking}
              disabled={autoThink}
              className="w-full"
            >
              Start Simulation
            </Button>
            
            <Button 
              onClick={() => {
                setAgentState('demo_agent', {
                  status: 'idle',
                  thinking: '',
                  insights: [],
                  completion_percentage: 0
                });
                setAutoThink(false);
              }}
              variant="outline"
              className="w-full"
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
