import { useState, useEffect } from "react";
import { useCoAgent } from "@copilotkit/react-core";

export type Task = {
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  assigned_to: string;
  created_at: string;
  completed_at: string | null;
  description?: string;
};

export type TaskRegistryState = {
  tasks: Task[];
  completedTasks: Task[];
  overall_completion: number;
};

export function useCareerTaskRegistry() {
  const { state, setState } = useCoAgent<TaskRegistryState>({
    name: "task_registry",
    initialState: {
      tasks: [],
      completedTasks: [],
      overall_completion: 0
    }
  });
  
  const updateTaskStatus = (taskName: string, status: Task['status']) => {
    setState(prevState => {
      const tasks = [...prevState.tasks];
      const taskIndex = tasks.findIndex(t => t.name === taskName);
      
      if (taskIndex !== -1) {
        tasks[taskIndex] = {
          ...tasks[taskIndex],
          status: status,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        };
      }
      
      // Calculate completed tasks
      const completedTasks = tasks.filter(t => t.status === 'completed');
      const overall_completion = tasks.length > 0 
        ? Math.round((completedTasks.length / tasks.length) * 100) 
        : 0;
      
      return {
        ...prevState,
        tasks,
        completedTasks,
        overall_completion
      };
    });
  };

  const addTask = (task: Omit<Task, 'created_at' | 'completed_at'>) => {
    setState(prevState => {
      const newTask = {
        ...task,
        created_at: new Date().toISOString(),
        completed_at: null
      };
      
      return {
        ...prevState,
        tasks: [...prevState.tasks, newTask]
      };
    });
  };
  
  return { 
    tasks: state.tasks,
    completedTasks: state.completedTasks,
    overall_completion: state.overall_completion,
    updateTaskStatus,
    addTask
  };
}
