'use client';

import { ReactNode, useEffect } from 'react';
import { useCareerHQConnection } from '@/hooks/useCareerHQConnection';

interface StateProviderProps {
  children: ReactNode;
}

export function StateProvider({ children }: StateProviderProps) {
  // Establish connection to CareerHQ backend
  const { reopenConnection } = useCareerHQConnection();
  
  // Handle reconnection attempts if connection is lost
  useEffect(() => {
    // This would typically check for connection status changes
    // and implement reconnection logic with backoff
    const handleOnline = () => {
      console.log('Network connection restored, reconnecting to CareerHQ...');
      reopenConnection();
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [reopenConnection]);
  
  return <>{children}</>;
}
