import { z } from 'zod';
import { CommentaryEventTypeEnum, CommentaryEventType } from '@/shared/types/models';

const commentaryEventTypes = Object.values(
  CommentaryEventTypeEnum
) as [CommentaryEventType, ...CommentaryEventType[]];

export const commentarySchema = z.object({
  minute: z.number().int().min(0, 'Minute must be non-negative'),
  eventType: z.enum(commentaryEventTypes),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(1000, 'Max 1000 characters'),
  homeScore: z.number().int().min(0, 'Score cannot be negative').optional(),
  awayScore: z.number().int().min(0, 'Score cannot be negative').optional(),
});

export type CommentaryFormValues = z.infer<typeof commentarySchema>;
