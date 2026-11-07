import React, { useState, useMemo } from 'react';
import { BRAND_FULL_TITLE, BRAND_TAGLINE } from '../config/brand';
import {
  Activity,
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  FileSpreadsheet,
  Flame,
  Folder,
  FolderOpen,
  Gamepad2,
  GraduationCap,
  Layers,
  Play,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserPlus,
  Users,
  UsersRound,
} from 'lucide-react';
import {
  AssociateProfile,
  MandatoryComplianceCourse,
  ProjectHealth,
  ProjectQuestionBankItem,
  ProjectWeeklyAssessment,
  ProviderSpecialty,
  RcmTower,
  SopPlaybookItem,
  UserGroup,
  WeeklyAssessmentPillar,
} from '../types/rcm';
import {
  ClientSpecificArModule,
  CsTraineeEnrollmentRecord,
} from './ClientSpecificTrainingHub';

// ============================================================================
// SHARED TYPES FOR THE 5 DIMENSIONS
// ============================================================================

export type AppDimensionId =
  | 'dim_org_learning'
  | 'dim_process_intell'
  | 'dim_nht_training'
  | 'dim_cs_training'
  | 'dim_games_hub';

export type EnterprisePersona = 'admin' | 'operations' | 'trainer' | 'associate';

export interface TalentUpskillCourse {
  id: string;
  code: string;
  title: string;
  skillTrack:
    | 'AAPC / AHIMA Coding Mastery'
    | 'Advanced AR & Denial Analytics'
    | 'RCM Team Lead & Operations Leadership'
    | 'AI & Automation in Medical Billing'
    | 'Payer Contracting & Value-Based Care';
  targetAudience: string;
  durationHours: number;
  level: 'Foundation' | 'Intermediate' | 'Advanced Specialist';
  assignedProjectIds: string[];
  assignedGroupIds: string[];
  enrolledUserIds: string[];
  completionRatePct: number;
  avgScorePct: number;
  badgeAwarded: string;
  trainerOwner: string;
}

export interface NhtBatchRecord {
  id: string;
  batchCode: string;
  batchName: string;
  nhtTrack: 'NHT - Billing' | 'NHT - AR' | 'NHT - Coding';
  targetProjectId: string;
  targetProjectName: string;
  specialty: ProviderSpecialty;
  tower: RcmTower;
  assignedTrainer: string;
  trainingLead: string;
  operationsManager: string;
  userGroupId: string;
  startDate: string;
  targetGraduationDate: string;
  currentDay: number;
  totalDays: number;
  status: 'In Classroom' | 'Mock System Practice' | 'Final NHT Gate Exam' | 'Graduated → Moved to CS';
  trainees: {
    traineeId: string;
    traineeName: string;
    hireType: 'Fresher NHT' | 'Campus Hire' | 'Junior Lateral';
    attendancePct: number;
    fundamentalsScorePct: number;
    mockBillingScorePct: number;
    finalNhtGatePct: number;
    graduatedToCs: boolean;
  }[];
}

export const INITIAL_TALENT_UPSKILL_COURSES: TalentUpskillCourse[] = [
  {
    id: 'UPSKILL-01',
    code: 'TU-CPC-2026',
    title: 'Multi-Specialty Surgical & Interventional CPT / Modifier Mastery',
    skillTrack: 'AAPC / AHIMA Coding Mastery',
    targetAudience: 'Coding & Charge Entry Specialists',
    durationHours: 18,
    level: 'Advanced Specialist',
    assignedProjectIds: ['PRJ-CARD-01', 'PRJ-ORTHO-02', 'PRJ-GASTRO-03'],
    assignedGroupIds: ['GRP-CODING-ALL', 'GRP-ORTHO-AR'],
    enrolledUserIds: ['ASSOC-101', 'ASSOC-102', 'ASSOC-105'],
    completionRatePct: 86,
    avgScorePct: 92,
    badgeAwarded: 'Specialty Modifier Architect',
    trainerOwner: 'Ananya Iyer',
  },
  {
    id: 'UPSKILL-02',
    code: 'TU-DEN-2026',
    title: 'Root-Cause Denial Analytics & Clinical Appeal Drafting',
    skillTrack: 'Advanced AR & Denial Analytics',
    targetAudience: 'AR Follow-Up, Denials & Appeals Analysts',
    durationHours: 14,
    level: 'Intermediate',
    assignedProjectIds: ['PRJ-ORTHO-02', 'PRJ-CARD-01', 'PRJ-MULT-04'],
    assignedGroupIds: ['GRP-ORTHO-AR', 'GRP-CARD-DEN'],
    enrolledUserIds: ['ASSOC-101', 'ASSOC-103', 'ASSOC-104'],
    completionRatePct: 79,
    avgScorePct: 89,
    badgeAwarded: 'Appeals Overturn Strategist',
    trainerOwner: 'Ritu Chatterjee',
  },
  {
    id: 'UPSKILL-03',
    code: 'TU-LEAD-2026',
    title: 'RCM Operations Team Lead Bootcamp: SLA Governance & Calibration',
    skillTrack: 'RCM Team Lead & Operations Leadership',
    targetAudience: 'Senior Associates, SMEs & Aspiring Team Leads',
    durationHours: 20,
    level: 'Advanced Specialist',
    assignedProjectIds: ['PRJ-CARD-01', 'PRJ-MULT-04', 'PRJ-RAD-05'],
    assignedGroupIds: ['GRP-CARD-DEN'],
    enrolledUserIds: ['ASSOC-102', 'ASSOC-106'],
    completionRatePct: 91,
    avgScorePct: 94,
    badgeAwarded: 'RCM Operational Excellence Lead',
    trainerOwner: 'Vikramaditya Rao',
  },
  {
    id: 'UPSKILL-04',
    code: 'TU-AI-2026',
    title: 'Generative AI Co-Pilot for Payer Policy Lookup & Claim Scrubbing',
    skillTrack: 'AI & Automation in Medical Billing',
    targetAudience: 'All RCM Towers & Quality Auditors',
    durationHours: 8,
    level: 'Foundation',
    assignedProjectIds: ['PRJ-CARD-01', 'PRJ-ORTHO-02', 'PRJ-GASTRO-03', 'PRJ-RAD-05'],
    assignedGroupIds: ['GRP-ORTHO-AR', 'GRP-CODING-ALL', 'GRP-NEW-HIRE'],
    enrolledUserIds: ['ASSOC-101', 'ASSOC-102', 'ASSOC-103', 'ASSOC-105', 'ASSOC-106'],
    completionRatePct: 95,
    avgScorePct: 96,
    badgeAwarded: 'AI-Powered RCM Practitioner',
    trainerOwner: 'Karthik Sundaram',
  },
];

