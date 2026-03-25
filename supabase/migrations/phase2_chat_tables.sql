-- Phase 2: Ghost AI Chat MVP — Database Migration
-- Run this in Supabase SQL Editor
-- Project: ihuljnekxkyqgroklurp (EU)

-- ============================================
-- TABLE: chat_conversations
-- ============================================
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'New Chat',
    provider TEXT NOT NULL CHECK (provider IN ('claude', 'chatgpt', 'gemini')),
    model TEXT NOT NULL,
    message_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX idx_chat_conversations_updated ON public.chat_conversations(updated_at DESC);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own conversations
CREATE POLICY "Users read own conversations"
    ON public.chat_conversations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users create own conversations"
    ON public.chat_conversations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own conversations"
    ON public.chat_conversations FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users delete own conversations"
    ON public.chat_conversations FOR DELETE
    USING (auth.uid() = user_id);

-- Admin full access
CREATE POLICY "Admin full access conversations"
    ON public.chat_conversations FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================
-- TABLE: chat_messages
-- ============================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    provider TEXT,
    model TEXT,
    tokens_input INTEGER DEFAULT 0,
    tokens_output INTEGER DEFAULT 0,
    ghai_cost DECIMAL(12, 6) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_chat_messages_conversation ON public.chat_messages(conversation_id, created_at ASC);
CREATE INDEX idx_chat_messages_user ON public.chat_messages(user_id);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own messages"
    ON public.chat_messages FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users create own messages"
    ON public.chat_messages FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Messages are immutable — no update/delete by users
-- Admin full access
CREATE POLICY "Admin full access messages"
    ON public.chat_messages FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================
-- TABLE: user_credits
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_credits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    free_messages_used_today INTEGER DEFAULT 0,
    free_messages_reset_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '1 day'),
    ghai_balance_platform DECIMAL(18, 6) DEFAULT 0 CHECK (ghai_balance_platform >= 0),
    total_ghai_deposited DECIMAL(18, 6) DEFAULT 0,
    total_ghai_spent DECIMAL(18, 6) DEFAULT 0,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    subscription_status TEXT DEFAULT 'none' CHECK (subscription_status IN ('none', 'active', 'cancelled', 'past_due')),
    subscription_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_user_credits_user ON public.user_credits(user_id);

ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own credits"
    ON public.user_credits FOR SELECT
    USING (auth.uid() = user_id);

-- Credits are modified by API routes using service_role key, not by users directly
-- No INSERT/UPDATE/DELETE policies for regular users

-- Admin full access
CREATE POLICY "Admin full access credits"
    ON public.user_credits FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================
-- TABLE: ghai_deposits (audit trail)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ghai_deposits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(18, 6) NOT NULL CHECK (amount > 0),
    tx_signature TEXT NOT NULL UNIQUE,
    wallet_address TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
    confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ghai_deposits_user ON public.ghai_deposits(user_id);
CREATE INDEX idx_ghai_deposits_tx ON public.ghai_deposits(tx_signature);

ALTER TABLE public.ghai_deposits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own deposits"
    ON public.ghai_deposits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admin full access deposits"
    ON public.ghai_deposits FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================
-- FUNCTION: Auto-create user_credits on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_credits (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: when a new user is created, auto-create their credits row
DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_created_credits
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_credits();

-- ============================================
-- FUNCTION: Update conversation timestamp on new message
-- ============================================
CREATE OR REPLACE FUNCTION public.update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.chat_conversations
    SET updated_at = now(),
        message_count = message_count + 1
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_chat_message ON public.chat_messages;
CREATE TRIGGER on_new_chat_message
    AFTER INSERT ON public.chat_messages
    FOR EACH ROW EXECUTE FUNCTION public.update_conversation_on_message();

-- ============================================
-- FUNCTION: Reset free messages daily
-- ============================================
CREATE OR REPLACE FUNCTION public.reset_free_messages()
RETURNS void AS $$
BEGIN
    UPDATE public.user_credits
    SET free_messages_used_today = 0,
        free_messages_reset_at = now() + INTERVAL '1 day'
    WHERE free_messages_reset_at <= now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Call this via Supabase cron or Edge Function daily
-- SELECT cron.schedule('reset-free-messages', '0 0 * * *', 'SELECT public.reset_free_messages()');
