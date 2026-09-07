import { Link } from 'react-router-dom';
import { pilots, publishedPilots, totalPilotParticipants } from '../data/pilotData';
import { project } from '../data/projectData';

// Pilot activities, organised by country.
//
// The consortium agreed to present each national pilot with its
// implementation, impact, results and photographs. Content lives in
// src/data/pilotData.js so partners can add their own without touching JSX;
// a country with `published: false` is shown as still being finalised rather
// than as an empty section.
export default function PilotsPage() {
  const published = publishedPilots();
  const participants = totalPilotParticipants();

  return (
    <div className="page page--pilots">
      <header className="pilots-hero">
        <p className="hero__eyebrow">{project.acronym} pilot activities</p>
        <h1>The course, tested with real businesses</h1>
        <p className="pilots-hero__lead">
          Before this MOOC was published, each partner ran the training with entrepreneurs,
          employees and trainers in their own country. Their feedback shaped the units you can
          take here.
        </p>
        {published.length > 0 && (
          <div className="pilots-hero__stats">
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
          </div>
        )}
      </header>

      <div className="pilots-list">
        {pilots.map((pilot) => (
          <PilotSection key={pilot.id} pilot={pilot} />
        ))}
      </div>

      <section className="about-cta">
        <h2>Take the course yourself</h2>
        <p>Everything the pilot participants worked through is free and open on this platform.</p>
        <Link className="btn btn--primary" to="/register">
          Create a free account →
        </Link>
      </section>
    </div>
  );
}

function PilotSection({ pilot }) {
  return (
    <section className="pilot" id={pilot.id}>
      <header className="pilot__head">
        <span className="pilot__flag" aria-hidden="true">
          {pilot.flag}
        </span>
        <div>
          <h2>{pilot.country}</h2>
          <p className="muted">
            {pilot.partner}
            {pilot.dates ? ` · ${pilot.dates}` : ''}
            {pilot.location ? ` · ${pilot.location}` : ''}
          </p>
        </div>
        {pilot.participants ? (
          <span className="pilot__participants">
            <strong>{pilot.participants}</strong> participants
          </span>
        ) : null}
      </header>

      {!pilot.published ? (
        <div className="pilot__pending">
          <span aria-hidden="true">🕗</span>
          <p>
            The results of the {pilot.country} pilot are being finalised by {pilot.partner} and
            will be published here shortly.
          </p>
        </div>
      ) : (
        <div className="pilot__body">
          {pilot.implementation && (
            <div className="pilot__block">
              <h3>How it was run</h3>
              <p>{pilot.implementation}</p>
            </div>
          )}

          {pilot.impact && (
            <div className="pilot__block">
              <h3>Impact</h3>
              <p>{pilot.impact}</p>
            </div>
          )}

          {pilot.results?.length > 0 && (
            <div className="pilot__block">
              <h3>Results</h3>
              <ul className="pilot__results">
                {pilot.results.map((r, i) => (
                  <li key={i}>
                    <strong>{r.value}</strong>
                    <span>{r.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pilot.feedback?.length > 0 && (
            <div className="pilot__block">
              <h3>What participants said</h3>
              {pilot.feedback.map((quote, i) => (
                <blockquote key={i} className="pilot__quote">
                  {quote}
                </blockquote>
              ))}
            </div>
          )}

          {pilot.photos?.length > 0 && (
            <div className="pilot__block">
              <h3>Photos</h3>
              <div className="pilot__photos">
                {pilot.photos.map((photo, i) => (
                  <figure key={i} className="pilot__photo">
                    <img
                      src={photo.src}
                      alt={photo.caption || `${pilot.country} pilot activity`}
                      loading="lazy"
                    />
                    {photo.caption && <figcaption>{photo.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