export const INITIAL_NHT_BATCHES: NhtBatchRecord[] = [
  {
    id: 'NHT-B-101',
    batchCode: 'NHT-AR-2026-11A',
    batchName: 'Cohort 11A — Foundation AR, EOB Reading & Denial Workflow',
    nhtTrack: 'NHT - AR',
    targetProjectId: 'PRJ-ORTHO-02',
    targetProjectName: 'Summit Ortho & Spine Group',
    specialty: 'Orthopedics & Sports Med',
    tower: 'Denials Management',
    assignedTrainer: 'Ritu Chatterjee',
    trainingLead: 'Vikramaditya Rao',
    operationsManager: 'Suresh Menon',
    userGroupId: 'GRP-NEW-HIRE',
    startDate: '2026-10-22',
    targetGraduationDate: '2026-11-09',
    currentDay: 11,
    totalDays: 12,
    status: 'Final NHT Gate Exam',
    trainees: [
      {
        traineeId: 'NHT-TR-301',
        traineeName: 'Pranav Kulkarni',
        hireType: 'Fresher NHT',
        attendancePct: 100,
        fundamentalsScorePct: 92,
        mockBillingScorePct: 90,
        finalNhtGatePct: 94,
        graduatedToCs: false,
      },
      {
        traineeId: 'NHT-TR-302',
        traineeName: 'Shruti Deshmukh',
        hireType: 'Campus Hire',
        attendancePct: 96,
        fundamentalsScorePct: 89,
        mockBillingScorePct: 91,
        finalNhtGatePct: 91,
        graduatedToCs: false,
      },
      {
        traineeId: 'NHT-TR-303',
        traineeName: 'Harshvardhan Joshi',
        hireType: 'Junior Lateral',
        attendancePct: 100,
        fundamentalsScorePct: 95,
        mockBillingScorePct: 93,
        finalNhtGatePct: 96,
        graduatedToCs: true,
      },
    ],
  },
  {
    id: 'NHT-B-102',
    batchCode: 'NHT-BILL-2026-11B',
    batchName: 'Cohort 11B — CMS-1500 / UB-04 Charge Entry & Clearinghouse Scrubbing',
    nhtTrack: 'NHT - Billing',
    targetProjectId: 'PRJ-CARD-01',
    targetProjectName: 'Apex Heart & Vascular Institute',
    specialty: 'Cardiology & Vascular',
    tower: 'Demographics & Charge Entry',
    assignedTrainer: 'Ananya Iyer',
    trainingLead: 'Vikramaditya Rao',
    operationsManager: 'Rajeev Malhotra',
    userGroupId: 'GRP-NEW-HIRE',
    startDate: '2026-10-28',
    targetGraduationDate: '2026-11-12',
    currentDay: 8,
    totalDays: 10,
    status: 'Mock System Practice',
    trainees: [
      {
        traineeId: 'NHT-TR-304',
        traineeName: 'Niharika Sen',
        hireType: 'Fresher NHT',
        attendancePct: 100,
        fundamentalsScorePct: 91,
        mockBillingScorePct: 88,
        finalNhtGatePct: 89,
        graduatedToCs: false,
      },
      {
        traineeId: 'NHT-TR-305',
        traineeName: 'Aakash Verma',
        hireType: 'Campus Hire',
        attendancePct: 92,
        fundamentalsScorePct: 86,
        mockBillingScorePct: 85,
        finalNhtGatePct: 87,
        graduatedToCs: false,
      },
    ],
  },
  {
    id: 'NHT-B-103',
    batchCode: 'NHT-CODE-2026-10C',
    batchName: 'Cohort 10C — ICD-10-CM, CPT-4, HCPCS & NCCI Edits Bootcamp',
    nhtTrack: 'NHT - Coding',
    targetProjectId: 'PRJ-GASTRO-03',
    targetProjectName: 'Midwest Gastro & Endoscopy Associates',
    specialty: 'Gastroenterology',
    tower: 'Medical Coding',
    assignedTrainer: 'Ananya Iyer',
    trainingLead: 'Vikramaditya Rao',
    operationsManager: 'Rajeev Malhotra',
    userGroupId: 'GRP-CODING-ALL',
    startDate: '2026-10-10',
    targetGraduationDate: '2026-10-29',
    currentDay: 14,
    totalDays: 14,
    status: 'Graduated → Moved to CS',
    trainees: [
      {
        traineeId: 'NHT-TR-306',
        traineeName: 'Divya Krishnan',
        hireType: 'Fresher NHT',
        attendancePct: 100,
        fundamentalsScorePct: 96,
        mockBillingScorePct: 94,
        finalNhtGatePct: 95,
        graduatedToCs: true,
      },
      {
        traineeId: 'NHT-TR-307',
        traineeName: 'Siddharth Nair',
        hireType: 'Junior Lateral',
        attendancePct: 98,
        fundamentalsScorePct: 93,
        mockBillingScorePct: 92,
        finalNhtGatePct: 94,
        graduatedToCs: true,
      },
    ],
  },
];

// ============================================================================
// CURIOSITY BRAND LOGO & VISUAL RADIAL GAUGE COMPONENTS
// ============================================================================

export const CuriosityBrandLogo: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <div
    onClick={onClick}
    title={BRAND_FULL_TITLE}
    className="flex items-center gap-3 cursor-pointer group select-none"
  >
    <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-teal-500 to-amber-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
      <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center relative overflow-hidden">
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <defs>
            <linearGradient id="curiosityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="55%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          {/* Open Learning Book Base */}
          <path
            d="M8 27C12 24.5 16.5 24.5 20 27C23.5 24.5 28 24.5 32 27V15C28 12.5 23.5 12.5 20 15C16.5 12.5 12 12.5 8 15V27Z"
            fill="url(#curiosityGrad)"
            opacity="0.18"
          />
          {/* Curiosity Compass Spark */}
          <path
            d="M20 5L23.2 14.2L32.5 17.5L23.2 20.8L20 30L16.8 20.8L7.5 17.5L16.8 14.2L20 5Z"
            fill="url(#curiosityGrad)"
          />
          <circle cx="20" cy="17.5" r="3.2" fill="#FFFFFF" />
          <circle cx="30" cy="9" r="2" fill="#F59E0B" />
        </svg>
      </div>
    </div>
    <div>
      <div className="flex items-center gap-2">
        <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-700 via-teal-600 to-amber-600 bg-clip-text text-transparent">
          Curiosity
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          {BRAND_TAGLINE}
        </span>
      </div>
    </div>
  </div>
);

