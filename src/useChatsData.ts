import { useDir, useJson } from '@artifact/client/hooks'

export const useChats = () => {
  const dir = useDir('chats/')

  if (!dir) return { chats: [], loading: true }
  const chats = dir
    .filter((file) => file.type === 'tree')
    .map((file) => file.path)

  return { chats, loading: false }
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
