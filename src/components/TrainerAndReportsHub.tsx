import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Download,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Filter,
  Flame,
  FolderKanban,
  GraduationCap,
  HelpCircle,
  Layers,
  Lock,
  Play,
  Plus,
  ShieldAlert,
  Sparkles,
  Target,
  Users,
  UsersRound,
} from 'lucide-react';
import {
  AssociateProfile,
  AutoTriggeredTrainingTicket,
  ContinuousLearningModule,
  DailyUploadBatch,
  GovernanceStage,
  MandatoryComplianceCourse,
  ProjectHealth,
  ProjectQuestionBankItem,
  ProjectWeeklyAssessment,
  RcmTower,
  UserGroup,
  WeeklyAssessmentPillar,
} from '../types/rcm';
import { RCM_TOWERS, TRAINER_DIRECTORY } from '../data/mockRcmData';

interface TrainerWorkbenchProps {
  projects: ProjectHealth[];
  associates: AssociateProfile[];
  setAssociates: React.Dispatch<React.SetStateAction<AssociateProfile[]>>;
  tickets: AutoTriggeredTrainingTicket[];
  setTickets: React.Dispatch<React.SetStateAction<AutoTriggeredTrainingTicket[]>>;
  weeklyAssessments: ProjectWeeklyAssessment[];
  setWeeklyAssessments: React.Dispatch<React.SetStateAction<ProjectWeeklyAssessment[]>>;
  questionBank: ProjectQuestionBankItem[];
  setQuestionBank: React.Dispatch<React.SetStateAction<ProjectQuestionBankItem[]>>;
  triggerToast: (msg: string) => void;
}

