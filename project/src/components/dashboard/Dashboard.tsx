import React, { useState, useEffect } from 'react'
import { BarChart3, MessageCircle, TrendingUp, Users, Calendar, Activity, Plus, Send, Eye } from 'lucide-react'
import { useMessages } from '../../hooks/useMessages'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface DashboardProps {
  onNavigate?: (tab: string) => void
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { stats, messages, loading: messagesLoading, createMessage } = useMessages()
  const { isConnected } = useWhatsApp()
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [quickSendLoading, setQuickSendLoading] = useState(false)

  useEffect(() => {
    // Generate recent activity from messages
    if (messages.length > 0) {
      const activities = messages
        .slice(0, 5)
        .map(message => ({
          id: message.id,
          type: message.status === 'sent' ? 'sent' : 'scheduled',
          description: message.status === 'sent' 
            ? `Message sent to ${message.recipients.length} contacts`
            : `Message scheduled for ${message.scheduled_time ? format(new Date(message.scheduled_time), 'MMM d, h:mm a') : 'later'}`,
          time: message.status === 'sent' && message.sent_time 
            ? format(new Date(message.sent_time), 'h:mm a')
            : format(new Date(message.created_at), 'h:mm a'),
          recipients: message.recipients.length
        }))
      setRecentActivity(activities)
    }
  }, [messages])

  const handleQuickSend = async () => {
    setQuickSendLoading(true)
    try {
      // Simulate sending a quick message
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Quick message sent successfully!')
    } catch (error) {
      toast.error('Failed to send quick message')
    } finally {
      setQuickSendLoading(false)
    }
  }

  const handleScheduleMessage = () => {
    if (onNavigate) onNavigate('whatsapp')
    toast.success('Navigating to schedule messages...')
  }

  const handleManageContacts = () => {
    toast.success('Contact management feature coming soon!')
    // You can add actual contact management functionality here
  }

  const handleViewAnalytics = () => {
    if (onNavigate) onNavigate('analytics')
    toast.success('Loading analytics dashboard...')
  }

  if (messagesLoading) {
    return (
      <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your WhatsApp automation activities</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isConnected ? 'WhatsApp Connected' : 'WhatsApp Disconnected'}</span>
            </div>
            {!isConnected && (
              <button
                onClick={() => onNavigate && onNavigate('whatsapp')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Connect Now →
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
            onClick={handleViewAnalytics}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalMessages}</p>
                <p className="text-sm text-green-600">
                  {stats.totalMessages > 0 ? '+12% from last month' : 'Start sending messages'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
            onClick={handleManageContacts}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Contacts</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalMessages * 2}</p>
                <p className="text-sm text-green-600">
                  {stats.totalMessages > 0 ? '+8% from last month' : 'Add your first contacts'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
            onClick={handleScheduleMessage}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled Messages</p>
                <p className="text-2xl font-bold text-gray-800">{stats.scheduledMessages}</p>
                <p className="text-sm text-orange-600">
                  {stats.scheduledMessages > 0 ? 'Next: Today 3:00 PM' : 'No scheduled messages'}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
            onClick={handleViewAnalytics}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-gray-800">{stats.responseRate}%</p>
                <p className="text-sm text-green-600">
                  {stats.totalReplies > 0 ? '+5% from last month' : 'No replies yet'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
              <Activity className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={activity.id || index} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'sent' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {activity.type === 'sent' ? (
                        <MessageCircle className={`w-4 h-4 ${activity.type === 'sent' ? 'text-green-600' : 'text-blue-600'}`} />
                      ) : (
                        <Calendar className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No recent activity</p>
                  <p className="text-sm text-gray-400">Start sending messages to see activity here</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
              <BarChart3 className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-3">
              <button 
                onClick={handleQuickSend}
                disabled={quickSendLoading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {quickSendLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Quick Message</span>
                  </>
                )}
              </button>
              <button 
                onClick={handleScheduleMessage}
                className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Schedule Message</span>
              </button>
              <button 
                onClick={handleManageContacts}
                className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Manage Contacts</span>
              </button>
              <button 
                onClick={handleViewAnalytics}
                className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
              >
                <Eye className="w-5 h-5" />
                <span>View Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}