'use client';

import React from 'react';
import { AgentConnectionsVisualization } from '@/components/agent/AgentConnectionsVisualization';
import { AgentChatInterface } from '@/components/agent/AgentChatInterface';

export default function AgentShowcasePage() {
  // Sample data for agent connections
  const centralAgent = {
    id: "coordinator",
    name: "Coordinator",
    type: "central" as const,
    icon: "👨‍💼",
    color: "#4f46e5"
  };

  const serviceAgents = [
    {
      id: "resume",
      name: "Resume Agent",
      type: "service" as const,
      icon: "📄",
      color: "#0ea5e9"
    },
    {
      id: "jobs",
      name: "Job Search",
      type: "service" as const,
      icon: "🔍",
      color: "#10b981"
    },
    {
      id: "interview",
      name: "Interview",
      type: "service" as const,
      icon: "🎙️",
      color: "#f59e0b"
    },
    {
      id: "salary",
      name: "Salary",
      type: "service" as const,
      icon: "💰",
      color: "#8b5cf6"
    },
    {
      id: "application",
      name: "Application",
      type: "service" as const,
      icon: "📝",
      color: "#ec4899"
    }
  ];

  const connections = [
    { fromId: "coordinator", toId: "resume", active: true, direction: "outbound" as const },
    { fromId: "resume", toId: "coordinator", active: true, direction: "inbound" as const },
    { fromId: "coordinator", toId: "jobs", active: true, direction: "outbound" as const },
    { fromId: "jobs", toId: "coordinator", active: false, direction: "inbound" as const },
    { fromId: "coordinator", toId: "interview", active: false, direction: "outbound" as const },
    { fromId: "coordinator", toId: "salary", active: false, direction: "outbound" as const },
    { fromId: "coordinator", toId: "application", active: false, direction: "outbound" as const }
  ];
  return (
    <div className="flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">CareerHQ Agent</h1>
        <p className="text-lg text-gray-700 mb-8">
          Interactive demo of the CareerHQ agent with connections visualization and chat interface.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left column: Connections Visualization */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Agent Connections</h2>
            <div className="bg-black rounded-lg overflow-hidden border border-gray-200 h-[500px] shadow-xl">
              <AgentConnectionsVisualization 
                centralAgent={centralAgent}
                serviceAgents={serviceAgents}
                connections={connections}
              />
            </div>
            <p className="mt-3 text-sm text-gray-600">
              The visualization above shows how the CareerHQ agent connects to various external services to enhance its capabilities.
            </p>
          </div>
          
          {/* Right column: Chat Interface */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Chat with Agent</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xl h-[500px] flex flex-col">
              <AgentChatInterface />
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Try interacting with the agent by typing a question or selecting a suggestion.
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-3 text-blue-800">About the CareerHQ Agent</h2>
          <p className="mb-4">
            The CareerHQ agent uses advanced AI to help with various career-related tasks:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Resume Optimization</strong> - Analysis and improvement of resumes for better job application outcomes</li>
            <li><strong>Job Search</strong> - Personalized job recommendations and search strategies</li>
            <li><strong>Interview Preparation</strong> - Practice questions and feedback for upcoming interviews</li>
            <li><strong>Career Planning</strong> - Long-term career guidance and development advice</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium mb-3">How It Works</h3>
            <p className="text-gray-700">
              The agent uses a multi-step process to assist you: understanding your needs, gathering relevant information, 
              analyzing options, and providing recommendations. All while maintaining transparency in its thinking process.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium mb-3">Human Oversight</h3>
            <p className="text-gray-700">
              While the agent is powerful, it works best with human guidance. Key decisions always require your approval,
              ensuring that you maintain control while benefiting from AI assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