export const VisualRadialGauge: React.FC<{
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
}> = ({
  value,
  size = 64,
  strokeWidth = 6,
  color = '#4F46E5',
  trackColor = '#E2E8F0',
  label,
  sublabel,
}) => {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-extrabold text-slate-900 tabular-nums">
            {Math.round(clamped)}%
          </span>
        </div>
      </div>
      {(label || sublabel) && (
        <div>
          {label && <div className="text-xs font-bold text-slate-800">{label}</div>}
          {sublabel && <div className="text-[11px] text-slate-500">{sublabel}</div>}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// OBVIOUSLY VISIBLE 5-DIMENSION VISUAL SWITCHER DECK
// ============================================================================

interface VisualDimensionSwitcherProps {
  activeDimension: AppDimensionId;
  onSelectDimension: (dim: AppDimensionId) => void;
  orgCompliancePct: number;
  avgProjectHealthPct: number;
  nhtPassPct: number;
  csCertifiedPct: number;
  activeUserPktPct: number;
}

export const VisualDimensionSwitcher: React.FC<VisualDimensionSwitcherProps> = ({
  activeDimension,
  onSelectDimension,
  orgCompliancePct,
  avgProjectHealthPct,
  nhtPassPct,
  csCertifiedPct,
  activeUserPktPct,
}) => {
  const dimensions = [
    {
      id: 'dim_org_learning' as AppDimensionId,
      num: '01',
      title: 'Organizational Learning',
      subtitle: 'Mandatory Compliance, Upskill & Reports',
      metric: orgCompliancePct,
      metricLabel: 'Compliance',
      color: '#059669',
      activeRing: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/60',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      icon: ShieldCheck,
      pills: ['Annual HIPAA/POSH', 'Talent Upskill', 'Audit CSV'],
    },
    {
      id: 'dim_process_intell' as AppDimensionId,
      num: '02',
      title: 'Process Training Intell',
      subtitle: 'Scorecards, Directories, CLP & Rebuttals',
      metric: avgProjectHealthPct,
      metricLabel: 'Proj Health',
      color: '#4F46E5',
      activeRing: 'ring-2 ring-indigo-600 border-indigo-600 bg-indigo-50/60',
      badgeBg: 'bg-indigo-100 text-indigo-800',
      icon: Activity,
      pills: ['Scorecards', 'Project Folders', 'DBT/BQT/PIP', 'Rebuttals'],
    },
    {
      id: 'dim_nht_training' as AppDimensionId,
      num: '03',
      title: 'NHT Training',
      subtitle: 'New Hire Batches, Progress, Modules & Reports',
      metric: nhtPassPct,
      metricLabel: 'Gate Score',
      color: '#D97706',
      activeRing: 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/60',
      badgeBg: 'bg-amber-100 text-amber-800',
      icon: GraduationCap,
      pills: ['NHT Batches', 'Billing/AR/Coding', 'Graduate → CS'],
    },
    {
      id: 'dim_cs_training' as AppDimensionId,
      num: '04',
      title: 'CS Trainings',
      subtitle: 'Client-Specific Batches, OJT & QCP (90%)',
      metric: csCertifiedPct,
      metricLabel: 'QCP Target',
      color: '#0284C7',
      activeRing: 'ring-2 ring-sky-500 border-sky-500 bg-sky-50/60',
      badgeBg: 'bg-sky-100 text-sky-800',
      icon: Target,
      pills: ['Lateral & NHT', 'OJT Scores', '3d/2d 90% QCP'],
    },
    {
      id: 'dim_games_hub' as AppDimensionId,
      num: '05',
      title: 'Learning Hub & Games',
      subtitle: 'CARC Blitz, Modifier Match & Leaderboard',
      metric: activeUserPktPct,
      metricLabel: 'PKT Mastery',
      color: '#7C3AED',
      activeRing: 'ring-2 ring-purple-600 border-purple-600 bg-purple-50/60',
      badgeBg: 'bg-purple-100 text-purple-800',
      icon: Gamepad2,
      pills: ['Denial Blitz', 'Modifier Match', 'Claim Detective'],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {dimensions.map((d) => {
        const Icon = d.icon;
        const isActive = activeDimension === d.id;
        return (
          <button
            key={d.id}
            onClick={() => onSelectDimension(d.id)}
            className={`group relative rounded-2xl p-3.5 text-left transition-all border shadow-sm hover:shadow-md flex flex-col justify-between gap-2.5 ${
              isActive
                ? d.activeRing
                : 'bg-white border-slate-200/90 hover:border-slate-300'
            }`}
          >
            {/* Top Row: Dimension Badge + Radial Visual Gauge */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${d.badgeBg}`}
                >
                  <Icon className="w-3 h-3" />
                  <span>DIM {d.num}</span>
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                  {d.title}
                </h3>
              </div>
              <VisualRadialGauge
                value={d.metric}
                size={46}
                strokeWidth={5}
                color={d.color}
                trackColor="#E2E8F0"
              />
            </div>

            <p className="text-[11px] text-slate-500 leading-snug line-clamp-1">
              {d.subtitle}
            </p>

            {/* Visual Feature Mini-Pills */}
            <div className="flex flex-wrap gap-1 pt-0.5">
              {d.pills.map((p) => (
                <span
                  key={p}
                  className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold"
                >
                  {p}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
};

// ============================================================================
// COMPACT RELATIONAL CONTEXT RIBBON (PROJECT ↔ USER GROUP ↔ USER ↔ OPS ↔ TRAINER ↔ ADMIN)
// ============================================================================

interface RelationalContextBarProps {
  activePersona: EnterprisePersona;
  onSelectPersona: (p: EnterprisePersona) => void;
  selectedProjectId: string;
  onSelectProjectId: (id: string) => void;
  selectedGroupId: string;
  onSelectGroupId: (id: string) => void;
  selectedUserId: string;
  onSelectUserId: (id: string) => void;
  projects: ProjectHealth[];
  userGroups: UserGroup[];
  associates: AssociateProfile[];
}

export const RelationalContextBar: React.FC<RelationalContextBarProps> = ({
  activePersona,
  onSelectPersona,
  selectedProjectId,
  onSelectProjectId,
  selectedGroupId,
  onSelectGroupId,
  selectedUserId,
  onSelectUserId,
  projects,
  userGroups,
  associates,
}) => {
  const [expandedMap, setExpandedMap] = useState(false);

  const activeProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];
  const activeUser =
    associates.find((a) => a.id === selectedUserId) || associates[0];
  const activeGroup =
    userGroups.find((g) => g.id === selectedGroupId) || userGroups[0];

  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 px-4 py-2.5 shadow-sm space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Compact Interactive Relational Selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Live Scope:</span>
          </span>

          {/* Project Pill */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[11px] font-semibold text-slate-500">Project:</span>
            <select
              aria-label="Relational Project Selector"
              value={selectedProjectId}
              onChange={(e) => onSelectProjectId(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.projectName} ({p.healthScore}%)
                </option>
              ))}
            </select>
          </div>

          {/* User Group Pill */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <UsersRound className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-[11px] font-semibold text-slate-500">Group:</span>
            <select
              aria-label="Relational User Group Selector"
              value={selectedGroupId}
              onChange={(e) => onSelectGroupId(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
            >
              {userGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Associate Pill */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] font-semibold text-slate-500">User:</span>
            <select
              aria-label="Relational Associate Selector"
              value={selectedUserId}
              onChange={(e) => onSelectUserId(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
            >
              {associates.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} (QA {a.qualityActualPct}%)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setExpandedMap((prev) => !prev)}
            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors"
          >
            <span>6-Role Chain</span>
            {expandedMap ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Clean Role Lens Switcher */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(
            [
              { id: 'admin', label: 'Admin', color: 'bg-indigo-600 keep-white-text' },
              { id: 'operations', label: 'Operations', color: 'bg-sky-600 keep-white-text' },
              { id: 'trainer', label: 'Trainer / QA', color: 'bg-amber-600 keep-white-text' },
              { id: 'associate', label: 'Associate', color: 'bg-emerald-600 keep-white-text' },
            ] as { id: EnterprisePersona; label: string; color: string }[]
          ).map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectPersona(p.id)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                activePersona === p.id
                  ? `${p.color} text-white shadow-sm`
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expandable 6-Role Visual Chain */}
      {expandedMap && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="p-2 rounded-xl bg-indigo-50/60 border border-indigo-100">
            <div className="text-[10px] font-bold uppercase text-indigo-600">Project</div>
            <div className="font-bold text-slate-900 truncate">{activeProject.projectName}</div>
            <div className="text-[10px] text-slate-500">{activeProject.specialty}</div>
          </div>
          <div className="p-2 rounded-xl bg-sky-50/60 border border-sky-100">
            <div className="text-[10px] font-bold uppercase text-sky-600">Operations Mgr</div>
            <div className="font-bold text-slate-900 truncate">{activeProject.operationsManager}</div>
            <div className="text-[10px] text-slate-500">Lead: {activeProject.reportingLead}</div>
          </div>
          <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-100">
            <div className="text-[10px] font-bold uppercase text-amber-600">Trainer & Lead</div>
            <div className="font-bold text-slate-900 truncate">{activeProject.ldTrainer}</div>
            <div className="text-[10px] text-slate-500">Lead: {activeProject.trainingLead}</div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <div className="text-[10px] font-bold uppercase text-emerald-600">QA Auditor</div>
            <div className="font-bold text-slate-900 truncate">{activeProject.assignedAuditor}</div>
            <div className="text-[10px] text-slate-500">Target: {activeProject.qualityTargetPct}%</div>
          </div>
          <div className="p-2 rounded-xl bg-purple-50/60 border border-purple-100">
            <div className="text-[10px] font-bold uppercase text-purple-600">User Group</div>
            <div className="font-bold text-slate-900 truncate">{activeGroup.name}</div>
            <div className="text-[10px] text-slate-500">{activeGroup.memberIds.length} Members</div>
          </div>
          <div className="p-2 rounded-xl bg-teal-50/60 border border-teal-100">
            <div className="text-[10px] font-bold uppercase text-teal-600">Associate</div>
            <div className="font-bold text-slate-900 truncate">{activeUser.name}</div>
            <div className="text-[10px] text-slate-500">PKT: {activeUser.pktScore}%</div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// DIMENSION 1: MONITOR ORGANIZATIONAL LEARNING (VISUAL-FIRST LIGHT THEME)
// ============================================================================

interface OrgLearningDimensionHubProps {
  complianceCourses: MandatoryComplianceCourse[];
  onStartComplianceQuiz: (course: MandatoryComplianceCourse) => void;
  onOpenCertificate: (course: MandatoryComplianceCourse) => void;
  upskillCourses: TalentUpskillCourse[];
  setUpskillCourses: React.Dispatch<React.SetStateAction<TalentUpskillCourse[]>>;
  projects: ProjectHealth[];
  userGroups: UserGroup[];
  associates: AssociateProfile[];
  selectedProjectId: string;
  selectedGroupId: string;
  selectedUserId: string;
  triggerToast: (msg: string) => void;
}

export const OrgLearningDimensionHub: React.FC<OrgLearningDimensionHubProps> = ({
  complianceCourses,
  onStartComplianceQuiz,
  onOpenCertificate,
  upskillCourses,
  setUpskillCourses,
  userGroups,
  associates,
  selectedProjectId,
  selectedGroupId,
  selectedUserId,
  triggerToast,
}) => {
  const [subView, setSubView] = useState<'compliance' | 'upskill' | 'reports'>('compliance');
  const [showAddUpskill, setShowAddUpskill] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTrack, setNewTrack] = useState<TalentUpskillCourse['skillTrack']>(
    'Advanced AR & Denial Analytics'
  );
  const [newBadge, setNewBadge] = useState('');
  const [newHours, setNewHours] = useState(12);

  const avgCompliancePct = useMemo(
    () =>
      Number(
        (
          complianceCourses.reduce((acc, c) => acc + c.orgCompletionPct, 0) /
          (complianceCourses.length || 1)
        ).toFixed(1)
      ),
    [complianceCourses]
  );

  const avgUpskillPct = useMemo(
    () =>
      Number(
        (
          upskillCourses.reduce((acc, c) => acc + c.completionRatePct, 0) /
          (upskillCourses.length || 1)
        ).toFixed(1)
      ),
    [upskillCourses]
  );

  const handleEnrollUpskill = (courseId: string) => {
    const user = associates.find((a) => a.id === selectedUserId) || associates[0];
    const group = userGroups.find((g) => g.id === selectedGroupId) || userGroups[0];
    setUpskillCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        const enrolledSet = new Set([...c.enrolledUserIds, user.id]);
        const groupSet = new Set([...c.assignedGroupIds, group.id]);
        return {
          ...c,
          enrolledUserIds: Array.from(enrolledSet),
          assignedGroupIds: Array.from(groupSet),
          completionRatePct: Math.min(100, c.completionRatePct + 3),
        };
      })
    );
    triggerToast(
      `Assigned Talent Upskill Course to ${user.name} and User Group "${group.name}".`
    );
  };

  const handleCreateUpskillCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const created: TalentUpskillCourse = {
      id: `UPSKILL-0${upskillCourses.length + 1}`,
      code: `TU-CUSTOM-${2026 + upskillCourses.length}`,
      title: newTitle.trim(),
      skillTrack: newTrack,
      targetAudience: 'Multi-Specialty RCM Associates & Analysts',
      durationHours: newHours,
      level: 'Intermediate',
      assignedProjectIds: [selectedProjectId],
      assignedGroupIds: [selectedGroupId],
      enrolledUserIds: [selectedUserId],
      completionRatePct: 100,
      avgScorePct: 93,
      badgeAwarded: newBadge.trim() || 'Certified RCM Talent Specialist',
      trainerOwner: 'Ananya Iyer',
    };
    setUpskillCourses((prev) => [created, ...prev]);
    setNewTitle('');
    setNewBadge('');
    setShowAddUpskill(false);
    triggerToast(`Created Talent Upskill Course "${created.title}" & linked to Project ${selectedProjectId}.`);
  };

  const handleExportOrgLearningCsv = () => {
    const headers = [
      'Category',
      'Course Code',
      'Title',
      'Authority / Track',
      'Completion %',
      'Pass / Avg Score %',
      'Linked Projects',
      'Linked User Groups',
    ];
    const compRows = complianceCourses.map((c) => [
      'Mandatory Annual Compliance',
      c.code,
      `"${c.title}"`,
      `"${c.regulatoryAuthority}"`,
      `${c.orgCompletionPct}%`,
      `${c.passThresholdPct}%`,
      'All 6 RCM Projects',
      'All Active User Groups',
    ]);
    const upskillRows = upskillCourses.map((u) => [
      'Talent Upskill Course',
      u.code,
      `"${u.title}"`,
      `"${u.skillTrack}"`,
      `${u.completionRatePct}%`,
      `${u.avgScorePct}%`,
      `"${u.assignedProjectIds.join('; ')}"`,
      `"${u.assignedGroupIds.join('; ')}"`,
    ]);
    const csv = [headers.join(','), ...compRows.map((r) => r.join(',')), ...upskillRows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Curiosity_Dim1_Org_Learning_Report.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Exported Dimension 1 Organizational Learning CSV Report.');
  };

  return (
    <div className="space-y-5">
      {/* Visual KPI Strip with Radial Gauges */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-8">
          <VisualRadialGauge
            value={avgCompliancePct}
            size={68}
            strokeWidth={7}
            color="#059669"
            label="Statutory Compliance"
            sublabel="HIPAA, POSH, FWA, InfoSec"
          />
          <VisualRadialGauge
            value={avgUpskillPct}
            size={68}
            strokeWidth={7}
            color="#4F46E5"
            label="Talent Upskill Tracks"
            sublabel={`${upskillCourses.length} Career Pathways Active`}
          />
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900">
                {complianceCourses.filter((c) => c.associateStatus === 'Completed & Certified').length +
                  upskillCourses.length * 6}
              </div>
              <div className="text-xs font-medium text-slate-500">Verifiable Certificates</div>
            </div>
          </div>
        </div>

        {/* Sub-Tab Segmented Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          {[
            { id: 'compliance', label: 'Mandatory Annual Compliance', icon: ShieldCheck },
            { id: 'upskill', label: 'Talent Upskill Courses', icon: Sparkles },
            { id: 'reports', label: 'Visual Reports & Export', icon: FileSpreadsheet },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSubView(tab.id as typeof subView)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  subView === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm keep-white-text'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-VIEW 1: MANDATORY ANNUAL COMPLIANCE (VISUAL RING CARDS) */}
      {subView === 'compliance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {complianceCourses.map((course) => {
            const isCertified = course.associateStatus === 'Completed & Certified';
            return (
              <div
                key={course.id}
                className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {course.code}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                        {course.title}
                      </h3>
                    </div>
                    <VisualRadialGauge
                      value={course.orgCompletionPct}
                      size={52}
                      strokeWidth={5}
                      color={isCertified ? '#059669' : '#D97706'}
                    />
                  </div>

                  {/* Visual Completion Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-slate-500">{course.regulatoryAuthority}</span>
                      <span className={isCertified ? 'text-emerald-700' : 'text-amber-700'}>
                        {course.associateStatus}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isCertified ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${course.orgCompletionPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {course.policyHighlights.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-600"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Pass Gate: <strong className="text-slate-800">{course.passThresholdPct}%</strong>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isCertified && (
                      <button
                        onClick={() => onOpenCertificate(course)}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Cert</span>
                      </button>
                    )}
                    <button
                      onClick={() => onStartComplianceQuiz(course)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 keep-white-text"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{isCertified ? 'Retake' : 'Take Exam'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-VIEW 2: TALENT UPSKILL COURSES */}
      {subView === 'upskill' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Talent Upskill & Career Progression Pathways
              </h3>
              <p className="text-xs text-slate-500">
                Visual skill tracks for Specialty Coding, Denial Analytics, AI Prompting & RCM Team Leadership.
              </p>
            </div>
            <button
              onClick={() => setShowAddUpskill((prev) => !prev)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 keep-white-text"
            >
              <Plus className="w-4 h-4" />
              <span>Add Upskill Pathway</span>
            </button>
          </div>

          {showAddUpskill && (
            <form
              onSubmit={handleCreateUpskillCourse}
              className="rounded-2xl bg-white border border-indigo-200 p-4 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-3"
            >
              <input
                type="text"
                required
                placeholder="Course Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
              />
              <select
                value={newTrack}
                onChange={(e) => setNewTrack(e.target.value as TalentUpskillCourse['skillTrack'])}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
              >
                <option value="AAPC / AHIMA Coding Mastery">AAPC / AHIMA Coding Mastery</option>
                <option value="Advanced AR & Denial Analytics">Advanced AR & Denial Analytics</option>
                <option value="RCM Team Lead & Operations Leadership">RCM Team Lead & Operations Leadership</option>
                <option value="AI & Automation in Medical Billing">AI & Automation in Medical Billing</option>
                <option value="Payer Contracting & Value-Based Care">Payer Contracting & Value-Based Care</option>
              </select>
              <input
                type="text"
                placeholder="Skill Badge Name"
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={2}
                  max={40}
                  value={newHours}
                  onChange={(e) => setNewHours(Number(e.target.value))}
                  className="w-20 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold keep-white-text"
                >
                  Save Track
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upskillCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {course.skillTrack} • {course.durationHours}h
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900">{course.title}</h4>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>{course.badgeAwarded}</span>
                    </div>
                  </div>
                  <VisualRadialGauge
                    value={course.completionRatePct}
                    size={56}
                    strokeWidth={6}
                    color="#7C3AED"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Enrolled: <strong className="text-slate-800">{course.enrolledUserIds.length} Users</strong> • Avg Score:{' '}
                    <strong className="text-emerald-600">{course.avgScorePct}%</strong>
                  </div>
                  <button
                    onClick={() => handleEnrollUpskill(course.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 keep-white-text"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Enroll User & Group</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: VISUAL ORG LEARNING ANALYTICS & EXPORT */}
      {subView === 'reports' && (
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Visual Completion Bars & Audit Export
              </h3>
              <p className="text-xs text-slate-500">
                Side-by-side visual completion across Statutory Compliance and Talent Upskill tracks.
              </p>
            </div>
            <button
              onClick={handleExportOrgLearningCsv}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 keep-white-text"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV Report</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                Mandatory Annual Compliance Tracks
              </div>
              {complianceCourses.map((c) => (
                <div key={c.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{c.code} — {c.category}</span>
                    <span className="text-emerald-600">{c.orgCompletionPct}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${c.orgCompletionPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                Talent Upskill Career Pathways
              </div>
              {upskillCourses.map((u) => (
                <div key={u.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{u.code} — {u.skillTrack}</span>
                    <span className="text-indigo-600">{u.completionRatePct}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${u.completionRatePct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// DIMENSION 2 HELPER: PROJECT DIRECTORIES FOLDER EXPLORER (VISUAL FOLDER UI)
// ============================================================================

interface ProjectDirectoriesFolderExplorerProps {
  projects: ProjectHealth[];
  selectedProjectId: string;
  onSelectProjectId: (id: string) => void;
  sops: SopPlaybookItem[];
  setSops: React.Dispatch<React.SetStateAction<SopPlaybookItem[]>>;
  questionBank: ProjectQuestionBankItem[];
  setQuestionBank: React.Dispatch<React.SetStateAction<ProjectQuestionBankItem[]>>;
  weeklyAssessments: ProjectWeeklyAssessment[];
  onAcknowledgeSop: (sopId: string) => void;
  triggerToast: (msg: string) => void;
}

export const ProjectDirectoriesFolderExplorer: React.FC<
  ProjectDirectoriesFolderExplorerProps
> = ({
  projects,
  selectedProjectId,
  onSelectProjectId,
  sops,
  setSops,
  questionBank,
  setQuestionBank,
  weeklyAssessments,
  onAcknowledgeSop,
  triggerToast,
}) => {
  const [activeFolder, setActiveFolder] = useState<
    'sops' | 'playbooks' | 'updates' | 'qbank' | 'knowledge_docs'
  >('sops');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocSummary, setNewDocSummary] = useState('');
  const [newPktQuestion, setNewPktQuestion] = useState('');

  const activeProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  const projectSops = useMemo(
    () => sops.filter((s) => s.specialty === activeProject.specialty),
    [sops, activeProject]
  );

  const projectQuestions = useMemo(
    () =>
      questionBank.filter(
        (q) =>
          q.projectId === activeProject.id ||
          q.specialty === activeProject.specialty
      ),
    [questionBank, activeProject]
  );

  const folders = [
    {
      id: 'sops' as const,
      folderName: '01_Project_SOPs',
      label: 'Project SOPs',
      count: projectSops.filter((s) => s.docType === 'SOP').length,
      accent: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      iconColor: 'text-indigo-600',
    },
    {
      id: 'playbooks' as const,
      folderName: '02_Payer_Playbooks',
      label: 'Payer Playbooks',
      count: projectSops.filter((s) => s.docType === 'Client Playbook').length,
      accent: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      iconColor: 'text-emerald-600',
    },
    {
      id: 'updates' as const,
      folderName: '03_Update_Trackers',
      label: 'Update Trackers',
      count: projectSops.filter((s) => s.docType === 'Process Update Flash').length,
      accent: 'bg-amber-50 border-amber-200 text-amber-700',
      iconColor: 'text-amber-600',
    },
    {
      id: 'qbank' as const,
      folderName: '04_Question_Banks_PKT',
      label: 'PKT Question Bank',
      count: projectQuestions.length,
      accent: 'bg-purple-50 border-purple-200 text-purple-700',
      iconColor: 'text-purple-600',
    },
    {
      id: 'knowledge_docs' as const,
      folderName: '05_Knowledge_Docs',
      label: 'EHR & Knowledge Docs',
      count:
        projectSops.filter((s) => s.docType === 'Coding & Payer Alert').length +
        weeklyAssessments.filter((w) => w.projectId === activeProject.id).length,
      accent: 'bg-sky-50 border-sky-200 text-sky-700',
      iconColor: 'text-sky-600',
    },
  ];

  const handleAddFolderItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    const docTypeMap: Record<typeof activeFolder, SopPlaybookItem['docType']> = {
      sops: 'SOP',
      playbooks: 'Client Playbook',
      updates: 'Process Update Flash',
      qbank: 'Process Update Flash',
      knowledge_docs: 'Coding & Payer Alert',
    };

    const newSop: SopPlaybookItem = {
      id: `SOP-DIR-${Date.now().toString().slice(-4)}`,
      docCode: `DIR-${activeProject.id.slice(-2)}-${Date.now().toString().slice(-3)}`,
      title: newDocTitle.trim(),
      docType: docTypeMap[activeFolder],
      specialty: activeProject.specialty,
      tower: activeProject.towers[0] || 'Denials Management',
      payerFocus: 'Multi-Payer / Project Standard',
      version: 'v1.0',
      updatedAt: '2026-11-07',
      author: activeProject.ldTrainer,
      readAckPct: 100,
      acknowledgedByCurrentUser: true,
      summary:
        newDocSummary.trim() ||
        `Project Directory document filed under ${activeProject.projectName} (${activeFolder}).`,
      stepByStepGuide: [
        `Verify payer & specialty rules for ${activeProject.projectName} (${activeProject.ehrSystem}).`,
        'Apply updated CPT/CARC documentation checklist in EHR/PMS.',
        'Log audit trail notes and complete weekly PKT verification.',
      ],
      commonPitfalls: ['Submitting claim without checking project-specific update flash.'],
      relatedCarcRarcCodes: ['CO-16', 'CO-197'],
    };

    setSops((prev) => [newSop, ...prev]);

    const pillarMap: Record<typeof activeFolder, WeeklyAssessmentPillar> = {
      sops: '2. SOP Adherence',
      playbooks: '1. Project Knowledge',
      updates: '3. Weekly Process Updates',
      qbank: '4. Weekly Errors & Defects',
      knowledge_docs: '1. Project Knowledge',
    };

    const qItem: ProjectQuestionBankItem = {
      id: `QB-DIR-${Date.now().toString().slice(-4)}`,
      projectId: activeProject.id,
      projectName: activeProject.projectName,
      specialty: activeProject.specialty,
      tower: activeProject.towers[0] || 'Denials Management',
      pillar: pillarMap[activeFolder],
      question:
        newPktQuestion.trim() ||
        `According to ${newSop.docCode} (${newSop.title}), what is the mandatory protocol for ${activeProject.projectName}?`,
      options: [
        `Follow ${newSop.title} protocol and document EHR claim notes prior to submission`,
        'Write off the claim balance without payer verification',
        'Rebill without checking NCCI edits or prior authorization',
        'Hold claim beyond timely filing limit',
      ],
      correctIndex: 0,
      explanation: `Added from Project Directory folder ${activeFolder} by ${activeProject.ldTrainer}.`,
      addedBy: activeProject.ldTrainer,
      createdAt: '2026-11-07',
    };
    setQuestionBank((prev) => [qItem, ...prev]);

    setNewDocTitle('');
    setNewDocSummary('');
    setNewPktQuestion('');
    triggerToast(
      `Added "${newSop.title}" into ${activeProject.projectName} Project Directory & synced PKT Question Bank!`
    );
  };

  return (
    <div className="space-y-5">
      {/* Visual Project Folder Header */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            <FolderOpen className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Project Knowledge Vault & Directory Tree
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {activeProject.projectName} ({activeProject.specialty})
            </h3>
            <p className="text-xs text-slate-500">
              Trainer: <strong className="text-slate-800">{activeProject.ldTrainer}</strong> • QA:{' '}
              <strong className="text-slate-800">{activeProject.assignedAuditor}</strong> • EHR:{' '}
              <strong className="text-indigo-600">{activeProject.ehrSystem}</strong>
            </p>
          </div>
        </div>

        <select
          value={selectedProjectId}
          onChange={(e) => onSelectProjectId(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              Switch Folder: {p.projectName}
            </option>
          ))}
        </select>
      </div>

      {/* 5 Visual Folder Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {folders.map((f) => {
          const isSelected = activeFolder === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFolder(f.id)}
              className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                isSelected
                  ? `${f.accent} ring-2 ring-indigo-500 shadow-md`
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                {isSelected ? (
                  <FolderOpen className={`w-7 h-7 ${f.iconColor}`} />
                ) : (
                  <Folder className={`w-7 h-7 ${f.iconColor}`} />
                )}
                <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-white border border-slate-200 text-slate-800">
                  {f.count}
                </span>
              </div>
              <div className="text-xs font-extrabold text-slate-900">{f.label}</div>
              <div className="font-mono text-[10px] text-slate-500 truncate">{f.folderName}/</div>
            </button>
          );
        })}
      </div>

      {/* Folder Content & Quick Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-extrabold text-slate-900">
              {folders.find((f) => f.id === activeFolder)?.label} ({activeProject.projectName})
            </h4>
            <span className="text-xs font-semibold text-indigo-600">
              Auto-Synced with Weekly 4 PKT
            </span>
          </div>

          {activeFolder === 'qbank' ? (
            <div className="space-y-3">
              {projectQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold">
                      {q.id} • {q.pillar}
                    </span>
                    <span className="text-slate-500">By {q.addedBy}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    Q{idx + 1}. {q.question}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`px-2.5 py-1.5 rounded-lg border ${
                          oIdx === q.correctIndex
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}. {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projectSops
                .filter((s) => {
                  if (activeFolder === 'sops') return s.docType === 'SOP';
                  if (activeFolder === 'playbooks') return s.docType === 'Client Playbook';
                  if (activeFolder === 'updates') return s.docType === 'Process Update Flash';
                  return true;
                })
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                          {doc.docCode} • {doc.version}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600">
                          {doc.readAckPct}% Read
                        </span>
                      </div>
                      <h5 className="text-xs font-extrabold text-slate-900">{doc.title}</h5>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{doc.summary}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                      <div className="flex gap-1">
                        {doc.relatedCarcRarcCodes.slice(0, 2).map((c) => (
                          <span
                            key={c}
                            className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-mono font-bold"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => onAcknowledgeSop(doc.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold keep-white-text"
                      >
                        {doc.acknowledgedByCurrentUser ? '✓ Signed' : 'Acknowledge'}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Quick Add Document / Process Flash */}
        <form
          onSubmit={handleAddFolderItem}
          className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-3 h-fit"
        >
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600">
            <Plus className="w-4 h-4" />
            <span>Add to Folder & Sync PKT</span>
          </div>
          <input
            type="text"
            required
            placeholder="Document or Process Update Title"
            value={newDocTitle}
            onChange={(e) => setNewDocTitle(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
          />
          <textarea
            rows={3}
            placeholder="Key SOP / Playbook summary..."
            value={newDocSummary}
            onChange={(e) => setNewDocSummary(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
          />
          <input
            type="text"
            placeholder="Paired PKT Question (auto-generated if blank)"
            value={newPktQuestion}
            onChange={(e) => setNewPktQuestion(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
          />
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm keep-white-text"
          >
            Publish to Folder & Question Bank
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// DIMENSION 3: NHT TRAINING (VISUAL PIPELINE, BATCHES, MODULES & CS HAND-OFF)
// ============================================================================

interface NhtTrainingDimensionHubProps {
  nhtBatches: NhtBatchRecord[];
  setNhtBatches: React.Dispatch<React.SetStateAction<NhtBatchRecord[]>>;
  projects: ProjectHealth[];
  userGroups: UserGroup[];
  csModules: ClientSpecificArModule[];
  setCsEnrollments: React.Dispatch<React.SetStateAction<CsTraineeEnrollmentRecord[]>>;
  triggerToast: (msg: string) => void;
  renderTrainingModulesCatalog: () => React.ReactNode;
}

export const NhtTrainingDimensionHub: React.FC<NhtTrainingDimensionHubProps> = ({
  nhtBatches,
  setNhtBatches,
  projects,
  csModules,
  setCsEnrollments,
  triggerToast,
  renderTrainingModulesCatalog,
}) => {
  const [subTab, setSubTab] = useState<'batches' | 'modules' | 'reports'>('batches');
  const [selectedBatchId, setSelectedBatchId] = useState<string>(nhtBatches[0]?.id || 'NHT-B-101');
  const [showCreateBatch, setShowCreateBatch] = useState(false);
  const [newBatchName, setNewBatchName] = useState('');
  const [newBatchTrack, setNewBatchTrack] = useState<NhtBatchRecord['nhtTrack']>('NHT - AR');
  const [newBatchProjectId, setNewBatchProjectId] = useState<string>('PRJ-ORTHO-02');

  const activeBatch =
    nhtBatches.find((b) => b.id === selectedBatchId) || nhtBatches[0];

  const totalTrainees = useMemo(
    () => nhtBatches.reduce((acc, b) => acc + b.trainees.length, 0),
    [nhtBatches]
  );

  const graduatedTrainees = useMemo(
    () =>
      nhtBatches.reduce(
        (acc, b) => acc + b.trainees.filter((t) => t.graduatedToCs).length,
        0
      ),
    [nhtBatches]
  );

  const avgGateScore = useMemo(() => {
    const all = nhtBatches.flatMap((b) => b.trainees);
    if (!all.length) return 0;
    return Math.round(
      all.reduce((acc, t) => acc + t.finalNhtGatePct, 0) / all.length
    );
  }, [nhtBatches]);

  const handleGraduateToCsTraining = (batch: NhtBatchRecord, traineeId: string) => {
    const trainee = batch.trainees.find((t) => t.traineeId === traineeId);
    if (!trainee) return;

    setNhtBatches((prev) =>
      prev.map((b) =>
        b.id !== batch.id
          ? b
          : {
              ...b,
              trainees: b.trainees.map((t) =>
                t.traineeId === traineeId ? { ...t, graduatedToCs: true } : t
              ),
            }
      )
    );

    const targetCsMod =
      csModules.find((m) => m.projectId === batch.targetProjectId) || csModules[0];

    const newCsEnrollment: CsTraineeEnrollmentRecord = {
      id: `CS-ENR-${Date.now().toString().slice(-4)}`,
      traineeName: trainee.traineeName,
      empId: `RCM-${Math.floor(5000 + Math.random() * 4000)}`,
      batchCode: batch.batchCode,
      intakePathway: 'Post-NHT Graduate (After NHT - AR / Billing)',
      priorExperienceYears: 1,
      csModuleId: targetCsMod.id,
      csModuleCode: targetCsMod.moduleCode,
      projectId: batch.targetProjectId,
      projectName: batch.targetProjectName,
      specialty: batch.specialty,
      assignedTrainer: batch.assignedTrainer,
      reportingLead: 'Kiran Deshmukh',
      qaAuditor: 'Deepa Madhavan',
      currentStage: '1. Classroom & Workflow Knowledge',
      practiceDaysCompleted: 0,
      practiceDaysTarget: targetCsMod.processPracticeDays,
      ojtProductionPct: 92,
      ojtClaimsWorkedPerDay: 35,
      ojtTargetPerDay: 38,
      ojtQualityPct: 91,
      ojtErrorSummary: `Transitioned from ${batch.batchCode} (${batch.nhtTrack}); monitoring payer-specific portal workflows.`,
      ojtTopDefects: ['CO-197 Prior Auth Check'],
      qcp1Day1Pct: 91,
      qcp1Day2Pct: 92,
      qcp1Day3Pct: 90,
      qcp1AveragePct: 91.0,
      qcp1Status: 'Pending',
      refresherDayRequired: false,
      refresherDayCompleted: false,
      qcp2Day1Pct: null,
      qcp2Day2Pct: null,
      qcp2AveragePct: null,
      qcp2Status: 'Not Applicable',
      qcpExempted: false,
    };

    setCsEnrollments((prev) => [newCsEnrollment, ...prev]);
    triggerToast(
      `Graduated ${trainee.traineeName} from ${batch.batchCode} → Auto-enrolled into Dimension 4 CS Training (${batch.targetProjectName})!`
    );
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchName.trim()) return;
    const proj =
      projects.find((p) => p.id === newBatchProjectId) || projects[0];
    const created: NhtBatchRecord = {
      id: `NHT-B-${Date.now().toString().slice(-3)}`,
      batchCode: `NHT-${newBatchTrack.split(' - ')[1]?.toUpperCase() || 'AR'}-2026-11D`,
      batchName: newBatchName.trim(),
      nhtTrack: newBatchTrack,
      targetProjectId: proj.id,
      targetProjectName: proj.projectName,
      specialty: proj.specialty,
      tower: proj.towers[0] || 'Denials Management',
      assignedTrainer: proj.ldTrainer,
      trainingLead: proj.trainingLead,
      operationsManager: proj.operationsManager,
      userGroupId: 'GRP-NEW-HIRE',
      startDate: '2026-11-07',
      targetGraduationDate: '2026-11-21',
      currentDay: 1,
      totalDays: 12,
      status: 'In Classroom',
      trainees: [
        {
          traineeId: `NHT-TR-${Date.now().toString().slice(-3)}`,
          traineeName: 'Tanvi Kulkarni',
          hireType: 'Fresher NHT',
          attendancePct: 100,
          fundamentalsScorePct: 90,
          mockBillingScorePct: 89,
          finalNhtGatePct: 91,
          graduatedToCs: false,
        },
      ],
    };
    setNhtBatches((prev) => [created, ...prev]);
    setSelectedBatchId(created.id);
    setNewBatchName('');
    setShowCreateBatch(false);
    triggerToast(`Created NHT Batch "${created.batchCode}" for ${proj.projectName}.`);
  };

  const handleExportNhtReportCsv = () => {
    const headers = [
      'Batch Code',
      'NHT Track',
      'Target Project',
      'Trainer',
      'Operations Manager',
      'Trainee Name',
      'Attendance %',
      'Fundamentals %',
      'Mock Practice %',
      'Final Gate %',
      'CS Status',
    ];
    const rows = nhtBatches.flatMap((b) =>
      b.trainees.map((t) => [
        b.batchCode,
        `"${b.nhtTrack}"`,
        `"${b.targetProjectName}"`,
        `"${b.assignedTrainer}"`,
        `"${b.operationsManager}"`,
        `"${t.traineeName}"`,
        `${t.attendancePct}%`,
        `${t.fundamentalsScorePct}%`,
        `${t.mockBillingScorePct}%`,
        `${t.finalNhtGatePct}%`,
        t.graduatedToCs ? 'Graduated to CS' : 'In NHT',
      ])
    );
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Curiosity_Dim3_NHT_Batches_Report.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Exported Dimension 3 NHT Batch Report CSV.');
  };

  return (
    <div className="space-y-5">
      {/* Top Visual Summary & Sub-Tab Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-8">
          <VisualRadialGauge
            value={avgGateScore}
            size={68}
            strokeWidth={7}
            color="#D97706"
            label="Avg NHT Final Gate"
            sublabel="85% Pass Benchmark"
          />
          <VisualRadialGauge
            value={Math.round((graduatedTrainees / (totalTrainees || 1)) * 100)}
            size={68}
            strokeWidth={7}
            color="#0284C7"
            label="CS Transition Rate"
            sublabel={`${graduatedTrainees} of ${totalTrainees} Moved to CS`}
          />
          {/* 4-Step Visual NHT Pipeline */}
          <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-slate-200">
            {[
              { step: '1. RCM Basics', pct: '100%' },
              { step: '2. Mock EHR', pct: '91%' },
              { step: '3. Final Gate', pct: `${avgGateScore}%` },
              { step: '4. Move to CS', pct: `${graduatedTrainees}/${totalTrainees}` },
            ].map((s, i) => (
              <div
                key={s.step}
                className="px-3 py-2 rounded-xl bg-amber-50/70 border border-amber-200 text-center"
              >
                <div className="text-[10px] font-bold text-amber-800">{s.step}</div>
                <div className="text-xs font-black text-slate-900">{s.pct}</div>
                {i < 3 && <span className="sr-only">→</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          {[
            { id: 'batches', label: `NHT Batches & Progress (${nhtBatches.length})`, icon: UsersRound },
            { id: 'modules', label: 'NHT Curriculum Modules', icon: GraduationCap },
            { id: 'reports', label: 'NHT Batch Reports', icon: FileSpreadsheet },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setSubTab(t.id as typeof subTab)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  subTab === t.id
                    ? 'bg-indigo-600 text-white shadow-sm keep-white-text'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {subTab === 'batches' && (
        <div className="space-y-4">
          {/* Batch Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nhtBatches.map((b) => {
              const isSelected = activeBatch.id === b.id;
              const progressPct = Math.round((b.currentDay / b.totalDays) * 100);
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBatchId(b.id)}
                  className={`p-4 rounded-2xl border text-left transition-all space-y-3 ${
                    isSelected
                      ? 'bg-amber-50/60 border-amber-500 ring-2 ring-amber-500 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                        {b.batchCode} • {b.nhtTrack}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                        {b.targetProjectName}
                      </h4>
                    </div>
                    <VisualRadialGauge
                      value={progressPct}
                      size={46}
                      strokeWidth={5}
                      color="#D97706"
                    />
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Trainer: <strong className="text-slate-800">{b.assignedTrainer}</strong></span>
                    <span>Day {b.currentDay}/{b.totalDays}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Batch Visual Trainee Cards */}
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {activeBatch.batchName} — Trainee Progress & CS Hand-Off
                </h3>
                <p className="text-xs text-slate-500">
                  Target Project: <strong className="text-slate-800">{activeBatch.targetProjectName}</strong> • Ops Mgr:{' '}
                  <strong className="text-slate-800">{activeBatch.operationsManager}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowCreateBatch((prev) => !prev)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 keep-white-text"
              >
                <Plus className="w-4 h-4" />
                <span>New NHT Batch</span>
              </button>
            </div>

            {showCreateBatch && (
              <form
                onSubmit={handleCreateBatch}
                className="rounded-xl bg-slate-50 border border-slate-200 p-4 grid grid-cols-1 md:grid-cols-4 gap-3"
              >
                <input
                  type="text"
                  required
                  placeholder="Batch Name"
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
                <select
                  value={newBatchTrack}
                  onChange={(e) => setNewBatchTrack(e.target.value as NhtBatchRecord['nhtTrack'])}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="NHT - Billing">NHT - Billing</option>
                  <option value="NHT - AR">NHT - AR</option>
                  <option value="NHT - Coding">NHT - Coding</option>
                </select>
                <select
                  value={newBatchProjectId}
                  onChange={(e) => setNewBatchProjectId(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.projectName}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold keep-white-text"
                >
                  Create Batch
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeBatch.trainees.map((t) => (
                <div
                  key={t.traineeId}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                        {t.hireType}
                      </span>
                      <h5 className="text-sm font-extrabold text-slate-900 mt-1">
                        {t.traineeName}
                      </h5>
                    </div>
                    <VisualRadialGauge
                      value={t.finalNhtGatePct}
                      size={48}
                      strokeWidth={5}
                      color={t.finalNhtGatePct >= 90 ? '#059669' : '#4F46E5'}
                    />
                  </div>

                  {/* Visual Score Bars */}
                  <div className="space-y-1.5 text-[11px]">
                    <div>
                      <div className="flex justify-between font-semibold text-slate-600">
                        <span>RCM Fundamentals</span>
                        <span>{t.fundamentalsScorePct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${t.fundamentalsScorePct}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-semibold text-slate-600">
                        <span>Mock EHR Practice</span>
                        <span>{t.mockBillingScorePct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-teal-500"
                          style={{ width: `${t.mockBillingScorePct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    {t.graduatedToCs ? (
                      <div className="w-full py-1.5 px-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Enrolled in Dim 4 CS Training</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleGraduateToCsTraining(activeBatch, t.traineeId)}
                        className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 keep-white-text"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Graduate → Move to CS Training</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {subTab === 'modules' && renderTrainingModulesCatalog()}

      {subTab === 'reports' && (
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Export NHT Batch & CS Graduation Readiness CSV
            </h3>
            <p className="text-xs text-slate-500">
              Includes all NHT cohorts, attendance, mock EHR practice scores, final gate results, and CS transition status.
            </p>
          </div>
          <button
            onClick={handleExportNhtReportCsv}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 keep-white-text"
          >
            <Download className="w-4 h-4" />
            <span>Download NHT CSV Report</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// DIMENSION 5 (EXTRA): LEARNING HUB & GAMES ARENA (VISUAL ARCADE & PODIUM)
// ============================================================================

interface LearningHubAndGamesArenaProps {
  associates: AssociateProfile[];
  setAssociates: React.Dispatch<React.SetStateAction<AssociateProfile[]>>;
  selectedUserId: string;
  projects: ProjectHealth[];
  userGroups: UserGroup[];
  triggerToast: (msg: string) => void;
}

export const LearningHubAndGamesArena: React.FC<LearningHubAndGamesArenaProps> = ({
  associates,
  setAssociates,
  selectedUserId,
  triggerToast,
}) => {
  const [activeGame, setActiveGame] = useState<'denial_blitz' | 'modifier_match' | 'claim_detective'>('denial_blitz');
  const [questionIdx, setQuestionIdx] = useState(0);
  const [streak, setStreak] = useState(3);
  const [xpEarned, setXpEarned] = useState(420);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const activeUser =
    associates.find((a) => a.id === selectedUserId) || associates[0];

  const gameScenarios = {
    denial_blitz: [
      {
        prompt: 'Payer returns CARC CO-197 on an Inpatient Spine Arthrodesis (CPT 22612) claim for Summit Ortho. What is the immediate root cause & action?',
        options: [
          'Precertification/authorization absent — Verify retro-auth window or appeal with pre-op clinical auth log',
          'Duplicate claim — Write off balance immediately',
          'Patient deductible not met — Bill secondary payer without EOB',
          'Missing rendering NPI — Resubmit with Modifier -25',
        ],
        correct: 0,
        explanation: 'CO-197 indicates missing prior authorization. Always check EHR auth logs and payer retro-auth rules before appealing.',
      },
      {
        prompt: 'Cardiology claim for CPT 93458 (Left Heart Cath) denies with CO-97 / RARC M15 ("Bundled"). Which modifier is required when a distinct E/M service occurred on the same day?',
        options: [
          'Modifier -25 on the E/M code with separate clinical evaluation documentation',
          'Modifier -51 on the catheterization code',
          'Modifier -TC on the E/M code',
          'Modifier -91 repeat clinical diagnostic lab test',
        ],
        correct: 0,
        explanation: 'Modifier -25 identifies a significant, separately identifiable E/M service by the same physician on the same day of a procedure.',
      },
      {
        prompt: 'A Medicare claim denies with CO-29 (Time limit for filing has expired). Which evidence can overturn CO-29 on appeal?',
        options: [
          'Clearinghouse electronic acceptance report (277CA) proving initial submission within the 365-day CMS deadline',
          'A phone call note from the patient',
          'Resubmitting the same claim as a new original claim',
          'Adding Modifier -59 to bypass timely filing',
        ],
        correct: 0,
        explanation: 'A verifiable 277CA clearinghouse acceptance receipt dated within the timely filing window is the gold standard to overturn CO-29.',
      },
    ],
    modifier_match: [
      {
        prompt: 'Gastroenterology: Screening Colonoscopy (G0121) converted to Diagnostic Polypectomy (CPT 45385) during the same encounter. Which modifier flags this preventive-to-therapeutic conversion?',
        options: [
          'Modifier -33 (Commercial Preventive Service Converted) or -PT (Medicare)',
          'Modifier -26 (Professional Component Only)',
          'Modifier -53 (Discontinued Procedure)',
          'Modifier -76 (Repeat Procedure by Same Physician)',
        ],
        correct: 0,
        explanation: 'Medicare uses -PT and Commercial payers use -33 when a screening colonoscopy converts to a diagnostic/therapeutic procedure.',
      },
      {
        prompt: 'Orthopedics: Bilateral Knee Viscosupplementation Injection performed during the same session. Which modifier indicates a bilateral procedure?',
        options: [
          'Modifier -50 (Bilateral Procedure) or RT/LT per payer playbook',
          'Modifier -22 (Increased Procedural Services)',
          'Modifier -58 (Staged or Related Procedure)',
          'Modifier -95 (Synchronous Telemedicine)',
        ],
        correct: 0,
        explanation: 'Modifier -50 (or anatomical modifiers -RT and -LT depending on the payer playbook) reports bilateral procedures.',
      },
    ],
    claim_detective: [
      {
        prompt: 'CLAIM SCRUBBER CASE #884: Patient: 68yo Male | Payer: Medicare Part B | POS: 21 (Inpatient Hospital) | CPT: 71046 (Chest X-Ray, 2 Views, Complete) billed WITHOUT a modifier by an independent Radiology group. Spot the fatal defect!',
        options: [
          'Global CPT 71046 billed in POS 21 (Inpatient) — Independent radiologist must append Modifier -26 (Professional Component)',
          'POS 21 requires Modifier -QW',
          'Chest X-Ray cannot be billed to Medicare Part B',
          'Diagnosis code must be listed in Box 33',
        ],
        correct: 0,
        explanation: 'When a physician interprets a diagnostic test in an Inpatient (POS 21) or Outpatient Hospital (POS 22) setting, Modifier -26 is mandatory.',
      },
    ],
  };

  const currentQuestions = gameScenarios[activeGame];
  const currentQ = currentQuestions[questionIdx % currentQuestions.length];

  const handleSelectOption = (idx: number) => {
    setSelectedAnswer(idx);
    if (idx === currentQ.correct) {
      const gained = 50 + streak * 10;
      setStreak((s) => s + 1);
      setXpEarned((x) => x + gained);
      setAssociates((prev) =>
        prev.map((a) =>
          a.id === activeUser.id
            ? { ...a, pktScore: Math.min(100, Number((a.pktScore + 0.5).toFixed(1))) }
            : a
        )
      );
      triggerToast(
        `Correct! +${gained} Curiosity XP earned for ${activeUser.name} (${streak + 1}x Streak)!`
      );
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setQuestionIdx((i) => i + 1);
  };

  return (
    <div className="space-y-5">
      {/* Visual Game Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            id: 'denial_blitz' as const,
            title: '1. CARC / RARC Denial Blitz',
            desc: 'Rapid-fire payer denial codes (CO-197, CO-29, CO-97) & overturn actions.',
            badge: '+60 XP / Round',
            color: 'border-purple-500 bg-purple-50/60',
          },
          {
            id: 'modifier_match' as const,
            title: '2. Specialty Modifier Match-Up',
            desc: 'Master -25, -59/XS, -PT/-33, -26/-TC & -50 across 6 specialties.',
            badge: '+75 XP / Round',
            color: 'border-indigo-500 bg-indigo-50/60',
          },
          {
            id: 'claim_detective' as const,
            title: '3. Clean Claim Scrubbing Detective',
            desc: 'Spot the fatal CMS-1500 / UB-04 billing defect before claim submission.',
            badge: '+100 XP / Case',
            color: 'border-teal-500 bg-teal-50/60',
          },
        ].map((g) => (
          <button
            key={g.id}
            onClick={() => {
              setActiveGame(g.id);
              setSelectedAnswer(null);
              setQuestionIdx(0);
            }}
            className={`p-4 rounded-2xl border text-left transition-all space-y-2 shadow-sm ${
              activeGame === g.id
                ? `${g.color} ring-2 ring-purple-500 shadow-md`
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <Gamepad2 className="w-6 h-6 text-purple-600" />
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                {g.badge}
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-900">{g.title}</div>
            <p className="text-xs text-slate-500">{g.desc}</p>
          </button>
        ))}
      </div>

      {/* Interactive Arena + Visual Podium Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-800 text-xs font-extrabold">
                Player: {activeUser.name}
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-800 text-xs font-extrabold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>{streak}x Streak</span>
              </span>
            </div>
            <span className="text-xs font-bold text-purple-700">{xpEarned} Total XP</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 leading-relaxed">
            {currentQ.prompt}
          </div>

          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isPicked = selectedAnswer === idx;
              const isRight = idx === currentQ.correct;
              let style = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-400';
              if (selectedAnswer !== null) {
                if (isRight) {
                  style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                } else if (isPicked) {
                  style = 'bg-rose-50 border-rose-400 text-rose-900';
                }
              }
              return (
                <button
                  key={idx}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-3 ${style}`}
                >
                  <span>
                    {String.fromCharCode(65 + idx)}. {opt}
                  </span>
                  {selectedAnswer !== null && isRight && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-indigo-950 max-w-xl">
                <strong>Playbook Takeaway:</strong> {currentQ.explanation}
              </div>
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold keep-white-text"
              >
                Next Challenge →
              </button>
            </div>
          )}
        </div>

        {/* Visual Champions Leaderboard */}
        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h4 className="text-sm font-extrabold text-slate-900">Curiosity Champions</h4>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">Live PKT + XP</span>
          </div>

          <div className="space-y-2.5">
            {associates
              .slice()
              .sort((a, b) => b.pktScore - a.pktScore)
              .map((assoc, idx) => (
                <div
                  key={assoc.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                    assoc.id === activeUser.id
                      ? 'bg-purple-50 border-purple-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                        idx === 0
                          ? 'bg-amber-400 text-slate-950'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-900'
                          : idx === 2
                          ? 'bg-amber-700 text-white keep-white-text'
                          : 'bg-white border border-slate-300 text-slate-700'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-slate-900 truncate">
                        {assoc.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {assoc.projectName}
                      </div>
                    </div>
                  </div>
                  <VisualRadialGauge
                    value={assoc.pktScore}
                    size={40}
                    strokeWidth={4}
                    color="#7C3AED"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
