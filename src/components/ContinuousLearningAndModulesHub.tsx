import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileCheck2,
  FilePlus2,
  Flame,
  FolderKanban,
  GraduationCap,
  HelpCircle,
  Layers,
  ListChecks,
  Play,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  AssociateProfile,
  AutoTriggeredTrainingTicket,
  ContinuousLearningModule,
  ProjectHealth,
  ProjectQuestionBankItem,
  ProjectWeeklyAssessment,
  ProviderSpecialty,
  RcmTower,
  SopPlaybookItem,
} from '../types/rcm';
import { RCM_TOWERS } from '../data/mockRcmData';

// ============================================================================
// TYPES FOR CONTINUOUS LEARNING UPDATE TRACKER LOG & TRAINING MODULE TRACKS
// ============================================================================

export interface ProcessUpdateTrackerEntry {
  id: string;
  updateCode: string;
  projectId: string;
  projectName: string;
  specialty: ProviderSpecialty;
  tower: RcmTower;
  payerOrSource: string;
  title: string;
  summary: string;
  operationalSteps: string[];
  auditPitfalls: string[];
  relatedCodes: string[];
  effectiveDate: string;
  publishedBy: string;
  linkedKnowledgeDocCode: string;
  linkedPktQuestionId: string;
  pktQuestionPreview: string;
  readAckPct: number;
}

export interface TrainingTrackUnitBlueprint {
  unitCode: string;
  phaseLabel: string;
  title: string;
  deliveryMode: 'Instructor-Led (ILT)' | 'EHR Sandbox Lab' | 'Self-Paced Micro-Learning' | 'QA Calibration & Mock Audit';
  durationHours: number;
  topics: string[];
  status: 'Core Blueprint Ready' | 'Structure Customizable (Draft)';
}

export interface CoreTrainingTrack {
  id: 'NHT-BILLING' | 'NHT-AR' | 'NHT-CODING' | 'AR-CS-TRAINING' | 'REFRESHER-MOD';
  shortName:
    | 'NHT - Billing'
    | 'NHT - AR'
    | 'NHT - Coding'
    | 'AR - CS Training'
    | 'Refresher Training Module';
  fullTitle: string;
  badgeColor: string;
  targetAudience: string;
  totalDurationDays: number;
  totalHours: number;
  passGatePct: number;
  activeBatchesCount: number;
  enrolledAssociatesCount: number;
  primaryTowers: RcmTower[];
  leadTrainer: string;
  overview: string;
  certificationOutcome: string;
  units: TrainingTrackUnitBlueprint[];
}

const INITIAL_UPDATE_TRACKER_LOG: ProcessUpdateTrackerEntry[] = [
  {
    id: 'UPDT-2026-01',
    updateCode: 'UPD-OR-319',
    projectId: 'PRJ-ORTH-02',
    projectName: 'Summit Ortho & Spine Group',
    specialty: 'Orthopedics & Sports Med',
    tower: 'Denials Management',
    payerOrSource: 'UnitedHealthcare / Evicore Musculoskeletal Bulletin',
    title: 'UHC Evicore Retro-Authorization Window Reduced to 5 Business Days for Urgent Ortho MRI/CT',
    summary:
      'Effective Nov 2026, UHC Commercial plans require urgent outpatient Ortho MRI/CT retro-auth submissions on the Evicore portal within 5 business days of DOS (previously 10 days) to overturn CO-197.',
    operationalSteps: [
      'Pull Evicore tracking number or urgent add-on clinical attestation signed by the ordering orthopedic surgeon.',
      'Submit retro-authorization request under Evicore Urgent Clinical Exception pathway within 5 business days of DOS.',
      'Attach generated Auth # in Box 23 of CMS-1500 before releasing reconsidered claim.',
    ],
    auditPitfalls: [
      'Submitting standard appeals without an Evicore retro-auth tracking number results in an automatic CO-197 uphold.',
    ],
    relatedCodes: ['CO-197', 'CPT 73721', 'CPT 29881', 'Box 23 Auth'],
    effectiveDate: '2026-11-05',
    publishedBy: 'Ananya Iyer (Ortho & GI Process Trainer)',
    linkedKnowledgeDocCode: 'SOP-OR-12',
    linkedPktQuestionId: 'QB-OR-01',
    pktQuestionPreview:
      'When appealing a UHC Commercial CO-197 denial for an urgent outpatient Ortho MRI/Arthroscopy, what is the updated Evicore retro-authorization window?',
    readAckPct: 94,
  },
  {
    id: 'UPDT-2026-02',
    updateCode: 'UPD-CV-312',
    projectId: 'PRJ-CARD-01',
    projectName: 'Apex Heart & Vascular Institute',
    specialty: 'Cardiology & Vascular',
    tower: 'Medical Coding',
    payerOrSource: 'CMS NCCI Policy Manual Q4 Update',
    title: 'Mandatory Modifier -25 & Anatomical Coronary Modifiers (-LD, -LC, -RC) Audit Check',
    summary:
      'Updated NCCI edit check for same-day E/M (99214) with 12-Lead ECG (93000) or Diagnostic Coronary Angiography (93458). Requires separate hemodynamic instability or new symptom documentation.',
    operationalSteps: [
      'Verify standalone E/M assessment & plan before appending Modifier -25 alongside minor cardiology procedures.',
      'Confirm anatomical coronary vessel modifiers (-LD, -LC, -RC, -LM, -RI) on all PCI (92920-92944) lines.',
    ],
    auditPitfalls: [
      'Using generic Modifier -59 instead of -XU/-XS or omitting coronary vessel modifiers triggers instant clearinghouse rejection.',
    ],
    relatedCodes: ['Mod -25', 'Mod -LD/-RC', 'CPT 93458', 'CPT 92928', 'CO-B15'],
    effectiveDate: '2026-11-03',
    publishedBy: 'Ritu Chatterjee (Cardio & Radiology Trainer)',
    linkedKnowledgeDocCode: 'SOP-CV-08',
    linkedPktQuestionId: 'QB-CV-01',
    pktQuestionPreview:
      'Which modifier must be appended to CPT 99214 when a cardiologist performs a separately identifiable E/M service on the same day as an ECG and Echo?',
    readAckPct: 98,
  },
  {
    id: 'UPDT-2026-03',
    updateCode: 'UPD-GI-308',
    projectId: 'PRJ-GI-06',
    projectName: 'Metro Digestive & GI Endoscopy Partners',
    specialty: 'Gastroenterology',
    tower: 'Appeals & Reconsiderations',
    payerOrSource: 'Medicare Part B & Commercial ACA Preventive GI Directive',
    title: 'Screening-to-Diagnostic Colonoscopy (CPT 45378 → 45380/45385) Modifier -PT vs -33 Routing',
    summary:
      'Clarifies zero-copay preventive benefit preservation when a screening colonoscopy (Z12.11) converts to polypectomy (45385) or biopsy (45380).',
    operationalSteps: [
      'For Medicare Part B claims, append Modifier -PT to CPT 45380/45385 and keep Z12.11 as primary ICD-10 pointer.',
      'For Commercial ACA plans, append Modifier -33 to CPT 45380/45385 and list polyp finding (K63.5) as secondary diagnosis.',
    ],
    auditPitfalls: [
      'Swapping -PT and -33 between Medicare and Commercial payers causes PR-2 deductible misapplication and patient billing complaints.',
    ],
    relatedCodes: ['CPT 45378', 'CPT 45385', 'Mod -PT', 'Mod -33', 'ICD Z12.11'],
    effectiveDate: '2026-11-01',
    publishedBy: 'Ananya Iyer (Ortho & GI Process Trainer)',
    linkedKnowledgeDocCode: 'SOP-GI-04',
    linkedPktQuestionId: 'QB-GI-01',
    pktQuestionPreview:
      'A Medicare patient presents for an average-risk screening colonoscopy (Z12.11) and a polyp is removed via snare (45385). Which modifier applies?',
    readAckPct: 96,
  },
];

