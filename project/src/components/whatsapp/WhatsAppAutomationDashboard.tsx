import React, { useState } from 'react'
import { Plus, MessageCircle, TrendingUp, Users, Calendar, Clock, CheckCircle, AlertCircle, Settings } from 'lucide-react'
import { SearchInput } from './SearchInput'
import { MessageTable } from './MessageTable'
import { NewMessageModal } from './NewMessageModal'
import { ReplyViewer } from './ReplyViewer'
import { useMessages } from '../../hooks/useMessages'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import { format } from 'date-fns'

export const WhatsAppAutomationDashboard: React.FC = () => {
  const { messages, stats, loading, createMessage, updateMessage, deleteMessage, getRepliesForMessage } = useMessages()
  const { session, disconnect } = useWhatsApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [messageReplies, setMessageReplies] = useState<any[]>([])
  const [activeFilter, setActiveFilter] = useState<'all' | 'sent' | 'scheduled' | 'failed'>('all')

  const handleNewMessage = async (data: {
    content: string
    recipients: string[]
    scheduledTime?: string
  }) => {
    await createMessage(data)
    setIsNewMessageModalOpen(false)
  }

  const handleViewMessage = async (message: any) => {
    setSelectedMessage(message)
    const replies = await getRepliesForMessage(message.id)
    setMessageReplies(replies)
  }

  const handleEditMessage = async (message: any) => {
    // For demo purposes, we'll just show a toast
    console.log('Edit message:', message)
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.recipients.some((recipient: string) => 
        recipient.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    const matchesFilter = activeFilter === 'all' || message.status === activeFilter
    
    return matchesSearch && matchesFilter
  })

  const nextScheduledMessage = messages
    .filter(m => m.status === 'scheduled' && m.scheduled_time)
    .sort((a, b) => new Date(a.scheduled_time!).getTime() - new Date(b.scheduled_time!).getTime())[0]

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">WhatsApp Automation</h1>
              <p className="text-gray-600 mt-2">Manage your automated WhatsApp messages and view replies</p>
              {session && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Connected</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    Since {format(new Date(session.linked_at || session.created_at), 'MMM d, yyyy')}
                  </span>
                  <button
                    onClick={disconnect}
                    className="text-sm text-red-600 hover:text-red-700 font-medium ml-4"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsNewMessageModalOpen(true)}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>New Message</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalMessages}</p>
                <p className="text-xs text-blue-600 mt-1">All time</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-gray-800">{stats.sentMessages}</p>
                <p className="text-xs text-green-600 mt-1">Successfully delivered</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-800">{stats.scheduledMessages}</p>
                <p className="text-xs text-orange-600 mt-1">
                  {nextScheduledMessage 
                    ? `Next: ${format(new Date(nextScheduledMessage.scheduled_time!), 'MMM d, h:mm a')}`
                    : 'No scheduled messages'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-gray-800">{stats.responseRate}%</p>
                <p className="text-xs text-purple-600 mt-1">{stats.totalReplies} total replies</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { key: 'all', label: 'All Messages', count: stats.totalMessages },
              { key: 'sent', label: 'Sent', count: stats.sentMessages },
              { key: 'scheduled', label: 'Scheduled', count: stats.scheduledMessages },
              { key: 'failed', label: 'Failed', count: stats.failedMessages }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeFilter === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search messages, contacts, or content..."
          />
        </div>

        {/* Messages Table */}
        <div className="mb-8">
          <MessageTable
            messages={filteredMessages}
            onView={handleViewMessage}
            onEdit={handleEditMessage}
            onDelete={deleteMessage}
          />
        </div>

        {/* Replies Section */}
        {selectedMessage && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Message Replies
              </h2>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Hide Replies
              </button>
            </div>
            <ReplyViewer
              replies={messageReplies}
              messageContent={selectedMessage.content}
            />
          </div>
        )}

        {/* New Message Modal */}
        <NewMessageModal
          isOpen={isNewMessageModalOpen}
          onClose={() => setIsNewMessageModalOpen(false)}
          onSubmit={handleNewMessage}
        />
      </div>
    </div>
  )
}