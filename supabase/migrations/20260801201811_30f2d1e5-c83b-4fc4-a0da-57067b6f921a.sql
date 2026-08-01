-- 1. Restrict SECURITY DEFINER functions from direct client execution
REVOKE ALL ON FUNCTION public.consume_credits(uuid, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_credits(uuid, integer) TO service_role;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

-- 2. Explicit write restrictions on user_credits
REVOKE INSERT, UPDATE, DELETE ON public.user_credits FROM anon, authenticated;
GRANT SELECT ON public.user_credits TO authenticated;
GRANT ALL ON public.user_credits TO service_role;

CREATE POLICY "Service role manages user_credits"
ON public.user_credits FOR ALL TO service_role
USING (true) WITH CHECK (true);

CREATE POLICY "No client writes to user_credits"
ON public.user_credits AS RESTRICTIVE FOR ALL TO anon, authenticated
USING (true) WITH CHECK (false);

-- 3. Explicit write restrictions on user_roles
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM anon, authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

CREATE POLICY "Service role manages user_roles"
ON public.user_roles FOR ALL TO service_role
USING (true) WITH CHECK (true);

CREATE POLICY "No client writes to user_roles"
ON public.user_roles AS RESTRICTIVE FOR ALL TO anon, authenticated
USING (true) WITH CHECK (false);