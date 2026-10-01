import { project } from '../data/projectData';
import {
  pilots,
  publishedPilots,
  totalPilotParticipants,
  PHOTO_PLACEHOLDER_COUNT
} from '../data/pilotData';

// "Pilot Activities & Practical Implementation" — a card section on the
// landing page. PA6 asked for this in front of every visitor rather than on a
// route of its own, so it is a section component, not a page.
//
// Each card carries the three headings agreed at the meeting — methodology,
// impact, participant engagement — plus a photo grid and a contextual link
// through to the project site. A partner who has not yet supplied content
// gets a clearly marked placeholder card instead of invented figures.
export default function PilotActivities() {
  const published = publishedPilots();
  const participants = totalPilotParticipants();
  const anyPublished = published.length > 0;

  return (
    <section className="about-section pilot-section" id="pilots">
      <div className="section-head">
        <h2>Pilot Activities &amp; Practical Implementation</h2>
        <p>
          Before this MOOC was published, each partner ran the training with entrepreneurs,
          employees and trainers in their own country. Their feedback shaped the units you can
          take here.
        </p>
      </div>

      {anyPublished && (
        <div className="pilot-summary">
          <div>
            <strong>{published.length}</strong>
            <span>{published.length === 1 ? 'country' : 'countries'}</span>
          </div>
          {participants && (
            <div>
              <strong>{participants}</strong>
              <span>participants</span>
            </div>
          )}
          <div>
            <strong>{pilots.length}</strong>
            <span>partner organisations</span>
          </div>
        </div>
      )}

      <div className="grid grid--pilots">
        {pilots.map((pilot) => (
          <PilotCard key={pilot.id} pilot={pilot} />
        ))}
      </div>

      <p className="pilot-section__foot muted">
        Full pilot reports and project deliverables are published on the {project.acronym} project
        website —{' '}
        <a href={project.website} target="_blank" rel="noreferrer">
          {project.website.replace('https://', '')} ↗
        </a>
      </p>
    </section>
  );
}

function PilotCard({ pilot }) {
  const photos = pilot.photos?.length ? pilot.photos : null;

  return (
    <article className={`pilot-card ${pilot.published ? '' : 'is-pending'}`} id={`pilot-${pilot.id}`}>
      <header className="pilot-card__head">
        <span className="pilot-card__flag" aria-hidden="true">
          {pilot.flag}
        </span>
        <div className="pilot-card__ident">
          <h3>{pilot.country}</h3>
          <p className="muted">{pilot.partner}</p>
        </div>
        {pilot.participants ? (
          <span className="pilot-card__count">
            <strong>{pilot.participants}</strong>
            <span>took part</span>
          </span>
        ) : null}
      </header>

      {(pilot.dates || pilot.location) && (
        <p className="pilot-card__meta muted">
          {[pilot.dates, pilot.location].filter(Boolean).join(' · ')}
        </p>
      )}

      {/* Photo grid — real photographs when supplied, otherwise placeholder
          tiles so the layout can be reviewed before they arrive. */}
      <div className="pilot-photos" aria-label={`${pilot.country} pilot photographs`}>
        {photos
          ? photos.map((photo, i) => (
              <figure key={i} className="pilot-photo">
                <img
                  src={photo.src}
                  alt={photo.caption || `${pilot.country} pilot activity`}
                  loading="lazy"
                />
                {photo.caption && <figcaption>{photo.caption}</figcaption>}
              </figure>
            ))
          : Array.from({ length: PHOTO_PLACEHOLDER_COUNT }).map((_, i) => (
              <div key={i} className="pilot-photo pilot-photo--placeholder" aria-hidden="true">
                <span>📷</span>
              </div>
            ))}
      </div>

      {pilot.published ? (
        <dl className="pilot-card__detail">
          {pilot.methodology && (
            <div>
              <dt>Methodology</dt>
              <dd>{pilot.methodology}</dd>
            </div>
          )}
          {pilot.impact && (
            <div>
              <dt>Impact</dt>
              <dd>{pilot.impact}</dd>
            </div>
          )}
          {pilot.engagement && (
            <div>
              <dt>Participant engagement</dt>
              <dd>{pilot.engagement}</dd>
            </div>
          )}
        </dl>
      ) : (
        <p className="pilot-card__pending">
          <span aria-hidden="true">🕗</span> {pilot.partner} is finalising the methodology, impact
          and engagement figures for the {pilot.country} pilot. They will be published here.
        </p>
      )}

      {pilot.results?.length > 0 && (
        <ul className="pilot-card__results">
          {pilot.results.map((r, i) => (
            <li key={i}>
              <strong>{r.value}</strong>
              <span>{r.label}</span>
            </li>
          ))}
        </ul>
      )}

      {pilot.quote && <blockquote className="pilot-card__quote">{pilot.quote}</blockquote>}

      <a
        className="pilot-card__link"
        href={pilot.partnerUrl}
        target="_blank"
        rel="noreferrer"
      >
        {pilot.published
          ? `${pilot.country} pilot on the CREDIT project site`
          : 'See the pilot training programme'}{' '}
        ↗
      </a>
    </article>
  );
}
