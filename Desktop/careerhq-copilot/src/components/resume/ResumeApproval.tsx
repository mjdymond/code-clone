'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowLeftRight, 
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCareerApproval } from '@/hooks/useCopilotIntegration';

// Types for the improvement suggestions
interface ResumeImprovement {
  section: string;
  original: string;
  improved: string;
  impact: 'high' | 'medium' | 'low';
  reasoning: string;
}

interface ResumeApprovalData {
  improvements: ResumeImprovement[];
  originalResume: string;
  improvedResume: string;
}

interface ResumeApprovalProps {
  data?: ResumeApprovalData;
  onApprove?: (feedback: string, selections: number[]) => void;
  onReject?: (feedback: string) => void;
  className?: string;
}

/**
 * ResumeApproval Component
 * 
 * A human-in-the-loop interface for reviewing and approving suggested
 * improvements to a resume. Allows for selective approval of changes
 * and provides before/after comparison.
 */
export function ResumeApproval({
  data,
  onApprove,
  onReject,
  className
}: ResumeApprovalProps) {
  const [feedback, setFeedback] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'comparison'>('list');
  const [selectedImprovements, setSelectedImprovements] = useState<number[]>([]);
  
  // Sample data for testing
  const sampleData: ResumeApprovalData = {
    improvements: [
      {
        section: "Skills",
        original: "Proficient in JavaScript and React",
        improved: "Expert in JavaScript, React, TypeScript, and modern frontend frameworks",
        impact: "high",
        reasoning: "More specific skills showcase technical depth and match job requirements better."
      },
      {
        section: "Experience",
        original: "Developed web applications for clients",
        improved: "Led development of responsive web applications resulting in 40% increase in user engagement",
        impact: "medium",
        reasoning: "Quantified achievements make accomplishments more concrete."
      },
      {
        section: "Summary",
        original: "Dedicated web developer with 5 years of experience",
        improved: "Results-driven frontend engineer with 5 years of experience delivering high-performance web applications for enterprise clients",
        impact: "medium",
        reasoning: "More specific role and accomplishments in the summary provide better context."
      },
      {
        section: "Education",
        original: "B.S. in Computer Science",
        improved: "B.S. in Computer Science with focus on Software Engineering",
        impact: "low",
        reasoning: "Adding specialization provides better context for education."
      }
    ],
    originalResume: "# Professional Resume\n\n## Summary\nDedicated web developer with 5 years of experience\n\n## Skills\nProficient in JavaScript and React\n\n## Experience\n### Senior Developer, ABC Company\n* Developed web applications for clients\n* Worked in an agile team\n\n## Education\nB.S. in Computer Science",
    improvedResume: "# Professional Resume\n\n## Summary\nResults-driven frontend engineer with 5 years of experience delivering high-performance web applications for enterprise clients\n\n## Skills\nExpert in JavaScript, React, TypeScript, and modern frontend frameworks\n\n## Experience\n### Senior Developer, ABC Company\n* Led development of responsive web applications resulting in 40% increase in user engagement\n* Implemented CI/CD pipeline reducing deployment time by 30%\n* Collaborated in cross-functional agile teams to deliver projects on time\n\n## Education\nB.S. in Computer Science with focus on Software Engineering"
  };
  
  // Use the provided data or fall back to sample data
  const resumeData = data || sampleData;
  
  // Toggle selecting an improvement
  const toggleSelection = (index: number) => {
    if (selectedImprovements.includes(index)) {
      setSelectedImprovements(selectedImprovements.filter(i => i !== index));
    } else {
      setSelectedImprovements([...selectedImprovements, index]);
    }
  };
  
  // Select all improvements
  const selectAll = () => {
    setSelectedImprovements(resumeData.improvements.map((_, index) => index));
  };
  
  // Deselect all improvements
  const deselectAll = () => {
    setSelectedImprovements([]);
  };
  
  // Handle approval
  const handleApprove = () => {
    if (onApprove) {
      onApprove(feedback, selectedImprovements);
    }
  };
  
  // Handle rejection
  const handleReject = () => {
    if (onReject) {
      onReject(feedback);
    }
  };
  
  // Get the impact color
  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Resume Improvement Suggestions</h2>
        <p className="text-sm text-gray-600 mt-1">
          Review and approve suggested improvements to your resume
        </p>
      </div>
      
      {/* View Mode Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium ${viewMode === 'list' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setViewMode('list')}
        >
          Improvement List
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium ${viewMode === 'comparison' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setViewMode('comparison')}
        >
          Before / After
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {viewMode === 'list' ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">
                {selectedImprovements.length} of {resumeData.improvements.length} improvements selected
              </div>
              <div className="flex space-x-2">
                <button 
                  className="text-xs text-blue-600 hover:text-blue-800" 
                  onClick={selectAll}
                >
                  Select all
                </button>
                <button 
                  className="text-xs text-gray-600 hover:text-gray-800" 
                  onClick={deselectAll}
                >
                  Clear
                </button>
              </div>
            </div>
            
            {/* List of improvements */}
            <div className="space-y-3">
              {resumeData.improvements.map((improvement, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-3 ${selectedImprovements.includes(index) ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => toggleSelection(index)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getImpactColor(improvement.impact)}`}>
                          {improvement.impact === 'high' ? 'High Impact' : improvement.impact === 'medium' ? 'Medium Impact' : 'Minor Impact'}
                        </div>
                        <div className="ml-2 text-sm font-medium text-gray-700">{improvement.section}</div>
                      </div>
                      
                      <div className="mt-2 space-y-2">
                        <div className="text-sm">
                          <div className="text-xs text-gray-500 mb-1">Original:</div>
                          <div className="text-gray-700 bg-gray-50 p-2 rounded border border-gray-200">{improvement.original}</div>
                        </div>
                        
                        <div className="text-sm">
                          <div className="text-xs text-gray-500 mb-1">Improved:</div>
                          <div className="text-gray-700 bg-white p-2 rounded border border-gray-200 font-medium">{improvement.improved}</div>
                        </div>
                        
                        <div className="text-xs text-gray-500 italic">
                          <AlertTriangle size={12} className="inline mr-1 text-amber-500" />
                          {improvement.reasoning}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-3">
                      {selectedImprovements.includes(index) ? (
                        <CheckCircle2 size={20} className="text-blue-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-sm font-medium text-gray-700">Original</div>
              <ArrowLeftRight size={16} className="text-gray-400" />
              <div className="text-sm font-medium text-blue-700">Improved</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-3 bg-gray-50">
                <pre className="text-sm whitespace-pre-wrap font-mono text-gray-700">{resumeData.originalResume}</pre>
              </div>
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <pre className="text-sm whitespace-pre-wrap font-mono text-gray-700">{resumeData.improvedResume}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Feedback textarea */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
          Feedback (optional)
        </label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Add any specific feedback or instructions..."
          className="w-full h-24"
        />
      </div>
      
      {/* Footer with actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {selectedImprovements.length} improvements selected
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleReject}
            className="flex items-center"
          >
            <ThumbsDown size={16} className="mr-2" />
            Reject
          </Button>
          
          <Button
            onClick={handleApprove}
            disabled={selectedImprovements.length === 0}
            className="flex items-center bg-blue-600 hover:bg-blue-700"
          >
            <ThumbsUp size={16} className="mr-2" />
            Apply {selectedImprovements.length} {selectedImprovements.length === 1 ? 'change' : 'changes'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
