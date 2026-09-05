# Relay

Relay remplace les formulaires d'intake par une conversation adaptative : le visiteur décrit son besoin en une phrase, Relay comprend ce qui est déjà dit, ne pose que les questions réellement manquantes, puis transmet à l'entreprise une demande structurée, résumée et qualifiée.

## Parcours produit

| Route | Accès | Rôle |
| --- | --- | --- |
| `/` | public | présentation du produit |
| `/demo` | public | démonstration GeoLia (géomètre) |
| `/e/$slug` | public | parcours public d'une expérience publiée |
| `/auth` | public | connexion / création de compte |
| `/onboarding` | connecté | création de l'espace de travail |
| `/app/inbox` | connecté | demandes reçues, filtrables par statut |
| `/app/leads/$leadId` | connecté | détail, score, conversation, changement de statut |
| `/app/experiences` | connecté | parcours publiés et versionnés |
| `/app/knowledge` | connecté | Business Brain (profil, services, sources) |
| `/app/analytics` | connecté | complétion, informations manquantes, abandons |
| `/app/settings` | connecté | informations de l'espace |

## Phrase de référence

> « Je voudrais faire borner mon terrain au 23 rue X à Waterloo avant de poser une clôture le mois prochain. »

Relay en extrait le service (bornage), le lieu (23 rue X à Waterloo), l'objectif (poser une clôture) et l'échéance (le mois prochain), puis ne demande plus que l'adresse e-mail avant le récapitulatif.

## Architecture

- **Front** : TanStack Start (routes fichiers), React 19, Tailwind v4, tokens sémantiques dans `src/styles.css`.
- **Moteur adaptatif** : `src/domain/` — types, moteur de questions (`engine.ts`), scoring déterministe (`scoring.ts`), extraction de secours en français (`extraction.ts`), définition GeoLia (`definitions/geolia.ts`).
- **Serveur** : `src/lib/relay/`
  - `visitor.functions.ts` — fonctions publiques : démarrage de session, réponse, confirmation avec consentement, abandon.
  - `workspace.functions.ts` — fonctions authentifiées : espace, demandes, expériences, knowledge, analytics.
  - `interpret.server.ts` — interprétation IA côté serveur avec repli déterministe.
  - `session.server.ts` — jetons de session hachés (SHA-256), journalisation d'événements.
- **Base de données** : Supabase, RLS active sur toutes les tables, isolation par organisation via des fonctions internes du schéma `private`.

## Règles clés

- Précédence des valeurs : `corrected > explicit > extracted_high > extracted_low`, seuil de confiance 0.78.
- Aucune donnée de contact n'est jamais déduite : e-mail, téléphone et nom sont toujours demandés.
- Une demande par session, création uniquement après consentement explicite.
- Le scoring est déterministe et versionné : chaque raison affichée renvoie à une règle.

## Développement

```bash
bun install
bun run dev        # http://localhost:8080
bunx vitest run    # tests du moteur adaptatif
```
