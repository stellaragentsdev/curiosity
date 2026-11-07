import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { AssociateProfile, AutoTriggeredTrainingTicket, ContinuousLearningModule } from '../types/rcm';
import { buildAssociatePlan, buildCoachingReview } from '../utils/aiSuggestions';

/** Small decorative 3D-style orb. Hidden from assistive tech. */
export function GuideOrb({ size = 72 }: { size?: number }) {
  return (
    <div className="ai-orb-wrap" style={{ width: size, height: size }} aria-hidden="true">
      <div className="ai-orb">
        <span className="ai-orb-ring" />
        <span className="ai-orb-ring ai-orb-ring-2" />
      </div>
    </div>
  );
}

const DemoPill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-800 border border-amber-200">
    {children}
  </span>
);

/** Associate: scripted "next best step" with a suggested plan built from sample data. */
export function NextBestStepCard({ associate, learningModules, onOpenModules, onOpenAssistant }: {
  associate: AssociateProfile;
  learningModules: ContinuousLearningModule[];
  onOpenModules: () => void;
  onOpenAssistant: () => void;
}) {
  const [showPlan, setShowPlan] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const plan = buildAssociatePlan(associate, learningModules);
  return (
    <article className="clarity-card ai-card" aria-labelledby="nbs-title">
      <div className="flex items-start gap-4">
        <GuideOrb />
        <div className="min-w-0 flex-1">
          <DemoPill>Scripted suggestion · sample data</DemoPill>
          <h2 id="nbs-title" className="mt-2 text-base font-bold text-clarity-ink">Next best step: {plan.headline}</h2>
          <p className="mt-1 text-xs text-clarity-muted">{plan.signal}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" aria-expanded={showPlan} aria-controls="nbs-plan" onClick={() => setShowPlan((v) => !v)}
          className="keep-white-text rounded-lg bg-clarity-600 px-4 py-2 text-xs font-bold text-white hover:bg-clarity-700">
          {showPlan ? 'Hide plan' : 'Show suggested plan'}
        </button>
        <button type="button" aria-expanded={showWhy} aria-controls="nbs-why" onClick={() => setShowWhy((v) => !v)}
          className="rounded-lg border border-clarity-line bg-white px-4 py-2 text-xs font-bold text-clarity-700 hover:bg-clarity-50">
          Why this?
        </button>
      </div>
      {showWhy && (
        <p id="nbs-why" className="mt-3 rounded-lg bg-clarity-50 p-3 text-xs text-clarity-ink">
          {plan.reason} Your trainer reviews any plan before it counts.
        </p>
      )}
      {showPlan && (
        <ol id="nbs-plan" className="mt-3 divide-y divide-clarity-line" aria-live="polite">
          {plan.steps.map((s, i) => (
            <li key={s} className="ai-reveal py-2.5 text-xs text-clarity-ink" style={{ animationDelay: `${i * 120}ms` }}>
              {i + 1} · {s}
            </li>
          ))}
          <li className="flex flex-wrap gap-2 pt-3">
            <button type="button" onClick={onOpenModules} className="clarity-pill hover:bg-clarity-200">Open Training Modules</button>
            <button type="button" onClick={onOpenAssistant} className="clarity-pill hover:bg-clarity-200">Ask Trainer Sam (demo)</button>
          </li>
        </ol>
      )}
    </article>
  );
}

const STEP_NAMES = ['Analyse', 'Recommend', 'Review'] as const;

