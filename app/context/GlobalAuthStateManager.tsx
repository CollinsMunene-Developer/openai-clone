/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * AuthContext: The Authentication State Manager
 * ------------------------------------------
 * Think of this as the security checkpoint that:
 * 
 * - Manages Authentication State:
 *   • Tracks current user session
 *   • Handles loading states during auth checks
 *   • Maintains real-time auth status
 * 
 * - Provides Global Auth Access:
 *   • Makes user info available throughout the app
 *   • Handles auth state synchronization
 *   • Manages auth status subscriptions
 */

'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { SupabaseClient, User } from '@supabase/supabase-js'
import { createClient } from '@/app/utils/supabase/server'

// Define the shape of our auth context
interface AuthContextType {
  user: User | null       // Current authenticated user or null
  loading: boolean        // Loading state during auth checks
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
})

  // Provider component that wraps app and manages auth state
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Track current user and loading state
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    const initializeSupabase = async () => {
      const client = await createClient()
      setSupabase(client)

      // Check current session on mount
      const checkUser = async () => {
        try {
          // Get session from Supabase
          const { data: { session } } = await client.auth.getSession()
          setUser(session?.user ?? null)
        } catch (error) {
          console.error('Error checking auth status:', error)
          setUser(null)
        } finally {
          setLoading(false)
        }
      }

      checkUser()

      // Set up real-time auth state listener
      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })

      // Cleanup subscription on unmount
      return () => subscription.unsubscribe()
    }

    initializeSupabase()
  }, [])

  // Provide auth context to children
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
} 

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 