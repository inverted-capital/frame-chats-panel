import { useArtifact } from "@artifact/client/hooks";
import type { Chats } from "./chat.ts";
import schema from "@dreamcatcher/chats/schema";

const useChatSaver = () => {
  const artifact = useArtifact();

  return async (chats: Chats): Promise<void> => {
    if (!artifact) return;
    artifact.files.write.json("chats.json", chats);
    await artifact.branch.write.commit("Update chats");
  };
};

export default useChatSaver;
