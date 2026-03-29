import { z } from 'zod'

export const MAX_FILES_PER_BATCH = 10

export const guestUploadSchema = z.object({
  guestName: z
    .string()
    .trim()
    .min(2, 'Please enter at least 2 characters for the guest name.')
    .max(120, 'Guest name must stay under 120 characters.'),
  files: z
    .array(z.instanceof(File))
    .min(1, 'Select at least one photo to continue.')
    .max(
      MAX_FILES_PER_BATCH,
      `You can upload up to ${MAX_FILES_PER_BATCH} photos per batch.`,
    ),
})
