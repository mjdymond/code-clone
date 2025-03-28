"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedBeam } from './AnimatedBeam';

interface AgentNode {
  id: string;
  name: string;
  type: 'central' | 'service';
  icon: React.ReactNode;
  color: string;
}

interface Connection {
  fromId: string;
  toId: string;
  active: boolean;
  direction: 'inbound' | 'outbound' | 'bidirectional';
}

interface AgentConnectionsVisualizationProps {
  centralAgent: AgentNode;
  serviceAgents: AgentNode[];
  connections: Connection[];
  className?: string;
}

export function AgentConnectionsVisualization({
  centralAgent,
  serviceAgents,
  connections,
  className = '',
}: AgentConnectionsVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodePositions, setNodePositions] = useState<{[key: string]: { x: number; y: number }}>({});
  
  // Calculate node positions in a radial layout
  useEffect(() => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const center = {
      x: containerRect.width / 2,
      y: containerRect.height / 2,
    };
    
    const radius = Math.min(center.x, center.y) * 0.7;
    const positions: {[key: string]: { x: number; y: number }} = {};
    
    // Set central agent position
    positions[centralAgent.id] = { x: center.x, y: center.y };
    
    // Set service agent positions in a circle
    serviceAgents.forEach((agent, index) => {
      const angle = (index / serviceAgents.length) * 2 * Math.PI;
      positions[agent.id] = {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle),
      };
    });
    
    setNodePositions(positions);
  }, [centralAgent, serviceAgents, containerRef]);
  
  // ResizeObserver to recalculate positions on resize
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver(() => {
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const center = {
        x: containerRect.width / 2,
        y: containerRect.height / 2,
      };
      
      const radius = Math.min(center.x, center.y) * 0.7;
      const positions: {[key: string]: { x: number; y: number }} = {};
      
      // Set central agent position
      positions[centralAgent.id] = { x: center.x, y: center.y };
      
      // Set service agent positions in a circle
      serviceAgents.forEach((agent, index) => {
        const angle = (index / serviceAgents.length) * 2 * Math.PI;
        positions[agent.id] = {
          x: center.x + radius * Math.cos(angle),
          y: center.y + radius * Math.sin(angle),
        };
      });
      
      setNodePositions(positions);
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [centralAgent, serviceAgents]);
  
  return (
    <div 
      ref={containerRef}
      className={`agent-connections relative w-full h-96 md:h-[500px] ${className}`}
    >
      {/* Connections */}
      <svg 
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        {Object.keys(nodePositions).length > 0 &&
          connections.map((connection) => {
            const from = nodePositions[connection.fromId];
            const to = nodePositions[connection.toId];
            
            if (!from || !to) return null;
            
            return (
              <AnimatedBeam
                key={`${connection.fromId}-${connection.toId}`}
                startX={from.x}
                startY={from.y}
                endX={to.x}
                endY={to.y}
                active={connection.active}
                direction={connection.direction}
                color={
                  serviceAgents.find((a) => a.id === connection.fromId)?.color ||
                  centralAgent.color
                }
              />
            );
          })}
      </svg>
      
      {/* Nodes */}
      {Object.keys(nodePositions).length > 0 && (
        <>
          {/* Central Agent Node */}
          <motion.div
            className="absolute flex items-center justify-center w-20 h-20 rounded-full text-white shadow-lg"
            style={{ backgroundColor: centralAgent.color }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: nodePositions[centralAgent.id].x - 40, // Center the 80px div
              y: nodePositions[centralAgent.id].y - 40
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-3xl">{centralAgent.icon}</div>
          </motion.div>
          
          {/* Service Agent Nodes */}
          {serviceAgents.map((agent) => (
            <motion.div
              key={agent.id}
              className="absolute flex items-center justify-center w-16 h-16 rounded-full shadow-md"
              style={{ backgroundColor: agent.color, color: 'white' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: nodePositions[agent.id].x - 32, // Center the 64px div
                y: nodePositions[agent.id].y - 32
              }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-2xl">{agent.icon}</div>
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}
