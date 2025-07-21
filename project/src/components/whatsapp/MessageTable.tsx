import React from 'react'
import { format } from 'date-fns'
import { 
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  Phone,
  Users,
  Calendar
} from 'lucide-react'

interface Message {
  id: string
  content: string
  recipients: string[]
  status: 'sent' | 'scheduled' | 'failed'
  scheduled_time?: string
  sent_time?: string
  created_at: string
  reply_count?: number
}

interface MessageTableProps {
  messages: Message[]
  onView: (message: Message) => void
  onEdit: (message: Message) => void
  onDelete: (messageId: string) => void
}

export const MessageTable: React.FC<MessageTableProps> = ({
  messages,
  onView,
  onEdit,
  onDelete
}) => {
  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return 'Sent'
      case 'scheduled':
        return 'Scheduled'
      case 'failed':
        return 'Failed'
      default:
        return 'Unknown'
    }
  }

  const getStatusColor = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatPhoneNumber = (phone: string) => {
    // Simple phone number formatting
    if (phone.startsWith('+')) {
      return phone
    }
    return `+${phone}`
  }

  const truncateContent = (content: string, maxLength: number = 60) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No messages yet</h3>
          <p className="text-gray-600 mb-6">Start by creating your first WhatsApp message to reach your contacts</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              <span>Add contacts</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Schedule messages</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Message</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Recipients</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Time</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Replies</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {messages.map((message) => (
              <tr key={message.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="max-w-xs">
                    <p className="text-sm font-medium text-gray-800 leading-5">
                      {truncateContent(message.content)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.content.length} characters
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {message.recipients.slice(0, 2).map((recipient, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        {formatPhoneNumber(recipient)}
                      </span>
                    ))}
                    {message.recipients.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        <Users className="w-3 h-3 mr-1" />
                        +{message.recipients.length - 2} more
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.recipients.length} recipient{message.recipients.length !== 1 ? 's' : ''}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(message.status)}`}>
                    {getStatusIcon(message.status)}
                    <span className="ml-2">{getStatusText(message.status)}</span>
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-600">
                    {message.status === 'sent' && message.sent_time ? (
                      <div>
                        <p className="font-medium text-green-600">Sent</p>
                        <p className="text-xs">{format(new Date(message.sent_time), 'MMM d, yyyy')}</p>
                        <p className="text-xs">{format(new Date(message.sent_time), 'h:mm a')}</p>
                      </div>
                    ) : message.status === 'scheduled' && message.scheduled_time ? (
                      <div>
                        <p className="font-medium text-blue-600">Scheduled</p>
                        <p className="text-xs">{format(new Date(message.scheduled_time), 'MMM d, yyyy')}</p>
                        <p className="text-xs">{format(new Date(message.scheduled_time), 'h:mm a')}</p>
                      </div>
                    ) : message.status === 'failed' ? (
                      <div>
                        <p className="font-medium text-red-600">Failed</p>
                        <p className="text-xs">{format(new Date(message.created_at), 'MMM d, yyyy')}</p>
                        <p className="text-xs">{format(new Date(message.created_at), 'h:mm a')}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-gray-600">Created</p>
                        <p className="text-xs">{format(new Date(message.created_at), 'MMM d, yyyy')}</p>
                        <p className="text-xs">{format(new Date(message.created_at), 'h:mm a')}</p>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">{message.reply_count || 0}</span>
                    </div>
                    {(message.reply_count || 0) > 0 && (
                      <button
                        onClick={() => onView(message)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View
                      </button>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onView(message)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View message details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {message.status === 'scheduled' && (
                      <button
                        onClick={() => onEdit(message)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit scheduled message"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this message?')) {
                          onDelete(message.id)
                        }
                      }}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}