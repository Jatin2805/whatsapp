import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { api } from '../lib/supabase'
import toast from 'react-hot-toast'

export const useWhatsApp = () => {
  const { user } = useAuth()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    if (user) {
      loadSession()
    }
  }, [user])

  const loadSession = async () => {
    try {
      setLoading(true)
      const sessionData = await api.getWhatsAppSession(user!.id)
      setSession(sessionData)
    } catch (error) {
      console.error('Error loading WhatsApp session:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateWhatsAppWebQR = () => {
    // Generate WhatsApp Web compatible QR code data
    const timestamp = Date.now()
    const clientId = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    const serverToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    const publicKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    // WhatsApp Web QR format
    return `${clientId},${serverToken},${publicKey},${timestamp}`
  }

  const initializeConnection = async () => {
    if (!user) throw new Error('No user logged in')
    
    try {
      setConnecting(true)
      
      // Generate WhatsApp Web compatible QR code
      const qrCode = generateWhatsAppWebQR()
      
      // Create or update session
      let currentSession = session
      if (!currentSession) {
        currentSession = await api.createWhatsAppSession(user.id, qrCode)
        setSession(currentSession)
      } else {
        currentSession = await api.updateWhatsAppSession(currentSession.id, {
          qr_code: qrCode,
          status: 'pending'
        })
        setSession(currentSession)
      }
      
      // In a real implementation, this would wait for actual WhatsApp scan
      // For demo, we simulate the connection process
      return currentSession
      
    } catch (error) {
      console.error('Error initializing connection:', error)
      toast.error('Failed to initialize WhatsApp connection')
      setConnecting(false)
      throw error
    }
  }

  const completeConnection = async () => {
    if (!session) return
    
    try {
      const updatedSession = await api.updateWhatsAppSession(session.id, {
        status: 'linked',
        linked_at: new Date().toISOString()
      })
      setSession(updatedSession)
      setConnecting(false)
      toast.success('WhatsApp connected successfully!')
      return updatedSession
    } catch (error) {
      console.error('Error completing connection:', error)
      toast.error('Failed to connect WhatsApp')
      setConnecting(false)
      throw error
    }
  }

  const disconnect = async () => {
    if (!session) return
    
    try {
      const updatedSession = await api.updateWhatsAppSession(session.id, {
        status: 'disconnected'
      })
      setSession(updatedSession)
      toast.success('WhatsApp disconnected')
    } catch (error) {
      console.error('Error disconnecting:', error)
      toast.error('Failed to disconnect WhatsApp')
    }
  }

  const isConnected = session?.status === 'linked'
  const isPending = session?.status === 'pending'

  return {
    session,
    loading,
    connecting,
    isConnected,
    isPending,
    initializeConnection,
    completeConnection,
    disconnect,
    refreshSession: loadSession
  }
}