'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold mb-3">Something went wrong!</h2>
        
        <p className="text-gray-600 mb-6">
          We're sorry, but something went wrong. Our team has been notified of the issue.
        </p>
        
        <div className="space-y-4">
          <Button onClick={reset} className="w-full flex items-center justify-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
          
          <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full">
            Return to home page
          </Button>
        </div>
        
        {error.digest && (
          <p className="text-xs text-gray-500 mt-6">
            Error reference: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
