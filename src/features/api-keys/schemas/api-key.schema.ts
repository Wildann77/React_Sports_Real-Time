import { z } from 'zod';

export const apiKeySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  scopes: z
    .array(z.string())
    .min(1, 'At least one scope is required'),
  expiresAt: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return !Number.isNaN(new Date(val).getTime());
    }, 'Invalid expiration date')
    .transform((val) => val || undefined),
});

export type ApiKeyFormValues = z.infer<typeof apiKeySchema>;
