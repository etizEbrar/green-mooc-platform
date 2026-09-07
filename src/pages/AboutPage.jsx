import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { project, partners, audiences, howItWorks } from '../data/projectData';
import { modules, totalUnitsCount } from '../data/courseData';
import { CERTIFICATE_THRESHOLD_PERCENT } from '../lib/certificate';

// Public introduction to the CREDIT project and to this MOOC.
// This is the landing page of the platform: it has to answer four questions
// before a visitor decides to register — what CREDIT is, what the MOOC is for,
// who it is for, and how you actually use it.
export default function AboutPage() {
  const { currentUser } = useAuth();

  return (
    <div className="page page--about">
      <section className="about-hero">
        <div className="about-hero__text">
          <p className="about-hero__eyebrow">
            {project.acronym} · Erasmus+ project {project.grantNumber}
          </p>
          <h1 className="about-hero__title">
            Green and circular economy skills for small businesses — free, online, self-paced.
          </h1>
          <p className="about-hero__lead">
            This MOOC is the open training platform of the {project.acronym} project.{' '}
            {modules.length} modules and {totalUnitsCount} short units take you from the basics of
            the circular economy to a sustainability action plan you can actually apply in your
            own organisation.
          </p>
          <div className="about-hero__actions">
            {currentUser ? (
              <Link className="btn btn--primary" to="/dashboard">
                Go to my dashboard →
              </Link>
            ) : (
              <>
                <Link className="btn btn--primary" to="/register">
                  Start learning — it's free
                </Link>
                <Link className="btn btn--ghost" to="/login">
                  I already have an account
                </Link>
              </>
            )}
          </div>
          <p className="about-hero__note">
            No cost, no deadlines. Your progress is saved so you can stop and continue any time.
          </p>
        </div>

        <ul className="about-hero__facts">
          <li>
            <strong>{modules.length}</strong>
            <span>thematic modules</span>
          </li>
          <li>
            <strong>{totalUnitsCount}</strong>
            <span>hands-on units</span>
          </li>
          <li>
            <strong>{CERTIFICATE_THRESHOLD_PERCENT}%</strong>
            <span>to earn a certificate</span>
          </li>
          <li>
            <strong>€0</strong>
            <span>cost to learners</span>
          </li>
        </ul>
      </section>

      <section className="about-section" id="project">
        <div className="section-head">
          <h2>About the CREDIT project</h2>
          <p>Who is behind this platform and why it exists.</p>
        </div>
        <div className="about-project">
          <div className="about-project__body">
            <p>{project.summary}</p>
            <p>
              {project.acronym} — <em>{project.title}</em> — is co-funded by the European Union
              under {project.programme}. This MOOC is one of the project results, alongside the
              Green Business Toolkit and the modular training programme.
            </p>
            <a
              className="btn btn--ghost"
              href={project.website}
              target="_blank"
              rel="noreferrer"
            >
              Visit the CREDIT project website ↗
            </a>
          </div>
          <div className="about-project__partners">
            <h3>Project consortium</h3>
            <ul className="partner-list">
              {partners.map((p) => (
                <li key={p.name} className="partner-list__item">
                  <span className="partner-list__flag" aria-hidden="true">
                    {p.flag}
                  </span>
                  <span className="partner-list__text">
                    <strong>{p.name}</strong>
                    <span className="muted">
                      {p.country} · {p.role}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="partner-list__grant">
              Grant agreement <strong>{project.grantNumber}</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="about-section" id="purpose">
        <div className="section-head">
          <h2>What this MOOC is for</h2>
          <p>The problem it was built to solve.</p>
        </div>
        <div className="about-purpose">
          <p>
            Most sustainability training is written for large companies with a sustainability
            department. Small and micro-enterprises — over 99% of businesses in the EU — are asked
            to meet the same expectations from customers, banks and regulators, without the same
            staff, budget or data.
          </p>
          <p>
            This course closes that gap. Every unit stays practical: it explains one idea, shows
            it in a realistic SME situation, and ends with an activity applied to{' '}
            <strong>your</strong> organisation — an audit, a checklist, a decision, a plan. By the
            end you have a set of completed activities that together form a working sustainability
            plan, not a folder of notes.
          </p>
        </div>
      </section>

      <section className="about-section" id="audience">
        <div className="section-head">
          <h2>Who it is for</h2>
          <p>No prior knowledge of sustainability or of the circular economy is needed.</p>
        </div>
        <div className="grid grid--audiences">
          {audiences.map((a) => (
            <article key={a.title} className="audience-card">
              <span className="audience-card__icon" aria-hidden="true">
                {a.icon}
              </span>
              <h3>{a.title}</h3>
              <p>{a.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section" id="how">
        <div className="section-head">
          <h2>How to use the platform</h2>
          <p>Four steps from visitor to certificate.</p>
        </div>
        <ol className="how-steps">
          {howItWorks.map((s) => (
            <li key={s.step} className="how-step">
              <span className="how-step__num">{s.step}</span>
              <div className="how-step__body">
                <h3>
                  <span aria-hidden="true">{s.icon}</span> {s.title}
                </h3>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="about-section" id="curriculum">
        <div className="section-head">
          <h2>What you will cover</h2>
          <p>The six modules of the curriculum.</p>
        </div>
        <div className="grid grid--about-modules">
          {modules.map((m) => (
            <article
              key={m.id}
              className="about-module"
              style={{ borderTopColor: m.color }}
            >
              <span className="about-module__icon" aria-hidden="true">
                {m.icon}
              </span>
              <p className="about-module__eyebrow">Module {m.number}</p>
              <h3>{m.title}</h3>
              <p className="about-module__desc">{m.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-cta">
        <h2>Ready to start?</h2>
        <p>
          Create a free account and begin with Module 1. You can finish a first unit in about
          twenty minutes.
        </p>
        {currentUser ? (
          <Link className="btn btn--primary" to="/dashboard">
            Go to my dashboard →
          </Link>
        ) : (
          <Link className="btn btn--primary" to="/register">
            Create my free account →
          </Link>
        )}
        <p className="about-cta__pilots">
          Curious how the course was tested with real businesses?{' '}
          <Link to="/pilots">See the pilot activities in each partner country →</Link>
        </p>
      </section>

      <section className="eu-disclaimer">
        <p>{project.disclaimer}</p>
      </section>
    </div>
  );
}
