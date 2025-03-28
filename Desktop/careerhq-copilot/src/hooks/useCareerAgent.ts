'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { api } from '@/lib/api';
import { AgentState } from '@/types/agent';

interface UseCareerAgentOptions {
  name: string;
  initialState?: Partial<AgentState>;
}

/**
 * Hook for bidirectional state sharing with CareerHQ agents
 * Similar to CopilotKit's useCoAgent but adapted for our specific needs
 */
export function useCareerAgent<T extends AgentState>({ 
  name, 
  initialState = {} 
}: UseCareerAgentOptions) {
  const { agents, setAgentState } = useStore();
  const currentState = agents[name] as T | undefined;
  
  // Initialize agent state if it doesn't exist yet
  useEffect(() => {
    if (!currentState) {
      const defaultState: AgentState = {
        name,
        status: 'idle',
        completion_percentage: 0,
        ...initialState
      };
      
      setAgentState(name, defaultState as AgentState);
      
      // Fetch the current state from the backend
      api.getAgentState(name)
        .then(state => {
          setAgentState(name, state);
        })
        .catch(error => {
          console.error(`Failed to get initial state for ${name}:`, error);
        });
    }
  }, [name, currentState]);
  
  // Function to update the agent state (bidirectional communication)
  const updateState = (updater: Partial<T> | ((prevState: T) => Partial<T>)) => {
    if (!currentState) {
      console.error(`Cannot update state for ${name}: agent state not initialized`);
      return;
    }
    
    const stateUpdate = typeof updater === 'function' 
      ? updater(currentState as T) 
      : updater;
    
    const newState = {
      ...currentState,
      ...stateUpdate
    };
    
    setAgentState(name, newState as AgentState);
    
    // Send the state update to the backend - in a real implementation, this would
    // be done through a dedicated API endpoint or WebSocket
    console.log(`Updated state for ${name}:`, newState);
  };
  
  // Send a message to the agent
  const sendMessage = async (message: string) => {
    try {
      await api.sendAgentMessage(name, message);
    } catch (error) {
      console.error(`Failed to send message to ${name}:`, error);
      throw error;
    }
  };
  
  return {
    state: (currentState || { name, status: 'idle', completion_percentage: 0, ...initialState }) as T,
    updateState,
    sendMessage
  };
}
