import { useCallback, useEffect, useState } from 'react'
import { MessageSquare, Plus, Search, Clock, X } from 'lucide-react'
import { useChats } from './useChatsData.ts'
import useChatSaver from './useChatSaver.ts'
import { formatDistanceToNow } from './date.ts'

const ChatsView = () => {
  const { chats, loading } = useChats()
  const { newChat, deleteChat } = useChatSaver()
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleNewChat = useCallback(async () => {
    const chatId = await newChat()
    setCurrentChatId(chatId)
  }, [newChat])

  const handleSelectChat = useCallback(async (chatId: string) => {
    setCurrentChatId(chatId)
  }, [])

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  const filtered = chats.filter((chat) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    // return (
    // chat.title.toLowerCase().includes(q) ||
    // (chat.lastMessage && chat.lastMessage.toLowerCase().includes(q))
    // )
  })

  if (loading) return <p>Loading...</p>

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <MessageSquare className="mr-2" size={24} />
          Recent Chats
        </h1>
        <button
          onClick={handleNewChat}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <Plus size={16} className="mr-2" />
          New Chat
        </button>
      </div>
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={handleSearch}
          className="pl-9 pr-9 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <div className="overflow-y-auto flex-1">
        <div className="grid grid-cols-1 gap-3">
          {/* {filtered.length > 0 ? (
            filtered.map((chat) => (
              <div
                key={chat.id}
                className={`bg-white border ${currentChatId === chat.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => handleSelectChat(chat.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{chat.title}</div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <Clock size={12} className="mr-1" />
                    {formatDistanceToNow(new Date(chat.timestamp))}
                  </div>
                </div>
                {chat.lastMessage && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {chat.lastMessage}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No chats match your search' : 'No chats yet'}
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}

export default ChatsView
