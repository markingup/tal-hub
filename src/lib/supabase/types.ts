/**
 * Supabase Database Types
 * 
 * Follows UNIX principles:
 * - Single responsibility: Type definitions for Supabase database
 * - Text as interface: TypeScript types as interface
 * - Simple over complex: Clean type exports
 * 
 * This file contains type definitions for your Supabase database.
 * Update these types when your database schema changes.
 * 
 * To generate types automatically, run:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
 */

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
      profiles: {
        Row: {
          id: string
          email: string
          role: 'tenant' | 'landlord' | 'lawyer' | 'admin'
          full_name: string | null
          phone: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'tenant' | 'landlord' | 'lawyer' | 'admin'
          full_name?: string | null
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'tenant' | 'landlord' | 'lawyer' | 'admin'
          full_name?: string | null
          phone?: string | null
          created_at?: string
        }
        Relationships: []
      }
      cases: {
        Row: {
          id: string
          title: string
          type: 'non_payment' | 'repossession' | 'renovation' | 'rent_increase' | 'repairs' | 'other'
          status: 'draft' | 'active' | 'closed' | 'archived'
          created_by: string
          tal_dossier_number: string | null
          opposing_party_name: string | null
          next_hearing_date: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          type: 'non_payment' | 'repossession' | 'renovation' | 'rent_increase' | 'repairs' | 'other'
          status?: 'draft' | 'active' | 'closed' | 'archived'
          created_by: string
          tal_dossier_number?: string | null
          opposing_party_name?: string | null
          next_hearing_date?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          type?: 'non_payment' | 'repossession' | 'renovation' | 'rent_increase' | 'repairs' | 'other'
          status?: 'draft' | 'active' | 'closed' | 'archived'
          created_by?: string
          tal_dossier_number?: string | null
          opposing_party_name?: string | null
          next_hearing_date?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cases_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      case_participants: {
        Row: {
          case_id: string
          user_id: string
          role: 'tenant' | 'landlord' | 'lawyer' | 'admin'
          added_by: string
          created_at: string
        }
        Insert: {
          case_id: string
          user_id: string
          role: 'tenant' | 'landlord' | 'lawyer' | 'admin'
          added_by: string
          created_at?: string
        }
        Update: {
          case_id?: string
          user_id?: string
          role?: 'tenant' | 'landlord' | 'lawyer' | 'admin'
          added_by?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_participants_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_participants_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      documents: {
        Row: {
          id: string
          case_id: string
          user_id: string
          name: string
          type: string
          storage_path: string
          size_bytes: number
          created_at: string
        }
        Insert: {
          id?: string
          case_id: string
          user_id: string
          name: string
          type?: string
          storage_path: string
          size_bytes: number
          created_at?: string
        }
        Update: {
          id?: string
          case_id?: string
          user_id?: string
          name?: string
          type?: string
          storage_path?: string
          size_bytes?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          case_id: string
          sender_id: string
          type: 'text' | 'system'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          case_id: string
          sender_id: string
          type?: 'text' | 'system'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          case_id?: string
          sender_id?: string
          type?: 'text' | 'system'
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      deadlines: {
        Row: {
          id: string
          case_id: string
          title: string
          due_date: string
          is_done: boolean
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          case_id: string
          title: string
          due_date: string
          is_done?: boolean
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          case_id?: string
          title?: string
          due_date?: string
          is_done?: boolean
          created_by?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deadlines_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deadlines_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Common type aliases for convenience
export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

// Convenience type aliases for cases
export type Case = Tables<'cases'>
export type CaseInsert = TablesInsert<'cases'>
export type CaseUpdate = TablesUpdate<'cases'>
export type CaseParticipant = Tables<'case_participants'>
export type CaseParticipantInsert = TablesInsert<'case_participants'>
export type Document = Tables<'documents'>
export type DocumentInsert = TablesInsert<'documents'>
export type DocumentUpdate = TablesUpdate<'documents'>
export type Message = Tables<'messages'>
export type MessageInsert = TablesInsert<'messages'>
export type MessageUpdate = TablesUpdate<'messages'>
export type Deadline = Tables<'deadlines'>
export type DeadlineInsert = TablesInsert<'deadlines'>
export type DeadlineUpdate = TablesUpdate<'deadlines'>

// Case type and status enums
export type CaseType = Case['type']
export type CaseStatus = Case['status']
export type UserRole = CaseParticipant['role']
export type MessageType = Message['type']
