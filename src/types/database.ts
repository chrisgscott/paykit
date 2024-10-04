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
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'business_owner'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role: 'admin' | 'business_owner'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'business_owner'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          phone: string | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email?: string | null
          phone?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payment_plans: {
        Row: {
          id: string
          user_id: string
          customer_id: string
          name: string
          description: string | null
          payment_type: 'one-off' | 'recurring' | 'installment'
          total_amount: number
          currency: string
          installments: number | null
          frequency: string | null
          start_date: string
          end_date: string | null
          next_transaction_date: string | null
          auto_charge: boolean
          status: 'active' | 'completed' | 'cancelled'
          stripe_price_id: string | null
          stripe_product_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          customer_id: string
          name: string
          description?: string | null
          payment_type: 'one-off' | 'recurring' | 'installment'
          total_amount: number
          currency: string
          installments?: number | null
          frequency?: string | null
          start_date: string
          end_date?: string | null
          next_transaction_date?: string | null
          auto_charge: boolean
          status: 'active' | 'completed' | 'cancelled'
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          customer_id?: string
          name?: string
          description?: string | null
          payment_type?: 'one-off' | 'recurring' | 'installment'
          total_amount?: number
          currency?: string
          installments?: number | null
          frequency?: string | null
          start_date?: string
          end_date?: string | null
          next_transaction_date?: string | null
          auto_charge?: boolean
          status?: 'active' | 'completed' | 'cancelled'
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string  // Add this line
          payment_plan_id: string
          amount: number
          currency: string
          scheduled_date: string
          transaction_date: string | null
          status: 'pending' | 'successful' | 'failed'
          stripe_payment_intent_id: string | null
          installment_number: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string  // Add this line
          payment_plan_id: string
          amount: number
          currency: string
          scheduled_date: string
          transaction_date?: string | null
          status: 'pending' | 'successful' | 'failed'
          stripe_payment_intent_id?: string | null
          installment_number?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string  // Add this line
          payment_plan_id?: string
          amount?: number
          currency?: string
          scheduled_date?: string
          transaction_date?: string | null
          status?: 'pending' | 'successful' | 'failed'
          stripe_payment_intent_id?: string | null
          installment_number?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string  // Add this line
          transaction_id: string
          customer_id: string
          amount_due: number
          due_date: string
          paid_date: string | null
          status: 'pending' | 'paid' | 'overdue'
          stripe_invoice_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string  // Add this line
          transaction_id: string
          customer_id: string
          amount_due: number
          due_date: string
          paid_date?: string | null
          status: 'pending' | 'paid' | 'overdue'
          stripe_invoice_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string  // Add this line
          transaction_id?: string
          customer_id?: string
          amount_due?: number
          due_date?: string
          paid_date?: string | null
          status?: 'pending' | 'paid' | 'overdue'
          stripe_invoice_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          user_id: string
          notification_preferences: Json
          default_auto_charge: boolean
          default_currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          notification_preferences: Json
          default_auto_charge: boolean
          default_currency: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          notification_preferences?: Json
          default_auto_charge?: boolean
          default_currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          user_id: string
          payment_success_rate: number
          total_revenue: number
          failed_transactions_count: number
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          payment_success_rate: number
          total_revenue: number
          failed_transactions_count: number
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          payment_success_rate?: number
          total_revenue?: number
          failed_transactions_count?: number
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_payment_methods: {
        Row: {
          id: string
          user_id: string
          stripe_payment_method_id: string
          card_last_four: string
          card_brand: string
          card_exp_month: number
          card_exp_year: number
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_payment_method_id: string
          card_last_four: string
          card_brand: string
          card_exp_month: number
          card_exp_year: number
          is_default: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_payment_method_id?: string
          card_last_four?: string
          card_brand?: string
          card_exp_month?: number
          card_exp_year?: number
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customer_payment_methods: {
        Row: {
          id: string
          customer_id: string
          stripe_payment_method_id: string
          card_last_four: string
          card_brand: string
          card_exp_month: number
          card_exp_year: number
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          stripe_payment_method_id: string
          card_last_four: string
          card_brand: string
          card_exp_month: number
          card_exp_year: number
          is_default: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          stripe_payment_method_id?: string
          card_last_four?: string
          card_brand?: string
          card_exp_month?: number
          card_exp_year?: number
          is_default?: boolean
          created_at?: string
          updated_at?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}