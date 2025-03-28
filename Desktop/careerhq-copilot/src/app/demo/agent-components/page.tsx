"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReasoningControlled } from "@/components/agent/ReasoningControlled";
import { ComplexReasoningExample } from "@/components/agent/ComplexReasoningExample";
import { PromptSuggestionVariants } from "@/components/agent/PromptSuggestionVariants";
import { AgentThinking } from "@/components/agent/AgentThinking";
import { ResumeApproval } from "@/components/resume/ResumeApproval";
import { JobCard } from "@/components/jobs/JobCard";
import RecruiterProgressTracker from "@/components/agent/RecruiterProgressTracker";
import { AgentConnectionsVisualization } from "@/components/agent/AgentConnectionsVisualization";
import { Button } from "@/components/ui/button";

export default function AgentComponentsPage() {
  // Sample states for demonstration
  const [thinkingState, setThinkingState] = useState({
    isThinking: true,
    thoughtProcess: "Analyzing your resume for keywords related to software engineering positions...\n\nComparing against job requirements for Senior Software Engineer at TechCorp...\n\nIdentifying strengths and areas for improvement...",
    insights: ["Strong technical skills section", "Missing recent cloud experience", "Leadership experience is highlighted well"]
  });

  const [resumeApprovalState, setResumeApprovalState] = useState({
    original: "John Doe\nSoftware Engineer\n\nEXPERIENCE\nSoftware Engineer, ABC Inc (2018-Present)\n- Developed web applications using React\n- Worked on backend services with Node.js\n\nSKILLS\nJavaScript, React, Node.js, HTML, CSS",
    improved: "John Doe\nSenior Software Engineer\n\nEXPERIENCE\nSoftware Engineer, ABC Inc (2018-Present)\n- Developed responsive web applications using React and Redux\n- Built scalable backend services with Node.js and Express\n- Implemented CI/CD pipelines reducing deployment time by 40%\n\nSKILLS\nJavaScript, TypeScript, React, Redux, Node.js, Express, CI/CD, Docker, AWS",
    changes: [
      { section: "Title", description: "Updated to Senior Software Engineer to match experience", importance: "medium" },
      { section: "Experience", description: "Added technologies and quantifiable achievements", importance: "high" },
      { section: "Skills", description: "Added relevant technologies (TypeScript, Redux, etc.)", importance: "high" }
    ]
  });

  const jobData = {
    id: "job-123",
    title: "Senior Software Engineer",
    company: "TechCorp",
    location: "San Francisco, CA (Remote)",
    salary_range: "$140,000 - $180,000",
    match_score: 92,
    description: "TechCorp is seeking a Senior Software Engineer to join our innovative team building next-generation cloud solutions...",
    posted_date: "2 days ago",
    url: "#job-details"
  };

  const progressData = {
    currentStep: 2,
    totalSteps: 5,
    steps: [
      { name: "Resume Analysis", completed: true },
      { name: "Job Matching", completed: true },
      { name: "Application Preparation", completed: false, current: true },
      { name: "Interview Preparation", completed: false },
      { name: "Salary Negotiation", completed: false }
    ]
  };

  // Sample data for agent connections
  const centralAgent = {
    id: "coordinator",
    name: "Coordinator",
    type: "central",
    icon: "👨‍💼",
    color: "#4f46e5"
  };

  const serviceAgents = [
    {
      id: "resume",
      name: "Resume Agent",
      type: "service",
      icon: "📄",
      color: "#0ea5e9"
    },
    {
      id: "jobs",
      name: "Job Search",
      type: "service",
      icon: "🔍",
      color: "#10b981"
    },
    {
      id: "interview",
      name: "Interview",
      type: "service",
      icon: "🎙️",
      color: "#f59e0b"
    },
    {
      id: "salary",
      name: "Salary",
      type: "service",
      icon: "💰",
      color: "#8b5cf6"
    },
    {
      id: "application",
      name: "Application",
      type: "service",
      icon: "📝",
      color: "#ec4899"
    }
  ];

  const connections = [
    { fromId: "coordinator", toId: "resume", active: true, direction: "outbound" },
    { fromId: "resume", toId: "coordinator", active: true, direction: "inbound" },
    { fromId: "coordinator", toId: "jobs", active: true, direction: "outbound" },
    { fromId: "jobs", toId: "coordinator", active: false, direction: "inbound" },
    { fromId: "coordinator", toId: "interview", active: false, direction: "outbound" },
    { fromId: "coordinator", toId: "salary", active: false, direction: "outbound" },
    { fromId: "coordinator", toId: "application", active: false, direction: "outbound" }
  ];

  // Toggle thinking state
  const toggleThinking = () => {
    setThinkingState(prev => ({
      ...prev,
      isThinking: !prev.isThinking
    }));
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Agent Components</h1>
        <p className="text-muted-foreground mt-1">
          Core UI components for agent-native interfaces with CopilotKit
        </p>
      </div>

      <Tabs defaultValue="thinking">
        <TabsList className="mb-6">
          <TabsTrigger value="thinking">Agent Thinking</TabsTrigger>
          <TabsTrigger value="reasoning">Agent Reasoning</TabsTrigger>
          <TabsTrigger value="suggestions">Prompt Suggestions</TabsTrigger>
          <TabsTrigger value="approval">Resume Approval</TabsTrigger>
          <TabsTrigger value="job-card">Job Card</TabsTrigger>
          <TabsTrigger value="progress">Workflow Progress</TabsTrigger>
          <TabsTrigger value="connections">Agent Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="thinking">
          <Card>
            <CardHeader>
              <CardTitle>Agent Thinking Visualization</CardTitle>
              <CardDescription>
                Real-time visualization of agent reasoning process with typing animation
              </CardDescription>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={toggleThinking}
                  variant={thinkingState.isThinking ? "destructive" : "default"}
                >
                  {thinkingState.isThinking ? "Stop Thinking" : "Start Thinking"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AgentThinking
                isThinking={thinkingState.isThinking}
                thoughtProcess={thinkingState.thoughtProcess}
                insights={thinkingState.insights}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reasoning">
          <Card>
            <CardHeader>
              <CardTitle>Agent Reasoning Component</CardTitle>
              <CardDescription>
                Human-controlled reasoning insights with collapsible interface that shows agent's
                step-by-step reasoning process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-3">Simple Example</h3>
                <ReasoningControlled />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Advanced Examples</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Toggle between different types of agent reasoning outputs.
                </p>
                <ComplexReasoningExample />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Suggestions</CardTitle>
              <CardDescription>
                Interactive prompt suggestions that guide users with common queries and categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-lg mx-auto">
                <PromptSuggestionVariants />
              </div>
              <div className="mt-6 text-sm text-muted-foreground">
                <p>Features:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Category-based suggestions organize common queries</li>
                  <li>Highlighted keywords emphasize important terms</li>
                  <li>Two-level navigation with primary categories and specific suggestions</li>
                  <li>Integrated with expandable textarea for seamless input</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approval">
          <Card>
            <CardHeader>
              <CardTitle>Resume Approval Interface</CardTitle>
              <CardDescription>
                Human-in-the-loop control for reviewing and approving agent suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResumeApproval
                original={resumeApprovalState.original}
                improved={resumeApprovalState.improved}
                changes={resumeApprovalState.changes}
                onApprove={() => alert("Changes approved!")}
                onReject={() => alert("Changes rejected!")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="job-card">
          <Card>
            <CardHeader>
              <CardTitle>Job Card Component</CardTitle>
              <CardDescription>
                Enhanced job listing card with match scoring and details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-lg mx-auto">
                <JobCard job={jobData} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Progress Tracker</CardTitle>
              <CardDescription>
                Visual tracking of agent workflow progress across multiple steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecruiterProgressTracker
                currentStep={progressData.currentStep}
                totalSteps={progressData.totalSteps}
                steps={progressData.steps}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>Agent Connections Visualization</CardTitle>
              <CardDescription>
                Interactive visualization of agent network with animated data flow
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="h-[500px]">
                <AgentConnectionsVisualization
                  centralAgent={centralAgent}
                  serviceAgents={serviceAgents}
                  connections={connections}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
