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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      achievement_progress: {
        Row: {
          achievement_id: string
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          current_count: number | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_count?: number | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_count?: number | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      assemblies: {
        Row: {
          assembly_json: Json
          created_at: string
          generation_id: string | null
          id: string
          metadata_version: number
          name: string
          slug: string | null
          source: string
          template_id: string | null
          thumbnail_url: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assembly_json: Json
          created_at?: string
          generation_id?: string | null
          id?: string
          metadata_version?: number
          name: string
          slug?: string | null
          source?: string
          template_id?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assembly_json?: Json
          created_at?: string
          generation_id?: string | null
          id?: string
          metadata_version?: number
          name?: string
          slug?: string | null
          source?: string
          template_id?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assemblies_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      assembly_configs: {
        Row: {
          config_json: Json
          created_at: string | null
          id: string
          name: string
          thumbnail_url: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          config_json: Json
          created_at?: string | null
          id?: string
          name: string
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          config_json?: Json
          created_at?: string | null
          id?: string
          name?: string
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      battle_sessions: {
        Row: {
          boss_template: string | null
          deck_id: string | null
          ended_at: string | null
          id: string
          mode: string
          opponent_user_id: string | null
          reward_ghai: number | null
          seed: string
          ship_id: string | null
          started_at: string | null
          status: string
          turns_played: number | null
          user_id: string
        }
        Insert: {
          boss_template?: string | null
          deck_id?: string | null
          ended_at?: string | null
          id?: string
          mode: string
          opponent_user_id?: string | null
          reward_ghai?: number | null
          seed: string
          ship_id?: string | null
          started_at?: string | null
          status?: string
          turns_played?: number | null
          user_id: string
        }
        Update: {
          boss_template?: string | null
          deck_id?: string | null
          ended_at?: string | null
          id?: string
          mode?: string
          opponent_user_id?: string | null
          reward_ghai?: number | null
          seed?: string
          ship_id?: string | null
          started_at?: string | null
          status?: string
          turns_played?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "battle_sessions_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          },
        ]
      }
      battle_turns: {
        Row: {
          action: Json
          actor: string
          created_at: string | null
          id: string
          session_id: string
          state_snapshot: Json | null
          turn_number: number
        }
        Insert: {
          action: Json
          actor: string
          created_at?: string | null
          id?: string
          session_id: string
          state_snapshot?: Json | null
          turn_number: number
        }
        Update: {
          action?: Json
          actor?: string
          created_at?: string | null
          id?: string
          session_id?: string
          state_snapshot?: Json | null
          turn_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "battle_turns_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "battle_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      card_collection: {
        Row: {
          card_id: string
          created_at: string | null
          dust_balance: number | null
          id: string
          quantity: number | null
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string | null
          dust_balance?: number | null
          id?: string
          quantity?: number | null
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string | null
          dust_balance?: number | null
          id?: string
          quantity?: number | null
          user_id?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          compression_enabled: boolean | null
          created_at: string | null
          id: string
          message_count: number | null
          model: string
          provider: string
          title: string | null
          tokens_saved: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          compression_enabled?: boolean | null
          created_at?: string | null
          id?: string
          message_count?: number | null
          model: string
          provider: string
          title?: string | null
          tokens_saved?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          compression_enabled?: boolean | null
          created_at?: string | null
          id?: string
          message_count?: number | null
          model?: string
          provider?: string
          title?: string | null
          tokens_saved?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          compression_ratio: number | null
          content: string
          content_compressed: string | null
          conversation_id: string
          created_at: string | null
          encoder_used: string | null
          ghai_cost: number | null
          id: string
          model: string | null
          provider: string | null
          role: string
          tokens_input: number | null
          tokens_output: number | null
          user_id: string
        }
        Insert: {
          compression_ratio?: number | null
          content: string
          content_compressed?: string | null
          conversation_id: string
          created_at?: string | null
          encoder_used?: string | null
          ghai_cost?: number | null
          id?: string
          model?: string | null
          provider?: string | null
          role: string
          tokens_input?: number | null
          tokens_output?: number | null
          user_id: string
        }
        Update: {
          compression_ratio?: number | null
          content?: string
          content_compressed?: string | null
          conversation_id?: string
          created_at?: string | null
          encoder_used?: string | null
          ghai_cost?: number | null
          id?: string
          model?: string | null
          provider?: string | null
          role?: string
          tokens_input?: number | null
          tokens_output?: number | null
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
      competition_entries: {
        Row: {
          bot_id: string | null
          competition_id: string
          created_at: string
          final_pnl: number | null
          id: string
          prize_awarded: number | null
          rank: number | null
          user_id: string
        }
        Insert: {
          bot_id?: string | null
          competition_id: string
          created_at?: string
          final_pnl?: number | null
          id?: string
          prize_awarded?: number | null
          rank?: number | null
          user_id: string
        }
        Update: {
          bot_id?: string | null
          competition_id?: string
          created_at?: string
          final_pnl?: number | null
          id?: string
          prize_awarded?: number | null
          rank?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_entries_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "trading_bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_entries_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: string
          prize_ghai: number
          start_date: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          prize_ghai?: number
          start_date: string
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          prize_ghai?: number
          start_date?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          status: string
          subject: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          status?: string
          subject: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          status?: string
          subject?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deck_cards: {
        Row: {
          count: number
          deck_id: string
          template_id: string
        }
        Insert: {
          count?: number
          deck_id: string
          template_id: string
        }
        Update: {
          count?: number
          deck_id?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deck_cards_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          },
        ]
      }
      decks: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          ship_class_restriction: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          ship_class_restriction?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          ship_class_restriction?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      generation_variants: {
        Row: {
          assembly_json: Json
          created_at: string
          generation_id: string
          id: string
          label: string | null
          style_score: number | null
          usability_score: number | null
          validation_score: number | null
          variant_index: number
        }
        Insert: {
          assembly_json: Json
          created_at?: string
          generation_id: string
          id?: string
          label?: string | null
          style_score?: number | null
          usability_score?: number | null
          validation_score?: number | null
          variant_index: number
        }
        Update: {
          assembly_json?: Json
          created_at?: string
          generation_id?: string
          id?: string
          label?: string | null
          style_score?: number | null
          usability_score?: number | null
          validation_score?: number | null
          variant_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "generation_variants_generation_id_fkey"
            columns: ["generation_id"]
            isOneToOne: false
            referencedRelation: "generations"
            referencedColumns: ["id"]
          },
        ]
      }
      generations: {
        Row: {
          created_at: string
          draft_assembly: Json | null
          error_message: string | null
          id: string
          input_image_url: string | null
          model_pool: Json
          planner_response: Json | null
          prompt_style: Json
          prompt_text: string
          repair_report: Json | null
          status: string
          template_id: string | null
          updated_at: string
          user_id: string | null
          validated_assembly: Json | null
          validation_report: Json | null
        }
        Insert: {
          created_at?: string
          draft_assembly?: Json | null
          error_message?: string | null
          id?: string
          input_image_url?: string | null
          model_pool?: Json
          planner_response?: Json | null
          prompt_style?: Json
          prompt_text: string
          repair_report?: Json | null
          status?: string
          template_id?: string | null
          updated_at?: string
          user_id?: string | null
          validated_assembly?: Json | null
          validation_report?: Json | null
        }
        Update: {
          created_at?: string
          draft_assembly?: Json | null
          error_message?: string | null
          id?: string
          input_image_url?: string | null
          model_pool?: Json
          planner_response?: Json | null
          prompt_style?: Json
          prompt_text?: string
          repair_report?: Json | null
          status?: string
          template_id?: string | null
          updated_at?: string
          user_id?: string | null
          validated_assembly?: Json | null
          validation_report?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "generations_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      ghai_deposits: {
        Row: {
          amount: number
          confirmed_at: string | null
          created_at: string | null
          id: string
          status: string | null
          tx_signature: string
          user_id: string
          wallet_address: string
        }
        Insert: {
          amount: number
          confirmed_at?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          tx_signature: string
          user_id: string
          wallet_address: string
        }
        Update: {
          amount?: number
          confirmed_at?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          tx_signature?: string
          user_id?: string
          wallet_address?: string
        }
        Relationships: []
      }
      ghai_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          product: string | null
          tx_signature: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          product?: string | null
          tx_signature?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          product?: string | null
          tx_signature?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ghai_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hauling_contracts: {
        Row: {
          accepted_at: string | null
          cargo_type: string | null
          cargo_units: number | null
          completed_at: string | null
          destination_planet: string
          id: string
          mission_template: string
          origin_planet: string
          outcome_grade: string | null
          reward_ghai: number
          risk_level: string
          route_seed: string | null
          status: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          cargo_type?: string | null
          cargo_units?: number | null
          completed_at?: string | null
          destination_planet: string
          id?: string
          mission_template: string
          origin_planet: string
          outcome_grade?: string | null
          reward_ghai: number
          risk_level?: string
          route_seed?: string | null
          status?: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          cargo_type?: string | null
          cargo_units?: number | null
          completed_at?: string | null
          destination_planet?: string
          id?: string
          mission_template?: string
          origin_planet?: string
          outcome_grade?: string | null
          reward_ghai?: number
          risk_level?: string
          route_seed?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      kcp90_stats: {
        Row: {
          compressed_chars: number
          compression_ratio: number
          created_at: string
          encoder_used: string
          id: string
          original_chars: number
          product: string
          session_id: string | null
          tokens_saved: number
        }
        Insert: {
          compressed_chars?: number
          compression_ratio?: number
          created_at?: string
          encoder_used?: string
          id?: string
          original_chars?: number
          product: string
          session_id?: string | null
          tokens_saved?: number
        }
        Update: {
          compressed_chars?: number
          compression_ratio?: number
          created_at?: string
          encoder_used?: string
          id?: string
          original_chars?: number
          product?: string
          session_id?: string | null
          tokens_saved?: number
        }
        Relationships: []
      }
      mission_board_state: {
        Row: {
          board_date: string
          generated_at: string | null
          id: string
          missions: Json
        }
        Insert: {
          board_date: string
          generated_at?: string | null
          id?: string
          missions: Json
        }
        Update: {
          board_date?: string
          generated_at?: string | null
          id?: string
          missions?: Json
        }
        Relationships: []
      }
      mission_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          mission_id: string
          objectives_completed: string[] | null
          started_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          mission_id: string
          objectives_completed?: string[] | null
          started_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          mission_id?: string
          objectives_completed?: string[] | null
          started_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      model_metadata: {
        Row: {
          aabb_x: number
          aabb_y: number
          aabb_z: number
          category: string
          collision_proxy: Json | null
          compatibility: Json
          created_at: string
          default_scale: number
          ergonomics: Json | null
          forward_axis: string
          geometry_hash: string | null
          id: string
          material_count: number | null
          mesh_count: number | null
          metadata_version: number
          model_id: string
          obb_x: number | null
          obb_y: number | null
          obb_z: number | null
          pivot_x: number
          pivot_y: number
          pivot_z: number
          quality_tier: string
          role_weight: number
          semantics: Json
          subcategory: string
          symmetry_type: string
          up_axis: string
          updated_at: string
          validation: Json
          vertex_count: number | null
        }
        Insert: {
          aabb_x: number
          aabb_y: number
          aabb_z: number
          category: string
          collision_proxy?: Json | null
          compatibility?: Json
          created_at?: string
          default_scale?: number
          ergonomics?: Json | null
          forward_axis: string
          geometry_hash?: string | null
          id?: string
          material_count?: number | null
          mesh_count?: number | null
          metadata_version?: number
          model_id: string
          obb_x?: number | null
          obb_y?: number | null
          obb_z?: number | null
          pivot_x?: number
          pivot_y?: number
          pivot_z?: number
          quality_tier?: string
          role_weight?: number
          semantics?: Json
          subcategory: string
          symmetry_type?: string
          up_axis: string
          updated_at?: string
          validation?: Json
          vertex_count?: number | null
        }
        Update: {
          aabb_x?: number
          aabb_y?: number
          aabb_z?: number
          category?: string
          collision_proxy?: Json | null
          compatibility?: Json
          created_at?: string
          default_scale?: number
          ergonomics?: Json | null
          forward_axis?: string
          geometry_hash?: string | null
          id?: string
          material_count?: number | null
          mesh_count?: number | null
          metadata_version?: number
          model_id?: string
          obb_x?: number | null
          obb_y?: number | null
          obb_z?: number | null
          pivot_x?: number
          pivot_y?: number
          pivot_z?: number
          quality_tier?: string
          role_weight?: number
          semantics?: Json
          subcategory?: string
          symmetry_type?: string
          up_axis?: string
          updated_at?: string
          validation?: Json
          vertex_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "model_metadata_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: true
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      model_sockets: {
        Row: {
          created_at: string
          id: string
          local_pos_x: number
          local_pos_y: number
          local_pos_z: number
          local_rot_x: number
          local_rot_y: number
          local_rot_z: number
          max_scale_deviation: number | null
          metadata: Json
          mirrored_socket_key: string | null
          model_id: string
          name: string
          normal_x: number
          normal_y: number
          normal_z: number
          occupancy: string
          priority: number
          socket_key: string
          socket_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          local_pos_x: number
          local_pos_y: number
          local_pos_z: number
          local_rot_x?: number
          local_rot_y?: number
          local_rot_z?: number
          max_scale_deviation?: number | null
          metadata?: Json
          mirrored_socket_key?: string | null
          model_id: string
          name: string
          normal_x?: number
          normal_y?: number
          normal_z?: number
          occupancy?: string
          priority?: number
          socket_key: string
          socket_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          local_pos_x?: number
          local_pos_y?: number
          local_pos_z?: number
          local_rot_x?: number
          local_rot_y?: number
          local_rot_z?: number
          max_scale_deviation?: number | null
          metadata?: Json
          mirrored_socket_key?: string | null
          model_id?: string
          name?: string
          normal_x?: number
          normal_y?: number
          normal_z?: number
          occupancy?: string
          priority?: number
          socket_key?: string
          socket_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_sockets_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      model_tags: {
        Row: {
          created_at: string
          id: string
          model_id: string
          tag: string
          tag_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          model_id: string
          tag: string
          tag_type?: string
        }
        Update: {
          created_at?: string
          id?: string
          model_id?: string
          tag?: string
          tag_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_tags_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          created_at: string
          display_name: string
          id: string
          is_active: boolean
          is_uploaded: boolean
          name: string
          public_url: string
          slug: string
          source_license: string | null
          source_pack: string | null
          storage_path: string
          thumbnail_url: string | null
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
          is_active?: boolean
          is_uploaded?: boolean
          name: string
          public_url: string
          slug: string
          source_license?: string | null
          source_pack?: string | null
          storage_path: string
          thumbnail_url?: string | null
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          is_active?: boolean
          is_uploaded?: boolean
          name?: string
          public_url?: string
          slug?: string
          source_license?: string | null
          source_pack?: string | null
          storage_path?: string
          thumbnail_url?: string | null
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      pilot_encounters: {
        Row: {
          encounter_count: number | null
          encounter_type: string | null
          first_met_at: string | null
          id: string
          last_met_at: string | null
          pilot_a: string
          pilot_b: string
          sector: string | null
        }
        Insert: {
          encounter_count?: number | null
          encounter_type?: string | null
          first_met_at?: string | null
          id?: string
          last_met_at?: string | null
          pilot_a: string
          pilot_b: string
          sector?: string | null
        }
        Update: {
          encounter_count?: number | null
          encounter_type?: string | null
          first_met_at?: string | null
          id?: string
          last_met_at?: string | null
          pilot_a?: string
          pilot_b?: string
          sector?: string | null
        }
        Relationships: []
      }
      pilot_reputation: {
        Row: {
          active_since: string | null
          bosses_defeated: number | null
          composed_title: string | null
          known_for: string | null
          pilot_name: string | null
          pilots_rescued: number | null
          planet_owner: string | null
          pvp_losses: number | null
          pvp_wins: number | null
          speedrun_wins: number | null
          successful_hauls: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_since?: string | null
          bosses_defeated?: number | null
          composed_title?: string | null
          known_for?: string | null
          pilot_name?: string | null
          pilots_rescued?: number | null
          planet_owner?: string | null
          pvp_losses?: number | null
          pvp_wins?: number | null
          speedrun_wins?: number | null
          successful_hauls?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_since?: string | null
          bosses_defeated?: number | null
          composed_title?: string | null
          known_for?: string | null
          pilot_name?: string | null
          pilots_rescued?: number | null
          planet_owner?: string | null
          pvp_losses?: number | null
          pvp_wins?: number | null
          speedrun_wins?: number | null
          successful_hauls?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      player_profiles: {
        Row: {
          created_at: string | null
          id: string
          rank: string | null
          rank_points: number | null
          title: string | null
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          rank?: string | null
          rank_points?: number | null
          title?: string | null
          user_id: string
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          rank?: string | null
          rank_points?: number | null
          title?: string | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          name: string | null
          referral_code: string | null
          referred_by: string | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id: string
          name?: string | null
          referral_code?: string | null
          referred_by?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string | null
          referral_code?: string | null
          referred_by?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pvp_queue: {
        Row: {
          deck_id: string | null
          id: string
          matched_at: string | null
          queued_at: string | null
          rank: number | null
          session_id: string | null
          ship_id: string
          status: string
          user_id: string
        }
        Insert: {
          deck_id?: string | null
          id?: string
          matched_at?: string | null
          queued_at?: string | null
          rank?: number | null
          session_id?: string | null
          ship_id: string
          status?: string
          user_id: string
        }
        Update: {
          deck_id?: string | null
          id?: string
          matched_at?: string | null
          queued_at?: string | null
          rank?: number | null
          session_id?: string | null
          ship_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pvp_queue_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pvp_queue_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "battle_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      quantum_sessions: {
        Row: {
          cost_usd: number | null
          created_at: string
          customer_price_usd: number | null
          duration_seconds: number | null
          id: string
          messages: Json | null
          mode: string
          providers_used: string[] | null
          question: string
          question_type: string | null
          status: string
          synthesis: string | null
          tokens_used: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string
          customer_price_usd?: number | null
          duration_seconds?: number | null
          id?: string
          messages?: Json | null
          mode?: string
          providers_used?: string[] | null
          question: string
          question_type?: string | null
          status?: string
          synthesis?: string | null
          tokens_used?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cost_usd?: number | null
          created_at?: string
          customer_price_usd?: number | null
          duration_seconds?: number | null
          id?: string
          messages?: Json | null
          mode?: string
          providers_used?: string[] | null
          question?: string
          question_type?: string | null
          status?: string
          synthesis?: string | null
          tokens_used?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quest_templates: {
        Row: {
          active: boolean | null
          arc: string
          cast_issuer: string | null
          created_at: string | null
          description: string
          id: string
          objectives: Json
          prerequisite_quest: string | null
          reward_card_template: string | null
          reward_ghai: number | null
          reward_title: string | null
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          arc: string
          cast_issuer?: string | null
          created_at?: string | null
          description: string
          id: string
          objectives?: Json
          prerequisite_quest?: string | null
          reward_card_template?: string | null
          reward_ghai?: number | null
          reward_title?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          arc?: string
          cast_issuer?: string | null
          created_at?: string | null
          description?: string
          id?: string
          objectives?: Json
          prerequisite_quest?: string | null
          reward_card_template?: string | null
          reward_ghai?: number | null
          reward_title?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quest_templates_prerequisite_quest_fkey"
            columns: ["prerequisite_quest"]
            isOneToOne: false
            referencedRelation: "quest_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      race_results: {
        Row: {
          created_at: string | null
          id: string
          player_id: string
          power_ups_used: string[] | null
          time_ms: number
          track_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          player_id: string
          power_ups_used?: string[] | null
          time_ms: number
          track_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          player_id?: string
          power_ups_used?: string[] | null
          time_ms?: number
          track_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          ghai_earned: number | null
          id: string
          referred_id: string
          referrer_id: string
        }
        Insert: {
          created_at?: string
          ghai_earned?: number | null
          id?: string
          referred_id: string
          referrer_id: string
        }
        Update: {
          created_at?: string
          ghai_earned?: number | null
          id?: string
          referred_id?: string
          referrer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ship_inventory: {
        Row: {
          acquired_via: string | null
          created_at: string | null
          id: string
          is_soulbound: boolean | null
          ship_model_id: string
          skin_id: string | null
          user_id: string
        }
        Insert: {
          acquired_via?: string | null
          created_at?: string | null
          id?: string
          is_soulbound?: boolean | null
          ship_model_id: string
          skin_id?: string | null
          user_id: string
        }
        Update: {
          acquired_via?: string | null
          created_at?: string | null
          id?: string
          is_soulbound?: boolean | null
          ship_model_id?: string
          skin_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ship_tags: {
        Row: {
          achievement_requirement: string | null
          created_at: string | null
          id: string
          notes: string | null
          role: string | null
          ship_class: string | null
          ship_id: string
          suggested_price_ghai: number | null
          suggested_price_usd: number | null
          tier: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          achievement_requirement?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          role?: string | null
          ship_class?: string | null
          ship_id: string
          suggested_price_ghai?: number | null
          suggested_price_usd?: number | null
          tier?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          achievement_requirement?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          role?: string | null
          ship_class?: string | null
          ship_id?: string
          suggested_price_ghai?: number | null
          suggested_price_usd?: number | null
          tier?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      shop_transactions: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          price_cents: number
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          price_cents: number
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          price_cents?: number
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      socket_compatibility: {
        Row: {
          allowed_category: string | null
          allowed_subcategory: string | null
          created_at: string
          forbidden_tag: string | null
          id: string
          priority_bias: number
          required_tag: string | null
          socket_type: string
        }
        Insert: {
          allowed_category?: string | null
          allowed_subcategory?: string | null
          created_at?: string
          forbidden_tag?: string | null
          id?: string
          priority_bias?: number
          required_tag?: string | null
          socket_type: string
        }
        Update: {
          allowed_category?: string | null
          allowed_subcategory?: string | null
          created_at?: string
          forbidden_tag?: string | null
          id?: string
          priority_bias?: number
          required_tag?: string | null
          socket_type?: string
        }
        Relationships: []
      }
      speedrun_times: {
        Row: {
          checkpoints: Json
          created_at: string | null
          duration_ms: number
          id: string
          pilot_name: string | null
          ship_id: string
          track_id: string
          user_id: string
          validated: boolean | null
        }
        Insert: {
          checkpoints?: Json
          created_at?: string | null
          duration_ms: number
          id?: string
          pilot_name?: string | null
          ship_id: string
          track_id: string
          user_id: string
          validated?: boolean | null
        }
        Update: {
          checkpoints?: Json
          created_at?: string | null
          duration_ms?: number
          id?: string
          pilot_name?: string | null
          ship_id?: string
          track_id?: string
          user_id?: string
          validated?: boolean | null
        }
        Relationships: []
      }
      template_roles: {
        Row: {
          allowed_categories: string[]
          allowed_subcategories: string[]
          created_at: string
          forbidden_tags: string[]
          id: string
          is_required: boolean
          max_count: number
          min_count: number
          placement_phase: number
          preferred_anchor: string | null
          required_tags: string[]
          role_key: string
          role_name: string
          role_priority: number
          role_type: string
          rules: Json
          symmetry_group: string | null
          template_id: string
          updated_at: string
        }
        Insert: {
          allowed_categories?: string[]
          allowed_subcategories?: string[]
          created_at?: string
          forbidden_tags?: string[]
          id?: string
          is_required?: boolean
          max_count?: number
          min_count?: number
          placement_phase?: number
          preferred_anchor?: string | null
          required_tags?: string[]
          role_key: string
          role_name: string
          role_priority?: number
          role_type: string
          rules?: Json
          symmetry_group?: string | null
          template_id: string
          updated_at?: string
        }
        Update: {
          allowed_categories?: string[]
          allowed_subcategories?: string[]
          created_at?: string
          forbidden_tags?: string[]
          id?: string
          is_required?: boolean
          max_count?: number
          min_count?: number
          placement_phase?: number
          preferred_anchor?: string | null
          required_tags?: string[]
          role_key?: string
          role_name?: string
          role_priority?: number
          role_type?: string
          rules?: Json
          symmetry_group?: string | null
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_roles_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          rules: Json
          slug: string
          style_profile: Json
          template_type: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          rules?: Json
          slug: string
          style_profile?: Json
          template_type?: string
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          rules?: Json
          slug?: string
          style_profile?: Json
          template_type?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      trading_bots: {
        Row: {
          code_hash: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          performance_30d: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          code_hash?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          performance_30d?: number | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          code_hash?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          performance_30d?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trading_bots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      universe_wall: {
        Row: {
          actor_name: string
          actor_user_id: string | null
          created_at: string | null
          event_type: string
          id: string
          payload: Json
          subject_name: string | null
          subject_user_id: string | null
        }
        Insert: {
          actor_name: string
          actor_user_id?: string | null
          created_at?: string | null
          event_type: string
          id?: string
          payload?: Json
          subject_name?: string | null
          subject_user_id?: string | null
        }
        Update: {
          actor_name?: string
          actor_user_id?: string | null
          created_at?: string | null
          event_type?: string
          id?: string
          payload?: Json
          subject_name?: string | null
          subject_user_id?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_type: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_type: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_type?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_cards: {
        Row: {
          acquired_from: string | null
          first_acquired_at: string | null
          id: string
          quantity: number
          template_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          acquired_from?: string | null
          first_acquired_at?: string | null
          id?: string
          quantity?: number
          template_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          acquired_from?: string | null
          first_acquired_at?: string | null
          id?: string
          quantity?: number
          template_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          created_at: string | null
          free_messages_reset_at: string | null
          free_messages_used_today: number | null
          ghai_balance_platform: number | null
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_expires_at: string | null
          subscription_status: string | null
          total_ghai_deposited: number | null
          total_ghai_spent: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          free_messages_reset_at?: string | null
          free_messages_used_today?: number | null
          ghai_balance_platform?: number | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_expires_at?: string | null
          subscription_status?: string | null
          total_ghai_deposited?: number | null
          total_ghai_spent?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          free_messages_reset_at?: string | null
          free_messages_used_today?: number | null
          ghai_balance_platform?: number | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_expires_at?: string | null
          subscription_status?: string | null
          total_ghai_deposited?: number | null
          total_ghai_spent?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_quest_progress: {
        Row: {
          completed_at: string | null
          objectives_state: Json
          quest_id: string
          started_at: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          objectives_state?: Json
          quest_id: string
          started_at?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          objectives_state?: Json
          quest_id?: string
          started_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quest_progress_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quest_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_wallets: {
        Row: {
          balance_usd: number
          created_at: string
          id: string
          total_deposited_usd: number
          total_spent_usd: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_usd?: number
          created_at?: string
          id?: string
          total_deposited_usd?: number
          total_spent_usd?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_usd?: number
          created_at?: string
          id?: string
          total_deposited_usd?: number
          total_spent_usd?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      validation_reports: {
        Row: {
          assembly_id: string | null
          created_at: string
          generation_id: string | null
          id: string
          message: string
          payload: Json
          related_instance_id: string | null
          rule_code: string
          severity: string
          target_instance_id: string | null
        }
        Insert: {
          assembly_id?: string | null
          created_at?: string
          generation_id?: string | null
          id?: string
          message: string
          payload?: Json
          related_instance_id?: string | null
          rule_code: string
          severity: string
          target_instance_id?: string | null
        }
        Update: {
          assembly_id?: string | null
          created_at?: string
          generation_id?: string | null
          id?: string
          message?: string
          payload?: Json
          related_instance_id?: string | null
          rule_code?: string
          severity?: string
          target_instance_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "validation_reports_assembly_id_fkey"
            columns: ["assembly_id"]
            isOneToOne: false
            referencedRelation: "assemblies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validation_reports_generation_id_fkey"
            columns: ["generation_id"]
            isOneToOne: false
            referencedRelation: "generations"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist_signups: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string | null
          product: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name?: string | null
          product: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string | null
          product?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_signups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_connections: {
        Row: {
          chain: string
          connected_at: string
          display_name: string | null
          ghai_balance_cached: number | null
          id: string
          is_primary: boolean | null
          label: string | null
          last_verified: string | null
          metadata: Json | null
          signature: string | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
          wallet_address: string
          wallet_type: string | null
        }
        Insert: {
          chain?: string
          connected_at?: string
          display_name?: string | null
          ghai_balance_cached?: number | null
          id?: string
          is_primary?: boolean | null
          label?: string | null
          last_verified?: string | null
          metadata?: Json | null
          signature?: string | null
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
          wallet_address: string
          wallet_type?: string | null
        }
        Update: {
          chain?: string
          connected_at?: string
          display_name?: string | null
          ghai_balance_cached?: number | null
          id?: string
          is_primary?: boolean | null
          label?: string | null
          last_verified?: string | null
          metadata?: Json | null
          signature?: string | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
          wallet_address?: string
          wallet_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount_usd: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          quantum_session_id: string | null
          stripe_session_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount_usd: number
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          quantum_session_id?: string | null
          stripe_session_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount_usd?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          quantum_session_id?: string | null
          stripe_session_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      wrecks: {
        Row: {
          base_price_ghai: number
          claimed_at: string | null
          claimed_by_user_id: string | null
          expires_at: string
          id: string
          owner_user_id: string
          phase: string
          position: Json
          protected_until: string
          resolution: string | null
          risk_level: string
          sector: string | null
          ship_class: string | null
          ship_id: string
          ship_tier: string | null
          spawned_at: string | null
        }
        Insert: {
          base_price_ghai?: number
          claimed_at?: string | null
          claimed_by_user_id?: string | null
          expires_at: string
          id?: string
          owner_user_id: string
          phase?: string
          position: Json
          protected_until: string
          resolution?: string | null
          risk_level?: string
          sector?: string | null
          ship_class?: string | null
          ship_id: string
          ship_tier?: string | null
          spawned_at?: string | null
        }
        Update: {
          base_price_ghai?: number
          claimed_at?: string | null
          claimed_by_user_id?: string | null
          expires_at?: string
          id?: string
          owner_user_id?: string
          phase?: string
          position?: Json
          protected_until?: string
          resolution?: string | null
          risk_level?: string
          sector?: string | null
          ship_class?: string | null
          ship_id?: string
          ship_tier?: string | null
          spawned_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      kcp90_daily_stats: {
        Row: {
          avg_ratio: number | null
          day: string | null
          ollama_count: number | null
          product: string | null
          raw_count: number | null
          regex_count: number | null
          total_compressed_chars: number | null
          total_compressions: number | null
          total_original_chars: number | null
          total_tokens_saved: number | null
        }
        Relationships: []
      }
      kcp90_summary: {
        Row: {
          active_products: number | null
          estimated_usd_saved: number | null
          ollama_count: number | null
          overall_ratio: number | null
          raw_count: number | null
          regex_count: number | null
          total_compressed_chars: number | null
          total_compressions: number | null
          total_original_chars: number | null
          total_tokens_saved: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_rate_limit: {
        Args: { ip_or_email: string; max_per_hour?: number; table_name: string }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      reset_free_messages: { Args: never; Returns: undefined }
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