const INITIAL_CORE_TRAINING_TRACKS: CoreTrainingTrack[] = [
  {
    id: 'NHT-BILLING',
    shortName: 'NHT - Billing',
    fullTitle: 'New Hire Training (NHT) — End-to-End Medical Billing, Charge Entry & Payment Posting',
    badgeColor: 'from-indigo-600 to-sky-600',
    targetAudience: 'New Hire Billing Associates, Demographics Specialists & Payment Posters',
    totalDurationDays: 15,
    totalHours: 90,
    passGatePct: 90,
    activeBatchesCount: 2,
    enrolledAssociatesCount: 28,
    primaryTowers: ['Demographics & Charge Entry', 'Payment Posting', 'Patient Calling'],
    leadTrainer: 'Suresh Menon',
    overview:
      'Foundational end-to-end US Healthcare Revenue Cycle Management curriculum covering patient registration, 270/271 eligibility verification, COB birthday rules, CMS-1500 / UB-04 charge entry, clearinghouse front-end edits, and ERA 835 payment posting.',
    certificationOutcome: 'Certified RCM Billing & Charge Entry Specialist (Nesting Gate >= 90%)',
    units: [
      {
        unitCode: 'NHT-BIL-101',
        phaseLabel: 'Phase 1 (Days 1–4): US Healthcare & Revenue Cycle Foundations',
        title: 'HIPAA, Payer Ecosystem (Medicare/Medicaid/Commercial), CMS-1500 & UB-04 Anatomy',
        deliveryMode: 'Instructor-Led (ILT)',
        durationHours: 24,
        topics: [
          'US Healthcare Payers: Medicare Parts A/B/C/D, Medicaid, Tricare, Commercial PPO/HMO/EPO',
          'CMS-1500 (Boxes 1–33) & UB-04 (FL 1–81) field-by-field validation rules',
          'Coordination of Benefits (COB), Subscriber Alpha Prefixes & Pediatric Birthday Rule',
        ],
        status: 'Core Blueprint Ready',
      },
      {
        unitCode: 'NHT-BIL-102',
        phaseLabel: 'Phase 2 (Days 5–9): Charge Entry, Scrubbing & Clearinghouse Rejections',
        title: 'Superbill Charge Capture, POS/TOS Pairing & ANSI 277CA Front-End Edits',
        deliveryMode: 'EHR Sandbox Lab',
        durationHours: 30,
        topics: [
          'Demographics & insurance verification via Availity / payer portals (270/271)',
          'Charge Entry accuracy: rendering/billing NPI, Box 23 Prior Auth, units & fee schedules',
          'Resolving clearinghouse front-end rejections (Waystar / Change Healthcare / Availity)',
        ],
        status: 'Core Blueprint Ready',
      },
      {
        unitCode: 'NHT-BIL-103',
        phaseLabel: 'Phase 3 (Days 10–13): ERA 835 Payment Posting & Contractual Adjustments',
        title: 'Automated & Manual EOB Posting, PLB Adjustments, Credit Balances & Secondary Crossover',
        deliveryMode: 'EHR Sandbox Lab',
        durationHours: 24,
        topics: [
          'Posting ANSI 835 ERAs & manual EOBs: Allowed Amount, CO-45, PR-1/2/3 patient responsibility',
          'Handling recoupments, offset PLB adjustments, and unapplied cash reconciliation',
          'Triggering secondary claims and patient statements cleanly',
        ],
        status: 'Structure Customizable (Draft)',
      },
      {
        unitCode: 'NHT-BIL-104',
        phaseLabel: 'Phase 4 (Days 14–15): Final NHT Billing Certification & Nesting Gate',
        title: '50-Claim Sandbox Billing Practicum, QA Calibration & 90% Pass Gate',
        deliveryMode: 'QA Calibration & Mock Audit',
        durationHours: 12,
        topics: [
          'Written PKT Assessment + 50-claim timed sandbox charge entry & ERA posting exam',
          '100% QA pre-release audit sign-off before transition to production nesting',
        ],
        status: 'Structure Customizable (Draft)',
      },
    ],
  },
  {
    id: 'NHT-AR',
    shortName: 'NHT - AR',
    fullTitle: 'New Hire Training (NHT) — Accounts Receivable (AR), Denials Management & Appeals',
    badgeColor: 'from-emerald-600 to-teal-600',
    targetAudience: 'New Hire AR Analysts, Denials Specialists & Payer Calling Representatives',
    totalDurationDays: 18,
    totalHours: 108,
    passGatePct: 92,
    activeBatchesCount: 3,
    enrolledAssociatesCount: 36,
    primaryTowers: ['Accounts Receivable (AR)', 'Denials Management', 'Appeals & Reconsiderations'],
    leadTrainer: 'Ananya Iyer',
    overview:
      'Intensive AR follow-up and denial resolution curriculum covering aging buckets (30/60/90/120+ days), CARC/RARC taxonomy, CO-29 timely filing proof, CO-197 prior auth retro-appeals, CO-50 medical necessity clinical packets, and standardized 8-point SOAP account notes.',
    certificationOutcome: 'Certified RCM AR & Denials Resolution Specialist (Nesting Gate >= 92%)',
    units: [
      {
        unitCode: 'NHT-AR-201',
        phaseLabel: 'Phase 1 (Days 1–5): AR Aging Lifecycle & CARC/RARC Denial Taxonomy',
        title: 'Workqueue Prioritization, CO/PR/OA/PI Group Codes & Payer Portal Triage',
        deliveryMode: 'Instructor-Led (ILT)',
        durationHours: 30,
        topics: [
          'AR Aging Buckets (0-30, 31-60, 61-90, 91-120, 120+) & High-Dollar prioritization matrix',
          'Decoding CARC & RARC combinations: Soft denials vs. Hard denials vs. Preventable rejections',
          'Multi-payer portal navigation (Availity, UHC Provider Portal, NaviNet, MAC Portals)',
        ],
        status: 'Core Blueprint Ready',
      },
      {
        unitCode: 'NHT-AR-202',
        phaseLabel: 'Phase 2 (Days 6–11): Top Denials Resolution Playbooks (CO-197, CO-29, CO-16, CO-18)',
        title: 'Prior Auth Retro-Appeals, Timely Filing POTF (277CA) & Duplicate Claim Audits',
        deliveryMode: 'EHR Sandbox Lab',
        durationHours: 36,
        topics: [
          'CO-197 Prior Auth / Precog: Evicore & Carelon retro-auth workflows and peer-to-peer logs',
          'CO-29 Timely Filing Limit: Pulling ANSI 277CA electronic acceptance receipts for POTF appeals',
          'CO-16 Missing Info, CO-18 Exact Duplicate vs. Repeat Procedure (-76/-77) & CO-22 COB',
        ],
        status: 'Core Blueprint Ready',
      },
      {
        unitCode: 'NHT-AR-203',
        phaseLabel: 'Phase 3 (Days 12–15): Payer Calling Etiquette, Clinical Appeals & 8-Point SOAP Notes',
        title: 'Live IVR/Rep Call Scripting, Level-1/Level-2 Appeals & QA Note Standardization',
        deliveryMode: 'Self-Paced Micro-Learning',
        durationHours: 24,
        topics: [
          'Structured Payer Call Checklist: Rep Name, Call Reference #, Claim #, Allowed/Paid verification',
          'Drafting clinical appeals for CO-50 (Medical Necessity) & CO-97/B15 (Bundling) with LCD citations',
          'Writing audit-proof 8-point SOAP account annotations in Epic / Athena / eCW',
        ],
        status: 'Structure Customizable (Draft)',
      },
      {
        unitCode: 'NHT-AR-204',
        phaseLabel: 'Phase 4 (Days 16–18): Mock AR Calling, Rebuttal Calibration & Nesting Gate',
        title: 'Simulated Payer Calls, Denial Overturn Practicum & 92% QA Certification Gate',
        deliveryMode: 'QA Calibration & Mock Audit',
        durationHours: 18,
        topics: [
          'Live mock payer calls graded by QA Lead + 30-account denial resolution simulation',
          'Sign-off by Reporting Lead, Trainer & QA Auditor for production queue release',
        ],
        status: 'Structure Customizable (Draft)',
      },
    ],
  },
  {
    id: 'NHT-CODING',
    shortName: 'NHT - Coding',
    fullTitle: 'New Hire Training (NHT) — Medical Coding (ICD-10-CM, CPT, HCPCS & Specialty Modifiers)',
    badgeColor: 'from-purple-600 to-indigo-600',
    targetAudience: 'New Hire Certified Medical Coders (CPC / CCS /CCA) & Coding Auditors',
    totalDurationDays: 20,
    totalHours: 120,
    passGatePct: 95,
    activeBatchesCount: 2,
    enrolledAssociatesCount: 22,
    primaryTowers: ['Medical Coding', 'Appeals & Reconsiderations'],
    leadTrainer: 'Ritu Chatterjee',
    overview:
      'Rigorous specialty medical coding curriculum covering ICD-10-CM official guidelines, CPT/HCPCS surgical & E/M coding, NCCI Procedure-to-Procedure (PTP) edits, Medically Unlikely Edits (MUEs), and multi-specialty guidelines (Cardiology, Orthopedics, Radiology, GI, Behavioral Health).',
    certificationOutcome: 'Certified Multi-Specialty Production Coder (95% Coding QA Gate)',
    units: [
      {
        unitCode: 'NHT-COD-301',
        phaseLabel: 'Phase 1 (Days 1–5): ICD-10-CM Official Guidelines, E/M MDM & Modifier Mastery',
        title: '2026 AMA E/M Guidelines, NCCI Modifiers (-25, -59, -XE/-XS/-XP/-XU) & Global Periods',
        deliveryMode: 'Instructor-Led (ILT)',
        durationHours: 30,
        topics: [
          'ICD-10-CM specificity, laterality, 7th characters (A/D/S) & Excludes1 vs. Excludes2 notes',
          'AMA E/M Medical Decision Making (MDM) 3-element grid & time-based E/M coding',
          'Surgical Global Periods (0, 10, 90 days) & Modifiers -24, -25, -57, -58, -78, -79',
        ],
        status: 'Core Blueprint Ready',
      },
      {
        unitCode: 'NHT-COD-302',
        phaseLabel: 'Phase 2 (Days 6–11): Surgical Specialty Coding (Cardiology, Ortho & GI)',
        title: 'Cath Lab/PCI Vessel Coding, 3-Compartment Knee Arthroscopy & GI Colonoscopy Rules',
        deliveryMode: 'EHR Sandbox Lab',
        durationHours: 36,
        topics: [
          'Cardiology: Coronary Cath (93451–93461), PCI Stents (92928) & Vessel Modifiers (-LD, -LC, -RC)',
          'Orthopedics: Arthroscopy (29870–29889), Fracture Care & Spinal Instrumentation',
          'Gastroenterology: Screening-to-Diagnostic Colonoscopy (-PT vs -33) & EGD biopsy rules',
        ],
        status: 'Core Blueprint Ready',
      },
      {
        unitCode: 'NHT-COD-303',
        phaseLabel: 'Phase 3 (Days 12–16): Radiology (-26/-TC), Behavioral Health & LCD/NCD Compliance',
        title: 'Professional/Technical Splits, Time-Based Psychotherapy (90832–90837) & Encoder Edits',
        deliveryMode: 'EHR Sandbox Lab',
        durationHours: 30,
        topics: [
          'Diagnostic Radiology: POS-based Modifier -26 vs -TC vs Global billing & contrast bundling',
          'Behavioral Health: Time-rule midpoint thresholds (90832/34/37) & +90785 interactive complexity',
          'Using 3M / Optum Encoder Pro to validate Medicare LCD/NCD diagnosis pointers before release',
        ],
        status: 'Structure Customizable (Draft)',
      },
      {
        unitCode: 'NHT-COD-304',
        phaseLabel: 'Phase 4 (Days 17–20): 100-Chart Blind Coding Audit & 95% Production Release Gate',
        title: 'Multi-Specialty Operative Report Coding Exam & Zero-Fatal-Error Calibration',
        deliveryMode: 'QA Calibration & Mock Audit',
        durationHours: 24,
        topics: [
          '100 anonymized operative & clinic charts across 6 provider specialties',
          'Requires >= 95% coding accuracy and zero Critical/Fatal HIPAA or upcoding errors',
        ],
        status: 'Structure Customizable (Draft)',
      },
    ],
  },
  {
    id: 'REFRESHER-MOD',
    shortName: 'Refresher Training Module',
    fullTitle: 'Continuous Refresher Training Module — Defect Remediation, BQT/PIP & Payer Updates',
    badgeColor: 'from-amber-500 to-rose-600',
    targetAudience: 'Production Associates (1-Wk DBT, 3-Wk BQT, 4-Wk PIP & Quarterly Recertification)',
    totalDurationDays: 5,
    totalHours: 15,
    passGatePct: 88,
    activeBatchesCount: 4,
    enrolledAssociatesCount: 42,
    primaryTowers: [
      'Demographics & Charge Entry',
      'Medical Coding',
      'Payment Posting',
      'Accounts Receivable (AR)',
      'Denials Management',
      'Appeals & Reconsiderations',
      'Patient Calling',
    ],
    leadTrainer: 'Ritu Chatterjee & Ananya Iyer',
    overview:
      'Modular rapid-intervention refresher curriculum assigned automatically when an associate is 1 Week Below Quality SLA (DBT), 3 Consecutive Weeks Below QA (BQT), 4 Consecutive Weeks Below QA (15-Day PIP), or when a major Payer Process Flash Update is released.',
    certificationOutcome: 'Refresher SLA Clearance & Post-Coaching PKT Sign-Off (>= 88%)',
    units: [
      {
        unitCode: 'REF-MOD-401',
        phaseLabel: 'Track A (1 Week Below QA): Defect-Based Micro-Refresher (DBT)',
        title: 'Targeted Top-3 Audit Defect Root-Cause Huddle & 10-Claim Supervised Walk-Through',
        deliveryMode: 'Self-Paced Micro-Learning',
        durationHours: 3,
        topics: [
          'Review of associate’s specific weekly QA audit errors (CARC/RARC, Modifier, or SOAP note gap)',
          'Side-by-side comparison against current Project SOP & Client Playbook',
          'Mandatory Trainer Closure Summary & 85%+ micro-quiz clearance',
        ],
        status: 'Core Blueprint Ready',
      },
      {
        unitCode: 'REF-MOD-402',
        phaseLabel: 'Track B (3 Consecutive Weeks Below QA): Bottom Quartile Training (BQT)',
        title: 'Will-vs-Skill Diagnostic, Daily Floor Coaching & Weekly 4-Pillar Assessment Gate',
        deliveryMode: 'Instructor-Led (ILT)',
        durationHours: 6,
        topics: [
          'Formal Will-vs-Skill root-cause matrix with Trainer, Reporting Lead & QA Auditor',
          'Daily 5-claim pre-submission review and live rebuttal calibration review',
          'Must achieve >=Project Quality SLA for 2 consecutive weeks to graduate from BQT',
        ],
        status: 'Core Blueprint Ready',
      },
      {
        unitCode: 'REF-MOD-403',
        phaseLabel: 'Track C (4 Consecutive Weeks Below QA): 15-Day PIP Intensive Remediation',
        title: '15-Day Structured Turnaround Plan, 100% Pre-Bill QA Gate & Final Re-Certification',
        deliveryMode: 'QA Calibration & Mock Audit',
        durationHours: 4,
        topics: [
          'Day 1–5: Intensive SOP & Specialty Knowledge re-training + 100% pre-bill QA audit check',
          'Day 6–10: Supervised live queue processing with zero fatal errors',
          'Day 11–15: Final PKT & Quality SLA evaluation signed off by Trainer, Manager & Training Lead',
        ],
        status: 'Structure Customizable (Draft)',
      },
      {
        unitCode: 'REF-MOD-404',
        phaseLabel: 'Track D (Quarterly / Ad-Hoc): Payer Bulletin & SOP Flash Refresher',
        title: 'Monthly Update Tracker Rollup & Cross-Specialty NCCI / LCD Refresher',
        deliveryMode: 'Self-Paced Micro-Learning',
        durationHours: 2,
        topics: [
          'Consolidated review of all Process Updates logged in the project Update Tracker',
          'Feeds directly into the Weekly Process Updates Assessment & Monthly PKT',
        ],
        status: 'Structure Customizable (Draft)',
      },
    ],
  },
  {
    id: 'AR-CS-TRAINING',
    shortName: 'AR - CS Training',
    fullTitle:
      'AR Client-Specific (CS) Training — Specialty, Softwares/Tools, Payers, Scenarios, OJT & QCP (90%)',
    badgeColor: 'from-cyan-600 to-blue-600',
    targetAudience: 'Lateral Hires (Direct Intake) & Post-NHT Graduates (Assigned After NHT)',
    totalDurationDays: 15,
    totalHours: 90,
    passGatePct: 90,
    activeBatchesCount: 3,
    enrolledAssociatesCount: 25,
    primaryTowers: ['Accounts Receivable (AR)', 'Denials Management', 'Appeals & Reconsiderations'],
    leadTrainer: 'Ananya Iyer & Ritu Chatterjee',
    overview:
      'Client-Specific AR bridge program assigned to Lateral Hires and Post-NHT Graduates. Customizable per project for Specialty, EHR/Tools, Client Payers, Scenarios, Process Updates, Project Structure & Workflow Knowledge, Process Practice Days, OJT (Production, Quality & Error Summary), and Quality Certification Process (QCP: 3-Day Avg >= 90% -> If Fail: 1-Day Refresher -> QCP Attempt 2: 2-Day Avg >= 90% / QCP Exemption).',
    certificationOutcome:
      'QCP-1 Certified (3-Day Avg >= 90%), QCP-2 Certified (2-Day Avg >= 90% Post-Refresher), or QCP Exempted',
    units: [
      {
        unitCode: 'AR-CS-501',
        phaseLabel: 'Phase 1 (Days 1–3): Client Specialty, Softwares/Tools, Payers, Scenarios & Workflow',
        title: 'Customizable Project Structure, EHR/Clearinghouse Tools, Payer Matrix & Live Updates',
        deliveryMode: 'Instructor-Led (ILT)',
        durationHours: 18,
        topics: [
          'Client Specialty rules (Ortho, Cardio, GI, Radiology, Behavioral Health) & Payer Mix',
          'Client Softwares & Tools (Epic Resolute, Athena, eCW, Waystar, Availity, Evicore)',
          'Project Structure, Workqueue Architecture, Escalation Matrix, Write-Off Rules & Updates',
        ],
        status: 'Core Blueprint Ready',
      },
      {
        unitCode: 'AR-CS-502',
        phaseLabel: 'Phase 2 (Days 4–7): Guided Process Practice Days (Sandbox & Mock Scenarios)',
        title: 'Hands-On Client Scenario Practice Days & 8-Point SOAP Annotation Drills',
        deliveryMode: 'EHR Sandbox Lab',
        durationHours: 24,
        topics: [
          '3–4 Days of guided practice on client-specific denial & AR scenarios before live OJT',
          'Simulated payer portal verification, retro-auth lookups, and appeal packet assembly',
        ],
        status: 'Core Blueprint Ready',
      },
      {
        unitCode: 'AR-CS-503',
        phaseLabel: 'Phase 3 (Days 8–12): On-the-Job Training (OJT — Production, Quality & Error Summary)',
        title: 'Supervised Live Queue Processing with Daily Production %, Quality % & Defect Summary',
        deliveryMode: 'EHR Sandbox Lab',
        durationHours: 30,
        topics: [
          'Daily tracking of OJT Production Score (%), OJT Quality Score (%), and OJT Error Summary',
          '100% pre-release trainer/QA review during OJT window',
        ],
        status: 'Core Blueprint Ready',
      },
      {
        unitCode: 'AR-CS-504',
        phaseLabel: 'Phase 4 (Days 13–15+): Quality Certification Process (QCP-1 3d, Refresher 1d, QCP-2 2d & Exemption)',
        title: 'QCP Attempt 1 (3-Day Avg >= 90%) → If Fail: 1-Day Refresher → QCP Attempt 2 (2-Day Avg >= 90%) or QCP Exemption',
        deliveryMode: 'QA Calibration & Mock Audit',
        durationHours: 18,
        topics: [
          'QCP Attempt 1: 3-Day Quality Average must be >= 90.0% to pass into production',
          'If QCP-1 < 90%: Mandatory 1-Day Refresher followed by QCP Attempt 2 (2-Day Average >= 90.0%)',
          'QCP Exemption option available for seasoned Lateral Hires / 99%+ OJT performers',
        ],
        status: 'Core Blueprint Ready',
      },
    ],
  },
];

