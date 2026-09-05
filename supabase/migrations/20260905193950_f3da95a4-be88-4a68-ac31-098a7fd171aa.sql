ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_email_not_blank CHECK (length(trim(email)) > 0);