import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { SignalPath, nodesFromIndex } from "@/components/relay/signal-path";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { product } from "@/config/product";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: `Connexion — ${product.name}` },
      {
        name: "description",
        content: "Connectez-vous à Relay pour gérer vos parcours d’intake et vos demandes.",
      },
      { property: "og:title", content: `Connexion — ${product.name}` },
      { property: "og:description", content: "Accès à votre espace Relay." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

/** Seules les destinations internes sont acceptées. */
function safeNext(): string {
  if (typeof window === "undefined") return "/app";
  const raw = new URLSearchParams(window.location.search).get("next");
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/app";
  return raw;
}

function humanizeAuthError(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login")) return "E-mail ou mot de passe incorrect.";
  if (normalized.includes("already registered"))
    return "Un compte existe déjà avec cette adresse. Connectez-vous.";
  if (normalized.includes("password"))
    return "Mot de passe trop faible : utilisez au moins 8 caractères variés.";
  if (normalized.includes("email not confirmed"))
    return "Votre adresse n’est pas encore confirmée. Vérifiez votre boîte mail.";
  return `Connexion impossible (${message}).`;
}

const proofs = [
  ["Parcours adaptatif", "Seules les questions manquantes sont posées."],
  ["Demande structurée", "Chaque demande arrive avec ses faits et leur provenance."],
  ["Scoring explicable", "Chaque score affiche ses raisons, jamais une boîte noire."],
] as const;

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const go = useCallback(() => {
    const next = safeNext();
    if (next === "/app") navigate({ to: "/app" });
    else window.location.assign(next);
  }, [navigate]);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) go();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) go();
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [go]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/app` },
        });
        if (signUpError) throw signUpError;
        setNotice("Compte créé. Vérifiez votre boîte mail si une confirmation est demandée.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
    } catch (caught) {
      setError(
        caught instanceof Error ? humanizeAuthError(caught.message) : "Connexion impossible.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[55fr_45fr]">
      <section className="order-2 flex items-center bg-ink px-6 py-12 text-background lg:order-1 lg:px-14">
        <div className="mx-auto w-full max-w-lg">
          <Link to="/" className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-signal" aria-hidden="true" />
            <span className="text-lg font-semibold">{product.name}</span>
          </Link>
          <SignalPath
            tone="dark"
            className="mt-10"
            nodes={nodesFromIndex(["Intention", "Contexte", "Qualification", "Action"], 3)}
          />
          <h2 className="mt-10 text-3xl font-medium leading-snug lg:text-4xl">
            De l’intention à l’action, sans formulaire à subir.
          </h2>
          <dl className="mt-10 space-y-6">
            {proofs.map(([title, body]) => (
              <div key={title} className="border-t border-background/15 pt-4">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">
                  {title}
                </dt>
                <dd className="mt-1 text-sm text-background/70">{body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="order-1 flex items-center px-5 py-12 lg:order-2 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-3xl font-semibold text-foreground">
            {mode === "signin" ? "Connexion" : "Créer un compte"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Accédez à vos parcours et à vos demandes structurées.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">Au moins 8 caractères.</p>
            </div>

            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
            {notice ? (
              <p aria-live="polite" className="text-sm text-muted-foreground">
                {notice}
              </p>
            ) : null}

            <Button type="submit" className="w-full" size="lg" disabled={pending}>
              {pending ? "Un instant…" : mode === "signin" ? "Se connecter" : "Créer mon compte"}
            </Button>
          </form>

          <button
            type="button"
            className="mt-6 min-h-11 w-full text-sm text-muted-foreground underline-offset-4 hover:underline"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setNotice(null);
            }}
          >
            {mode === "signin"
              ? "Pas encore de compte ? Créer un compte"
              : "Déjà un compte ? Se connecter"}
          </button>

          <Link
            to="/"
            className="mt-8 block text-sm text-muted-foreground underline underline-offset-4"
          >
            Retour à l’accueil
          </Link>
        </div>
      </section>
    </div>
  );
}
