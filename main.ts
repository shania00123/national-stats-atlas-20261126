// Nusa in Numbers entrypoint.
//
// Stages the static site into the output directory, then writes the dossier
// the scorer reads. The site itself lives in app/ beside this file; captures
// of the running site live in screenshots/ beside this file when present.

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildDossier,
  canonicalJson,
  DOSSIER_SCHEMA,
  DossierError,
  firstLoadOf,
  gzipBytes,
  htmlFacts,
  readAppTree,
} from './vendor/makefun-frontend.ts';

// Caps handed to the dossier builder: the same figures the scorer applies.
const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

// Copy one staged directory when it exists; report whether anything moved.
function stageDirectory(name: string): boolean {
  const from = join(here, name);
  if (!existsSync(from)) return false;
  cpSync(from, join(outDir, name), { recursive: true });
  return true;
}

// Totals line for a local run that has no captures yet. Computed with the
// dossier library's own load walk so the figures match a full build.
function localTotalsLine(): string {
  const appDir = join(outDir, 'app');
  const tree = readAppTree(appDir, {
    app_max_files: CAPS.app_max_files,
    app_max_bytes: CAPS.app_max_bytes,
  });
  const bytesOf = (path: string): Buffer => readFileSync(join(appDir, path));
  const facts = htmlFacts(bytesOf('index.html').toString('utf8'));
  const first = firstLoadOf(tree, facts, (path) => bytesOf(path).toString('utf8'));
  const sized = (path: string): { raw: number; gzip: number } => {
    const bytes = bytesOf(path);
    return { raw: bytes.length, gzip: gzipBytes(new Uint8Array(bytes)) };
  };
  const sum = (list: { raw: number; gzip: number }[], key: 'raw' | 'gzip'): number =>
    list.reduce((total, item) => total + item[key], 0);
  const describe = (list: { raw: number; gzip: number }[], withRaw: boolean): string => {
    const raw = withRaw ? ` (${sum(list, 'raw')} raw)` : '';
    return `${list.length} file${list.length === 1 ? '' : 's'}, ${sum(list, 'gzip')} bytes gzip-9${raw}`;
  };
  const load = first.paths.map(sized);
  const later = first.later.map(sized);
  return `Totals: first load ${describe(load, true)}; later by import() ${describe(later, false)}; whole app ${tree.files.length} files, ${tree.totalBytes} bytes`;
}

// Dossier bytes for a local run without captures: real load totals, no images.
function localDossier(): Uint8Array {
  const text =
    '## Load\n\n' +
    `${localTotalsLine()}\n\n` +
    'Local run without screenshots: add screenshots/ beside main.ts and re-run to build the full dossier.\n';
  const doc = { schema: DOSSIER_SCHEMA, cover: 0, text, images: [] };
  return new TextEncoder().encode(canonicalJson(doc));
}

// Clear staged copies from an earlier run so removed files cannot linger.
function clearStagedOutput(): void {
  for (const name of ['app', 'screenshots', 'dossier.json']) {
    rmSync(join(outDir, name), { recursive: true, force: true });
  }
}

function main(): void {
  mkdirSync(outDir, { recursive: true });
  clearStagedOutput();
  stageDirectory('app');
  const stagedShots = stageDirectory('screenshots');

  let dossier: Uint8Array;
  try {
    dossier = buildDossier(outDir, CAPS);
  } catch (err) {
    const missingShots = err instanceof DossierError && /screenshots/.test(err.message);
    if (!missingShots || stagedShots) throw err;
    console.log('No screenshots/ yet: writing a local dossier with load totals only.');
    dossier = localDossier();
  }

  const dossierPath = join(outDir, 'dossier.json');
  writeFileSync(dossierPath, dossier);
  console.log(`Staged app/ into ${outDir}`);
  console.log(`Wrote ${dossierPath} (${dossier.length} bytes)`);
}

main();
