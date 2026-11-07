import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileBarChart2,
  FolderKanban,
  GraduationCap,
  Network,
  Shield,
  Sparkles,
  Target,
  Upload,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { APP_ROLE_LABELS, AssociateProfile, UserRole } from '../types/rcm';

type WorkspaceDestination =
  | 'admin_studio'
  | 'associate_portal'
  | 'clp_dashboard'
  | 'creator'
  | 'dashboard'
  | 'games_hub'
  | 'knowledge'
  | 'nht_training'
  | 'org_learning'
  | 'project_directories'
  | 'quality'
  | 'reports'
  | 'scorecards'
  | 'training_modules'
  | 'trainer_hub'
  | 'upload';

interface WorkspaceMetric {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
}

interface WorkspaceAction {
  title: string;
  description: string;
  destination: WorkspaceDestination;
  icon: LucideIcon;
}

interface RoleWorkspaceHomeProps {
  role: UserRole;
  displayName: string;
  associate: AssociateProfile;
  availableRoles: UserRole[];
  isRolePreview: boolean;
  metrics: {
    projectCount: number;
    projectHealth: string;
    productionSla: string;
    qualitySla: string;
    compliance: string;
    associateCount: number;
    learningModuleCount: number;
    openTrainingTickets: number;
    pendingRebuttals: number;
    defectCount: number;
    uploadCount: number;
    calibrationCount: number;
  };
  onSelectRole: (role: UserRole) => void;
  onOpenTab: (tab: WorkspaceDestination) => void;
}

const roleExperience: Record<
  UserRole,
  {
    eyebrow: string;
    headline: string;
    summary: string;
    gradient: string;
    icon: LucideIcon;
    metrics: (data: RoleWorkspaceHomeProps['metrics'], associate: AssociateProfile) => WorkspaceMetric[];
    actions: WorkspaceAction[];
    focusTitle: string;
    focusItems: (data: RoleWorkspaceHomeProps['metrics'], associate: AssociateProfile) => string[];
  }
> = {
  admin: {
    eyebrow: 'Governance command center',
    headline: 'See the whole operation.',
    summary: 'Monitor portfolio health, people, and governance priorities from one place.',
    gradient: 'from-indigo-950 via-indigo-900 to-slate-900',
    icon: Shield,
    metrics: (data) => [
      { label: 'Projects', value: String(data.projectCount), note: 'In your portfolio', icon: FolderKanban },
      { label: 'Portfolio health', value: `${data.projectHealth}%`, note: 'Average project score', icon: Activity },
      { label: 'People', value: String(data.associateCount), note: 'Across assigned teams', icon: Users },
      { label: 'Open priorities', value: String(data.openTrainingTickets + data.pendingRebuttals), note: 'Training + QA follow-up', icon: Target },
    ],
    actions: [
      { title: 'Manage people & projects', description: 'Maintain the organization, role assignments, and project setup.', destination: 'admin_studio', icon: Users },
      { title: 'Review portfolio', description: 'Open project health and performance trends.', destination: 'dashboard', icon: Activity },
      { title: 'View system blueprint', description: 'See how roles, modules, and data connect.', destination: 'creator', icon: Network },
    ],
    focusTitle: 'Governance pulse',
    focusItems: (data) => [
      `${data.pendingRebuttals} quality rebuttal${data.pendingRebuttals === 1 ? '' : 's'} ${data.pendingRebuttals === 1 ? 'needs' : 'need'} a decision.`,
      `${data.openTrainingTickets} training follow-up${data.openTrainingTickets === 1 ? ' remains' : 's remain'} open.`,
      `${data.compliance}% organization-wide compliance completion.`,
    ],
  },
  learning_development: {
    eyebrow: 'Learning design studio',
    headline: 'Build capability that moves work forward.',
    summary: 'Create learning journeys, support new-hire cohorts, and keep teams current on process changes.',
    gradient: 'from-violet-950 via-purple-900 to-slate-900',
    icon: GraduationCap,
    metrics: (data) => [
      { label: 'Learning modules', value: String(data.learningModuleCount), note: 'Available in the catalog', icon: BookOpen },
      { label: 'Compliance', value: `${data.compliance}%`, note: 'Organization completion', icon: CheckCircle2 },
      { label: 'Training follow-ups', value: String(data.openTrainingTickets), note: 'Open coaching tickets', icon: Target },
      { label: 'Learners', value: String(data.associateCount), note: 'Across assigned teams', icon: Users },
    ],
    actions: [
      { title: 'Design learning modules', description: 'Review and manage courses in the training catalog.', destination: 'training_modules', icon: BookOpen },
      { title: 'Run new-hire training', description: 'Track NHT cohorts, milestones, and graduation.', destination: 'nht_training', icon: GraduationCap },
      { title: 'Track learning outcomes', description: 'Review completion, compliance, and team reports.', destination: 'reports', icon: FileBarChart2 },
    ],
    focusTitle: 'Learning priorities',
    focusItems: (data) => [
      `${data.openTrainingTickets} coaching tickets are ready for trainer follow-up.`,
      `${data.learningModuleCount} learning modules are available to assign.`,
      'Use the process knowledge library to keep training aligned with current SOPs.',
    ],
  },
  quality_assurance: {
    eyebrow: 'Quality assurance desk',
    headline: 'Turn audit signals into better outcomes.',
    summary: 'Review defects, resolve rebuttals, and keep auditor decisions aligned through calibration.',
    gradient: 'from-amber-950 via-orange-900 to-slate-900',
    icon: ClipboardCheck,
    metrics: (data) => [
      { label: 'Quality SLA', value: `${data.qualitySla}%`, note: 'Average across projects', icon: CheckCircle2 },
      { label: 'Rebuttals waiting', value: String(data.pendingRebuttals), note: 'Require review', icon: Target },
      { label: 'Audit records', value: String(data.defectCount), note: 'In the current workspace', icon: ClipboardCheck },
      { label: 'Calibrations', value: String(data.calibrationCount), note: 'Sessions available', icon: Users },
    ],
    actions: [
      { title: 'Resolve rebuttals', description: 'Review findings and record QA decisions.', destination: 'quality', icon: ClipboardCheck },
      { title: 'Inspect scorecards', description: 'Review associate performance and quality trends.', destination: 'scorecards', icon: Target },
      { title: 'Open project knowledge', description: 'Check the applicable project SOPs and updates.', destination: 'project_directories', icon: BookOpen },
    ],
    focusTitle: 'Quality review queue',
    focusItems: (data) => [
      `${data.pendingRebuttals} rebuttals are pending a QA decision.`,
      `${data.defectCount} audit records are available for review.`,
      'Check calibration outcomes when reviewing scoring consistency.',
    ],
  },
  operations: {
    eyebrow: 'Operations control room',
    headline: 'Keep delivery on track.',
    summary: 'Spot project risks early, monitor production performance, and keep daily reporting current.',
    gradient: 'from-sky-950 via-blue-900 to-slate-900',
    icon: Activity,
    metrics: (data) => [
      { label: 'Project health', value: `${data.projectHealth}%`, note: `${data.projectCount} projects in view`, icon: Activity },
      { label: 'Production SLA', value: `${data.productionSla}%`, note: 'Portfolio average', icon: Target },
      { label: 'Open follow-ups', value: String(data.openTrainingTickets), note: 'Training actions to track', icon: ClipboardCheck },
      { label: 'Upload batches', value: String(data.uploadCount), note: 'Current workspace records', icon: Upload },
    ],
    actions: [
      { title: 'Monitor project health', description: 'Open delivery dashboards and project trends.', destination: 'dashboard', icon: Activity },
      { title: 'Review daily data', description: 'Inspect upload batches and operational inputs.', destination: 'upload', icon: Upload },
      { title: 'Prepare performance reports', description: 'Review project, team, and training reports.', destination: 'reports', icon: FileBarChart2 },
    ],
    focusTitle: 'Today’s operating view',
    focusItems: (data) => [
      `Production SLA is ${data.productionSla}% across the selected portfolio.`,
      `${data.openTrainingTickets} training follow-ups may need coordination.`,
      `${data.uploadCount} upload batches are listed in this workspace.`,
    ],
  },
  associate: {
    eyebrow: 'My learning & performance',
    headline: 'Your next step, all in one place.',
    summary: 'Pick up assigned learning, check your progress, and find the process guidance for your work.',
    gradient: 'from-emerald-950 via-teal-900 to-slate-900',
    icon: Sparkles,
    metrics: (_data, associate) => [
      { label: 'Quality score', value: `${associate.qualityActualPct}%`, note: `Target ${associate.qualityTargetPct}%`, icon: CheckCircle2 },
      { label: 'Production today', value: `${associate.dailyActual}/${associate.dailyTarget}`, note: 'Completed / daily target', icon: Activity },
      { label: 'Knowledge score', value: `${associate.pktScore}%`, note: 'Process knowledge test', icon: GraduationCap },
      { label: 'Compliance', value: `${associate.annualCompliancePct}%`, note: 'Your annual completion', icon: Shield },
    ],
    actions: [
      { title: 'Open my workspace', description: 'See your scorecard, learning, and project knowledge.', destination: 'associate_portal', icon: Users },
      { title: 'Explore learning', description: 'Continue courses and practice activities.', destination: 'games_hub', icon: BookOpen },
      { title: 'Find process guidance', description: 'Search SOPs and project-specific reference material.', destination: 'knowledge', icon: Sparkles },
    ],
    focusTitle: 'Your work profile',
    focusItems: (_data, associate) => [
      `${associate.projectName} · ${associate.roleTitle}`,
      `${associate.assignedWeeklyModules.length} weekly learning items assigned.`,
      associate.consecutiveWeeksBelowQa > 0
        ? `${associate.consecutiveWeeksBelowQa} consecutive week(s) below the quality target. Review your coaching plan.`
        : 'Your quality trend is not currently below target.',
    ],
  },
};

