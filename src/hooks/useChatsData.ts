import { useExists, useJson } from '@artifact/client/hooks'
import { chatsSchema, type Chats } from '../types/chat.ts'
import { useEffect, useState } from 'react'

const useChatsData = () => {
  const exists = useExists('chats.json')
  const raw = useJson('chats.json')
  const [chats, setChats] = useState<Chats>([])

  useEffect(() => {
    if (raw !== undefined) {
      setChats(chatsSchema.parse(raw))
    }
  }, [raw])

  const loading = exists === null || (exists && raw === undefined)
  const error = exists === false ? 'chats.json not found' : null

  return { chats, loading, error }
}

export default useChatsData
