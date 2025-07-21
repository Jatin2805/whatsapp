import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { api } from '../lib/supabase'
import toast from 'react-hot-toast'

export const useMessages = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<any[]>([])
  const [replies, setReplies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalMessages: 0,
    sentMessages: 0,
    scheduledMessages: 0,
    failedMessages: 0,
    totalReplies: 0,
    responseRate: 0
  })

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)
      const [messagesData, repliesData, statsData] = await Promise.all([
        api.getMessages(user!.id),
        api.getReplies(user!.id),
        api.getMessageStats(user!.id)
      ])
      
      // Add reply counts to messages
      const messagesWithReplies = messagesData.map(message => ({
        ...message,
        reply_count: repliesData.filter(reply => reply.message_id === message.id).length
      }))
      
      setMessages(messagesWithReplies)
      setReplies(repliesData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const createMessage = async (messageData: {
    content: string
    recipients: string[]
    scheduledTime?: string
  }) => {
    if (!user) throw new Error('No user logged in')
    
    try {
      const newMessage = await api.createMessage({
        user_id: user.id,
        content: messageData.content,
        recipients: messageData.recipients,
        status: messageData.scheduledTime ? 'scheduled' : 'sent',
        scheduled_time: messageData.scheduledTime,
        sent_time: messageData.scheduledTime ? null : new Date().toISOString(),
      })

      // If sending immediately, simulate some replies for demo
      if (!messageData.scheduledTime) {
        setTimeout(() => {
          simulateReplies(newMessage.id, messageData.recipients)
        }, 2000)
      }

      await loadData()
      toast.success(messageData.scheduledTime ? 'Message scheduled successfully!' : 'Message sent successfully!')
      return newMessage
    } catch (error) {
      console.error('Error creating message:', error)
      toast.error('Failed to create message')
      throw error
    }
  }

  const updateMessage = async (messageId: string, updates: any) => {
    try {
      await api.updateMessage(messageId, updates)
      await loadData()
      toast.success('Message updated successfully!')
    } catch (error) {
      console.error('Error updating message:', error)
      toast.error('Failed to update message')
      throw error
    }
  }

  const deleteMessage = async (messageId: string) => {
    try {
      await api.deleteMessage(messageId)
      await loadData()
      toast.success('Message deleted successfully!')
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error('Failed to delete message')
      throw error
    }
  }

  const getRepliesForMessage = async (messageId: string) => {
    try {
      return await api.getRepliesForMessage(messageId)
    } catch (error) {
      console.error('Error getting replies:', error)
      return []
    }
  }

  const simulateReplies = async (messageId: string, recipients: string[]) => {
    const sampleReplies = [
      "Thanks for the message!",
      "Got it, will get back to you soon.",
      "Received 👍",
      "Thank you for reaching out!",
      "Ok, understood.",
      "Perfect timing!",
      "Will do, thanks!",
      "Appreciate the update 🙏"
    ]

    // Simulate some replies (randomly from 1-3 recipients)
    const numReplies = Math.floor(Math.random() * 3) + 1
    const replyingRecipients = recipients.slice(0, numReplies)

    for (const recipient of replyingRecipients) {
      const replyContent = sampleReplies[Math.floor(Math.random() * sampleReplies.length)]
      
      try {
        await api.createReply({
          message_id: messageId,
          sender_id: recipient,
          content: replyContent,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('Error creating simulated reply:', error)
      }
    }

    // Reload data to show new replies
    setTimeout(() => {
      loadData()
    }, 1000)
  }

  return {
    messages,
    replies,
    stats,
    loading,
    createMessage,
    updateMessage,
    deleteMessage,
    getRepliesForMessage,
    refreshData: loadData
  }
}