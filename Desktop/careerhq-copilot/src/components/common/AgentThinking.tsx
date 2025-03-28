'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronDown, ChevronUp, Lightbulb, LucideIcon } from 'lucide-react';
import { useCareerAgent } from '@/hooks/useCopilotIntegration';
import { cn } from '@/lib/utils';

interface AgentThinkingProps {
  agentName: string;
  title?: string;
  icon?: LucideIcon;
  initiallyExpanded?: boolean;
  maxLines?: number;
  className?: string;
}

/**
 * AgentThinking Component
 * 
 * Displays real-time agent reasoning with typing animation, collapsible interface,
 * and visual indicators of state changes. This component is key to the transparency
 * aspect of agent-native interfaces.
 */
export function AgentThinking({
  agentName,
  title = "Agent Reasoning",
  icon: Icon = Brain,
  initiallyExpanded = true,
  maxLines = 10,
  className
}: AgentThinkingProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [isThinking, setIsThinking] = useState(false);
  const [displayedThinking, setDisplayedThinking] = useState('');
  const [insights, setInsights] = useState<string[]>([]);
  
  // Connect to agent state via CopilotKit hook
  const { state } = useCareerAgent({
    name: agentName,
    initialState: {
      status: 'idle',
      thinking: '',
      insights: []
    }
  });
  
  // Extract thinking content from agent state
  const thinkingContent = state.thinking || '';
  
  // Update displayed thinking with typing effect
  useEffect(() => {
    if (thinkingContent && state.status === 'thinking') {
      setIsThinking(true);
      
      // If current thinking is completely different, reset display
      if (!thinkingContent.includes(displayedThinking) && thinkingContent.length > 0) {
        setDisplayedThinking('');
      }
      
      // If there's more to show, animate it
      if (displayedThinking.length < thinkingContent.length) {
        const timer = setTimeout(() => {
          setDisplayedThinking(thinkingContent.substring(0, displayedThinking.length + 5));
        }, 10);
        return () => clearTimeout(timer);
      }
    } else {
      setIsThinking(false);
    }
  }, [thinkingContent, displayedThinking, state.status]);
  
  // Extract insights when they're available
  useEffect(() => {
    if (state.insights && Array.isArray(state.insights)) {
      setInsights(state.insights);
    }
  }, [state.insights]);
  
  // Handle toggle expansion
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className={cn(
      "border rounded-lg shadow-sm overflow-hidden bg-white", 
      className
    )}>
      {/* Header with toggle */}
      <div 
        className={cn(
          "flex items-center justify-between px-4 py-3 cursor-pointer",
          isThinking ? "bg-blue-50 border-b border-blue-100" : "bg-gray-50 border-b border-gray-100"
        )}
        onClick={toggleExpansion}
      >
        <div className="flex items-center space-x-2">
          <div className={cn(
            "flex items-center justify-center rounded-full w-6 h-6",
            isThinking ? "animate-pulse text-blue-500" : "text-gray-500"
          )}>
            <Icon size={16} />
          </div>
          <h3 className="font-medium text-gray-800">
            {title} 
            {isThinking && (
              <span className="ml-2 text-blue-500 text-sm font-normal">
                thinking<span className="animate-ellipsis">...</span>
              </span>
            )}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {state.completion_percentage !== undefined && (
            <span className="text-xs text-gray-500">{state.completion_percentage}%</span>
          )}
          {isExpanded ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </div>
      </div>
      
      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Thinking process visualization */}
            {displayedThinking && (
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <div className="font-mono text-sm text-gray-700 whitespace-pre-line overflow-auto max-h-40">
                  {displayedThinking}
                </div>
              </div>
            )}
            
            {/* Insights visualization */}
            {insights.length > 0 && (
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Lightbulb size={14} className="mr-1 text-amber-500" />
                  Key Insights
                </h4>
                <ul className="space-y-1">
                  {insights.map((insight, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-sm text-gray-600 flex items-start"
                    >
                      <span className="mr-2 text-blue-500">•</span>
                      {insight}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Empty state */}
            {!displayedThinking && insights.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500">
                No thinking process recorded yet.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Add CSS for the ellipsis animation
// Add this to your global CSS or a local style block
export function AgentThinkingStyles() {
  return (
    <style jsx global>{`
      @keyframes ellipsis {
        0% { content: '.'; }
        33% { content: '..'; }
        66% { content: '...'; }
      }
      
      .animate-ellipsis::after {
        content: '';
        animation: ellipsis 1.5s infinite;
      }
    `}</style>
  );
}
