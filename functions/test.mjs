// Tests for the certificate rules. No Firebase, no emulator: certificate.js
// takes an injected `store`, so a plain object stands in for Firestore.
//
// Run:  npm test   (from functions/)

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { UNIT_IDS, TOTAL_UNITS } from './courseManifest.js';
import {
  CERTIFICATE_THRESHOLD_PERCENT,
  CertificateError,
  evaluateCompletion,
  issueCertificate,
  requiredUnits,
  sanitiseLearnerName,
  verificationCode,
  verifyCertificate
} from './certificate.js';

/** In-memory stand-in for the Firestore-backed store in index.js. */
function fakeStore({ progress = [], certificate = null } = {}) {
  const saved = { certificate };
  return {
    saves: 0,
    async getCertificate() {
      return saved.certificate;
    },
    async getProgress() {
      return progress;
    },
    async saveCertificate(uid, cert) {
      this.saves += 1;
      saved.certificate = cert;
    },
    async findCertificateByCode(code) {
      return saved.certificate?.code === code ? saved.certificate : null;
    }
  };
}

const completedUnits = (n) => UNIT_IDS.slice(0, n).map((id) => ({ unitId: id, completed: true }));

test('threshold is 75% of the real course', () => {
  assert.equal(CERTIFICATE_THRESHOLD_PERCENT, 75);
  assert.equal(TOTAL_UNITS, 30);
  assert.equal(requiredUnits(30), 23); // ceil(22.5)
});

test('eligibility flips exactly at the required unit count', () => {
  assert.equal(evaluateCompletion(completedUnits(22)).eligible, false);
  assert.equal(evaluateCompletion(completedUnits(23)).eligible, true);

  const just = evaluateCompletion(completedUnits(23));
  assert.equal(just.percent, 77);
  assert.equal(just.unitsRemaining, 0);

  const short = evaluateCompletion(completedUnits(20));
  assert.equal(short.unitsRemaining, 3);
});

test('incomplete, duplicated and unknown units cannot inflate the count', () => {
  const progress = [
    ...completedUnits(22),
    { unitId: '1.1', completed: true },              // duplicate of a counted unit
    { unitId: 'not-a-real-unit', completed: true },  // stale row for a deleted unit
    { unitId: '9.9', completed: true },              // fabricated unit id
    { unitId: UNIT_IDS[25], completed: false }       // opened but not finished
  ];
  const stats = evaluateCompletion(progress);
  assert.equal(stats.completedCount, 22, 'only distinct, known, completed units count');
  assert.equal(stats.eligible, false);
});

test('a learner below the threshold is refused with a useful message', async () => {
  const store = fakeStore({ progress: completedUnits(10) });
  await assert.rejects(
    () => issueCertificate({ store, uid: 'u1', email: 'a@b.c', learnerName: 'Ayşe Öztürk' }),
    (err) => {
      assert.ok(err instanceof CertificateError);
      assert.equal(err.code, 'failed-precondition');
      assert.match(err.message, /10 of 30 units \(33%\)/);
      assert.match(err.message, /13 to go/);
      return true;
    }
  );
  assert.equal(store.saves, 0, 'nothing is written for an ineligible learner');
});

test('an eligible learner is issued a certificate built from stored progress', async () => {
  const store = fakeStore({ progress: completedUnits(24) });
  const { certificate, alreadyIssued } = await issueCertificate({
    store,
    uid: 'u1',
    email: 'ayse@example.org',
    learnerName: 'Ayşe Öztürk',
    now: new Date('2026-09-28T09:00:00Z')
  });

  assert.equal(alreadyIssued, false);
  assert.equal(certificate.learnerName, 'Ayşe Öztürk');
  assert.equal(certificate.unitsCompleted, 24);
  assert.equal(certificate.unitsTotal, 30);
  assert.equal(certificate.percent, 80);
  assert.equal(certificate.thresholdPercent, 75);
  assert.match(certificate.code, /^CREDIT-2026-[0-9A-Z]{4}-[0-9A-Z]{3}$/);
  assert.equal(store.saves, 1);
});

test('issuing twice returns the original certificate and does not rewrite it', async () => {
  const store = fakeStore({ progress: completedUnits(24) });
  const first = await issueCertificate({ store, uid: 'u1', email: '', learnerName: 'Elif Kaya' });
  const second = await issueCertificate({ store, uid: 'u1', email: '', learnerName: 'Someone Else' });

  assert.equal(second.alreadyIssued, true);
  assert.equal(second.certificate.code, first.certificate.code, 'code stays stable');
  assert.equal(second.certificate.learnerName, 'Elif Kaya', 'name cannot be swapped after issue');
  assert.equal(store.saves, 1, 'only the first call writes');
});

test('the learner name is cleaned, and an empty one is rejected', () => {
  assert.equal(sanitiseLearnerName('  Ayşe   Öztürk '), 'Ayşe Öztürk');
  assert.equal(sanitiseLearnerName('Bad\u0000Name'), 'Bad Name');
  assert.equal(sanitiseLearnerName('x'.repeat(200)).length, 80);
  for (const bad of ['', '   ', null, undefined, '\u0000']) {
    assert.throws(() => sanitiseLearnerName(bad), /name that should appear/);
  }
});

test('an unauthenticated call is refused before any read', async () => {
  const store = fakeStore({ progress: completedUnits(30) });
  await assert.rejects(
    () => issueCertificate({ store, uid: null, learnerName: 'Nobody' }),
    (err) => err.code === 'unauthenticated'
  );
});

test('verification codes are deterministic per learner and day', () => {
  assert.equal(
    verificationCode('u1', '2026-09-28T09:00:00Z'),
    verificationCode('u1', '2026-09-28T23:59:00Z')
  );
  assert.notEqual(
    verificationCode('u1', '2026-09-28T09:00:00Z'),
    verificationCode('u2', '2026-09-28T09:00:00Z')
  );
});

test('verification returns only public fields, and rejects unknown codes', async () => {
  const store = fakeStore({ progress: completedUnits(24) });
  const { certificate } = await issueCertificate({
    store,
    uid: 'u1',
    email: 'private@example.org',
    learnerName: 'Elif Kaya'
  });

  const ok = await verifyCertificate({ store, code: certificate.code.toLowerCase() });
  assert.equal(ok.valid, true, 'lookup is case-insensitive');
  assert.equal(ok.learnerName, 'Elif Kaya');
  assert.equal(ok.percent, 80);
  assert.equal(ok.email, undefined, 'email is never returned');
  assert.equal(ok.uid, undefined, 'uid is never returned');

  assert.deepEqual(await verifyCertificate({ store, code: 'CREDIT-2026-XXXX-YYY' }), { valid: false });
  await assert.rejects(() => verifyCertificate({ store, code: '  ' }), /Provide the verification code/);
});
