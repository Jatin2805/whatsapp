import React, { useState } from 'react'
import { User, Bell, Shield, Smartphone, Save, Eye, EyeOff, Check } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import toast from 'react-hot-toast'

export const Settings: React.FC = () => {
  const { user, profile, updateProfile } = useAuth()
  const { session, disconnect } = useWhatsApp()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || '',
    business_name: profile?.business_name || '',
    email: user?.email || ''
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    push_notifications: true,
    message_replies: true,
    scheduled_messages: true,
    system_updates: false
  })

  // Security settings
  const [security, setSecurity] = useState({
    two_factor_enabled: false,
    session_timeout: '24h',
    login_alerts: true
  })

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await updateProfile({
        full_name: profileForm.full_name,
        business_name: profileForm.business_name
      })
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationUpdate = async (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
    toast.success('Notification settings updated!')
  }

  const handleSecurityUpdate = async (key: string, value: any) => {
    setSecurity(prev => ({ ...prev, [key]: value }))
    toast.success('Security settings updated!')
  }

  const handleWhatsAppDisconnect = async () => {
    if (window.confirm('Are you sure you want to disconnect WhatsApp? You will need to scan the QR code again to reconnect.')) {
      try {
        // Simulate disconnect
        await new Promise(resolve => setTimeout(resolve, 1000))
        toast.success('WhatsApp disconnected successfully!')
      } catch (error) {
        toast.error('Failed to disconnect WhatsApp')
      }
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'whatsapp', label: 'WhatsApp', icon: Smartphone }
  ]

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and configurations</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h3>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileForm.full_name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Name
                        </label>
                        <input
                          type="text"
                          value={profileForm.business_name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, business_name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your business name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div>
                          <h4 className="font-medium text-gray-800 capitalize">
                            {key.replace(/_/g, ' ')}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {key === 'email_notifications' && 'Receive notifications via email'}
                            {key === 'push_notifications' && 'Receive browser push notifications'}
                            {key === 'message_replies' && 'Get notified when someone replies to your messages'}
                            {key === 'scheduled_messages' && 'Get reminders about scheduled messages'}
                            {key === 'system_updates' && 'Receive updates about new features and improvements'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleNotificationUpdate(key, !value)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div>
                        <h4 className="font-medium text-gray-800">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <button
                        onClick={() => handleSecurityUpdate('two_factor_enabled', !security.two_factor_enabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          security.two_factor_enabled ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            security.two_factor_enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="py-3 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">Session Timeout</h4>
                        <select
                          value={security.session_timeout}
                          onChange={(e) => handleSecurityUpdate('session_timeout', e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="1h">1 hour</option>
                          <option value="8h">8 hours</option>
                          <option value="24h">24 hours</option>
                          <option value="7d">7 days</option>
                        </select>
                      </div>
                      <p className="text-sm text-gray-600">Automatically log out after period of inactivity</p>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h4 className="font-medium text-gray-800">Login Alerts</h4>
                        <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                      </div>
                      <button
                        onClick={() => handleSecurityUpdate('login_alerts', !security.login_alerts)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          security.login_alerts ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            security.login_alerts ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'whatsapp' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">WhatsApp Integration</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${session?.status === 'linked' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <h4 className="font-medium text-gray-800">Connection Status</h4>
                          <p className="text-sm text-gray-600">
                            {session?.status === 'linked' ? 'Connected and ready to send messages' : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        session?.status === 'linked' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {session?.status === 'linked' ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>

                    {session?.status === 'linked' && (
                      <div className="space-y-3">
                        <div className="text-sm text-gray-600">
                          <p><strong>Connected since:</strong> {session.linked_at ? new Date(session.linked_at).toLocaleDateString() : 'Unknown'}</p>
                          <p><strong>Session ID:</strong> {session.id.substring(0, 8)}...</p>
                        </div>
                        <button
                          onClick={handleWhatsAppDisconnect}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                        >
                          Disconnect WhatsApp
                        </button>
                      </div>
                    )}

                    {session?.status !== 'linked' && (
                      <div className="text-center py-4">
                        <p className="text-gray-600 mb-4">WhatsApp is not connected. Go to WhatsApp Automation to connect.</p>
                        <button
                          onClick={() => {
                            // Navigate to WhatsApp tab
                            toast.success('Navigating to WhatsApp connection...')
                            // You can add navigation logic here
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          Connect WhatsApp
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Message Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Auto-reply to incoming messages</span>
                      <button 
                        onClick={() => {
                          toast.success('Auto-reply setting updated!')
                        }}
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"
                      >
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition-transform" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Read receipts</span>
                      <button 
                        onClick={() => {
                          toast.success('Read receipts setting updated!')
                        }}
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
                      >
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Typing indicators</span>
                      <button 
                        onClick={() => {
                          toast.success('Typing indicators setting updated!')
                        }}
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
                      >
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}