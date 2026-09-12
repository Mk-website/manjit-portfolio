import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Download, Link as LinkIcon, Mail, Cpu, Radio, Wrench, Workflow } from 'lucide-react';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';
import { fallbackProfile } from '../data/fallbackProfile.js';
import ApiNotice from '../components/ApiNotice.jsx';
import { SystemDiagram } from '../components/TechnicalVisual.jsx';

const features = [
  { icon: Cpu, title: 'Firmware design', text: 'Bare-metal and HAL-driven embedded software designed for real hardware constraints and testability.' },
  { icon: Radio, title: 'Wireless systems', text: 'Focused on LoRa, RF links, control protocols, and reliable telemetry paths for edge devices.' },
  { icon: Wrench, title: 'Debugging', text: 'Hardware-software troubleshooting across UART, SPI, I2C, GPS, RTC, and PCB-level bring-up.' },
  { icon: Workflow, title: 'System thinking', text: 'Designing interfaces that connect firmware, control logic, diagnostics, and field-ready operation.' },
];

export default function Home() {
  const profileState = useApiData(api.profile.get, fallbackProfile);
  const resumeState = useApiData(api.resume.get, null);
  const profile = profileState.data || fallbackProfile;
  const chips = ['STM32F401', 'LoRa SX1262', 'Wireless TX/RX', 'UART / SPI / I2C', 'IoT'];

  return (
    <main className="page-wrap hero-page">
      <section className="hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker">
            <span className="signal-dot" />
            Embedded firmware portfolio
          </p>
          <h1 className="hero-title">{profile.name}</h1>
          <p className="hero-subtitle">{profile.title}</p>
          <p className="hero-summary">{profile.summary}</p>

          <div className="chip-row">
            {chips.map((chip) => (
              <span key={chip} className="tag">{chip}</span>
            ))}
          </div>

          <div className="action-row">
            <Link to="/projects" className="btn btn-primary">
              View projects
              <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Contact me
              <Mail size={16} />
            </Link>
            {resumeState.data?.fileUrl && (
              <a href={resumeState.data.fileUrl} download className="btn btn-secondary">
                <Download size={16} />
                Resume
              </a>
            )}
          </div>

          <div className="social-row">
            <a className="social-link" href={profile.github} target="_blank" rel="noreferrer">
              <Code2 size={16} />
              GitHub
            </a>
            <a className="social-link" href={profile.linkedin} target="_blank" rel="noreferrer">
              <LinkIcon size={16} />
              LinkedIn
            </a>
            <a className="social-link" href={`mailto:${profile.email}`}>
              <Mail size={16} />
              Email
            </a>
          </div>

          <div className="mini-metrics">
            <article className="metric-card">
              <span className="metric-label">Experience</span>
              <span className="metric-value">{profile.yearsExperience || 1} year</span>
            </article>
            <article className="metric-card">
              <span className="metric-label">Focus</span>
              <span className="metric-value">Firmware</span>
            </article>
            <article className="metric-card">
              <span className="metric-label">Stack</span>
              <span className="metric-value">STM32</span>
            </article>
          </div>

          <ApiNotice error={profileState.error} retry={profileState.retry} />
        </div>

        <div className="hero-visual">
          <SystemDiagram />
        </div>
      </section>

      <section className="feature-grid" aria-label="Core engineering strengths">
        {features.map(({ icon: Icon, title, text }) => (
          <article key={title} className="panel panel-hover feature-card">
            <div className="feature-icon">
              <Icon size={18} />
            </div>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
