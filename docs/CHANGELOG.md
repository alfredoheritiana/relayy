# Journal des évolutions

## Refonte de l’expérience produit

### Public

- **Accueil** entièrement reconstruit : promesse, composeur intention → action déterministe et local,
  bande de transformation Signal Path, comparaison formulaire/Relay, aperçu du Lead Object,
  audiences, principes et appel à l’action final.
- **Header et footer** communs, responsives, avec menu mobile accessible (cibles 44 px).
- **/demo** devient un hub à deux points de vue : parcours visiteur réel et tableau de bord
  entreprise en lecture seule, alimenté par des fixtures locales explicitement marquées
  « Démonstration ».
- **/e/$slug** : en-tête d’organisation, badge de démonstration uniquement pour GeoLia.
- **Pages légales** `/legal/confidentialite` et `/legal/conditions`.
- Polices Instrument Sans et JetBrains Mono réellement chargées.

### Parcours visiteur

- États explicites : squelette de chargement, message « Préparation… » après 1,5 s,
  délai maximal de 20 s, réessai, et repli local de simulation clairement étiqueté
  « Simulation terminée — aucun lead réel n’a été envoyé ».
- Signal Path comme fil de progression, annonces accessibles, focus géré à chaque étape.
- Double envoi impossible ; les réponses sont conservées en cas d’erreur.

### Espace de travail

- **/app** redirige selon l’état réel : non connecté → `/auth?next=…`, sans organisation →
  `/onboarding`, sinon `/app/inbox`.
- **/auth** en composition 55/45, erreurs traduites en français, prise en charge de `next`
  (destinations internes uniquement).
- **App shell** : barre latérale sombre en desktop, barre supérieure + menu déplié en mobile,
  contexte d’organisation et accès au parcours publié.
- **Onboarding** transformé en assistant une décision par étape, avec Signal Path, validation
  par étape, retour arrière et récapitulatif avant création.
- **Inbox** : recherche, filtres de statut, tris (récence, score, priorité d’action),
  squelettes, erreurs avec réessai, état vide actionnable.
- **Fiche demande** réordonnée : statut et action recommandée, identité et contact, résumé et
  faits, informations manquantes, scores explicables dans un rail latéral, puis
  **transcript fermé par défaut**.
- **Expériences** : statut, date de mise à jour, lien public copiable, état vide actionnable.

### Fondations préservées

Migrations, RLS, isolation multi-tenant, fonctions serveur, moteur adaptatif déterministe,
interprétation IA côté serveur avec repli et création de lead idempotente sous consentement.

### Vérifications

- Typecheck : sans erreur.
- Tests : 17 tests du moteur passent.
- Navigateur : `/`, `/demo`, `/e/geolia-demo`, `/auth`, `/app`, pages légales — 200, aucune erreur console.
- Parcours GeoLia de bout en bout : la phrase de référence produit 4 faits, une seule question
  restante (e-mail), puis un envoi réel confirmé. Les demandes de test ont été supprimées.
- Analyse de sécurité de la base : aucune anomalie.

### À confirmer

Voir `docs/FACTS_TO_CONFIRM.md`.

## Éditeur guidé, Knowledge et Analytics

- Éditeur guidé d’expériences : création (`/app/experiences/new`) et édition
  (`/app/experiences/:id`) en cinq étapes, avec aperçu en direct des questions générées.
- Génération déterministe de la définition et des règles de qualification à partir des
  réglages (services, zones, échéances, coordonnées demandées) — `src/domain/definitions/builder.ts`.
- Versionnage réel : chaque enregistrement met à jour le brouillon, la publication crée la
  version servie aux visiteurs sans modifier les demandes déjà reçues.
- Refonte des écrans Knowledge (couverture, profil, services, sources) et Analytics
  (métriques expliquées, barres de répartition, états vides et erreurs).
- Pages juridiques : identité légale centralisée dans `src/config/product.ts` et
  avertissement automatique tant qu’elle est incomplète.
- Vérifications : typecheck, 21 tests, création puis publication d’un parcours en navigateur
  (données de test supprimées).
