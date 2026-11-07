import React, { useState, useMemo } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Database,
  Download,
  FileSpreadsheet,
  FolderKanban,
  GitBranch,
  GraduationCap,
  Grid,
  KeyRound,
  Layers,
  LayoutDashboard,
  Link2,
  Lock,
  Network,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Unlock,
  Upload,
  UserCheck,
  Users,
  UsersRound,
} from 'lucide-react';
import {
  AssociateProfile,
  AutoTriggeredTrainingTicket,
  ContinuousLearningModule,
  MandatoryComplianceCourse,
  ProjectHealth,
  ProjectQuestionBankItem,
  ProjectWeeklyAssessment,
  TrainerDirectoryProfile,
  UserGroup,
} from '../types/rcm';
import { TRAINER_DIRECTORY } from '../data/mockRcmData';
import {
  ClientSpecificArModule,
  CsTraineeEnrollmentRecord,
} from './ClientSpecificTrainingHub';

// ============================================================================
// RBAC LOGIN ROLES & MODULE CATEGORIZATION TREE DEFINITION
// ============================================================================

export type EnterpriseLoginRole = 'admin' | 'operations' | 'quality' | 'trainer' | 'associate';

export type ModuleKey =
  | 'tile_tree_home'
  | 'entity_graph'
  | 'dashboard'
  | 'admin_studio'
  | 'upload'
  | 'scorecards'
  | 'associate_portal'
  | 'quality'
  | 'cs_training'
  | 'trainer_hub'
  | 'clp_dashboard'
  | 'training_modules'
  | 'learning'
  | 'compliance'
  | 'knowledge'
  | 'reports';

export interface RoleLoginMetadata {
  id: EnterpriseLoginRole;
  title: string;
  personaName: string;
  designation: string;
  badgeColor: string;
  borderColor: string;
  description: string;
  allowedModules: ModuleKey[];
}

export const ENTERPRISE_ROLES: RoleLoginMetadata[] = [
  {
    id: 'admin',
    title: 'Login as Admin',
    personaName: 'Samrat Bose',
    designation: 'VP — L&D, Quality & Enterprise Governance Admin',
    badgeColor: 'from-indigo-600 to-violet-600',
    borderColor: 'border-indigo-500/60',
    description:
      'Unrestricted Super-Admin access to all 16 modules across Executive Governance, Operations, Quality, Trainer Delivery, Relational DB Mapping & Reports.',
    allowedModules: [
      'tile_tree_home',
      'entity_graph',
      'dashboard',
      'admin_studio',
      'upload',
      'scorecards',
      'associate_portal',
      'quality',
      'cs_training',
      'trainer_hub',
      'clp_dashboard',
      'training_modules',
      'learning',
      'compliance',
      'knowledge',
      'reports',
    ],
  },
  {
    id: 'operations',
    title: 'Login as Operations',
    personaName: 'Meera Krishnan',
    designation: 'VP Operations & Multi-Specialty RCM Delivery Head',
    badgeColor: 'from-sky-600 to-blue-600',
    borderColor: 'border-sky-500/60',
    description:
      'Scoped to Project Health KPIs, Daily Production/TMS Uploads, Monthly Scorecards, BQT/15-Day PIP Roster, Continuous Learning Stats & Operational Reports.',
    allowedModules: [
      'tile_tree_home',
      'dashboard',
      'upload',
      'scorecards',
      'clp_dashboard',
      'associate_portal',
      'reports',
    ],
  },
  {
    id: 'quality',
    title: 'Login as Quality',
    personaName: 'Deepa Madhavan',
    designation: 'Lead QA Governance & Calibration Auditor',
    badgeColor: 'from-emerald-600 to-teal-600',
    borderColor: 'border-emerald-500/60',
    description:
      'Scoped to Claim Quality Audits, Two-Way Error Rebuttals, Calibration Sessions, AR CS Training QCP Certification (3-Day / 2-Day 90% Gate), Scorecards & QA Reports.',
    allowedModules: [
      'tile_tree_home',
      'quality',
      'cs_training',
      'upload',
      'scorecards',
      'knowledge',
      'reports',
    ],
  },
  {
    id: 'trainer',
    title: 'Login as Trainer',
    personaName: 'Ananya Iyer / Ritu Chatterjee',
    designation: 'RCM Process Trainer & NHT / CS Certification Lead',
    badgeColor: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/60',
    description:
      'Scoped to Assigned Projects Trainer Workbench, Mandatory DBT/BQT/PIP Closure Summaries, Weekly 4 Assessments, AR CS Training & OJT/QCP, NHT Modules & Update Tracker.',
    allowedModules: [
      'tile_tree_home',
      'trainer_hub',
      'cs_training',
      'clp_dashboard',
      'training_modules',
      'learning',
      'knowledge',
      'reports',
    ],
  },
  {
    id: 'associate',
    title: 'Associate Self-Service',
    personaName: 'Aarav Sharma (#RCM-4082)',
    designation: 'Senior AR & Denials Specialist — Summit Ortho',
    badgeColor: 'from-purple-600 to-pink-600',
    borderColor: 'border-purple-500/60',
    description:
      'Scoped to Personal Performance Trends, Monthly Scorecard, Weekly Error Trends, Rebuttal Submission, Assigned Courses, Annual Compliance & Project Knowledge Library.',
    allowedModules: [
      'tile_tree_home',
      'associate_portal',
      'learning',
      'compliance',
      'knowledge',
    ],
  },
];

export interface ModuleNodeDefinition {
  id: ModuleKey;
  code: string;
  title: string;
  shortTitle: string;
  category:
    | '1. Executive & Relational DB Governance'
    | '2. Operations & Performance Management'
    | '3. Quality Assurance & QCP Certification'
    | '4. Training Delivery, NHT, CS & CLP'
    | '5. Compliance, Knowledge & Enterprise Reports';
  description: string;
  connectedEntities: ('User' | 'UserGroup' | 'Project' | 'Trainer' | 'Course' | 'Assessment')[];
  allowedRoles: EnterpriseLoginRole[];
  accentColor: string;
}

