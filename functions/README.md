# CREDIT MOOC — Cloud Functions

Server-side issuing and verification of the certificate of completion.

## Why this exists

Certificates used to be written straight from the browser. That was convenient,
but it meant the document proved only that someone had opened the Firestore
console. Issuing now happens here:

- `firestore.rules` denies **all** client writes to `users/{uid}/certificates`.
- `issueCertificate` recomputes completion from the learner's stored progress
  using the Admin SDK, and only then writes the certificate.
- The unit list it counts against is generated from the real course data, so a
  client cannot claim the course is shorter than it is.

## Layout

| File | Purpose |
|---|---|
| `index.js` | Firebase wiring only — auth, Firestore access, error mapping |
| `certificate.js` | All the decision logic; no Firebase imports, fully testable |
| `courseManifest.js` | **Generated.** The canonical unit ids and total |
| `scripts/sync-manifest.mjs` | Regenerates the manifest from `src/data/courseData.js` |
| `test.mjs` | Tests for the rules, using a fake store |

## The functions

### `issueCertificateFn` (callable, requires sign-in)

```js
const issue = httpsCallable(functions, 'issueCertificateFn');
const { data } = await issue({ learnerName: 'Ayşe Öztürk' });
// → { certificate: {...}, alreadyIssued: false }
```

Refuses with `failed-precondition` below the 75% threshold, and the message
names how many units are still missing. Issuing twice returns the original
certificate unchanged — the verification code stays stable, and the name
cannot be swapped after the fact.

### `verifyCertificateFn` (callable, public by design)

```js
const verify = httpsCallable(functions, 'verifyCertificateFn');
const { data } = await verify({ code: 'CREDIT-2026-1O56-HFZ' });
// → { valid: true, learnerName, unitsCompleted, unitsTotal, percent, issuedAtISO }
```

Deliberately needs no account, so an employer or the National Agency can check
a printed certificate. Returns only what is already printed on the document —
never the learner's email or uid.

## Working on it

```bash
cd functions
npm install
npm test                # logic tests — no emulator, no project needed
npm run sync:manifest   # after adding or removing a unit in courseData.js
```

Running the emulators additionally needs the Firebase CLI and a Java runtime:

```bash
npm install -g firebase-tools
npm run serve           # functions + firestore + auth emulators
```

## Deploying

> **Cloud Functions require the Blaze (pay-as-you-go) plan.** The free Spark
> plan cannot deploy them. Usage for a MOOC this size falls inside the free
> monthly allowance, but a billing account must be attached.

```bash
npm install -g firebase-tools
firebase login
firebase use green-mooc

# 1. Functions first — the rules below assume they exist.
firebase deploy --only functions

# 2. Then the rules and the index verification needs.
firebase deploy --only firestore:rules,firestore:indexes
```

Deploy in that order. Publishing the rules first would lock out client writes
while nothing can issue a certificate yet, leaving eligible learners stuck.

If you need to roll back, the old behaviour is one rule away — restore
`allow create, update: if isOwner(uid);` on the `certificates` match block and
redeploy the rules.

## Things to check after deploying

- The region in `setGlobalOptions()` here matches `getFunctions(app, ...)` in
  `src/firebase.js`. Both are `europe-west1`. A mismatch fails at call time,
  not at build time.
- `firestore.indexes.json` declares the collection-group index on `code`, which
  `verifyCertificateFn` needs. Without it the verify call fails with
  `failed-precondition` and a link to create the index.
