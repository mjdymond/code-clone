/**
 * Mock implementation of CopilotKit's useCoAgent hook
 * 
 * This provides a fallback when CopilotKit is not fully set up
 * or when running in environments where the actual hook can't be used.
 */
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { getSafeStoreState } from './safeStore';

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
  
  // Try to access store state safely to prevent errors
  let storeState;
  let setAgentState;
  
  try {
    // Get store state and agent update function
    const store = getSafeStoreState();
    storeState = store.agents?.[name];
    setAgentState = store.setAgentState;
  } catch (error) {
    console.log('Store access error:', error);
    // If store access fails, we'll use local state only
    storeState = null;
    setAgentState = null;
  }
  
  // Use store state if available, otherwise use local state
  const state = (storeState || localState) as T;
  
  // Update function that tries store first, falls back to local state
  const setState = (newState: Partial<T>) => {
    if (setAgentState) {
      try {
        // If store is available, update through it
        setAgentState(name, { ...state, ...newState });
      } catch (error) {
        console.log('Store update error:', error);
        // If store update fails, update local state instead
        setLocalState(prev => ({ ...prev, ...newState }));
      }
    } else {
      // Otherwise update local state
      setLocalState(prev => ({ ...prev, ...newState }));
    }
  };
  
  // When mounting, initialize store state if needed
  useEffect(() => {
    // Only update store in effect, not during render
    if (setAgentState && !storeState) {
      try {
        setAgentState(name, initialState);
      } catch (error) {
        console.log('Initial state set error:', error);
      }
    }
  }, [name, initialState, setAgentState, storeState]);
  
  return { state, setState };
}
