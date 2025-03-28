'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useCareerHQConnection } from '@/hooks/useCareerHQConnection';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface ConnectionStatusProps {
  minimal?: boolean;
}

export function ConnectionStatus({ minimal = false }: ConnectionStatusProps) {
  const isConnected = useStore(state => state.isConnected);
  const { reopenConnection, connectionAttempts } = useCareerHQConnection();
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Handle reconnection
  const handleReconnect = () => {
    setIsReconnecting(true);
    reopenConnection();
    
    // Reset after a delay
    setTimeout(() => {
      setIsReconnecting(false);
    }, 2000);
  };

  // Hide tooltip after showing it
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  // Show tooltip when connection status changes
  useEffect(() => {
    setShowTooltip(true);
  }, [isConnected]);

  if (minimal) {
    return (
      <div className="flex items-center">
        {isConnected ? (
          <Wifi className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-500" />
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-8 rounded-full relative ${!isConnected ? 'text-red-500 hover:text-red-600 hover:bg-red-50' : 'text-green-500 hover:text-green-600 hover:bg-green-50'}`}
          onClick={!isConnected ? handleReconnect : undefined}
          disabled={isReconnecting || isConnected}
        >
          {isReconnecting ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : isConnected ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4" />
          )}
          <span className="ml-2 text-xs font-medium">
            {isReconnecting ? 'Reconnecting...' : isConnected ? 'Connected' : 'Disconnected'}
          </span>
          {connectionAttempts > 0 && !isConnected && (
            <span className="ml-1 text-xs">(Attempt {connectionAttempts})</span>
          )}
        </Button>
      </div>
      
      {/* Tooltip that appears when connection status changes */}
      {showTooltip && (
        <div className={`absolute top-full mt-2 right-0 z-50 p-2 rounded-md shadow-lg text-xs font-medium max-w-[200px] ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isConnected ? (
            'Connection established successfully!'
          ) : (
            'Connection lost. Click to reconnect.'
          )}
          <div className={`absolute -top-1 right-4 w-2 h-2 rotate-45 ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}></div>
        </div>
      )}
    </div>
  );
}
