import { useCallback, useState, useMemo } from 'react'
import {
  MessageSquare,
  Plus,
  Search,
  Clock,
  X,
  Trash,
  Loader2,
  Play
} from 'lucide-react'
import { useFrame } from '@artifact/client/hooks'
import type { FileScope } from '@artifact/client/api'
import { useChats } from './useChatsData.ts'
import useChatSaver from './useChatSaver.ts'
import { formatDistanceToNow } from './date.ts'
import { isBranchScope } from '@artifact/client/api'

const ChatsView = () => {
  const { chats, loading } = useChats()
  const { newChat, deleteChat } = useChatSaver()
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [newChatLoading, setNewChatLoading] = useState(false)
  const [deletingIds, setDeletingIds] = useState<string[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  )
  const { onNavigateTo, onSelection, target } = useFrame()

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return chats
    const q = searchQuery.toLowerCase()
    return chats.filter((chat) => chat.config?.model?.toLowerCase().includes(q))
  }, [chats, searchQuery])

  const handleNewChat = useCallback(async () => {
    setNewChatLoading(true)
    try {
      const chatId = await newChat()
      setCurrentChatId(chatId)
    } finally {
      setNewChatLoading(false)
    }
  }, [newChat])

  const handleSelectChat = useCallback(
    async (
      chatId: string,
      index: number,
      e: React.MouseEvent<HTMLDivElement>
    ) => {
      if (!isBranchScope(target)) {
        throw new Error('Cannot navigate to chat from non-branch scope')
      }

      if (e.shiftKey && lastSelectedIndex !== null) {
        const start = Math.min(lastSelectedIndex, index)
        const end = Math.max(lastSelectedIndex, index)
        const ids = filtered.slice(start, end + 1).map((c) => c.id)
        setSelectedIds((prev) => Array.from(new Set([...prev, ...ids])))
      } else if (e.ctrlKey || e.metaKey) {
        setSelectedIds((prev) =>
          prev.includes(chatId)
            ? prev.filter((id) => id !== chatId)
            : [...prev, chatId]
        )
        setLastSelectedIndex(index)
      } else {
        setSelectedIds([chatId])
        setCurrentChatId(chatId)
        setLastSelectedIndex(index)
        const scope: FileScope = { ...target, path: `chats/${chatId}` }
        onSelection?.(scope)
      }
    },
    [filtered, lastSelectedIndex, onSelection, target]
  )

  const handleDeleteChat = useCallback(
    async (chatId: string) => {
      setDeletingIds((ids) => [...ids, chatId])
      try {
        await deleteChat(chatId)
      } finally {
        setDeletingIds((ids) => ids.filter((id) => id !== chatId))
      }
    },
    [deleteChat]
  )

  const handleResumeChat = useCallback(
    (chatId: string, e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isBranchScope(target)) {
        throw new Error('Cannot navigate to chat from non-branch scope')
      }
      e.stopPropagation()
      const scope: FileScope = { ...target, path: `chats/${chatId}` }
      onNavigateTo?.(scope)
    },
    [onNavigateTo, target]
  )

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  const handleSelectAll = useCallback(() => {
    setSelectedIds(filtered.map((c) => c.id))
  }, [filtered])

  if (loading) return <p>Loading...</p>

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <MessageSquare className="mr-2" size={24} />
          Recent Chats
        </h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSelectAll}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Select All
          </button>
          <button
            onClick={handleNewChat}
            disabled={newChatLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            {newChatLoading ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <Plus size={16} className="mr-2" />
            )}
            New Chat
          </button>
        </div>
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
          {filtered.length > 0 ? (
            filtered.map((chat, index) => (
              <div
                key={chat.id}
                className={`bg-white border ${currentChatId === chat.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} ${selectedIds.includes(chat.id) ? 'bg-blue-50' : ''} rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer`}
                onClick={(e) => handleSelectChat(chat.id, index, e)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleResumeChat(chat.id, e)}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md flex items-center"
                    >
                      <Play size={12} className="mr-1" /> Resume
                    </button>
                    <div className="font-medium">{chat.id}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {formatDistanceToNow(new Date())}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteChat(chat.id)
                      }}
                      disabled={deletingIds.includes(chat.id)}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      {deletingIds.includes(chat.id) ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Trash size={12} />
                      )}
                    </button>
                  </div>
                </div>
                {chat.messages.length > 0 && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {JSON.stringify(chat.messages[chat.messages.length - 1])}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No chats match your search' : 'No chats yet'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatsView
