import React, { useState, useMemo, useRef } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Bot,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Download,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Filter,
  Flame,
  FolderKanban,
  FolderOpen,
  Gamepad2,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Play,
  Plus,
  RefreshCw,
  Scale,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  UsersRound,
  AlertTriangle,
  X,
} from 'lucide-react';
import {
  AssociateProfile,
  AuditDefectRecord,
  AutoTriggeredTrainingTicket,
  CalibrationSession,
  ContinuousLearningModule,
  DailyUploadBatch,
  GovernanceStage,
  MandatoryComplianceCourse,
  ProjectHealth,
  ProjectQuestionBankItem,
  ProjectWeeklyAssessment,
  ProviderSpecialty,
  RcmTower,
  RebuttalStatus,
  SopPlaybookItem,
  UserGroup,
  UserRole,
} from './types/rcm';
import {
  INITIAL_ASSOCIATES,
  INITIAL_AUTO_TRIGGERED_TICKETS,
  INITIAL_CALIBRATIONS,
  INITIAL_COMPLIANCE_COURSES,
  INITIAL_DEFECTS,
  INITIAL_LEARNING_MODULES,
  INITIAL_PROJECT_QUESTION_BANK,
  INITIAL_PROJECTS,
  INITIAL_SOPS,
  INITIAL_UPLOAD_BATCHES,
  INITIAL_USER_GROUPS,
  INITIAL_WEEKLY_ASSESSMENTS,
  PROVIDER_SPECIALTIES,
  RCM_TOWERS,
} from './data/mockRcmData';
import {
  AiChatMessage,
  generateTrainerSamResponse,
  QUICK_AI_PROMPTS,
} from './utils/rcmAiAssistant';
import { ClarityOverview, OverviewDestination } from './components/ClarityOverview';
import { AdminOverview, RoleDestination, TrainerOverview } from './components/RoleOverviews';
import {
  DIMENSION_LABELS,
  PROFILE_DIMENSIONS,
  PROFILE_LABELS,
  PROFILE_PROCESS_TABS,
  defaultTabForDimension,
  isDimensionAllowed,
  isTabAllowed,
  profileForPersona,
} from './utils/roleAccess';
import { AdminGovernanceStudio } from './components/AdminGovernanceStudio';
import { AssociateWorkspace } from './components/AssociateWorkspace';
import { TrainerWorkbench, ReportsCenter } from './components/TrainerAndReportsHub';
import {
  ContinuousLearningDashboard,
  TrainingModulesCatalogPage,
} from './components/ContinuousLearningAndModulesHub';
import {
  ClientSpecificArModule,
  ClientSpecificTrainingHub,
  CsTraineeEnrollmentRecord,
  INITIAL_CS_AR_MODULES,
  INITIAL_CS_TRAINEE_ENROLLMENTS,
} from './components/ClientSpecificTrainingHub';
import {
  AppDimensionId,
  CuriosityBrandLogo,
  EnterprisePersona,
  INITIAL_NHT_BATCHES,
  INITIAL_TALENT_UPSKILL_COURSES,
  LearningHubAndGamesArena,
  NhtBatchRecord,
  NhtTrainingDimensionHub,
  OrgLearningDimensionHub,
  ProjectDirectoriesFolderExplorer,
  RelationalContextBar,
  TalentUpskillCourse,
  VisualDimensionSwitcher,
  VisualRadialGauge,
} from './components/FiveDimensionsCommandCenter';

type ActiveTab =
  | 'overview'
  | 'org_learning'
  | 'dashboard'
  | 'project_directories'
  | 'nht_training'
  | 'cs_training'
  | 'games_hub'
  | 'clp_dashboard'
  | 'training_modules'
  | 'admin_studio'
  | 'trainer_hub'
  | 'reports'
  | 'associate_portal'
  | 'upload'
  | 'scorecards'
  | 'quality'
  | 'learning'
  | 'compliance'
  | 'knowledge';

