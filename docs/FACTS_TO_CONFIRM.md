# Éléments à confirmer avant mise en production

Ces contenus sont des espaces réservés rédigés par défaut : ils doivent être validés par vous
(et, pour les points juridiques, par un conseil compétent).

## Entreprise et mentions légales

- Raison sociale exacte, numéro d’entreprise, adresse du siège.
- Adresse e-mail de contact pour les demandes relatives aux données personnelles.
- Identité du responsable du traitement et, le cas échéant, du délégué à la protection des données.

## Confidentialité et conservation

- Durée de conservation des demandes et des sessions de parcours.
- Liste des sous-traitants (hébergement, base de données, service d’interprétation) et pays d’hébergement.
- Base légale retenue pour le traitement des demandes entrantes.

## Conditions d’utilisation

- Périmètre du service, disponibilité annoncée et limitations de responsabilité.
- Modalités de résiliation et de suppression des données.

## Produit

- Zones desservies et services affichés dans la démonstration GeoLia (actuellement fictifs).
- Les demandes visibles dans le tableau de bord de démonstration sont des exemples locaux :
  elles n’existent pas en base et ne doivent pas être présentées comme des clients réels.

## Validation juridique — où saisir les informations

Les pages « Confidentialité » et « Conditions » affichent automatiquement un avertissement
tant que l’identité légale n’est pas renseignée dans `src/config/product.ts` (`legalEntity`) :

- `companyName` — raison sociale exacte
- `registrationNumber` — numéro d’entreprise
- `address` — adresse du siège
- `contactEmail` — adresse e-mail pour les demandes relatives aux données
- `dataController` — responsable du traitement
- `retentionMonths` — durée de conservation des demandes et sessions

Dès que ces six valeurs sont fournies, l’avertissement disparaît et le bloc d’identité
légale est affiché sur les deux pages. Le texte final reste à faire relire par un conseil.
