import { CommentaryEventType, CommentaryPayload } from '@/shared/types/models';

export * from '@/shared/types/models';

export type CreateCommentaryPayload = {
  minute: number;
  eventType: CommentaryEventType;
  message: string;
  payload: CommentaryPayload;
};
