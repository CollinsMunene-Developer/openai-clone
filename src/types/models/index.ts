// Core domain models and database types
export interface BaseEntity {
    id: string | number
    created_at?: string
    updated_at?: string
  }
  
  export interface User extends BaseEntity {
    full_name: string | null
    email: string | null
    avatar_url?: string | null
    organization_id?: string | null
    role?: string | null
    settings?: Json | null
  }
  
  export interface UserAuth extends BaseEntity {
    user_id: string | number
    provider: 'email' | 'google' | 'github' | 'microsoft'
    provider_user_id?: string
    verified: boolean
  }
  
  export interface VerificationToken extends BaseEntity {
    user_id: string | number
    token: string
    expires_at: string
    type: 'email' | 'password_reset'
  }
  
  export interface Database {
    public: {
      Tables: {
        users: {
          Row: User
          Insert: Omit<User, 'created_at' | 'updated_at'>
          Update: Partial<Omit<User, 'id'>>
        }
      }
    }
  }
  
  export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]
  
  export type Tables<T extends keyof Database['public']['Tables']> = 
    Database['public']['Tables'][T]['Row'] 