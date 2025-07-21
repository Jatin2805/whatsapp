// Mock Supabase client for demo purposes
const mockSupabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ error: null }),
    signUp: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null })
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        order: () => ({
          limit: () => ({
            maybeSingle: () => Promise.resolve({ data: null, error: null })
          })
        })
      }),
      order: () => Promise.resolve({ data: [], error: null })
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: {}, error: null })
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: {}, error: null })
        })
      })
    }),
    delete: () => ({
      eq: () => Promise.resolve({ error: null })
    })
  })
}

export const supabase = mockSupabase

// Mock data for demo
let mockMessages: any[] = [
  {
    id: '1',
    user_id: 'demo-user-123',
    content: 'Hello! Welcome to our service. How can we help you today?',
    recipients: ['+1234567890', '+0987654321'],
    status: 'sent',
    sent_time: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    reply_count: 2
  },
  {
    id: '2',
    user_id: 'demo-user-123',
    content: 'Reminder: Your appointment is scheduled for tomorrow at 3 PM.',
    recipients: ['+1122334455'],
    status: 'scheduled',
    scheduled_time: new Date(Date.now() + 86400000).toISOString(),
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    reply_count: 0
  }
]

let mockReplies: any[] = [
  {
    id: '1',
    message_id: '1',
    sender_id: '+1234567890',
    content: 'Thank you for reaching out! I have a question about your pricing.',
    timestamp: new Date(Date.now() - 82800000).toISOString(),
    created_at: new Date(Date.now() - 82800000).toISOString()
  },
  {
    id: '2',
    message_id: '1',
    sender_id: '+0987654321',
    content: 'Got it, thanks for the information!',
    timestamp: new Date(Date.now() - 79200000).toISOString(),
    created_at: new Date(Date.now() - 79200000).toISOString()
  }
]

let mockSession: any = null

// API Functions with mock data
export const api = {
  // Profile functions
  async getProfile(userId: string) {
    return {
      id: userId,
      email: 'demo@example.com',
      full_name: 'Demo User',
      business_name: 'Demo Business',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },

  async updateProfile(userId: string, updates: any) {
    return { ...updates, id: userId }
  },

  // WhatsApp Session functions
  async getWhatsAppSession(userId: string) {
    return mockSession
  },

  async createWhatsAppSession(userId: string, qrCode: string) {
    mockSession = {
      id: 'session-123',
      user_id: userId,
      qr_code: qrCode,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    return mockSession
  },

  async updateWhatsAppSession(sessionId: string, updates: any) {
    if (mockSession) {
      mockSession = { ...mockSession, ...updates, updated_at: new Date().toISOString() }
    }
    return mockSession
  },

  // Message functions
  async getMessages(userId: string) {
    return mockMessages
  },

  async createMessage(messageData: any) {
    const newMessage = {
      id: Date.now().toString(),
      ...messageData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reply_count: 0
    }
    mockMessages.unshift(newMessage)
    return newMessage
  },

  async updateMessage(messageId: string, updates: any) {
    const index = mockMessages.findIndex(m => m.id === messageId)
    if (index !== -1) {
      mockMessages[index] = { ...mockMessages[index], ...updates, updated_at: new Date().toISOString() }
      return mockMessages[index]
    }
    return null
  },

  async deleteMessage(messageId: string) {
    mockMessages = mockMessages.filter(m => m.id !== messageId)
  },

  // Reply functions
  async getReplies(userId: string) {
    return mockReplies
  },

  async getRepliesForMessage(messageId: string) {
    return mockReplies.filter(r => r.message_id === messageId)
  },

  async createReply(replyData: any) {
    const newReply = {
      id: Date.now().toString(),
      ...replyData,
      created_at: new Date().toISOString()
    }
    mockReplies.push(newReply)
    
    // Update reply count for the message
    const messageIndex = mockMessages.findIndex(m => m.id === replyData.message_id)
    if (messageIndex !== -1) {
      mockMessages[messageIndex].reply_count = (mockMessages[messageIndex].reply_count || 0) + 1
    }
    
    return newReply
  },

  // Analytics functions
  async getMessageStats(userId: string) {
    const stats = {
      totalMessages: mockMessages.length,
      sentMessages: mockMessages.filter(m => m.status === 'sent').length,
      scheduledMessages: mockMessages.filter(m => m.status === 'scheduled').length,
      failedMessages: mockMessages.filter(m => m.status === 'failed').length,
      totalReplies: mockReplies.length,
      responseRate: 0
    }
    
    if (stats.sentMessages > 0) {
      const rate = (stats.totalReplies / stats.sentMessages) * 100
      stats.responseRate = Math.min(Math.round(rate), 100) // Cap at 100%
    }
    
    return stats
  }
}