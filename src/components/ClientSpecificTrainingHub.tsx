import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Cpu,
  Download,
  FileCheck2,
  Filter,
  Flame,
  FolderKanban,
  GraduationCap,
  Layers,
  ListChecks,
  Play,
  Plus,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  Wrench,
} from 'lucide-react';
import { AssociateProfile, ProjectHealth, ProviderSpecialty, RcmTower } from '../types/rcm';
import { PROVIDER_SPECIALTIES } from '../data/mockRcmData';

// ============================================================================
// DATA MODELS FOR AR CLIENT-SPECIFIC (CS) TRAINING & QUALITY CERTIFICATION PROCESS (QCP)
// ============================================================================

export type CsIntakePathway =
  | 'Lateral Hire (Direct to AR CS Training)'
  | 'Post-NHT Graduate (After NHT - AR / Billing)';

export type CsTrainingLifecycleStage =
  | '1. Classroom & Workflow Knowledge'
  | '2. Process Practice Days'
  | '3. On-the-Job Training (OJT)'
  | '4. QCP Attempt 1 (3-Day Avg >= 90%)'
  | '5. Refresher Day (Post QCP-1 Fail)'
  | '6. QCP Attempt 2 (2-Day Avg >= 90%)'
  | 'Certified — QCP-1 Pass (3-Day >= 90%)'
  | 'Certified — QCP-2 Pass (2-Day >= 90%)'
  | 'Certified — QCP Exempted (Fast-Track)'
  | 'Action Required — QCP-2 Failed (< 90%)';

export interface ClientSpecificArModule {
  id: string;
  moduleCode: string;
  title: string;
  projectId: string;
  projectName: string;
  clientCode: string;
  specialty: ProviderSpecialty;
  tower: RcmTower;
  assignedTrainer: string;
  trainingLead: string;
  qaAuditor: string;
  // Customizable Client-Specific Pillars
  softwaresAndTools: string[];
  clientPayers: string[];
  clientScenarios: string[];
  recentUpdatesIncluded: string[];
  projectStructureAndWorkflow: {
    queueArchitecture: string;
    escalationMatrix: string;
    writeOffThreshold: string;
    soapNoteStandard: string;
  };
  // Duration & Gate Rules
  classroomDays: number;
  processPracticeDays: number;
  ojtDays: number;
  qcp1Days: 3;
  qcp1PassMarkPct: 90;
  refresherDaysIfFail: 1;
  qcp2Days: 2;
  qcp2PassMarkPct: 90;
  allowQcpExemption: boolean;
  createdAt: string;
}

export interface CsTraineeEnrollmentRecord {
  id: string;
  traineeName: string;
  empId: string;
  batchCode: string;
  intakePathway: CsIntakePathway;
  priorExperienceYears: number;
  csModuleId: string;
  csModuleCode: string;
  projectId: string;
  projectName: string;
  specialty: ProviderSpecialty;
  assignedTrainer: string;
  reportingLead: string;
  qaAuditor: string;
  // Stage & Practice Days
  currentStage: CsTrainingLifecycleStage;
  practiceDaysCompleted: number;
  practiceDaysTarget: number;
  // On-the-Job Training (OJT) Metrics
  ojtProductionPct: number;
  ojtClaimsWorkedPerDay: number;
  ojtTargetPerDay: number;
  ojtQualityPct: number;
  ojtErrorSummary: string;
  ojtTopDefects: string[];
  // Quality Certification Process (QCP Attempt 1: 3 Days Average - 90% Pass Mark)
  qcp1Day1Pct: number | null;
  qcp1Day2Pct: number | null;
  qcp1Day3Pct: number | null;
  qcp1AveragePct: number | null;
  qcp1Status: 'Pending' | 'Passed (>= 90%)' | 'Failed (< 90% -> Refresher Day)' | 'Exempted';
  // Refresher Day (If QCP 1 Failed)
  refresherDayRequired: boolean;
  refresherDayCompleted: boolean;
  refresherTrainerNotes?: string;
  // QCP Attempt 2 (2 Days Average - 90% Pass Mark)
  qcp2Day1Pct: number | null;
  qcp2Day2Pct: number | null;
  qcp2AveragePct: number | null;
  qcp2Status: 'Not Applicable' | 'Pending' | 'Passed (>= 90%)' | 'Failed (< 90%)';
  // QCP Exemption
  qcpExempted: boolean;
  qcpExemptionReason?: string;
  qcpExemptionApprovedBy?: string;
  finalReleaseDate?: string;
}

