import { type ReactNode } from 'react';

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
};

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500">
        {icon}
      </div>
      <h3 className="text-lg font-semibold ui-title mb-1">{title}</h3>
      {description && <p className="text-sm ui-muted max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
};