export const MODULE_TREE_CATALOG: ModuleNodeDefinition[] = [
  // CATEGORY 1: EXECUTIVE & RELATIONAL DB GOVERNANCE
  {
    id: 'dashboard',
    code: 'MOD-EXEC-01',
    title: 'Project Health & Executive KPI Command Center',
    shortTitle: 'Project Health & KPIs',
    category: '1. Executive & Relational DB Governance',
    description:
      'Multi-specialty project health scores, 6-month historical sparklines, SLA attainment, and defect Pareto drivers.',
    connectedEntities: ['Project', 'User', 'Trainer', 'Assessment'],
    allowedRoles: ['admin', 'operations'],
    accentColor: 'indigo',
  },
  {
    id: 'admin_studio',
    code: 'MOD-ADMIN-02',
    title: 'L&D Admin Governance Studio (Projects, Users, Courses & User Groups)',
    shortTitle: 'L&D Admin Studio',
    category: '1. Executive & Relational DB Governance',
    description:
      'Add/manage Projects with 6-month history, 360° User Profiles with 6-role hierarchy, Course Builder, and User Group cohorts.',
    connectedEntities: ['User', 'UserGroup', 'Project', 'Trainer', 'Course', 'Assessment'],
    allowedRoles: ['admin'],
    accentColor: 'violet',
  },
  {
    id: 'entity_graph',
    code: 'MOD-DB-03',
    title: 'Relational Database & Entity Mapping Studio (User ↔ Group ↔ Project ↔ Trainer ↔ Course ↔ Assessment)',
    shortTitle: 'Relational DB & Entity Map',
    category: '1. Executive & Relational DB Governance',
    description:
      'Interactive foreign-key schema explorer and live relational mapper linking Users, User Groups, Projects, Trainers, Courses, and Assessments.',
    connectedEntities: ['User', 'UserGroup', 'Project', 'Trainer', 'Course', 'Assessment'],
    allowedRoles: ['admin'],
    accentColor: 'cyan',
  },

  // CATEGORY 2: OPERATIONS & PERFORMANCE MANAGEMENT
  {
    id: 'upload',
    code: 'MOD-OPS-04',
    title: 'Daily Production, Quality & TMS Data Ingestion Hub',
    shortTitle: 'Daily Prod / QA / TMS Upload',
    category: '2. Operations & Performance Management',
    description:
      'Daily CSV/XLSX ingestion for EHR Production, QMS Audits & TMS Billable Hours with live SLA breach & training trigger simulator.',
    connectedEntities: ['User', 'Project', 'Course'],
    allowedRoles: ['admin', 'operations', 'quality'],
    accentColor: 'sky',
  },
  {
    id: 'scorecards',
    code: 'MOD-OPS-05',
    title: 'Monthly Scorecards & Consecutive-Week Quality SLA Escalation (DBT / BQT / 15d PIP)',
    shortTitle: 'Scorecards, BQT & 15d PIP',
    category: '2. Operations & Performance Management',
    description:
      'Weighted monthly scorecards (40% QA, 35% Prod, 15% PKT, 10% TMS) and consecutive-week escalation (1W DBT → 3W BQT → 4W 15-Day PIP).',
    connectedEntities: ['User', 'Project', 'Trainer', 'Course', 'Assessment'],
    allowedRoles: ['admin', 'operations', 'quality'],
    accentColor: 'amber',
  },
  {
    id: 'associate_portal',
    code: 'MOD-OPS-06',
    title: 'Associate Self-Service Workspace (Trends, Error Rebuttals & 5-Pillar Knowledge Library)',
    shortTitle: 'Associate Workspace',
    category: '2. Operations & Performance Management',
    description:
      'Personal performance trends, weekly error pulse, rebuttal tracker, assigned courses, and 5-pillar Project Knowledge Library.',
    connectedEntities: ['User', 'Project', 'Course', 'Assessment'],
    allowedRoles: ['admin', 'operations', 'associate'],
    accentColor: 'purple',
  },

  // CATEGORY 3: QUALITY ASSURANCE & QCP CERTIFICATION
  {
    id: 'quality',
    code: 'MOD-QA-07',
    title: 'QA Claim Audits, Two-Way Error Rebuttals & Calibration Engine',
    shortTitle: 'QA Audits, Rebuttals & Calibration',
    category: '3. Quality Assurance & QCP Certification',
    description:
      'Log claim-level CARC/CPT audit defects, adjudicate associate rebuttals, and run cross-team QA/Ops/L&D calibration sessions.',
    connectedEntities: ['User', 'Project', 'Trainer', 'Course'],
    allowedRoles: ['admin', 'quality'],
    accentColor: 'emerald',
  },
  {
    id: 'cs_training',
    code: 'MOD-QA-08',
    title: 'AR Client-Specific (CS) Training & Quality Certification Process (QCP 3-Day 90% / Refresher / 2-Day 90% / Exemption)',
    shortTitle: 'AR CS Training & QCP Gate',
    category: '3. Quality Assurance & QCP Certification',
    description:
      'Assigned to Lateral Hires & Post-NHT Grads. Customizable Specialty, Softwares, Payers, Scenarios, Practice Days, OJT & QCP Certification.',
    connectedEntities: ['User', 'Project', 'Trainer', 'Course', 'Assessment'],
    allowedRoles: ['admin', 'quality', 'trainer'],
    accentColor: 'teal',
  },

  // CATEGORY 4: TRAINING DELIVERY, NHT, CS & CONTINUOUS LEARNING
  {
    id: 'trainer_hub',
    code: 'MOD-TRN-09',
    title: 'Scoped Trainer Workbench — Assigned Projects, Mandatory Summary Closure & Weekly 4 Assessments',
    shortTitle: 'Trainer Workbench & Weekly 4 Exams',
    category: '4. Training Delivery, NHT, CS & CLP',
    description:
      'Strict project-scoped access for trainers to close auto-triggered DBT/BQT/PIP tickets with mandatory summaries and manage Weekly 4 Assessments.',
    connectedEntities: ['Project', 'Trainer', 'User', 'Course', 'Assessment'],
    allowedRoles: ['admin', 'trainer'],
    accentColor: 'orange',
  },
  {
    id: 'clp_dashboard',
    code: 'MOD-TRN-10',
    title: 'Continuous Learning Process (CLP) Dashboard & Update Tracker (Auto-Sync to Knowledge + PKT Bank)',
    shortTitle: 'CLP Dashboard & Update Tracker',
    category: '4. Training Delivery, NHT, CS & CLP',
    description:
      'Project DBT/BQT/PIP remediation trends plus Live Update Tracker that auto-adds updates to Project Knowledge & PKT Question Bank.',
    connectedEntities: ['Project', 'Trainer', 'Course', 'Assessment'],
    allowedRoles: ['admin', 'operations', 'trainer'],
    accentColor: 'indigo',
  },
  {
    id: 'training_modules',
    code: 'MOD-TRN-11',
    title: 'Core Training Modules Hub (NHT - Billing, NHT - AR, NHT - Coding, AR - CS & Refresher)',
    shortTitle: 'Training Modules (NHT / CS / Refresher)',
    category: '4. Training Delivery, NHT, CS & CLP',
    description:
      'Curriculum blueprints and customizable course structure designer for NHT Billing, NHT AR, NHT Coding, AR CS Training & Refresher tracks.',
    connectedEntities: ['Course', 'Trainer', 'Project', 'UserGroup', 'Assessment'],
    allowedRoles: ['admin', 'trainer'],
    accentColor: 'pink',
  },
  {
    id: 'learning',
    code: 'MOD-TRN-12',
    title: 'Weekly Defect-Triggered Micro-Learning & Monthly Process Knowledge Tests (PKT)',
    shortTitle: 'Weekly Defect Learning & PKT',
    category: '4. Training Delivery, NHT, CS & CLP',
    description:
      'Interactive micro-modules and graded quizzes triggered by weekly QA defects and monthly PKT certification gates.',
    connectedEntities: ['User', 'Course', 'Assessment'],
    allowedRoles: ['admin', 'trainer', 'associate'],
    accentColor: 'sky',
  },

  // CATEGORY 5: COMPLIANCE, KNOWLEDGE & ENTERPRISE REPORTS
  {
    id: 'compliance',
    code: 'MOD-CMP-13',
    title: 'Annual Mandatory Statutory Compliance (HIPAA, POSH, CMS FWA, InfoSec & Ethics)',
    shortTitle: 'Annual HIPAA & POSH Compliance',
    category: '5. Compliance, Knowledge & Enterprise Reports',
    description:
      'Annual statutory compliance courses, graded certification exams, and verifiable digital completion certificates.',
    connectedEntities: ['User', 'UserGroup', 'Course', 'Assessment'],
    allowedRoles: ['admin', 'associate'],
    accentColor: 'emerald',
  },
  {
    id: 'knowledge',
    code: 'MOD-KNW-14',
    title: 'Central SOP Repository, Client Playbooks & Trainer Sam AI Co-Pilot',
    shortTitle: 'SOPs, Playbooks & AI Help',
    category: '5. Compliance, Knowledge & Enterprise Reports',
    description:
      'Version-controlled RCM SOPs with digital read-receipts and interactive Trainer Sam AI assistant for CARC/Modifier queries.',
    connectedEntities: ['Project', 'User', 'Course'],
    allowedRoles: ['admin', 'quality', 'trainer', 'associate'],
    accentColor: 'indigo',
  },
  {
    id: 'reports',
    code: 'MOD-RPT-15',
    title: 'Enterprise Reports & Relational Export Center (CS/QCP, Trainings, Projects, Courses, Groups, Batches)',
    shortTitle: 'Enterprise Reports Center',
    category: '5. Compliance, Knowledge & Enterprise Reports',
    description:
      'Generate and export relational CSV reports across AR CS Training & QCP, Auto-Triggered Trainings, Projects, Courses, User Groups, and Batches.',
    connectedEntities: ['User', 'UserGroup', 'Project', 'Trainer', 'Course', 'Assessment'],
    allowedRoles: ['admin', 'operations', 'quality', 'trainer'],
    accentColor: 'amber',
  },
];

