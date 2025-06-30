import { useDir, useFile, useJson } from "@artifact/client/hooks";

export const useChatsData = () => {
  const dir = useDir('chats/')

  if (!dir) return { chats: [], loading: true }
  const chats = dir
  .filter((file) => file.type === 'tree')
  .map((file) => file.path)

  return { chats, loading: false }
};

export const useChat = (chatId: string) => {
  const dir = useDir('chats/' + chatId)
  // get out the config file
  return dir
}

export const useMessage = (chatId: string, messageId: string) => {
  const json = useJson('chats/' + chatId + '/' + messageId)
  return json
}
