import { useState, useEffect } from 'react'

// Mock user for demo purposes
const mockUser = {
  id: 'demo-user-123',
  email: 'demo@example.com',
  user_metadata: {
    full_name: 'Demo User'
  }
}

const mockProfile = {
  id: 'demo-user-123',
  email: 'demo@example.com',
  full_name: 'Demo User',
  business_name: 'Demo Business',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

export const useAuth = () => {
  const [user, setUser] = useState<any>(mockUser)
  const [profile, setProfile] = useState<any>(mockProfile)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Simulate loading complete
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Mock sign in - always succeeds
    setUser(mockUser)
    setProfile(mockProfile)
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Mock sign up - always succeeds
    setUser(mockUser)
    setProfile({ ...mockProfile, full_name: fullName || 'Demo User' })
  }

  const signOut = async () => {
    // Mock sign out
    setUser(mockUser)
    setProfile(mockProfile)
  }

  const updateProfile = async (updates: any) => {
    const updatedProfile = { ...profile, ...updates }
    setProfile(updatedProfile)
    return updatedProfile
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }
}