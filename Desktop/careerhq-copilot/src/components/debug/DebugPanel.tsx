'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useCareerHQConnection } from '@/hooks/useCareerHQConnection';
import { Bug, X, RefreshCw, Database, Activity } from 'lucide-react';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const store = useStore();
  const { reopenConnection, connectionError, connectionAttempts } = useCareerHQConnection();
  const [eventLog, setEventLog] = useState<{type: string, timestamp: string, data: any}[]>([]);

  // Add event to the log
  const addEvent = (type: string, data: any) => {
    setEventLog(prev => [
      { 
        type, 
        timestamp: new Date().toISOString(), 
        data 
      },
      ...prev.slice(0, 49) // Keep only the 50 most recent events
    ]);
  };

  // Log SSE events
  // Move subscription to useEffect to avoid side effects during render
  useEffect(() => {
    const unsubscribe = useStore.subscribe(
      (state, prevState) => {
        if (state.isConnected !== prevState.isConnected) {
          addEvent('connection', { status: state.isConnected ? 'connected' : 'disconnected' });
        }
      }
    );
    
    // Clean up subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  if (!isOpen) {
    return (
      <Button 
        className="fixed bottom-4 right-4 z-50 opacity-50 hover:opacity-100"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        <Bug className="h-4 w-4 mr-1" /> Debug
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[90vw]">
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex justify-between items-center">
            <span className="flex items-center">
              <Bug className="h-4 w-4 mr-1.5" /> 
              Debug Panel
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="connection" className="w-full">
            <TabsList className="w-full rounded-none">
              <TabsTrigger value="connection" className="flex-1">Connection</TabsTrigger>
              <TabsTrigger value="store" className="flex-1">Store</TabsTrigger>
              <TabsTrigger value="events" className="flex-1">Events</TabsTrigger>
            </TabsList>
            <TabsContent value="connection" className="p-4">
              <div className="text-xs space-y-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold">Status:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${store.isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {store.isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold">Connection Attempts:</span>
                  <span className="text-gray-700">{connectionAttempts}</span>
                </div>
                {connectionError && (
                  <div className="border-b pb-2">
                    <span className="font-semibold block mb-1">Error:</span>
                    <div className="bg-red-50 p-2 rounded text-red-700 text-xs">
                      {connectionError.message}
                    </div>
                  </div>
                )}
                <Button 
                  size="sm" 
                  onClick={() => {
                    reopenConnection();
                    addEvent('action', 'Manual reconnection attempt');
                  }}
                  className="w-full mt-2 text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Reconnect
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="store" className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold">Current Store State</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-6 text-xs"
                  onClick={() => {
                    console.log('Current store state:', store);
                    addEvent('action', 'Store state logged to console');
                  }}
                >
                  Log to Console
                </Button>
              </div>
              <div className="bg-gray-50 rounded border overflow-hidden">
                <pre className="text-xs overflow-auto p-2 max-h-80 text-gray-700">
                  {JSON.stringify({
                    agents: store.agents,
                    taskRegistry: store.taskRegistry,
                    isConnected: store.isConnected,
                    pendingApproval: store.pendingApproval,
                    // Omit large data fields for readability
                    resumeText: store.resumeText?.length > 0 ? `[${store.resumeText.length} characters]` : '',
                    jobDescription: store.jobDescription?.length > 0 ? `[${store.jobDescription.length} characters]` : '',
                  }, null, 2)}
                </pre>
              </div>
            </TabsContent>
            <TabsContent value="events" className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold">Event Log</span>
                <Button 
                  size="sm"
                  variant="outline"
                  className="h-6 text-xs"
                  onClick={() => setEventLog([])}
                >
                  Clear Events
                </Button>
              </div>
              <div className="bg-gray-50 rounded border overflow-auto max-h-80">
                {eventLog.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-xs">
                    No events logged yet
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {eventLog.map((event, index) => (
                      <div key={index} className="p-2 hover:bg-gray-100 text-xs">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium">{event.type}</span>
                          <span className="text-gray-500">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <pre className="text-[10px] mt-1 text-gray-600 overflow-hidden text-ellipsis">
                          {JSON.stringify(event.data, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
