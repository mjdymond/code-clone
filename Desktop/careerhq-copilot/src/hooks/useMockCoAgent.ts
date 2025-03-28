/**
 * Mock implementation of CopilotKit's useCoAgent hook
 * 
 * This provides a fallback when CopilotKit is not fully set up
 * or when running in environments where the actual hook can't be used.
 */
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';

interface CoAgentOptions<T> {
  name: string;
  initialState: T;
}

interface CoAgentResult<T> {
  state: T;
  setState: (newState: Partial<T>) => void;
}

/**
 * A fallback implementation of the useCoAgent hook
 * that syncs with the Zustand store when possible.
 */
export function useMockCoAgent<T>({ name, initialState }: CoAgentOptions<T>): CoAgentResult<T> {
  // Local state for when the store is not available
  const [localState, setLocalState] = useState<T>(initialState);
  
  // Try to access store state and methods
  const storeState = useStore(state => state.agentStates[name]);
  const setAgentState = useStore(state => state.setAgentState);
  
  // Use store state if available, otherwise use local state
  const state = (storeState || localState) as T;
  
  // Update function that tries store first, falls back to local state
  const setState = (newState: Partial<T>) => {
    if (setAgentState) {
      // If store is available, update through it
      setAgentState(name, { ...state, ...newState });
    } else {
      // Otherwise update local state
      setLocalState(prev => ({ ...prev, ...newState }));
    }
  };
  
  // When mounting, initialize store state if needed
  useEffect(() => {
    if (setAgentState && !storeState) {
      setAgentState(name, initialState);
    }
  }, [name, initialState, setAgentState, storeState]);
  
  return { state, setState };
}
