import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { product } from "@/config/product";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#product", label: "Produit", index: "01" },
  { href: "/#live-trace", label: "Démonstration", index: "02" },
  { href: "/#pour-qui", label: "Pour qui", index: "03" },
];

export function RelayWordmark({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span className="flex items-center gap-2">
      <span className="block size-2.5 rounded-full bg-relay-red" aria-hidden="true" />
      <span
        className={cn(
          "font-display text-lg font-extrabold tracking-tight",
          tone === "dark" ? "text-relay-white" : "text-foreground",
        )}
      >
        {product.name}
      </span>
    </span>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-200",
        scrolled || open ? "bg-relay-black" : "bg-transparent",
      )}
    >
      <div className="relay-container flex items-center justify-between gap-4 py-4">
        <Link to="/" aria-label={`${product.name} — accueil`}>
          <RelayWordmark tone="dark" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-display text-sm font-semibold text-relay-muted-dark transition-colors hover:text-relay-white"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/auth"
            className="font-display text-sm font-semibold text-relay-muted-dark transition-colors hover:text-relay-white"
          >
            Se connecter
          </Link>
          <Link
            to="/e/$slug"
            params={{ slug: "geolia-demo" }}
            className="inline-flex min-h-11 items-center rounded-lg bg-relay-red px-5 font-display text-sm font-semibold text-relay-white transition-colors hover:bg-relay-red-dark"
          >
            Tester Relay
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-lg border border-relay-line-dark text-relay-white md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
          <span aria-hidden="true" className="text-lg">
            {open ? "×" : "≡"}
          </span>
        </button>
      </div>

      {open ? (
        <div
          id="menu-mobile"
          className="fixed inset-x-0 bottom-0 top-[68px] z-50 overflow-y-auto bg-relay-black px-5 py-8 md:hidden"
        >
          <nav aria-label="Navigation mobile" className="flex flex-col">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-14 items-baseline gap-4 border-b border-relay-line-dark py-3"
              >
                <span className="relay-label text-relay-muted-dark">{link.index}</span>
                <span className="font-display text-3xl font-bold text-relay-white">
                  {link.label}
                </span>
              </a>
            ))}
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
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