// ============================================================================
// 1. INTERACTIVE TILE & TREE COMMAND HOME (WITH ROLE-BASED ACCESS CONTROL)
// ============================================================================

interface InteractiveTileAndTreeLauncherProps {
  loginRole: EnterpriseLoginRole;
  onSelectLoginRole: (role: EnterpriseLoginRole) => void;
  onLaunchModule: (modId: ModuleKey) => void;
  projects: ProjectHealth[];
  associates: AssociateProfile[];
  userGroups: UserGroup[];
  learningModules: ContinuousLearningModule[];
  complianceCourses: MandatoryComplianceCourse[];
  weeklyAssessments: ProjectWeeklyAssessment[];
  tickets: AutoTriggeredTrainingTicket[];
  csModules: ClientSpecificArModule[];
  csEnrollments: CsTraineeEnrollmentRecord[];
  triggerToast: (msg: string) => void;
}

export const InteractiveTileAndTreeLauncher: React.FC<InteractiveTileAndTreeLauncherProps> = ({
  loginRole,
  onSelectLoginRole,
  onLaunchModule,
  projects,
  associates,
  userGroups,
  learningModules,
  complianceCourses,
  weeklyAssessments,
  tickets,
  csModules,
  csEnrollments,
  triggerToast,
}) => {
  const [layoutMode, setLayoutMode] = useState<'bento_tiles' | 'interactive_tree'>('bento_tiles');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    '1. Executive & Relational DB Governance': true,
    '2. Operations & Performance Management': true,
    '3. Quality Assurance & QCP Certification': true,
    '4. Training Delivery, NHT, CS & CLP': true,
    '5. Compliance, Knowledge & Enterprise Reports': true,
  });

  const activeRoleMeta = useMemo(
    () => ENTERPRISE_ROLES.find((r) => r.id === loginRole) || ENTERPRISE_ROLES[0],
    [loginRole]
  );

  const categories = [
    '1. Executive & Relational DB Governance',
    '2. Operations & Performance Management',
    '3. Quality Assurance & QCP Certification',
    '4. Training Delivery, NHT, CS & CLP',
    '5. Compliance, Knowledge & Enterprise Reports',
  ] as const;

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleModuleClick = (mod: ModuleNodeDefinition) => {
    const isUnlocked = loginRole === 'admin' || mod.allowedRoles.includes(loginRole);
    if (!isUnlocked) {
      triggerToast(
        `Access Restricted: "${mod.shortTitle}" is locked for "${activeRoleMeta.title}". Switch to "Login as Admin" for full access to all functions.`
      );
      return;
    }
    onLaunchModule(mod.id);
  };

  // Dynamic live metrics per module tile
  const getModuleLiveStat = (id: ModuleKey): string => {
    switch (id) {
      case 'dashboard':
        return `${projects.length} Active Projects • 89.2% Avg Health`;
      case 'admin_studio':
        return `${projects.length} Projects • ${associates.length} Users • ${userGroups.length} Groups`;
      case 'entity_graph':
        return `6 Connected Tables • 100% Relational Integrity`;
      case 'upload':
        return `3 Daily ETL Feeds (Prod, QA, TMS)`;
      case 'scorecards':
        return `${associates.length} Scorecards • 1W DBT / 3W BQT / 4W PIP`;
      case 'associate_portal':
        return `5-Pillar Knowledge Library & Rebuttal Portal`;
      case 'quality':
        return `Two-Way Rebuttals & Calibration Engine`;
      case 'cs_training':
        return `${csModules.length} CS Modules • ${csEnrollments.length} QCP Trainees (90% Gate)`;
      case 'trainer_hub':
        return `${TRAINER_DIRECTORY.length} Scoped Trainers • ${tickets.length} Auto Tickets`;
      case 'clp_dashboard':
        return `DBT/BQT/PIP Trends • Live Update → PKT Sync`;
      case 'training_modules':
        return `5 Tracks: NHT Billing, AR, Coding, CS & Refresher`;
      case 'learning':
        return `${learningModules.length} Defect & PKT Modules`;
      case 'compliance':
        return `${complianceCourses.length} Mandatory Courses (HIPAA/POSH)`;
      case 'knowledge':
        return `SOPs, Client Playbooks & Trainer Sam AI`;
      case 'reports':
        return `6 Report Dimensions + Relational CSV Export`;
      default:
        return 'Interactive Module';
    }
  };

  return (
    <div className="space-y-6">
      {/* =====================================================================
          STEP 1: MAIN MENU ROLE LOGIN GATE (ADMIN, OPERATIONS, QUALITY, TRAINER)
         ===================================================================== */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">
                Main Menu — Select Persona Login (Role-Based Function Access Control)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Only Admin Unlocks All 15 Functions
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose your active login role below. Functions and tree/tile modules automatically adapt based on your role permissions.
            </p>
          </div>

          {/* View Mode Switcher: Interactive Bento Tiles vs. Tree Structure Explorer */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter modules or entities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white w-48 sm:w-56"
              />
            </div>
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setLayoutMode('bento_tiles')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  layoutMode === 'bento_tiles'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Categorized Tiles</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('interactive_tree')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  layoutMode === 'interactive_tree'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Interactive Tree</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5 Role Login Cards (Admin, Operations, Quality, Trainer + Associate) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ENTERPRISE_ROLES.map((r) => {
            const isSelected = r.id === loginRole;
            const unlockedCount =
              r.id === 'admin' ? MODULE_TREE_CATALOG.length : r.allowedModules.length - 1;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectLoginRole(r.id)}
                className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? `bg-slate-950 ${r.borderColor} ring-2 ring-indigo-500/40 shadow-lg`
                    : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold text-white bg-gradient-to-r ${r.badgeColor}`}
                    >
                      {r.title}
                    </span>
                    {r.id === 'admin' ? (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                        <Unlock className="w-3 h-3" /> All 15
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400">
                        {unlockedCount}/15 Modules
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-white text-xs pt-0.5">{r.personaName}</div>
                  <div className="text-[10px] text-indigo-300 font-medium">{r.designation}</div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {r.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className={isSelected ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {isSelected ? '● Active Session' : 'Click to Switch Login'}
                  </span>
                  <span className="font-mono text-slate-400 uppercase">{r.id}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          STEP 2A: CATEGORIZED INTERACTIVE BENTO TILE ARCHITECTURE
         ===================================================================== */}
      {layoutMode === 'bento_tiles' && (
        <div className="space-y-6">
          {categories.map((categoryName) => {
            const categoryModules = MODULE_TREE_CATALOG.filter(
              (m) =>
                m.category === categoryName &&
                (!searchQuery.trim() ||
                  m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  m.connectedEntities.some((e) =>
                    e.toLowerCase().includes(searchQuery.toLowerCase())
                  ))
            );
            if (categoryModules.length === 0) return null;

            return (
              <div
                key={categoryName}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white">{categoryName}</h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {
                      categoryModules.filter(
                        (m) => loginRole === 'admin' || m.allowedRoles.includes(loginRole)
                      ).length
                    }{' '}
                    of {categoryModules.length} modules unlocked for{' '}
                    <strong className="text-indigo-300">{activeRoleMeta.title}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryModules.map((mod) => {
                    const isUnlocked =
                      loginRole === 'admin' || mod.allowedRoles.includes(loginRole);
                    return (
                      <div
                        key={mod.id}
                        onClick={() => handleModuleClick(mod)}
                        className={`rounded-2xl p-4 border transition-all flex flex-col justify-between gap-3.5 ${
                          isUnlocked
                            ? 'bg-slate-950/90 border-slate-800 hover:border-indigo-500/70 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer group'
                            : 'bg-slate-950/40 border-slate-900 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-indigo-300 font-bold">
                              {mod.code}
                            </span>
                            {isUnlocked ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1">
                                <Unlock className="w-3 h-3" /> Accessible
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] font-semibold flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Restricted ({mod.allowedRoles.join(', ')})
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                            {mod.title}
                          </h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {mod.description}
                          </p>
                        </div>

                        <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                          {/* Connected Database Entities */}
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="text-[10px] text-slate-500 mr-1">DB Links:</span>
                            {mod.connectedEntities.map((ent) => (
                              <span
                                key={ent}
                                className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-medium"
                              >
                                {ent}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-indigo-300 font-semibold">
                              {getModuleLiveStat(mod.id)}
                            </span>
                            {isUnlocked ? (
                              <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                                Open <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectLoginRole('admin');
                                  triggerToast('Switched to Admin Login — All 15 modules unlocked!');
                                }}
                                className="text-[10px] underline text-amber-300 hover:text-amber-200"
                              >
                                Switch to Admin
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================================
          STEP 2B: INTERACTIVE HIERARCHICAL TREE STRUCTURE EXPLORER
         ===================================================================== */}
      {layoutMode === 'interactive_tree' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-indigo-400" />
                Interactive Functional Tree Hierarchy — Root System → Category Nodes → Module Leaves → Connected DB Entities
              </h3>
              <p className="text-xs text-slate-400">
                Expand or collapse any functional branch to inspect role permissions, live metrics, and mapped database tables
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  setExpandedCategories({
                    '1. Executive & Relational DB Governance': true,
                    '2. Operations & Performance Management': true,
                    '3. Quality Assurance & QCP Certification': true,
                    '4. Training Delivery, NHT, CS & CLP': true,
                    '5. Compliance, Knowledge & Enterprise Reports': true,
                  })
                }
                className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
              >
                Expand All Branches
              </button>
              <button
                type="button"
                onClick={() => setExpandedCategories({})}
                className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Root Node */}
          <div className="space-y-3 font-sans">
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/40 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Network className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="text-xs font-extrabold text-white uppercase tracking-wider">
                    ROOT: TRAINER SAM RCM ENTERPRISE L&D & GOVERNANCE OS
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Active Session: <strong className="text-indigo-300">{activeRoleMeta.title}</strong> ({activeRoleMeta.personaName})
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-semibold">
                6 Relational DB Entities Connected
              </span>
            </div>

            {/* Category Branches */}
            <div className="pl-4 sm:pl-6 border-l-2 border-indigo-500/30 space-y-3">
              {categories.map((cat) => {
                const isExpanded = !!expandedCategories[cat];
                const branchModules = MODULE_TREE_CATALOG.filter((m) => m.category === cat);
                const unlockedInBranch = branchModules.filter(
                  (m) => loginRole === 'admin' || m.allowedRoles.includes(loginRole)
                ).length;

                return (
                  <div key={cat} className="space-y-2">
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between text-left transition-all"
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="text-xs font-bold text-white">{cat}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {unlockedInBranch}/{branchModules.length} Modules Accessible
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="pl-5 sm:pl-8 border-l-2 border-slate-800 space-y-2">
                        {branchModules.map((mod) => {
                          const isUnlocked =
                            loginRole === 'admin' || mod.allowedRoles.includes(loginRole);
                          return (
                            <div
                              key={mod.id}
                              onClick={() => handleModuleClick(mod)}
                              className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 transition-all ${
                                isUnlocked
                                  ? 'bg-slate-950/80 border-slate-800 hover:border-indigo-500 cursor-pointer'
                                  : 'bg-slate-950/30 border-slate-900 opacity-55 cursor-not-allowed'
                              }`}
                            >
                              <div className="space-y-1 max-w-2xl">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800">
                                    ├─ {mod.code}
                                  </span>
                                  <span className="text-xs font-bold text-white">
                                    {mod.shortTitle}
                                  </span>
                                  <span className="text-[11px] text-emerald-400 font-medium">
                                    ({getModuleLiveStat(mod.id)})
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 pl-2">{mod.description}</p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-1">
                                  {mod.connectedEntities.map((e) => (
                                    <span
                                      key={e}
                                      className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300"
                                    >
                                      {e}
                                    </span>
                                  ))}
                                </div>

                                {isUnlocked ? (
                                  <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-semibold">
                                    Launch →
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-rose-300 border border-rose-500/30 text-[10px] font-semibold flex items-center gap-1">
                                    <Lock className="w-3 h-3" /> Locked
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 2. RELATIONAL DATABASE & ENTITY MAPPING STUDIO
//    Connects: USER <-> USERGROUP <-> PROJECT <-> TRAINER <-> COURSE <-> ASSESSMENT
// ============================================================================

interface RelationalDatabaseMappingStudioProps {
  projects: ProjectHealth[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectHealth[]>>;
  associates: AssociateProfile[];
  setAssociates: React.Dispatch<React.SetStateAction<AssociateProfile[]>>;
  userGroups: UserGroup[];
  setUserGroups: React.Dispatch<React.SetStateAction<UserGroup[]>>;
  learningModules: ContinuousLearningModule[];
  complianceCourses: MandatoryComplianceCourse[];
  weeklyAssessments: ProjectWeeklyAssessment[];
  setWeeklyAssessments: React.Dispatch<React.SetStateAction<ProjectWeeklyAssessment[]>>;
  questionBank: ProjectQuestionBankItem[];
  csModules: ClientSpecificArModule[];
  csEnrollments: CsTraineeEnrollmentRecord[];
  triggerToast: (msg: string) => void;
}

export const RelationalDatabaseMappingStudio: React.FC<RelationalDatabaseMappingStudioProps> = ({
  projects,
  setProjects,
  associates,
  setAssociates,
  userGroups,
  setUserGroups,
  learningModules,
  complianceCourses,
  weeklyAssessments,
  questionBank,
  csModules,
  csEnrollments,
  triggerToast,
}) => {
  // Selected Project or User to inspect its full 6-Entity Relational Tree
  const [inspectProjectId, setInspectProjectId] = useState<string>(projects[0]?.id || 'PRJ-ORTH-02');

  // Interactive Relational Linker Form State (Map User -> UserGroup -> Project -> Trainer -> Course -> Assessment)
  const [mapUserId, setMapUserId] = useState<string>(associates[0]?.id || 'ASSOC-101');
  const [mapGroupId, setMapGroupId] = useState<string>(userGroups[0]?.id || 'UG-BQT-NOV');
  const [mapProjectId, setMapProjectId] = useState<string>(projects[0]?.id || 'PRJ-ORTH-02');
  const [mapTrainerName, setMapTrainerName] = useState<string>(
    TRAINER_DIRECTORY[1]?.name || 'Ananya Iyer'
  );
  const [mapCourseId, setMapCourseId] = useState<string>(
    learningModules[0]?.id || 'MOD-WK-101'
  );
  const [mapAssessmentId, setMapAssessmentId] = useState<string>(
    weeklyAssessments[0]?.id || 'WKA-SOS-01'
  );

  const inspectedProject = useMemo(
    () => projects.find((p) => p.id === inspectProjectId) || projects[0],
    [projects, inspectProjectId]
  );

  // Compute all foreign-key linked entities for the inspected Project
  const projectRelationalTree = useMemo(() => {
    const linkedUsers = associates.filter((a) => a.projectId === inspectedProject.id);
    const linkedTrainers = TRAINER_DIRECTORY.filter((t) =>
      t.assignedProjectIds.includes(inspectedProject.id)
    );
    const linkedGroups = userGroups.filter((g) =>
      g.memberIds.some((mId) => linkedUsers.some((u) => u.id === mId))
    );
    const linkedCourses = learningModules.filter(
      (m) =>
        inspectedProject.assignedCourseIds.includes(m.id) ||
        m.specialty === inspectedProject.specialty ||
        m.specialty === 'All Specialties'
    );
    const linkedCsModules = csModules.filter((cs) => cs.projectId === inspectedProject.id);
    const linkedAssessments = weeklyAssessments.filter(
      (w) => w.projectId === inspectedProject.id
    );
    const linkedQuestions = questionBank.filter((q) => q.projectId === inspectedProject.id);

    return {
      linkedUsers,
      linkedTrainers,
      linkedGroups,
      linkedCourses,
      linkedCsModules,
      linkedAssessments,
      linkedQuestions,
    };
  }, [
    inspectedProject,
    associates,
    userGroups,
    learningModules,
    csModules,
    weeklyAssessments,
    questionBank,
  ]);

  // Execute End-to-End 6-Entity Relational Mapping Transaction
  const handleExecuteRelationalMapping = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProject = projects.find((p) => p.id === mapProjectId) || projects[0];
    const targetUser = associates.find((u) => u.id === mapUserId) || associates[0];

    // 1. Update User record with Project, Trainer, UserGroup & Course
    setAssociates((prev) =>
      prev.map((a) => {
        if (a.id !== targetUser.id) return a;
        const nextGroups = a.userGroupIds.includes(mapGroupId)
          ? a.userGroupIds
          : [...a.userGroupIds, mapGroupId];
        const nextMods = a.assignedWeeklyModules.includes(mapCourseId)
          ? a.assignedWeeklyModules
          : [...a.assignedWeeklyModules, mapCourseId];
        return {
          ...a,
          projectId: targetProject.id,
          projectName: targetProject.projectName,
          specialty: targetProject.specialty,
          assignedTrainer: mapTrainerName,
          userGroupIds: nextGroups,
          assignedWeeklyModules: nextMods,
        };
      })
    );

    // 2. Update UserGroup with Member & Course
    setUserGroups((prev) =>
      prev.map((g) => {
        if (g.id !== mapGroupId) return g;
        const nextMembers = g.memberIds.includes(targetUser.id)
          ? g.memberIds
          : [...g.memberIds, targetUser.id];
        const nextCourses = g.assignedCourseIds.includes(mapCourseId)
          ? g.assignedCourseIds
          : [...g.assignedCourseIds, mapCourseId];
        return {
          ...g,
          memberIds: nextMembers,
          assignedCourseIds: nextCourses,
        };
      })
    );

    // 3. Update Project with Trainer & Assigned Course
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== targetProject.id) return p;
        const nextCourses = p.assignedCourseIds.includes(mapCourseId)
          ? p.assignedCourseIds
          : [...p.assignedCourseIds, mapCourseId];
        return {
          ...p,
          ldTrainer: mapTrainerName,
          assignedCourseIds: nextCourses,
        };
      })
    );

    setInspectProjectId(targetProject.id);
    triggerToast(
      `Relational DB Transaction Committed: Linked User "${targetUser.name}" ↔ Group "${mapGroupId}" ↔ Project "${targetProject.clientCode}" ↔ Trainer "${mapTrainerName}" ↔ Course "${mapCourseId}" ↔ Assessment "${mapAssessmentId}"!`
    );
  };

  // Export Master Relational Join Table (CSV) for Database & BI Reporting
  const handleExportMasterRelationalCsv = () => {
    const header =
      'USER_ID,EMP_ID,USER_NAME,SYSTEM_ROLE,BATCH_CODE,USER_GROUPS,PROJECT_ID,CLIENT_CODE,PROJECT_NAME,SPECIALTY,TOWER,TRAINER_NAME,TRAINING_LEAD,REPORTING_LEAD,OPS_MANAGER,QA_AUDITOR,ASSIGNED_COURSES,CS_MODULE_CODE,WEEKLY_ASSESSMENTS_COUNT,QUESTION_BANK_COUNT,PRODUCTION_SLA_PCT,QUALITY_SLA_PCT,CONSECUTIVE_WKS_BELOW_QA,GOVERNANCE_STAGE\n';

    const rows = associates
      .map((u) => {
        const proj = projects.find((p) => p.id === u.projectId) || projects[0];
        const grpNames = u.userGroupIds
          .map((gid) => userGroups.find((g) => g.id === gid)?.code || gid)
          .join(' | ');
        const csMod =
          csModules.find((c) => c.projectId === u.projectId)?.moduleCode || 'AR-CS-STD';
        const projAssessCount = weeklyAssessments.filter(
          (w) => w.projectId === u.projectId
        ).length;
        const projQCount = questionBank.filter((q) => q.projectId === u.projectId).length;

        return `"${u.id}","${u.empId}","${u.name}","${u.systemRole}","${u.batchCode}","${grpNames}","${proj.id}","${proj.clientCode}","${proj.projectName}","${u.specialty}","${u.tower}","${u.assignedTrainer}","${u.trainingLead}","${u.reportingLead}","${u.operationsManager}","${u.assignedAuditor}","${u.assignedWeeklyModules.join(' | ')}","${csMod}",${projAssessCount},${projQCount},${u.productionSlaPct},${u.qualityActualPct},${u.consecutiveWeeksBelowQa},"${u.governanceStage}"`;
      })
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TrainerSam_Master_Relational_DB_Join_2026-11-07.csv';
    a.click();
    URL.revokeObjectURL(url);
    triggerToast(
      'Exported Master 6-Entity Relational Database Join CSV (Users ↔ Groups ↔ Projects ↔ Trainers ↔ Courses ↔ Assessments)!'
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              Relational Database Schema & 6-Entity Mapping Studio
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              User ↔ UserGroup ↔ Project ↔ Trainer ↔ Course ↔ Assessment
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Unified foreign-key entity graph and live relational mapper powering cross-table analytics, scoped trainer access, and enterprise reporting
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportMasterRelationalCsv}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          <Download className="w-4 h-4" />
          <span>Export Master Relational Join Table (CSV)</span>
        </button>
      </div>

      {/* =====================================================================
          SECTION 1: VISUAL 6-ENTITY RELATIONAL SCHEMA ARCHITECTURE
         ===================================================================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
          <Network className="w-4 h-4" />
          <span>Enterprise 6-Table Relational Schema & Foreign-Key Cardinality</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
          {[
            {
              table: '1. USERS (associates)',
              pk: 'PK: id / empId',
              fks: ['FK: projectId → PROJECTS', 'FK: assignedTrainer → TRAINERS', 'M:N userGroupIds → GROUPS'],
              count: `${associates.length} Records`,
              color: 'border-sky-500/40 bg-sky-950/20',
            },
            {
              table: '2. USER_GROUPS (cohorts)',
              pk: 'PK: id / code',
              fks: ['M:N memberIds → USERS', 'M:N assignedCourseIds → COURSES'],
              count: `${userGroups.length} Cohorts`,
              color: 'border-purple-500/40 bg-purple-950/20',
            },
            {
              table: '3. PROJECTS (clients)',
              pk: 'PK: id / clientCode',
              fks: ['FK: ldTrainer → TRAINERS', 'FK: assignedAuditor → USERS', 'M:N assignedCourseIds'],
              count: `${projects.length} Projects`,
              color: 'border-indigo-500/40 bg-indigo-950/20',
            },
            {
              table: '4. TRAINERS (directory)',
              pk: 'PK: id / name',
              fks: ['M:N assignedProjectIds → PROJECTS', '1:N Closes Training Tickets'],
              count: `${TRAINER_DIRECTORY.length} Trainers`,
              color: 'border-emerald-500/40 bg-emerald-950/20',
            },
            {
              table: '5. COURSES (NHT/CS/DBT)',
              pk: 'PK: id / moduleCode',
              fks: ['FK: projectId → PROJECTS', 'M:N Enrolled Users & Groups'],
              count: `${learningModules.length + complianceCourses.length + csModules.length} Courses`,
              color: 'border-amber-500/40 bg-amber-950/20',
            },
            {
              table: '6. ASSESSMENTS (PKT/QCP)',
              pk: 'PK: id (Weekly 4 / QCP)',
              fks: ['FK: projectId → PROJECTS', 'M:N questionIds → QUESTION_BANK'],
              count: `${weeklyAssessments.length + csEnrollments.length} Active Gates`,
              color: 'border-rose-500/40 bg-rose-950/20',
            },
          ].map((tbl) => (
            <div
              key={tbl.table}
              className={`p-3.5 rounded-xl border ${tbl.color} flex flex-col justify-between space-y-2.5`}
            >
              <div className="space-y-1">
                <div className="font-bold text-white text-xs">{tbl.table}</div>
                <div className="font-mono text-[10px] text-cyan-300">{tbl.pk}</div>
              </div>
              <ul className="space-y-1 text-[10px] text-slate-300 font-mono">
                {tbl.fks.map((fk) => (
                  <li key={fk}>• {fk}</li>
                ))}
              </ul>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] font-bold text-emerald-400">
                {tbl.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
          SECTION 2: INTERACTIVE 6-ENTITY RELATIONAL MAPPER FORM
         ===================================================================== */}
      <form
        onSubmit={handleExecuteRelationalMapping}
        className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Link2 className="w-4 h-4 text-indigo-400" />
              Live Cross-Entity Relational Linker (Map User ↔ User Group ↔ Project ↔ Trainer ↔ Course ↔ Assessment)
            </h3>
            <p className="text-xs text-slate-400">
              Bind all 6 relational entities in a single transaction so dashboards, trainer workbenches, and reports stay 100% synchronized
            </p>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md"
          >
            Commit 6-Entity Mapping Transaction
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">1. User (Associate)</label>
            <select
              value={mapUserId}
              onChange={(e) => setMapUserId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-white"
            >
              {associates.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.empId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">2. User Group / Cohort</label>
            <select
              value={mapGroupId}
              onChange={(e) => setMapGroupId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-white"
            >
              {userGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.code} • {g.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">3. Client Project</label>
            <select
              value={mapProjectId}
              onChange={(e) => setMapProjectId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-white"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.clientCode} • {p.projectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">4. Assigned Trainer</label>
            <select
              value={mapTrainerName}
              onChange={(e) => setMapTrainerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-white"
            >
              {TRAINER_DIRECTORY.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name} ({t.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">5. Course / Module</label>
            <select
              value={mapCourseId}
              onChange={(e) => setMapCourseId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-white"
            >
              {learningModules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} • {m.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">6. Weekly / PKT Exam</label>
            <select
              value={mapAssessmentId}
              onChange={(e) => setMapAssessmentId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-white"
            >
              {weeklyAssessments.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.id} • {w.pillar}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>

      {/* =====================================================================
          SECTION 3: INTERACTIVE TREE INSPECTOR OF CONNECTED PROJECT ENTITIES
         ===================================================================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white">
              Interactive Entity Tree Inspector — Select Project to Trace All Connected DB Records
            </h3>
            <p className="text-xs text-slate-400">
              Displays the live relational join tree for <strong className="text-white">{inspectedProject.projectName}</strong>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {projects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setInspectProjectId(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  p.id === inspectedProject.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {p.clientCode}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Node 1: Project & 6-Role Hierarchy */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-indigo-300 uppercase">
              ├─ PROJECT NODE: {inspectedProject.clientCode}
            </div>
            <div className="font-bold text-white text-sm">{inspectedProject.projectName}</div>
            <div className="text-slate-400">
              Specialty: <strong className="text-emerald-300">{inspectedProject.specialty}</strong> • EHR:{' '}
              {inspectedProject.ehrSystem}
            </div>
            <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px]">
              <div>• Reporting Lead: <strong className="text-white">{inspectedProject.reportingLead}</strong></div>
              <div>• Ops Manager: <strong className="text-sky-300">{inspectedProject.operationsManager}</strong></div>
              <div>• Assigned Trainer: <strong className="text-emerald-300">{inspectedProject.ldTrainer}</strong></div>
              <div>• Training Lead: <strong className="text-indigo-300">{inspectedProject.trainingLead}</strong></div>
              <div>• QA Auditor: <strong className="text-amber-300">{inspectedProject.assignedAuditor}</strong></div>
            </div>
          </div>

          {/* Node 2: Mapped Users & User Groups */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-sky-300 uppercase">
              ├─ MAPPED USERS ({projectRelationalTree.linkedUsers.length}) & USER GROUPS ({projectRelationalTree.linkedGroups.length})
            </div>
            <div className="space-y-1.5">
              {projectRelationalTree.linkedUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white">{u.name}</span>{' '}
                    <span className="font-mono text-[10px] text-indigo-300">({u.empId})</span>
                    <div className="text-[10px] text-slate-400">
                      Batch: {u.batchCode} • Stage: {u.governanceStage}
                    </div>
                  </div>
                  <span className="font-bold text-emerald-400 tabular-nums">
                    QA {u.qualityActualPct}%
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-1 flex flex-wrap gap-1">
              {projectRelationalTree.linkedGroups.map((g) => (
                <span
                  key={g.id}
                  className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px]"
                >
                  Group: {g.code}
                </span>
              ))}
            </div>
          </div>

          {/* Node 3: Mapped Courses, CS Modules, Weekly 4 Assessments & Question Bank */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-300 uppercase">
              └─ MAPPED COURSES ({projectRelationalTree.linkedCourses.length + projectRelationalTree.linkedCsModules.length}) & ASSESSMENTS ({projectRelationalTree.linkedAssessments.length})
            </div>
            <div className="space-y-1 text-[11px]">
              {projectRelationalTree.linkedCsModules.map((cs) => (
                <div
                  key={cs.id}
                  className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 font-semibold"
                >
                  ★ CS Module: {cs.moduleCode} ({cs.processPracticeDays}d Practice + {cs.ojtDays}d OJT + QCP 90%)
                </div>
              ))}
              {projectRelationalTree.linkedCourses.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-200"
                >
                  • Course {c.id}: {c.title}
                </div>
              ))}
              <div className="pt-1 text-indigo-300 font-semibold">
                • Weekly 4 Assessments Linked: {projectRelationalTree.linkedAssessments.length} Exams ({projectRelationalTree.linkedQuestions.length} Validated Question Bank Items)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
