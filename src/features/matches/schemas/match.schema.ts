import { z } from 'zod';

const isValidDateTime = (value: string) => !Number.isNaN(new Date(value).getTime());

const metadataSchema = z
  .string()
  .trim()
  .min(1, 'Metadata is required')
  .refine((value) => {
    try {
      const parsed = JSON.parse(value);
      return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed);
    } catch {
      return false;
    }
  }, 'Metadata must be a valid JSON object');

export const matchSchema = z
  .object({
    sport: z
      .string()
      .trim()
      .min(1, 'Sport is required')
      .regex(/^[a-z0-9-_]+$/, 'Lowercase, numbers, hyphen, underscore only'),
    homeTeam: z.string().trim().min(1, 'Home team is required'),
    awayTeam: z.string().trim().min(1, 'Away team is required'),
    startTime: z
      .string()
      .min(1, 'Start time is required')
      .refine(isValidDateTime, 'Start time must be a valid date'),
    endTime: z
      .string()
      .min(1, 'End time is required')
      .refine(isValidDateTime, 'End time must be a valid date'),
    homeScore: z.number().int().min(0, 'Score cannot be negative'),
    awayScore: z.number().int().min(0, 'Score cannot be negative'),
    metadata: metadataSchema,
  })
  .superRefine((data, context) => {
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    if (startTime.getTime() === endTime.getTime()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start time and end time cannot be the same',
        path: ['endTime'],
      });
      return;
    }

    if (startTime >= endTime) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start time must be before end time',
        path: ['endTime'],
      });
    }
  });

export type MatchFormValues = z.infer<typeof matchSchema>;
