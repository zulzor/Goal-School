// src/context/TaskContext.tsx
// Контекст для управления задачами в приложении

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TaskContextType {
  tasks: any[];
  addTask: (task: any) => void;
  removeTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: any) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<any[]>([]);

  const addTask = (task: any) => {
    setTasks(prev => [...prev, task]);
  };

  const removeTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const updateTask = (taskId: string, updates: any) => {
    setTasks(prev => prev.map(task => (task.id === taskId ? { ...task, ...updates } : task)));
  };

  const value = {
    tasks,
    addTask,
    removeTask,
    updateTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
