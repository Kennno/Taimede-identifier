export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_chats: {
        Row: {
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          role: string
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          role: string
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "ai_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          image_url: string | null
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      device_account_linking: {
        Row: {
          created_at: string | null
          device_id: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_id: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_id?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      device_tracking: {
        Row: {
          created_at: string
          device_id: string
          id: string
          is_premium: boolean | null
        }
        Insert: {
          created_at?: string
          device_id: string
          id?: string
          is_premium?: boolean | null
        }
        Update: {
          created_at?: string
          device_id?: string
          id?: string
          is_premium?: boolean | null
        }
        Relationships: []
      }
      device_usage: {
        Row: {
          created_at: string | null
          device_id: string
          id: string
          identification_count: number
          last_used: string | null
          usage_count: number
        }
        Insert: {
          created_at?: string | null
          device_id: string
          id?: string
          identification_count?: number
          last_used?: string | null
          usage_count?: number
        }
        Update: {
          created_at?: string | null
          device_id?: string
          id?: string
          identification_count?: number
          last_used?: string | null
          usage_count?: number
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          created_at: string | null
          id: string
          name: string
          subject: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          name: string
          subject: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          name?: string
          subject?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          beta_only: boolean
          created_at: string | null
          description: string | null
          enabled: boolean
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          beta_only?: boolean
          created_at?: string | null
          description?: string | null
          enabled?: boolean
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          beta_only?: boolean
          created_at?: string | null
          description?: string | null
          enabled?: boolean
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      plant_reports: {
        Row: {
          created_at: string | null
          id: string
          issue: string
          plant_id: string | null
          search_id: string | null
          status: string
          suggested_name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          issue: string
          plant_id?: string | null
          search_id?: string | null
          status?: string
          suggested_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          issue?: string
          plant_id?: string | null
          search_id?: string | null
          status?: string
          suggested_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plant_reports_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plant_reports_search_id_fkey"
            columns: ["search_id"]
            isOneToOne: false
            referencedRelation: "recent_searches"
            referencedColumns: ["id"]
          },
        ]
      }
      plants: {
        Row: {
          care_instructions: Json | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          scientific_name: string
          updated_at: string | null
        }
        Insert: {
          care_instructions?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          scientific_name: string
          updated_at?: string | null
        }
        Update: {
          care_instructions?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          scientific_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      premium_usage: {
        Row: {
          created_at: string | null
          id: string
          identification_count: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          identification_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          identification_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      prices: {
        Row: {
          active: boolean | null
          amount: number
          currency: string
          id: string
          interval: string
          product_id: string | null
        }
        Insert: {
          active?: boolean | null
          amount: number
          currency: string
          id: string
          interval: string
          product_id?: string | null
        }
        Update: {
          active?: boolean | null
          amount?: number
          currency?: string
          id?: string
          interval?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          name: string
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      recent_searches: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          plant_name: string
          scientific_name: string
          search_data: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          plant_name: string
          scientific_name: string
          search_data?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          plant_name?: string
          scientific_name?: string
          search_data?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      roadmap_milestones: {
        Row: {
          created_at: string | null
          description: string
          icon: string | null
          id: string
          sort_order: number
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          icon?: string | null
          id?: string
          sort_order: number
          status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string | null
          id?: string
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number | null
          cancel_at_period_end: boolean | null
          canceled_at: number | null
          created_at: string
          currency: string | null
          current_period_end: number | null
          current_period_start: number | null
          custom_field_data: Json | null
          customer_cancellation_comment: string | null
          customer_cancellation_reason: string | null
          customer_id: string | null
          ended_at: number | null
          ends_at: number | null
          id: string
          interval: string | null
          metadata: Json | null
          price_id: string | null
          started_at: number | null
          status: string | null
          stripe_id: string | null
          stripe_price_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          cancel_at_period_end?: boolean | null
          canceled_at?: number | null
          created_at?: string
          currency?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          custom_field_data?: Json | null
          customer_cancellation_comment?: string | null
          customer_cancellation_reason?: string | null
          customer_id?: string | null
          ended_at?: number | null
          ends_at?: number | null
          id?: string
          interval?: string | null
          metadata?: Json | null
          price_id?: string | null
          started_at?: number | null
          status?: string | null
          stripe_id?: string | null
          stripe_price_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          cancel_at_period_end?: boolean | null
          canceled_at?: number | null
          created_at?: string
          currency?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          custom_field_data?: Json | null
          customer_cancellation_comment?: string | null
          customer_cancellation_reason?: string | null
          customer_id?: string | null
          ended_at?: number | null
          ends_at?: number | null
          id?: string
          interval?: string | null
          metadata?: Json | null
          price_id?: string | null
          started_at?: number | null
          status?: string | null
          stripe_id?: string | null
          stripe_price_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      usage_tracking: {
        Row: {
          created_at: string | null
          device_id: string
          id: string
          is_premium: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_id: string
          id?: string
          is_premium?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_id?: string
          id?: string
          is_premium?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_usage: {
        Row: {
          created_at: string | null
          id: string
          identification_count: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          identification_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          identification_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: string | null
          email: string | null
          full_name: string | null
          id: string
          identification_count: number | null
          image: string | null
          name: string | null
          subscription: string | null
          subscription_tier: string | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          identification_count?: number | null
          image?: string | null
          name?: string | null
          subscription?: string | null
          subscription_tier?: string | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          identification_count?: number | null
          image?: string | null
          name?: string | null
          subscription?: string | null
          subscription_tier?: string | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          data: Json | null
          event_type: string
          id: string
          modified_at: string
          stripe_event_id: string | null
          type: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          event_type: string
          id?: string
          modified_at?: string
          stripe_event_id?: string | null
          type: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          event_type?: string
          id?: string
          modified_at?: string
          stripe_event_id?: string | null
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_old_chats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_device_usage_count: {
        Args: {
          device_id_param: string
        }
        Returns: number
      }
      get_premium_usage: {
        Args: {
          user_id: string
        }
        Returns: {
          usage_count: number
        }[]
      }
      increment_device_usage: {
        Args: {
          device_id_param: string
        }
        Returns: number
      }
      increment_premium_usage: {
        Args: {
          user_uuid: string
        }
        Returns: undefined
      }
      increment_user_usage: {
        Args: {
          user_uuid: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
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
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