/** Trainer: deterministic Analyse → Recommend → Review tray. The trainer advances and decides. */
export function CoachingReviewTray({ tickets, associates, learningModules, onOpenTrainerHub, onOpenScorecards }: {
  tickets: AutoTriggeredTrainingTicket[];
  associates: AssociateProfile[];
  learningModules: ContinuousLearningModule[];
  onOpenTrainerHub: () => void;
  onOpenScorecards: () => void;
}) {
  const open = tickets.filter((t) => t.status !== 'Closed — Summary Logged');
  const [ticketId, setTicketId] = useState(open[0]?.id ?? '');
  const [step, setStep] = useState(0);
  const [decision, setDecision] = useState<string | null>(null);
  const ticket = open.find((t) => t.id === ticketId) ?? open[0];
  if (!ticket) return null;
  const review = buildCoachingReview(ticket, associates, learningModules);
  const outputs = [review.analysis, review.recommendations.join(' · '), 'Choose an outcome below. Nothing is assigned or saved.'];
  const reset = () => { setStep(0); setDecision(null); };

  return (
    <article className="clarity-card" aria-labelledby="tray-title">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="tray-title" className="flex items-center gap-2 text-base font-bold text-clarity-ink">
          <Sparkles className="h-4 w-4 text-clarity-600" aria-hidden="true" /> Coaching review assistant
        </h2>
        <DemoPill>Scripted demo · not real AI activity</DemoPill>
      </div>
      <label className="mt-3 block text-xs text-clarity-muted">
        Ticket{' '}
        <select value={ticket.id} onChange={(e) => { setTicketId(e.target.value); reset(); }}
          className="ml-1 rounded-md border border-clarity-line bg-white px-2 py-1 text-xs text-clarity-ink">
          {open.map((t) => <option key={t.id} value={t.id}>{t.associateName} · {t.id}</option>)}
        </select>
      </label>
      <ol className="ai-steps mt-4 grid gap-3 md:grid-cols-3">
        {STEP_NAMES.map((name, i) => {
          const state = i < step ? 'done' : i === step - 1 ? 'active' : 'idle';
          return (
            <li key={name} className={`ai-step ${i < step ? 'is-done' : ''} ${i === step - 1 ? 'is-active' : ''}`} aria-current={i === step - 1 ? 'step' : undefined}>
              <p className="text-[10px] font-bold tracking-[0.12em] text-clarity-muted">0{i + 1} · {name.toUpperCase()}{state === 'done' ? ' ✓' : ''}</p>
              <p className="mt-2 text-xs text-clarity-ink min-h-[3rem]">{i < step ? outputs[i] : '—'}</p>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 h-1 rounded-full bg-clarity-100" aria-hidden="true">
        <div className="h-full rounded-full bg-clarity-600 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {step < 3 && (
          <button type="button" onClick={() => setStep((s) => s + 1)}
            className="keep-white-text rounded-lg bg-clarity-600 px-4 py-2 text-xs font-bold text-white hover:bg-clarity-700">
            {['Start analysis', 'Show recommendations', 'Open trainer review'][step]}
          </button>
        )}
        {step === 3 && !decision && (
          <>
            <button type="button" onClick={() => setDecision('Marked for follow-up in Trainer Hub (local only).')} className="clarity-pill hover:bg-clarity-200">Accept for follow-up</button>
            <button type="button" onClick={() => setDecision('Dismissed. No change made.')} className="clarity-pill hover:bg-clarity-200">Dismiss</button>
          </>
        )}
        <button type="button" onClick={reset} className="rounded-lg border border-clarity-line bg-white px-3 py-2 text-xs font-bold text-clarity-700">Reset</button>
        <button type="button" onClick={onOpenTrainerHub} className="text-xs font-bold text-clarity-700 hover:underline">Open Trainer Hub →</button>
        <button type="button" onClick={onOpenScorecards} className="text-xs font-bold text-clarity-700 hover:underline">Scorecards →</button>
      </div>
      <p className="mt-2 text-xs text-clarity-muted" aria-live="polite">
        {decision ?? `Step ${step} of 3 (scripted sample). Coaching decisions stay with the trainer.`}
      </p>
    </article>
  );
}

/** Admin: module card with gentle pointer tilt. Fully usable by keyboard; tilt is decorative. */
export function TiltModuleCard({ module, selected, onSelect }: {
  module: ContinuousLearningModule; selected: boolean; onSelect: () => void;
}) {
  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (document.documentElement.classList.contains('motion-paused')) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty('--tilt-x', `${(-y * 8).toFixed(2)}deg`);
    e.currentTarget.style.setProperty('--tilt-y', `${(x * 8).toFixed(2)}deg`);
  };
  const onLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.style.removeProperty('--tilt-x');
    e.currentTarget.style.removeProperty('--tilt-y');
  };
  return (
    <button type="button" aria-pressed={selected} onClick={onSelect} onPointerMove={onMove} onPointerLeave={onLeave}
      className={`tilt-card text-left ${selected ? 'is-selected' : ''}`}>
      <span className="tilt-layer block">
        <span className="clarity-pill">{module.category}</span>
        <span className="mt-2 block text-sm font-bold text-clarity-ink">{module.title}</span>
        <span className="block text-[11px] text-clarity-muted">{module.id} · {module.durationMins} min</span>
        <span className="mt-3 block h-1.5 rounded-full bg-clarity-100" aria-hidden="true">
          <span className="block h-full rounded-full bg-clarity-600" style={{ width: `${module.completionRatePct}%` }} />
        </span>
        <span className="mt-1 block text-[11px] text-clarity-muted">{module.completionRatePct}% completion (sample)</span>
      </span>
    </button>
  );
}
