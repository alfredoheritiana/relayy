import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { product } from "@/config/product";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", hash: "product", label: "Produit", description: "Le système", index: "01" },
  { to: "/demo", label: "Démonstration", description: "Voir le flux", index: "02" },
  { to: "/", hash: "for-who", label: "Pour qui", description: "Cas d’usage", index: "03" },
] as const;

export function RelayWordmark({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span className="group flex items-center gap-2">
      <span
        className="block size-2.5 rounded-full bg-relay-red transition-transform duration-150 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
      <span
        className={cn(
          "font-display text-[22px] font-bold tracking-tight",
          tone === "dark" ? "text-relay-white" : "text-foreground",
        )}
      >
        {product.name}
      </span>
      <span
        className={cn(
          "hidden border-l border-relay-line-dark pl-3 font-mono text-[10px] uppercase tracking-[0.16em] sm:inline",
          tone === "dark" ? "text-relay-muted-dark" : "text-muted-foreground",
        )}
      >
        Adaptive intake
      </span>
    </span>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-200",
        scrolled || open
          ? "border-relay-line-dark bg-relay-black/95"
          : "border-relay-white/10 bg-relay-black/85",
      )}
    >
      <div className="relay-container grid min-h-16 grid-cols-[1fr_auto] items-center gap-4 py-2.5 lg:min-h-[74px] lg:grid-cols-12">
        <Link
          to="/"
          aria-label="Relay — accueil"
          className="group inline-flex min-h-11 items-center lg:col-span-3"
        >
          <RelayWordmark tone="dark" />
        </Link>

        <nav
          aria-label="Navigation principale"
          className="hidden items-stretch justify-center gap-1 lg:col-span-6 lg:flex"
        >
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              {...("hash" in link ? { hash: link.hash } : {})}
              className="group relative flex min-h-11 min-w-[116px] flex-col justify-center border-l border-relay-line-dark px-4 py-2 text-left text-relay-muted-dark transition-colors hover:text-relay-white"
            >
              <span className="font-mono text-[10px] tracking-[0.16em] text-relay-muted-dark">
                {link.index}
              </span>
              <span className="font-sans text-sm font-semibold">{link.label}</span>
              <span className="text-[11px] transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:text-relay-white">
                {link.description}
              </span>
              <span
                aria-hidden="true"
                className="absolute inset-x-4 bottom-0 h-0.5 origin-left scale-x-0 bg-relay-red transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </Link>
          ))}
          <div className="flex items-center justify-end gap-5 border-l border-relay-line-dark pl-5 lg:col-span-3">
            <Link
              to="/auth"
              search={{ next: "/app" }}
              className="hidden min-h-11 items-center font-sans text-sm font-semibold text-relay-muted-dark transition-colors hover:text-relay-white sm:inline-flex"
            >
              Se connecter
            </Link>
            <Link
              to="/e/$slug"
              params={{ slug: "geolia-demo" }}
              className="group inline-flex min-h-11 items-center gap-3 rounded-lg bg-relay-red px-5 font-display text-sm font-semibold text-relay-white transition-colors hover:bg-relay-red-dark active:scale-[.985]"
            >
              Tester Relay ↗
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-lg border border-relay-line-dark text-relay-white lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {open ? (
        <div
          id="menu-mobile"
          className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto bg-relay-black px-5 py-8 md:hidden"
        >
          <nav aria-label="Navigation mobile" className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                {...("hash" in link ? { hash: link.hash } : {})}
                onClick={closeMenu}
                className="flex min-h-14 items-baseline gap-4 border-b border-relay-line-dark py-3"
              >
                <span className="relay-label text-relay-muted-dark">{link.index}</span>
                <span>
                  <span className="font-display text-3xl font-bold text-relay-white">
                    {link.label}
                  </span>
                  <span className="mt-1 block text-sm text-relay-muted-dark">
                    {link.description}
                  </span>
                </span>
              </Link>
            ))}
            <Link
              to="/auth"
              onClick={closeMenu}
              className="flex min-h-14 items-baseline gap-4 border-b border-relay-line-dark py-3"
            >
              <span className="relay-label text-relay-muted-dark">04</span>
              <span className="font-display text-3xl font-bold text-relay-white">Se connecter</span>
            </Link>
            <Link
              to="/e/$slug"
              params={{ slug: "geolia-demo" }}
              onClick={() => setOpen(false)}
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-relay-red px-5 font-display text-base font-semibold text-relay-white"
            >
              Tester Relay
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-relay-black py-14 text-relay-muted-dark">
      <div className="relay-container grid gap-10 md:grid-cols-12">
        <div className="md:col-span-6">
          <RelayWordmark tone="dark" />
          <p className="relay-voice mt-4 max-w-md text-2xl text-relay-white">
            De l’intention à l’action, sans formulaire à subir.
          </p>
        </div>
        <nav aria-label="Liens Relay" className="md:col-span-3">
          <p className="relay-label">Produit</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="/#product" className="hover:text-relay-white">
                Comment ça marche
              </a>
            </li>
            <li>
              <Link to="/demo" className="hover:text-relay-white">
                Démonstration
              </Link>
            </li>
            <li>
              <Link
                to="/e/$slug"
                params={{ slug: "geolia-demo" }}
                className="hover:text-relay-white"
              >
                Parcours visiteur
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Liens légaux" className="md:col-span-3">
          <p className="relay-label">Accès et cadre</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/auth" className="hover:text-relay-white">
                Connexion
              </Link>
            </li>
            <li>
              <Link to="/legal/confidentialite" className="hover:text-relay-white">
                Confidentialité
              </Link>
            </li>
            <li>
              <Link to="/legal/conditions" className="hover:text-relay-white">
                Conditions
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
