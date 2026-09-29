// Regenerates functions/courseManifest.js from the course data the app uses.
//
// The certificate function must decide eligibility from its own copy of the
// curriculum: if it trusted a client-supplied unit count, a learner could
// claim the course has four units and finish it in an afternoon. Generating
// the manifest keeps the server authoritative without letting it drift from
// the real course.
//
// Run from functions/:  npm run sync:manifest
// Run it whenever a unit is added to or removed from src/data/courseData.js.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..', '..');

const { units } = await import(join(repoRoot, 'src', 'data', 'courseData.js'));

const unitIds = units.map((u) => u.id);
const duplicates = unitIds.filter((id, i) => unitIds.indexOf(id) !== i);
if (duplicates.length) {
  console.error(`Duplicate unit ids in courseData.js: ${duplicates.join(', ')}`);
  process.exit(1);
}

const file = `// GENERATED FILE — do not edit by hand.
// Regenerate with:  npm run sync:manifest   (from the functions/ directory)
//
// The canonical list of unit ids, mirrored from src/data/courseData.js so the
// certificate function can judge completion without trusting the client.

export const UNIT_IDS = Object.freeze([
${unitIds.map((id) => `  '${id}'`).join(',\n')}
]);

export const TOTAL_UNITS = ${unitIds.length};
`;

writeFileSync(join(here, '..', 'courseManifest.js'), file);
console.log(`Wrote courseManifest.js — ${unitIds.length} units.`);
