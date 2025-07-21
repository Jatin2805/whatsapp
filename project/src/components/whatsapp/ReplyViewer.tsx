import React from 'react'
import { format } from 'date-fns'
import { MessageSquare, User, Clock, Phone } from 'lucide-react'

interface Reply {
  id: string
  message_id: string
  sender_id: string
  content: string
  timestamp: string
}

interface ReplyViewerProps {
  replies: Reply[]
  messageContent: string
}

export const ReplyViewer: React.FC<ReplyViewerProps> = ({ replies, messageContent }) => {
  if (replies.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">No replies yet</h3>
        <p className="text-gray-600">Replies to your messages will appear here</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Message Replies</h3>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Original Message:</span> {messageContent}
          </p>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {replies.map((reply) => (
          <div key={reply.id} className="p-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Phone className="w-3 h-3" />
                    <span className="font-medium">{reply.sender_id}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{format(new Date(reply.timestamp), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-800">{reply.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}