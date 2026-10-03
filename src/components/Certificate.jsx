import { project } from '../data/projectData';
import { brand } from '../data/brand';
import QrCode from './QrCode';
import { certificateVerifyUrl, formatIssueDate } from '../lib/certificate';

// The printable certificate itself. Presentational only — it receives an
// already-issued certificate record, so it can be rendered anywhere
// (certificate page, print preview, PDF export).
//
// Artwork that has not been supplied yet is simply left out (see
// data/brand.js), so the certificate never prints a broken image.
export default function Certificate({ cert }) {
  const verifyUrl = certificateVerifyUrl(cert.code);
  const partnerLogos = brand.partners.filter((p) => p.src);

  return (
    <article className="certificate" aria-label="Certificate of completion">
      <div className="certificate__border">
        <header className="certificate__head">
          {brand.euEmblem && (
            <img
              className="certificate__eu"
              src={brand.euEmblem}
              alt="Co-funded by the European Union"
            />
          )}
          <div className="certificate__head-text">
            <p className="certificate__programme">{project.programme}</p>
            <p className="certificate__project">
              {project.acronym} — {project.title}
            </p>
          </div>
          {brand.projectLogo && (
            <img className="certificate__project-logo" src={brand.projectLogo} alt={project.acronym} />
          )}
        </header>

        <div className="certificate__main">
          <p className="certificate__kicker">Certificate of Completion</p>
          <p className="certificate__awarded">This is to certify that</p>
          <h2 className="certificate__name">{cert.learnerName}</h2>
          <p className="certificate__body">
            has successfully completed <strong>{cert.unitsCompleted}</strong> of{' '}
            <strong>{cert.unitsTotal}</strong> units ({cert.percent}%) of the online course
          </p>
          <p className="certificate__course">Green &amp; Circular Economy for SMEs</p>
          <p className="certificate__body certificate__body--small">
            meeting the {cert.thresholdPercent}% completion requirement set by the{' '}
            {project.acronym} consortium.
          </p>
        </div>

        <div className="certificate__sign-row">
          <div className="certificate__signature">
            {brand.signature && (
              <>
                <img className="certificate__signature-img" src={brand.signature} alt="" />
                <span className="certificate__signature-line" />
                {brand.signatory.name && (
                  <strong className="certificate__signatory">{brand.signatory.name}</strong>
                )}
                <span className="certificate__signatory-role">{brand.signatory.role}</span>
              </>
            )}
          </div>

          {partnerLogos.length > 0 && (
            <div className="certificate__partners">
              <span className="certificate__meta-label">Project partners</span>
              <div className="certificate__partner-logos">
                {partnerLogos.map((p) => (
                  <img key={p.name} src={p.src} alt={p.name} title={p.name} />
                ))}
              </div>
            </div>
          )}

          <div className="certificate__qr">
            <QrCode value={verifyUrl} size={96} />
            <span className="certificate__qr-caption">Scan to verify</span>
          </div>
        </div>

        <footer className="certificate__foot">
          <div className="certificate__meta">
            <span className="certificate__meta-label">Date of issue</span>
            <strong>{formatIssueDate(cert.issuedAtISO)}</strong>
          </div>
          <div className="certificate__meta">
            <span className="certificate__meta-label">Verification code</span>
            <strong>{cert.code}</strong>
          </div>
          <div className="certificate__meta">
            <span className="certificate__meta-label">Grant agreement</span>
            <strong>{project.grantNumber}</strong>
          </div>
        </footer>

        {/* Printed as text as well as the QR code: the PDF is a picture, so a
            link would not be clickable, and not everyone has a scanner. */}
        <p className="certificate__verify">
          Verify this certificate at <strong>{verifyUrl}</strong>
        </p>

        <p className="certificate__disclaimer">{project.disclaimer}</p>
      </div>
    </article>
  );
}
