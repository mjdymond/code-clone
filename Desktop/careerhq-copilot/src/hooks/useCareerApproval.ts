'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { api } from '@/lib/api';
import { ApprovalData } from '@/types/agent';

interface RenderAndWaitProps<T> {
  args: T;
  handler: (response: any) => void;
}

interface UseCareerApprovalOptions<T extends ApprovalData> {
  name: string; // Name of the approval action
  type: T['type']; // Type of approval (e.g., 'resume_improvements', 'job_application')
  renderAndWait: (props: RenderAndWaitProps<T>) => React.ReactNode;
}

/**
 * Hook for implementing human-in-the-loop approval workflows
 * Similar to CopilotKit's useCopilotAction with renderAndWait but adapted for our needs
 */
export function useCareerApproval<T extends ApprovalData>({
  name,
  type,
  renderAndWait
}: UseCareerApprovalOptions<T>) {
  const pendingApproval = useStore(state => state.pendingApproval);
  const setPendingApproval = useStore(state => state.setPendingApproval);
  const [output, setOutput] = useState<React.ReactNode | null>(null);
  
  useEffect(() => {
    // Check if there's a pending approval of the right type
    if (pendingApproval && pendingApproval.type === type) {
      // Generate the approval UI
      const handleApproval = async (response: { approved: boolean; feedback?: string }) => {
        try {
          // In a real implementation, this would be an actual ID from the backend
          const approvalId = 'approval-' + Date.now();
          
          // Submit the approval decision
          await api.submitApproval(
            approvalId, 
            response.approved, 
            response.feedback
          );
          
          // Clear the pending approval
          setPendingApproval(null);
        } catch (error) {
          console.error('Failed to submit approval:', error);
        }
      };
      
      const rendered = renderAndWait({
        args: pendingApproval as T,
        handler: handleApproval
      });
      
      setOutput(rendered);
    } else {
      setOutput(null);
    }
  }, [pendingApproval, type, setPendingApproval, renderAndWait]);
  
  return output;
}