export function RoleWorkspaceHome({
  role,
  displayName,
  associate,
  availableRoles,
  isRolePreview,
  metrics,
  onSelectRole,
  onOpenTab,
}: RoleWorkspaceHomeProps) {
  const experience = roleExperience[role];
  const RoleIcon = experience.icon;
  const roleMetrics = experience.metrics(metrics, associate);

  return (
    <section className="space-y-6" aria-labelledby="workspace-title">
      <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${experience.gradient} p-6 text-white shadow-xl sm:p-9`}>
        <div className="absolute -right-8 -top-16 h-64 w-64 rounded-full border border-white/10" aria-hidden="true" />
        <div className="absolute -right-2 -top-10 h-48 w-48 rounded-full border border-white/10" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              <RoleIcon className="h-4 w-4" />
              {experience.eyebrow}
            </div>
            <h1 id="workspace-title" className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {experience.headline}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
              {displayName ? `Welcome, ${displayName}. ` : ''}{experience.summary}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-white/70">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                {APP_ROLE_LABELS[role]} workspace
              </span>
              {isRolePreview && (
                <span className="rounded-full border border-amber-200/30 bg-amber-300/10 px-3 py-1.5 text-amber-100">
                  Preview only · does not grant access
                </span>
              )}
            </div>
          </div>
          {isRolePreview && availableRoles.length > 1 && (
            <label className="relative z-10 flex min-w-48 flex-col gap-1.5 text-xs font-semibold text-white/75">
              Preview a role
              <select
                aria-label="Preview role workspace"
                value={role}
                onChange={(event) => onSelectRole(event.target.value as UserRole)}
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm font-bold text-white outline-none focus:border-white/50 [&>option]:text-slate-900"
              >
                {availableRoles.map((availableRole) => (
                  <option key={availableRole} value={availableRole}>{APP_ROLE_LABELS[availableRole]}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {roleMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-500">{metric.label}</p>
                  <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">{metric.value}</p>
                </div>
                <span className={`rounded-xl p-2.5 ${
                  index === 0 ? 'bg-indigo-50 text-indigo-700' :
                    index === 1 ? 'bg-teal-50 text-teal-700' :
                      index === 2 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 text-[11px] text-slate-500">{metric.note}</p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
        <section aria-labelledby="workspace-actions" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Your tools</p>
            <h2 id="workspace-actions" className="mt-1 text-xl font-black text-slate-900">Start with what matters</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {experience.actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  type="button"
                  onClick={() => onOpenTab(action.destination)}
                  className="group flex min-h-44 flex-col items-start rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/60 hover:shadow-md"
                >
                  <span className="rounded-xl bg-white p-2.5 text-indigo-700 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="mt-4 text-sm font-extrabold text-slate-900">{action.title}</span>
                  <span className="mt-1 flex-1 text-xs leading-relaxed text-slate-600">{action.description}</span>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-700">
                    Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <aside aria-labelledby="workspace-focus" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            {role === 'associate' ? 'Personal snapshot' : 'At a glance'}
          </p>
          <h2 id="workspace-focus" className="mt-1 text-xl font-black text-slate-900">{experience.focusTitle}</h2>
          <ul className="mt-4 space-y-3">
            {experience.focusItems(metrics, associate).map((item, index) => (
              <li key={`${index}-${item}`} className="flex gap-3 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-indigo-700 shadow-sm">
                  {index === 0 ? <Target className="h-3 w-3" /> : index === 1 ? <CheckCircle2 className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-slate-100 pt-4 text-[11px] leading-relaxed text-slate-500">
            {role === 'associate'
              ? `Profile: ${associate.name} · ${associate.projectName} · ${associate.shift}`
              : 'Workspace figures currently use the app’s sample records until screen data is connected to Supabase.'}
          </p>
        </aside>
      </div>
    </section>
  );
}
