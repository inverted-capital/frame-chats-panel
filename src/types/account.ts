import { z } from 'zod'

export const accountDataSchema = z.object({
  name: z.string()
})

export type AccountData = z.infer<typeof accountDataSchema>
