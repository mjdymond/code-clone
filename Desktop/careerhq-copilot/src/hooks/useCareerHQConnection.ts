'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/lib/store';
import { api } from '@/lib/api';
import { AgentState, ApprovalData, TaskRegistry } from '@/types/agent';
import { workflowTester } from '@/utils/testing/workflowTester';

/**
 * Hook to manage the connection to the CareerHQ backend
 * Establishes an SSE connection and handles various event types
 */
export function useCareerHQConnection() {
  const { 
    setAgentState, 
    setTaskRegistry, 
    setPendingApproval,
    setIsConnected
  } = useStore();
  
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  const connectionRef = useRef<(() => void) | null>(null);
  const maxRetries = 3;
  
  // Handle agent state updates
  const handleAgentUpdate = (state: AgentState) => {
    setAgentState(state.name, state);
    
    // If the agent is waiting for approval, update the pending approval state
    if (state.waiting_for_approval && state.approval_type) {
      // This would typically be part of the state data, but we're simulating it here
      // In a real implementation, the backend would provide the approval data
      api.getAgentState(state.name)
        .then(fullState => {
          if (fullState.results?.approvalData) {
            setPendingApproval(fullState.results.approvalData as ApprovalData);
          }
        })
        .catch(error => {
          console.error('Failed to get approval data:', error);
        });
    }
  };
  
  // Handle task registry updates
  const handleTaskUpdate = (registry: TaskRegistry) => {
    setTaskRegistry(registry);
  };
  
  // Handle approval requests
  const handleApprovalRequest = (data: ApprovalData) => {
    setPendingApproval(data);
  };
  
  // Handle connection errors
  const handleError = (error: any) => {
    console.error('SSE connection error:', error);
    setConnectionError(error instanceof Error ? error : new Error(String(error)));
    setIsConnected(false);
    
    // Only auto-retry if we haven't exceeded max retries
    if (connectionAttempts < maxRetries) {
      console.log(`Connection attempt ${connectionAttempts + 1} of ${maxRetries}...`);
      setConnectionAttempts(prev => prev + 1);
    } else {
      console.error(`Max connection attempts (${maxRetries}) reached. Switching to fallback mode.`);
      setUseFallbackMode(true);
    }
  };
  
  // Connection establishment function
  const establishConnection = () => {
    try {
      console.log('Establishing SSE connection...');
      
      // If we're in development mode with no backend, use mock mode
      if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
        console.log('Using mock mode (configured via environment)');
        setIsConnected(true);
        return () => {
          // No-op for mock mode
        };
      }
      
      const closeConnection = api.connectToSSE(
        handleAgentUpdate,
        handleTaskUpdate,
        handleApprovalRequest,
        handleError
      );
      
      setIsConnected(true);
      connectionRef.current = closeConnection;
      
      return closeConnection;
    } catch (error) {
      console.error('Failed to establish SSE connection:', error);
      handleError(error);
      return null;
    }
  };

  // Establish the connection on component mount
  useEffect(() => {
    // Skip connection attempt if we're in fallback mode
    if (useFallbackMode) {
      return;
    }
    
    // Try to establish connection
    const closeConnection = establishConnection();
    
    // Clean up the connection on unmount
    return () => {
      if (connectionRef.current) {
        connectionRef.current();
        connectionRef.current = null;
      }
      setIsConnected(false);
    };
  }, [connectionAttempts, useFallbackMode]);
  
  // Setup reconnection on network change
  useEffect(() => {
    const handleOnline = () => {
      console.log('Network connection restored, reconnecting to CareerHQ...');
      setConnectionAttempts(0); // Reset connection attempts
      setConnectionError(null);
      setUseFallbackMode(false);
      reopenConnection();
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);
  
  // Fall back to polling or mock data when SSE fails
  useEffect(() => {
    if (useFallbackMode) {
      console.log('Activating fallback mode...');
      
      // Use workflow tester in development if available
      if (typeof workflowTester !== 'undefined') {
        console.log('Using workflow tester for mock data');
        
        // Initialize mock data with the tester
        const sampleResume = "Senior Frontend Developer with 5+ years experience in React, TypeScript and Next.js";
        workflowTester.startResumeWorkflow(sampleResume);
        
        // Register event handlers
        workflowTester.on('agent_update', (state) => {
          setAgentState(state.name, state);
        });
        
        workflowTester.on('task_update', (registry) => {
          setTaskRegistry(registry);
        });
        
        workflowTester.on('approval_request', (data) => {
          setPendingApproval(data);
        });
        
        setIsConnected(true);
        
        return () => {
          workflowTester.reset();
        };
      } else {
        // Use polling as a fallback
        console.log('Using polling fallback');
        const pollingInterval = setInterval(() => {
          // Poll for agent states
          api.getAgentState('resume_agent')
            .then(state => {
              setAgentState('resume_agent', state);
              setIsConnected(true);
            })
            .catch(err => console.error('Error polling resume agent:', err));
  
          // Poll for tasks
          api.getTaskRegistry()
            .then(registry => {
              setTaskRegistry(registry);
            })
            .catch(err => console.error('Error polling task registry:', err));
        }, 5000);
        
        return () => clearInterval(pollingInterval);
      }
    }
  }, [useFallbackMode]);
  
  // Return the connection controls and state
  return {
    closeConnection: () => {
      if (connectionRef.current) {
        connectionRef.current();
        connectionRef.current = null;
        setIsConnected(false);
      }
    },
    reopenConnection: () => {
      // Close any existing connection
      if (connectionRef.current) {
        connectionRef.current();
        connectionRef.current = null;
      }
      
      // Reset connection state
      setConnectionAttempts(0);
      setConnectionError(null);
      setUseFallbackMode(false);
      
      // Create a new connection
      try {
        console.log('Manually reopening SSE connection...');
        const closeConnection = api.connectToSSE(
          handleAgentUpdate,
          handleTaskUpdate,
          handleApprovalRequest,
          handleError
        );
        
        connectionRef.current = closeConnection;
        setIsConnected(true);
        return true;
      } catch (error) {
        console.error('Failed to reopen connection:', error);
        handleError(error);
        return false;
      }
    },
    connectionError,
    connectionAttempts,
    useFallbackMode,
    activateFallbackMode: () => setUseFallbackMode(true)
  };
}
