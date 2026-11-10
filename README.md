# Chaîne Git/CI/attestation réelle — CI de démonstration (dépôt de test isolé)

Ce dépôt est un **dépôt de test isolé** de COMPAGNIE DEV (projet l0g, Phase 5 lot P5-D).
Il ne sert qu'à **prouver** la chaîne « Git remote → CI → attestation vérifiable » avec ses
chemins d'échec. Il n'est **jamais** une cible de publication ni le dépôt amont (`bluetouff/l0g`).

## Ce que fait la CI

À chaque push sur une branche `auto/**` ou `test/**` :

1. **Gates déterministes** (`node ci/gate.mjs`) : lit `article.md` + `evidence/gate-report.json`,
   vérifie `verdict === "PASS"` et l'absence de secret en clair dans le contenu.
   - Verdict `BLOCK` ou erreur → la CI échoue (rouge), **aucune attestation** n'est produite.
2. **Artifacts** : copie `article.md` + `evidence/gate-report.json` + un manifest `release/manifest.json`.
3. **Attestation Sigstore** (`actions/attest-build-provenance`, OIDC GitHub) sur les artifacts
   `release/article.md` et `release/gate-report.json`.
4. **Vérification indépendante** possible côté client avec :
   `gh attestation verify <fichier> --repo tlasv/l0g-git-ci-attestation-test`.

## Secrets

La CI ne reçoit **aucun secret en clair** : le marqueur de secret de démonstration est lu
depuis le secret store GitHub Actions (`ATTEST_TEST_SECRET`, valeur factice non sensible),
jamais affiché, et seule son empreinte SHA-256 est inscrite dans le manifest.

## Nettoyage

Ce dépôt est jetable. Voir la procédure de nettoyage dans le document `git-ci-attestation-test`
de l'issue COM-1597 (Compagnie DEV). Supprimer le dépôt et les branches `auto/*` / `test/*`
après la validation de Phase 5.
