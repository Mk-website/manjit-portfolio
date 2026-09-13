import { Boxes, Code2, Radio, Terminal, Wrench } from 'lucide-react';
import { api } from '../services/api.js';
import { useApiData } from '../hooks/useApiData.js';
import PageHeader from '../components/PageHeader.jsx';
import ApiNotice from '../components/ApiNotice.jsx';
import Reveal from '../components/Reveal.jsx';

const categoryIcons = {
  Languages: Code2,
  Microcontrollers: Boxes,
  RTOS: Terminal,
  'Wireless & IoT': Radio,
  Protocols: Radio,
  Tools: Wrench,
  Hardware: Wrench,
  Testing: Wrench,
  'Version Control': Code2,
};

const toolchain = new Set(['STM32CubeIDE', 'Keil IDE', 'Arduino IDE', 'Git', 'GitHub']);

export default function Skills() {
  const state = useApiData(api.skills.get, []);
  const groups = state.data.reduce((all, item) => ({
    ...all,
    [item.category]: [...(all[item.category] || []), item],
  }), {});
  const tools = state.data.filter((item) => toolchain.has(item.name));
  const sortedGroups = Object.entries(groups).sort(([left], [right]) => left.localeCompare(right));

  return (
    <main className="page-wrap">
      <PageHeader eyebrow="02 / capabilities" title="Skills">
        Technologies, protocols, and tools used across embedded and IoT projects.
      </PageHeader>
      <ApiNotice error={state.error} retry={state.retry} loading={state.loading} />

      {!state.loading && (
        <>
          <Reveal className="skill-grid" stagger>
            {sortedGroups.map(([category, skills]) => {
              const Icon = categoryIcons[category] || Wrench;
              return (
                <section key={category} className="panel panel-hover skill-card skill-card-premium">
                  <div className="skill-header">
                    <span className="skill-icon"><Icon size={18} /></span>
                    <h2>{category}</h2>
                  </div>
                  <div className="skill-list">
                    {skills.map((skill) => (
                      <div key={skill._id || skill.name} className="skill-pill-wrap">
                        <span className="tag skill-pill">{skill.name}</span>
                        {skill.description && <p className="skill-description">{skill.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </Reveal>

          {!state.data.length && !state.error && (
            <p className="empty-state empty-state-spaced">Skills will appear here when they are added to the portfolio.</p>
          )}

          {tools.length > 0 && (
            <Reveal as="section" className="panel toolchain toolchain-panel">
              <p className="eyebrow">Toolchain</p>
              <div className="skill-badges">
                {tools.map((tool) => (
                  <span className="tag" key={tool._id || tool.name}>{tool.name}</span>
                ))}
              </div>
            </Reveal>
          )}
        </>
      )}
    </main>
  );
}
