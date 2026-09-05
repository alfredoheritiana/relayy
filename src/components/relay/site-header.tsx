import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { product } from "@/config/product";

const links = [
  { href: "/#produit", label: "Produit" },
  { href: "/#demo-live", label: "Démonstration" },
  { href: "/#pour-qui", label: "Pour qui" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 lg:px-10">
        <Link to="/" className="flex items-center gap-2" aria-label={`${product.name} — accueil`}>
          <span className="size-2.5 rounded-full bg-primary" aria-hidden="true" />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            {product.name}
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground">
            Se connecter
          </Link>
          <Button asChild size="sm">
            <Link to="/e/$slug" params={{ slug: "geolia-demo" }}>
              Tester Relay
            </Link>
          </Button>
        </nav>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-lg border border-border md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
          <span aria-hidden="true" className="text-base">
            {open ? "×" : "≡"}
          </span>
        </button>
      </div>

      {open ? (
        <div id="menu-mobile" className="border-t border-border bg-paper px-5 py-4 md:hidden">
          <nav aria-label="Navigation mobile" className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center text-sm text-foreground"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center text-sm text-foreground"
            >
              Se connecter
            </Link>
            <Button asChild className="mt-2">
              <Link to="/e/$slug" params={{ slug: "geolia-demo" }} onClick={() => setOpen(false)}>
                Tester Relay
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-paper">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 md:grid-cols-[1.5fr_1fr_1fr] lg:px-10">
        <div>
          <p className="text-lg font-semibold text-foreground">{product.name}</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">{product.mission}</p>
        </div>
        <nav aria-label="Produit" className="text-sm">
          <p className="font-medium text-foreground">Produit</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <a href="/#produit" className="hover:text-foreground">
                Fonctionnement
              </a>
            </li>
            <li>
              <Link to="/demo" className="hover:text-foreground">
                Démonstration
              </Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-foreground">
                Connexion
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Informations légales" className="text-sm">
          <p className="font-medium text-foreground">Informations</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <Link to="/legal/confidentialite" className="hover:text-foreground">
                Confidentialité
              </Link>
            </li>
            <li>
              <Link to="/legal/conditions" className="hover:text-foreground">
                Conditions
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
