"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Brain } from "lucide-react";

interface AgentThinkingProps {
  isThinking: boolean;
  thoughtProcess: string;
  insights?: string[];
  title?: string;
  highlightTerms?: string[];
}

export function AgentThinking({
  isThinking,
  thoughtProcess,
  insights = [],
  title = "Agent Thinking",
  highlightTerms = [],
}: AgentThinkingProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [typingSpeed, setTypingSpeed] = useState(20); // ms per character
  const [typingIndex, setTypingIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset displayed text when thought process changes
  useEffect(() => {
    if (!isThinking) {
      setDisplayedText(thoughtProcess);
      setTypingIndex(thoughtProcess.length);
    } else {
      setTypingIndex(0);
      setDisplayedText("");
    }
  }, [thoughtProcess, isThinking]);

  // Typing animation effect
  useEffect(() => {
    if (!isThinking || typingIndex >= thoughtProcess.length) return;

    const typingTimer = setTimeout(() => {
      setDisplayedText(prev => prev + thoughtProcess.charAt(typingIndex));
      setTypingIndex(prevIndex => prevIndex + 1);
    }, typingSpeed);

    return () => clearTimeout(typingTimer);
  }, [isThinking, thoughtProcess, typingIndex, typingSpeed]);

  // Auto-scroll to bottom while typing
  useEffect(() => {
    if (contentRef.current && isThinking) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [displayedText, isThinking]);

  // Format displayed text with highlighted terms
  const formatText = (text: string) => {
    if (highlightTerms.length === 0) return text;

    // Split by newlines first to preserve them
    const lines = text.split("\n");
    
    return lines.map((line, lineIndex) => {
      let formattedLine = line;
      
      // Apply highlighting for each term
      highlightTerms.forEach(term => {
        const regex = new RegExp(`(${term})`, 'gi');
        formattedLine = formattedLine.replace(regex, '<span class="bg-yellow-100 text-yellow-800 px-1 rounded">$1</span>');
      });
      
      return (
        <span key={lineIndex} dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    }).reduce((acc: React.ReactNode[], line, i) => {
      if (i === 0) return [line];
      return [...acc, <br key={`br-${i}`} />, line];
    }, []);
  };

  return (
    <Card className="bg-slate-50 border shadow-sm overflow-hidden">
      <div className="p-3 bg-slate-100 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-indigo-600" />
          <h3 className="text-sm font-medium">{title}</h3>
          {isThinking && (
            <div className="flex gap-1 items-center ml-2">
              <span className="animate-pulse h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
              <span className="animate-pulse h-1.5 w-1.5 rounded-full bg-indigo-600 animation-delay-200"></span>
              <span className="animate-pulse h-1.5 w-1.5 rounded-full bg-indigo-600 animation-delay-400"></span>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              ref={contentRef}
              className="p-3 max-h-60 overflow-y-auto whitespace-pre-wrap font-mono text-sm"
            >
              {formatText(displayedText)}
              {isThinking && typingIndex < thoughtProcess.length && (
                <span className="inline-block h-4 w-1.5 bg-slate-700 animate-pulse ml-0.5"></span>
              )}
            </div>

            {insights && insights.length > 0 && (
              <div className="p-3 border-t bg-white">
                <h4 className="text-xs font-medium text-slate-500 uppercase mb-2">Key Insights</h4>
                <ul className="space-y-1">
                  {insights.map((insight, index) => (
                    <li key={index} className="text-sm flex gap-2 items-start">
                      <span className="inline-block h-2 w-2 rounded-full bg-indigo-500 mt-1.5"></span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
