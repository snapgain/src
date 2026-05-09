-- Fix para warnings do Supabase
-- Resolve problemas de segurança e configuração

-- 1. Fix Function Search Path Mutable warnings
-- Adiciona search_path seguro para funções existentes

-- Recria função com search_path seguro
CREATE OR REPLACE FUNCTION public.test_auth_uid()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN auth.uid();
END;
$$;

-- Recria função update_timestamp com search_path seguro
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recria função is_admin com search_path seguro
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$;

-- Recria função is_owner com search_path seguro
CREATE OR REPLACE FUNCTION public.is_owner(owner_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN auth.uid() = owner_id;
END;
$$;

-- Recria função update_cashback_rate_timestamp com search_path seguro
CREATE OR REPLACE FUNCTION public.update_cashback_rate_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recria função log_rate_change com search_path seguro
CREATE OR REPLACE FUNCTION public.log_rate_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.rate != NEW.rate THEN
    INSERT INTO public.rate_history (cashback_rate_id, old_rate, new_rate, change_percentage)
    VALUES (
      NEW.id, 
      OLD.rate, 
      NEW.rate, 
      ROUND(((NEW.rate - OLD.rate) / OLD.rate * 100), 2)
    );
  END IF;
  RETURN NEW;
END;
$$;

-- 2. Fix Row Level Security policies
-- Remove políticas muito permissivas e cria políticas mais específicas

-- Remove políticas existentes para auth.users (se existirem)
DROP POLICY IF EXISTS "Users can view all users" ON auth.users;
DROP POLICY IF EXISTS "Public read access to users" ON auth.users;

-- Políticas mais restritivas para cashback_rates
DROP POLICY IF EXISTS "Anyone can view cashback rates" ON public.cashback_rates;
CREATE POLICY "Authenticated users can view cashback rates" ON public.cashback_rates
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Políticas mais restritivas para miles_programs
DROP POLICY IF EXISTS "Anyone can view miles programs" ON public.miles_programs;
CREATE POLICY "Authenticated users can view miles programs" ON public.miles_programs
  FOR SELECT TO authenticated
  USING (true);

-- Políticas mais restritivas para offers
DROP POLICY IF EXISTS "Anyone can view offers" ON public.offers;
CREATE POLICY "Authenticated users can view offers" ON public.offers
  FOR SELECT TO authenticated
  USING (true);

-- Políticas mais restritivas para platform
DROP POLICY IF EXISTS "Anyone can view platforms" ON public.platform;
CREATE POLICY "Authenticated users can view platforms" ON public.platform
  FOR SELECT TO authenticated
  USING (true);

-- Políticas mais restritivas para reward_options
DROP POLICY IF EXISTS "Anyone can view reward options" ON public.reward_options;
CREATE POLICY "Authenticated users can view reward options" ON public.reward_options
  FOR SELECT TO authenticated
  USING (true);

-- Políticas mais restritivas para stores
DROP POLICY IF EXISTS "Anyone can view stores" ON public.stores;
CREATE POLICY "Authenticated users can view stores" ON public.stores
  FOR SELECT TO authenticated
  USING (true);

-- Políticas mais restritivas para user_accounts
DROP POLICY IF EXISTS "Anyone can view user accounts" ON public.user_accounts;
CREATE POLICY "Users can view own accounts" ON public.user_accounts
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts" ON public.user_accounts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts" ON public.user_accounts
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Políticas mais restritivas para user_preferences
DROP POLICY IF EXISTS "Anyone can view user preferences" ON public.user_preferences;
CREATE POLICY "Users can view own preferences" ON public.user_preferences
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON public.user_preferences
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public.user_preferences
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Políticas mais restritivas para user_simulations
DROP POLICY IF EXISTS "Anyone can view user simulations" ON public.user_simulations;
CREATE POLICY "Users can view own simulations" ON public.user_simulations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulations" ON public.user_simulations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own simulations" ON public.user_simulations
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_cashback_rates_platform ON public.cashback_rates(platform);
CREATE INDEX IF NOT EXISTS idx_cashback_rates_store ON public.cashback_rates(store_name);
CREATE INDEX IF NOT EXISTS idx_cashback_rates_active ON public.cashback_rates(is_active);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_accounts_user_id ON public.user_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_simulations_user_id ON public.user_simulations(user_id);

CREATE INDEX IF NOT EXISTS idx_rate_history_cashback_rate_id ON public.rate_history(cashback_rate_id);
CREATE INDEX IF NOT EXISTS idx_rate_history_changed_at ON public.rate_history(changed_at);

-- 4. Validações adicionais de segurança
-- Função para validar se usuário pode acessar dados
CREATE OR REPLACE FUNCTION public.can_access_user_data(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Usuário pode acessar seus próprios dados ou se for admin
  RETURN auth.uid() = target_user_id OR public.is_admin();
END;
$$;

-- Comentários de documentação
COMMENT ON FUNCTION public.test_auth_uid() IS 'Função segura para testar auth.uid() com search_path definido';
COMMENT ON FUNCTION public.update_timestamp() IS 'Trigger function para atualizar timestamps com search_path seguro';
COMMENT ON FUNCTION public.is_admin() IS 'Verifica se usuário atual é admin com search_path seguro';
COMMENT ON FUNCTION public.is_owner() IS 'Verifica se usuário é dono do recurso com search_path seguro';
COMMENT ON FUNCTION public.can_access_user_data(UUID) IS 'Valida acesso a dados de usuário específico';

-- Grant permissions necessárias
GRANT EXECUTE ON FUNCTION public.test_auth_uid() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_timestamp() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_owner(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_user_data(UUID) TO authenticated;
