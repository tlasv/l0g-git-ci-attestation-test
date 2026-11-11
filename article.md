# Démonstration d'article synthétique (cible de test isolée)

Cet article est un contenu **synthétique non personnel**, produit pour valider la chaîne
de publication réelle Git → CI → attestation Sigstore sur un dépôt de test isolé.
Aucune personne identifiable, aucun secret, aucune donnée privée.

## Contexte

La chaîne de publication l0g (Phase 6, [P6-C1]) pousse un contenu vers un dépôt de test,
exécute une CI déterministe (`ci/gate.mjs`) puis atteste les artefacts via
`actions/attest-build-provenance` (OIDC GitHub → Fulcio → Rekor).

## Vérification attendue

Le verdict du gate-report est `PASS` ; la CI doit être verte ; une attestation Sigstore
doit être émise pour `release/article.md` et `release/gate-report.json`.
