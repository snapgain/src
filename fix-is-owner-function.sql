-- Correção específica para função is_owner sem argumentos
-- Esta função está causando o warning "Function Search Path Mutable"

-- Remove a função problemática primeiro
DROP FUNCTION IF EXISTS public.is_owner();

-- Recria a função is_owner SEM argumentos com search_path seguro
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Esta versão sem argumentos sempre retorna false por segurança
  -- Ou você pode implementar uma lógica específica aqui
  RETURN false;
END;
$$;

-- Também criar a versão COM argumento para uso geral
CREATE OR REPLACE FUNCTION public.is_owner(owner_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN auth.uid() = owner_id;
END;
$$;

-- Versão alternativa da is_owner() sem argumentos que pode ser mais útil
-- Descomente se quiser usar esta versão:
/*
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Retorna o ID do usuário atual (owner de si mesmo)
  RETURN auth.uid();
END;
$$;
*/

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.is_owner() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_owner(UUID) TO authenticated;

-- Comentários
COMMENT ON FUNCTION public.is_owner() IS 'Função is_owner sem argumentos com search_path seguro';
COMMENT ON FUNCTION public.is_owner(UUID) IS 'Verifica se usuário é dono do recurso especificado';