// ============================================================================
// 1. CONTINUOUS LEARNING PROCESS DASHBOARD (DBT, BQT, PIP STATS & TRENDS + UPDATE TRACKER LOG)
// ============================================================================

interface ContinuousLearningDashboardProps {
  projects: ProjectHealth[];
  associates: AssociateProfile[];
  tickets: AutoTriggeredTrainingTicket[];
  sops: SopPlaybookItem[];
  setSops: React.Dispatch<React.SetStateAction<SopPlaybookItem[]>>;
  questionBank: ProjectQuestionBankItem[];
  setQuestionBank: React.Dispatch<React.SetStateAction<ProjectQuestionBankItem[]>>;
  weeklyAssessments: ProjectWeeklyAssessment[];
  setWeeklyAssessments: React.Dispatch<React.SetStateAction<ProjectWeeklyAssessment[]>>;
  triggerToast: (msg: string) => void;
}

export const ContinuousLearningDashboard: React.FC<ContinuousLearningDashboardProps> = ({
  projects,
  associates,
  tickets,
  sops,
  setSops,
  questionBank,
  setQuestionBank,
  weeklyAssessments,
  setWeeklyAssessments,
  triggerToast,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [updateLog, setUpdateLog] = useState<ProcessUpdateTrackerEntry[]>(INITIAL_UPDATE_TRACKER_LOG);
  const [showAddUpdateModal, setShowAddUpdateModal] = useState<boolean>(false);
  const [selectedUpdatePreview, setSelectedUpdatePreview] = useState<ProcessUpdateTrackerEntry | null>(
    INITIAL_UPDATE_TRACKER_LOG[0]
  );

  // New Process Update + Paired PKT Question Form State
  const [updProjectId, setUpdProjectId] = useState<string>(projects[0]?.id || 'PRJ-ORTH-02');
  const [updTower, setUpdTower] = useState<RcmTower>('Denials Management');
  const [updPayerSource, setUpdPayerSource] = useState<string>('BlueCross BlueShield — Nov 2026 Policy Bulletin');
  const [updTitle, setUpdTitle] = useState<string>('');
  const [updSummary, setUpdSummary] = useState<string>('');
  const [updStep1, setUpdStep1] = useState<string>(
    'Verify updated payer policy effective date and attach clinical medical necessity notes before claim release.'
  );
  const [updStep2, setUpdStep2] = useState<string>(
    'Document the update reference code in the 8-point SOAP annotation prior to submitting reconsiderations.'
  );
  const [updPitfall, setUpdPitfall] = useState<string>(
    'Submitting claims under legacy pre-Nov 2026 rules triggers automatic CO-50 / CO-16 rejections.'
  );
  const [updCodes, setUpdCodes] = useState<string>('CO-50, CO-197, Mod -25');

  // Paired Question Bank / PKT Question Fields
  const [pktQuestionText, setPktQuestionText] = useState<string>('');
  const [pktOptA, setPktOptA] = useState<string>(
    'Follow the new payer policy workflow, attach required clinical documentation, and log the update code in SOAP notes'
  );
  const [pktOptB, setPktOptB] = useState<string>(
    'Write off the claim balance immediately to contractual adjustment CO-45'
  );
  const [pktOptC, setPktOptC] = useState<string>(
    'Resubmit the claim without changes to bypass clearinghouse edits'
  );
  const [pktOptD, setPktOptD] = useState<string>(
    'Transfer the balance to patient responsibility without reviewing payer rules'
  );
  const [pktCorrectIndex, setPktCorrectIndex] = useState<number>(0);
  const [pktExplanation, setPktExplanation] = useState<string>(
    'Per the newly published Process Update in the Project Knowledge Library, associates must follow the updated payer documentation rule to prevent repeat QA defects.'
  );

  // Filtered datasets by project
  const scopedProjects = useMemo(
    () => (selectedProjectId === 'ALL' ? projects : projects.filter((p) => p.id === selectedProjectId)),
    [projects, selectedProjectId]
  );

  const scopedAssociates = useMemo(
    () =>
      selectedProjectId === 'ALL'
        ? associates
        : associates.filter((a) => a.projectId === selectedProjectId),
    [associates, selectedProjectId]
  );

  const scopedTickets = useMemo(
    () =>
      selectedProjectId === 'ALL'
        ? tickets
        : tickets.filter((t) => t.projectId === selectedProjectId),
    [tickets, selectedProjectId]
  );

  const scopedUpdates = useMemo(
    () =>
      selectedProjectId === 'ALL'
        ? updateLog
        : updateLog.filter((u) => u.projectId === selectedProjectId),
    [updateLog, selectedProjectId]
  );

  // DBT, BQT, PIP Stats Calculation
  const clpStats = useMemo(() => {
    const dbtAssociates = scopedAssociates.filter(
      (a) =>
        a.governanceStage === 'Defect-Based Training (1-2 Wks Below QA)' ||
        a.consecutiveWeeksBelowQa === 1 ||
        a.consecutiveWeeksBelowQa === 2
    );
    const bqtAssociates = scopedAssociates.filter(
      (a) =>
        a.governanceStage === 'BQT (3 Consecutive Wks Below QA)' ||
        a.consecutiveWeeksBelowQa === 3
    );
    const pipAssociates = scopedAssociates.filter(
      (a) =>
        a.governanceStage === 'PIP - 15 Days (4 Consecutive Wks Below QA)' ||
        a.consecutiveWeeksBelowQa >= 4
    );

    const dbtTickets = scopedTickets.filter((t) =>
      t.triggerLevel.includes('Defect-Based Training')
    );
    const bqtTickets = scopedTickets.filter((t) => t.triggerLevel.includes('BQT'));
    const pipTickets = scopedTickets.filter((t) => t.triggerLevel.includes('PIP'));
    const closedTickets = scopedTickets.filter((t) => t.status === 'Closed — Summary Logged');

    return {
      dbtCount: dbtAssociates.length,
      bqtCount: bqtAssociates.length,
      pipCount: pipAssociates.length,
      dbtTicketsCount: dbtTickets.length,
      bqtTicketsCount: bqtTickets.length,
      pipTicketsCount: pipTickets.length,
      closedCount: closedTickets.length,
      totalTickets: scopedTickets.length,
      closureRatePct: scopedTickets.length
        ? Math.round((closedTickets.length / scopedTickets.length) * 100)
        : 100,
    };
  }, [scopedAssociates, scopedTickets]);

  // 6-Week Continuous Learning Trend Data (DBT vs BQT vs 15-Day PIP & Post-Coaching QA SLA Lift)
  const sixWeekTrends = useMemo(() => {
    const mult = selectedProjectId === 'ALL' ? 1 : 0.35;
    return [
      {
        week: 'W1 (Oct 03)',
        dbtTriggered: Math.max(1, Math.round(14 * mult)),
        bqtActive: Math.max(1, Math.round(7 * mult)),
        pipActive: Math.max(0, Math.round(4 * mult)),
        postTrainingQaPct: 95.4,
        pktAvgPct: 86.2,
      },
      {
        week: 'W2 (Oct 10)',
        dbtTriggered: Math.max(1, Math.round(12 * mult)),
        bqtActive: Math.max(1, Math.round(6 * mult)),
        pipActive: Math.max(0, Math.round(3 * mult)),
        postTrainingQaPct: 96.1,
        pktAvgPct: 87.5,
      },
      {
        week: 'W3 (Oct 17)',
        dbtTriggered: Math.max(1, Math.round(11 * mult)),
        bqtActive: Math.max(1, Math.round(5 * mult)),
        pipActive: Math.max(0, Math.round(3 * mult)),
        postTrainingQaPct: 96.6,
        pktAvgPct: 88.8,
      },
      {
        week: 'W4 (Oct 24)',
        dbtTriggered: Math.max(1, Math.round(9 * mult)),
        bqtActive: Math.max(1, Math.round(5 * mult)),
        pipActive: Math.max(0, Math.round(2 * mult)),
        postTrainingQaPct: 97.1,
        pktAvgPct: 90.1,
      },
      {
        week: 'W5 (Oct 31)',
        dbtTriggered: Math.max(1, Math.round(8 * mult)),
        bqtActive: Math.max(1, Math.round(4 * mult)),
        pipActive: Math.max(0, Math.round(2 * mult)),
        postTrainingQaPct: 97.5,
        pktAvgPct: 91.0,
      },
      {
        week: 'W6 (Nov 07)',
        dbtTriggered: Math.max(1, clpStats.dbtCount || Math.round(6 * mult)),
        bqtActive: Math.max(1, clpStats.bqtCount || Math.round(3 * mult)),
        pipActive: Math.max(1, clpStats.pipCount || Math.round(1 * mult)),
        postTrainingQaPct: 97.9,
        pktAvgPct: 92.4,
      },
    ];
  }, [selectedProjectId, clpStats]);

  // Helper to auto-fill PKT Question from the Process Update fields
  const handleAutoGeneratePktQuestion = () => {
    const targetProj = projects.find((p) => p.id === updProjectId) || projects[0];
    const titleText =
      updTitle.trim() || `${updPayerSource} Process Change for ${targetProj.projectName}`;
    setPktQuestionText(
      `Per the newly released Process Update ("${titleText}") for ${targetProj.projectName} (${updTower}), what is the mandatory operational action required from RCM associates?`
    );
    setPktOptA(
      updStep1.trim() ||
        'Verify the updated payer rule, attach required clinical documentation, and annotate the update code in SOAP notes'
    );
    setPktOptB('Bypass the payer edit and release the claim without documentation');
    setPktOptC('Write off the balance under contractual adjustment CO-45');
    setPktOptD('Hold the claim indefinitely without logging a payer follow-up note');
    setPktCorrectIndex(0);
    setPktExplanation(
      `This question was auto-generated from Process Update "${titleText}" (${updPayerSource}) to validate associate readiness on the Project PKT & Weekly Process Updates Assessment.`
    );
    triggerToast('Auto-generated PKT Assessment Question from your Process Update details!');
  };

  // Handler: Add Process Update -> Automatically adds to:
  // 1) Update Tracker Log
  // 2) Respective Project Knowledge Library (`sops` as 'Process Update Flash')
  // 3) Project Question Bank (`questionBank` for PKT & Weekly Process Updates Assessment)
  const handlePublishUpdateAndSync = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updTitle.trim()) {
      triggerToast('Please enter a Process Update Title.');
      return;
    }

    const targetProj = projects.find((p) => p.id === updProjectId) || projects[0];
    const randNum = Math.floor(400 + Math.random() * 599);
    const updateCode = `UPD-${targetProj.clientCode.split('-')[0] || 'RCM'}-${randNum}`;
    const knowledgeDocId = `SOP-UPD-${Date.now().toString().slice(-4)}`;
    const questionId = `QB-PKT-${randNum}`;

    const parsedCodes = updCodes
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const finalQuestionStem =
      pktQuestionText.trim() ||
      `Under the new ${updPayerSource} update ("${updTitle.trim()}") for ${targetProj.projectName}, which action is required for QA compliance?`;

    // 1. Create SopPlaybookItem for the Project Knowledge Library ('Process Update Flash')
    const newKnowledgeItem: SopPlaybookItem = {
      id: knowledgeDocId,
      docCode: updateCode,
      title: updTitle.trim(),
      docType: 'Process Update Flash',
      tower: updTower,
      specialty: targetProj.specialty,
      payerFocus: updPayerSource.trim() || 'All Project Payers',
      version: 'v1.0 (Live Update)',
      updatedAt: '2026-11-07',
      author: `${targetProj.ldTrainer} (Project Trainer)`,
      readAckPct: 100,
      acknowledgedByCurrentUser: false,
      summary:
        updSummary.trim() ||
        `Mandatory process update for ${targetProj.projectName} (${updTower}) governing ${updTitle.trim()}.`,
      stepByStepGuide: [updStep1.trim(), updStep2.trim()].filter(Boolean),
      commonPitfalls: [updPitfall.trim()].filter(Boolean),
      relatedCarcRarcCodes: parsedCodes.length ? parsedCodes : ['Process Update', updTower],
    };

    // 2. Create ProjectQuestionBankItem for the Project Question Bank (for PKT & Weekly Assessment)
    const newQuestionItem: ProjectQuestionBankItem = {
      id: questionId,
      projectId: targetProj.id,
      projectName: targetProj.projectName,
      specialty: targetProj.specialty,
      tower: updTower,
      pillar: '3. Weekly Process Updates',
      question: finalQuestionStem,
      options: [pktOptA, pktOptB, pktOptC, pktOptD],
      correctIndex: pktCorrectIndex,
      explanation: pktExplanation,
      addedBy: `${targetProj.ldTrainer} (Auto-Synced from Update ${updateCode})`,
      createdAt: '2026-11-07',
    };

    // 3. Create Update Tracker Log Entry linking both
    const newLogEntry: ProcessUpdateTrackerEntry = {
      id: `UPDT-${Date.now().toString().slice(-5)}`,
      updateCode,
      projectId: targetProj.id,
      projectName: targetProj.projectName,
      specialty: targetProj.specialty,
      tower: updTower,
      payerOrSource: updPayerSource.trim() || 'Client Policy Flash',
      title: updTitle.trim(),
      summary: newKnowledgeItem.summary,
      operationalSteps: newKnowledgeItem.stepByStepGuide,
      auditPitfalls: newKnowledgeItem.commonPitfalls,
      relatedCodes: newKnowledgeItem.relatedCarcRarcCodes,
      effectiveDate: '2026-11-07',
      publishedBy: `${targetProj.ldTrainer} (Project Trainer)`,
      linkedKnowledgeDocCode: updateCode,
      linkedPktQuestionId: questionId,
      pktQuestionPreview: finalQuestionStem,
      readAckPct: 18,
    };

    // Update all 4 states atomically
    setSops((prev) => [newKnowledgeItem, ...prev]);
    setQuestionBank((prev) => [newQuestionItem, ...prev]);
    setWeeklyAssessments((prev) =>
      prev.map((wa) =>
        wa.projectId === targetProj.id && wa.pillar === '3. Weekly Process Updates'
          ? { ...wa, questionIds: [...wa.questionIds, questionId] }
          : wa
      )
    );
    setUpdateLog((prev) => [newLogEntry, ...prev]);
    setSelectedUpdatePreview(newLogEntry);
    setShowAddUpdateModal(false);
    setUpdTitle('');
    setUpdSummary('');
    setPktQuestionText('');

    triggerToast(
      `Published Update ${updateCode}: Auto-added to "${targetProj.projectName}" Knowledge Library AND added Question ${questionId} to Project PKT Question Bank!`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Executive Banner & Project Scope Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              Continuous Learning Process (CLP) Dashboard — Project DBT, BQT & 15-Day PIP Trends + Live Update Tracker
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor project-wise remediation funnels (1-Wk DBT → 3-Wk BQT → 4-Wk 15-Day PIP) and log Process Updates that auto-sync to Project Knowledge & PKT Question Banks
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Project Scope:</span>
          <select
            aria-label="Select Project for Continuous Learning Dashboard"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white"
          >
            <option value="ALL">All RCM Projects ({projects.length} Active Accounts)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.clientCode} • {p.projectName} ({p.specialty})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddUpdateModal((prev) => !prev)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>
              {showAddUpdateModal
                ? 'Close Update Publisher'
                : '+ Log Process Update (Auto-Sync Knowledge + PKT)'}
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          SECTION 1: PROJECT DBT, BQT & PIP (15-DAY) KPI CARDS
         ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold">
            <span>1. Defect-Based Training (DBT)</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-white tabular-nums">
              {clpStats.dbtCount}{' '}
              <span className="text-xs font-normal text-slate-400">Associates</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              1–2 Wks &lt; QA SLA
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {clpStats.dbtTicketsCount} auto-triggered tickets • Micro-module + trainer summary required
          </p>
        </div>

        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
            <span>2. Bottom Quartile Training (BQT)</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-amber-300 tabular-nums">
              {clpStats.bqtCount}{' '}
              <span className="text-xs font-normal text-slate-400">Associates</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              3 Consecutive Wks &lt; QA
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {clpStats.bqtTicketsCount} BQT tickets • Will-vs-Skill RCA & weekly 4-assessment gate
          </p>
        </div>

        <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-rose-300 font-semibold">
            <span>3. PIP — 15 Days Governance</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-rose-400 tabular-nums">
              {clpStats.pipCount}{' '}
              <span className="text-xs font-normal text-slate-400">Associates</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
              4 Consecutive Wks &lt; QA
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {clpStats.pipTicketsCount} active 15-Day PIPs • 100% pre-bill QA audit check
          </p>
        </div>

        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold">
            <span>4. Update Tracker → PKT Sync</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-emerald-400 tabular-nums">
              {scopedUpdates.length}{' '}
              <span className="text-xs font-normal text-slate-400">Live Updates</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              100% PKT Synced
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Every logged update auto-populates Project Knowledge & Question Bank ({questionBank.length} Qs)
          </p>
        </div>
      </div>

      {/* =====================================================================
          SECTION 2: 6-WEEK DBT / BQT / PIP TRENDS & PROJECT BREAKDOWN MATRIX
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: 6-Week Continuous Learning & SLA Lift Visual Trend */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                6-Week Continuous Learning Trend (DBT → BQT → 15-Day PIP vs. Quality Lift)
              </h3>
              <p className="text-xs text-slate-400">
                Early 1-Week DBT intervention progressively reduces 3-Week BQT and 4-Week PIP escalations
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-indigo-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" /> DBT (1W)
              </span>
              <span className="flex items-center gap-1 text-amber-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" /> BQT (3W)
              </span>
              <span className="flex items-center gap-1 text-rose-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" /> PIP (4W)
              </span>
            </div>
          </div>

          {/* Grouped Bar Chart */}
          <div className="grid grid-cols-6 gap-2.5 items-end h-44 bg-slate-950/90 p-4 rounded-xl border border-slate-800">
            {sixWeekTrends.map((w) => {
              const dbtH = Math.min(100, Math.max(15, w.dbtTriggered * 6));
              const bqtH = Math.min(100, Math.max(12, w.bqtActive * 8));
              const pipH = Math.min(100, Math.max(8, w.pipActive * 10));
              return (
                <div key={w.week} className="flex flex-col items-center justify-end h-full gap-1.5">
                  <div className="text-[10px] font-bold text-emerald-400 tabular-nums">
                    QA {w.postTrainingQaPct}%
                  </div>
                  <div className="w-full h-24 flex items-end justify-center gap-1 bg-slate-900/80 rounded-t-lg px-1 pt-2">
                    <div
                      title={`DBT Triggered: ${w.dbtTriggered}`}
                      className="w-2.5 bg-indigo-500 rounded-t transition-all"
                      style={{ height: `${dbtH}%` }}
                    />
                    <div
                      title={`BQT Active: ${w.bqtActive}`}
                      className="w-2.5 bg-amber-500 rounded-t transition-all"
                      style={{ height: `${bqtH}%` }}
                    />
                    <div
                      title={`15-Day PIP Active: ${w.pipActive}`}
                      className="w-2.5 bg-rose-500 rounded-t transition-all"
                      style={{ height: `${pipH}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-semibold text-slate-300">{w.week.split(' ')[0]}</div>
                  <div className="text-[9px] text-slate-400 tabular-nums">
                    {w.dbtTriggered}D / {w.bqtActive}B / {w.pipActive}P
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400">DBT → Core Recovery Rate</div>
              <div className="text-base font-bold text-indigo-300 mt-0.5 tabular-nums">84.2%</div>
              <div className="text-[10px] text-slate-500">Resolved in Week 1 without BQT</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400">BQT Graduation Rate</div>
              <div className="text-base font-bold text-amber-300 mt-0.5 tabular-nums">76.5%</div>
              <div className="text-[10px] text-slate-500">Prevented 4-Week PIP escalation</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400">Trainer Summary Closure</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5 tabular-nums">
                {clpStats.closureRatePct}%
              </div>
              <div className="text-[10px] text-slate-500">
                {clpStats.closedCount} of {clpStats.totalTickets} tickets closed
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Project-by-Project DBT, BQT & 15-Day PIP Governance Matrix */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                Project-Wise Continuous Learning & Remediation Stats (DBT / BQT / 15-Day PIP)
              </h3>
              <p className="text-xs text-slate-400">
                Click any project row to filter the dashboard and Update Tracker Log
              </p>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-950/60">
                  <th className="py-3 px-3.5">Project & Trainer</th>
                  <th className="py-3 px-3 text-right">QA SLA</th>
                  <th className="py-3 px-3 text-center">DBT (1W)</th>
                  <th className="py-3 px-3 text-center">BQT (3W)</th>
                  <th className="py-3 px-3 text-center">PIP (15d)</th>
                  <th className="py-3 px-3 text-right">Updates / Q-Bank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 tabular-nums">
                {scopedProjects.map((p) => {
                  const projAssocs = associates.filter((a) => a.projectId === p.id);
                  const dbtC = projAssocs.filter(
                    (a) =>
                      a.consecutiveWeeksBelowQa === 1 ||
                      a.consecutiveWeeksBelowQa === 2 ||
                      a.governanceStage === 'Defect-Based Training (1-2 Wks Below QA)'
                  ).length;
                  const bqtC =
                    projAssocs.filter(
                      (a) =>
                        a.consecutiveWeeksBelowQa === 3 ||
                        a.governanceStage === 'BQT (3 Consecutive Wks Below QA)'
                    ).length || p.bqtCount;
                  const pipC =
                    projAssocs.filter(
                      (a) =>
                        a.consecutiveWeeksBelowQa >= 4 ||
                        a.governanceStage === 'PIP - 15 Days (4 Consecutive Wks Below QA)'
                    ).length || p.pipCount;
                  const projUpdates = updateLog.filter((u) => u.projectId === p.id).length;
                  const projQs = questionBank.filter((q) => q.projectId === p.id).length;

                  return (
                    <tr
                      key={p.id}
                      onClick={() =>
                        setSelectedProjectId((prev) => (prev === p.id ? 'ALL' : p.id))
                      }
                      className={`cursor-pointer transition-colors ${
                        selectedProjectId === p.id ? 'bg-indigo-600/15' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-white">{p.projectName}</div>
                        <div className="text-[11px] text-slate-400">
                          <span className="text-indigo-300 font-mono">{p.clientCode}</span> • Trainer:{' '}
                          <span className="text-emerald-300">{p.ldTrainer}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div
                          className={`font-bold ${
                            p.qualitySlaPct < p.qualityTargetPct
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {p.qualitySlaPct}%
                        </div>
                        <div className="text-[10px] text-slate-500">Tgt {p.qualityTargetPct}%</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-bold">
                          {dbtC}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                          {bqtC}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 font-bold">
                          {pipC}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="font-semibold text-emerald-300">{projUpdates} Updates</div>
                        <div className="text-[10px] text-slate-400">{projQs} PKT Qs</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 3: ADD NEW PROCESS UPDATE FORM (AUTO-SYNCS TO PROJECT KNOWLEDGE LIBRARY + PROJECT QUESTION BANK FOR PKT)
         ===================================================================== */}
      {showAddUpdateModal && (
        <form
          onSubmit={handlePublishUpdateAndSync}
          className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-6 space-y-5 shadow-2xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FilePlus2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Log New Process Update — Automated Dual Sync to Project Knowledge Library & PKT Question Bank
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Publishing an update here automatically: <strong>(1)</strong> adds a Process Update Flash card to the respective Project Knowledge Library, and <strong>(2)</strong> adds a paired assessment question to the Project Question Bank for PKT & Weekly Assessments.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAutoGeneratePktQuestion}
              className="px-3.5 py-2 rounded-xl bg-indigo-600/25 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>⚡ Auto-Fill PKT Question from Update Details</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Process Update & Project Knowledge Library Details */}
            <div className="space-y-3.5 bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Step 1: Process Update Details (Syncs to Project Knowledge Library)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Target RCM Project *
                  </label>
                  <select
                    value={updProjectId}
                    onChange={(e) => setUpdProjectId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.projectName} ({p.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Target RCM Tower *
                  </label>
                  <select
                    value={updTower}
                    onChange={(e) => setUpdTower(e.target.value as RcmTower)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  >
                    {RCM_TOWERS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Payer / Regulatory Bulletin Source
                  </label>
                  <input
                    type="text"
                    value={updPayerSource}
                    onChange={(e) => setUpdPayerSource(e.target.value)}
                    placeholder="e.g., Medicare Novitas LCD / UHC Bulletin"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Related CARC / CPT / Modifiers (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={updCodes}
                    onChange={(e) => setUpdCodes(e.target.value)}
                    placeholder="e.g., CO-197, CPT 29881, Mod -25"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Process Update Title *
                </label>
                <input
                  type="text"
                  required
                  value={updTitle}
                  onChange={(e) => setUpdTitle(e.target.value)}
                  placeholder="e.g., Aetna Commercial Prior Auth Exemption Rule for Outpatient Arthroscopy"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Executive Summary & Policy Change Description
                </label>
                <textarea
                  rows={2}
                  value={updSummary}
                  onChange={(e) => setUpdSummary(e.target.value)}
                  placeholder="Summarize what changed, effective date, and impact on clean claim submission or denial appeals..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Mandatory Operational Step #1
                  </label>
                  <input
                    type="text"
                    value={updStep1}
                    onChange={(e) => setUpdStep1(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    QA Audit Pitfall to Avoid
                  </label>
                  <input
                    type="text"
                    value={updPitfall}
                    onChange={(e) => setUpdPitfall(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Paired PKT Question for Project Question Bank */}
            <div className="space-y-3.5 bg-slate-950/70 border border-indigo-500/30 rounded-xl p-4 text-xs">
              <div className="font-bold text-indigo-300 flex items-center justify-between text-xs uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>Step 2: Paired Question (Auto-Added to Project Question Bank for PKT)</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px]">
                  Pillar 3: Weekly Process Updates & PKT
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  PKT / Weekly Assessment Question Prompt
                </label>
                <textarea
                  rows={2}
                  value={pktQuestionText}
                  onChange={(e) => setPktQuestionText(e.target.value)}
                  placeholder="Leave blank to auto-generate from Update Title, or write a custom scenario question for the project PKT..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-400 mb-1">Option A (Default Correct)</label>
                  <input
                    type="text"
                    value={pktOptA}
                    onChange={(e) => setPktOptA(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Option B</label>
                  <input
                    type="text"
                    value={pktOptB}
                    onChange={(e) => setPktOptB(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Option C</label>
                  <input
                    type="text"
                    value={pktOptC}
                    onChange={(e) => setPktOptC(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Option D</label>
                  <input
                    type="text"
                    value={pktOptD}
                    onChange={(e) => setPktOptD(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Correct Option</label>
                  <select
                    value={pktCorrectIndex}
                    onChange={(e) => setPktCorrectIndex(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-emerald-300 font-bold"
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">
                    Answer Rationale / SOP Citation
                  </label>
                  <input
                    type="text"
                    value={pktExplanation}
                    onChange={(e) => setPktExplanation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowAddUpdateModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Update → Add to Project Knowledge & Add Question to PKT Bank</span>
            </button>
          </div>
        </form>
      )}

      {/* =====================================================================
          SECTION 4: MASTER UPDATE TRACKER LOG & LIVE KNOWLEDGE + PKT QUESTION INSPECTOR
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Update Tracker Log Table */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-emerald-400" />
                Project Update Tracker Log ({scopedUpdates.length} Updates)
              </h3>
              <p className="text-xs text-slate-400">
                Every update logged here is live in the Project Knowledge Library and linked to a PKT Question Bank item
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-950/60">
                  <th className="py-3 px-4">Update Code & Title</th>
                  <th className="py-3 px-4">Project & Tower</th>
                  <th className="py-3 px-4">Synced Artifacts</th>
                  <th className="py-3 px-4 text-right">Read Ack</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {scopedUpdates.map((upd) => {
                  const isSelected = selectedUpdatePreview?.id === upd.id;
                  return (
                    <tr
                      key={upd.id}
                      onClick={() => setSelectedUpdatePreview(upd)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-600/15' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                            {upd.updateCode}
                          </span>
                          <span className="text-[11px] text-slate-400">{upd.effectiveDate}</span>
                        </div>
                        <div className="font-bold text-white mt-1 leading-snug">{upd.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{upd.payerOrSource}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{upd.projectName}</div>
                        <div className="text-[11px] text-indigo-300">
                          {upd.tower} • {upd.specialty}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 space-y-1">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30 text-[10px] font-semibold">
                          ✓ Knowledge: {upd.linkedKnowledgeDocCode}
                        </div>
                        <div className="block">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold">
                            ✓ PKT Q-Bank: {upd.linkedPktQuestionId}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums">
                        <div className="font-bold text-emerald-400">{upd.readAckPct}%</div>
                        <div className="text-[10px] text-slate-500">Team Signed</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 5 Cols: Dual Inspector (Knowledge Card + Linked PKT Question Bank Item) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          {selectedUpdatePreview ? (
            <>
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold">
                    {selectedUpdatePreview.updateCode}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Published by {selectedUpdatePreview.publishedBy}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-2 leading-snug">
                  {selectedUpdatePreview.title}
                </h3>
                <p className="text-xs text-indigo-300 mt-0.5">
                  {selectedUpdatePreview.projectName} • {selectedUpdatePreview.tower} (
                  {selectedUpdatePreview.specialty})
                </p>
              </div>

              {/* Synced Artifact #1: Project Knowledge Library Entry */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-sky-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-300 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>1. Synced Project Knowledge Library Card</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Doc: {selectedUpdatePreview.linkedKnowledgeDocCode}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{selectedUpdatePreview.summary}</p>
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] font-semibold text-slate-200">
                    Operational Action Steps:
                  </div>
                  <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                    {selectedUpdatePreview.operationalSteps.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedUpdatePreview.relatedCodes.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Synced Artifact #2: Project Question Bank Entry for PKT */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    <span>2. Synced Project Question Bank Item (PKT)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                    {selectedUpdatePreview.linkedPktQuestionId}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-medium">
                  Q: {selectedUpdatePreview.pktQuestionPreview}
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Active in <strong>{selectedUpdatePreview.projectName}</strong> Question Bank & Weekly Process Updates Exam
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-xs text-slate-400">
              Select any Process Update row on the left to inspect its Project Knowledge Card and paired PKT Question.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. TRAINING MODULES PAGE (NHT - BILLING, NHT - AR, NHT - CODING, REFRESHER TRAINING MODULE)
// ============================================================================

interface TrainingModulesCatalogPageProps {
  projects: ProjectHealth[];
  associates: AssociateProfile[];
  learningModules: ContinuousLearningModule[];
  setLearningModules: React.Dispatch<React.SetStateAction<ContinuousLearningModule[]>>;
  onLaunchModuleQuiz: (mod: ContinuousLearningModule) => void;
  onOpenCsTrainingHub?: () => void;
  triggerToast: (msg: string) => void;
}

export const TrainingModulesCatalogPage: React.FC<TrainingModulesCatalogPageProps> = ({
  projects,
  associates,
  onOpenCsTrainingHub,
  triggerToast,
}) => {
  const [tracks, setTracks] = useState<CoreTrainingTrack[]>(INITIAL_CORE_TRAINING_TRACKS);
  const [selectedTrackId, setSelectedTrackId] = useState<CoreTrainingTrack['id']>('NHT-BILLING');
  const [showAddUnitForm, setShowAddUnitForm] = useState<boolean>(false);

  // Customizable Unit Blueprint Builder State ("we can design the course module structure later")
  const [newUnitPhase, setNewUnitPhase] = useState<string>(
    'Phase 5 (Custom Extension): Client-Specific EHR & Specialty Lab'
  );
  const [newUnitTitle, setNewUnitTitle] = useState<string>('');
  const [newUnitMode, setNewUnitMode] = useState<TrainingTrackUnitBlueprint['deliveryMode']>(
    'Instructor-Led (ILT)'
  );
  const [newUnitHours, setNewUnitHours] = useState<number>(8);
  const [newUnitTopics, setNewUnitTopics] = useState<string>(
    'Custom Payer Rules, Live Queue Shadowing, QA Calibration Checklist'
  );

  // Batch / Associate Assignment State
  const [assignProjectId, setAssignProjectId] = useState<string>(projects[0]?.id || 'PRJ-CARD-01');
  const [assignBatchName, setAssignBatchName] = useState<string>('BATCH-43 (Nov 2026 Cohort)');

  const activeTrack = useMemo(
    () => tracks.find((t) => t.id === selectedTrackId) || tracks[0],
    [tracks, selectedTrackId]
  );

  const handleAddCustomUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitTitle.trim()) {
      triggerToast('Please enter a Unit / Module Title.');
      return;
    }

    const unitCode = `${activeTrack.id.split('-')[0]}-CUST-${Math.floor(500 + Math.random() * 400)}`;
    const newUnit: TrainingTrackUnitBlueprint = {
      unitCode,
      phaseLabel: newUnitPhase.trim() || 'Custom Syllabus Phase',
      title: newUnitTitle.trim(),
      deliveryMode: newUnitMode,
      durationHours: newUnitHours,
      topics: newUnitTopics
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      status: 'Structure Customizable (Draft)',
    };

    setTracks((prev) =>
      prev.map((t) =>
        t.id === activeTrack.id
          ? {
              ...t,
              totalHours: t.totalHours + newUnitHours,
              units: [...t.units, newUnit],
            }
          : t
      )
    );

    setShowAddUnitForm(false);
    setNewUnitTitle('');
    triggerToast(
      `Added custom unit "${newUnit.title}" (${unitCode}) to "${activeTrack.shortName}" syllabus blueprint!`
    );
  };

  const handleAssignTrackToBatch = () => {
    const proj = projects.find((p) => p.id === assignProjectId) || projects[0];
    setTracks((prev) =>
      prev.map((t) =>
        t.id === activeTrack.id
          ? {
              ...t,
              activeBatchesCount: t.activeBatchesCount + 1,
              enrolledAssociatesCount: t.enrolledAssociatesCount + 12,
            }
          : t
      )
    );
    triggerToast(
      `Assigned "${activeTrack.shortName}" track to ${assignBatchName} for ${proj.projectName} (Trainer: ${activeTrack.leadTrainer}).`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              RCM Training Modules Hub — NHT Billing, NHT AR, NHT Coding & Refresher Training
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Core New Hire Training (NHT) & Refresher Training tracks with modular syllabus blueprints ready for custom course structure design
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenCsTrainingHub && (
            <button
              onClick={onOpenCsTrainingHub}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Open AR CS Training & QCP Command Center →</span>
            </button>
          )}
          <button
            onClick={() => setShowAddUnitForm((prev) => !prev)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>
              {showAddUnitForm
                ? 'Close Structure Designer'
                : `+ Customize "${activeTrack.shortName}" Structure`}
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          5 CORE TRAINING MODULE CARDS (NHT - BILLING, NHT - AR, NHT - CODING, AR - CS TRAINING, REFRESHER)
         ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {tracks.map((track) => {
          const isSelected = track.id === activeTrack.id;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => setSelectedTrackId(track.id)}
              className={`text-left rounded-2xl p-5 border transition-all flex flex-col justify-between gap-4 ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/15 ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold text-white bg-gradient-to-r ${track.badgeColor}`}
                  >
                    {track.shortName}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {track.totalDurationDays}d / {track.totalHours}h
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">{track.fullTitle}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2">{track.overview}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2 w-full">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Pass Gate SLA:</span>
                  <span className="font-bold text-emerald-400 tabular-nums">
                    &ge; {track.passGatePct}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Active Batches / Trainees:</span>
                  <span className="font-semibold text-white tabular-nums">
                    {track.activeBatchesCount} Batches ({track.enrolledAssociatesCount} Users)
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Syllabus Units:</span>
                  <span className="font-semibold text-indigo-300">
                    {track.units.length} Modular Units →
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          CUSTOM COURSE MODULE STRUCTURE DESIGNER FORM
         ===================================================================== */}
      {showAddUnitForm && (
        <form
          onSubmit={handleAddCustomUnit}
          className="bg-slate-900 border border-indigo-500/50 rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                Course Module Structure Designer — Add Custom Unit to "{activeTrack.shortName}"
              </h3>
              <p className="text-xs text-slate-400">
                Add or tailor phases, EHR sandbox labs, or specialty coding units as you finalize the course structure
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Phase / Week Label</label>
              <input
                type="text"
                value={newUnitPhase}
                onChange={(e) => setNewUnitPhase(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Module Unit Title *</label>
              <input
                type="text"
                required
                value={newUnitTitle}
                onChange={(e) => setNewUnitTitle(e.target.value)}
                placeholder="e.g., Epic Resolute PB Denial Workqueue Lab"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Delivery Format</label>
              <select
                value={newUnitMode}
                onChange={(e) =>
                  setNewUnitMode(e.target.value as TrainingTrackUnitBlueprint['deliveryMode'])
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              >
                <option value="Instructor-Led (ILT)">Instructor-Led (ILT)</option>
                <option value="EHR Sandbox Lab">EHR Sandbox Lab</option>
                <option value="Self-Paced Micro-Learning">Self-Paced Micro-Learning</option>
                <option value="QA Calibration & Mock Audit">QA Calibration & Mock Audit</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Duration (Hours)</label>
              <input
                type="number"
                min={1}
                value={newUnitHours}
                onChange={(e) => setNewUnitHours(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white tabular-nums"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end gap-3 text-xs">
            <div className="flex-1 w-full">
              <label className="block text-slate-300 font-medium mb-1">
                Key Topics / Lesson Placeholders (comma-separated)
              </label>
              <input
                type="text"
                value={newUnitTopics}
                onChange={(e) => setNewUnitTopics(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shrink-0"
            >
              Add Unit to {activeTrack.shortName}
            </button>
          </div>
        </form>
      )}

      {/* =====================================================================
          SELECTED TRAINING TRACK DETAIL & MODULAR CURRICULUM BLUEPRINT
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Phase-by-Phase Curriculum Blueprint */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold text-white bg-gradient-to-r ${activeTrack.badgeColor}`}
                >
                  {activeTrack.shortName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                  Modular Course Structure (Customizable)
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-2">{activeTrack.fullTitle}</h3>
              <p className="text-xs text-slate-400 mt-1">{activeTrack.overview}</p>
            </div>
          </div>

          {/* Syllabus Units List */}
          <div className="space-y-3">
            {activeTrack.units.map((u, idx) => (
              <div
                key={u.unitCode}
                className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-indigo-300">{u.phaseLabel}</span>
                    <span className="text-[11px] font-mono text-slate-500">({u.unitCode})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-sky-300">
                      {u.deliveryMode}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                      {u.durationHours} hrs
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        u.status === 'Core Blueprint Ready'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {u.status}
                    </span>
                  </div>
                </div>

                <div className="text-sm font-bold text-white">{u.title}</div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300 pt-1">
                  {u.topics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-indigo-400 mt-0.5">•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Right 4 Cols: Track Governance Metadata & Batch Enrollment Widget */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Track Governance & Certification Gate</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Total Duration</div>
                <div className="text-base font-bold text-white mt-0.5 tabular-nums">
                  {activeTrack.totalDurationDays} Days ({activeTrack.totalHours}h)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Certification Pass Gate</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5 tabular-nums">
                  &ge; {activeTrack.passGatePct}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Lead Process Trainer</div>
                <div className="font-semibold text-indigo-300 mt-0.5">{activeTrack.leadTrainer}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Enrolled Trainees</div>
                <div className="font-semibold text-white mt-0.5 tabular-nums">
                  {activeTrack.enrolledAssociatesCount} across {activeTrack.activeBatchesCount} Batches
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-slate-400 font-medium">Target Audience:</div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
                {activeTrack.targetAudience}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-slate-400 font-medium">Mapped RCM Towers:</div>
              <div className="flex flex-wrap gap-1.5">
                {activeTrack.primaryTowers.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[11px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 space-y-1">
              <div className="font-bold text-[11px] uppercase tracking-wider text-emerald-300">
                Graduation & Nesting Clearance Outcome
              </div>
              <div>{activeTrack.certificationOutcome}</div>
            </div>
          </div>

          {/* Assign Track to New Batch / Project */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3.5 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              <span>Schedule "{activeTrack.shortName}" for Batch / Project</span>
            </h3>

            <div>
              <label className="block text-slate-300 mb-1">Select Target Project</label>
              <select
                value={assignProjectId}
                onChange={(e) => setAssignProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectName} ({p.specialty})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Training Batch Code / Cohort Name</label>
              <input
                type="text"
                value={assignBatchName}
                onChange={(e) => setAssignBatchName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <button
              type="button"
              onClick={handleAssignTrackToBatch}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md transition-all"
            >
              Assign {activeTrack.shortName} to Batch
            </button>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              Currently tracking <strong>{associates.length} active roster associates</strong> across NHT & Refresher batches.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
