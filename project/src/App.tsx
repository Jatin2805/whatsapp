import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import { useWhatsApp } from './hooks/useWhatsApp'
import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './components/dashboard/Dashboard'
import { QRCodeConnect } from './components/whatsapp/QRCodeConnect'
import { WhatsAppAutomationDashboard } from './components/whatsapp/WhatsAppAutomationDashboard'
import { Analytics } from './components/analytics/Analytics'
import { Settings } from './components/settings/Settings'

function App() {
  const { user, loading } = useAuth()
  const { isConnected } = useWhatsApp()
  const [activeTab, setActiveTab] = useState('dashboard')

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show QR code connection screen if WhatsApp is selected but not connected
  if (activeTab === 'whatsapp' && !isConnected) {
    return (
      <>
        <QRCodeConnect 
          onConnected={() => {
            // Stay on WhatsApp tab after connection
          }}
          onBack={() => setActiveTab('dashboard')}
        />
        <Toaster position="top-right" />
      </>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'whatsapp':
        return <WhatsAppAutomationDashboard />
      case 'analytics':
        return <Analytics />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard onNavigate={setActiveTab} />
    }
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        {renderContent()}
      </div>
      <Toaster position="top-right" />
    </>
  )
}

export default App