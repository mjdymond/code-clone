'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertTriangle, Lock, RotateCw, WifiOff } from "lucide-react";
import { TaskStatus } from "@/types/agent";
import { useCareerHQConnection } from "@/hooks/useCareerHQConnection";
import { useState } from "react";

export function TaskDashboard() {
  const taskRegistry = useStore(state => state.taskRegistry);
  const isConnected = useStore(state => state.isConnected);
  const { reopenConnection, connectionAttempts, connectionError } = useCareerHQConnection();
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Handle manual reconnect
  const handleReconnect = () => {
    setIsRetrying(true);
    reopenConnection();
    
    // Reset retry state after some time
    setTimeout(() => {
      setIsRetrying(false);
    }, 2000);
  };
  
  // Helper function to get icon based on task status
  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'in_progress':
        return <RotateCw className="h-4 w-4 text-blue-500" />;
      case 'blocked':
        return <Lock className="h-4 w-4 text-orange-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };
  
  // Helper function to get color for progress bar
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'blocked':
        return 'bg-orange-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-200';
    }
  };
  
  // Show connection error state
  if (!isConnected) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            <span>Connection Status</span>
            <Badge variant="outline" className="bg-red-100 text-red-800 ml-2">
              Disconnected
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center py-6">
            <WifiOff className="h-10 w-10 text-red-500 mb-4" />
            <p className="text-center text-gray-700 mb-2">
              Unable to connect to the CareerHQ agent system.
            </p>
            {connectionError && (
              <p className="text-sm text-red-600 text-center mb-4">
                {connectionError.message}
              </p>
            )}
            <Button 
              onClick={handleReconnect}
              disabled={isRetrying}
              className="mt-2"
            >
              {isRetrying ? 'Connecting...' : 'Reconnect'}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Connection attempts: {connectionAttempts}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Workflow Progress</span>
          <Badge variant="outline" className="ml-2">
            {taskRegistry.overall_completion}%
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="overall-progress">
          <Progress value={taskRegistry.overall_completion} className="h-2" />
        </div>
        
        <div className="task-list space-y-3 mt-4">
          {taskRegistry.tasks.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm">No active tasks</p>
            </div>
          ) : (
            taskRegistry.tasks.map((task) => (
              <div key={task.id} className="task-item border-b pb-2 last:border-0">
                <div className="flex items-start">
                  <div className="mr-2 mt-1">{getStatusIcon(task.status)}</div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{task.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {task.assigned_to}
                      </span>
                    </div>
                    
                    {task.status === 'in_progress' && (
                      <div className="mt-1.5">
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getStatusColor(task.status)} rounded-full`}
                            style={{ width: `${task.completion_percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {task.depends_on && task.depends_on.length > 0 && (
                      <div className="mt-1">
                        <span className="text-xs text-gray-500">
                          Depends on: {task.depends_on.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {task.status === 'failed' && task.result?.error && (
                  <div className="mt-1 ml-6">
                    <p className="text-xs text-red-500">{task.result.error}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
