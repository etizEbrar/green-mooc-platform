// Cloud Functions for the CREDIT MOOC.
//
// Why these exist: certificates used to be written straight from the browser,
// which meant a learner with the Firestore console open could award themselves
// one. Issuing now happens here, with firestore.rules denying all client
// writes to `certificates`, so a certificate can only come from this code
// path — where completion is recomputed from stored progress.
//
// The decision logic lives in certificate.js and is unit-tested (npm test).
// This file only handles Firebase wiring: auth, Firestore access and errors.

import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import { logger } from 'firebase-functions';

import {
  CERTIFICATE_DOC_ID,
  CertificateError,
  issueCertificate,
  verifyCertificate
} from './certificate.js';

initializeApp();
const db = getFirestore();

// europe-west1 keeps learner data in the EU, which the consortium needs for an
// Erasmus+ project. maxInstances caps spend on a grant-funded project.
setGlobalOptions({ region: 'europe-west1', maxInstances: 10 });

// The persistence surface certificate.js depends on. Keeping it this small is
// what lets the logic be tested with a plain object in place of Firestore.
const store = {
  async getCertificate(uid) {
    const snap = await db
      .collection('users')
      .doc(uid)
      .collection('certificates')
      .doc(CERTIFICATE_DOC_ID)
      .get();
    return snap.exists ? snap.data() : null;
  },

  async getProgress(uid) {
    const snap = await db.collection('users').doc(uid).collection('progress').get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async saveCertificate(uid, certificate) {
    await db
      .collection('users')
      .doc(uid)
      .collection('certificates')
      .doc(CERTIFICATE_DOC_ID)
      .set({ ...certificate, issuedAt: FieldValue.serverTimestamp() });
  },

  async findCertificateByCode(code) {
    // Needs the collection-group index on `code` declared in
    // firestore.indexes.json.
    const snap = await db
      .collectionGroup('certificates')
      .where('code', '==', code)
      .limit(1)
      .get();
    return snap.empty ? null : snap.docs[0].data();
  }
};

/** Translate a CertificateError into the HttpsError the client will see. */
function toHttpsError(err, fallbackMessage) {
  if (err instanceof CertificateError) {
    return new HttpsError(err.code, err.message);
  }
  logger.error(fallbackMessage, err);
  return new HttpsError('internal', fallbackMessage);
}

/**
 * issueCertificate — callable, requires a signed-in learner.
 *
 * Request:  { learnerName: string }
 * Response: { certificate: {...}, alreadyIssued: boolean }
 */
export const issueCertificateFn = onCall({ cors: true }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError('unauthenticated', 'You must be signed in to request a certificate.');
  }

  try {
    const result = await issueCertificate({
      store,
      uid,
      email: request.auth.token?.email || '',
      learnerName: request.data?.learnerName
    });

    if (!result.alreadyIssued) {
      logger.info('Certificate issued', {
        uid,
        code: result.certificate.code,
        percent: result.certificate.percent
      });
    }
    return result;
  } catch (err) {
    throw toHttpsError(err, 'Could not issue the certificate. Please try again.');
  }
});

/**
 * verifyCertificate — callable, deliberately public.
 *
 * Anyone holding a printed certificate (an employer, the National Agency,
 * EACEA) can confirm it is genuine without an account. Returns only the
 * details already printed on the document.
 *
 * Request:  { code: string }
 * Response: { valid: boolean, learnerName?, percent?, issuedAtISO?, ... }
 */
export const verifyCertificateFn = onCall({ cors: true }, async (request) => {
  try {
    return await verifyCertificate({ store, code: request.data?.code });
  } catch (err) {
    throw toHttpsError(err, 'Could not check that code. Please try again.');
  }
});
