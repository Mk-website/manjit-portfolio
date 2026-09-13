import { Cpu, Radio, Wrench, Waypoints, ArrowRight } from 'lucide-react';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';
import { fallbackProfile } from '../data/fallbackProfile.js';
import PageHeader from '../components/PageHeader.jsx';
import ApiNotice from '../components/ApiNotice.jsx';
import Reveal from '../components/Reveal.jsx';

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
        A firmware engineer building a deeper understanding of how software, signals, and physical hardware become dependable systems.
      </PageHeader>
      <ApiNotice error={state.error} retry={state.retry} />

      <Reveal className="story-grid" stagger>
        <section className="panel story-card">
          <p className="eyebrow">The path so far</p>
          <h2>Close to the hardware</h2>
          <p className="story-copy">
            My technical journey started with a curiosity about what happens between a line of code and a physical response. Embedded systems gave that curiosity a place to become practical: timing matters, interfaces have consequences, and every reliable result has to survive contact with real hardware.
          </p>
          <p className="story-copy">
            My interest in embedded engineering grew from the moment I started working directly with hardware behavior, timing constraints, and signal reliability. That practical understanding shaped my focus on firmware, wireless links, and debugging systems that must survive real-world conditions.
          </p>
          <div className="chip-row">
            {(profile.interests || []).map((item) => (
              <span className="tag" key={item}>{item}</span>
            ))}
          </div>

          <h2 className="section-subheading">Core strengths</h2>
          <ul className="check-list">
            {(profile.strengths || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <aside className="panel accent-panel tech-grid currently-card">
          <p className="eyebrow">Currently building</p>
          <h2>From working firmware to field-ready systems.</h2>
          <p className="story-copy">
            I am working toward stronger end-to-end ownership: designing firmware that is observable, communicating clearly across hardware boundaries, and learning how to make embedded products easier to test, maintain, and trust.
          </p>
          <p className="story-copy">
            {profile.availabilityStatus || 'Building reliable embedded systems with a strong focus on hardware-aware firmware and field-ready debugging.'}
          </p>
          {profile.location && <p className="location-line">{profile.location}</p>}
        </aside>
      </Reveal>

      <Reveal className="feature-grid" stagger>
        {areas.map(({ title, copy, icon: Icon }) => (
          <article key={title} className="panel panel-hover feature-card">
            <div className="feature-icon">
              <Icon size={18} />
            </div>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </Reveal>

      <Reveal as="section" className="panel approach-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <p className="eyebrow">Approach</p>
            <h2 style={{ margin: '0.5rem 0 0' }}>Build robust systems that stay understandable in the field.</h2>
          </div>
          <ArrowRight size={18} style={{ color: 'var(--accent)' }} />
        </div>
      </Reveal>
    </main>
  );
}
