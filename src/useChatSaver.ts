import { useArtifact } from '@artifact/client/hooks'
import schema from '@dreamcatcher/chats'
import { useCallback } from 'react'

const useChatSaver = () => {
  const artifact = useArtifact()

  const newChat = useCallback(async (): Promise<string> => {
    if (!artifact) {
      throw new Error('No artifact found')
    }

    const fns = artifact.fibers.actions.bind(schema)
    const { chatId } = await fns.newChat({ config: { model: 'gpt-4o' } })
    return chatId
  }, [artifact])

  const deleteChat = useCallback(
    async (chatId: string): Promise<void> => {
      if (!artifact) {
        throw new Error('No artifact found')
      }
      const fns = artifact.fibers.actions.bind(schema)
      await fns.deleteChat({ chatId })
    },
    [artifact]
  )

  return { newChat, deleteChat }
}

export default useChatSaver
