import { useArtifact } from '@artifact/client/hooks'
import type { Chats } from '../types/chat.ts'

const useChatSaver = () => {
  const artifact = useArtifact()

  return async (chats: Chats): Promise<void> => {
    if (!artifact) return
    artifact.files.write.json('chats.json', chats)
    await artifact.branch.write.commit('Update chats')
  }
}

export default useChatSaver
