import { create } from 'zustand';

type JobStatus = 'idle' | 'running' | 'success' | 'error';

export type JobState = {
  status: JobStatus;
  message?: string;
};

type JobsStore = {
  jobs: Record<string, JobState>;
  setRunning: (jobId: string, message?: string) => void;
  setSuccess: (jobId: string, message?: string) => void;
  setError: (jobId: string, message: string) => void;
  clearJob: (jobId: string) => void;
};

export const useJobsStore = create<JobsStore>((set) => ({
  jobs: {},
  setRunning: (jobId, message) =>
    set((s) => ({ jobs: { ...s.jobs, [jobId]: { status: 'running', message } } })),
  setSuccess: (jobId, message) =>
    set((s) => ({ jobs: { ...s.jobs, [jobId]: { status: 'success', message } } })),
  setError: (jobId, message) =>
    set((s) => ({ jobs: { ...s.jobs, [jobId]: { status: 'error', message } } })),
  clearJob: (jobId) =>
    set((s) => {
      const next = { ...s.jobs };
      delete next[jobId];
      return { jobs: next };
    }),
}));