export const INITIAL_CS_AR_MODULES: ClientSpecificArModule[] = [
  {
    id: 'CS-MOD-ORTHO-01',
    moduleCode: 'AR-CS-ORTHO-101',
    title: 'Summit Ortho & Spine — Client-Specific AR, Denials & Evicore Appeals Training',
    projectId: 'PRJ-ORTH-02',
    projectName: 'Summit Ortho & Spine Group',
    clientCode: 'SOS-ORTH',
    specialty: 'Orthopedics & Sports Med',
    tower: 'Accounts Receivable (AR)',
    assignedTrainer: 'Ananya Iyer',
    trainingLead: 'Samrat Bose',
    qaAuditor: 'Neha Kulkarni',
    softwaresAndTools: [
      'AthenaCollector PMS',
      'Waystar Clearinghouse',
      'Evicore Musculoskeletal Portal',
      'Availity Essentials',
      'Optum Encoder Pro',
    ],
    clientPayers: [
      'UnitedHealthcare Commercial & Medicare Advantage',
      'Medicare Part B (Novitas JL)',
      'BlueCross BlueShield Texas',
      'Aetna Ortho PPO',
      'Texas Workers’ Comp (TDI)',
    ],
    clientScenarios: [
      'Scenario 1: High-Dollar (> $2,500) Total Knee/Hip Implant & Arthroscopy (CPT 29880/29881) CO-197 Evicore Retro-Auth',
      'Scenario 2: Global Surgical Period (90-Day Major vs 10-Day Minor) E/M Unbundling with Modifier -24 / -25 / -57',
      'Scenario 3: CO-29 Timely Filing Limit Reconsideration using Waystar ANSI 277CA Electronic Acceptance Proof',
      'Scenario 4: Bilateral Joint Injection (CPT 20610-50 vs RT/LT) MUE Edit Resolution',
    ],
    recentUpdatesIncluded: [
      'UPD-OR-319: UHC Evicore Retro-Auth Window Reduced to 5 Business Days for Urgent Ortho MRI/CT',
      'SOS-PB-09: Mandatory Supervisor Sign-off on Contractual Write-Offs > $250',
    ],
    projectStructureAndWorkflow: {
      queueArchitecture:
        'Workqueues split by Aging Bucket (31–60, 61–90, 91–120, 120+) and Dollar Tier (Tier 1: >$2,500, Tier 2: $500–$2,500, Tier 3: <$500)',
      escalationMatrix:
        'Unresolved payer stalls > 21 days route to Reporting Lead (Deepak Nair) → Client Billing Liaison',
      writeOffThreshold:
        'Auto small-balance adjustment <= $15.00; $15.01–$250 requires Team Lead; > $250 requires Ops Manager',
      soapNoteStandard:
        '8-Point Athena Annotation: [Payer/Portal] + [Claim#] + [CARC/RARC] + [Root Cause] + [Action Taken] + [Call Ref#/Rep] + [TAT] + [Next Follow-up]',
    },
    classroomDays: 3,
    processPracticeDays: 4,
    ojtDays: 5,
    qcp1Days: 3,
    qcp1PassMarkPct: 90,
    refresherDaysIfFail: 1,
    qcp2Days: 2,
    qcp2PassMarkPct: 90,
    allowQcpExemption: true,
    createdAt: '2026-10-15',
  },
  {
    id: 'CS-MOD-CARD-02',
    moduleCode: 'AR-CS-CARD-102',
    title: 'Apex Heart & Vascular — Client-Specific AR, Cath Lab / PCI & NCCI Appeals Training',
    projectId: 'PRJ-CARD-01',
    projectName: 'Apex Heart & Vascular Institute',
    clientCode: 'AHV-CARD',
    specialty: 'Cardiology & Vascular',
    tower: 'Accounts Receivable (AR)',
    assignedTrainer: 'Ritu Chatterjee',
    trainingLead: 'Samrat Bose',
    qaAuditor: 'Sanjay Gupta',
    softwaresAndTools: [
      'Epic Resolute PB/HB',
      'Change Healthcare Assurance',
      'Carelon Cardiology Portal',
      'Novitas Sphere MAC Portal',
      '3M 360 Encompass',
    ],
    clientPayers: [
      'Medicare Part B (Novitas)',
      'Aetna Medicare Advantage',
      'Cigna HealthSpring',
      'BCBS Horizon',
      'Humana Gold Plus',
    ],
    clientScenarios: [
      'Scenario 1: Multi-Vessel Coronary PCI (92928) & Diagnostic Cath (93458) Anatomical Modifier (-LD, -LC, -RC) Denials',
      'Scenario 2: Same-Day Outpatient E/M (99214-25) + 12-Lead ECG (93000) + Echo (93306-26) CO-B15 / CO-97 Bundling Appeals',
      'Scenario 3: Implantable Loop Recorder (33285) & Pacemaker Remote Interrogation (93294) 90-Day Frequency Denials',
    ],
    recentUpdatesIncluded: [
      'UPD-CV-312: Mandatory Modifier -25 & Anatomical Coronary Modifiers (-LD, -LC, -RC) Audit Check',
    ],
    projectStructureAndWorkflow: {
      queueArchitecture:
        'Epic Resolute WQ segmented by Payer Financial Class (Medicare, Commercial, Medicare Advantage) & Invasive vs Non-Invasive Cardiology',
      escalationMatrix:
        'Clinical coding disputes route to Certified Cardiology Coder queue within 24 hours; Payer underpayments route to Contract Variance WQ',
      writeOffThreshold: 'Zero unilateral write-off on Invasive Cath/EP claims; requires Client Auth',
      soapNoteStandard:
        'Epic SmartPhrase .RCMSOAP8 mandatory on all touched accounts with Call Reference # and LCD Article citation',
    },
    classroomDays: 3,
    processPracticeDays: 3,
    ojtDays: 5,
    qcp1Days: 3,
    qcp1PassMarkPct: 90,
    refresherDaysIfFail: 1,
    qcp2Days: 2,
    qcp2PassMarkPct: 90,
    allowQcpExemption: true,
    createdAt: '2026-10-18',
  },
  {
    id: 'CS-MOD-GI-03',
    moduleCode: 'AR-CS-GI-103',
    title: 'Metro Digestive & GI Endoscopy — Client-Specific AR, ASC/Prof Split & Preventive GI Training',
    projectId: 'PRJ-GI-06',
    projectName: 'Metro Digestive & GI Endoscopy Partners',
    clientCode: 'MDG-GAST',
    specialty: 'Gastroenterology',
    tower: 'Accounts Receivable (AR)',
    assignedTrainer: 'Ananya Iyer',
    trainingLead: 'Samrat Bose',
    qaAuditor: 'Neha Kulkarni',
    softwaresAndTools: [
      'NextGen Enterprise PM',
      'gGastro Endoscopy EHR',
      'Availity Clearinghouse',
      'PaySpan ERA Portal',
    ],
    clientPayers: [
      'Medicare Part B',
      'BCBS Anthem',
      'UnitedHealthcare',
      'Aetna Commercial ACA',
      'Cigna PPO',
    ],
    clientScenarios: [
      'Scenario 1: Screening-to-Diagnostic Colonoscopy (45378 → 45380/45385) Modifier -PT (Medicare) vs -33 (Commercial) Deductible Waivers',
      'Scenario 2: Same-Session Upper EGD (43239) + Colonoscopy (45385) Multiple Endoscopy Family Discount Calculation',
      'Scenario 3: Anesthesia for Lower Endoscopy (00812 vs 00811) Medical Direction Modifiers (-AA, -QK, -QX)',
    ],
    recentUpdatesIncluded: [
      'UPD-GI-308: Screening-to-Diagnostic Colonoscopy (CPT 45378 → 45380/45385) Modifier -PT vs -33 Routing',
    ],
    projectStructureAndWorkflow: {
      queueArchitecture:
        'Dual-queue split: Professional Physician Claims (POS 22/24) vs Ambulatory Surgery Center (ASC Facility POS 24) queues',
      escalationMatrix:
        'Patient PR-2 deductible complaints on preventive colonoscopies escalate to GI Coding Review within 12 business hours',
      writeOffThreshold: 'Small balance write-off up to $20.00 allowed with NextGen reason code ADJ-SM',
      soapNoteStandard:
        'Standard 8-Point GI AR Note including Primary/Secondary ICD-10 pointer order and Preventive Modifier verification',
    },
    classroomDays: 2,
    processPracticeDays: 3,
    ojtDays: 4,
    qcp1Days: 3,
    qcp1PassMarkPct: 90,
    refresherDaysIfFail: 1,
    qcp2Days: 2,
    qcp2PassMarkPct: 90,
    allowQcpExemption: true,
    createdAt: '2026-10-22',
  },
];

