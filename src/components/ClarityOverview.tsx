import React from 'react';
import { ArrowUpRight, Bot } from 'lucide-react';
import {
  AssociateProfile,
  AutoTriggeredTrainingTicket,
  ContinuousLearningModule,
} from '../types/rcm';

export type OverviewDestination = 'training_modules' | 'trainer_hub' | 'scorecards' | 'knowledge' | 'associate_portal';

interface ClarityOverviewProps {
  associate: AssociateProfile;
  isAssociateLens: boolean;
  tickets: AutoTriggeredTrainingTicket[];
  learningModules: ContinuousLearningModule[];
  onNavigate: (destination: OverviewDestination) => void;
}

interface PriorityItem {
  key: string;
  eyebrow: string;
  title: string;
  detail: string;
  destination: OverviewDestination;
  pill: string;
}

/**
 * "My overview" page following the approved 01 / Clarity design:
 * page heading + primary action, three stat cards, a priorities list,
 * a practice trend card and the demo-only Trainer Sam card.
 * All values come from the app's existing sample data.
 */
export function ClarityOverview({
  associate,
  isAssociateLens,
  tickets,
  learningModules,
  onNavigate,
}: ClarityOverviewProps) {
  const openTickets = tickets.filter(
    (t) => t.associateId === associate.id && t.status !== 'Closed — Summary Logged'
  );
  const assignedModules = associate.assignedWeeklyModules
    .map((id) => learningModules.find((m) => m.id === id))
    .filter((m): m is ContinuousLearningModule => Boolean(m));

  const priorities: PriorityItem[] = [
    ...assignedModules.map((m) => ({
      key: m.id,
      eyebrow: 'Assigned module',
      title: m.title,
      detail: `${m.durationMins} min · pass mark ${m.passMarksPct}%`,
      destination: 'training_modules' as const,
      pill: 'Learning',
    })),
    ...openTickets.map((t) => ({
      key: t.id,
      eyebrow: 'Coaching',
      title: t.triggerLevel,
      detail: `${t.defectDriver} · ${t.status}`,
      destination: 'trainer_hub' as const,
      pill: 'Coaching',
    })),
  ].slice(0, 3);

  const streak = associate.weeklyQualityStreak.slice(-4);
  const maxPct = 100;
  const minPct = Math.min(70, ...streak.map((s) => s.qualityPct));
  const qualityMet = associate.qualityActualPct >= associate.qualityTargetPct;

  return (
    <section aria-labelledby="clarity-overview-title" className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-clarity-ink">
            {isAssociateLens ? 'Your next best step' : 'Associate in focus'}
          </p>
          <h1 id="clarity-overview-title" className="mt-2 text-2xl sm:text-[28px] font-bold tracking-tight text-clarity-ink">
            {isAssociateLens ? 'A clear path to stronger work.' : associate.name}
          </h1>
          <p className="mt-2 text-sm text-clarity-muted">
            {isAssociateLens
              ? 'Your training, client context and coaching in one place.'
              : `${associate.roleTitle} · ${associate.projectName}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('training_modules')}
          className="keep-white-text inline-flex items-center justify-center gap-1.5 rounded-lg bg-clarity-600 px-5 py-3 text-xs font-bold text-white hover:bg-clarity-700"
        >
          View learning plan <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <article className="clarity-card">
          <h2 className="clarity-stat-label">Annual compliance</h2>
          <p className="clarity-number">
            {associate.annualCompliancePct}
            <span className="text-base">%</span>
          </p>
          <p className="clarity-caption">{assignedModules.length} weekly module(s) assigned</p>
          <div
            className="mt-4 h-1.5 rounded-full bg-clarity-100"
            role="progressbar"
            aria-label="Annual compliance"
            aria-valuenow={associate.annualCompliancePct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded-full bg-clarity-500" style={{ width: `${associate.annualCompliancePct}%` }} />
          </div>
        </article>
        <article className="clarity-card">
          <h2 className="clarity-stat-label">Quality score</h2>
          <p className="clarity-number">
            {associate.qualityActualPct}
            <span className="text-base">%</span>
          </p>
          <p className="clarity-caption">
            Target {associate.qualityTargetPct}% · {qualityMet ? 'on target' : 'below target'} (sample data)
          </p>
        </article>
        <article className="clarity-card">
          <h2 className="clarity-stat-label">Open coaching items</h2>
          <p className="clarity-number">{openTickets.length}</p>
          <p className="clarity-caption">{associate.governanceStage}</p>
        </article>
      </div>

      {/* Priorities + trend */}
      <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <article className="clarity-card">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-clarity-ink">{isAssociateLens ? 'Your priorities' : 'Priorities'}</h2>
            <span className="clarity-pill">{priorities.length} next steps</span>
          </div>
          {priorities.length === 0 ? (
            <p className="mt-4 text-sm text-clarity-muted">No assigned modules or open coaching items.</p>
          ) : (
            <ol className="mt-2 divide-y divide-clarity-line">
              {priorities.map((p, i) => (
                <li key={p.key} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-clarity-muted">
                      {String(i + 1).padStart(2, '0')} · {p.eyebrow}
                    </p>
                    <p className="mt-1 text-sm font-bold text-clarity-ink">{p.title}</p>
                    <p className="mt-0.5 text-xs text-clarity-muted">{p.detail}</p>
                  </div>
                  {i === 0 ? (
                    <button
                      type="button"
                      onClick={() => onNavigate(p.destination)}
                      className="keep-white-text shrink-0 rounded-lg bg-clarity-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-clarity-700 sm:min-w-[160px]"
                    >
                      Continue
                    </button>
                  ) : (
                    <button type="button" onClick={() => onNavigate(p.destination)} className="clarity-pill self-start sm:self-center hover:bg-clarity-200">
                      {p.pill}
                    </button>
                  )}
                </li>
              ))}
            </ol>
          )}
          <p className="mt-2 border-t border-clarity-line pt-4 text-xs text-clarity-muted">
            BQT coaching and PIP plans stay separate from learning progress.
          </p>
        </article>

        <div className="space-y-4">
          <article className="clarity-card">
            <h2 className="text-base font-bold text-clarity-ink">Quality trend</h2>
            <p className="mt-1 text-xs text-clarity-muted">Last {streak.length} weeks of sample QA scores</p>
            <div
              className="mt-5 flex h-24 items-end gap-2"
              role="img"
              aria-label={`Weekly quality: ${streak.map((s) => `${s.week} ${s.qualityPct}%`).join(', ')}`}
            >
              {streak.map((s, i) => (
                <div
                  key={s.week}
                  title={`${s.week}: ${s.qualityPct}%`}
                  className={`flex-1 rounded-t ${i === streak.length - 1 ? 'bg-clarity-600' : 'bg-clarity-200'}`}
                  style={{ height: `${Math.max(8, ((s.qualityPct - minPct) / (maxPct - minPct)) * 100)}%` }}
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-clarity-muted">
              Use progress to guide a conversation, not automate a performance decision.
            </p>
          </article>
          <article className="rounded-xl border border-clarity-line bg-[#e9f1ef] p-5">
            <span className="clarity-pill">Demo guidance only</span>
            <p className="mt-3 text-xs leading-relaxed text-clarity-ink">
              <b>Trainer Sam</b> can help you find a playbook. Verify guidance against an approved SOP and your trainer.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('knowledge')}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-clarity-700 hover:underline"
            >
              <Bot className="h-3.5 w-3.5" aria-hidden="true" /> Open Trainer Sam
            </button>
          </article>
        </div>
      </div>

      <p className="text-[11px] uppercase tracking-wide text-clarity-muted">
        Illustrative sample data · No live employee or client information
      </p>
    </section>
  );
}
