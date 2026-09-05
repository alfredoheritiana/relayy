import { legalEntity, legalIsComplete } from "@/config/product";

const labels: Record<keyof typeof legalEntity, string> = {
  companyName: "raison sociale",
  registrationNumber: "numéro d’entreprise",
  address: "adresse du siège",
  contactEmail: "adresse e-mail de contact",
  dataController: "responsable du traitement",
  retentionMonths: "durée de conservation des données",
};

/**
 * Affiche l'identité légale quand elle est renseignée,
 * sinon la liste exacte des éléments encore manquants.
 */
export function LegalNotice() {
  if (legalIsComplete) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-5 text-sm">
        <p className="font-medium text-foreground">{legalEntity.companyName}</p>
        <p className="mt-1 text-muted-foreground">{legalEntity.address}</p>
        <p className="mt-1 text-muted-foreground">
          Numéro d’entreprise : {legalEntity.registrationNumber}
        </p>
        <p className="mt-1 text-muted-foreground">
          Responsable du traitement : {legalEntity.dataController} · {legalEntity.contactEmail}
        </p>
        <p className="mt-1 text-muted-foreground">
          Conservation des données : {legalEntity.retentionMonths} mois.
        </p>
      </div>
    );
  }

  const missing = (Object.keys(labels) as Array<keyof typeof legalEntity>).filter(
    (key) => legalEntity[key] === null,
  );

  return (
    <div
      role="note"
      className="rounded-2xl border border-dashed border-border bg-muted/40 p-5 text-sm"
    >
      <p className="font-medium text-foreground">Ce texte n’est pas encore définitif.</p>
      <p className="mt-2 text-muted-foreground">
        Il décrit fidèlement le fonctionnement du produit, mais les informations suivantes doivent
        être fournies par l’entreprise avant toute mise en production :
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
        {missing.map((key) => (
          <li key={key}>{labels[key]}</li>
        ))}
      </ul>
    </div>
  );
}