export const TrainerWorkbench: React.FC<TrainerWorkbenchProps> = ({
  projects,
  associates,
  setAssociates,
  tickets,
  setTickets,
  weeklyAssessments,
  setWeeklyAssessments,
  questionBank,
  setQuestionBank,
  triggerToast,
}) => {
  // Active Trainer Switcher (Enforces Assigned Projects Only Access!)
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>('TRN-01');
  const activeTrainer = useMemo(
    () => TRAINER_DIRECTORY.find((t) => t.id === selectedTrainerId) || TRAINER_DIRECTORY[0],
    [selectedTrainerId]
  );

  // Scoped Projects for the active Trainer
  const scopedProjects = useMemo(
    () => projects.filter((p) => activeTrainer.assignedProjectIds.includes(p.id)),
    [projects, activeTrainer]
  );

  const [selectedProjectId, setSelectedProjectId] = useState<string>('PRJ-ORTH-02');
  const currentProject = useMemo(() => {
    const inScope = scopedProjects.find((p) => p.id === selectedProjectId);
    return inScope || scopedProjects[0] || projects[0];
  }, [scopedProjects, selectedProjectId, projects]);

  // Scoped Associates & Auto-Triggered Training Tickets for this Trainer's assigned projects
  const scopedAssociates = useMemo(
    () => associates.filter((a) => activeTrainer.assignedProjectIds.includes(a.projectId)),
    [associates, activeTrainer]
  );

  const scopedTickets = useMemo(
    () => tickets.filter((t) => activeTrainer.assignedProjectIds.includes(t.projectId)),
    [tickets, activeTrainer]
  );

  // Training Summary Closure Drafts
  const [summaryDrafts, setSummaryDrafts] = useState<Record<string, string>>({});
  const [postQuizScores, setPostQuizScores] = useState<Record<string, number>>({});

  // Question Bank Builder Form State
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [qbPillar, setQbPillar] = useState<WeeklyAssessmentPillar>('1. Project Knowledge');
  const [qbTower, setQbTower] = useState<RcmTower>('Denials Management');
  const [qbQuestion, setQbQuestion] = useState('');
  const [qbOptA, setQbOptA] = useState('');
  const [qbOptB, setQbOptB] = useState('');
  const [qbOptC, setQbOptC] = useState('');
  const [qbOptD, setQbOptD] = useState('');
  const [qbCorrectIdx, setQbCorrectIdx] = useState(1);
  const [qbExplanation, setQbExplanation] = useState('');

  // Handler: Close Auto-Triggered Training by providing Mandatory Training Summary
  const handleCloseTrainingTicket = (ticketId: string) => {
    const summary = summaryDrafts[ticketId]?.trim();
    if (!summary || summary.length < 10) {
      triggerToast(
        'Mandatory Requirement: Please enter a detailed Training Summary (coaching root-cause, SOP covered & action plan) before closing an auto-triggered training.'
      );
      return;
    }
    const quizScore = postQuizScores[ticketId] || 92;

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'Closed — Summary Logged',
              trainingSummary: summary,
              closedAt: '2026-11-07 10:28 IST',
              postTrainingQuizScore: quizScore,
            }
          : t
      )
    );
    triggerToast(
      `Closed Auto-Triggered Training ${ticketId} with Trainer Summary & Post-Training Score (${quizScore}%).`
    );
  };

  // Handler: Simulate Consecutive Weeks Below Quality SLA (1 Wk -> DBT, 3 Wks -> BQT, 4 Wks -> 15-Day PIP)
  const handleSimulateWeekEscalation = (assocId: string, targetConsecutiveWeeks: number) => {
    const targetAssoc = associates.find((a) => a.id === assocId);
    if (!targetAssoc) return;

    let newStage: GovernanceStage = 'Core Performer (Q2-Q3)';
    let ticketLevel: AutoTriggeredTrainingTicket['triggerLevel'] =
      'Week 1-2: Defect-Based Training (DBT)';
    let newQual = targetAssoc.qualityActualPct;
    let pipDays: number | undefined = undefined;
    let pipStageText: string | undefined = undefined;

    if (targetConsecutiveWeeks === 0) {
      newStage = 'Core Performer (Q2-Q3)';
      newQual = Number((targetAssoc.qualityTargetPct + 0.6).toFixed(1));
    } else if (targetConsecutiveWeeks === 1 || targetConsecutiveWeeks === 2) {
      newStage = 'Defect-Based Training (1-2 Wks Below QA)';
      ticketLevel = 'Week 1-2: Defect-Based Training (DBT)';
      newQual = Number((targetAssoc.qualityTargetPct - 2.2).toFixed(1));
    } else if (targetConsecutiveWeeks === 3) {
      newStage = 'BQT (3 Consecutive Wks Below QA)';
      ticketLevel = 'Week 3 Consecutive: Bottom Quartile Training (BQT)';
      newQual = Number((targetAssoc.qualityTargetPct - 5.5).toFixed(1));
    } else {
      newStage = 'PIP - 15 Days (4 Consecutive Wks Below QA)';
      ticketLevel = 'Week 4 Consecutive: PIP (15-Day Plan)';
      newQual = Number((targetAssoc.qualityTargetPct - 9.0).toFixed(1));
      pipDays = 15;
      pipStageText = '15-Day PIP Triggered (Day 1 of 15 — 100% Pre-Bill Audit)';
    }

    setAssociates((prev) =>
      prev.map((a) => {
        if (a.id !== assocId) return a;
        return {
          ...a,
          consecutiveWeeksBelowQa: targetConsecutiveWeeks,
          qualityActualPct: newQual,
          governanceStage: newStage,
          pipDaysRemaining: pipDays,
          pipStage: pipStageText,
        };
      })
    );

    if (targetConsecutiveWeeks >= 1) {
      const newTicket: AutoTriggeredTrainingTicket = {
        id: `TRG-2026-${Math.floor(810 + Math.random() * 180)}`,
        triggeredDate: '2026-11-07 (Auto-Triggered)',
        associateId: targetAssoc.id,
        associateName: targetAssoc.name,
        empId: targetAssoc.empId,
        projectId: targetAssoc.projectId,
        projectName: targetAssoc.projectName,
        tower: targetAssoc.tower,
        specialty: targetAssoc.specialty,
        consecutiveWeeksBelowQa: targetConsecutiveWeeks,
        triggerLevel: ticketLevel,
        qualityActualPct: newQual,
        qualityTargetPct: targetAssoc.qualityTargetPct,
        defectDriver: targetAssoc.topDefectCategory,
        assignedTrainer: targetAssoc.assignedTrainer,
        trainingLead: targetAssoc.trainingLead,
        reportingLead: targetAssoc.reportingLead,
        operationsManager: targetAssoc.operationsManager,
        assignedAuditor: targetAssoc.assignedAuditor,
        status: 'Open — Pending Trainer Action',
      };
      setTickets((prev) => [newTicket, ...prev]);
    }

    triggerToast(
      targetConsecutiveWeeks === 0
        ? `Reset ${targetAssoc.name} to 0 Weeks Below QA (Met SLA ${newQual}%).`
        : `Escalated ${targetAssoc.name} to ${targetConsecutiveWeeks} Consecutive Week(s) Below QA → Auto-Triggered "${ticketLevel}"!`
    );
  };

  // Handler: Add Question to Project Question Bank & Link to Weekly 4 Assessments
  const handleAddQuestionBankItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qbQuestion.trim()) {
      triggerToast('Please enter the assessment question text.');
      return;
    }
    const newId = `QB-${currentProject.clientCode}-${Math.floor(10 + Math.random() * 89)}`;
    const item: ProjectQuestionBankItem = {
      id: newId,
      projectId: currentProject.id,
      projectName: currentProject.projectName,
      specialty: currentProject.specialty,
      tower: qbTower,
      pillar: qbPillar,
      question: qbQuestion.trim(),
      options: [
        qbOptA.trim() || 'Option A: Standard Payer Portal Verification',
        qbOptB.trim() || 'Option B: Follow Project Playbook & Attach Clinical Op-Note / 277CA',
        qbOptC.trim() || 'Option C: Write off balance without investigation',
        qbOptD.trim() || 'Option D: Bill patient directly',
      ],
      correctIndex: qbCorrectIdx,
      explanation:
        qbExplanation.trim() ||
        `Verified per ${currentProject.projectName} SOP & ${qbPillar} assessment standards.`,
      addedBy: activeTrainer.name,
      createdAt: '2026-11-07',
    };

    setQuestionBank((prev) => [item, ...prev]);
    setWeeklyAssessments((prev) =>
      prev.map((wa) =>
        wa.projectId === currentProject.id && wa.pillar === qbPillar
          ? { ...wa, questionIds: [...wa.questionIds, newId] }
          : wa
      )
    );
    setShowAddQuestion(false);
    setQbQuestion('');
    setQbOptA('');
    setQbOptB('');
    setQbOptC('');
    setQbOptD('');
    setQbExplanation('');
    triggerToast(
      `Added Question ${newId} to ${currentProject.projectName} Question Bank under "${qbPillar}"!`
    );
  };

  const projectAssessments = useMemo(
    () => weeklyAssessments.filter((w) => w.projectId === currentProject.id),
    [weeklyAssessments, currentProject.id]
  );

  const projectQuestions = useMemo(
    () => questionBank.filter((q) => q.projectId === currentProject.id),
    [questionBank, currentProject.id]
  );

  return (
    <div className="space-y-6">
      {/* Trainer Role Scoping & Assigned Projects Access Control Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Role-Based Project Access Control Enforced (Assigned Projects Only)
            </span>
          </div>
          <h2 className="text-base font-bold text-white">
            Trainer Governance Workbench — Auto-Triggered Trainings, Weekly 4 Assessments & Question Bank
          </h2>
          <p className="text-xs text-slate-300">
            Active Trainer: <strong className="text-white">{activeTrainer.name}</strong> ({activeTrainer.role}) • Authorized Projects:{' '}
            <span className="text-indigo-300 font-semibold">
              {scopedProjects.map((p) => p.projectName).join(' • ')}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Switch Active Trainer:</label>
          <select
            value={selectedTrainerId}
            onChange={(e) => {
              const newTrnId = e.target.value;
              setSelectedTrainerId(newTrnId);
              const found = TRAINER_DIRECTORY.find((t) => t.id === newTrnId);
              if (found && found.assignedProjectIds[0]) {
                setSelectedProjectId(found.assignedProjectIds[0]);
              }
            }}
            className="bg-slate-950 border border-indigo-500/50 rounded-xl px-3 py-2 text-xs text-white font-semibold"
          >
            {TRAINER_DIRECTORY.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.assignedProjectIds.length} Assigned Projects)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Automated Consecutive-Week Quality SLA Escalation Rule Engine Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/40 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300">
              Rule 1: 1 Week Below Quality SLA
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
              Week 1 Trigger
            </span>
          </div>
          <div className="text-sm font-extrabold text-white">
            Triggers Defect-Based Training (DBT)
          </div>
          <p className="text-xs text-slate-400">
            Auto-assigns targeted CARC/Coding defect micro-module & creates Trainer coaching ticket.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300">
              Rule 2: Consecutive 3 Weeks Below Quality
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
              3-Week Streak
            </span>
          </div>
          <div className="text-sm font-extrabold text-white">
            Triggers Bottom Quartile Training (BQT)
          </div>
          <p className="text-xs text-slate-400">
            Enrolls associate in intensive BQT cohort with side-by-side trainer huddles & weekly gates.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/40 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-300">
              Rule 3: Consecutive 4 Weeks Below Quality
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300">
              4-Week Streak
            </span>
          </div>
          <div className="text-sm font-extrabold text-white">
            Triggers Formal PIP (15 Days Window)
          </div>
          <p className="text-xs text-slate-400">
            Initiates 15-Day Performance Improvement Plan with 100% pre-bill QA audit & HR/Ops oversight.
          </p>
        </div>
      </div>

      {/* SECTION 1: AUTO-TRIGGERED TRAININGS QUEUE & MANDATORY TRAINING SUMMARY CLOSURE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              Auto-Triggered Trainings Queue (Scoped to {activeTrainer.name}’s Assigned Projects)
            </h3>
            <p className="text-xs text-slate-400">
              Trainers must complete coaching and enter a mandatory <strong>Training Summary</strong> to close auto-triggered DBT, BQT, and 15-Day PIP tickets
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            {scopedTickets.filter((t) => t.status !== 'Closed — Summary Logged').length} Open Tickets Requiring Trainer Closure
          </span>
        </div>

        <div className="space-y-4">
          {scopedTickets.map((tkt) => {
            const isClosed = tkt.status === 'Closed — Summary Logged';
            const levelBadge = tkt.triggerLevel.includes('PIP')
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : tkt.triggerLevel.includes('BQT')
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';

            return (
              <div
                key={tkt.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-indigo-300">{tkt.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold border ${levelBadge}`}>
                        {tkt.triggerLevel}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-semibold">
                        {tkt.consecutiveWeeksBelowQa} Consecutive Wk(s) Below QA
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {tkt.associateName} ({tkt.empId}) • {tkt.projectName} ({tkt.tower})
                    </div>
                    <div className="text-amber-300">
                      <strong>Defect Driver:</strong> {tkt.defectDriver} • Actual QA:{' '}
                      <strong>{tkt.qualityActualPct}%</strong> (Target: {tkt.qualityTargetPct}%)
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full font-bold border ${
                      isClosed
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                    }`}
                  >
                    {tkt.status}
                  </span>
                </div>

                {/* 6-Role Organizational Mapping Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Reporting Lead:</span>
                    <strong className="text-slate-200">{tkt.reportingLead}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Ops Manager:</span>
                    <strong className="text-slate-200">{tkt.operationsManager}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Assigned Trainer:</span>
                    <strong className="text-emerald-300">{tkt.assignedTrainer}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Training Lead:</span>
                    <strong className="text-indigo-300">{tkt.trainingLead}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">QA Auditor:</span>
                    <strong className="text-sky-300">{tkt.assignedAuditor}</strong>
                  </div>
                </div>

                {/* Closed Summary OR Mandatory Closure Form */}
                {isClosed ? (
                  <div className="p-3 rounded-xl bg-emerald-950/25 border border-emerald-500/30 space-y-1">
                    <div className="text-emerald-300 font-bold flex items-center justify-between">
                      <span>Logged Trainer Summary (Closed {tkt.closedAt}):</span>
                      <span>Post-Training Quiz Score: {tkt.postTrainingQuizScore}%</span>
                    </div>
                    <p className="text-slate-200">{tkt.trainingSummary}</p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5 pt-1">
                    <div className="flex-1">
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Mandatory Training Summary (Root Cause Coached, SOP/Claim Walkthrough & Action Plan) *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter training summary (e.g., Coached on SOP-OR-12 Evicore retro-auth lookup + 5 live claim walkthroughs)..."
                        value={summaryDrafts[tkt.id] || ''}
                        onChange={(e) =>
                          setSummaryDrafts((prev) => ({ ...prev, [tkt.id]: e.target.value }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div className="w-full sm:w-36">
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Post-Quiz Score %
                      </label>
                      <input
                        type="number"
                        min={50}
                        max={100}
                        value={postQuizScores[tkt.id] ?? 92}
                        onChange={(e) =>
                          setPostQuizScores((prev) => ({
                            ...prev,
                            [tkt.id]: Number(e.target.value),
                          }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white tabular-nums"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCloseTrainingTicket(tkt.id)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shrink-0"
                    >
                      Submit Summary & Close Training
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: LIVE CONSECUTIVE-WEEKS ESCALATION SIMULATOR & 6-ROLE USER MAPPING TABLE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white">
              User-to-Project 6-Role Mapping & Consecutive-Week Quality SLA Escalation Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Maps every employee to Project, Reporting Lead, Manager, Trainer, Training Lead & Auditor. Click <strong>1 Wk (DBT)</strong>, <strong>3 Wks (BQT)</strong>, or <strong>4 Wks (15d PIP)</strong> to test auto-triggers!
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-950/60">
                <th className="py-3 px-3">Associate & Batch</th>
                <th className="py-3 px-3">Project & Tower</th>
                <th className="py-3 px-3">Reporting Lead & Manager</th>
                <th className="py-3 px-3">Trainer, Training Lead & Auditor</th>
                <th className="py-3 px-3 text-center">4-Week QA Streak</th>
                <th className="py-3 px-3">Current Trigger Stage</th>
                <th className="py-3 px-3 text-right">Simulate Streak Trigger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {scopedAssociates.map((a) => (
                <tr key={a.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">
                      {a.name} <span className="font-mono text-[10px] text-indigo-300">{a.empId}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Batch: {a.batchCode}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-200">{a.projectName}</div>
                    <div className="text-[11px] text-indigo-300">{a.tower}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-200">Lead: <strong>{a.reportingLead}</strong></div>
                    <div className="text-[11px] text-slate-400">Mgr: {a.operationsManager}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-emerald-300">Trainer: <strong>{a.assignedTrainer}</strong></div>
                    <div className="text-[11px] text-slate-400">
                      T-Lead: {a.trainingLead} • QA: {a.assignedAuditor}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="inline-flex items-center gap-1">
                      {a.weeklyQualityStreak.map((w) => (
                        <span
                          key={w.week}
                          title={`${w.week}: ${w.qualityPct}% (SLA ${w.targetPct}%)`}
                          className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold tabular-nums ${
                            w.belowSla
                              ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {Math.round(w.qualityPct)}
                        </span>
                      ))}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {a.consecutiveWeeksBelowQa} Consecutive Wk(s) Below SLA
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                        a.consecutiveWeeksBelowQa >= 4
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : a.consecutiveWeeksBelowQa === 3
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : a.consecutiveWeeksBelowQa >= 1
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {a.governanceStage}
                    </span>
                    {a.pipDaysRemaining && (
                      <div className="text-[10px] text-rose-300 font-bold mt-0.5">
                        ⏳ {a.pipDaysRemaining} Days Left in 15-Day PIP
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleSimulateWeekEscalation(a.id, 1)}
                        className="px-2 py-1 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[10px] font-bold"
                        title="Simulate 1 Week Below Quality -> Triggers Defect-Based Training"
                      >
                        1W (DBT)
                      </button>
                      <button
                        onClick={() => handleSimulateWeekEscalation(a.id, 3)}
                        className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold"
                        title="Simulate 3 Consecutive Weeks Below Quality -> Triggers BQT"
                      >
                        3W (BQT)
                      </button>
                      <button
                        onClick={() => handleSimulateWeekEscalation(a.id, 4)}
                        className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-bold"
                        title="Simulate 4 Consecutive Weeks Below Quality -> Triggers 15-Day PIP"
                      >
                        4W (15d PIP)
                      </button>
                      <button
                        onClick={() => handleSimulateWeekEscalation(a.id, 0)}
                        className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold"
                        title="Reset to SLA Met"
                      >
                        Reset
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: PROJECT WEEKLY 4 ASSESSMENTS & PROJECT QUESTION BANK LIBRARY */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-indigo-400" />
              Project Weekly 4 Mandatory Assessments & Question Bank Library
            </h3>
            <p className="text-xs text-slate-400">
              Every project assigns 4 weekly assessments to team members: <strong>1. Project Knowledge</strong>, <strong>2. SOP Adherence</strong>, <strong>3. Weekly Process Updates</strong>, and <strong>4. Weekly Errors & Defects</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={currentProject.id}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-semibold"
            >
              {scopedProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.projectName} ({p.specialty})
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowAddQuestion((prev) => !prev)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddQuestion ? 'Close Question Form' : '+ Add Question to Project Bank'}</span>
            </button>
            <button
              onClick={() => {
                const pillars: WeeklyAssessmentPillar[] = [
                  '1. Project Knowledge',
                  '2. SOP Adherence',
                  '3. Weekly Process Updates',
                  '4. Weekly Errors & Defects',
                ];
                const existingForProj = weeklyAssessments.filter(
                  (w) => w.projectId === currentProject.id
                );
                if (existingForProj.length === 0) {
                  const createdFour: ProjectWeeklyAssessment[] = pillars.map((pil, idx) => ({
                    id: `WKA-${currentProject.clientCode}-0${idx + 1}`,
                    projectId: currentProject.id,
                    projectName: currentProject.projectName,
                    weekLabel: 'Week 45 (Nov 2 – Nov 8)',
                    pillar: pil,
                    title: `${currentProject.clientCode} Weekly Assessment ${idx + 1}: ${pil.slice(3)}`,
                    assignedCount: currentProject.headcount,
                    completedCount: Math.round(currentProject.headcount * 0.85),
                    avgScorePct: 89.0,
                    passThresholdPct: 85,
                    questionIds: ['QB-OR-01'],
                  }));
                  setWeeklyAssessments((prev) => [...createdFour, ...prev]);
                } else {
                  setWeeklyAssessments((prev) =>
                    prev.map((w) =>
                      w.projectId === currentProject.id
                        ? { ...w, completedCount: Math.min(w.assignedCount, w.completedCount + 2) }
                        : w
                    )
                  );
                }
                triggerToast(
                  `Assigned all 4 Weekly Assessments (Project Knowledge, SOP, Updates & Weekly Errors) to ${currentProject.headcount} team members in ${currentProject.projectName}!`
                );
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white"
            >
              Assign Weekly 4 Assessments to Team
            </button>
          </div>
        </div>

        {/* Add Question to Project Library Form */}
        {showAddQuestion && (
          <form
            onSubmit={handleAddQuestionBankItem}
            className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-3 text-xs"
          >
            <div className="font-bold text-white">
              Add New Question to {currentProject.projectName} Question Bank Library
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Weekly Assessment Pillar</label>
                <select
                  value={qbPillar}
                  onChange={(e) => setQbPillar(e.target.value as WeeklyAssessmentPillar)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                >
                  <option value="1. Project Knowledge">1. Project Knowledge</option>
                  <option value="2. SOP Adherence">2. SOP Adherence</option>
                  <option value="3. Weekly Process Updates">3. Weekly Process Updates</option>
                  <option value="4. Weekly Errors & Defects">4. Weekly Errors & Defects</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Target RCM Tower</label>
                <select
                  value={qbTower}
                  onChange={(e) => setQbTower(e.target.value as RcmTower)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                >
                  {RCM_TOWERS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Correct Option</label>
                <select
                  value={qbCorrectIdx}
                  onChange={(e) => setQbCorrectIdx(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                >
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                  <option value={3}>Option D</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Question Stem *</label>
              <input
                type="text"
                required
                placeholder="Enter scenario question on SOP, Payer Flash update, or weekly CARC error..."
                value={qbQuestion}
                onChange={(e) => setQbQuestion(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                placeholder="Option A"
                value={qbOptA}
                onChange={(e) => setQbOptA(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
              />
              <input
                type="text"
                placeholder="Option B"
                value={qbOptB}
                onChange={(e) => setQbOptB(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
              />
              <input
                type="text"
                placeholder="Option C"
                value={qbOptC}
                onChange={(e) => setQbOptC(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
              />
              <input
                type="text"
                placeholder="Option D"
                value={qbOptD}
                onChange={(e) => setQbOptD(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                placeholder="SOP Reference / Rationale explanation..."
                value={qbExplanation}
                onChange={(e) => setQbExplanation(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
              >
                Save to Question Bank
              </button>
            </div>
          </form>
        )}

        {/* The 4 Weekly Assessments Cards for Selected Project */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(
            [
              '1. Project Knowledge',
              '2. SOP Adherence',
              '3. Weekly Process Updates',
              '4. Weekly Errors & Defects',
            ] as WeeklyAssessmentPillar[]
          ).map((pil) => {
            const found = projectAssessments.find((a) => a.pillar === pil);
            const assigned = found?.assignedCount || currentProject.headcount;
            const completed = found?.completedCount || Math.round(currentProject.headcount * 0.88);
            const avgScore = found?.avgScorePct || 89.5;
            const pctDone = Math.round((completed / (assigned || 1)) * 100);

            return (
              <div
                key={pil}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3 text-xs"
              >
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                    {pil}
                  </span>
                  <div className="font-bold text-white text-sm">
                    {found?.title || `${currentProject.clientCode} Weekly ${pil.slice(3)} Assessment`}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Assigned: <strong className="text-white">{assigned} FTEs</strong> • Completed:{' '}
                    <strong className="text-emerald-400">{completed} ({pctDone}%)</strong>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Team Avg Score:</span>
                    <strong className="text-emerald-400 tabular-nums">{avgScore}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${pctDone}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Project Question Bank Repository List */}
        <div className="space-y-2.5 pt-2">
          <div className="text-xs font-bold text-slate-300">
            {currentProject.projectName} — Project Question Bank Library ({projectQuestions.length} Validated Questions)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projectQuestions.map((q) => (
              <div
                key={q.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 font-bold">
                    {q.pillar}
                  </span>
                  <span className="font-mono text-slate-400">
                    {q.id} • {q.tower} • Added by {q.addedBy}
                  </span>
                </div>
                <div className="font-semibold text-white">{q.question}</div>
                <div className="text-[11px] text-emerald-400">
                  ✓ Correct Answer: {q.options[q.correctIndex]}
                </div>
                <div className="text-[11px] text-slate-400">{q.explanation}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import {
  ClientSpecificArModule,
  CsTraineeEnrollmentRecord,
  INITIAL_CS_AR_MODULES,
  INITIAL_CS_TRAINEE_ENROLLMENTS,
} from './ClientSpecificTrainingHub';

// ============================================================================
// DEDICATED REPORTS & ANALYTICS GENERATOR PAGE
// (Generate Reports by: 1. Courses, 2. User Groups, 3. Projects, 4. Trainings, 5. Batches, 6. AR CS Training & QCP)
// ============================================================================
interface ReportsCenterProps {
  projects: ProjectHealth[];
  associates: AssociateProfile[];
  userGroups: UserGroup[];
  learningModules: ContinuousLearningModule[];
  complianceCourses: MandatoryComplianceCourse[];
  weeklyAssessments: ProjectWeeklyAssessment[];
  tickets: AutoTriggeredTrainingTicket[];
  uploadBatches: DailyUploadBatch[];
  csModules?: ClientSpecificArModule[];
  csEnrollments?: CsTraineeEnrollmentRecord[];
  triggerToast: (msg: string) => void;
}

export const ReportsCenter: React.FC<ReportsCenterProps> = ({
  projects,
  associates,
  userGroups,
  learningModules,
  complianceCourses,
  weeklyAssessments,
  tickets,
  uploadBatches,
  csModules = INITIAL_CS_AR_MODULES,
  csEnrollments = INITIAL_CS_TRAINEE_ENROLLMENTS,
  triggerToast,
}) => {
  const [reportType, setReportType] = useState<
    'courses' | 'user_groups' | 'projects' | 'trainings' | 'batches' | 'cs_qcp'
  >('cs_qcp');
  const [searchFilter, setSearchFilter] = useState('');

  // Export CSV Generator
  const handleDownloadCsvReport = () => {
    let csvContent = '';
    if (reportType === 'cs_qcp') {
      csvContent =
        'Trainee Name,Emp ID,Intake Pathway,Batch,Project,CS Module Code,Trainer,Practice Days,OJT Prod %,OJT Quality %,OJT Error Summary,QCP-1 3d Avg %,Refresher Day,QCP-2 2d Avg %,QCP Exempted,Current Stage\n' +
        csEnrollments
          .map(
            (e) =>
              `"${e.traineeName}","${e.empId}","${e.intakePathway}","${e.batchCode}","${e.projectName}","${e.csModuleCode}","${e.assignedTrainer}","${e.practiceDaysCompleted}/${e.practiceDaysTarget}",${e.ojtProductionPct},${e.ojtQualityPct},"${e.ojtErrorSummary}",${e.qcp1AveragePct ?? 'N/A'},"${e.refresherDayCompleted ? 'Yes' : 'No'}",${e.qcp2AveragePct ?? 'N/A'},"${e.qcpExempted ? 'Yes' : 'No'}","${e.currentStage}"`
          )
          .join('\n');
    } else if (reportType === 'courses') {
      csvContent =
        'Course ID,Title,Category,Tower/Scope,Pass Threshold %,Assigned Count,Completion %\n' +
        learningModules
          .map(
            (m) =>
              `"${m.id}","${m.title}","${m.category}","${m.tower}",${m.passMarksPct},${m.assignedAssociatesCount},${m.completionRatePct}`
          )
          .join('\n') +
        '\n' +
        complianceCourses
          .map(
            (c) =>
              `"${c.code}","${c.title}","Annual Mandatory Compliance","All Towers",${c.passThresholdPct},299,${c.orgCompletionPct}`
          )
          .join('\n');
    } else if (reportType === 'user_groups') {
      csvContent =
        'Group Code,Cohort Name,Type,Tower Scope,Owner,Members Count,Assigned Courses,Target SLA Gate\n' +
        userGroups
          .map(
            (g) =>
              `"${g.code}","${g.name}","${g.groupType}","${g.towerScope}","${g.owner}",${g.memberIds.length},${g.assignedCourseIds.length},"${g.targetSlaGate}"`
          )
          .join('\n');
    } else if (reportType === 'projects') {
      csvContent =
        'Client Code,Project Name,Specialty,Headcount,Health Score,Prod SLA %,Quality SLA %,Reporting Lead,Ops Manager,Trainer,Training Lead,Auditor,BQT Count,PIP Count\n' +
        projects
          .map(
            (p) =>
              `"${p.clientCode}","${p.projectName}","${p.specialty}",${p.headcount},${p.healthScore},${p.productionSlaPct},${p.qualitySlaPct},"${p.reportingLead}","${p.operationsManager}","${p.ldTrainer}","${p.trainingLead}","${p.assignedAuditor}",${p.bqtCount},${p.pipCount}`
          )
          .join('\n');
    } else if (reportType === 'trainings') {
      csvContent =
        'Ticket ID,Date,Associate,Emp ID,Project,Tower,Consecutive Wks Below QA,Trigger Level,Assigned Trainer,Training Lead,Reporting Lead,Ops Manager,Auditor,Status,Training Summary\n' +
        tickets
          .map(
            (t) =>
              `"${t.id}","${t.triggeredDate}","${t.associateName}","${t.empId}","${t.projectName}","${t.tower}",${t.consecutiveWeeksBelowQa},"${t.triggerLevel}","${t.assignedTrainer}","${t.trainingLead}","${t.reportingLead}","${t.operationsManager}","${t.assignedAuditor}","${t.status}","${t.trainingSummary || 'Pending Closure'}"`
          )
          .join('\n');
    } else {
      csvContent =
        'Batch Code,Associate Name,Emp ID,Project,Tower,Consecutive Wks Below QA,Governance Stage,Trainer,Auditor\n' +
        associates
          .map(
            (a) =>
              `"${a.batchCode}","${a.name}","${a.empId}","${a.projectName}","${a.tower}",${a.consecutiveWeeksBelowQa},"${a.governanceStage}","${a.assignedTrainer}","${a.assignedAuditor}"`
          )
          .join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TrainerSam_Report_${reportType.toUpperCase()}_2026-11-07.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast(
      `Generated and downloaded TrainerSam_Report_${reportType.toUpperCase()}_2026-11-07.csv!`
    );
  };

  return (
    <div className="space-y-6">
      {/* Reports Header & 5 Report Dimension Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
              Enterprise RCM L&D & Governance Reports Center
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Generate, inspect, and export audit-ready reports by <strong>Courses</strong>, <strong>User Groups</strong>, <strong>Projects</strong>, <strong>Auto-Triggered Trainings</strong>, and <strong>Batches</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Filter active report rows..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <button
              onClick={handleDownloadCsvReport}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
            >
              <Download className="w-4 h-4" />
              <span>Export {reportType.replace('_', ' ').toUpperCase()} Report (CSV)</span>
            </button>
          </div>
        </div>

        {/* 6 Report Dimension Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
          {[
            {
              id: 'cs_qcp',
              label: '1. AR CS Training & QCP Report',
              sub: `${csEnrollments.length} Lateral/Post-NHT & ${csModules.length} CS Modules`,
            },
            {
              id: 'trainings',
              label: '2. Report by Trainings (DBT / BQT / 15d PIP)',
              sub: `${tickets.length} Triggered Tickets & Summaries`,
            },
            {
              id: 'projects',
              label: '3. Report by Projects & Hierarchy',
              sub: `${projects.length} Multi-Specialty Projects`,
            },
            {
              id: 'courses',
              label: '4. Report by Courses & Weekly 4 Exams',
              sub: `${learningModules.length + complianceCourses.length + weeklyAssessments.length} Active Courses`,
            },
            {
              id: 'user_groups',
              label: '5. Report by User Groups / Cohorts',
              sub: `${userGroups.length} Active Learning Cohorts`,
            },
            {
              id: 'batches',
              label: '6. Report by Batches (Nesting & ETL)',
              sub: `${associates.length} Batch Trainees & ${uploadBatches.length} ETL Logs`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id as typeof reportType)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                reportType === tab.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-white">{tab.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{tab.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 0. REPORT BY AR CLIENT-SPECIFIC (CS) TRAINING, OJT & QUALITY CERTIFICATION PROCESS (QCP) */}
      {reportType === 'cs_qcp' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Report by AR Client-Specific (CS) Training Activities — Lateral Hires & Post-NHT Graduates (OJT, QCP-1 3d, Refresher, QCP-2 2d & Exemptions)
                </h3>
                <p className="text-xs text-slate-400">
                  Tracks Practice Days, OJT Production & Quality Scores, OJT Error Summaries, QCP Attempt 1 (3-Day 90%), Refresher Day, QCP Attempt 2 (2-Day 90%), and QCP Exemptions
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-950/60">
                    <th className="py-3 px-4">Trainee & Intake Pathway</th>
                    <th className="py-3 px-4">Project & CS Module</th>
                    <th className="py-3 px-4 text-center">Practice Days</th>
                    <th className="py-3 px-4 text-right">OJT Prod / QA</th>
                    <th className="py-3 px-4">OJT Error Summary</th>
                    <th className="py-3 px-4 text-center">QCP-1 (3d Avg)</th>
                    <th className="py-3 px-4 text-center">Refresher & QCP-2 (2d)</th>
                    <th className="py-3 px-4">QCP Status / Exemption</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 tabular-nums">
                  {csEnrollments
                    .filter(
                      (e) =>
                        !searchFilter.trim() ||
                        e.traineeName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        e.projectName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        e.csModuleCode.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        e.intakePathway.toLowerCase().includes(searchFilter.toLowerCase())
                    )
                    .map((e) => (
                      <tr key={e.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">
                            {e.traineeName} ({e.empId})
                          </div>
                          <div className="text-[11px] text-indigo-300">{e.intakePathway}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-200">{e.projectName}</div>
                          <div className="text-[11px] font-mono text-emerald-300">
                            {e.csModuleCode} • Trainer: {e.assignedTrainer}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-slate-200">
                          {e.practiceDaysCompleted}/{e.practiceDaysTarget} Days
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="font-bold text-emerald-400">QA: {e.ojtQualityPct}%</div>
                          <div className="text-[11px] text-sky-300">Prod: {e.ojtProductionPct}%</div>
                        </td>
                        <td className="py-3 px-4 max-w-xs text-slate-300">{e.ojtErrorSummary}</td>
                        <td className="py-3 px-4 text-center">
                          {e.qcpExempted ? (
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                              Exempted
                            </span>
                          ) : e.qcp1AveragePct !== null ? (
                            <div>
                              <span
                                className={`px-2 py-0.5 rounded font-bold ${
                                  e.qcp1AveragePct >= 90
                                    ? 'bg-emerald-500/15 text-emerald-300'
                                    : 'bg-rose-500/15 text-rose-300'
                                }`}
                              >
                                {e.qcp1AveragePct}%
                              </span>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                ({e.qcp1Day1Pct}/{e.qcp1Day2Pct}/{e.qcp1Day3Pct})
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-500">Pending</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {e.refresherDayRequired ? (
                            <div>
                              <div className="text-[10px] text-amber-300 font-semibold">
                                ✓ 1-Day Refresher
                              </div>
                              {e.qcp2AveragePct !== null && (
                                <div className="font-bold text-emerald-300 mt-0.5">
                                  QCP-2: {e.qcp2AveragePct}% ({e.qcp2Day1Pct}/{e.qcp2Day2Pct})
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold">
                            {e.currentStage}
                          </span>
                          {e.qcpExemptionReason && (
                            <div className="text-[10px] text-purple-300 mt-1">
                              {e.qcpExemptionReason}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 1. REPORT BY TRAININGS (AUTO-TRIGGERED DBT, BQT & 15-DAY PIP CLOSURE LOG) */}
      {reportType === 'trainings' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              Report by Trainings — Consecutive-Week Quality Triggers (DBT, BQT & 15-Day PIP) & Trainer Closure Summaries
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-950/60">
                  <th className="py-3 px-4">Ticket & Date</th>
                  <th className="py-3 px-4">Associate & Project</th>
                  <th className="py-3 px-4">Consecutive Wks & Trigger</th>
                  <th className="py-3 px-4">Trainer / Lead / Manager / Auditor</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Trainer Closure Summary & Post-Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {tickets
                  .filter(
                    (t) =>
                      !searchFilter.trim() ||
                      t.associateName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                      t.projectName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                      t.assignedTrainer.toLowerCase().includes(searchFilter.toLowerCase())
                  )
                  .map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-indigo-300">{t.id}</div>
                        <div className="text-[11px] text-slate-400">{t.triggeredDate}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">
                          {t.associateName} ({t.empId})
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {t.projectName} • {t.tower}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-amber-300">{t.triggerLevel}</div>
                        <div className="text-[11px] text-slate-400">
                          {t.consecutiveWeeksBelowQa} Wk(s) Below QA ({t.qualityActualPct}% vs{' '}
                          {t.qualityTargetPct}%)
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[11px]">
                        <div className="text-emerald-300">
                          Trainer: <strong>{t.assignedTrainer}</strong> (T-Lead: {t.trainingLead})
                        </div>
                        <div className="text-slate-400">
                          Lead: {t.reportingLead} • Mgr: {t.operationsManager} • QA:{' '}
                          {t.assignedAuditor}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            t.status === 'Closed — Summary Logged'
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        {t.trainingSummary ? (
                          <div>
                            <div className="text-slate-200">{t.trainingSummary}</div>
                            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                              Post-Training Quiz: {t.postTrainingQuizScore}% • Closed {t.closedAt}
                            </div>
                          </div>
                        ) : (
                          <span className="text-amber-300/80 italic">
                            Pending Trainer Coaching & Mandatory Summary Closure
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. REPORT BY PROJECTS */}
      {reportType === 'projects' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">
              Report by Projects — Health Score, SLA Attainment & Complete 6-Role Leadership Mapping
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-950/60">
                  <th className="py-3 px-4">Project & Specialty</th>
                  <th className="py-3 px-4">Reporting Lead & Ops Manager</th>
                  <th className="py-3 px-4">Trainer, Training Lead & Auditor</th>
                  <th className="py-3 px-4 text-right">Health Score</th>
                  <th className="py-3 px-4 text-right">Prod SLA %</th>
                  <th className="py-3 px-4 text-right">Quality SLA %</th>
                  <th className="py-3 px-4 text-center">BQT / 15d PIP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 tabular-nums">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{p.projectName}</div>
                      <div className="text-[11px] text-indigo-300">
                        {p.clientCode} • {p.specialty} ({p.headcount} FTEs)
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-200">Lead: <strong>{p.reportingLead}</strong></div>
                      <div className="text-[11px] text-slate-400">Mgr: {p.operationsManager}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-emerald-300">Trainer: <strong>{p.ldTrainer}</strong></div>
                      <div className="text-[11px] text-slate-400">
                        T-Lead: {p.trainingLead} • Auditor: {p.assignedAuditor}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-white">{p.healthScore}%</td>
                    <td className="py-3 px-4 text-right text-sky-300">{p.productionSlaPct}%</td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-400">
                      {p.qualitySlaPct}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-amber-300 font-semibold">{p.bqtCount} BQT</span> /{' '}
                      <span className="text-rose-400 font-semibold">{p.pipCount} PIP</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. REPORT BY COURSES & WEEKLY 4 ASSESSMENTS */}
      {reportType === 'courses' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">
              Report by Courses — Defect Modules, Project Weekly 4 Assessments & Annual HIPAA/POSH Compliance
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-950/60">
                  <th className="py-3 px-4">Code & Course / Assessment Title</th>
                  <th className="py-3 px-4">Course Type / Pillar</th>
                  <th className="py-3 px-4">Project / Tower Scope</th>
                  <th className="py-3 px-4 text-right">Pass Gate</th>
                  <th className="py-3 px-4 text-right">Assigned</th>
                  <th className="py-3 px-4 text-right">Completion / Avg %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 tabular-nums">
                {weeklyAssessments.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{w.title}</div>
                      <div className="text-[11px] font-mono text-indigo-300">
                        {w.id} • {w.weekLabel}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sky-300 font-semibold">
                      Weekly Assessment ({w.pillar})
                    </td>
                    <td className="py-3 px-4 text-slate-300">{w.projectName}</td>
                    <td className="py-3 px-4 text-right">{w.passThresholdPct}%</td>
                    <td className="py-3 px-4 text-right">{w.assignedCount}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400">
                      {Math.round((w.completedCount / w.assignedCount) * 100)}% (Avg {w.avgScorePct}%)
                    </td>
                  </tr>
                ))}
                {learningModules.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{m.title}</div>
                      <div className="text-[11px] font-mono text-indigo-300">{m.id}</div>
                    </td>
                    <td className="py-3 px-4 text-indigo-300">{m.category}</td>
                    <td className="py-3 px-4 text-slate-300">
                      {m.tower} ({m.specialty})
                    </td>
                    <td className="py-3 px-4 text-right">{m.passMarksPct}%</td>
                    <td className="py-3 px-4 text-right">{m.assignedAssociatesCount}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400">
                      {m.completionRatePct}%
                    </td>
                  </tr>
                ))}
                {complianceCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{c.title}</div>
                      <div className="text-[11px] font-mono text-emerald-300">{c.code}</div>
                    </td>
                    <td className="py-3 px-4 text-emerald-300">Annual Mandatory Compliance</td>
                    <td className="py-3 px-4 text-slate-300">All Projects & Specialties</td>
                    <td className="py-3 px-4 text-right">{c.passThresholdPct}%</td>
                    <td className="py-3 px-4 text-right">299</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400">
                      {c.orgCompletionPct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. REPORT BY USER GROUPS */}
      {reportType === 'user_groups' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">
              Report by User Groups — Cohort Performance, Assigned Courses & Graduation SLA Gates
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-950/60">
                  <th className="py-3 px-4">Cohort Code & Name</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Governance Owner</th>
                  <th className="py-3 px-4 text-right">Members</th>
                  <th className="py-3 px-4 text-right">Assigned Courses</th>
                  <th className="py-3 px-4">Target SLA Graduation Gate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {userGroups.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{g.name}</div>
                      <div className="text-[11px] font-mono text-indigo-300">{g.code}</div>
                    </td>
                    <td className="py-3 px-4 text-emerald-300">{g.groupType}</td>
                    <td className="py-3 px-4 text-slate-300">{g.owner}</td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-white">
                      {g.memberIds.length}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-indigo-300 font-semibold">
                      {g.assignedCourseIds.length} Modules
                    </td>
                    <td className="py-3 px-4 text-amber-300">{g.targetSlaGate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. REPORT BY BATCHES (ONBOARDING/TRAINING BATCHES & DAILY UPLOAD BATCHES) */}
      {reportType === 'batches' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                Report by Training & Onboarding Batches (Associate Batch Performance & Hierarchy Mapping)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-950/60">
                    <th className="py-3 px-4">Batch Code</th>
                    <th className="py-3 px-4">Associate & Emp ID</th>
                    <th className="py-3 px-4">Project & Tower</th>
                    <th className="py-3 px-4">Trainer / Lead / Manager / Auditor</th>
                    <th className="py-3 px-4 text-right">Prod SLA %</th>
                    <th className="py-3 px-4 text-right">Quality SLA %</th>
                    <th className="py-3 px-4">Current Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 tabular-nums">
                  {associates.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-300">
                        {a.batchCode}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {a.name} ({a.empId})
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {a.projectName} • {a.tower}
                      </td>
                      <td className="py-3 px-4 text-[11px]">
                        <span className="text-emerald-300">Trainer: {a.assignedTrainer}</span> • Lead:{' '}
                        {a.reportingLead} • Mgr: {a.operationsManager} • QA: {a.assignedAuditor}
                      </td>
                      <td className="py-3 px-4 text-right text-sky-300">{a.productionSlaPct}%</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400">
                        {a.qualityActualPct}%
                      </td>
                      <td className="py-3 px-4 text-slate-200">{a.governanceStage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                Report by Daily Data Upload Batches (PMS Production, QMS Quality & TMS Attendance)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-950/60">
                    <th className="py-3 px-4">Batch ID & Timestamp</th>
                    <th className="py-3 px-4">Source System</th>
                    <th className="py-3 px-4">File Name</th>
                    <th className="py-3 px-4 text-right">Rows Synced</th>
                    <th className="py-3 px-4 text-right">SLA Breaches</th>
                    <th className="py-3 px-4 text-right">Auto-Trainings</th>
                    <th className="py-3 px-4 text-right">BQT/PIP Flags</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 tabular-nums">
                  {uploadBatches.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-bold text-white">
                        {b.id} <span className="text-[11px] text-slate-400">({b.uploadedAt})</span>
                      </td>
                      <td className="py-3 px-4 text-indigo-300">{b.sourceSystem}</td>
                      <td className="py-3 px-4 font-mono text-slate-300">{b.fileName}</td>
                      <td className="py-3 px-4 text-right">{b.rowsImported}</td>
                      <td className="py-3 px-4 text-right text-amber-300 font-semibold">
                        {b.slaBreachesDetected}
                      </td>
                      <td className="py-3 px-4 text-right text-indigo-300 font-semibold">
                        +{b.autoTrainingsAssigned}
                      </td>
                      <td className="py-3 px-4 text-right text-rose-400 font-semibold">
                        {b.bqtPipFlagsRaised}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