export const INITIAL_CS_TRAINEE_ENROLLMENTS: CsTraineeEnrollmentRecord[] = [
  {
    id: 'CST-201',
    traineeName: 'Siddharth Verma',
    empId: 'RCM-5102',
    batchCode: 'BATCH-42 (Post-NHT Bridge)',
    intakePathway: 'Post-NHT Graduate (After NHT - AR / Billing)',
    priorExperienceYears: 0.5,
    csModuleId: 'CS-MOD-ORTHO-01',
    csModuleCode: 'AR-CS-ORTHO-101',
    projectId: 'PRJ-ORTH-02',
    projectName: 'Summit Ortho & Spine Group',
    specialty: 'Orthopedics & Sports Med',
    assignedTrainer: 'Ananya Iyer',
    reportingLead: 'Deepak Nair',
    qaAuditor: 'Neha Kulkarni',
    currentStage: 'Certified — QCP-1 Pass (3-Day >= 90%)',
    practiceDaysCompleted: 4,
    practiceDaysTarget: 4,
    ojtProductionPct: 96.5,
    ojtClaimsWorkedPerDay: 41,
    ojtTargetPerDay: 42,
    ojtQualityPct: 93.4,
    ojtErrorSummary:
      '2 minor SOAP note formatting omissions during OJT Day 2; zero critical CARC or Evicore auth errors.',
    ojtTopDefects: ['Minor SOAP TAT Omission'],
    qcp1Day1Pct: 91.5,
    qcp1Day2Pct: 93.0,
    qcp1Day3Pct: 94.5,
    qcp1AveragePct: 93.0,
    qcp1Status: 'Passed (>= 90%)',
    refresherDayRequired: false,
    refresherDayCompleted: false,
    qcp2Day1Pct: null,
    qcp2Day2Pct: null,
    qcp2AveragePct: null,
    qcp2Status: 'Not Applicable',
    qcpExempted: false,
    finalReleaseDate: '2026-11-04',
  },
  {
    id: 'CST-202',
    traineeName: 'Pooja Nambiar',
    empId: 'RCM-5118',
    batchCode: 'BATCH-42 (Post-NHT Bridge)',
    intakePathway: 'Post-NHT Graduate (After NHT - AR / Billing)',
    priorExperienceYears: 0.3,
    csModuleId: 'CS-MOD-ORTHO-01',
    csModuleCode: 'AR-CS-ORTHO-101',
    projectId: 'PRJ-ORTH-02',
    projectName: 'Summit Ortho & Spine Group',
    specialty: 'Orthopedics & Sports Med',
    assignedTrainer: 'Ananya Iyer',
    reportingLead: 'Deepak Nair',
    qaAuditor: 'Neha Kulkarni',
    currentStage: 'Certified — QCP-2 Pass (2-Day >= 90%)',
    practiceDaysCompleted: 4,
    practiceDaysTarget: 4,
    ojtProductionPct: 89.0,
    ojtClaimsWorkedPerDay: 37,
    ojtTargetPerDay: 42,
    ojtQualityPct: 86.8,
    ojtErrorSummary:
      'Missed UHC 5-day Evicore retro-auth window on 2 arthroscopy claims and used -59 instead of -XS during OJT.',
    ojtTopDefects: ['CO-197 Evicore Retro-Auth Window', 'Modifier -59 vs -XS Selection'],
    qcp1Day1Pct: 85.0,
    qcp1Day2Pct: 87.5,
    qcp1Day3Pct: 88.5,
    qcp1AveragePct: 87.0,
    qcp1Status: 'Failed (< 90% -> Refresher Day)',
    refresherDayRequired: true,
    refresherDayCompleted: true,
    refresherTrainerNotes:
      'Completed 1-Day Intensive Ortho CS Refresher on Evicore 5-day retro-auth workflow & NCCI X-modifiers with 15 practice claims.',
    qcp2Day1Pct: 92.0,
    qcp2Day2Pct: 94.0,
    qcp2AveragePct: 93.0,
    qcp2Status: 'Passed (>= 90%)',
    qcpExempted: false,
    finalReleaseDate: '2026-11-06',
  },
  {
    id: 'CST-203',
    traineeName: 'Rakesh Suryavanshi',
    empId: 'RCM-5140',
    batchCode: 'LAT-NOV-2026 (Lateral Hire)',
    intakePathway: 'Lateral Hire (Direct to AR CS Training)',
    priorExperienceYears: 4.5,
    csModuleId: 'CS-MOD-CARD-02',
    csModuleCode: 'AR-CS-CARD-102',
    projectId: 'PRJ-CARD-01',
    projectName: 'Apex Heart & Vascular Institute',
    specialty: 'Cardiology & Vascular',
    assignedTrainer: 'Ritu Chatterjee',
    reportingLead: 'Kiran Deshmukh',
    qaAuditor: 'Sanjay Gupta',
    currentStage: 'Certified — QCP Exempted (Fast-Track)',
    practiceDaysCompleted: 3,
    practiceDaysTarget: 3,
    ojtProductionPct: 106.0,
    ojtClaimsWorkedPerDay: 48,
    ojtTargetPerDay: 45,
    ojtQualityPct: 99.2,
    ojtErrorSummary:
      'Zero critical or major defects across 75 audited Cath Lab & PCI claims during OJT. Demonstrated mastery of Epic Resolute PB.',
    ojtTopDefects: ['Zero Defects — Star OJT Performer'],
    qcp1Day1Pct: null,
    qcp1Day2Pct: null,
    qcp1Day3Pct: null,
    qcp1AveragePct: null,
    qcp1Status: 'Exempted',
    refresherDayRequired: false,
    refresherDayCompleted: false,
    qcp2Day1Pct: null,
    qcp2Day2Pct: null,
    qcp2AveragePct: null,
    qcp2Status: 'Not Applicable',
    qcpExempted: true,
    qcpExemptionReason:
      '4.5 yrs prior Invasive Cardiology AR experience + 99.2% OJT Quality & 106% OJT Production across 5 OJT days.',
    qcpExemptionApprovedBy: 'Samrat Bose (Training Lead) & Meera Krishnan (Ops Manager)',
    finalReleaseDate: '2026-11-03',
  },
  {
    id: 'CST-204',
    traineeName: 'Divya Krishnan',
    empId: 'RCM-5164',
    batchCode: 'LAT-NOV-2026 (Lateral Hire)',
    intakePathway: 'Lateral Hire (Direct to AR CS Training)',
    priorExperienceYears: 2.0,
    csModuleId: 'CS-MOD-CARD-02',
    csModuleCode: 'AR-CS-CARD-102',
    projectId: 'PRJ-CARD-01',
    projectName: 'Apex Heart & Vascular Institute',
    specialty: 'Cardiology & Vascular',
    assignedTrainer: 'Ritu Chatterjee',
    reportingLead: 'Kiran Deshmukh',
    qaAuditor: 'Sanjay Gupta',
    currentStage: '4. QCP Attempt 1 (3-Day Avg >= 90%)',
    practiceDaysCompleted: 3,
    practiceDaysTarget: 3,
    ojtProductionPct: 94.0,
    ojtClaimsWorkedPerDay: 42,
    ojtTargetPerDay: 45,
    ojtQualityPct: 91.2,
    ojtErrorSummary:
      '1 minor omission of coronary branch modifier (-LD) on a multi-vessel stent claim during OJT Day 3; corrected in huddle.',
    ojtTopDefects: ['Coronary Vessel Modifier (-LD/-RC) Check'],
    qcp1Day1Pct: 91.0,
    qcp1Day2Pct: 89.5,
    qcp1Day3Pct: 92.5,
    qcp1AveragePct: 91.0,
    qcp1Status: 'Pending',
    refresherDayRequired: false,
    refresherDayCompleted: false,
    qcp2Day1Pct: null,
    qcp2Day2Pct: null,
    qcp2AveragePct: null,
    qcp2Status: 'Not Applicable',
    qcpExempted: false,
  },
  {
    id: 'CST-205',
    traineeName: 'Harshvardhan Rao',
    empId: 'RCM-5179',
    batchCode: 'BATCH-43 (Post-NHT Bridge)',
    intakePathway: 'Post-NHT Graduate (After NHT - AR / Billing)',
    priorExperienceYears: 0.2,
    csModuleId: 'CS-MOD-GI-03',
    csModuleCode: 'AR-CS-GI-103',
    projectId: 'PRJ-GI-06',
    projectName: 'Metro Digestive & GI Endoscopy Partners',
    specialty: 'Gastroenterology',
    assignedTrainer: 'Ananya Iyer',
    reportingLead: 'Deepak Nair',
    qaAuditor: 'Neha Kulkarni',
    currentStage: '6. QCP Attempt 2 (2-Day Avg >= 90%)',
    practiceDaysCompleted: 3,
    practiceDaysTarget: 3,
    ojtProductionPct: 88.5,
    ojtClaimsWorkedPerDay: 39,
    ojtTargetPerDay: 44,
    ojtQualityPct: 85.4,
    ojtErrorSummary:
      'Confused Medicare Modifier -PT with Commercial ACA Modifier -33 on converted screening colonoscopies (CPT 45385).',
    ojtTopDefects: ['Modifier -PT vs -33 Preventive GI Split', 'ASC POS 24 vs Prof POS 22'],
    qcp1Day1Pct: 84.0,
    qcp1Day2Pct: 86.5,
    qcp1Day3Pct: 87.5,
    qcp1AveragePct: 86.0,
    qcp1Status: 'Failed (< 90% -> Refresher Day)',
    refresherDayRequired: true,
    refresherDayCompleted: true,
    refresherTrainerNotes:
      'Completed mandatory 1-Day GI Refresher on -PT vs -33 preventive colonoscopy rules and NextGen dual-queue routing.',
    qcp2Day1Pct: 91.0,
    qcp2Day2Pct: 92.0,
    qcp2AveragePct: 91.5,
    qcp2Status: 'Pending',
    qcpExempted: false,
  },
];

// ============================================================================
// MAIN COMPONENT: AR CS TRAINING MODULE & QCP GOVERNANCE HUB
// ============================================================================

interface ClientSpecificTrainingHubProps {
  projects: ProjectHealth[];
  associates: AssociateProfile[];
  csModules: ClientSpecificArModule[];
  setCsModules: React.Dispatch<React.SetStateAction<ClientSpecificArModule[]>>;
  csEnrollments: CsTraineeEnrollmentRecord[];
  setCsEnrollments: React.Dispatch<React.SetStateAction<CsTraineeEnrollmentRecord[]>>;
  triggerToast: (msg: string) => void;
}

