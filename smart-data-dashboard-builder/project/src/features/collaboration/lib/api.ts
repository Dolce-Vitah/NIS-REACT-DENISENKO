import type {
  CreateCommentInput,
  PublishSnapshotInput,
  PublishedSnapshot,
  WidgetComment,
} from '../../../entities/collaboration/types';

const SNAPSHOTS_KEY = 'collab-snapshots-v1';
const COMMENTS_KEY = 'collab-comments-v1';

function load<T>(key: string): T[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, value: T[]): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function publishSnapshot(input: PublishSnapshotInput): Promise<PublishedSnapshot> {
  const snapshots = load<PublishedSnapshot>(SNAPSHOTS_KEY);
  const snapshot: PublishedSnapshot = {
    id: uid(),
    title: input.title,
    createdAt: new Date().toISOString(),
    createdBy: input.createdBy,
    accessRole: input.accessRole,
    dashboard: input.dashboard,
  };
  save(SNAPSHOTS_KEY, [snapshot, ...snapshots]);
  return Promise.resolve(snapshot);
}

export function loadSnapshotById(snapshotId: string): Promise<PublishedSnapshot> {
  const snapshots = load<PublishedSnapshot>(SNAPSHOTS_KEY);
  const snapshot = snapshots.find((item) => item.id === snapshotId);
  if (!snapshot) return Promise.reject(new Error('Snapshot not found'));
  return Promise.resolve(snapshot);
}

export function listComments(snapshotId: string): Promise<WidgetComment[]> {
  const comments = load<WidgetComment & { snapshotId: string }>(COMMENTS_KEY);
  return Promise.resolve(
    comments
      .filter((comment) => comment.snapshotId === snapshotId)
      .map(({ snapshotId, ...rest }) => {
        void snapshotId;
        return rest;
      })
  );
}

export function createComment(input: CreateCommentInput): Promise<WidgetComment> {
  const all = load<WidgetComment & { snapshotId: string }>(COMMENTS_KEY);
  const comment: WidgetComment = {
    id: uid(),
    widgetId: input.widgetId,
    author: input.author,
    message: input.message,
    createdAt: new Date().toISOString(),
    parentId: input.parentId,
  };
  all.push({ ...comment, snapshotId: input.snapshotId });
  save(COMMENTS_KEY, all);
  return Promise.resolve(comment);
}
