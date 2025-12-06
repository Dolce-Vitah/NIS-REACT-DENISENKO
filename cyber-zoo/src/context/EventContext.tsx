import React, { createContext, useState, useCallback, useEffect, type ReactNode } from 'react';

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

const STORAGE_KEY_LOGS = 'cyberzoo_logs';

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    try {
      const savedLogs = localStorage.getItem(STORAGE_KEY_LOGS);
      return savedLogs ? JSON.parse(savedLogs) : [];
    } catch (error) {
      console.error('Failed to load logs from storage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to save logs to storage', error);
    }
  }, [logs]);

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
    localStorage.removeItem(STORAGE_KEY_LOGS); 
  }, []);

  return (
    <EventContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </EventContext.Provider>
  );
};