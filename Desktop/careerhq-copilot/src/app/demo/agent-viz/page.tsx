'use client';

import React from 'react';
import { AgentConnectionsVisualization } from '@/components/agent/AgentConnectionsVisualization';

export default function AgentVizDemo() {
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
        <h1 className="text-3xl font-bold mb-6">Agent Connections Visualization</h1>
        <p className="text-lg text-gray-700 mb-8">
          This demonstration shows how the CareerHQ agent connects to various external services and platforms.
        </p>
        
        <div className="mb-12">
          <AgentConnectionsVisualization 
            centralAgent={centralAgent}
            serviceAgents={serviceAgents}
            connections={connections}
          />
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">About This Visualization</h2>
          <p className="mb-4">
            The visualization showcases a central node representing the main agent, with connections
            to various external services. The animated beams represent data flowing between the
            agent and these services.
          </p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">Implementation Details:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Radial layout with a central node and surrounding service nodes</li>
            <li>Animated curved beams that visualize data flow between nodes</li>
            <li>SVG paths with gradient animations to show communication direction</li>
            <li>Responsive design that adapts to different viewport sizes</li>
            <li>Customizable colors and curves for each connection</li>
          </ul>
          
          <h3 className="text-lg font-medium mt-6 mb-2">Connected Services:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Google Drive</strong> - For document storage and retrieval</li>
            <li><strong>Google Docs</strong> - For collaborative document editing</li>
            <li><strong>Notion</strong> - For knowledge base and content organization</li>
            <li><strong>WhatsApp</strong> - For messaging and communication</li>
            <li><strong>Zapier</strong> - For workflow automation and integration</li>
            <li><strong>Messenger</strong> - For alternative communication channels</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
