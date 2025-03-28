'use client';

import React from 'react';
import AgentConnectionsVisualization from '@/components/agent/AgentConnectionsVisualization';

export default function ConnectionsDemo() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto">
        <div className="py-8 px-4">
          <h1 className="text-3xl font-bold mb-6">Agent Connections Visualization</h1>
          <p className="text-lg text-gray-700 mb-8">
            This demonstration shows how the CareerHQ agent connects to various services and platforms.
            Click on any node to see the connection animation.
          </p>
          
          <div className="bg-black rounded-lg overflow-hidden border border-gray-200 shadow-xl">
            <AgentConnectionsVisualization />
          </div>
          
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">About This Visualization</h2>
            <p className="mb-4">
              The visualization demonstrates the central agent and its connections to various services.
              The animated beams visualize data flows between the agent and external services.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Features:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Interactive nodes that respond to clicks</li>
              <li>Animated data flow beams between nodes</li>
              <li>Responsive design that works on various screen sizes</li>
              <li>Automatic cycling through connections for demonstration purposes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
