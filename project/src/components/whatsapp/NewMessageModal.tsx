import React, { useState } from 'react'
import { X, Send, Calendar, Users, MessageCircle, Clock, Phone, Plus } from 'lucide-react'

interface NewMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    content: string
    recipients: string[]
    scheduledTime?: string
  }) => void
}

export const NewMessageModal: React.FC<NewMessageModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [content, setContent] = useState('')
  const [recipients, setRecipients] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [messageType, setMessageType] = useState<'immediate' | 'scheduled'>('immediate')
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!content.trim()) {
      newErrors.content = 'Message content is required'
    }
    
    if (!recipients.trim()) {
      newErrors.recipients = 'At least one recipient is required'
    } else {
      const recipientList = recipients.split(',').map(r => r.trim()).filter(r => r.length > 0)
      if (recipientList.length === 0) {
        newErrors.recipients = 'At least one valid recipient is required'
      }
    }
    
    if (messageType === 'scheduled' && !scheduledTime) {
      newErrors.scheduledTime = 'Scheduled time is required'
    }
    
    if (messageType === 'scheduled' && scheduledTime) {
      const scheduledDate = new Date(scheduledTime)
      const now = new Date()
      if (scheduledDate <= now) {
        newErrors.scheduledTime = 'Scheduled time must be in the future'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const recipientList = recipients
      .split(',')
      .map(r => r.trim())
      .filter(r => r.length > 0)
      .map(r => r.startsWith('+') ? r : `+${r}`)

    onSubmit({
      content: content.trim(),
      recipients: recipientList,
      scheduledTime: messageType === 'scheduled' ? scheduledTime : undefined
    })

    // Reset form
    setContent('')
    setRecipients('')
    setScheduledTime('')
    setMessageType('immediate')
    setErrors({})
  }

  const handleClose = () => {
    setContent('')
    setRecipients('')
    setScheduledTime('')
    setMessageType('immediate')
    setErrors({})
    onClose()
  }

  const addSampleRecipients = () => {
    const samples = ['+1234567890', '+0987654321', '+1122334455']
    setRecipients(samples.join(', '))
  }

  if (!isOpen) return null

  const characterCount = content.length
  const maxCharacters = 1000
  const recipientCount = recipients.split(',').map(r => r.trim()).filter(r => r.length > 0).length

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">New Message</h2>
                <p className="text-sm text-gray-600">Send or schedule a WhatsApp message</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Message Type Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Message Type
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setMessageType('immediate')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  messageType === 'immediate'
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Send className="w-5 h-5" />
                <span className="font-medium">Send Now</span>
              </button>
              <button
                type="button"
                onClick={() => setMessageType('scheduled')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  messageType === 'scheduled'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Schedule</span>
              </button>
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-3">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Message Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Type your message here... You can use emojis and line breaks."
            />
            <div className="flex justify-between items-center text-sm">
              <span className={`${errors.content ? 'text-red-600' : 'text-gray-500'}`}>
                {errors.content || 'Press Enter for line breaks'}
              </span>
              <span className={`${characterCount > maxCharacters ? 'text-red-600' : 'text-gray-500'}`}>
                {characterCount}/{maxCharacters}
              </span>
            </div>
          </div>

          {/* Recipients */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="recipients" className="block text-sm font-medium text-gray-700">
                Recipients
              </label>
              <button
                type="button"
                onClick={addSampleRecipients}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add samples</span>
              </button>
            </div>
            <div className="relative">
              <Users className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                id="recipients"
                type="text"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.recipients ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., +1234567890, +0987654321, +1122334455"
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className={`${errors.recipients ? 'text-red-600' : 'text-gray-500'}`}>
                {errors.recipients || 'Enter phone numbers with country codes, separated by commas'}
              </span>
              <span className="text-gray-500 flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>{recipientCount} recipient{recipientCount !== 1 ? 's' : ''}</span>
              </span>
            </div>
          </div>

          {/* Scheduled Time */}
          {messageType === 'scheduled' && (
            <div className="space-y-3">
              <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700">
                Scheduled Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  id="scheduledTime"
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.scheduledTime ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.scheduledTime && (
                <p className="text-sm text-red-600">{errors.scheduledTime}</p>
              )}
            </div>
          )}

          {/* Preview */}
          {content && recipients && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{content}</p>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Will be sent to {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}
                {messageType === 'scheduled' && scheduledTime && (
                  <span> on {new Date(scheduledTime).toLocaleDateString()} at {new Date(scheduledTime).toLocaleTimeString()}</span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim() || !recipients.trim() || characterCount > maxCharacters}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2 font-medium"
            >
              {messageType === 'immediate' ? (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Now</span>
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  <span>Schedule Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}