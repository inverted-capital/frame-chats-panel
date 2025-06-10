import { z } from 'zod'

export const chatSchema = z.object({
  id: z.string(),
  title: z.string(),
  lastMessage: z.string().optional(),
  timestamp: z.string()
})

export const chatsSchema = z.array(chatSchema)

export type Chat = z.infer<typeof chatSchema>
export type Chats = z.infer<typeof chatsSchema>
