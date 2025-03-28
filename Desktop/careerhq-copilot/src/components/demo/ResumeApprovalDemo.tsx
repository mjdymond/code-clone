'use client';

import React, { useState } from 'react';
import { ResumeApproval } from '@/components/resume/ResumeApproval';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

export function ResumeApprovalDemo() {
  const [actionTaken, setActionTaken] = useState<'none' | 'approved' | 'rejected'>('none');
  const [feedback, setFeedback] = useState('');
  const [selectedImprovements, setSelectedImprovements] = useState<number[]>([]);
  const [isResetting, setIsResetting] = useState(false);
  
  // Handle approval
  const handleApprove = (feedback: string, selections: number[]) => {
    setFeedback(feedback);
    setSelectedImprovements(selections);
    setActionTaken('approved');
  };
  
  // Handle rejection
  const handleReject = (feedback: string) => {
    setFeedback(feedback);
    setSelectedImprovements([]);
    setActionTaken('rejected');
  };
  
  // Reset the demo
  const resetDemo = () => {
    setIsResetting(true);
    
    // Simulate a slight delay to show the reset animation
    setTimeout(() => {
      setActionTaken('none');
      setFeedback('');
      setSelectedImprovements([]);
      setIsResetting(false);
    }, 500);
  };
  
  // Show result screen if an action has been taken
  if (actionTaken !== 'none') {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          {actionTaken === 'approved' ? (
            <>
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Improvements Applied!</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {selectedImprovements.length} improvements have been applied to your resume.
                {feedback && (
                  <span className="block mt-2">
                    Your feedback: <span className="italic">"{feedback}"</span>
                  </span>
                )}
              </p>
            </>
          ) : (
            <>
              <div className="rounded-full bg-amber-100 p-3">
                <AlertCircle size={28} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Improvements Rejected</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                You have chosen not to apply the suggested improvements.
                {feedback && (
                  <span className="block mt-2">
                    Your feedback: <span className="italic">"{feedback}"</span>
                  </span>
                )}
              </p>
            </>
          )}
          
          <Button 
            onClick={resetDemo}
            className="mt-4 flex items-center"
            disabled={isResetting}
          >
            {isResetting ? (
              <RefreshCw size={16} className="mr-2 animate-spin" />
            ) : (
              <RefreshCw size={16} className="mr-2" />
            )}
            Try Again
          </Button>
        </div>
      </Card>
    );
  }
  
  // Show the approval interface
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Human-in-the-Loop Resume Approval</h3>
        <p className="text-gray-600 mb-6">
          This component demonstrates a key aspect of agent-native interfaces: human approval 
          for important decisions. Users can selectively approve/reject AI-suggested improvements.
        </p>
        
        <ResumeApproval 
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </Card>
    </div>
  );
}
