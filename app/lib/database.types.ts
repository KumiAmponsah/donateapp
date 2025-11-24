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
          password_hash: string
          user_type: 'donor' | 'charity_admin'
          first_name: string | null
          last_name: string | null
          phone: string | null
          avatar_url: string | null
          is_active: boolean
          is_verified: boolean
          verification_token: string | null
          reset_token: string | null
          reset_token_expiry: string | null
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          user_type: 'donor' | 'charity_admin'
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          is_verified?: boolean
          verification_token?: string | null
          reset_token?: string | null
          reset_token_expiry?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          user_type?: 'donor' | 'charity_admin'
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          is_verified?: boolean
          verification_token?: string | null
          reset_token?: string | null
          reset_token_expiry?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Relationships: []
      }
      charity_foundations: {
        Row: {
          id: string
          user_id: string | null
          organization_name: string
          legal_name: string | null
          registration_number: string | null
          description: string | null
          mission_statement: string | null
          website_url: string | null
          logo_url: string | null
          banner_image_url: string | null
          category: string
          established_year: number | null
          country: string
          city: string | null
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          bank_name: string | null
          bank_account_number: string | null
          bank_account_name: string | null
          is_verified: boolean
          verification_status: string
          verification_documents: Json | null
          total_funds_raised: number
          total_campaigns: number
          rating: number
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          organization_name: string
          legal_name?: string | null
          registration_number?: string | null
          description?: string | null
          mission_statement?: string | null
          website_url?: string | null
          logo_url?: string | null
          banner_image_url?: string | null
          category: string
          established_year?: number | null
          country: string
          city?: string | null
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          bank_name?: string | null
          bank_account_number?: string | null
          bank_account_name?: string | null
          is_verified?: boolean
          verification_status?: string
          verification_documents?: Json | null
          total_funds_raised?: number
          total_campaigns?: number
          rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          organization_name?: string
          legal_name?: string | null
          registration_number?: string | null
          description?: string | null
          mission_statement?: string | null
          website_url?: string | null
          logo_url?: string | null
          banner_image_url?: string | null
          category?: string
          established_year?: number | null
          country?: string
          city?: string | null
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          bank_name?: string | null
          bank_account_number?: string | null
          bank_account_name?: string | null
          is_verified?: boolean
          verification_status?: string
          verification_documents?: Json | null
          total_funds_raised?: number
          total_campaigns?: number
          rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "charity_foundations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      campaigns: {
        Row: {
          id: string
          charity_id: string | null
          title: string
          description: string
          short_description: string | null
          category: string
          image_url: string | null
          target_amount: number
          amount_raised: number
          progress_percentage: number
          donor_count: number
          currency: string
          status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
          start_date: string
          end_date: string | null
          featured: boolean
          tags: string[] | null
          location: string | null
          beneficiary_count: number | null
          updates_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          charity_id?: string | null
          title: string
          description: string
          short_description?: string | null
          category: string
          image_url?: string | null
          target_amount: number
          amount_raised?: number
          progress_percentage?: number
          donor_count?: number
          currency?: string
          status?: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
          start_date?: string
          end_date?: string | null
          featured?: boolean
          tags?: string[] | null
          location?: string | null
          beneficiary_count?: number | null
          updates_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          charity_id?: string | null
          title?: string
          description?: string
          short_description?: string | null
          category?: string
          image_url?: string | null
          target_amount?: number
          amount_raised?: number
          progress_percentage?: number
          donor_count?: number
          currency?: string
          status?: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
          start_date?: string
          end_date?: string | null
          featured?: boolean
          tags?: string[] | null
          location?: string | null
          beneficiary_count?: number | null
          updates_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_charity_id_fkey"
            columns: ["charity_id"]
            referencedRelation: "charity_foundations"
            referencedColumns: ["id"]
          }
        ]
      }
      donors: {
        Row: {
          id: string
          user_id: string | null
          date_of_birth: string | null
          gender: string | null
          occupation: string | null
          company_name: string | null
          preferred_categories: string[] | null
          communication_preferences: Json | null
          total_donations: number
          total_donation_count: number
          member_since: string
          loyalty_tier: string
          is_anonymous: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          date_of_birth?: string | null
          gender?: string | null
          occupation?: string | null
          company_name?: string | null
          preferred_categories?: string[] | null
          communication_preferences?: Json | null
          total_donations?: number
          total_donation_count?: number
          member_since?: string
          loyalty_tier?: string
          is_anonymous?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          date_of_birth?: string | null
          gender?: string | null
          occupation?: string | null
          company_name?: string | null
          preferred_categories?: string[] | null
          communication_preferences?: Json | null
          total_donations?: number
          total_donation_count?: number
          member_since?: string
          loyalty_tier?: string
          is_anonymous?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donors_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      donations: {
        Row: {
          id: string
          donor_id: string | null
          campaign_id: string | null
          charity_id: string | null
          amount: number
          currency: string
          payment_method: string
          payment_gateway: string
          transaction_reference: string
          paystack_reference: string | null
          status: string
          donor_email: string
          donor_phone: string | null
          donor_name: string | null
          is_anonymous: boolean
          fee_amount: number
          net_amount: number
          payment_metadata: Json | null
          receipt_sent: boolean
          receipt_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          donor_id?: string | null
          campaign_id?: string | null
          charity_id?: string | null
          amount: number
          currency?: string
          payment_method: string
          payment_gateway?: string
          transaction_reference: string
          paystack_reference?: string | null
          status?: string
          donor_email: string
          donor_phone?: string | null
          donor_name?: string | null
          is_anonymous?: boolean
          fee_amount?: number
          net_amount?: number
          payment_metadata?: Json | null
          receipt_sent?: boolean
          receipt_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          donor_id?: string | null
          campaign_id?: string | null
          charity_id?: string | null
          amount?: number
          currency?: string
          payment_method?: string
          payment_gateway?: string
          transaction_reference?: string
          paystack_reference?: string | null
          status?: string
          donor_email?: string
          donor_phone?: string | null
          donor_name?: string | null
          is_anonymous?: boolean
          fee_amount?: number
          net_amount?: number
          payment_metadata?: Json | null
          receipt_sent?: boolean
          receipt_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donations_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_charity_id_fkey"
            columns: ["charity_id"]
            referencedRelation: "charity_foundations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            referencedRelation: "donors"
            referencedColumns: ["id"]
          }
        ]
      }
      campaign_updates: {
        Row: {
          id: string
          campaign_id: string | null
          charity_id: string | null
          title: string
          content: string
          image_url: string | null
          category: string
          is_public: boolean
          is_featured: boolean
          view_count: number
          like_count: number
          read_time_minutes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id?: string | null
          charity_id?: string | null
          title: string
          content: string
          image_url?: string | null
          category?: string
          is_public?: boolean
          is_featured?: boolean
          view_count?: number
          like_count?: number
          read_time_minutes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string | null
          charity_id?: string | null
          title?: string
          content?: string
          image_url?: string | null
          category?: string
          is_public?: boolean
          is_featured?: boolean
          view_count?: number
          like_count?: number
          read_time_minutes?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_updates_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_updates_charity_id_fkey"
            columns: ["charity_id"]
            referencedRelation: "charity_foundations"
            referencedColumns: ["id"]
          }
        ]
      }
      favorites: {
        Row: {
          id: string
          donor_id: string | null
          campaign_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          donor_id?: string | null
          campaign_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          donor_id?: string | null
          campaign_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_donor_id_fkey"
            columns: ["donor_id"]
            referencedRelation: "donors"
            referencedColumns: ["id"]
          }
        ]
      }
      charity_reviews: {
        Row: {
          id: string
          donor_id: string | null
          charity_id: string | null
          rating: number
          title: string | null
          comment: string | null
          is_approved: boolean
          is_anonymous: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          donor_id?: string | null
          charity_id?: string | null
          rating: number
          title?: string | null
          comment?: string | null
          is_approved?: boolean
          is_anonymous?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          donor_id?: string | null
          charity_id?: string | null
          rating?: number
          title?: string | null
          comment?: string | null
          is_approved?: boolean
          is_anonymous?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "charity_reviews_charity_id_fkey"
            columns: ["charity_id"]
            referencedRelation: "charity_foundations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charity_reviews_donor_id_fkey"
            columns: ["donor_id"]
            referencedRelation: "donors"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          title: string
          message: string
          type: string
          related_entity_type: string | null
          related_entity_id: string | null
          is_read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          message: string
          type: string
          related_entity_type?: string | null
          related_entity_id?: string | null
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          message?: string
          type?: string
          related_entity_type?: string | null
          related_entity_id?: string | null
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      payment_transactions: {
        Row: {
          id: string
          donation_id: string | null
          transaction_reference: string
          gateway_reference: string | null
          amount: number
          currency: string
          gateway_name: string
          gateway_response: Json | null
          status: string
          error_message: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          donation_id?: string | null
          transaction_reference: string
          gateway_reference?: string | null
          amount: number
          currency?: string
          gateway_name?: string
          gateway_response?: Json | null
          status: string
          error_message?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          donation_id?: string | null
          transaction_reference?: string
          gateway_reference?: string | null
          amount?: number
          currency?: string
          gateway_name?: string
          gateway_response?: Json | null
          status?: string
          error_message?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_donation_id_fkey"
            columns: ["donation_id"]
            referencedRelation: "donations"
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
export default {};