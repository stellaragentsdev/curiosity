import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  AssociateProfile,
  AuditDefectRecord,
  AutoTriggeredTrainingTicket,
  CalibrationSession,
  ContinuousLearningModule,
  MandatoryComplianceCourse,
  ProjectHealth,
  SopPlaybookItem,
} from '../types/rcm';
import type { NhtBatchRecord } from './FiveDimensionsCommandCenter';

export type RoleDestination =
  | 'trainer_hub'
  | 'quality'
  | 'scorecards'
  | 'training_modules'
  | 'nht_training'
  | 'admin_studio'
  | 'reports'
  | 'upload'
  | 'compliance'
  | 'dashboard';

function Heading({ eyebrow, title, subtitle, action, onAction, id }: {
  eyebrow: string; title: string; subtitle: string; action: string; onAction: () => void; id: string;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-clarity-ink">{eyebrow}</p>
        <h1 id={id} className="mt-2 text-2xl sm:text-[28px] font-bold tracking-tight text-clarity-ink">{title}</h1>
        <p className="mt-2 text-sm text-clarity-muted">{subtitle}</p>
      </div>
      <button type="button" onClick={onAction}
        className="keep-white-text inline-flex items-center justify-center gap-1.5 rounded-lg bg-clarity-600 px-5 py-3 text-xs font-bold text-white hover:bg-clarity-700">
        {action} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

function Stat({ label, value, caption }: { label: string; value: React.ReactNode; caption: string }) {
  return (
    <article className="clarity-card">
      <h2 className="clarity-stat-label">{label}</h2>
      <p className="clarity-number">{value}</p>
      <p className="clarity-caption">{caption}</p>
    </article>
  );
}

function LinkPill({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="clarity-pill hover:bg-clarity-200">{label}</button>
  );
}

const Footnote = () => (
  <p className="text-[11px] uppercase tracking-wide text-clarity-muted">
    Illustrative sample data · Sample profile view, not access control
  </p>
);

export function TrainerOverview({ tickets, associates, defects, calibrations, nhtBatches, onNavigate }: {
  tickets: AutoTriggeredTrainingTicket[];
  associates: AssociateProfile[];
  defects: AuditDefectRecord[];
  calibrations: CalibrationSession[];
  nhtBatches: NhtBatchRecord[];
  onNavigate: (d: RoleDestination) => void;
}) {
  const openTickets = tickets.filter((t) => t.status !== 'Closed — Summary Logged');
  const belowTarget = associates.filter((a) => a.qualityActualPct < a.qualityTargetPct);
  const pendingRebuttals = defects.filter((d) => d.rebuttalStatus === 'Rebuttal Pending').length;
  const upcomingCalibrations = calibrations.filter((c) => c.status !== 'Completed').length;
  return (
    <section aria-labelledby="trainer-overview-title" className="space-y-6" data-profile="trainer">
      <Heading id="trainer-overview-title" eyebrow="Trainer workspace" title="See the signal. Support the person."
        subtitle="Coaching queue, cohort delivery and quality reviews for your associates."
        action="Open coaching queue" onAction={() => onNavigate('trainer_hub')} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Open coaching tickets" value={openTickets.length} caption="DBT / BQT / PIP items awaiting trainer action" />
        <Stat label="Associates below QA target" value={belowTarget.length} caption={`of ${associates.length} sample associates`} />
        <Stat label="Pending rebuttals" value={pendingRebuttals} caption="Quality audit rebuttals to review" />
        <Stat label="Calibrations not completed" value={upcomingCalibrations} caption={`${calibrations.length} sessions in total`} />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <article className="clarity-card overflow-x-auto">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-clarity-ink">Coaching queue</h2>
            <span className="clarity-pill">{openTickets.length} open</span>
          </div>
          <table className="mt-3 w-full text-left text-xs">
            <thead>
              <tr className="border-b border-clarity-line text-[10px] uppercase tracking-wider">
                <th scope="col" className="py-2 pr-3">Associate / project</th>
                <th scope="col" className="py-2 pr-3">Workflow</th>
                <th scope="col" className="py-2 pr-3">Quality</th>
                <th scope="col" className="py-2"><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clarity-line">
              {openTickets.slice(0, 6).map((t) => (
                <tr key={t.id}>
                  <td className="py-3 pr-3"><b className="text-clarity-ink">{t.associateName}</b><br /><span className="text-clarity-muted">{t.projectName}</span></td>
                  <td className="py-3 pr-3"><span className="clarity-pill">{t.triggerLevel.split(':')[1]?.trim() ?? t.triggerLevel}</span></td>
                  <td className="py-3 pr-3 tabular-nums">{t.qualityActualPct}% / {t.qualityTargetPct}%</td>
                  <td className="py-3 text-right"><LinkPill label="Review" onClick={() => onNavigate('trainer_hub')} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-clarity-muted">Suggested order only. Coaching decisions stay with the trainer.</p>
        </article>
        <div className="space-y-4">
          <article className="clarity-card">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-clarity-ink">Cohort delivery</h2>
              <LinkPill label="NHT batches" onClick={() => onNavigate('nht_training')} />
            </div>
            <ul className="mt-3 divide-y divide-clarity-line">
              {nhtBatches.slice(0, 4).map((b) => (
                <li key={b.id} className="py-3 text-xs">
                  <div className="flex justify-between gap-2"><b className="text-clarity-ink">{b.batchName}</b><span className="text-clarity-muted tabular-nums">Day {b.currentDay}/{b.totalDays}</span></div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-clarity-100" aria-hidden="true">
                    <div className="h-full rounded-full bg-clarity-500" style={{ width: `${Math.round((b.currentDay / (b.totalDays || 1)) * 100)}%` }} />
                  </div>
                  <p className="mt-1 text-clarity-muted">{b.status} · {b.trainees.length} trainees</p>
                </li>
              ))}
            </ul>
          </article>
          <article className="clarity-card">
            <h2 className="text-base font-bold text-clarity-ink">Reviews & assignments</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <LinkPill label="Rebuttals & calibrations" onClick={() => onNavigate('quality')} />
              <LinkPill label="Scorecards & BQT/PIP" onClick={() => onNavigate('scorecards')} />
              <LinkPill label="Assign modules" onClick={() => onNavigate('training_modules')} />
            </div>
          </article>
        </div>
      </div>
      <Footnote />
    </section>
  );
}

export function AdminOverview({ projects, learningModules, complianceCourses, sops, summary, onNavigate }: {
  projects: ProjectHealth[];
  learningModules: ContinuousLearningModule[];
  complianceCourses: MandatoryComplianceCourse[];
  sops: SopPlaybookItem[];
  summary: { avgHealth: string; avgQual: string; avgCompliance: string; totalBqt: number; totalPip: number; pendingRebuttals: number };
  onNavigate: (d: RoleDestination) => void;
}) {
  return (
    <section aria-labelledby="admin-overview-title" className="space-y-6" data-profile="admin">
      <Heading id="admin-overview-title" eyebrow="Organisation overview" title="Govern learning across every project."
        subtitle="Organisation metrics, learning catalogue and governance controls."
        action="Open Admin Studio" onAction={() => onNavigate('admin_studio')} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Avg project health" value={<>{summary.avgHealth}<span className="text-base">%</span></>} caption={`${projects.length} sample projects`} />
        <Stat label="Avg quality SLA" value={<>{summary.avgQual}<span className="text-base">%</span></>} caption="Across filtered projects" />
        <Stat label="Org compliance" value={<>{summary.avgCompliance}<span className="text-base">%</span></>} caption={`${complianceCourses.length} mandatory courses`} />
        <Stat label="BQT / PIP" value={`${summary.totalBqt} / ${summary.totalPip}`} caption={`${summary.pendingRebuttals} rebuttals pending`} />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <article className="clarity-card overflow-x-auto">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-clarity-ink">Project health</h2>
            <LinkPill label="All dashboards" onClick={() => onNavigate('dashboard')} />
          </div>
          <table className="mt-3 w-full text-left text-xs">
            <thead>
              <tr className="border-b border-clarity-line text-[10px] uppercase tracking-wider">
                <th scope="col" className="py-2 pr-3">Project</th>
                <th scope="col" className="py-2 pr-3">Headcount</th>
                <th scope="col" className="py-2 pr-3">Health</th>
                <th scope="col" className="py-2">Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clarity-line">
              {projects.slice(0, 6).map((p) => (
                <tr key={p.id}>
                  <td className="py-3 pr-3"><b className="text-clarity-ink">{p.projectName}</b><br /><span className="text-clarity-muted">{p.specialty}</span></td>
                  <td className="py-3 pr-3 tabular-nums">{p.headcount}</td>
                  <td className="py-3 pr-3 tabular-nums">{p.healthScore}</td>
                  <td className="py-3 tabular-nums">{p.qualitySlaPct}% / {p.qualityTargetPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
        <div className="space-y-4">
          <article className="clarity-card">
            <h2 className="text-base font-bold text-clarity-ink">Learning catalogue</h2>
            <dl className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div><dt className="text-[10px] text-clarity-muted">Modules</dt><dd className="text-xl font-bold text-clarity-ink">{learningModules.length}</dd></div>
              <div><dt className="text-[10px] text-clarity-muted">Compliance</dt><dd className="text-xl font-bold text-clarity-ink">{complianceCourses.length}</dd></div>
              <div><dt className="text-[10px] text-clarity-muted">SOPs</dt><dd className="text-xl font-bold text-clarity-ink">{sops.length}</dd></div>
            </dl>
            <div className="mt-3 flex flex-wrap gap-2">
              <LinkPill label="Modules catalogue" onClick={() => onNavigate('training_modules')} />
              <LinkPill label="Compliance" onClick={() => onNavigate('compliance')} />
            </div>
          </article>
          <article className="clarity-card">
            <h2 className="text-base font-bold text-clarity-ink">Governance & management</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <LinkPill label="Admin Studio" onClick={() => onNavigate('admin_studio')} />
              <LinkPill label="Reports" onClick={() => onNavigate('reports')} />
              <LinkPill label="Daily upload" onClick={() => onNavigate('upload')} />
            </div>
            <p className="mt-3 text-xs text-clarity-muted">Proposed lifecycle: evidence → trainer review → authorised approval.</p>
          </article>
        </div>
      </div>
      <Footnote />
    </section>
  );
}
