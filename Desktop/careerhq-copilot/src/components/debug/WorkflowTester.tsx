'use client';

import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { workflowTester } from '@/utils/testing/workflowTester';
import { useStore } from '@/lib/store';
import { Play, RefreshCw, Check, X, Zap } from 'lucide-react';

export function WorkflowTester() {
  const [activeTab, setActiveTab] = useState('resume');
  const [resumeText, setResumeText] = useState('Experienced software developer with a passion for creating great applications.\n\nEXPERIENCE\n\nSenior Developer, XYZ Corp (2019-Present)\n- Led development team on e-commerce project.\n- Implemented React frontend with TypeScript.\n\nSKILLS\nReact, JavaScript, CSS');
  const [jobDescription, setJobDescription] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('{ "role": "Frontend Developer", "location": "Remote", "skills": ["React", "TypeScript", "NextJS"] }');
  const [isRunning, setIsRunning] = useState(false);
  
  // Get store state for testing
  const { agents, taskRegistry, pendingApproval } = useStore();
  
  // Start the resume workflow test
  const startResumeTest = () => {
    setIsRunning(true);
    workflowTester.reset();
    workflowTester.startResumeWorkflow(resumeText, jobDescription || undefined);
    
    // Connect to store updates
    workflowTester.on('agent_update', (state) => {
      console.log('Agent update:', state);
    });
    
    workflowTester.on('task_update', (registry) => {
      console.log('Task update:', registry);
    });
    
    workflowTester.on('approval_request', (data) => {
      console.log('Approval request:', data);
    });
    
    // Auto-reset running state after the flow completes
    setTimeout(() => {
      setIsRunning(false);
    }, 8000);
  };
  
  // Start the job search workflow test
  const startJobSearchTest = () => {
    setIsRunning(true);
    workflowTester.reset();
    
    try {
      const criteria = JSON.parse(searchCriteria);
      workflowTester.startJobSearchWorkflow(criteria);
      
      // Auto-reset running state after the flow completes
      setTimeout(() => {
        setIsRunning(false);
      }, 8000);
    } catch (error) {
      console.error('Invalid search criteria JSON:', error);
      setIsRunning(false);
    }
  };
  
  // Handle approval decisions
  const handleApproval = (approved: boolean) => {
    workflowTester.submitApproval(approved);
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Zap className="h-5 w-5 mr-2 text-blue-500" />
          Workflow Testing Interface
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="resume" className="flex-1">Resume Workflow</TabsTrigger>
            <TabsTrigger value="jobs" className="flex-1">Job Search Workflow</TabsTrigger>
            <TabsTrigger value="monitor" className="flex-1">State Monitor</TabsTrigger>
          </TabsList>
          
          {/* Resume Workflow Test */}
          <TabsContent value="resume">
            <div className="space-y-4">
              <div>
                <Label htmlFor="resume-text">Resume Content</Label>
                <Textarea
                  id="resume-text"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="job-description">Job Description (Optional)</Label>
                <Textarea
                  id="job-description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={4}
                  placeholder="Paste job description to match keywords..."
                  className="font-mono text-sm"
                />
              </div>
              
              <Button 
                onClick={startResumeTest} 
                disabled={isRunning}
                className="w-full"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Running Test...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Resume Workflow Test
                  </>
                )}
              </Button>
              
              {pendingApproval && pendingApproval.type === 'resume_improvements' && (
                <div className="mt-4 p-4 border rounded-md bg-blue-50">
                  <h3 className="font-medium mb-2">Approval Required</h3>
                  <p className="text-sm mb-4">Please approve or reject the suggested resume improvements.</p>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleApproval(false)}
                    >
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => handleApproval(true)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Job Search Workflow Test */}
          <TabsContent value="jobs">
            <div className="space-y-4">
              <div>
                <Label htmlFor="search-criteria">Search Criteria (JSON)</Label>
                <Textarea
                  id="search-criteria"
                  value={searchCriteria}
                  onChange={(e) => setSearchCriteria(e.target.value)}
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
              
              <Button 
                onClick={startJobSearchTest} 
                disabled={isRunning}
                className="w-full"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Running Test...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Job Search Workflow Test
                  </>
                )}
              </Button>
              
              {pendingApproval && pendingApproval.type === 'job_application' && (
                <div className="mt-4 p-4 border rounded-md bg-blue-50">
                  <h3 className="font-medium mb-2">Application Approval Required</h3>
                  <p className="text-sm mb-4">Please approve or reject the job application.</p>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleApproval(false)}
                    >
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => handleApproval(true)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* State Monitor */}
          <TabsContent value="monitor">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Agent States</h3>
                <div className="bg-gray-50 p-3 rounded border overflow-auto h-40">
                  <pre className="text-xs">
                    {JSON.stringify(agents, null, 2)}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Task Registry</h3>
                <div className="bg-gray-50 p-3 rounded border overflow-auto h-40">
                  <pre className="text-xs">
                    {JSON.stringify(taskRegistry, null, 2)}
                  </pre>
                </div>
              </div>
              
              {pendingApproval && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Pending Approval</h3>
                  <div className="bg-blue-50 p-3 rounded border overflow-auto h-40">
                    <pre className="text-xs">
                      {JSON.stringify(pendingApproval, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => {
                  console.log('Current workflow tester state:', {
                    eventLog: workflowTester.getEventLog(),
                    agentStates: agents,
                    taskRegistry,
                    pendingApproval
                  });
                }}
                className="w-full"
              >
                Log Current State to Console
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
