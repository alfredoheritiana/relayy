ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_email_format CHECK (position('@' in email) > 1);