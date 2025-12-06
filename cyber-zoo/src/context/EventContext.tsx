import React, { createContext, useState, useCallback,type  ReactNode } from 'react';

export interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'alert' | 'success';
  timestamp: string;
}

interface EventContextType {
  logs: LogEntry[];
  addLog: (message: string, type?: LogEntry['type']) => void;
  clearLogs: () => void;
}

export const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    const newLog: LogEntry = {
      id: crypto.randomUUID(), 
      message,
      type,
      timestamp,
    };
    
    setLogs((prev) => {
      const newLogs = [newLog, ...prev];
      return newLogs.slice(0, 50); 
    });
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <EventContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </EventContext.Provider>
  );
};