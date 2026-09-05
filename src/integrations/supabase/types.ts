export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      business_profiles: {
        Row: {
          created_at: string
          description: string | null
          disqualifiers: Json
          id: string
          industries: string[]
          organization_id: string
          qualification_config: Json
          service_areas: string[]
          status: string
          target_customers: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          disqualifiers?: Json
          id?: string
          industries?: string[]
          organization_id: string
          qualification_config?: Json
          service_areas?: string[]
          status?: string
          target_customers?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          disqualifiers?: Json
          id?: string
          industries?: string[]
          organization_id?: string
          qualification_config?: Json
          service_areas?: string[]
          status?: string
          target_customers?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      experience_versions: {
        Row: {
          created_at: string
          created_by: string | null
          definition: Json
          experience_id: string
          id: string
          organization_id: string
          published_at: string | null
          qualification_rules: Json
          schema_version: number
          version_number: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          definition: Json
          experience_id: string
          id?: string
          organization_id: string
          published_at?: string | null
          qualification_rules?: Json
          schema_version?: number
          version_number: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          definition?: Json
          experience_id?: string
          id?: string
          organization_id?: string
          published_at?: string | null
          qualification_rules?: Json
          schema_version?: number
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "experience_versions_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experience_versions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          active_version_id: string | null
          branding: Json
          created_at: string
          goal: string
          id: string
          name: string
          organization_id: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          active_version_id?: string | null
          branding?: Json
          created_at?: string
          goal: string
          id?: string
          name: string
          organization_id: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          active_version_id?: string | null
          branding?: Json
          created_at?: string
          goal?: string
          id?: string
          name?: string
          organization_id?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      interaction_events: {
        Row: {
          event_name: string
          id: string
          metadata: Json
          occurred_at: string
          organization_id: string
          phase: string | null
          question_key: string | null
          session_id: string | null
        }
        Insert: {
          event_name: string
          id?: string
          metadata?: Json
          occurred_at?: string
          organization_id: string
          phase?: string | null
          question_key?: string | null
          session_id?: string | null
        }
        Update: {
          event_name?: string
          id?: string
          metadata?: Json
          occurred_at?: string
          organization_id?: string
          phase?: string | null
          question_key?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interaction_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interaction_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "interaction_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      interaction_messages: {
        Row: {
          actor: string
          content: string
          created_at: string
          id: string
          metadata: Json
          organization_id: string
          session_id: string
        }
        Insert: {
          actor: string
          content: string
          created_at?: string
          id?: string
          metadata?: Json
          organization_id: string
          session_id: string
        }
        Update: {
          actor?: string
          content?: string
          created_at?: string
          id?: string
          metadata?: Json
          organization_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interaction_messages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interaction_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "interaction_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      interaction_sessions: {
        Row: {
          completed_at: string | null
          consent_at: string | null
          current_phase: string
          experience_id: string
          experience_version_id: string
          expires_at: string
          id: string
          is_demo: boolean
          last_activity_at: string
          locale: string
          organization_id: string
          public_token_hash: string
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          consent_at?: string | null
          current_phase?: string
          experience_id: string
          experience_version_id: string
          expires_at?: string
          id?: string
          is_demo?: boolean
          last_activity_at?: string
          locale?: string
          organization_id: string
          public_token_hash: string
          started_at?: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          consent_at?: string | null
          current_phase?: string
          experience_id?: string
          experience_version_id?: string
          expires_at?: string
          id?: string
          is_demo?: boolean
          last_activity_at?: string
          locale?: string
          organization_id?: string
          public_token_hash?: string
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "interaction_sessions_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interaction_sessions_experience_version_id_fkey"
            columns: ["experience_version_id"]
            isOneToOne: false
            referencedRelation: "experience_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interaction_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_sources: {
        Row: {
          content: string | null
          created_at: string
          error_message: string | null
          id: string
          last_processed_at: string | null
          organization_id: string
          source_url: string | null
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          last_processed_at?: string | null
          organization_id: string
          source_url?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          last_processed_at?: string | null
          organization_id?: string
          source_url?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_sources_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_scores: {
        Row: {
          created_at: string
          dimension: string
          id: string
          lead_id: string
          organization_id: string
          reasons: Json
          rule_version: number
          score: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dimension: string
          id?: string
          lead_id: string
          organization_id: string
          reasons?: Json
          rule_version?: number
          score?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dimension?: string
          id?: string
          lead_id?: string
          organization_id?: string
          reasons?: Json
          rule_version?: number
          score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_scores_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_scores_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company_name: string | null
          completeness_score: number | null
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          intent: string | null
          missing_fields: string[]
          organization_id: string
          overall_score: number | null
          phone: string | null
          recommended_action: string | null
          session_id: string
          status: string
          summary: string | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          completeness_score?: number | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          intent?: string | null
          missing_fields?: string[]
          organization_id: string
          overall_score?: number | null
          phone?: string | null
          recommended_action?: string | null
          session_id: string
          status?: string
          summary?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          completeness_score?: number | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          intent?: string | null
          missing_fields?: string[]
          organization_id?: string
          overall_score?: number | null
          phone?: string | null
          recommended_action?: string | null
          session_id?: string
          status?: string
          summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "interaction_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          organization_id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          organization_id: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          organization_id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          brand_config: Json
          created_at: string
          data_retention_days: number
          id: string
          is_demo: boolean
          locale: string
          name: string
          slug: string
          timezone: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          brand_config?: Json
          created_at?: string
          data_retention_days?: number
          id?: string
          is_demo?: boolean
          locale?: string
          name: string
          slug: string
          timezone?: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          brand_config?: Json
          created_at?: string
          data_retention_days?: number
          id?: string
          is_demo?: boolean
          locale?: string
          name?: string
          slug?: string
          timezone?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          metadata: Json
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      session_values: {
        Row: {
          confidence: number | null
          created_at: string
          field_key: string
          id: string
          is_current: boolean
          organization_id: string
          session_id: string
          source: string
          source_message_id: string | null
          updated_at: string
          value: Json
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          field_key: string
          id?: string
          is_current?: boolean
          organization_id: string
          session_id: string
          source: string
          source_message_id?: string | null
          updated_at?: string
          value: Json
        }
        Update: {
          confidence?: number | null
          created_at?: string
          field_key?: string
          id?: string
          is_current?: boolean
          organization_id?: string
          session_id?: string
          source?: string
          source_message_id?: string | null
          updated_at?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "session_values_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_values_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "interaction_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      website_analyses: {
        Row: {
          created_at: string
          error_message: string | null
          extracted_facts: Json
          facts_to_confirm: Json
          id: string
          organization_id: string
          status: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          extracted_facts?: Json
          facts_to_confirm?: Json
          id?: string
          organization_id: string
          status?: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          extracted_facts?: Json
          facts_to_confirm?: Json
          id?: string
          organization_id?: string
          status?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "website_analyses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_org_member: { Args: { _org: string }; Returns: boolean }
      is_org_owner: { Args: { _org: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