export const ClientSpecificTrainingHub: React.FC<ClientSpecificTrainingHubProps> = ({
  projects,
  csModules,
  setCsModules,
  csEnrollments,
  setCsEnrollments,
  triggerToast,
}) => {
  const [subView, setSubView] = useState<'dashboard_trends' | 'cs_modules' | 'ojt_qcp_tracker'>(
    'dashboard_trends'
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [pathwayFilter, setPathwayFilter] = useState<string>('ALL');
  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    csModules[0]?.id || 'CS-MOD-ORTHO-01'
  );
  const [selectedTraineeId, setSelectedTraineeId] = useState<string>(
    csEnrollments[3]?.id || csEnrollments[0]?.id || 'CST-204'
  );

  // Create New Customizable AR CS Training Module Modal/Form State
  const [showCreateModuleForm, setShowCreateModuleForm] = useState<boolean>(false);
  const [newModProjectId, setNewModProjectId] = useState<string>(projects[0]?.id || 'PRJ-ORTH-02');
  const [newModTitle, setNewModTitle] = useState<string>('');
  const [newModSoftwares, setNewModSoftwares] = useState<string>(
    'Epic Resolute PB/HB, Waystar Clearinghouse, Availity Essentials, Evicore Portal'
  );
  const [newModPayers, setNewModPayers] = useState<string>(
    'Medicare Part B, UnitedHealthcare, BlueCross BlueShield, Aetna, Cigna'
  );
  const [newModScenarios, setNewModScenarios] = useState<string>(
    'CO-197 Prior Auth Retro-Appeal | High-Dollar >$2,500 Denial Escalation | CO-29 Timely Filing 277CA POTF'
  );
  const [newModUpdates, setNewModUpdates] = useState<string>(
    'Nov 2026 Payer Prior Auth Turnaround Flash Update | Client Write-Off Matrix v2.4'
  );
  const [newModQueueArch, setNewModQueueArch] = useState<string>(
    'Segmented by Aging Bucket (30/60/90/120+) and Dollar Tier (>$2,500 High Priority)'
  );
  const [newModEscalation, setNewModEscalation] = useState<string>(
    'Payer stalls > 15 days escalate to Reporting Lead → Client Account Manager'
  );
  const [newModWriteOff, setNewModWriteOff] = useState<string>(
    'Small balance <= $15 auto-adjust; > $250 requires Ops Manager approval'
  );
  const [newModPracticeDays, setNewModPracticeDays] = useState<number>(4);
  const [newModOjtDays, setNewModOjtDays] = useState<number>(5);

  // Enroll Lateral Hire or Post-NHT Trainee Form State
  const [showEnrollModal, setShowEnrollModal] = useState<boolean>(false);
  const [enrollName, setEnrollName] = useState<string>('');
  const [enrollPathway, setEnrollPathway] = useState<CsIntakePathway>(
    'Lateral Hire (Direct to AR CS Training)'
  );
  const [enrollExpYears, setEnrollExpYears] = useState<number>(3);
  const [enrollModuleId, setEnrollModuleId] = useState<string>(
    csModules[0]?.id || 'CS-MOD-ORTHO-01'
  );
  const [enrollBatchCode, setEnrollBatchCode] = useState<string>('LAT-NOV-2026 (Lateral Cohort)');

  // Interactive OJT & QCP Evaluator Inputs for Selected Trainee
  const [editOjtProd, setEditOjtProd] = useState<number>(94.0);
  const [editOjtQual, setEditOjtQual] = useState<number>(91.2);
  const [editOjtErrorSummary, setEditOjtErrorSummary] = useState<string>('');
  const [editQcp1D1, setEditQcp1D1] = useState<number>(91.0);
  const [editQcp1D2, setEditQcp1D2] = useState<number>(89.5);
  const [editQcp1D3, setEditQcp1D3] = useState<number>(92.5);
  const [editRefresherNote, setEditRefresherNote] = useState<string>(
    'Completed 1-Day Intensive CS Refresher on client payer scenarios, software navigation, and error root-cause prevention.'
  );
  const [editQcp2D1, setEditQcp2D1] = useState<number>(91.0);
  const [editQcp2D2, setEditQcp2D2] = useState<number>(92.0);
  const [editExemptionReason, setEditExemptionReason] = useState<string>(
    'Seasoned Lateral Hire with >= 98% OJT Quality and 100%+ OJT Production across all practice & OJT days.'
  );

  const activeModule = useMemo(
    () => csModules.find((m) => m.id === selectedModuleId) || csModules[0],
    [csModules, selectedModuleId]
  );

  const filteredEnrollments = useMemo(() => {
    return csEnrollments.filter((e) => {
      const matchProj = selectedProjectId === 'ALL' || e.projectId === selectedProjectId;
      const matchPath = pathwayFilter === 'ALL' || e.intakePathway === pathwayFilter;
      return matchProj && matchPath;
    });
  }, [csEnrollments, selectedProjectId, pathwayFilter]);

  const activeTrainee = useMemo(
    () =>
      csEnrollments.find((t) => t.id === selectedTraineeId) ||
      filteredEnrollments[0] ||
      csEnrollments[0],
    [csEnrollments, selectedTraineeId, filteredEnrollments]
  );

  // Sync evaluator inputs when clicking a trainee
  const handleSelectTrainee = (trainee: CsTraineeEnrollmentRecord) => {
    setSelectedTraineeId(trainee.id);
    setEditOjtProd(trainee.ojtProductionPct);
    setEditOjtQual(trainee.ojtQualityPct);
    setEditOjtErrorSummary(trainee.ojtErrorSummary);
    setEditQcp1D1(trainee.qcp1Day1Pct ?? 90.0);
    setEditQcp1D2(trainee.qcp1Day2Pct ?? 91.0);
    setEditQcp1D3(trainee.qcp1Day3Pct ?? 92.0);
    setEditQcp2D1(trainee.qcp2Day1Pct ?? 91.0);
    setEditQcp2D2(trainee.qcp2Day2Pct ?? 92.0);
  };

  // Dashboard KPI Calculations
  const csDashboardStats = useMemo(() => {
    const total = filteredEnrollments.length;
    const lateralCount = filteredEnrollments.filter((e) =>
      e.intakePathway.includes('Lateral Hire')
    ).length;
    const postNhtCount = filteredEnrollments.filter((e) =>
      e.intakePathway.includes('Post-NHT')
    ).length;
    const avgOjtProd =
      filteredEnrollments.reduce((acc, e) => acc + e.ojtProductionPct, 0) / (total || 1);
    const avgOjtQual =
      filteredEnrollments.reduce((acc, e) => acc + e.ojtQualityPct, 0) / (total || 1);
    const qcp1Passed = filteredEnrollments.filter(
      (e) => e.qcp1Status === 'Passed (>= 90%)'
    ).length;
    const refresherTriggered = filteredEnrollments.filter((e) => e.refresherDayRequired).length;
    const qcp2Passed = filteredEnrollments.filter(
      (e) => e.qcp2Status === 'Passed (>= 90%)'
    ).length;
    const exemptedCount = filteredEnrollments.filter((e) => e.qcpExempted).length;
    const totalCertified = qcp1Passed + qcp2Passed + exemptedCount;

    return {
      total,
      lateralCount,
      postNhtCount,
      avgOjtProd: avgOjtProd.toFixed(1),
      avgOjtQual: avgOjtQual.toFixed(1),
      qcp1Passed,
      refresherTriggered,
      qcp2Passed,
      exemptedCount,
      totalCertified,
      overallClearancePct: total ? Math.round((totalCertified / total) * 100) : 100,
    };
  }, [filteredEnrollments]);

  // 6-Cohort Historical Trend of CS Training Activities & QCP Outcomes
  const csCohortTrends = [
    {
      cohort: 'CS-W1 (Oct 03)',
      lateralHires: 5,
      postNhtGrads: 8,
      ojtQualAvg: 89.8,
      qcp1PassRate: 69,
      qcp2RecoveryRate: 92,
      exemptions: 1,
    },
    {
      cohort: 'CS-W2 (Oct 10)',
      lateralHires: 6,
      postNhtGrads: 9,
      ojtQualAvg: 90.6,
      qcp1PassRate: 73,
      qcp2RecoveryRate: 93,
      exemptions: 1,
    },
    {
      cohort: 'CS-W3 (Oct 17)',
      lateralHires: 4,
      postNhtGrads: 10,
      ojtQualAvg: 91.4,
      qcp1PassRate: 78,
      qcp2RecoveryRate: 95,
      exemptions: 2,
    },
    {
      cohort: 'CS-W4 (Oct 24)',
      lateralHires: 7,
      postNhtGrads: 8,
      ojtQualAvg: 92.1,
      qcp1PassRate: 80,
      qcp2RecoveryRate: 96,
      exemptions: 2,
    },
    {
      cohort: 'CS-W5 (Oct 31)',
      lateralHires: 6,
      postNhtGrads: 11,
      ojtQualAvg: 92.8,
      qcp1PassRate: 82,
      qcp2RecoveryRate: 97,
      exemptions: 2,
    },
    {
      cohort: 'CS-W6 (Nov 07)',
      lateralHires: csDashboardStats.lateralCount + 4,
      postNhtGrads: csDashboardStats.postNhtCount + 7,
      ojtQualAvg: Number(csDashboardStats.avgOjtQual),
      qcp1PassRate: 85,
      qcp2RecoveryRate: 98,
      exemptions: csDashboardStats.exemptedCount + 1,
    },
  ];

  // Handler: Create New Customizable AR CS Training Module
  const handleCreateCsModule = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProj = projects.find((p) => p.id === newModProjectId) || projects[0];
    const code = `AR-CS-${targetProj.clientCode.split('-')[0]}-${Math.floor(104 + Math.random() * 89)}`;
    const created: ClientSpecificArModule = {
      id: `CS-MOD-${Date.now().toString().slice(-4)}`,
      moduleCode: code,
      title:
        newModTitle.trim() ||
        `${targetProj.projectName} — Client-Specific AR, Tools, Scenarios & QCP Training`,
      projectId: targetProj.id,
      projectName: targetProj.projectName,
      clientCode: targetProj.clientCode,
      specialty: targetProj.specialty,
      tower: 'Accounts Receivable (AR)',
      assignedTrainer: targetProj.ldTrainer,
      trainingLead: targetProj.trainingLead,
      qaAuditor: targetProj.assignedAuditor,
      softwaresAndTools: newModSoftwares
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      clientPayers: newModPayers
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      clientScenarios: newModScenarios
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean),
      recentUpdatesIncluded: newModUpdates
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean),
      projectStructureAndWorkflow: {
        queueArchitecture: newModQueueArch,
        escalationMatrix: newModEscalation,
        writeOffThreshold: newModWriteOff,
        soapNoteStandard:
          'Standardized 8-Point Client SOAP Note with Payer Call Ref #, CARC/RARC, and Action Taken',
      },
      classroomDays: 3,
      processPracticeDays: newModPracticeDays,
      ojtDays: newModOjtDays,
      qcp1Days: 3,
      qcp1PassMarkPct: 90,
      refresherDaysIfFail: 1,
      qcp2Days: 2,
      qcp2PassMarkPct: 90,
      allowQcpExemption: true,
      createdAt: '2026-11-07',
    };

    setCsModules((prev) => [created, ...prev]);
    setSelectedModuleId(created.id);
    setShowCreateModuleForm(false);
    setNewModTitle('');
    setSubView('cs_modules');
    triggerToast(
      `Created Customizable AR CS Training Module "${created.moduleCode}" for ${targetProj.projectName} (${targetProj.specialty})!`
    );
  };

  // Handler: Enroll Lateral Hire or Post-NHT Graduate into AR CS Training
  const handleEnrollTrainee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollName.trim()) {
      triggerToast('Please enter the Trainee Name.');
      return;
    }
    const mod = csModules.find((m) => m.id === enrollModuleId) || csModules[0];
    const proj = projects.find((p) => p.id === mod.projectId) || projects[0];
    const newRecord: CsTraineeEnrollmentRecord = {
      id: `CST-${Math.floor(300 + Math.random() * 699)}`,
      traineeName: enrollName.trim(),
      empId: `RCM-${Math.floor(5200 + Math.random() * 799)}`,
      batchCode: enrollBatchCode,
      intakePathway: enrollPathway,
      priorExperienceYears:
        enrollPathway === 'Lateral Hire (Direct to AR CS Training)' ? enrollExpYears : 0.2,
      csModuleId: mod.id,
      csModuleCode: mod.moduleCode,
      projectId: mod.projectId,
      projectName: mod.projectName,
      specialty: mod.specialty,
      assignedTrainer: mod.assignedTrainer,
      reportingLead: proj.reportingLead,
      qaAuditor: mod.qaAuditor,
      currentStage: '2. Process Practice Days',
      practiceDaysCompleted: mod.processPracticeDays,
      practiceDaysTarget: mod.processPracticeDays,
      ojtProductionPct: 92.0,
      ojtClaimsWorkedPerDay: 39,
      ojtTargetPerDay: 42,
      ojtQualityPct: 90.5,
      ojtErrorSummary:
        'Enrolled in Client-Specific AR Practice & OJT. Monitoring software navigation and payer scenario accuracy.',
      ojtTopDefects: ['Initial Sandbox Calibration'],
      qcp1Day1Pct: null,
      qcp1Day2Pct: null,
      qcp1Day3Pct: null,
      qcp1AveragePct: null,
      qcp1Status: 'Pending',
      refresherDayRequired: false,
      refresherDayCompleted: false,
      qcp2Day1Pct: null,
      qcp2Day2Pct: null,
      qcp2AveragePct: null,
      qcp2Status: 'Not Applicable',
      qcpExempted: false,
    };

    setCsEnrollments((prev) => [newRecord, ...prev]);
    handleSelectTrainee(newRecord);
    setShowEnrollModal(false);
    setEnrollName('');
    setSubView('ojt_qcp_tracker');
    triggerToast(
      `Enrolled ${newRecord.traineeName} (${newRecord.intakePathway}) into ${mod.moduleCode}!`
    );
  };

  // Handler: Update OJT Production, Quality & Error Summary
  const handleSaveOjtMetrics = () => {
    if (!activeTrainee) return;
    setCsEnrollments((prev) =>
      prev.map((t) =>
        t.id === activeTrainee.id
          ? {
              ...t,
              ojtProductionPct: editOjtProd,
              ojtQualityPct: editOjtQual,
              ojtErrorSummary:
                editOjtErrorSummary.trim() || t.ojtErrorSummary,
              currentStage:
                t.currentStage === '1. Classroom & Workflow Knowledge' ||
                t.currentStage === '2. Process Practice Days'
                  ? '3. On-the-Job Training (OJT)'
                  : t.currentStage,
            }
          : t
      )
    );
    triggerToast(
      `Updated OJT Production (${editOjtProd}%), Quality (${editOjtQual}%) & Error Summary for ${activeTrainee.traineeName}.`
    );
  };

  // Handler: Evaluate QCP Attempt 1 (3 Days Average — 90% Pass Mark)
  const handleEvaluateQcpAttempt1 = () => {
    if (!activeTrainee) return;
    const avg3Day = Number(((editQcp1D1 + editQcp1D2 + editQcp1D3) / 3).toFixed(1));
    const passed = avg3Day >= 90.0;

    setCsEnrollments((prev) =>
      prev.map((t) =>
        t.id === activeTrainee.id
          ? {
              ...t,
              qcp1Day1Pct: editQcp1D1,
              qcp1Day2Pct: editQcp1D2,
              qcp1Day3Pct: editQcp1D3,
              qcp1AveragePct: avg3Day,
              qcp1Status: passed
                ? 'Passed (>= 90%)'
                : 'Failed (< 90% -> Refresher Day)',
              refresherDayRequired: !passed,
              qcp2Status: passed ? 'Not Applicable' : 'Pending',
              currentStage: passed
                ? 'Certified — QCP-1 Pass (3-Day >= 90%)'
                : '5. Refresher Day (Post QCP-1 Fail)',
              finalReleaseDate: passed ? '2026-11-07' : undefined,
            }
          : t
      )
    );

    if (passed) {
      triggerToast(
        `QCP Attempt 1 PASSED! ${activeTrainee.traineeName} achieved ${avg3Day}% (3-Day Avg >= 90%) and is certified for live AR production!`
      );
    } else {
      triggerToast(
        `QCP Attempt 1 Score: ${avg3Day}% (< 90% Pass Gate). Auto-triggered Mandatory 1-Day Refresher before QCP Attempt 2!`
      );
    }
  };

  // Handler: Complete 1-Day Refresher & Evaluate QCP Attempt 2 (2 Days Average — 90% Pass Mark)
  const handleEvaluateQcpAttempt2 = () => {
    if (!activeTrainee) return;
    const avg2Day = Number(((editQcp2D1 + editQcp2D2) / 2).toFixed(1));
    const passed = avg2Day >= 90.0;

    setCsEnrollments((prev) =>
      prev.map((t) =>
        t.id === activeTrainee.id
          ? {
              ...t,
              refresherDayRequired: true,
              refresherDayCompleted: true,
              refresherTrainerNotes: editRefresherNote,
              qcp2Day1Pct: editQcp2D1,
              qcp2Day2Pct: editQcp2D2,
              qcp2AveragePct: avg2Day,
              qcp2Status: passed ? 'Passed (>= 90%)' : 'Failed (< 90%)',
              currentStage: passed
                ? 'Certified — QCP-2 Pass (2-Day >= 90%)'
                : 'Action Required — QCP-2 Failed (< 90%)',
              finalReleaseDate: passed ? '2026-11-07' : undefined,
            }
          : t
      )
    );

    if (passed) {
      triggerToast(
        `Refresher Day Logged + QCP Attempt 2 PASSED! ${activeTrainee.traineeName} achieved ${avg2Day}% (2-Day Avg >= 90%) and is released to production!`
      );
    } else {
      triggerToast(
        `QCP Attempt 2 Score: ${avg2Day}% (< 90% Pass Gate). Flagged ${activeTrainee.traineeName} for L&D / Ops Re-Evaluation.`
      );
    }
  };

  // Handler: Grant QCP Exemption
  const handleGrantQcpExemption = () => {
    if (!activeTrainee) return;
    setCsEnrollments((prev) =>
      prev.map((t) =>
        t.id === activeTrainee.id
          ? {
              ...t,
              qcpExempted: true,
              qcp1Status: 'Exempted',
              qcp2Status: 'Not Applicable',
              refresherDayRequired: false,
              currentStage: 'Certified — QCP Exempted (Fast-Track)',
              qcpExemptionReason: editExemptionReason,
              qcpExemptionApprovedBy: 'Samrat Bose (Training Lead) & Ops Manager',
              finalReleaseDate: '2026-11-07',
            }
          : t
      )
    );
    triggerToast(
      `Granted QCP Exemption to ${activeTrainee.traineeName}! Fast-tracked directly to live AR production.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Executive Header & Sub-Navigation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              AR Client-Specific (CS) Training & Quality Certification Process (QCP) Command Center
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Lateral Hires & Post-NHT Bridge
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Customizable Project Specialty, Softwares/Tools, Payers, Scenarios, Practice Days, OJT (Prod/QA/Errors) & QCP (3-Day 90% → Refresher Day → 2-Day 90% / QCP Exemption)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              {
                id: 'dashboard_trends',
                label: 'CS Training Dashboard & Activity Trends',
                icon: Activity,
              },
              {
                id: 'cs_modules',
                label: `Customizable AR CS Modules (${csModules.length})`,
                icon: Layers,
              },
              {
                id: 'ojt_qcp_tracker',
                label: `OJT & QCP Certification Gate (${csEnrollments.length})`,
                icon: ShieldCheck,
              },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = subView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubView(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => setShowCreateModuleForm((prev) => !prev)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{showCreateModuleForm ? 'Close Builder' : '+ Create CS Training Module'}</span>
          </button>

          <button
            onClick={() => setShowEnrollModal((prev) => !prev)}
            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll Lateral / Post-NHT</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          MODAL / DRAWER 1: CREATE NEW CUSTOMIZABLE AR CS TRAINING MODULE
         ===================================================================== */}
      {showCreateModuleForm && (
        <form
          onSubmit={handleCreateCsModule}
          className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-6 space-y-5 shadow-2xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-emerald-400" />
                Create Customizable AR Client-Specific (CS) Training Module
              </h3>
              <p className="text-xs text-slate-400">
                Configure Project Specialty, EHR Softwares/Tools, Payers, Scenarios, Updates, Workflow Knowledge, Practice Days & QCP Gates (3-Day 90% → 1-Day Refresher → 2-Day 90%)
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              Assigned to: Lateral Hires & Post-NHT Graduates
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Target Client Project & Specialty *
              </label>
              <select
                value={newModProjectId}
                onChange={(e) => setNewModProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectName} ({p.specialty})
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-slate-300 font-medium mb-1">
                CS Training Module Title *
              </label>
              <input
                type="text"
                required
                value={newModTitle}
                onChange={(e) => setNewModTitle(e.target.value)}
                placeholder="e.g., Pacific Radiology — Client-Specific AR, RIS/PACS & Prior Auth CS Module"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Practice Days</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={newModPracticeDays}
                  onChange={(e) => setNewModPracticeDays(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white tabular-nums"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">OJT Days</label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={newModOjtDays}
                  onChange={(e) => setNewModOjtDays(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white tabular-nums"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Customizable Softwares & RCM Tools (comma-separated)
              </label>
              <input
                type="text"
                value={newModSoftwares}
                onChange={(e) => setNewModSoftwares(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Customizable Client Payers Mix (comma-separated)
              </label>
              <input
                type="text"
                value={newModPayers}
                onChange={(e) => setNewModPayers(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Client-Specific AR & Denial Scenarios (pipe `|` separated)
              </label>
              <input
                type="text"
                value={newModScenarios}
                onChange={(e) => setNewModScenarios(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Included Client Process Updates (pipe `|` separated)
              </label>
              <input
                type="text"
                value={newModUpdates}
                onChange={(e) => setNewModUpdates(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Project Structure & Workqueue Architecture
              </label>
              <input
                type="text"
                value={newModQueueArch}
                onChange={(e) => setNewModQueueArch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Client Escalation Matrix
              </label>
              <input
                type="text"
                value={newModEscalation}
                onChange={(e) => setNewModEscalation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Write-Off & Adjustment Authority Rules
              </label>
              <input
                type="text"
                value={newModWriteOff}
                onChange={(e) => setNewModWriteOff(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
            <div className="text-slate-400">
              Built-in QCP Gate:{' '}
              <strong className="text-emerald-300">
                QCP Attempt 1 (3-Day Avg &ge; 90%)
              </strong>{' '}
              → If Fail:{' '}
              <strong className="text-amber-300">1-Day Refresher</strong> →{' '}
              <strong className="text-sky-300">QCP Attempt 2 (2-Day Avg &ge; 90%)</strong> +{' '}
              <strong className="text-purple-300">QCP Exemption Enabled</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModuleForm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg"
              >
                Save AR CS Training Module
              </button>
            </div>
          </div>
        </form>
      )}

      {/* =====================================================================
          MODAL / DRAWER 2: ENROLL LATERAL HIRE OR POST-NHT GRADUATE
         ===================================================================== */}
      {showEnrollModal && (
        <form
          onSubmit={handleEnrollTrainee}
          className="bg-slate-900 border-2 border-sky-500/50 rounded-2xl p-5 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-sky-400" />
              Assign AR CS Training Module to Lateral Hire or Post-NHT Graduate
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 mb-1">Trainee Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g., Nikhil Chauhan"
                value={enrollName}
                onChange={(e) => setEnrollName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Intake Pathway *</label>
              <select
                value={enrollPathway}
                onChange={(e) => setEnrollPathway(e.target.value as CsIntakePathway)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              >
                <option value="Lateral Hire (Direct to AR CS Training)">
                  Lateral Hire (Direct to AR CS Training)
                </option>
                <option value="Post-NHT Graduate (After NHT - AR / Billing)">
                  Post-NHT Graduate (After NHT - AR / Billing)
                </option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Target AR CS Module *</label>
              <select
                value={enrollModuleId}
                onChange={(e) => setEnrollModuleId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              >
                {csModules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.moduleCode} • {m.projectName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Batch Code</label>
              <input
                type="text"
                value={enrollBatchCode}
                onChange={(e) => setEnrollBatchCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold"
              >
                Enroll in CS Training
              </button>
            </div>
          </div>
        </form>
      )}

      {/* =====================================================================
          SUB-VIEW 1: CS TRAINING DASHBOARD — STATUS & TRENDS OF CS TRAINING ACTIVITIES
         ===================================================================== */}
      {subView === 'dashboard_trends' && (
        <div className="space-y-6">
          {/* Filter Strip */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-slate-400">Filter CS Dashboard:</span>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
              >
                <option value="ALL">All Projects ({projects.length})</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectName} ({p.specialty})
                  </option>
                ))}
              </select>

              <select
                value={pathwayFilter}
                onChange={(e) => setPathwayFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
              >
                <option value="ALL">All Pathways (Lateral Hires + Post-NHT Graduates)</option>
                <option value="Lateral Hire (Direct to AR CS Training)">
                  Lateral Hires Only
                </option>
                <option value="Post-NHT Graduate (After NHT - AR / Billing)">
                  Post-NHT Graduates Only
                </option>
              </select>
            </div>

            <div className="text-slate-400">
              Showing <strong className="text-white">{filteredEnrollments.length}</strong> active CS trainees across{' '}
              <strong className="text-indigo-300">{csModules.length} Client-Specific AR Modules</strong>
            </div>
          </div>

          {/* 5 KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>CS Trainees Enrolled</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-extrabold text-white tabular-nums">
                {csDashboardStats.total}
              </div>
              <div className="text-[11px] text-indigo-300">
                {csDashboardStats.lateralCount} Lateral • {csDashboardStats.postNhtCount} Post-NHT
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>OJT Prod & Quality Avg</span>
                <Activity className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-extrabold text-sky-300 tabular-nums">
                {csDashboardStats.avgOjtQual}%{' '}
                <span className="text-xs font-normal text-slate-400">QA</span>
              </div>
              <div className="text-[11px] text-slate-300">
                OJT Production Avg: <strong>{csDashboardStats.avgOjtProd}%</strong>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-emerald-300">
                <span>QCP Attempt 1 (3-Day &ge; 90%)</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-400 tabular-nums">
                {csDashboardStats.qcp1Passed}{' '}
                <span className="text-xs font-normal text-slate-400">Certified</span>
              </div>
              <div className="text-[11px] text-slate-400">
                3-Day Average &ge; 90% Pass Gate
              </div>
            </div>

            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-amber-300">
                <span>Refresher Day & QCP-2 (2-Day)</span>
                <RefreshCw className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-extrabold text-amber-300 tabular-nums">
                {csDashboardStats.refresherTriggered} → {csDashboardStats.qcp2Passed}
              </div>
              <div className="text-[11px] text-slate-400">
                1-Day Refresher → 2-Day Avg &ge; 90%
              </div>
            </div>

            <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-purple-300">
                <span>QCP Exemptions Granted</span>
                <Award className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-extrabold text-purple-300 tabular-nums">
                {csDashboardStats.exemptedCount}{' '}
                <span className="text-xs font-normal text-slate-400">Fast-Tracked</span>
              </div>
              <div className="text-[11px] text-emerald-400">
                Overall Release Rate: {csDashboardStats.overallClearancePct}%
              </div>
            </div>
          </div>

          {/* Visual Lifecycle Architecture Banner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Standardized AR Client-Specific (CS) Training & QCP Governance Pipeline
              </h3>
              <span className="text-[11px] text-slate-400">
                Mandatory for all Lateral Hires & Post-NHT Graduates before live production release
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
              {[
                {
                  step: 'Stage 1: Intake',
                  title: 'Lateral Hire OR Post-NHT Grad',
                  desc: 'Assigned project-specific AR CS module',
                  color: 'border-slate-700 bg-slate-950',
                },
                {
                  step: 'Stage 2: CS Classroom & Practice',
                  title: 'Softwares, Payers & Practice Days',
                  desc: '3–4 Days guided sandbox & workflow labs',
                  color: 'border-indigo-500/40 bg-indigo-950/20',
                },
                {
                  step: 'Stage 3: On-Job Training (OJT)',
                  title: 'OJT Prod, Quality & Error Log',
                  desc: '5 Days supervised live claims + error summary',
                  color: 'border-sky-500/40 bg-sky-950/20',
                },
                {
                  step: 'Stage 4: QCP Attempt 1',
                  title: '3 Days Avg — 90% Pass Mark',
                  desc: 'Pass >= 90% -> Production | Fail -> Refresher Day',
                  color: 'border-emerald-500/40 bg-emerald-950/20',
                },
                {
                  step: 'Stage 5: Refresher + QCP Attempt 2',
                  title: '1-Day Refresher → 2 Days Avg 90%',
                  desc: 'Targeted defect coaching + 2-Day QCP-2 gate',
                  color: 'border-amber-500/40 bg-amber-950/20',
                },
                {
                  step: 'Fast-Track Option',
                  title: 'QCP Exemption Gate',
                  desc: 'For star Lateral Hires (>=98% OJT QA) with approval',
                  color: 'border-purple-500/40 bg-purple-950/20',
                },
              ].map((st) => (
                <div key={st.step} className={`p-3 rounded-xl border ${st.color} space-y-1`}>
                  <div className="text-[10px] font-bold uppercase text-slate-400">{st.step}</div>
                  <div className="font-bold text-white leading-snug">{st.title}</div>
                  <div className="text-[11px] text-slate-400">{st.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 6-Cohort Activity & QCP Pass Trends + Live Trainee Status Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: 6-Week CS Training Activity & QCP Certification Trend */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  CS Training Activity & QCP Pass Rate Trends (6 Cohorts)
                </h3>
                <p className="text-xs text-slate-400">
                  Tracks Lateral vs. Post-NHT volume, OJT Quality Avg %, QCP-1 3-Day Pass %, and Post-Refresher QCP-2 Recovery %
                </p>
              </div>

              <div className="grid grid-cols-6 gap-2 items-end h-44 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                {csCohortTrends.map((c) => (
                  <div
                    key={c.cohort}
                    className="flex flex-col items-center justify-end h-full gap-1"
                  >
                    <div className="text-[10px] font-bold text-emerald-400 tabular-nums">
                      {c.qcp1PassRate}%
                    </div>
                    <div className="w-full h-24 bg-slate-900 rounded-t flex items-end justify-center gap-1 px-1">
                      <div
                        title={`QCP-1 First-Time Pass Rate: ${c.qcp1PassRate}%`}
                        className="w-2.5 bg-emerald-500 rounded-t"
                        style={{ height: `${c.qcp1PassRate}%` }}
                      />
                      <div
                        title={`QCP-2 Post-Refresher Recovery: ${c.qcp2RecoveryRate}%`}
                        className="w-2.5 bg-sky-400 rounded-t"
                        style={{ height: `${c.qcp2RecoveryRate}%` }}
                      />
                    </div>
                    <div className="text-[10px] font-semibold text-slate-300">
                      {c.cohort.split(' ')[0]}
                    </div>
                    <div className="text-[9px] text-slate-500 tabular-nums">
                      {c.lateralHires}L + {c.postNhtGrads}N
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> QCP-1 Pass % (3-Day &ge; 90%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-sky-400 inline-block" /> Post-Refresher QCP-2 Recovery %
                </span>
              </div>
            </div>

            {/* Right 7 Cols: Live CS Training & QCP Status Roster */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Live AR CS Training & QCP Certification Roster
                  </h3>
                  <p className="text-xs text-slate-400">
                    Click any trainee to open the OJT, QCP-1 (3-Day), Refresher Day, QCP-2 (2-Day) & Exemption Evaluator
                  </p>
                </div>
                <button
                  onClick={() => setSubView('ojt_qcp_tracker')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold"
                >
                  Open Full QCP Evaluator →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-950/60">
                      <th className="py-3 px-3.5">Trainee & Intake Pathway</th>
                      <th className="py-3 px-3">Project & CS Module</th>
                      <th className="py-3 px-3 text-right">OJT Prod / QA</th>
                      <th className="py-3 px-3 text-center">QCP-1 (3d Avg)</th>
                      <th className="py-3 px-3 text-center">Refresher / QCP-2 (2d)</th>
                      <th className="py-3 px-3">Current Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 tabular-nums">
                    {filteredEnrollments.map((tr) => {
                      const isLateral = tr.intakePathway.includes('Lateral');
                      return (
                        <tr
                          key={tr.id}
                          onClick={() => {
                            handleSelectTrainee(tr);
                            setSubView('ojt_qcp_tracker');
                          }}
                          className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-3.5">
                            <div className="font-bold text-white">{tr.traineeName}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                                  isLateral
                                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                                    : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                                }`}
                              >
                                {isLateral ? 'Lateral Hire' : 'Post-NHT Grad'}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {tr.empId}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-medium text-slate-200">{tr.projectName}</div>
                            <div className="text-[10px] font-mono text-indigo-300">
                              {tr.csModuleCode} • {tr.practiceDaysCompleted}/{tr.practiceDaysTarget}d Prac
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="font-bold text-white">QA {tr.ojtQualityPct}%</div>
                            <div className="text-[10px] text-slate-400">
                              Prod {tr.ojtProductionPct}%
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {tr.qcpExempted ? (
                              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                                Exempted
                              </span>
                            ) : tr.qcp1AveragePct !== null ? (
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  tr.qcp1AveragePct >= 90
                                    ? 'bg-emerald-500/15 text-emerald-300'
                                    : 'bg-rose-500/15 text-rose-300'
                                }`}
                              >
                                {tr.qcp1AveragePct}%
                              </span>
                            ) : (
                              <span className="text-slate-500 text-[11px]">Pending</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {tr.refresherDayRequired ? (
                              <div>
                                <span className="text-[10px] text-amber-300 font-semibold block">
                                  ✓ 1d Refresher
                                </span>
                                {tr.qcp2AveragePct !== null && (
                                  <span className="text-[11px] font-bold text-emerald-300">
                                    QCP-2: {tr.qcp2AveragePct}%
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-500">—</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                tr.currentStage.includes('Certified')
                                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                              }`}
                            >
                              {tr.currentStage}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-VIEW 2: CUSTOMIZABLE AR CS TRAINING MODULES INSPECTOR
         ===================================================================== */}
      {subView === 'cs_modules' && activeModule && (
        <div className="space-y-6">
          {/* Module Selector Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl p-3">
            <span className="text-xs font-semibold text-slate-400 px-2">
              Select Client-Specific AR Module:
            </span>
            {csModules.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModuleId(m.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  m.id === activeModule.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {m.moduleCode} • {m.projectName} ({m.specialty})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Customizable Specialty, Softwares, Tools, Payers, Scenarios & Updates */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-xs font-bold">
                      {activeModule.moduleCode}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">
                      {activeModule.specialty}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5">{activeModule.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Client Project: <strong className="text-white">{activeModule.projectName}</strong> • Trainer:{' '}
                    <strong className="text-emerald-300">{activeModule.assignedTrainer}</strong> • QA Auditor:{' '}
                    <strong className="text-amber-300">{activeModule.qaAuditor}</strong>
                  </p>
                </div>
              </div>

              {/* 1. Softwares & Tools + 2. Client Payers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-sky-300 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" />
                    <span>1. Client Softwares, EHR & Clearinghouse Tools</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModule.softwaresAndTools.map((sw) => (
                      <span
                        key={sw}
                        className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-200 border border-sky-500/30 text-[11px] font-medium"
                      >
                        {sw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    <span>2. Client-Specific Payers & MACs Covered</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModule.clientPayers.map((py) => (
                      <span
                        key={py}
                        className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-200 border border-indigo-500/30 text-[11px] font-medium"
                      >
                        {py}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Customizable Client AR Scenarios */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  <span>3. Client-Specific AR & Denial Simulation Scenarios</span>
                </div>
                <ul className="space-y-1.5 text-slate-200">
                  {activeModule.clientScenarios.map((sc, i) => (
                    <li
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80 flex items-start gap-2"
                    >
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{sc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Linked Client Process Updates */}
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2 text-xs">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>4. Embedded Client Process Updates & Flash Alerts</span>
                </div>
                <ul className="space-y-1 text-slate-300">
                  {activeModule.recentUpdatesIncluded.map((up, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>{up}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right 5 Cols: Project Structure & Workflow Knowledge + Practice Days, OJT & QCP Rules */}
            <div className="lg:col-span-5 space-y-5">
              {/* 5. Project Structure & Workflow Knowledge */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3.5 text-xs">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-indigo-400" />
                  <span>5. Project Structure & Workflow Knowledge</span>
                </h3>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-indigo-300">
                      Workqueue Architecture & Aging Routing
                    </div>
                    <div className="text-slate-200 mt-1">
                      {activeModule.projectStructureAndWorkflow.queueArchitecture}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-sky-300">
                      Escalation Matrix & Client Liaison SLA
                    </div>
                    <div className="text-slate-200 mt-1">
                      {activeModule.projectStructureAndWorkflow.escalationMatrix}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-amber-300">
                      Write-Off & Adjustment Authority Matrix
                    </div>
                    <div className="text-slate-200 mt-1">
                      {activeModule.projectStructureAndWorkflow.writeOffThreshold}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-emerald-300">
                      Account Documentation Standard
                    </div>
                    <div className="text-slate-200 mt-1 font-mono text-[11px]">
                      {activeModule.projectStructureAndWorkflow.soapNoteStandard}
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Practice Days, OJT & Quality Certification Process (QCP) Gate Configuration */}
              <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 space-y-3.5 text-xs">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>6. Practice Days, OJT & QCP Certification Gate Rules</span>
                </h3>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Process Practice Days</div>
                    <div className="text-base font-extrabold text-white mt-0.5">
                      {activeModule.processPracticeDays} Days
                    </div>
                    <div className="text-[10px] text-slate-500">
                      +{activeModule.classroomDays}d Classroom
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400">On-Job Training (OJT)</div>
                    <div className="text-base font-extrabold text-sky-300 mt-0.5">
                      {activeModule.ojtDays} Days
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Tracks Prod %, QA % & Error Summary
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30">
                    <div className="text-[10px] text-emerald-300 font-semibold">
                      QCP Attempt 1 Gate
                    </div>
                    <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                      3 Days Avg &ge; {activeModule.qcp1PassMarkPct}%
                    </div>
                    <div className="text-[10px] text-slate-400">
                      If Fail (&lt;90%) → 1-Day Refresher
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30">
                    <div className="text-[10px] text-amber-300 font-semibold">
                      Refresher + QCP Attempt 2
                    </div>
                    <div className="text-base font-extrabold text-amber-300 mt-0.5">
                      2 Days Avg &ge; {activeModule.qcp2PassMarkPct}%
                    </div>
                    <div className="text-[10px] text-slate-400">
                      + QCP Exemption Fast-Track Allowed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-VIEW 3: OJT & QUALITY CERTIFICATION PROCESS (QCP) EVALUATOR WORKBENCH
         ===================================================================== */}
      {subView === 'ojt_qcp_tracker' && activeTrainee && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 5 Cols: Enrolled CS Trainees Selector List */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  CS Trainees (Lateral Hires & Post-NHT)
                </h3>
                <p className="text-xs text-slate-400">
                  Select a trainee to score OJT, QCP Attempt 1 (3d), Refresher Day, QCP Attempt 2 (2d), or QCP Exemption
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-800/80 max-h-[680px] overflow-y-auto">
              {csEnrollments.map((tr) => {
                const isSelected = tr.id === activeTrainee.id;
                const isLateral = tr.intakePathway.includes('Lateral');
                return (
                  <div
                    key={tr.id}
                    onClick={() => handleSelectTrainee(tr)}
                    className={`p-4 cursor-pointer transition-colors space-y-2 ${
                      isSelected ? 'bg-indigo-600/15' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-white text-xs flex items-center gap-2">
                          <span>{tr.traineeName}</span>
                          <span className="font-mono text-[10px] text-indigo-300">{tr.empId}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {tr.projectName} ({tr.csModuleCode})
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          isLateral
                            ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                            : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                        }`}
                      >
                        {isLateral ? 'Lateral Hire' : 'Post-NHT Grad'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="text-slate-300 tabular-nums">
                        OJT Prod: <strong>{tr.ojtProductionPct}%</strong> | OJT QA:{' '}
                        <strong className="text-emerald-400">{tr.ojtQualityPct}%</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-semibold text-indigo-300">
                        {tr.currentStage}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 7 Cols: Interactive OJT, QCP-1 (3-Day), Refresher Day, QCP-2 (2-Day) & QCP Exemption Evaluator */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-5 space-y-5">
            {/* Trainee Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{activeTrainee.traineeName}</h3>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs">
                    {activeTrainee.empId}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[11px] font-semibold">
                    {activeTrainee.intakePathway}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Module: <strong className="text-white">{activeTrainee.csModuleCode}</strong> ({activeTrainee.projectName}) • Trainer:{' '}
                  <strong className="text-emerald-300">{activeTrainee.assignedTrainer}</strong> • Auditor:{' '}
                  <strong className="text-amber-300">{activeTrainee.qaAuditor}</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {activeTrainee.currentStage}
                </span>
                <div className="text-[11px] text-slate-400 mt-1">
                  Practice Days: {activeTrainee.practiceDaysCompleted}/{activeTrainee.practiceDaysTarget} Completed
                </div>
              </div>
            </div>

            {/* BLOCK 1: On-the-Job Training (OJT) — Production Score, Quality Score & Error Summary */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-300 uppercase tracking-wider">
                  1. On-the-Job Training (OJT) — Production Score, Quality Score & Error Summary
                </span>
                <span className="text-[11px] text-slate-400">
                  Target: {activeTrainee.ojtTargetPerDay} claims/day
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">OJT Production Score (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editOjtProd}
                    onChange={(e) => setEditOjtProd(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">OJT Quality Score (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editOjtQual}
                    onChange={(e) => setEditOjtQual(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-emerald-400 font-bold tabular-nums"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleSaveOjtMetrics}
                    className="w-full py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold"
                  >
                    Update OJT Scores
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  OJT Error Summary & Defect Root-Cause Notes
                </label>
                <input
                  type="text"
                  value={editOjtErrorSummary}
                  onChange={(e) => setEditOjtErrorSummary(e.target.value)}
                  placeholder="Document OJT claim errors, CARC/RARC gaps, or software navigation notes..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
            </div>

            {/* BLOCK 2: Quality Certification Process — QCP Attempt 1 (3 Days Average — 90% Pass Mark) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-emerald-300 uppercase tracking-wider">
                  2. Quality Certification Process — QCP Attempt 1 (3 Days Average — 90% Pass Mark)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold">
                  Live 3-Day Avg: {((editQcp1D1 + editQcp1D2 + editQcp1D3) / 3).toFixed(1)}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">QCP-1 Day 1 QA %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editQcp1D1}
                    onChange={(e) => setEditQcp1D1(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">QCP-1 Day 2 QA %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editQcp1D2}
                    onChange={(e) => setEditQcp1D2(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">QCP-1 Day 3 QA %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editQcp1D3}
                    onChange={(e) => setEditQcp1D3(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white tabular-nums"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleEvaluateQcpAttempt1}
                    className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    Evaluate 3-Day QCP-1
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Rule: If 3-Day Average &ge; <strong>90.0%</strong> → Certified & Released to Production. If &lt; <strong>90.0%</strong> → Auto-triggers <strong>Mandatory 1-Day Refresher</strong> & unlocks QCP Attempt 2.
              </p>
            </div>

            {/* BLOCK 3: Refresher Day (If QCP 1 Failed) + QCP Attempt 2 (2 Days Average — 90% Pass Mark) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-amber-300 uppercase tracking-wider">
                  3. Refresher Day (If QCP-1 Fail) + QCP Attempt 2 (2 Days Average — 90% Pass Mark)
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold">
                  Live 2-Day Avg: {((editQcp2D1 + editQcp2D2) / 2).toFixed(1)}%
                </span>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  1-Day Refresher Coaching & Remediation Summary (Required after QCP-1 &lt; 90%)
                </label>
                <input
                  type="text"
                  value={editRefresherNote}
                  onChange={(e) => setEditRefresherNote(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">QCP-2 Day 1 QA %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editQcp2D1}
                    onChange={(e) => setEditQcp2D1(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">QCP-2 Day 2 QA %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editQcp2D2}
                    onChange={(e) => setEditQcp2D2(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white tabular-nums"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleEvaluateQcpAttempt2}
                    className="w-full py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold"
                  >
                    Log Refresher & Score QCP-2
                  </button>
                </div>
              </div>
            </div>

            {/* BLOCK 4: QCP Exemption (Fast-Track Governance Option) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300 uppercase tracking-wider">
                  4. QCP Exemption Option (Lateral Hire / High-Performer Fast-Track)
                </span>
                {activeTrainee.qcpExempted && (
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                    ✓ QCP Exempted
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={editExemptionReason}
                  onChange={(e) => setEditExemptionReason(e.target.value)}
                  placeholder="Enter QCP Exemption Justification & Approver..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                />
                <button
                  type="button"
                  onClick={handleGrantQcpExemption}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold shrink-0"
                >
                  Grant QCP Exemption
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
