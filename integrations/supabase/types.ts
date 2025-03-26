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
      articles: {
        Row: {
          id: number;
          title: string;
          content: string;
          keywords: string | null;
          feature_img: string | null;
          author: string | null;
          tags: string | null;
          created_at: string | null;
          updated_at: string | null;
          category_id: number | null;
        };
        Insert: {
          id?: number;
          title: string;
          content: string;
          keywords?: string | null;
          feature_img?: string | null;
          author?: string | null;
          tags?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          category_id?: number | null;
        };
        Update: {
          id?: number;
          title?: string;
          content?: string;
          keywords?: string | null;
          feature_img?: string | null;
          author?: string | null;
          tags?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          category_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "article_categories"
            referencedColumns: ["id"]
          }
        ];
      };
      cities: {
        Row: {
          description: string | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string
          region: string | null
          type: string | null
          vaitor_id: number | null
        }
        Insert: {
          description?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          region?: string | null
          type?: string | null
          vaitor_id?: number | null
        }
        Update: {
          description?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          region?: string | null
          type?: string | null
          vaitor_id?: number | null
        }
        Relationships: []
      }
      place_types: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      places_to_stay: {
        Row: {
          address: string | null
          city_id: string
          contact_email: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          place_type_id: string
          price_range: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          city_id: string
          contact_email?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          place_type_id: string
          price_range?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          city_id?: string
          contact_email?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          place_type_id?: string
          price_range?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "places_to_stay_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "places_to_stay_place_type_id_fkey"
            columns: ["place_type_id"]
            isOneToOne: false
            referencedRelation: "place_types"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          created_at?: string
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
      article_categories: {
        Row: {
          id: number;
          name: string;
          slug: string;
          description: string | null;
        }
        Insert: {
          id?: number;
          name: string;
          slug: string;
          description?: string | null;
        }
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          description?: string | null;
        }
        Relationships: []
      }
      tour_types: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      tours: {
        Row: {
          booking_link: string | null
          city_id: string
          description: string | null
          duration: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          name: string
          price: number | null
          tour_type_id: string
        }
        Insert: {
          booking_link?: string | null
          city_id: string
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          name: string
          price?: number | null
          tour_type_id: string
        }
        Update: {
          booking_link?: string | null
          city_id?: string
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          name?: string
          price?: number | null
          tour_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tours_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tours_tour_type_id_fkey"
            columns: ["tour_type_id"]
            isOneToOne: false
            referencedRelation: "tour_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_secret: {
        Args: {
          name: string
        }
        Returns: string
      }
    }
    Enums: {
      user_role: "admin" | "user"
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
