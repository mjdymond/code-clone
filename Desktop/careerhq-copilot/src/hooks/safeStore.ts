'use client';

import { useStore } from '@/lib/store';

/**
 * A safer version of useStore that handles cases where the store
 * might not be properly initialized or available, especially
 * during server rendering or when components are mounted/unmounted.
 * 
 * @param selector A function that selects a slice of the store state
 * @param defaultValue A default value to return if the store is not available
 * @returns The selected state or the default value
 */
export function useSafeStore<T, U>(
  selector: (state: T) => U,
  defaultValue: U
): U {
  try {
    // Try to access the store through the selector
    // @ts-ignore - we're handling the error case
    const selectedValue = useStore(selector);
    
    // If the value is undefined or null, return the default
    return selectedValue === undefined || selectedValue === null
      ? defaultValue
      : selectedValue;
  } catch (error) {
    // If there's any error accessing the store, return the default value
    console.log('Store access error (safe):', error);
    return defaultValue;
  }
}

/**
 * Get the current store state safely without triggering React
 * re-renders, useful for initialization or in places where
 * hooks can't be used.
 */
export function getSafeStoreState() {
  try {
    return useStore.getState();
  } catch (error) {
    console.log('Store state access error:', error);
    return {}; 
  }
}
