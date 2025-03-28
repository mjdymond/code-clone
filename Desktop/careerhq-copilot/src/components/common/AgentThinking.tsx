'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AgentState } from '@/types/agent';
import { CpuIcon, ChevronUp, ChevronDown, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentThinkingProps {
  agentName: string;
  state: AgentState;
  title?: string;
}

export function AgentThinking({ agentName, state, title }: AgentThinkingProps) {
  const [expanded, setExpanded] = useState(true);
  const [lineCount, setLineCount] = useState(0);
  
  if (!state.thinking || state.status !== 'thinking') {
    return null;
  }

  // Count the lines in the thinking text once on component mount
  useEffect(() => {
    if (state.thinking) {
      setLineCount(state.thinking.split('\n').length);
    }
  }, [state.thinking]);
  
  // Create a typing animation effect by incrementally revealing the thinking text
  const typingVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.01
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  return (
    <Card className="w-full bg-blue-50/50 border-blue-100 overflow-hidden">
      <div 
        className="p-3 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <RotateCw className="h-4 w-4 mr-2 text-blue-600 animate-spin" />
          <span className="text-sm font-medium text-blue-700">
            {title || `${agentName} is thinking...`}
          </span>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-blue-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-blue-500" />
          )}
        </Button>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-0 pb-3">
              <motion.div
                className="bg-white p-3 rounded border border-blue-100 text-sm font-mono whitespace-pre-wrap overflow-auto max-h-60 text-gray-700"
                variants={typingVariants}
                initial="hidden"
                animate="visible"
              >
                {state.thinking.split('\n').map((line, lineIndex) => (
                  <div key={lineIndex} className="mb-1">
                    {line}
                  </div>
                ))}
              </motion.div>
              
              {lineCount > 10 && (
                <div className="text-xs text-blue-600 mt-2 text-right">
                  {lineCount} lines of reasoning
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
