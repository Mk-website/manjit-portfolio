import { useEffect, useState } from 'react';
import { Award, BadgeCheck, Briefcase, FileText, FolderKanban, GraduationCap, MessageSquare, Trophy } from 'lucide-react';
import { api } from '../services/api.js';

const metrics = [
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'skills', label: 'Skills', icon: Award },
  { key: 'experience', label: 'Experience', icon: Briefcase },
  { key: 'education', label: 'Education', icon: GraduationCap },
  { key: 'certifications', label: 'Certifications', icon: BadgeCheck },
  { key: 'achievements', label: 'Achievements', icon: Trophy },
  { key: 'messages', label: 'Messages', icon: MessageSquare },
  { key: 'resume', label: 'Resumes', icon: FileText },
];

const empty = {
  projects: [],
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  achievements: [],
  messages: [],
  resume: [],
};

export default function AdminDashboard() {
  const [data, setData] = useState(empty);
  const [state, setState] = useState('loading');

  useEffect(() => {
    Promise.all([
      api.projects.listAll(),
      api.skills.listAll(),
      api.experience.listAll(),
      api.education.listAll(),
      api.certifications.listAll(),
      api.achievements.listAll(),
      api.messages.get(),
      api.resume.listAll(),
    ])
      .then(([projects, skills, experience, education, certifications, achievements, messages, resume]) => {
        setData({
          projects: projects.data.data || [],
          skills: skills.data.data || [],
          experience: experience.data.data || [],
          education: education.data.data || [],
          certifications: certifications.data.data || [],
          achievements: achievements.data.data || [],
          messages: messages.data.data || [],
          resume: resume.data.data || [],
        });
        setState('ready');
      })
      .catch(() => setState('error'));
  }, []);

  const unreadCount = data.messages.filter((item) => !item.isRead).length;
  const draftProjects = data.projects.filter((item) => item.status === 'draft').length;
  const activeResume = data.resume.find((item) => item.isActive);

  return (
    <section>
      <p className="eyebrow">Overview</p>
      <h1 className="mt-3 text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-slate-400">Full portfolio inventory and incoming message summary.</p>

      {state === 'error' && (
        <p className="mt-5 border border-amber-900 bg-amber-950/30 p-4 text-sm text-amber-200">
          Some dashboard data could not be loaded. Check the authenticated API endpoints.
        </p>
      )}

      {state === 'ready' && (
        <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-400">
          {unreadCount > 0 && (
            <span className="rounded border border-cyan-900 bg-cyan-950/40 px-3 py-1 text-cyan-200">
              {unreadCount} unread message{unreadCount === 1 ? '' : 's'}
            </span>
          )}
          {draftProjects > 0 && (
            <span className="rounded border border-amber-900 bg-amber-950/30 px-3 py-1 text-amber-200">
              {draftProjects} draft project{draftProjects === 1 ? '' : 's'}
            </span>
          )}
          {activeResume && (
            <span className="rounded border border-slate-700 bg-slate-900 px-3 py-1">
              Active resume: {activeResume.fileName}
            </span>
          )}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ key, label, icon: Icon }) => (
          <article className="panel p-5" key={key}>
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>{label}</span>
              <Icon size={18} className="text-cyan-300" />
            </div>
            <p className="mt-6 text-3xl font-bold">{state === 'loading' ? '--' : data[key].length}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <Record
          title="Recent projects"
          items={data.projects}
          line={(item) => [item.name, `${item.status}${item.featured ? ' · featured' : ''} · ${item.shortDesc}`]}
        />
        <Record
          title="Recent messages"
          items={data.messages}
          line={(item) => [`${item.name} · ${item.subject}`, item.body]}
        />
      </div>
    </section>
  );
}

function Record({ title, items, line }) {
  return (
    <section className="panel p-5">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-4 grid gap-3">
        {items.slice(0, 5).map((item) => {
          const [heading, copy] = line(item);
          return (
            <div key={item._id} className="border-b border-slate-800 pb-3 text-sm text-slate-400 last:border-0">
              <div className="text-slate-200">{heading}</div>
              <p className="mt-1 truncate">{copy}</p>
            </div>
          );
        })}
        {!items.length && <p className="text-sm text-slate-500">Nothing to show yet.</p>}
      </div>
    </section>
  );
}
