import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { type ReactNode } from 'react';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { IconAlertTriangle } from '@/shared/ui/icons/AppIcons';

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred in the application.';
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[rgb(var(--bg))]">
      <div className="ui-card max-w-md w-full">
        <EmptyState
          icon={<IconAlertTriangle size={32} className="text-red-500" />}
          title="Something went wrong"
          description={errorMessage}
          action={
            <button onClick={resetErrorBoundary} className="ui-btn ui-btn-primary mt-4">
              Try again
            </button>
          }
        />
      </div>
    </div>
  );
};

export const GlobalErrorBoundary = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.href = '/';
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
