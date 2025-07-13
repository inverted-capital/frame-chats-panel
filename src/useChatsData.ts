import { useDir, useJson, useStore } from '@artifact/client/hooks'
import { useMemo } from 'react'
import { configSchema } from '@dreamcatcher/chats/schema'
import type { UIMessage } from 'ai'

export const useChats = () => {
  const dir = useDir('chats/') || []

  const chatIds = dir
    .filter((file) => file.type === 'tree')
    .map((file) => file.path)

  const store = useStore()
  const chats = useMemo(() => {
    if (!store) return []
    if (!chatIds.length) return []
    const { readFile, readDir } = store.getState()
    return chatIds.map((chatId) => {
      const path = 'chats/' + chatId + '/'
      const config = readFile(path + 'config.json', parseConfig)
      const messagesDir = readDir(path + 'messages/') || []
      const messages = messagesDir.map((file) => {
        const message = readFile(path + 'messages/' + file.path, parseConfig)
        return message
      })
      return {
        id: chatId,
        config,
        messages
      }
    })
  }, [chatIds, store])

  return { chatIds, chats, loading: false }
}

export const useChatInfo = (chatId: string) => {
  const json = useJson('chats/' + chatId + '/config.json')
  // run this thru a schema
  // get extra metadata out of the commit history
  return json
}

export const useMessage = (chatId: string, messageId: string) => {
  const json = useJson('chats/' + chatId + '/' + messageId + '.json')

  // discriminate the type based on the role
  // return the schema checked message

  return json
}

const parseConfig = (b: Uint8Array) =>
  configSchema.parse(JSON.parse(new TextDecoder().decode(b)))
