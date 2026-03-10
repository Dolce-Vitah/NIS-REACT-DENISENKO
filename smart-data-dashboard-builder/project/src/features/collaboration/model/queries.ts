import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createComment, listComments, loadSnapshotById, publishSnapshot } from '../lib/api';
import type {
  CreateCommentInput,
  PublishSnapshotInput,
} from '../../../entities/collaboration/types';

export const collaborationKeys = {
  snapshot: (snapshotId: string) => ['snapshot', snapshotId] as const,
  comments: (snapshotId: string) => ['comments', snapshotId] as const,
};

export function useSnapshotQuery(snapshotId: string) {
  return useQuery({
    queryKey: collaborationKeys.snapshot(snapshotId),
    queryFn: () => loadSnapshotById(snapshotId),
    enabled: Boolean(snapshotId),
  });
}

export function usePublishSnapshotMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PublishSnapshotInput) => publishSnapshot(input),
    onSuccess: (snapshot) => {
      queryClient.setQueryData(collaborationKeys.snapshot(snapshot.id), snapshot);
    },
  });
}

export function useCommentsQuery(snapshotId: string) {
  return useQuery({
    queryKey: collaborationKeys.comments(snapshotId),
    queryFn: () => listComments(snapshotId),
    enabled: Boolean(snapshotId),
  });
}

export function useCreateCommentMutation(snapshotId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<CreateCommentInput, 'snapshotId'>) =>
      createComment({ ...input, snapshotId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: collaborationKeys.comments(snapshotId) });
    },
  });
}
