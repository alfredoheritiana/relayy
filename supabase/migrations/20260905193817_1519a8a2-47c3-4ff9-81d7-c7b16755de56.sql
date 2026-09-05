UPDATE public.profiles
SET email = u.email
FROM auth.users u
WHERE profiles.id = u.id AND profiles.email IS NULL;

ALTER TABLE public.profiles
  ALTER COLUMN email SET NOT NULL;