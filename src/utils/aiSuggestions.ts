import { AssociateProfile, AutoTriggeredTrainingTicket, ContinuousLearningModule } from '../types/rcm';

/**
 * Deterministic, rule-based "suggestions" built only from existing sample data.
 * No AI model is called. Used to illustrate assistant UX in the prototype.
 */
export function buildAssociatePlan(a: AssociateProfile, modules: ContinuousLearningModule[]) {
  const assigned = a.assignedWeeklyModules
    .map((id) => modules.find((m) => m.id === id))
    .filter((m): m is ContinuousLearningModule => Boolean(m));
  const first = assigned[0];
  const belowTarget = a.qualityActualPct < a.qualityTargetPct;
  return {
    headline: first ? first.title : 'Review your compliance courses',
    signal: `Sample signals: quality ${a.qualityActualPct}% vs ${a.qualityTargetPct}% target · ${a.governanceStage}.`,
    reason: `Rule: ${belowTarget ? 'quality is below target, so' : 'quality is on target, so'} the first assigned weekly module is suggested. Top defect driver: ${a.topDefectCategory}.`,
    steps: [
      ...assigned.map((m) => `Complete ${m.id} — ${m.title} (${m.durationMins} min, pass ${m.passMarksPct}%)`),
      `Review notes on "${a.topDefectCategory}"`,
      `Bring one question to ${a.assignedTrainer}`,
    ],
  };
}

export function buildCoachingReview(
  t: AutoTriggeredTrainingTicket,
  associates: AssociateProfile[],
  modules: ContinuousLearningModule[]
) {
  const a = associates.find((x) => x.id === t.associateId);
  const trend = a ? a.weeklyQualityStreak.slice(-3).map((w) => `${w.qualityPct}%`).join(' → ') : `${t.qualityActualPct}%`;
  const related = modules.filter((m) => m.specialty === t.specialty || m.tower === t.tower).slice(0, 2);
  return {
    analysis: `${t.associateName}: quality ${trend} (target ${t.qualityTargetPct}%). Driver: ${t.defectDriver}.`,
    recommendations: [
      ...related.map((m) => `Consider ${m.id} (${m.title})`),
      'Paired claim review with auditor',
    ],
  };
}
