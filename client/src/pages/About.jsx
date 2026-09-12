import { Cpu, Radio, Wrench, Waypoints, ArrowRight } from 'lucide-react';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';
import { fallbackProfile } from '../data/fallbackProfile.js';
import PageHeader from '../components/PageHeader.jsx';
import ApiNotice from '../components/ApiNotice.jsx';

const areas = [
  { title: 'Firmware Design', icon: Cpu, copy: 'Focused on practical embedded implementation and clean firmware interfaces that are easy to validate.' },
  { title: 'Wireless & IoT', icon: Radio, copy: 'Working across low-power radio links, telemetry paths, and connected product interfaces.' },
  { title: 'Hardware Debugging', icon: Wrench, copy: 'Comfortable tracing issues from firmware behavior into PCB-level troubleshooting and signal validation.' },
  { title: 'Drone Control Systems', icon: Waypoints, copy: 'Interested in stable control links, traceable signal flow, and dependable flight-oriented embedded systems.' },
];

export default function About() {
  const state = useApiData(api.profile.get, fallbackProfile);
  const profile = state.data || fallbackProfile;

  return (
    <main className="page-wrap">
      <PageHeader eyebrow="01 / engineering profile" title="About">
        {profile.summary}
      </PageHeader>
      <ApiNotice error={state.error} retry={state.retry} />

      <div className="story-grid">
        <section className="panel story-card">
          <p className="eyebrow">Professional focus</p>
          <h2>Engineering interests</h2>
          <div className="chip-row">
            {(profile.interests || []).map((item) => (
              <span className="tag" key={item}>{item}</span>
            ))}
          </div>

          <h2 style={{ marginTop: '2rem' }}>Core strengths</h2>
          <ul className="check-list">
            {(profile.strengths || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <aside className="panel accent-panel tech-grid" style={{ padding: '1.4rem' }}>
          <p className="eyebrow">Experience signal</p>
          <div className="metric-stack">
            <div className="metric-row">
              <strong>{profile.yearsExperience || 0}</strong>
              <span>year{profile.yearsExperience === 1 ? '' : 's'} of applied work</span>
            </div>
            <div className="metric-row">
              <strong>4</strong>
              <span>core engineering focus areas</span>
            </div>
            <div className="metric-row">
              <strong>1</strong>
              <span>practical product mindset</span>
            </div>
          </div>
          {profile.location && <p style={{ marginTop: '1.2rem', color: 'var(--text-soft)' }}>{profile.location}</p>}
        </aside>
      </div>

      <div className="feature-grid">
        {areas.map(({ title, copy, icon: Icon }) => (
          <article key={title} className="panel panel-hover feature-card">
            <div className="feature-icon">
              <Icon size={18} />
            </div>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </div>

      <section className="panel" style={{ marginTop: '1.2rem', padding: '1.3rem 1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <p className="eyebrow">Approach</p>
            <h2 style={{ margin: '0.5rem 0 0' }}>Build robust systems that stay understandable in the field.</h2>
          </div>
          <ArrowRight size={18} style={{ color: 'var(--accent)' }} />
        </div>
      </section>
    </main>
  );
}
