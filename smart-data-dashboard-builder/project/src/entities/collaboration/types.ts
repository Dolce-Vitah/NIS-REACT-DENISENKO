import type { DashboardConfig } from '../dashboard/types';

export type AccessRole = 'owner' | 'editor' | 'viewer';

export type PublishedSnapshot = {
  id: string;
  title: string;
  createdAt: string;
  createdBy: string;
  accessRole: AccessRole;
  dashboard: DashboardConfig;
};

export type PublishSnapshotInput = {
  title: string;
  createdBy: string;
  accessRole: AccessRole;
  dashboard: DashboardConfig;
};

export type WidgetComment = {
  id: string;
  widgetId: string;
  author: string;
  message: string;
  createdAt: string;
  parentId?: string;
};

export type CreateCommentInput = {
  snapshotId: string;
  widgetId: string;
  author: string;
  message: string;
  parentId?: string;
};
