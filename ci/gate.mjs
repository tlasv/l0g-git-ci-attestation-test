#!/usr/bin/env node
// Gate déterministe minimal pour le dépôt de test isolé (démonstration P5-D).
// Réplique, en réduction, le principe des gates l0g PG0–PG11 : verdict du gate-report
// + absence de secret en clair. Un seul échec => sortie non nulle (CI rouge, pas d'attestation).
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const articlePath = join(ROOT, 'article.md');
const reportPath = join(ROOT, 'evidence', 'gate-report.json');

function fail(msg) {
  process.stderr.write(`GATE BLOCK: ${msg}\n`);
  process.exit(1);
}

if (!existsSync(articlePath)) fail('article.md absent');
if (!existsSync(reportPath)) fail('evidence/gate-report.json absent');

const article = readFileSync(articlePath, 'utf8');
let report;
try {
  report = JSON.parse(readFileSync(reportPath, 'utf8'));
} catch {
  fail('gate-report.json illisible (JSON invalide)');
}

// Verdict : seuls PASS et PASS_WITH_WARNINGS autorisent la publication (miroir du schéma
// gate-report : verdict enum PASS | PASS_WITH_WARNINGS | BLOCK ; seul BLOCK bloque).
const PUBLISHABLE_VERDICTS = ['PASS', 'PASS_WITH_WARNINGS'];
if (!PUBLISHABLE_VERDICTS.includes(report.verdict)) {
  fail(`verdict ${report.verdict ?? 'absent'} (attendu PASS ou PASS_WITH_WARNINGS)`);
}

// Absence de secret en clair dans le contenu publié (miroir PG6 / audit-secrets).
const SECRET_PATTERNS = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /(?<![A-Z0-9])AKIA[0-9A-Z]{16}(?![A-Z0-9])/,
  /(?<![A-Za-z0-9_])(?:gh[pousr]_[A-Za-z0-9_]{30,}|github_pat_[A-Za-z0-9_]{30,})/,
  /(?<![A-Za-z0-9])sk-[A-Za-z0-9]{40,}/,
];
for (const pattern of SECRET_PATTERNS) {
  if (pattern.test(article) || pattern.test(JSON.stringify(report))) {
    fail('secret potentiel détecté dans le contenu');
  }
}

process.stdout.write(`GATE PASS: verdict=${report.verdict}\n`);
