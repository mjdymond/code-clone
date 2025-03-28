'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error('Captured in error boundary:', event.error);
      setError(event.error);
      setHasError(true);
      event.preventDefault();
    };

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection captured:', event.reason);
      if (event.reason instanceof Error) {
        setError(event.reason);
      } else {
        setError(new Error(String(event.reason)));
      }
      setHasError(true);
      event.preventDefault();
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="bg-red-50 text-red-800">
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-700 mb-4">
              We encountered an error while rendering this component. Our team has been notified.
            </p>
            {error && (
              <div className="bg-gray-100 p-3 rounded-md overflow-auto max-h-[200px] text-xs font-mono">
                <p className="font-bold">{error.name}: {error.message}</p>
                <pre className="mt-2 text-gray-700">{error.stack}</pre>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
            <Button onClick={() => {
              setHasError(false);
              setError(null);
            }}>
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
