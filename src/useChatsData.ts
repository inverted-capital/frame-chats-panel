import { useExists, useJson } from "@artifact/client/hooks";
import { type Chats, chatsSchema } from "./chat.ts";
import { useEffect, useState } from "react";
import schema from "@dreamcatcher/chats/schema";

const useChatsData = () => {
  const exists = useExists("chats.json");
  const raw = useJson("chats.json");
  const [chats, setChats] = useState<Chats>([]);

  useEffect(() => {
    if (raw !== undefined) {
      setChats(chatsSchema.parse(raw));
    }
  }, [raw]);

  const loading = exists === null || (exists && raw === undefined);
  const error = exists === false ? "chats.json not found" : null;

  return { chats, loading, error };
};

export default useChatsData;
