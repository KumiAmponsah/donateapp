import { supabase } from "@/supabase";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: 'donor' | 'organization' | 'admin';
          is_verified: boolean;
          organization_name: string | null;
          organization_description: string | null;
          year_established: number | null;
          contact_email: string | null;
          website: string | null;
          address: string | null;
          total_donations: number;
          total_donation_count: number;
          member_since: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
          is_deleted: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'donor' | 'organization' | 'admin';
          is_verified?: boolean;
          organization_name?: string | null;
          organization_description?: string | null;
          year_established?: number | null;
          contact_email?: string | null;
          website?: string | null;
          address?: string | null;
          total_donations?: number;
          total_donation_count?: number;
          member_since?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
          is_deleted?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'donor' | 'organization' | 'admin';
          is_verified?: boolean;
          organization_name?: string | null;
          organization_description?: string | null;
          year_established?: number | null;
          contact_email?: string | null;
          website?: string | null;
          address?: string | null;
          total_donations?: number;
          total_donation_count?: number;
          member_since?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
          is_deleted?: boolean;
        };
      };
    };
  };
};

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export default supabase;