export function App() {
  // Global 5-Dimension & Role State
  const [activeDimension, setActiveDimension] = useState<AppDimensionId>('dim_process_intell');
  const [activePersona, setActivePersona] = useState<EnterprisePersona>('admin');
  const [role, setRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [adminSubTab, setAdminSubTab] = useState<'projects' | 'users' | 'courses' | 'groups'>('projects');
  const [focusedProjectId, setFocusedProjectId] = useState<string>('PRJ-CARD-01');
  const [focusedGroupId, setFocusedGroupId] = useState<string>('GRP-ORTHO-AR');
  const [focusedUserId, setFocusedUserId] = useState<string>('ASSOC-101');
  const [selectedTower, setSelectedTower] = useState<RcmTower | 'All Towers'>('All Towers');
  const [selectedSpecialty, setSelectedSpecialty] = useState<ProviderSpecialty | 'All Specialties'>('All Specialties');

  // Core Data State
  const [projects, setProjects] = useState<ProjectHealth[]>(INITIAL_PROJECTS);
  const [associates, setAssociates] = useState<AssociateProfile[]>(INITIAL_ASSOCIATES);
  const [userGroups, setUserGroups] = useState<UserGroup[]>(INITIAL_USER_GROUPS);
  const [defects, setDefects] = useState<AuditDefectRecord[]>(INITIAL_DEFECTS);
  const [calibrations, setCalibrations] = useState<CalibrationSession[]>(INITIAL_CALIBRATIONS);
  const [learningModules, setLearningModules] = useState<ContinuousLearningModule[]>(INITIAL_LEARNING_MODULES);
  const [complianceCourses, setComplianceCourses] = useState<MandatoryComplianceCourse[]>(INITIAL_COMPLIANCE_COURSES);
  const [sops, setSops] = useState<SopPlaybookItem[]>(INITIAL_SOPS);
  const [uploadBatches, setUploadBatches] = useState<DailyUploadBatch[]>(INITIAL_UPLOAD_BATCHES);
  const [tickets, setTickets] = useState<AutoTriggeredTrainingTicket[]>(INITIAL_AUTO_TRIGGERED_TICKETS);
  const [weeklyAssessments, setWeeklyAssessments] = useState<ProjectWeeklyAssessment[]>(INITIAL_WEEKLY_ASSESSMENTS);
  const [questionBank, setQuestionBank] = useState<ProjectQuestionBankItem[]>(INITIAL_PROJECT_QUESTION_BANK);
  const [csModules, setCsModules] = useState<ClientSpecificArModule[]>(INITIAL_CS_AR_MODULES);
  const [csEnrollments, setCsEnrollments] = useState<CsTraineeEnrollmentRecord[]>(
    INITIAL_CS_TRAINEE_ENROLLMENTS
  );
  const [upskillCourses, setUpskillCourses] = useState<TalentUpskillCourse[]>(
    INITIAL_TALENT_UPSKILL_COURSES
  );
  const [nhtBatches, setNhtBatches] = useState<NhtBatchRecord[]>(INITIAL_NHT_BATCHES);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const profile = profileForPersona(activePersona);
  const canOpenAdminStudio = isTabAllowed(profile, 'admin_studio');

  const handleSelectDimension = (dim: AppDimensionId) => {
    if (!isDimensionAllowed(profile, dim)) {
      triggerToast(`${DIMENSION_LABELS[dim]} is not part of the ${PROFILE_LABELS[profile]} sample profile view.`);
      return;
    }
    setActiveDimension(dim);
    setActiveTab(defaultTabForDimension(profile, dim) as ActiveTab);
  };

  const openOverview = () => setActiveTab('overview');
  const handleOverviewNavigate = (destination: OverviewDestination | RoleDestination) => {
    if (!isTabAllowed(profile, destination)) return;
    setActiveDimension(destination === 'nht_training' ? 'dim_nht_training' : 'dim_process_intell');
    setActiveTab(destination);
  };

  const handleSelectPersona = (persona: EnterprisePersona) => {
    setActivePersona(persona);
    // Reset selections the new sample profile does not show.
    const nextProfile = profileForPersona(persona);
    if (!isTabAllowed(nextProfile, activeTab) || !isDimensionAllowed(nextProfile, activeDimension)) {
      setActiveTab('overview');
      if (!isDimensionAllowed(nextProfile, activeDimension)) setActiveDimension('dim_process_intell');
    }
    if (persona === 'admin' || persona === 'operations') {
      setRole('admin');
    } else if (persona === 'trainer') {
      setRole('qa_trainer');
    } else {
      setRole('associate');
    }
    triggerToast(`Switched Active Role Lens to ${persona.toUpperCase()}. Relational data context synchronized across all 5 dimensions.`);
  };

  // Helper to jump directly to L&D Admin Studio sub-views (Project Profile, User Profile, Courses, Groups)
  const openAdminStudio = (
    sub: 'projects' | 'users' | 'courses' | 'groups',
    projId?: string,
    usrId?: string
  ) => {
    if (!isTabAllowed(profile, 'admin_studio')) {
      triggerToast(`Admin Studio is not part of the ${PROFILE_LABELS[profile]} sample profile view.`);
      return;
    }
    setAdminSubTab(sub);
    if (projId) setFocusedProjectId(projId);
    if (usrId) setFocusedUserId(usrId);
    setActiveDimension('dim_process_intell');
    setActiveTab('admin_studio');
  };

  // Tab 2: Daily Upload & Live Entry State
  const [uploadSource, setUploadSource] = useState<'Production Tracker (PMS/EHR)' | 'QMS Audit Engine' | 'TMS Workforce & Shrinkage'>('Production Tracker (PMS/EHR)');
  const [manualAssocId, setManualAssocId] = useState<string>('ASSOC-101');
  const [manualDailyActual, setManualDailyActual] = useState<number>(46);
  const [manualQualityPct, setManualQualityPct] = useState<number>(91.0);
  const [manualTmsHours, setManualTmsHours] = useState<number>(7.5);
  const [manualAht, setManualAht] = useState<number>(9.5);

  // Tab 3: Scorecard Inspector State
  const [selectedAssocId, setSelectedAssocId] = useState<string>('ASSOC-101');
  const [stageFilter, setStageFilter] = useState<GovernanceStage | 'All Stages'>('All Stages');

  // Tab 4: Quality Rebuttal & New Audit Defect State
  const [rebuttalDrafts, setRebuttalDrafts] = useState<Record<string, string>>({});
  const [qaNotesDraft, setQaNotesDraft] = useState<Record<string, string>>({});
  const [showNewDefectForm, setShowNewDefectForm] = useState(false);
  const [newDefectAssocId, setNewDefectAssocId] = useState('ASSOC-103');
  const [newDefectClaimId, setNewDefectClaimId] = useState('CLM-992811-OR');
  const [newDefectPayer, setNewDefectPayer] = useState('UnitedHealthcare');
  const [newDefectCode, setNewDefectCode] = useState('CO-197 / Prior Auth Missing');
  const [newDefectSeverity, setNewDefectSeverity] = useState<'Critical (Fatal)' | 'Major' | 'Minor'>('Major');
  const [newDefectFinding, setNewDefectFinding] = useState('');

  // Tab 5 & 6: Interactive Quiz & Certificate Dialog State
  const [activeQuizModule, setActiveQuizModule] = useState<ContinuousLearningModule | null>(null);
  const [activeComplianceQuiz, setActiveComplianceQuiz] = useState<MandatoryComplianceCourse | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [certificateCourse, setCertificateCourse] = useState<MandatoryComplianceCourse | null>(null);

  // Native <dialog> refs
  const quizDialogRef = useRef<HTMLDialogElement>(null);
  const certDialogRef = useRef<HTMLDialogElement>(null);

  // Tab 7: SOP Search & AI Assistant State
  const [sopSearch, setSopSearch] = useState('');
  const [selectedSop, setSelectedSop] = useState<SopPlaybookItem>(INITIAL_SOPS[0]);
  const [aiMessages, setAiMessages] = useState<AiChatMessage[]>([
    {
      id: 'AI-WELCOME',
      sender: 'assistant',
      timestamp: '09:15 IST',
      text: 'Hello! I am **Curiosity AI**, the Curiosity — L&D Intelligence System co-pilot for medical billing RCM teams. Ask me about **CARC/RARC denial codes**, **Specialty Modifiers (-25, -59/XS, -PT/-33)**, **Payer Playbooks**, **BQT/PIP SLA rules**, or **Annual HIPAA & POSH Compliance**.',
      citations: ['SOP-OR-12 v3.4', 'SOP-CV-08 v2.1', 'COMP-HIPAA-2026'],
    },
  ]);
  const [aiInput, setAiInput] = useState('');

  // Filtered Datasets based on Global Tower & Specialty Filters
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSpec = selectedSpecialty === 'All Specialties' || p.specialty === selectedSpecialty;
      const matchTower = selectedTower === 'All Towers' || p.towers.includes(selectedTower);
      return matchSpec && matchTower;
    });
  }, [projects, selectedSpecialty, selectedTower]);

  const filteredAssociates = useMemo(() => {
    return associates.filter((a) => {
      const matchSpec = selectedSpecialty === 'All Specialties' || a.specialty === selectedSpecialty;
      const matchTower = selectedTower === 'All Towers' || a.tower === selectedTower;
      const matchStage = stageFilter === 'All Stages' || a.governanceStage === stageFilter;
      return matchSpec && matchTower && matchStage;
    });
  }, [associates, selectedSpecialty, selectedTower, stageFilter]);

  const filteredDefects = useMemo(() => {
    return defects.filter((d) => {
      const matchSpec = selectedSpecialty === 'All Specialties' || d.specialty === selectedSpecialty;
      const matchTower = selectedTower === 'All Towers' || d.tower === selectedTower;
      const matchRole = role === 'associate' ? d.associateId === 'ASSOC-101' : true;
      return matchSpec && matchTower && matchRole;
    });
  }, [defects, selectedSpecialty, selectedTower, role]);

  const filteredSops = useMemo(() => {
    return sops.filter((s) => {
      const matchSpec = selectedSpecialty === 'All Specialties' || s.specialty === selectedSpecialty;
      const matchTower = selectedTower === 'All Towers' || s.tower === selectedTower;
      const matchQuery =
        !sopSearch.trim() ||
        s.title.toLowerCase().includes(sopSearch.toLowerCase()) ||
        s.docCode.toLowerCase().includes(sopSearch.toLowerCase()) ||
        s.relatedCarcRarcCodes.some((c) => c.toLowerCase().includes(sopSearch.toLowerCase()));
      return matchSpec && matchTower && matchQuery;
    });
  }, [sops, selectedSpecialty, selectedTower, sopSearch]);

  // Aggregate KPIs
  const orgSummary = useMemo(() => {
    const avgHealth =
      filteredProjects.reduce((acc, p) => acc + p.healthScore, 0) / (filteredProjects.length || 1);
    const avgProd =
      filteredProjects.reduce((acc, p) => acc + p.productionSlaPct, 0) / (filteredProjects.length || 1);
    const avgQual =
      filteredProjects.reduce((acc, p) => acc + p.qualitySlaPct, 0) / (filteredProjects.length || 1);
    const totalBqt = filteredProjects.reduce((acc, p) => acc + p.bqtCount, 0);
    const totalPip = filteredProjects.reduce((acc, p) => acc + p.pipCount, 0);
    const pendingRebuttals = defects.filter((d) => d.rebuttalStatus === 'Rebuttal Pending').length;
    const avgCompliance =
      complianceCourses.reduce((acc, c) => acc + c.orgCompletionPct, 0) / complianceCourses.length;
    return {
      avgHealth: avgHealth.toFixed(1),
      avgProd: avgProd.toFixed(1),
      avgQual: avgQual.toFixed(1),
      totalBqt,
      totalPip,
      pendingRebuttals,
      avgCompliance: avgCompliance.toFixed(1),
    };
  }, [filteredProjects, defects, complianceCourses]);

  const selectedAssociate = useMemo(() => {
    return associates.find((a) => a.id === selectedAssocId) || associates[0];
  }, [associates, selectedAssocId]);

  // Handlers
  const handleSimulateBatchUpload = (fileName?: string) => {
    const newBatch: DailyUploadBatch = {
      id: `BATCH-${Date.now().toString().slice(-6)}`,
      uploadedAt: '2026-11-07 09:35 IST (Just Now)',
      sourceSystem: uploadSource,
      fileName: fileName || `RCM_${uploadSource.split(' ')[0]}_2026-11-07.csv`,
      projectScope:
        selectedSpecialty === 'All Specialties'
          ? 'All 6 Provider Specialties'
          : selectedSpecialty,
      rowsImported: 148,
      slaBreachesDetected: 7,
      autoTrainingsAssigned: 7,
      bqtPipFlagsRaised: 2,
      uploadedBy: role === 'admin' ? 'Samrat Bose (L&D Admin)' : 'Deepa Madhavan (QA Lead)',
      status: 'Synced & Governed',
    };
    setUploadBatches((prev) => [newBatch, ...prev]);
    triggerToast(
      `Uploaded ${newBatch.fileName}: 148 rows synced, 7 defect-based weekly modules auto-assigned, 2 BQT flags updated.`
    );
  };

  const handleManualDailySync = (e: React.FormEvent) => {
    e.preventDefault();
    setAssociates((prev) =>
      prev.map((a) => {
        if (a.id !== manualAssocId) return a;
        const prodPct = Number(((manualDailyActual / a.dailyTarget) * 100).toFixed(1));
        const tmsPct = Number(((manualTmsHours / a.tmsTargetHours) * 100).toFixed(1));
        const cappedProd = Math.min(prodPct, 110);
        const composite = Number(
          (
            manualQualityPct * 0.4 +
            cappedProd * 0.35 +
            a.pktScore * 0.15 +
            tmsPct * 0.1
          ).toFixed(1)
        );

        let newStage: GovernanceStage = a.governanceStage;
        const updatedModules = [...a.assignedWeeklyModules];
        const belowQa = manualQualityPct < a.qualityTargetPct;
        const nextConsecutiveWeeks = belowQa ? Math.min(4, a.consecutiveWeeksBelowQa + 1) : 0;

        if (nextConsecutiveWeeks >= 4 || manualQualityPct < 86) {
          newStage = 'PIP - 15 Days (4 Consecutive Wks Below QA)';
          if (!updatedModules.includes('MOD-PIP-105')) updatedModules.push('MOD-PIP-105');
        } else if (nextConsecutiveWeeks === 3) {
          newStage = 'BQT (3 Consecutive Wks Below QA)';
          if (!updatedModules.includes('MOD-BQT-102')) updatedModules.push('MOD-BQT-102');
        } else if (nextConsecutiveWeeks >= 1) {
          newStage = 'Defect-Based Training (1-2 Wks Below QA)';
          if (!updatedModules.includes('MOD-WK-101')) updatedModules.push('MOD-WK-101');
        } else if (manualQualityPct >= 98.5 && prodPct >= 102) {
          newStage = 'Top Quartile (Q1)';
        } else {
          newStage = 'Core Performer (Q2-Q3)';
        }

        return {
          ...a,
          dailyActual: manualDailyActual,
          productionSlaPct: prodPct,
          qualityActualPct: manualQualityPct,
          tmsBillableHours: manualTmsHours,
          tmsUtilizationPct: tmsPct,
          ahtMinutes: manualAht,
          compositeScore: composite,
          governanceStage: newStage,
          consecutiveWeeksBelowQa: nextConsecutiveWeeks,
          pipDaysRemaining: nextConsecutiveWeeks >= 4 ? 15 : undefined,
          assignedWeeklyModules: updatedModules,
        };
      })
    );
    triggerToast(
      `Synced Daily Production, Quality & TMS for associate. Scorecard & BQT/PIP governance automatically recalculated!`
    );
  };

  const handleRaiseRebuttal = (defectId: string) => {
    const draft = rebuttalDrafts[defectId]?.trim();
    if (!draft) {
      triggerToast('Please enter a clinical/SOP justification before submitting a rebuttal.');
      return;
    }
    setDefects((prev) =>
      prev.map((d) =>
        d.id === defectId
          ? {
              ...d,
              rebuttalStatus: 'Rebuttal Pending',
              associateRebuttalReason: draft,
            }
          : d
      )
    );
    triggerToast(`Rebuttal submitted for Audit ${defectId}. Routed to QA Lead for adjudication.`);
  };

  const handleResolveRebuttal = (defectId: string, resolution: RebuttalStatus) => {
    const targetDefect = defects.find((d) => d.id === defectId);
    const note =
      qaNotesDraft[defectId]?.trim() ||
      (resolution === 'Rebuttal Accepted'
        ? 'Verified against Client Playbook Flash Update; audit error overturned and Quality SLA restored.'
        : resolution === 'Escalated to Calibration'
        ? 'Escalated to weekly QA + Ops + L&D Calibration table for SOP standardization.'
        : 'Rebuttal declined per standard QA rubric; assigned weekly defect refresher.');

    setDefects((prev) =>
      prev.map((d) =>
        d.id === defectId
          ? {
              ...d,
              rebuttalStatus: resolution,
              qaResolutionComment: note,
            }
          : d
      )
    );

    if (resolution === 'Rebuttal Accepted' && targetDefect) {
      setAssociates((prev) =>
        prev.map((a) =>
          a.id === targetDefect.associateId
            ? {
                ...a,
                qualityActualPct: Math.min(100, Number((a.qualityActualPct + 1.8).toFixed(1))),
              }
            : a
        )
      );
    }

    triggerToast(`Audit ${defectId} marked as "${resolution}". Associate scorecard updated.`);
  };

  const handleCreateNewDefect = (e: React.FormEvent) => {
    e.preventDefault();
    const assoc = associates.find((a) => a.id === newDefectAssocId) || associates[0];
    const impact =
      newDefectSeverity === 'Critical (Fatal)' ? 15 : newDefectSeverity === 'Major' ? 6 : 3;

    const newRecord: AuditDefectRecord = {
      id: `AUD-${Math.floor(9050 + Math.random() * 900)}`,
      claimId: newDefectClaimId || 'CLM-882910-OR',
      auditDate: '2026-11-07',
      associateId: assoc.id,
      associateName: assoc.name,
      projectName: assoc.projectName,
      tower: assoc.tower,
      specialty: assoc.specialty,
      payer: newDefectPayer,
      errorCode: newDefectCode,
      errorCategory: newDefectCode,
      severity: newDefectSeverity,
      scoreImpact: impact,
      auditorName: 'Deepa Madhavan (QA Lead)',
      auditFinding:
        newDefectFinding.trim() ||
        `Audit defect identified on ${newDefectClaimId} under ${newDefectCode}. Auto-assigned targeted weekly refresher.`,
      rebuttalStatus: 'No Rebuttal',
      autoAssignedTrainingId: 'MOD-WK-101',
      autoAssignedTrainingTitle: 'CO-197 Evicore Ortho Prior Auth & Retro-Appeal Protocol',
    };

    setDefects((prev) => [newRecord, ...prev]);
    setAssociates((prev) =>
      prev.map((a) => {
        if (a.id !== assoc.id) return a;
        const newQual = Math.max(70, Number((a.qualityActualPct - impact * 0.25).toFixed(1)));
        const belowQa = newQual < a.qualityTargetPct;
        const nextWks = belowQa ? Math.max(1, a.consecutiveWeeksBelowQa) : 0;
        return {
          ...a,
          qualityActualPct: newQual,
          criticalErrors:
            newDefectSeverity === 'Critical (Fatal)' ? a.criticalErrors + 1 : a.criticalErrors,
          consecutiveWeeksBelowQa: nextWks,
          governanceStage:
            nextWks >= 4 || newQual < 85
              ? 'PIP - 15 Days (4 Consecutive Wks Below QA)'
              : nextWks === 3
              ? 'BQT (3 Consecutive Wks Below QA)'
              : belowQa
              ? 'Defect-Based Training (1-2 Wks Below QA)'
              : a.governanceStage,
        };
      })
    );

    setShowNewDefectForm(false);
    setNewDefectFinding('');
    triggerToast(
      `QA Defect logged for ${assoc.name}. Defect-based weekly module auto-assigned & Quality SLA recalculated.`
    );
  };

  const openModuleQuiz = (mod: ContinuousLearningModule) => {
    setActiveQuizModule(mod);
    setActiveComplianceQuiz(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    quizDialogRef.current?.showModal();
  };

  const openComplianceQuiz = (course: MandatoryComplianceCourse) => {
    setActiveComplianceQuiz(course);
    setActiveQuizModule(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    quizDialogRef.current?.showModal();
  };

  const closeQuizDialog = () => {
    quizDialogRef.current?.close();
    setActiveQuizModule(null);
    setActiveComplianceQuiz(null);
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    if (activeComplianceQuiz) {
      const total = activeComplianceQuiz.questions.length;
      const correct = activeComplianceQuiz.questions.filter(
        (q) => quizAnswers[q.id] === q.correctIndex
      ).length;
      const pct = Math.round((correct / (total || 1)) * 100);
      if (pct >= activeComplianceQuiz.passThresholdPct) {
        const certId = `CERT-${activeComplianceQuiz.code}-4082`;
        setComplianceCourses((prev) =>
          prev.map((c) =>
            c.id === activeComplianceQuiz.id
              ? {
                  ...c,
                  associateStatus: 'Completed & Certified',
                  associateScore: pct,
                  completedDate: '2026-11-07',
                  certificateId: certId,
                  orgCompletionPct: Math.min(100, Number((c.orgCompletionPct + 1.2).toFixed(1))),
                }
              : c
          )
        );
        triggerToast(
          `Congratulations! Passed ${activeComplianceQuiz.code} with ${pct}%. Certificate ${certId} issued!`
        );
      }
    } else if (activeQuizModule) {
      const total = activeQuizModule.questions.length;
      const correct = activeQuizModule.questions.filter(
        (q) => quizAnswers[q.id] === q.correctIndex
      ).length;
      const pct = Math.round((correct / (total || 1)) * 100);
      if (pct >= activeQuizModule.passMarksPct) {
        setLearningModules((prev) =>
          prev.map((m) =>
            m.id === activeQuizModule.id
              ? { ...m, completionRatePct: Math.min(100, m.completionRatePct + 4) }
              : m
          )
        );
        setAssociates((prev) =>
          prev.map((a) =>
            a.id === 'ASSOC-101'
              ? { ...a, pktScore: Math.min(100, Math.max(a.pktScore, pct)) }
              : a
          )
        );
        triggerToast(
          `Module "${activeQuizModule.title}" completed with ${pct}% score! Monthly Scorecard PKT updated.`
        );
      }
    }
  };

  const openCertificateModal = (course: MandatoryComplianceCourse) => {
    setCertificateCourse(course);
    certDialogRef.current?.showModal();
  };

  const handleAcknowledgeSop = (sopId: string) => {
    setSops((prev) =>
      prev.map((s) =>
        s.id === sopId
          ? {
              ...s,
              acknowledgedByCurrentUser: true,
              readAckPct: Math.min(100, s.readAckPct + 3),
            }
          : s
      )
    );
    if (selectedSop.id === sopId) {
      setSelectedSop((prev) => ({
        ...prev,
        acknowledgedByCurrentUser: true,
        readAckPct: Math.min(100, prev.readAckPct + 3),
      }));
    }
    triggerToast('SOP / Process Flash Read-Receipt digitally signed and logged in audit trail.');
  };

  const handleSendAiQuery = (customPrompt?: string) => {
    const queryText = (customPrompt ?? aiInput).trim();
    if (!queryText) return;

    const userMsg: AiChatMessage = {
      id: `USR-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: queryText,
    };

    const reply = generateTrainerSamResponse(queryText);
    const botMsg: AiChatMessage = {
      id: `BOT-${Date.now() + 1}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...reply,
    };

    setAiMessages((prev) => [...prev, userMsg, botMsg]);
    if (!customPrompt) setAiInput('');
  };

  const nhtAvgGatePct = useMemo(() => {
    const allTrainees = nhtBatches.flatMap((b) => b.trainees);
    return Math.round(
      allTrainees.reduce((s, t) => s + t.finalNhtGatePct, 0) / (allTrainees.length || 1)
    );
  }, [nhtBatches]);

  const csCertifiedPct = useMemo(() => {
    const certifiedCount = csEnrollments.filter((e) =>
      e.currentStage.startsWith('Certified —')
    ).length;
    return Math.round((certifiedCount / (csEnrollments.length || 1)) * 100);
  }, [csEnrollments]);

  const activeUserPktPct = useMemo(() => {
    const u = associates.find((a) => a.id === focusedUserId) || associates[0];
    return u?.pktScore || 92;
  }, [associates, focusedUserId]);

  return (
    <div className="min-h-screen curiosity-light-surface bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-white border-2 border-indigo-500 text-slate-900 px-4 py-3.5 rounded-2xl shadow-xl flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs font-semibold leading-snug flex-1 text-slate-800">
            {toastMessage}
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-700"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Clean Light Professional Learning Header — Curiosity */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Custom Curiosity Brand Logo */}
          <CuriosityBrandLogo />

          {/* Global RCM Filters + Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              <select
                aria-label="Filter by RCM Tower"
                value={selectedTower}
                onChange={(e) => setSelectedTower(e.target.value as RcmTower | 'All Towers')}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="All Towers">All 7 RCM Towers</option>
                {RCM_TOWERS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <select
                aria-label="Filter by Provider Specialty"
                value={selectedSpecialty}
                onChange={(e) =>
                  setSelectedSpecialty(e.target.value as ProviderSpecialty | 'All Specialties')
                }
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="All Specialties">All Specialties</option>
                {PROVIDER_SPECIALTIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {isTabAllowed(profile, 'admin_studio') && (
            <button
              onClick={() => openAdminStudio('projects')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <FolderKanban className="w-3.5 h-3.5 text-indigo-600" />
              <span>Admin Studio</span>
            </button>
            )}

            <button
              onClick={() => {
                setActiveDimension('dim_process_intell');
                setActiveTab('knowledge');
              }}
              className="keep-white-text flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Curiosity AI</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex">
      {/* Clarity sidebar: persistent workspace navigation on large screens.
          Mobile/tablet keep the existing dimension switcher deck below. */}
      <aside aria-label="Primary" className="clarity-sidebar hidden lg:flex flex-col gap-6 w-60 shrink-0 bg-white border-r border-slate-200 px-4 py-6 sticky top-[65px] self-start h-[calc(100vh-65px)] overflow-y-auto">
        <nav aria-label="Workspace dimensions">
          <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-500 px-2 mb-2">Workspace</div>
          <ul className="space-y-1">
            <li>
              <button
                type="button"
                onClick={openOverview}
                aria-current={activeTab === 'overview' ? 'page' : undefined}
                className={`clarity-nav-item w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-left transition-colors ${
                  activeTab === 'overview' ? 'is-active font-bold' : 'font-medium'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>My overview</span>
              </button>
            </li>
            {([
              ['dim_org_learning', 'Organizational Learning', GraduationCap],
              ['dim_process_intell', 'Process Training Intell', Target],
              ['dim_nht_training', 'NHT Training', UserPlus],
              ['dim_cs_training', 'CS Trainings', Building2],
              ['dim_games_hub', 'Learning Hub & Games', Gamepad2],
            ] as [AppDimensionId, string, typeof Target][]).filter(([id]) => PROFILE_DIMENSIONS[profile].includes(id)).map(([id, label, Icon]) => {
              const isActive = activeTab !== 'overview' && activeDimension === id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => handleSelectDimension(id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`clarity-nav-item w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-left transition-colors ${
                      isActive ? 'is-active font-bold' : 'font-medium'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <p className="mt-auto text-[11px] leading-relaxed text-slate-500 px-2">
          Sample data only. Role views are a UI preview, not access control.
        </p>
      </aside>
      <main id="main-content" className="flex-1 min-w-0 w-full px-4 sm:px-6 lg:px-8 py-5 lg:py-7 space-y-5">
        {/* Mobile / tablet workspace navigation (sidebar equivalent) */}
        <nav aria-label="Workspace sections" className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto">
          <ul className="flex gap-2 min-w-max pb-1">
            {([
              ['overview', 'My overview'],
              ['dim_org_learning', 'Organizational Learning'],
              ['dim_process_intell', 'Process Training'],
              ['dim_nht_training', 'NHT Training'],
              ['dim_cs_training', 'CS Trainings'],
              ['dim_games_hub', 'Learning Hub & Games'],
            ] as [AppDimensionId | 'overview', string][]).filter(([id]) => id === 'overview' || PROFILE_DIMENSIONS[profile].includes(id)).map(([id, label]) => {
              const isActive = id === 'overview' ? activeTab === 'overview' : activeTab !== 'overview' && activeDimension === id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => (id === 'overview' ? openOverview() : handleSelectDimension(id))}
                    aria-current={isActive ? 'page' : undefined}
                    className={`clarity-nav-item whitespace-nowrap px-3 py-2 rounded-lg text-xs border border-slate-200 bg-white ${isActive ? 'is-active font-bold' : 'font-medium'}`}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Clarity topline: breadcrumb + active role lens */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-clarity-muted">
          <p>
            Workspace /{' '}
            <span className="text-clarity-ink font-medium">
              {activeTab === 'overview'
                ? 'My overview'
                : {
                    dim_org_learning: 'Organizational Learning',
                    dim_process_intell: 'Process Training Intell',
                    dim_nht_training: 'NHT Training',
                    dim_cs_training: 'CS Trainings',
                    dim_games_hub: 'Learning Hub & Games',
                  }[activeDimension]}
            </span>
          </p>
          <div role="radiogroup" aria-label="Sample profile (demo view switch, not a login)" className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-clarity-muted mr-1">Sample profile:</span>
            {([
              ['associate', 'Associate'],
              ['trainer', 'Trainer / QA'],
              ['admin', 'L&D Admin'],
              ['operations', 'Operations'],
            ] as [EnterprisePersona, string][]).map(([p, label]) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={activePersona === p}
                onClick={() => handleSelectPersona(p)}
                className={`clarity-nav-item px-2.5 py-1.5 rounded-lg text-[11px] border border-slate-200 bg-white ${activePersona === p ? 'is-active font-bold' : 'font-medium'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="flex items-center gap-2">
            <span className="capitalize">{PROFILE_LABELS[profile]} view (sample)</span>
            <span aria-hidden="true" className="w-8 h-8 rounded-full bg-clarity-100 text-clarity-700 font-bold flex items-center justify-center text-[11px]">
              {activePersona.slice(0, 2).toUpperCase()}
            </span>
          </p>
        </div>

        {activeTab === 'overview' && (() => {
          const overviewAssociate = associates.find((a) => a.id === focusedUserId) ?? associates[0];
          if (profile === 'trainer') {
            return (
              <TrainerOverview tickets={tickets} associates={associates} defects={defects}
                calibrations={calibrations} nhtBatches={nhtBatches} onNavigate={handleOverviewNavigate} />
            );
          }
          if (profile === 'admin') {
            return (
              <AdminOverview projects={filteredProjects} learningModules={learningModules}
                complianceCourses={complianceCourses} sops={sops} summary={orgSummary}
                onNavigate={handleOverviewNavigate} />
            );
          }
          return overviewAssociate ? (
            <ClarityOverview
              associate={overviewAssociate}
              isAssociateLens={activePersona === 'associate'}
              tickets={tickets}
              learningModules={learningModules}
              onNavigate={handleOverviewNavigate}
            />
          ) : null;
        })()}

        {/* OBVIOUSLY VISIBLE 5-DIMENSION VISUAL SWITCHER DECK (dimension views only) */}
        {activeTab !== 'overview' && (
        <VisualDimensionSwitcher
          activeDimension={activeDimension}
          onSelectDimension={handleSelectDimension}
          orgCompliancePct={Number(orgSummary.avgCompliance)}
          avgProjectHealthPct={Number(orgSummary.avgHealth)}
          nhtPassPct={nhtAvgGatePct}
          csCertifiedPct={csCertifiedPct}
          activeUserPktPct={activeUserPktPct}
          visibleDimensions={PROFILE_DIMENSIONS[profile]}
        />
        )}

        {/* COMPACT 1-LINE RELATIONAL CONTEXT RIBBON */}
        <RelationalContextBar
          activePersona={activePersona}
          onSelectPersona={handleSelectPersona}
          selectedProjectId={focusedProjectId}
          onSelectProjectId={setFocusedProjectId}
          selectedGroupId={focusedGroupId}
          onSelectGroupId={setFocusedGroupId}
          selectedUserId={focusedUserId}
          onSelectUserId={(id) => {
            setFocusedUserId(id);
            setSelectedAssocId(id);
          }}
          projects={projects}
          userGroups={userGroups}
          associates={associates}
        />

        {/* SCOPED SUB-NAVIGATION BAR FOR DIMENSION 2 (PROCESS TRAINING INTELLIGENCE) */}
        {activeTab !== 'overview' && activeDimension === 'dim_process_intell' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                {
                  id: 'dashboard',
                  label: 'Project Dashboards & Visual Trends',
                  icon: LayoutDashboard,
                },
                {
                  id: 'project_directories',
                  label: 'Project Directories Folder',
                  icon: FolderOpen,
                },
                {
                  id: 'scorecards',
                  label: 'Project Scorecards & BQT/PIP',
                  icon: Target,
                },
                {
                  id: 'clp_dashboard',
                  label: 'CLP Dashboard & Update Tracker',
                  icon: Activity,
                },
                {
                  id: 'trainer_hub',
                  label: 'Auto-Triggered & Trainer Closure',
                  icon: ClipboardCheck,
                  badge: tickets.filter((t) => t.status !== 'Closed — Summary Logged').length,
                },
                {
                  id: 'quality',
                  label: 'Rebuttals & Calibrations',
                  icon: Scale,
                  badge: orgSummary.pendingRebuttals,
                },
                {
                  id: 'associate_portal',
                  label: 'Associate Workspace',
                  icon: Users,
                },
                {
                  id: 'admin_studio',
                  label: 'Admin Studio',
                  icon: Building2,
                },
                {
                  id: 'reports',
                  label: 'Reports',
                  icon: FileSpreadsheet,
                },
                {
                  id: 'upload',
                  label: 'Daily Upload',
                  icon: Upload,
                },
                {
                  id: 'knowledge',
                  label: 'Curiosity AI & SOPs',
                  icon: Bot,
                },
              ].filter((tab) => PROFILE_PROCESS_TABS[profile].includes(tab.id)).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTab)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'keep-white-text bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge ? (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =====================================================================
            DIMENSION 1: MONITOR ORGANIZATIONAL LEARNING (COMPLIANCE, TALENT UPSKILL, REPORTS)
           ===================================================================== */}
        {activeTab === 'org_learning' && (
          <OrgLearningDimensionHub
            complianceCourses={complianceCourses}
            onStartComplianceQuiz={openComplianceQuiz}
            onOpenCertificate={openCertificateModal}
            upskillCourses={upskillCourses}
            setUpskillCourses={setUpskillCourses}
            projects={projects}
            userGroups={userGroups}
            associates={associates}
            selectedProjectId={focusedProjectId}
            selectedGroupId={focusedGroupId}
            selectedUserId={focusedUserId}
            triggerToast={triggerToast}
          />
        )}

        {/* =====================================================================
            DIMENSION 2 SUB-VIEW: PROJECT DIRECTORIES FOLDER EXPLORER
            (Project-Specific SOPs, Playbooks, Update Trackers, Question Banks, Knowledge Docs)
           ===================================================================== */}
        {activeTab === 'project_directories' && (
          <ProjectDirectoriesFolderExplorer
            projects={projects}
            selectedProjectId={focusedProjectId}
            onSelectProjectId={setFocusedProjectId}
            sops={sops}
            setSops={setSops}
            questionBank={questionBank}
            setQuestionBank={setQuestionBank}
            weeklyAssessments={weeklyAssessments}
            onAcknowledgeSop={handleAcknowledgeSop}
            triggerToast={triggerToast}
          />
        )}

        {/* =====================================================================
            DIMENSION 3: NHT TRAINING (BATCHES, PROGRESS, DASHBOARDS, MODULES & REPORTS)
           ===================================================================== */}
        {activeTab === 'nht_training' && (
          <NhtTrainingDimensionHub
            nhtBatches={nhtBatches}
            setNhtBatches={setNhtBatches}
            projects={projects}
            userGroups={userGroups}
            csModules={csModules}
            setCsEnrollments={setCsEnrollments}
            triggerToast={triggerToast}
            renderTrainingModulesCatalog={() => (
              <TrainingModulesCatalogPage
                projects={projects}
                associates={associates}
                learningModules={learningModules}
                setLearningModules={setLearningModules}
                onLaunchModuleQuiz={openModuleQuiz}
                onOpenCsTrainingHub={() => {
                  setActiveDimension('dim_cs_training');
                  setActiveTab('cs_training');
                }}
                triggerToast={triggerToast}
              />
            )}
          />
        )}

        {/* =====================================================================
            DIMENSION 5 (EXTRA): LEARNING HUB & GAMES ARENA
           ===================================================================== */}
        {activeTab === 'games_hub' && (
          <LearningHubAndGamesArena
            associates={associates}
            setAssociates={setAssociates}
            selectedUserId={focusedUserId}
            projects={projects}
            userGroups={userGroups}
            triggerToast={triggerToast}
          />
        )}

        {/* =====================================================================
            DIMENSION 4: AR CLIENT-SPECIFIC (CS) TRAINING & QUALITY CERTIFICATION PROCESS (QCP) HUB
           ===================================================================== */}
        {activeTab === 'cs_training' && (
          <ClientSpecificTrainingHub
            projects={projects}
            associates={associates}
            csModules={csModules}
            setCsModules={setCsModules}
            csEnrollments={csEnrollments}
            setCsEnrollments={setCsEnrollments}
            triggerToast={triggerToast}
          />
        )}

        {/* =====================================================================
            TAB: CONTINUOUS LEARNING PROCESS DASHBOARD (PROJECT DBT/BQT/PIP STATS & TRENDS + UPDATE TRACKER AUTO-SYNC TO KNOWLEDGE & PKT QUESTION BANK)
           ===================================================================== */}
        {activeTab === 'clp_dashboard' && (
          <ContinuousLearningDashboard
            projects={projects}
            associates={associates}
            tickets={tickets}
            sops={sops}
            setSops={setSops}
            questionBank={questionBank}
            setQuestionBank={setQuestionBank}
            weeklyAssessments={weeklyAssessments}
            setWeeklyAssessments={setWeeklyAssessments}
            triggerToast={triggerToast}
          />
        )}

        {/* =====================================================================
            TAB: TRAINING MODULES PAGE (NHT - BILLING, NHT - AR, NHT - CODING, AR - CS TRAINING, REFRESHER TRAINING MODULE)
           ===================================================================== */}
        {activeTab === 'training_modules' && (
          <TrainingModulesCatalogPage
            projects={projects}
            associates={associates}
            learningModules={learningModules}
            setLearningModules={setLearningModules}
            onLaunchModuleQuiz={openModuleQuiz}
            onOpenCsTrainingHub={() => setActiveTab('cs_training')}
            triggerToast={triggerToast}
          />
        )}

        {/* =====================================================================
            TAB: TRAINER WORKBENCH (ASSIGNED PROJECTS ONLY, CLOSE AUTO-TRIGGERED TRAININGS WITH SUMMARY, WEEKLY 4 EXAMS & QUESTION BANK)
           ===================================================================== */}
        {activeTab === 'trainer_hub' && (
          <TrainerWorkbench
            projects={projects}
            associates={associates}
            setAssociates={setAssociates}
            tickets={tickets}
            setTickets={setTickets}
            weeklyAssessments={weeklyAssessments}
            setWeeklyAssessments={setWeeklyAssessments}
            questionBank={questionBank}
            setQuestionBank={setQuestionBank}
            triggerToast={triggerToast}
          />
        )}

        {/* =====================================================================
            TAB: DEDICATED REPORTS CENTER (BY CS TRAINING & QCP, COURSES, USER GROUPS, PROJECTS, TRAININGS & BATCHES)
           ===================================================================== */}
        {activeTab === 'reports' && (
          <ReportsCenter
            projects={projects}
            associates={associates}
            userGroups={userGroups}
            learningModules={learningModules}
            complianceCourses={complianceCourses}
            tickets={tickets}
            uploadBatches={uploadBatches}
            weeklyAssessments={weeklyAssessments}
            csModules={csModules}
            csEnrollments={csEnrollments}
            triggerToast={triggerToast}
          />
        )}

        {/* =====================================================================
            TAB: ASSOCIATE WORKSPACE (PERFORMANCE TRENDS, SCORECARD, ERROR TRENDS, REBUTTALS & PROJECT KNOWLEDGE LIBRARY)
           ===================================================================== */}
        {activeTab === 'associate_portal' && (
          <AssociateWorkspace
            associates={associates}
            defects={defects}
            setDefects={setDefects}
            learningModules={learningModules}
            complianceCourses={complianceCourses}
            sops={sops}
            onAcknowledgeSop={handleAcknowledgeSop}
            onLaunchModuleQuiz={openModuleQuiz}
            onLaunchComplianceQuiz={openComplianceQuiz}
            onViewCertificate={openCertificateModal}
            triggerToast={triggerToast}
          />
        )}

        {/* =====================================================================
            TAB: L&D ADMIN GOVERNANCE STUDIO (PROJECTS, USERS, COURSES, GROUPS)
           ===================================================================== */}
        {activeTab === 'admin_studio' && (
          <AdminGovernanceStudio
            key={`${adminSubTab}-${focusedProjectId}-${focusedUserId}`}
            projects={projects}
            setProjects={setProjects}
            associates={associates}
            setAssociates={setAssociates}
            userGroups={userGroups}
            setUserGroups={setUserGroups}
            learningModules={learningModules}
            setLearningModules={setLearningModules}
            complianceCourses={complianceCourses}
            setComplianceCourses={setComplianceCourses}
            defects={defects}
            initialSubTab={adminSubTab}
            initialProjectId={focusedProjectId}
            initialUserId={focusedUserId}
            onLaunchModuleQuiz={openModuleQuiz}
            onLaunchComplianceQuiz={openComplianceQuiz}
            triggerToast={triggerToast}
          />
        )}

        {/* =====================================================================
            TAB 1: EXECUTIVE GOVERNANCE & PROJECT HEALTH DASHBOARD
           ===================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Visual Radial Ring KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
                <VisualRadialGauge
                  value={Number(orgSummary.avgHealth)}
                  size={60}
                  strokeWidth={6}
                  color="#4F46E5"
                  trackColor="#E0E7FF"
                />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Project Health
                  </div>
                  <div className="text-xl font-black text-slate-900 tabular-nums">
                    {orgSummary.avgHealth}
                    <span className="text-xs font-semibold text-slate-400"> / 100</span>
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3" />
                    <span>+2.4 pts (6M Trend)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
                <VisualRadialGauge
                  value={Number(orgSummary.avgProd)}
                  size={60}
                  strokeWidth={6}
                  color="#0284C7"
                  trackColor="#E0F2FE"
                />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Production SLA
                  </div>
                  <div className="text-xl font-black text-slate-900 tabular-nums">
                    {orgSummary.avgProd}%
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Target: 95.0% SLA</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
                <VisualRadialGauge
                  value={Number(orgSummary.avgQual)}
                  size={60}
                  strokeWidth={6}
                  color="#0D9488"
                  trackColor="#CCFBF1"
                />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Quality Audit SLA
                  </div>
                  <div className="text-xl font-black text-slate-900 tabular-nums">
                    {orgSummary.avgQual}%
                  </div>
                  <div className="text-[11px] font-semibold text-amber-600 mt-0.5">
                    {orgSummary.pendingRebuttals} Rebuttals Pending
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
                <VisualRadialGauge
                  value={Number(orgSummary.avgCompliance)}
                  size={60}
                  strokeWidth={6}
                  color="#10B981"
                  trackColor="#D1FAE5"
                />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Statutory Compliance
                  </div>
                  <div className="text-xl font-black text-slate-900 tabular-nums">
                    {orgSummary.avgCompliance}%
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">HIPAA & POSH Active</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    CLP Coaching Funnel
                  </span>
                  <Flame className="w-4 h-4 text-amber-500" />
                </div>
                <div className="grid grid-cols-2 gap-2 my-1">
                  <div className="px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
                    <div className="text-base font-black text-amber-700 tabular-nums">
                      {orgSummary.totalBqt}
                    </div>
                    <div className="text-[10px] font-bold text-amber-700">BQT (3 Wks)</div>
                  </div>
                  <div className="px-2.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-center">
                    <div className="text-base font-black text-rose-700 tabular-nums">
                      {orgSummary.totalPip}
                    </div>
                    <div className="text-[10px] font-bold text-rose-700">PIP (15d)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Health Matrix Table with Direct Project Profile & Historical Links */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-400" />
                    Multi-Specialty RCM Project Health, Historical Trajectory & Governance Matrix
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click any project’s <strong>Project Profile & History</strong> button to inspect 6-month historical performance, SLA targets, and assigned rosters
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {canOpenAdminStudio && (
                  <button
                    onClick={() => openAdminStudio('projects')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Project / View History</span>
                  </button>
                  )}
                  {canOpenAdminStudio && (
                  <button
                    onClick={() => openAdminStudio('users')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-sky-400" />
                    <span>+ Add User</span>
                  </button>
                  )}
                  {canOpenAdminStudio && (
                  <button
                    onClick={() => openAdminStudio('groups')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5"
                  >
                    <UsersRound className="w-3.5 h-3.5 text-purple-400" />
                    <span>User Groups ({userGroups.length})</span>
                  </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60">
                      <th className="py-3.5 px-4">Project & Specialty</th>
                      <th className="py-3.5 px-4">Active RCM Towers</th>
                      <th className="py-3.5 px-4 text-right">Health Score</th>
                      <th className="py-3.5 px-4 text-center">6M Historical Sparkline</th>
                      <th className="py-3.5 px-4 text-right">Production SLA</th>
                      <th className="py-3.5 px-4 text-right">Quality SLA</th>
                      <th className="py-3.5 px-4 text-center">BQT / PIP</th>
                      <th className="py-3.5 px-4 text-right">Project Profile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-xs">
                    {filteredProjects.map((proj) => {
                      const healthColor =
                        proj.healthScore >= 88
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                          : proj.healthScore >= 78
                          ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
                          : 'text-rose-400 bg-rose-500/10 border-rose-500/30';
                      const qualBelowTarget = proj.qualitySlaPct < proj.qualityTargetPct;

                      return (
                        <tr key={proj.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{proj.projectName}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-indigo-300">{proj.clientCode}</span>
                              <span>•</span>
                              <span className="text-emerald-300 font-medium">{proj.specialty}</span>
                              <span>•</span>
                              <span>{proj.headcount} FTEs</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="flex flex-wrap gap-1">
                              {proj.towers.map((t) => (
                                <span
                                  key={t}
                                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right tabular-nums">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold border ${healthColor}`}
                            >
                              {proj.healthScore}%
                              {proj.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                              {proj.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                            </span>
                          </td>
                          {/* 6M Mini Historical Bar Sparkline */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-end justify-center gap-1 h-8">
                              {proj.history.map((h) => (
                                <div
                                  key={h.month}
                                  title={`${h.month}: Health ${h.healthScore}% | QA ${h.qualitySlaPct}%`}
                                  className={`w-2.5 rounded-t ${
                                    h.healthScore >= 88
                                      ? 'bg-emerald-500'
                                      : h.healthScore >= 78
                                      ? 'bg-indigo-400'
                                      : 'bg-amber-500'
                                  }`}
                                  style={{
                                    height: `${Math.max(25, (h.healthScore - 65) * 2.6)}%`,
                                  }}
                                />
                              ))}
                            </div>
                            <div className="text-[10px] text-center text-slate-500 mt-0.5 tabular-nums">
                              Jun {proj.history[0]?.healthScore}% → Nov {proj.healthScore}%
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right tabular-nums font-medium text-slate-200">
                            {proj.productionSlaPct}%
                          </td>
                          <td className="py-3.5 px-4 text-right tabular-nums">
                            <div
                              className={`font-semibold ${
                                qualBelowTarget ? 'text-amber-400' : 'text-emerald-400'
                              }`}
                            >
                              {proj.qualitySlaPct}%
                            </div>
                            <div className="text-[10px] text-slate-500">
                              SLA: {proj.qualityTargetPct}%
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center tabular-nums">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                                {proj.bqtCount} BQT
                              </span>
                              <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold">
                                {proj.pipCount} PIP
                              </span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {canOpenAdminStudio && (
                            <button
                              onClick={() => openAdminStudio('projects', proj.id)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-semibold text-[11px]"
                            >
                              Profile & History →
                            </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom 2-Column Insights: Tower Productivity & Automated Governance Rules */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tower Defect Pareto & Training Impact */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Top RCM Defect Categories & Automated Weekly Training Triggers
                    </h3>
                    <p className="text-xs text-slate-400">
                      Pareto distribution of QA audit errors driving weekly continuous learning
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('learning')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    <span>Open Learning Hub</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      defect: 'CO-197 Prior Auth / Evicore Retro-Appeal Omission (Ortho & Cardio)',
                      tower: 'Denials Management',
                      sharePct: 32,
                      module: 'MOD-WK-101',
                      color: 'bg-indigo-500',
                    },
                    {
                      defect: 'CO-29 Timely Filing Limit Escalation Delay & Missing 277CA POTF',
                      tower: 'Accounts Receivable (AR)',
                      sharePct: 24,
                      module: 'MOD-BQT-102',
                      color: 'bg-amber-500',
                    },
                    {
                      defect: 'Modifier -25 / -59 / XS Unbundling & NCCI Edit Mismatch',
                      tower: 'Medical Coding',
                      sharePct: 19,
                      module: 'MOD-PKT-204',
                      color: 'bg-sky-500',
                    },
                    {
                      defect: 'Subscriber Alpha Prefix & Pediatric Birthday Rule COB Order',
                      tower: 'Demographics & Charge Entry',
                      sharePct: 15,
                      module: 'MOD-BQT-103',
                      color: 'bg-emerald-500',
                    },
                    {
                      defect: 'HIPAA 3-Point Identity Verification Omission on Outbound Calls',
                      tower: 'Patient Calling',
                      sharePct: 10,
                      module: 'MOD-PIP-105',
                      color: 'bg-rose-500',
                    },
                  ].map((item) => (
                    <div key={item.defect} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-200">{item.defect}</span>
                        <span className="text-slate-400 tabular-nums font-semibold">
                          {item.sharePct}% of Defects
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${item.sharePct * 2.5}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Tower: {item.tower}</span>
                        <span className="text-indigo-300">Auto-Triggers: {item.module}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continuous Learning, BQT & PIP Governance Lifecycle Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Automated SLA Governance: Weekly Training → BQT → PIP Pipeline
                    </h3>
                    <p className="text-xs text-slate-400">
                      How daily Production, Quality & TMS uploads govern associate coaching
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('scorecards')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    <span>Manage Cohort</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">
                        1. Top & Core Performers (Q1–Q3)
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
                        Quality ≥ 97.5%
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Eligible for Star RCM Incentives, peer-mentoring badges, and reduced QA audit sampling (3% random sample).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300">
                        2. Defect-Based Weekly Training
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                        Any QA Defect / Dip
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Every Friday, associates with CARC/Coding audit defects are auto-assigned a 25-min micro-module & quiz due by Wednesday.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300">
                        3. BQT (Bottom Quartile Process)
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">
                        Bottom 25% / &lt;92% QA
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      4-Week structured transformation: Root-Cause Analysis (Will vs Skill), side-by-side trainer huddles, and weekly PKT gates.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-300">
                        4. PIP (Performance Improvement)
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300">
                        &lt;85% QA / BQT Unmet
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Formal HR + Ops + L&D 30-day plan with 100% pre-release QA audit check and mandatory 95%+ certification gate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: DAILY DATA UPLOAD HUB (PRODUCTION, QUALITY & TMS)
           ===================================================================== */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bulk CSV / Excel Upload Dropzone */}
              <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                      Daily RCM Data Ingestion Hub (Production, Quality & TMS)
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Upload daily extracts from EHR/PMS billing queues, QMS Audit logs, and TMS Workforce systems
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      triggerToast(
                        'Downloaded standardized CSV template: TrainerSam_Daily_Prod_QA_TMS_Template.csv'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-indigo-300 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV Schema</span>
                  </button>
                </div>

                {/* Source Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(
                    [
                      {
                        id: 'Production Tracker (PMS/EHR)',
                        title: '1. Daily Production Data',
                        sub: 'Claims/Accounts worked, Charge Entry, Clean Claim %',
                      },
                      {
                        id: 'QMS Audit Engine',
                        title: '2. Daily Quality Audit Data',
                        sub: 'Audited Claims, CARC/CPT Defects, Critical Errors',
                      },
                      {
                        id: 'TMS Workforce & Shrinkage',
                        title: '3. Daily TMS & Attendance',
                        sub: 'Billable Hours, Shrinkage %, AHT, Aux Time',
                      },
                    ] as const
                  ).map((src) => (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => setUploadSource(src.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        uploadSource === src.id
                          ? 'bg-indigo-600/15 border-indigo-500 text-white'
                          : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{src.title}</div>
                      <div className="text-[11px] text-slate-400 mt-1">{src.sub}</div>
                    </button>
                  ))}
                </div>

                {/* Interactive File Dropzone */}
                <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/70 rounded-2xl p-8 text-center bg-slate-950/50 transition-colors space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">
                      Drop your daily <span className="text-indigo-300">{uploadSource}</span> CSV/XLSX file here
                    </p>
                    <p className="text-xs text-slate-400">
                      Automatically maps `EmpID`, `ProjectCode`, `Tower`, `Specialty`, `Target`, `Actual`, `DefectCode`, `BillableHrs`, `AHT`
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700">
                      <span>Choose Local CSV File</span>
                      <input
                        type="file"
                        accept=".csv,.xlsx"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSimulateBatchUpload(file.name);
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleSimulateBatchUpload()}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Simulate Live Daily Batch Sync</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Single-Associate Live Daily Entry & SLA Trigger Simulator */}
              <form
                onSubmit={handleManualDailySync}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4"
              >
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Live Associate Daily Metric & SLA Simulator
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update an associate’s daily Production, Quality or TMS numbers to test real-time BQT/PIP & training triggers
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Select RCM Associate
                    </label>
                    <select
                      value={manualAssocId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setManualAssocId(id);
                        const found = associates.find((a) => a.id === id);
                        if (found) {
                          setManualDailyActual(found.dailyActual);
                          setManualQualityPct(found.qualityActualPct);
                          setManualTmsHours(found.tmsBillableHours);
                          setManualAht(found.ahtMinutes);
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                    >
                      {associates.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.empId} — {a.tower})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Daily Claims Worked
                      </label>
                      <input
                        type="number"
                        value={manualDailyActual}
                        onChange={(e) => setManualDailyActual(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Daily Quality Audit %
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        max="100"
                        value={manualQualityPct}
                        onChange={(e) => setManualQualityPct(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        TMS Billable Hrs (of 8h)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        max="9"
                        value={manualTmsHours}
                        onChange={(e) => setManualTmsHours(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        AHT (Mins / Claim)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={manualAht}
                        onChange={(e) => setManualAht(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                    Tip: Setting <strong className="text-slate-200">Quality &lt; 95%</strong> auto-triggers <strong className="text-amber-300">BQT Coaching & Defect Training</strong>; setting <strong className="text-slate-200">Quality &lt; 86%</strong> escalates to <strong className="text-rose-400">PIP Governance</strong>.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md transition-all"
                  >
                    Sync Daily Metrics & Run SLA Rules
                  </button>
                </div>
              </form>
            </div>

            {/* Daily Upload Audit Trail Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  Recent Daily Production, Quality & TMS Upload Batches
                </h3>
                <span className="text-xs text-slate-400">
                  Auto-triggers Weekly Defect Training & BQT/PIP flags on ingestion
                </span>
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
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {uploadBatches.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{b.id}</div>
                          <div className="text-[11px] text-slate-400">{b.uploadedAt}</div>
                        </td>
                        <td className="py-3 px-4 text-indigo-300 font-medium">{b.sourceSystem}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                          {b.fileName}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums font-medium">
                          {b.rowsImported}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-amber-300 font-semibold">
                          {b.slaBreachesDetected}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-indigo-300 font-semibold">
                          +{b.autoTrainingsAssigned} Modules
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-rose-400 font-semibold">
                          {b.bqtPipFlagsRaised} Flagged
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: MONTHLY SCORECARDS, BQT & PIP GOVERNANCE
           ===================================================================== */}
        {activeTab === 'scorecards' && (
          <div className="space-y-6">
            {/* Formula & Stage Filter Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-white">Composite Monthly Scorecard Weightage:</span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                  Quality SLA: 40%
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30 font-medium">
                  Production SLA: 35%
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium">
                  Monthly PKT Score: 15%
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 font-medium">
                  TMS Utilization: 10%
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    'All Stages',
                    'Top Quartile (Q1)',
                    'Core Performer (Q2-Q3)',
                    'Defect-Based Training (1-2 Wks Below QA)',
                    'BQT (3 Consecutive Wks Below QA)',
                    'PIP - 15 Days (4 Consecutive Wks Below QA)',
                  ] as const
                ).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStageFilter(st)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      stageFilter === st
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Roster Table */}
              <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white">
                    RCM Associate Monthly Scorecards & Consecutive-Week Quality SLA Escalation Roster
                  </h2>
                  {canOpenAdminStudio && (
                  <button
                    onClick={() => openAdminStudio('users', undefined, selectedAssociate.id)}
                    className="text-xs text-indigo-300 hover:text-white font-semibold"
                  >
                    Open Full 360° User Profile →
                  </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-950/60">
                        <th className="py-3 px-4">Associate & Tower</th>
                        <th className="py-3 px-4 text-right">Prod SLA</th>
                        <th className="py-3 px-4 text-right">Quality SLA</th>
                        <th className="py-3 px-4 text-center">Consecutive Wks &lt; QA</th>
                        <th className="py-3 px-4 text-right">PKT</th>
                        <th className="py-3 px-4 text-right">Composite</th>
                        <th className="py-3 px-4">Governance Stage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {filteredAssociates.map((assoc) => {
                        const isSelected = assoc.id === selectedAssociate.id;
                        const stageBadge =
                          assoc.governanceStage === 'Top Quartile (Q1)'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : assoc.governanceStage === 'Core Performer (Q2-Q3)'
                            ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                            : assoc.governanceStage === 'Defect-Based Training (1-2 Wks Below QA)'
                            ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40'
                            : assoc.governanceStage === 'BQT (3 Consecutive Wks Below QA)'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/40';

                        return (
                          <tr
                            key={assoc.id}
                            onClick={() => setSelectedAssocId(assoc.id)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-indigo-600/15' : 'hover:bg-slate-800/40'
                            }`}
                          >
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-white flex items-center gap-2">
                                <span>{assoc.name}</span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {assoc.empId}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {assoc.tower} • <span className="text-indigo-300">{assoc.specialty}</span>
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Trainer: {assoc.assignedTrainer} • Lead: {assoc.reportingLead}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right tabular-nums">
                              <div className="font-semibold text-slate-200">
                                {assoc.productionSlaPct}%
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {assoc.dailyActual}/{assoc.dailyTarget} claims
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right tabular-nums">
                              <div
                                className={`font-bold ${
                                  assoc.qualityActualPct < assoc.qualityTargetPct
                                    ? 'text-amber-400'
                                    : 'text-emerald-400'
                                }`}
                              >
                                {assoc.qualityActualPct}%
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Target {assoc.qualityTargetPct}%
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-center tabular-nums">
                              <span
                                className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                                  assoc.consecutiveWeeksBelowQa >= 4
                                    ? 'bg-rose-500/20 text-rose-300'
                                    : assoc.consecutiveWeeksBelowQa === 3
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : assoc.consecutiveWeeksBelowQa >= 1
                                    ? 'bg-indigo-500/20 text-indigo-300'
                                    : 'bg-emerald-500/15 text-emerald-300'
                                }`}
                              >
                                {assoc.consecutiveWeeksBelowQa} Wks
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right tabular-nums font-semibold text-indigo-300">
                              {assoc.pktScore}%
                            </td>
                            <td className="py-3.5 px-4 text-right tabular-nums font-bold text-white">
                              {assoc.compositeScore}%
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${stageBadge}`}
                              >
                                {assoc.governanceStage}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detailed Associate Monthly Scorecard & BQT/PIP Action Panel */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{selectedAssociate.name}</h3>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {selectedAssociate.empId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedAssociate.roleTitle} • {selectedAssociate.projectName}
                    </p>
                    <p className="text-[11px] text-indigo-300 mt-0.5">
                      Tower: {selectedAssociate.tower} ({selectedAssociate.specialty})
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-white tabular-nums">
                      {selectedAssociate.compositeScore}%
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">
                      Monthly Scorecard
                    </div>
                  </div>
                </div>

                {/* 4 Pillar Mini-Bars */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[11px]">Production (35% Wt)</div>
                    <div className="text-base font-bold text-white tabular-nums mt-0.5">
                      {selectedAssociate.productionSlaPct}%
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {selectedAssociate.dailyActual} / {selectedAssociate.dailyTarget} claims/day
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[11px]">Quality SLA (40% Wt)</div>
                    <div className="text-base font-bold text-emerald-400 tabular-nums mt-0.5">
                      {selectedAssociate.qualityActualPct}%
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {selectedAssociate.criticalErrors} Critical Defects ({selectedAssociate.auditsSampled} sampled)
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[11px]">Process Knowledge (15%)</div>
                    <div className="text-base font-bold text-indigo-300 tabular-nums mt-0.5">
                      {selectedAssociate.pktScore}%
                    </div>
                    <div className="text-[10px] text-slate-500">Monthly Standardized PKT</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[11px]">TMS Adherence (10%)</div>
                    <div className="text-base font-bold text-purple-300 tabular-nums mt-0.5">
                      {selectedAssociate.tmsUtilizationPct}%
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Shrinkage: {selectedAssociate.shrinkagePct}% • AHT: {selectedAssociate.ahtMinutes}m
                    </div>
                  </div>
                </div>

                {/* 6-Month Historical Scorecard Trend */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>6-Month Composite & Quality Trend</span>
                    <span className="text-[11px] text-slate-400">Jun – Nov 2026</span>
                  </div>
                  <div className="grid grid-cols-6 gap-2 pt-2 items-end h-28 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    {selectedAssociate.history.map((h) => (
                      <div key={h.month} className="flex flex-col items-center gap-1">
                        <div className="text-[10px] text-slate-300 tabular-nums font-semibold">
                          {h.compositeScore}%
                        </div>
                        <div className="w-full bg-slate-800 rounded-t h-14 flex items-end overflow-hidden">
                          <div
                            className={`w-full rounded-t ${
                              h.compositeScore >= 95
                                ? 'bg-emerald-500'
                                : h.compositeScore >= 85
                                ? 'bg-indigo-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ height: `${Math.max(20, (h.compositeScore - 60) * 2.5)}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-400">{h.month}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Defect Driver & Governance Action Controls */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="font-semibold text-slate-200">
                    Primary Defect Driver:
                  </div>
                  <div className="text-amber-300 text-[11px]">
                    {selectedAssociate.topDefectCategory}
                  </div>
                  {selectedAssociate.bqtWeek && (
                    <div className="text-[11px] text-indigo-300">
                      BQT Status: Week {selectedAssociate.bqtWeek} of 4 Intensive Remediation
                    </div>
                  )}
                  {selectedAssociate.pipStage && (
                    <div className="text-[11px] text-rose-300 font-medium">
                      PIP Gate: {selectedAssociate.pipStage}
                    </div>
                  )}
                </div>

                {role !== 'associate' && (
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      L&D / Manager Governance Actions
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          setAssociates((prev) =>
                            prev.map((a) =>
                              a.id === selectedAssociate.id
                                ? {
                                    ...a,
                                    consecutiveWeeksBelowQa: 1,
                                    governanceStage: 'Defect-Based Training (1-2 Wks Below QA)',
                                  }
                                : a
                            )
                          );
                          triggerToast(
                            `Triggered 1-Week Below QA -> Defect-Based Training for ${selectedAssociate.name}.`
                          );
                        }}
                        className="px-2.5 py-2 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/40 text-indigo-300 text-[11px] font-semibold"
                      >
                        1 Wk: Defect Training
                      </button>
                      <button
                        onClick={() => {
                          setAssociates((prev) =>
                            prev.map((a) =>
                              a.id === selectedAssociate.id
                                ? {
                                    ...a,
                                    consecutiveWeeksBelowQa: 3,
                                    governanceStage: 'BQT (3 Consecutive Wks Below QA)',
                                    bqtWeek: 1,
                                  }
                                : a
                            )
                          );
                          triggerToast(
                            `Enrolled ${selectedAssociate.name} in BQT (3 Consecutive Weeks Below QA).`
                          );
                        }}
                        className="px-2.5 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[11px] font-semibold"
                      >
                        3 Wks: Enroll BQT
                      </button>
                      <button
                        onClick={() => {
                          setAssociates((prev) =>
                            prev.map((a) =>
                              a.id === selectedAssociate.id
                                ? {
                                    ...a,
                                    consecutiveWeeksBelowQa: 4,
                                    pipDaysRemaining: 15,
                                    governanceStage: 'PIP - 15 Days (4 Consecutive Wks Below QA)',
                                    pipStage: 'Day 1 of 15 — Daily 100% Pre-Bill QA Audit Gate',
                                  }
                                : a
                            )
                          );
                          triggerToast(
                            `Initiated formal 15-Day PIP for ${selectedAssociate.name} (4 Consecutive Weeks Below QA).`
                          );
                        }}
                        className="px-2.5 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-[11px] font-semibold"
                      >
                        4 Wks: 15-Day PIP
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setAssociates((prev) =>
                          prev.map((a) =>
                            a.id === selectedAssociate.id
                              ? {
                                  ...a,
                                  consecutiveWeeksBelowQa: 0,
                                  pipDaysRemaining: undefined,
                                  governanceStage: 'Core Performer (Q2-Q3)',
                                  bqtWeek: undefined,
                                  pipStage: undefined,
                                }
                              : a
                          )
                        );
                        triggerToast(
                          `Graduated ${selectedAssociate.name} to Core Performer (Q2-Q3) after meeting SLA gate!`
                        );
                      }}
                      className="w-full py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold"
                    >
                      Graduate from DBT/BQT/PIP to Core Performer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: QUALITY AUDITS, ERROR REBUTTALS & CALIBRATION ENGINE
           ===================================================================== */}
        {activeTab === 'quality' && (
          <div className="space-y-6">
            {/* Header & Log Defect Trigger */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-indigo-400" />
                  RCM Quality Audits, Two-Way Error Rebuttals & Calibration Engine
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Transparent claim-level defect tracking, associate rebuttal adjudication, and QA-Trainer-Ops calibration
                </p>
              </div>
              {role !== 'associate' && (
                <button
                  onClick={() => setShowNewDefectForm((prev) => !prev)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showNewDefectForm ? 'Close Audit Form' : 'Log New Claim Audit Defect'}</span>
                </button>
              )}
            </div>

            {/* Collapsible Log New QA Defect Form */}
            {showNewDefectForm && (
              <form
                onSubmit={handleCreateNewDefect}
                className="bg-slate-900 border border-indigo-500/50 rounded-2xl p-5 space-y-4"
              >
                <div className="text-sm font-bold text-white">
                  Log New Claim-Level QA Defect (Auto-Assigns Defect-Based Weekly Training)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Associate</label>
                    <select
                      value={newDefectAssocId}
                      onChange={(e) => setNewDefectAssocId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    >
                      {associates.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.tower})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Claim / Account #</label>
                    <input
                      type="text"
                      value={newDefectClaimId}
                      onChange={(e) => setNewDefectClaimId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Payer</label>
                    <input
                      type="text"
                      value={newDefectPayer}
                      onChange={(e) => setNewDefectPayer(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">CARC / CPT Error Category</label>
                    <select
                      value={newDefectCode}
                      onChange={(e) => setNewDefectCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="CO-197 / Prior Auth Missing">CO-197 / Prior Auth Missing</option>
                      <option value="CO-29 / Timely Filing Breach">CO-29 / Timely Filing Breach</option>
                      <option value="Modifier -25 / -59 Unbundling">Modifier -25 / -59 Unbundling</option>
                      <option value="HIPAA 3-Point Verification Skip">HIPAA 3-Point Verification Skip</option>
                      <option value="CO-22 / COB Primary-Secondary Error">CO-22 / COB Primary-Secondary Error</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Defect Severity</label>
                    <select
                      value={newDefectSeverity}
                      onChange={(e) =>
                        setNewDefectSeverity(
                          e.target.value as 'Critical (Fatal)' | 'Major' | 'Minor'
                        )
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="Major">Major (-6 pts)</option>
                      <option value="Critical (Fatal)">Critical / Fatal (-15 pts)</option>
                      <option value="Minor">Minor (-3 pts)</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 w-full text-xs">
                    <label className="block text-slate-300 mb-1">Auditor Finding & Root Cause Notes</label>
                    <input
                      type="text"
                      placeholder="Describe claim error (e.g., Evicore auth # not attached on arthroscopy reconsideration)..."
                      value={newDefectFinding}
                      onChange={(e) => setNewDefectFinding(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shrink-0"
                  >
                    Save Audit & Trigger Training
                  </button>
                </div>
              </form>
            )}

            {/* Claim-Level Audit Defects & Rebuttal Cards */}
            <div className="space-y-4">
              {filteredDefects.map((def) => {
                const sevStyle =
                  def.severity === 'Critical (Fatal)'
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                    : def.severity === 'Major'
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                    : 'bg-sky-500/15 text-sky-300 border-sky-500/40';

                const rebStyle =
                  def.rebuttalStatus === 'Rebuttal Accepted'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                    : def.rebuttalStatus === 'Rebuttal Pending'
                    ? 'bg-amber-500/20 text-amber-200 border-amber-500/50'
                    : def.rebuttalStatus === 'Escalated to Calibration'
                    ? 'bg-purple-500/20 text-purple-200 border-purple-500/50'
                    : def.rebuttalStatus === 'Rebuttal Rejected'
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700';

                return (
                  <div
                    key={def.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-indigo-300">
                            {def.id} • Claim {def.claimId}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${sevStyle}`}>
                            {def.severity} (-{def.scoreImpact} pts)
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${rebStyle}`}>
                            {def.rebuttalStatus}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-white">
                          {def.errorCode}: {def.errorCategory}
                        </div>
                        <div className="text-xs text-slate-400">
                          Associate: <strong className="text-slate-200">{def.associateName}</strong> • Tower:{' '}
                          <span className="text-indigo-300">{def.tower}</span> • Specialty: {def.specialty} • Payer:{' '}
                          <span className="text-slate-200">{def.payer}</span>
                        </div>
                      </div>

                      {def.autoAssignedTrainingTitle && (
                        <div className="px-3 py-1.5 rounded-xl bg-indigo-950/70 border border-indigo-500/30 text-xs flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                          <div>
                            <div className="text-[10px] uppercase text-indigo-300 font-semibold">
                              Auto-Assigned Defect Training
                            </div>
                            <div className="text-slate-200 font-medium">
                              {def.autoAssignedTrainingTitle}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* QA Finding Box */}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 text-xs space-y-1">
                      <div className="text-slate-400 font-medium">
                        QA Auditor Finding ({def.auditorName} on {def.auditDate}):
                      </div>
                      <p className="text-slate-200 leading-relaxed">{def.auditFinding}</p>
                    </div>

                    {/* Associate Rebuttal & QA Resolution Box */}
                    {def.associateRebuttalReason && (
                      <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-1">
                        <div className="text-amber-300 font-semibold">
                          Associate Rebuttal Justification:
                        </div>
                        <p className="text-slate-200">{def.associateRebuttalReason}</p>
                        {def.qaResolutionComment && (
                          <div className="pt-2 mt-2 border-t border-amber-500/20 text-indigo-200">
                            <strong>QA / Calibration Decision:</strong> {def.qaResolutionComment}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Controls: Associate Can File Rebuttal; QA/Admin Can Adjudicate */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      {def.rebuttalStatus === 'No Rebuttal' && (
                        <div className="flex-1 flex flex-wrap items-center gap-2">
                          <input
                            type="text"
                            placeholder="Raise Rebuttal: Cite SOP code, Payer Flash Update, or EOB notes..."
                            value={rebuttalDrafts[def.id] || ''}
                            onChange={(e) =>
                              setRebuttalDrafts((prev) => ({ ...prev, [def.id]: e.target.value }))
                            }
                            className="flex-1 min-w-[240px] bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                          />
                          <button
                            onClick={() => handleRaiseRebuttal(def.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white"
                          >
                            Submit Error Rebuttal
                          </button>
                        </div>
                      )}

                      {role !== 'associate' && def.rebuttalStatus === 'Rebuttal Pending' && (
                        <div className="flex-1 flex flex-wrap items-center gap-2">
                          <input
                            type="text"
                            placeholder="Add QA adjudication or calibration note..."
                            value={qaNotesDraft[def.id] || ''}
                            onChange={(e) =>
                              setQaNotesDraft((prev) => ({ ...prev, [def.id]: e.target.value }))
                            }
                            className="flex-1 min-w-[220px] bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                          />
                          <button
                            onClick={() => handleResolveRebuttal(def.id, 'Rebuttal Accepted')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white"
                          >
                            Accept & Restore Score
                          </button>
                          <button
                            onClick={() => handleResolveRebuttal(def.id, 'Rebuttal Rejected')}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white"
                          >
                            Reject Rebuttal
                          </button>
                          <button
                            onClick={() =>
                              handleResolveRebuttal(def.id, 'Escalated to Calibration')
                            }
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white"
                          >
                            Send to Calibration
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calibration Sessions Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Error & Rebuttal Calibration Sessions (QA + L&D Trainers + Operations)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Measures audit variance reduction and converts disputed rebuttals into SOP updates
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newCal: CalibrationSession = {
                      id: `CAL-${Math.floor(304 + Math.random() * 90)}`,
                      title: `${
                        selectedSpecialty === 'All Specialties'
                          ? 'Multi-Specialty'
                          : selectedSpecialty
                      } Denials & Coding Calibration Huddle`,
                      scheduledDate: '2026-11-14 15:00 IST',
                      tower:
                        selectedTower === 'All Towers' ? 'Denials Management' : selectedTower,
                      specialty:
                        selectedSpecialty === 'All Specialties'
                          ? 'Orthopedics & Sports Med'
                          : selectedSpecialty,
                      facilitator: 'Samrat Bose & Deepa Madhavan',
                      participantsCount: 16,
                      claimsCalibrated: 12,
                      preSessionVariancePct: 16.0,
                      postSessionAgreementPct: 97.5,
                      status: 'Scheduled',
                      keyOutcome:
                        'Scheduled to calibrate disputed CO-197 and CO-50 rebuttals from this week.',
                    };
                    setCalibrations((prev) => [newCal, ...prev]);
                    triggerToast(`Scheduled new Calibration Session ${newCal.id} with QA, L&D & Ops leads.`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold"
                >
                  + Schedule Calibration Session
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-950/60">
                      <th className="py-3 px-4">Session & Tower</th>
                      <th className="py-3 px-4">Date & Facilitator</th>
                      <th className="py-3 px-4 text-right">Claims</th>
                      <th className="py-3 px-4 text-right">Pre-Cal Variance</th>
                      <th className="py-3 px-4 text-right">Post-Cal Alignment</th>
                      <th className="py-3 px-4">SOP / Playbook Calibration Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {calibrations.map((cal) => (
                      <tr key={cal.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{cal.title}</div>
                          <div className="text-[11px] text-indigo-300">
                            {cal.id} • {cal.tower} ({cal.specialty})
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-slate-200">{cal.scheduledDate}</div>
                          <div className="text-[11px] text-slate-400">{cal.facilitator}</div>
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums">{cal.claimsCalibrated}</td>
                        <td className="py-3 px-4 text-right tabular-nums text-amber-300">
                          {cal.preSessionVariancePct}%
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums font-bold text-emerald-400">
                          {cal.postSessionAgreementPct}%
                        </td>
                        <td className="py-3 px-4 text-slate-300 max-w-md">{cal.keyOutcome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 5: CONTINUOUS LEARNING, DEFECT-BASED WEEKLY MODULES & PKT
           ===================================================================== */}
        {activeTab === 'learning' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  Continuous Learning Hub: Defect-Based Weekly Training, BQT Modules & Monthly PKTs
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Targeted weekly micro-courses automatically assigned to associates below Quality SLA, in BQT/PIP, or taking monthly PKT certifications
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {canOpenAdminStudio && (
                <button
                  onClick={() => openAdminStudio('courses')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create New Course</span>
                </button>
                )}
                <button
                  onClick={() =>
                    triggerToast(
                      'Triggered automated Weekly Defect Training assignment for all associates with <97.5% Quality SLA this week.'
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Auto-Assign Weekly Defect Training Cohort</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {learningModules.map((mod) => {
                const catBadge =
                  mod.category === 'Defect-Triggered Weekly'
                    ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                    : mod.category === 'BQT Intensive Remediation'
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    : mod.category === 'PIP Milestone Assessment'
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';

                return (
                  <div
                    key={mod.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${catBadge}`}
                        >
                          {mod.category}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {mod.id} • {mod.durationMins} mins • Pass: {mod.passMarksPct}%
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white">{mod.title}</h3>
                        <p className="text-xs text-indigo-300 mt-0.5">
                          Tower: {mod.tower} • Specialty: {mod.specialty}
                        </p>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{mod.summary}</p>

                      <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] space-y-1">
                        <div className="font-semibold text-amber-300">
                          Automated Assignment Rule:
                        </div>
                        <div className="text-slate-300">{mod.triggerCondition}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[11px] font-semibold text-slate-400">
                          Key RCM Takeaways:
                        </div>
                        <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                          {mod.keyTakeaways.map((kt, idx) => (
                            <li key={idx} className="leading-snug">
                              {kt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                      <div className="text-xs text-slate-400 tabular-nums">
                        Assigned: <strong className="text-white">{mod.assignedAssociatesCount}</strong> • Completion:{' '}
                        <strong className="text-emerald-400">{mod.completionRatePct}%</strong>
                      </div>
                      <button
                        onClick={() => openModuleQuiz(mod)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Launch Module & PKT Quiz</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 6: ANNUAL MANDATORY COMPLIANCE (HIPAA, POSH, FWA, INFOSEC)
           ===================================================================== */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            {/* Statutory Banner */}
            <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-indigo-950/50 border border-emerald-500/30 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base font-bold text-white">
                    Annual Mandatory Statutory & Regulatory Compliance Center (HIPAA, POSH, CMS FWA, InfoSec)
                  </h2>
                </div>
                <p className="text-xs text-slate-300">
                  100% annual certification is mandatory for all RCM employees handling Protected Health Information (PHI) and working across physical/virtual shifts.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() =>
                    triggerToast(
                      'Sent automated escalation reminders to 26 overdue associates and their Team Leads for Annual HIPAA & POSH completion.'
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold"
                >
                  Trigger Overdue Escalation Alerts
                </button>
                <button
                  onClick={() => {
                    setComplianceCourses((prev) =>
                      prev.map((c) => ({
                        ...c,
                        orgCompletionPct: Math.min(100, Number((c.orgCompletionPct + 0.5).toFixed(1))),
                      }))
                    );
                    triggerToast(
                      'Assigned 2026 Annual Mandatory Compliance Bundle (HIPAA + POSH + FWA + InfoSec + Ethics) to all active RCM rosters.'
                    );
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Assign Annual Compliance Bundle to All Projects
                </button>
              </div>
            </div>

            {/* Mandatory Courses Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {complianceCourses.map((course) => {
                const isCertified = course.associateStatus === 'Completed & Certified';
                return (
                  <div
                    key={course.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          {course.code} • {course.validityPeriod}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            isCertified
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {course.associateStatus}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white">{course.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Authority: <span className="text-slate-200">{course.regulatoryAuthority}</span> • Due:{' '}
                          <span className="text-amber-300 font-medium">{course.dueDate}</span>
                        </p>
                      </div>

                      {/* Policy Highlights */}
                      <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
                        <div className="text-[11px] font-semibold text-slate-300">
                          Mandatory Policy & Audit Requirements:
                        </div>
                        <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                          {course.policyHighlights.map((ph, i) => (
                            <li key={i} className="leading-snug">
                              {ph}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Org Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">
                            Organization Completion Rate ({course.orgOverdueCount} Overdue)
                          </span>
                          <span className="font-bold text-emerald-400 tabular-nums">
                            {course.orgCompletionPct}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${course.orgCompletionPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-slate-400">
                        {isCertified ? (
                          <span>
                            Score: <strong className="text-emerald-400">{course.associateScore}%</strong> • Cert ID:{' '}
                            <span className="font-mono text-slate-200">{course.certificateId}</span>
                          </span>
                        ) : (
                          <span>
                            Pass Threshold: <strong className="text-white">{course.passThresholdPct}%</strong> ({course.durationMins} mins)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isCertified && (
                          <button
                            onClick={() => openCertificateModal(course)}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Award className="w-4 h-4" />
                            <span>View Certificate</span>
                          </button>
                        )}
                        <button
                          onClick={() => openComplianceQuiz(course)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>{isCertified ? 'Retake Recertification' : 'Complete Mandatory Exam'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 7: SOPS, PLAYBOOKS, PROCESS UPDATES & TRAINER SAM AI CO-PILOT
           ===================================================================== */}
        {activeTab === 'knowledge' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: SOPs, Client Playbooks & Process Update Flashes */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-400" />
                      RCM SOPs, Specialty Playbooks & Urgent Process Updates
                    </h2>
                    <p className="text-xs text-slate-400">
                      Search by CARC/RARC code (e.g., CO-197, CO-4, PR-1), CPT, Modifier, or Payer
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search SOPs, Playbooks, CARC/RARC codes (CO-197, Modifier -25, POS 10, Colonoscopy)..."
                    value={sopSearch}
                    onChange={(e) => setSopSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* SOP Pills List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {filteredSops.map((item) => {
                    const isActive = item.id === selectedSop.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedSop(item)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isActive
                            ? 'bg-indigo-600/15 border-indigo-500 text-white'
                            : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 text-[10px]">
                          <span className="font-mono font-bold text-indigo-300">{item.docCode}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-semibold ${
                              item.acknowledgedByCurrentUser
                                ? 'bg-emerald-500/15 text-emerald-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {item.acknowledgedByCurrentUser ? 'Acknowledged' : 'Unread Flash'}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-white mt-1 line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {item.tower} • {item.specialty}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Playbook Reader */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300">
                        {selectedSop.docType}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {selectedSop.docCode} • Updated {selectedSop.updatedAt}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5">{selectedSop.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tower: <strong className="text-slate-200">{selectedSop.tower}</strong> • Specialty:{' '}
                      <strong className="text-indigo-300">{selectedSop.specialty}</strong> • Payers:{' '}
                      {selectedSop.payerFocus}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAcknowledgeSop(selectedSop.id)}
                    disabled={selectedSop.acknowledgedByCurrentUser}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
                      selectedSop.acknowledgedByCurrentUser
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 cursor-default'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {selectedSop.acknowledgedByCurrentUser
                        ? `Signed Read-Receipt (${selectedSop.readAckPct}% Team)`
                        : 'Acknowledge Process Update'}
                    </span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{selectedSop.summary}</p>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-white">
                    Standard Operating Step-by-Step Workflow:
                  </div>
                  <div className="space-y-2">
                    {selectedSop.stepByStepGuide.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed"
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/30 space-y-1.5">
                  <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Common QA Audit Pitfalls to Avoid:</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                    {selectedSop.commonPitfalls.map((pit, idx) => (
                      <li key={idx}>{pit}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 mr-1">Related CARC/RARC Codes:</span>
                  {selectedSop.relatedCarcRarcCodes.map((code) => (
                    <span
                      key={code}
                      className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-[11px]"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Trainer Sam AI RCM Co-Pilot */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-indigo-500/40 rounded-2xl flex flex-col h-[700px] overflow-hidden">
              <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-indigo-950/80 to-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Trainer Sam AI — RCM Co-Pilot</h3>
                    <p className="text-[11px] text-indigo-300">
                      Instant CARC/RARC, Modifier, Playbook & BQT/PIP Guidance
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  HIPAA-Sandboxed
                </span>
              </div>

              {/* Quick Prompts */}
              <div className="p-3 border-b border-slate-800 bg-slate-950/60">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">
                  One-Click RCM & L&D Prompts:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_AI_PROMPTS.map((qp) => (
                    <button
                      key={qp}
                      onClick={() => handleSendAiQuery(qp)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-200 transition-colors text-left"
                    >
                      {qp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {aiMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[92%] rounded-2xl p-3.5 text-xs space-y-2 ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-950 border border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 text-[10px] opacity-75">
                        <span className="font-semibold">
                          {msg.sender === 'user' ? 'You' : 'Trainer Sam AI'}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>

                      {msg.actionableSteps && (
                        <ul className="space-y-1.5 pt-1 border-t border-slate-800/80 text-[11px] text-slate-300">
                          {msg.actionableSteps.map((st, i) => (
                            <li key={i} className="leading-snug">
                              • {st}
                            </li>
                          ))}
                        </ul>
                      )}

                      {msg.citations && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {msg.citations.map((cit) => (
                            <span
                              key={cit}
                              className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px]"
                            >
                              Source: {cit}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendAiQuery();
                }}
                className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask about CO-197, CO-29, Modifier -25, HIPAA verification, BQT rules..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
                  aria-label="Send AI question"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
      </div>

      {/* =====================================================================
          NATIVE <DIALOG> MODAL 1: INTERACTIVE COURSE & COMPLIANCE QUIZ ENGINE
         ===================================================================== */}
      <dialog
        ref={quizDialogRef}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeQuizDialog();
        }}
        className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 p-0 shadow-2xl"
      >
        {(activeQuizModule || activeComplianceQuiz) && (
          <div className="p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                  {activeComplianceQuiz
                    ? `Annual Mandatory Compliance Exam • ${activeComplianceQuiz.code}`
                    : `RCM Continuous Learning & PKT • ${activeQuizModule?.id}`}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {activeComplianceQuiz ? activeComplianceQuiz.title : activeQuizModule?.title}
                </h3>
              </div>
              <button
                onClick={closeQuizDialog}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {(activeComplianceQuiz
                ? activeComplianceQuiz.questions
                : activeQuizModule?.questions || []
              ).map((q, qIdx) => {
                const selectedOpt = quizAnswers[q.id];
                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="text-xs font-bold text-white">
                      Q{qIdx + 1}. {q.question}
                    </div>
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const isPicked = selectedOpt === oIdx;
                        const isCorrect = q.correctIndex === oIdx;
                        let btnClass =
                          'border-slate-800 bg-slate-900/90 text-slate-300 hover:border-slate-700';
                        if (quizSubmitted) {
                          if (isCorrect) {
                            btnClass =
                              'border-emerald-500 bg-emerald-500/15 text-emerald-200 font-semibold';
                          } else if (isPicked && !isCorrect) {
                            btnClass = 'border-rose-500 bg-rose-500/15 text-rose-200';
                          }
                        } else if (isPicked) {
                          btnClass = 'border-indigo-500 bg-indigo-600/20 text-white font-semibold';
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={quizSubmitted}
                            onClick={() =>
                              setQuizAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                            }
                            className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${btnClass}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {quizSubmitted && (
                      <div className="p-2.5 rounded-lg bg-indigo-950/50 border border-indigo-500/30 text-[11px] text-indigo-200">
                        <strong>SOP Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Minimum Passing Score:{' '}
                <strong className="text-white">
                  {activeComplianceQuiz
                    ? activeComplianceQuiz.passThresholdPct
                    : activeQuizModule?.passMarksPct}
                  %
                </strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeQuizDialog}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Close
                </button>
                {!quizSubmitted && (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white"
                  >
                    Submit & Grade Assessment
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </dialog>

      {/* =====================================================================
          NATIVE <DIALOG> MODAL 2: VERIFIABLE ANNUAL COMPLIANCE CERTIFICATE
         ===================================================================== */}
      <dialog
        ref={certDialogRef}
        onClick={(e) => {
          if (e.target === e.currentTarget) certDialogRef.current?.close();
        }}
        className="w-full max-w-xl rounded-2xl bg-slate-900 border border-emerald-500/50 text-slate-100 p-0 shadow-2xl"
      >
        {certificateCourse && (
          <div className="p-6 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <div className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold">
                Verifiable Statutory & RCM Compliance Certificate
              </div>
              <h3 className="text-xl font-extrabold text-white">{certificateCourse.title}</h3>
              <p className="text-xs text-slate-400">{certificateCourse.regulatoryAuthority}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div>
                Certified Associate:{' '}
                <strong className="text-white">Aarav Sharma (Emp #RCM-4082)</strong>
              </div>
              <div>
                Assessment Score:{' '}
                <strong className="text-emerald-400">{certificateCourse.associateScore}%</strong>{' '}
                (Threshold: {certificateCourse.passThresholdPct}%)
              </div>
              <div>
                Completed On: <span className="text-slate-200">{certificateCourse.completedDate}</span> • Valid Through:{' '}
                <span className="text-amber-300">Annual Cycle (365 Days)</span>
              </div>
              <div className="font-mono text-[11px] text-indigo-300 pt-1">
                Verification Hash / ID: {certificateCourse.certificateId}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => certDialogRef.current?.close()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Print / Save PDF Certificate</span>
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
export default App;
