import {
  Activity,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  Database,
  FileText,
  GraduationCap,
  Mail,
  Network,
  Shield,
  Users,
} from 'lucide-react';

type ModuleStatus = 'demo' | 'foundation' | 'later';

const statusLabels: Record<ModuleStatus, string> = {
  demo: 'UI preview · sample data',
  foundation: 'Migration prepared · apply to Supabase',
  later: 'Later phase',
};

const statusStyles: Record<ModuleStatus, string> = {
  demo: 'bg-amber-50 text-amber-800 border-amber-200',
  foundation: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  later: 'bg-slate-100 text-slate-600 border-slate-200',
};

const modules = [
  { title: 'Admin & governance', description: 'Users, projects, groups, role assignments', icon: Shield, status: 'foundation' as const },
  { title: 'L&D studio', description: 'Learning modules, compliance, SOPs, workflows', icon: GraduationCap, status: 'foundation' as const },
  { title: 'QA & quality', description: 'Audits, rebuttals, calibration, scorecards', icon: CheckCircle2, status: 'foundation' as const },
  { title: 'Operations', description: 'Project health, daily metrics, reports', icon: Activity, status: 'demo' as const },
  { title: 'Associate workspace', description: 'Assigned learning and personal quality view', icon: Users, status: 'demo' as const },
  { title: 'Workflow runtime', description: 'Definitions and run-history tables prepared', icon: Network, status: 'foundation' as const },
  { title: 'Email ingestion', description: 'Assigned inbox ingestion and data validation', icon: Mail, status: 'later' as const },
  { title: 'Teams & Sam agent', description: 'Teams interaction, content generation, guidance', icon: Bot, status: 'later' as const },
];

function ModuleCard({ title, description, icon: Icon, status }: (typeof modules)[number]) {
  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-indigo-50 p-2 text-indigo-700">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{description}</p>
        </div>
      </div>
      <span className={`mt-4 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusStyles[status]}`}>
        {statusLabels[status]}
      </span>
    </article>
  );
}

export function CreatorArchitecturePage() {
  return (
    <section className="space-y-5" aria-labelledby="creator-title">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-teal-950 p-6 text-white sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-white/10 p-3">
            <BriefcaseBusiness className="h-6 w-6 text-teal-200" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-200">Creator · application map</p>
            <h1 id="creator-title" className="mt-1 text-2xl font-black sm:text-3xl">Curiosity system blueprint</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-300">
              A visual inventory of role experiences, shared data foundations, and planned integrations.
              Connectors describe intended data flow; badges distinguish working UI from backend-ready schema.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto_1.2fr_auto_1fr] md:items-stretch" aria-label="Application architecture and data flow">
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
          <div className="flex items-center gap-2 font-bold text-indigo-950"><Users className="h-5 w-5" />People & roles</div>
          <p className="mt-2 text-xs leading-relaxed text-indigo-900">Sign-in identity → profile → one or more assigned roles → role-specific navigation.</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['Admin', 'L&D', 'QA', 'Operations', 'Associate'].map((role) => (
              <span key={role} className="rounded-full border border-indigo-200 bg-white px-2 py-1 text-[10px] font-bold text-indigo-800">{role}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center text-indigo-500" aria-hidden="true"><span className="hidden text-2xl md:inline">→</span><span className="text-2xl md:hidden">↓</span></div>
        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4">
          <div className="flex items-center gap-2 font-bold text-teal-950"><Network className="h-5 w-5" />App modules & workflows</div>
          <p className="mt-2 text-xs leading-relaxed text-teal-900">Role-aware workspaces use shared project, group, associate, learning, quality, SOP, and workflow records.</p>
          <div className="mt-3 rounded-xl border border-teal-200 bg-white px-3 py-2 text-[10px] font-semibold text-teal-900">Each view is a module; RLS remains the data-access boundary.</div>
        </div>
        <div className="flex items-center justify-center text-teal-600" aria-hidden="true"><span className="hidden text-2xl md:inline">↔</span><span className="text-2xl md:hidden">↓</span></div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 font-bold text-emerald-950"><Database className="h-5 w-5" />Supabase foundation</div>
          <p className="mt-2 text-xs leading-relaxed text-emerald-900">Auth, profiles, role assignments, core tables, and row-level policies are prepared.</p>
          <div className="mt-3 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-[10px] font-semibold text-emerald-900">Existing screen data is not yet migrated from the demo dataset.</div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => <ModuleCard key={module.title} {...module} />)}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          <h2 className="font-bold text-slate-900">Connection status</h2>
        </div>
        <ul className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
          <li><span className="font-bold text-emerald-700">Prepared:</span> Supabase Auth wiring, schema migration, and RLS policies; apply the migration and configure environment keys to connect.</li>
          <li><span className="font-bold text-amber-700">Preview:</span> Existing dashboards and workflows still run on local sample data.</li>
          <li><span className="font-bold text-slate-700">Next:</span> Migrate each screen’s read/write path and seed real project records.</li>
        </ul>
      </div>
    </section>
  );
}
