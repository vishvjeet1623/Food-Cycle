export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'restaurant' | 'ngo' | 'volunteer' | 'admin'
          name: string
          address: string
          latitude: number | null
          longitude: number | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role: 'restaurant' | 'ngo' | 'volunteer' | 'admin'
          name: string
          address: string
          latitude?: number | null
          longitude?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'restaurant' | 'ngo' | 'volunteer' | 'admin'
          name?: string
          address?: string
          latitude?: number | null
          longitude?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}