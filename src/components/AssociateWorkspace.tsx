import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  BookMarked,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Compass,
  FileCheck2,
  FileText,
  Flame,
  GraduationCap,
  Layers,
  Map,
  Monitor,
  Play,
  Scale,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  AssociateProfile,
  AuditDefectRecord,
  ContinuousLearningModule,
  MandatoryComplianceCourse,
  ProviderSpecialty,
  RcmTower,
  SopPlaybookItem,
} from '../types/rcm';

interface KnowledgeLibraryResource {
  id: string;
  code: string;
  title: string;
  pillar:
    | 'Specialty Training Knowledge'
    | 'SOP'
    | 'Process Update Tracker'
    | 'Client Playbook'
    | 'Navigation Manual';
  specialty: ProviderSpecialty | 'All Specialties';
  tower: RcmTower | 'All Towers';
  systemOrPayer: string;
  updatedAt: string;
  version: string;
  acknowledged: boolean;
  summary: string;
  sections: { heading: string; bullets: string[] }[];
  quickCodes: string[];
}

const EXTRA_LIBRARY_ITEMS: KnowledgeLibraryResource[] = [
  // 1. Specialty Training Knowledge
  {
    id: 'SPEC-ORTHO-01',
    code: 'SPEC-OR-101',
    title: 'Orthopedics & Sports Medicine: Knee/Shoulder Arthroscopy, Fracture Care & Spine RCM Guide',
    pillar: 'Specialty Training Knowledge',
    specialty: 'Orthopedics & Sports Med',
    tower: 'Denials Management',
    systemOrPayer: 'AAOS / AMA CPT & NCCI Ortho Rules',
    updatedAt: '2026-11-02',
    version: 'v4.2',
    acknowledged: true,
    summary:
      'Comprehensive clinical-to-billing training covering compartmental knee arthroscopy (29870–29889), global surgical periods (0/10/90-day), fracture care modifiers (-54, -55, -57), and spinal instrumentation.',
    sections: [
      {
        heading: '3-Compartment Knee Anatomy & NCCI Bundling Rules',
        bullets: [
          'Medial, Lateral, and Patellofemoral compartments: CPT 29880 (medial AND lateral meniscectomy) vs CPT 29881 (medial OR lateral).',
          'Chondroplasty (29877) is bundled into meniscectomy (29880/29881) in the same compartment; use G0289 for Medicare when performed in a different compartment.',
        ],
      },
      {
        heading: 'Global Surgery Modifiers (-24, -25, -57, -58, -78, -79)',
        bullets: [
          'Use Modifier -25 on E/M for same-day minor procedures (0 or 10-day global, e.g., 20610 Major Joint Injection).',
          'Use Modifier -57 on E/M when the decision for major surgery (90-day global, e.g., Total Knee Arthroplasty 27447) is made the day of or day before surgery.',
        ],
      },
    ],
    quickCodes: ['CPT 29880', 'CPT 29881', 'CPT 20610', 'CPT 27447', 'Mod -57', 'Mod -79'],
  },
  {
    id: 'SPEC-CARD-02',
    code: 'SPEC-CV-104',
    title: 'Cardiology & Vascular: Coronary Cath Lab, PCI Stents, EP Ablation & Echo Component Billing',
    pillar: 'Specialty Training Knowledge',
    specialty: 'Cardiology & Vascular',
    tower: 'Medical Coding',
    systemOrPayer: 'ACC / Medicare Part B Cardiology LCD',
    updatedAt: '2026-10-29',
    version: 'v3.8',
    acknowledged: true,
    summary:
      'Specialty domain training on major coronary arteries (LM, LAD, LCX, RCA, Ramus), diagnostic heart cath (93451–93461), percutaneous coronary intervention (92920–92944), and Echo supervision.',
    sections: [
      {
        heading: 'Coronary Vessel Modifiers (LD, LC, RC, LM, RI)',
        bullets: [
          'Always append anatomical coronary modifiers: -LD (Left Anterior Descending), -LC (Left Circumflex), -RC (Right Coronary Artery), -LM (Left Main), -RI (Ramus Intermedius).',
          'Up to two coronary branches (diagonal, marginal, posterolateral) may be billed per major vessel family using add-on codes.',
        ],
      },
      {
        heading: 'Diagnostic Cath + PCI Same-Session Rules',
        bullets: [
          'Diagnostic angiography is bundled into same-session PCI unless there was no prior angiogram within 30 days or the patient’s clinical status changed (append Modifier -59 / XU).',
        ],
      },
    ],
    quickCodes: ['CPT 93458', 'CPT 92928', 'CPT 93306-26', 'Mod -LD', 'Mod -RC', 'Mod -XU'],
  },
  {
    id: 'SPEC-BEH-03',
    code: 'SPEC-BH-108',
    title: 'Behavioral Health: Time-Based Psychotherapy (90832/34/37), Interactive Complexity & Telehealth',
    pillar: 'Specialty Training Knowledge',
    specialty: 'Behavioral Health',
    tower: 'Accounts Receivable (AR)',
    systemOrPayer: 'APA / Optum & BCBS Behavioral Health',
    updatedAt: '2026-11-04',
    version: 'v2.5',
    acknowledged: false,
    summary:
      'Specialty knowledge guide for psychiatric diagnostic evaluations (90791/90792), exact start/stop time documentation for psychotherapy, and crisis codes (90839/+90840).',
    sections: [
      {
        heading: 'Psychotherapy Time Thresholds (Exact Minutes Required in Note)',
        bullets: [
          '90832 (30 mins): 16 to 37 minutes of face-to-face psychotherapy.',
          '90834 (45 mins): 38 to 52 minutes of face-to-face psychotherapy.',
          '90837 (60 mins): 53+ minutes (requires medical necessity documentation for extended duration on Optum/UHC).',
        ],
      },
    ],
    quickCodes: ['CPT 90791', 'CPT 90834', 'CPT 90837', '+90833', 'POS 10', 'Mod -95'],
  },
  // 5. Navigation Manuals (EHR / PMS / Clearinghouse / Portals)
  {
    id: 'NAV-ATHENA-01',
    code: 'NAV-ATH-01',
    title: 'Athenahealth Collector & Evicore Portal Navigation Manual (Ortho AR & Denials)',
    pillar: 'Navigation Manual',
    specialty: 'Orthopedics & Sports Med',
    tower: 'Denials Management',
    systemOrPayer: 'Athenahealth Collector + Evicore / Availity',
    updatedAt: '2026-11-01',
    version: 'v5.0',
    acknowledged: true,
    summary:
      'Step-by-step screen navigation, shortcut keys, claim note stamping, and clearinghouse 277CA / 835 ERA lookup inside Athenahealth Collector and Evicore.',
    sections: [
      {
        heading: '1. Locating 835 ERA CARC/RARC & 277CA Proof of Timely Filing in Athena',
        bullets: [
          'Open Claim Action View → Click [Claim History / Remittance] tab → Expand the 835 ERA line to inspect exact CARC (e.g., CO-197) and RARC (e.g., M62) codes.',
          'For CO-29 Timely Filing disputes: Go to [Claim Submission Log] → Click [View Clearinghouse 277CA] → Export PDF showing Status A1/A2 and Payer Claim Control Number (PCCN).',
        ],
      },
      {
        heading: '2. Evicore Prior Auth Retro-Update & Attachment Upload Path',
        bullets: [
          'Launch Evicore Portal → Select [Clinical Certification / Lookup by Member ID & Rendering NPI] → Set Date Range +-30 days from DOS.',
          'Click [Request Procedure Code Update] → Upload signed Operative Report PDF → Copy the 10-digit Evicore Case Reference # into Athena Claim Note & Loop 2300 REF*G1.',
        ],
      },
    ],
    quickCodes: ['Athena Collector', '277CA POTF', 'Loop 2300 REF*G1', 'Evicore Case#'],
  },
  {
    id: 'NAV-EPIC-02',
    code: 'NAV-EPC-02',
    title: 'Epic Resolute PB/HB Workqueue (WQ) & Claim Edit Navigation Manual',
    pillar: 'Navigation Manual',
    specialty: 'Cardiology & Vascular',
    tower: 'Accounts Receivable (AR)',
    systemOrPayer: 'Epic Resolute Professional & Hospital Billing',
    updatedAt: '2026-10-24',
    version: 'v6.1',
    acknowledged: true,
    summary:
      'Complete keystroke and Hyperspace navigation guide for working Follow-Up Workqueues (F/U WQs), Charge Review edits, NCCI warnings, and appeal letter generation in Epic Resolute.',
    sections: [
      {
        heading: '1. Hyperspace Follow-Up Workqueue (F/U WQ) Workflow',
        bullets: [
          'Navigate to [Epic Button > Revenue Cycle > Follow-Up Workqueues] → Filter by Payer Bucket and Aging > 45 Days.',
          'Double-click Hospital Account (HAR) or PB Tx Inquiry → Use SmartText `.RCMAPPEAL` or `.RCMSOAP` to populate standardized QA-compliant notes.',
        ],
      },
      {
        heading: '2. Rebilling Corrected Claims (Frequency Code 7)',
        bullets: [
          'In Claim Edit Activity → Set Claim Frequency Code = `7 (Replacement of Prior Claim)` → Enter Original Payer Claim Control Number (ICN/DCN) in the Original Ref # field before clicking [Accept & Resubmit].',
        ],
      },
    ],
    quickCodes: ['Epic Resolute', 'SmartText .RCMSOAP', 'Freq Code 7', 'ICN/DCN'],
  },
  {
    id: 'NAV-ECW-03',
    code: 'NAV-ECW-03',
    title: 'eClinicalWorks (eCW v12) & Availity Eligibility / COB Navigation Manual',
    pillar: 'Navigation Manual',
    specialty: 'Multispecialty Primary Care',
    tower: 'Demographics & Charge Entry',
    systemOrPayer: 'eClinicalWorks v12 & Availity Essentials',
    updatedAt: '2026-10-30',
    version: 'v3.3',
    acknowledged: true,
    summary:
      'Navigation walkthrough for real-time 270/271 eligibility verification, BCBS 3-character alpha prefix entry, and Primary/Secondary COB sequencing in eCW v12.',
    sections: [
      {
        heading: '1. Verifying Subscriber Prefix & Dependent COB Order in eCW',
        bullets: [
          'Open [Patient Hub > Insurance Tab] → Run real-time [270/271 Eligibility Check] → Confirm active coverage on Date of Service.',
          'For BCBS plans, enter the 3-character Alpha Prefix + Subscriber ID without spaces or hyphens. Verify Parent DOBs for pediatric dependents under the Birthday Rule.',
        ],
      },
    ],
    quickCodes: ['eCW v12', '270/271 Eligibility', 'BCBS Alpha Prefix', 'COB Order'],
  },
];

interface AssociateWorkspaceProps {
  associates: AssociateProfile[];
  defects: AuditDefectRecord[];
  setDefects: React.Dispatch<React.SetStateAction<AuditDefectRecord[]>>;
  learningModules: ContinuousLearningModule[];
  complianceCourses: MandatoryComplianceCourse[];
  sops: SopPlaybookItem[];
  onAcknowledgeSop: (sopId: string) => void;
  onLaunchModuleQuiz: (mod: ContinuousLearningModule) => void;
  onLaunchComplianceQuiz: (course: MandatoryComplianceCourse) => void;
  onViewCertificate: (course: MandatoryComplianceCourse) => void;
  triggerToast: (msg: string) => void;
}

export const AssociateWorkspace: React.FC<AssociateWorkspaceProps> = ({
  associates,
  defects,
  setDefects,
  learningModules,
  complianceCourses,
  sops,
  onAcknowledgeSop,
  onLaunchModuleQuiz,
  onLaunchComplianceQuiz,
  onViewCertificate,
  triggerToast,
}) => {
  const [activeAssocId, setActiveAssocId] = useState<string>(associates[0]?.id || 'ASSOC-101');
  const [subView, setSubView] = useState<
    'scorecard_trends' | 'errors_rebuttals' | 'courses_assessments' | 'knowledge_library'
  >('scorecard_trends');

  // Trend Metric Switcher
  const [trendMetric, setTrendMetric] = useState<
    'compositeScore' | 'productionPct' | 'qualityPct' | 'pktScore' | 'tmsAdherencePct'
  >('compositeScore');

  // Rebuttal State
  const [rebuttalFilter, setRebuttalFilter] = useState<string>('ALL');
  const [rebuttalInput, setRebuttalInput] = useState<Record<string, string>>({});

  // Knowledge Library State
  const [libraryPillar, setLibraryPillar] = useState<string>('ALL');
  const [onlyMyProjectScope, setOnlyMyProjectScope] = useState<boolean>(false);
  const [libSearch, setLibSearch] = useState<string>('');
  const [localAckIds, setLocalAckIds] = useState<string[]>([]);

  const currentAssoc = useMemo(
    () => associates.find((a) => a.id === activeAssocId) || associates[0],
    [associates, activeAssocId]
  );

  const myDefects = useMemo(
    () => defects.filter((d) => d.associateId === currentAssoc.id),
    [defects, currentAssoc.id]
  );

  // Weekly Daily Pulse Data (Simulated Mon-Fri for current associate)
  const weeklyPulse = useMemo(() => {
    const baseTarget = currentAssoc.dailyTarget;
    const baseAct = currentAssoc.dailyActual;
    const baseQa = currentAssoc.qualityActualPct;
    return [
      {
        day: 'Mon (11/02)',
        claims: Math.max(10, baseAct - 2),
        target: baseTarget,
        qaPct: Number(Math.min(100, baseQa + 0.8).toFixed(1)),
        errors: currentAssoc.criticalErrors > 0 ? 1 : 0,
        defectType: 'CO-197 Auth Ref Missing',
      },
      {
        day: 'Tue (11/03)',
        claims: baseAct + 1,
        target: baseTarget,
        qaPct: Number(Math.min(100, baseQa + 1.2).toFixed(1)),
        errors: 0,
        defectType: 'Zero Defects',
      },
      {
        day: 'Wed (11/04)',
        claims: Math.max(10, baseAct - 1),
        target: baseTarget,
        qaPct: Number(Math.max(75, baseQa - 1.4).toFixed(1)),
        errors: 1,
        defectType: currentAssoc.topDefectCategory.split(' ').slice(0, 4).join(' '),
      },
      {
        day: 'Thu (11/05)',
        claims: baseAct,
        target: baseTarget,
        qaPct: baseQa,
        errors: myDefects.length > 1 ? 1 : 0,
        defectType: myDefects[0]?.errorCode || 'CO-50 Appeal Level',
      },
      {
        day: 'Fri (11/06)',
        claims: baseAct + 2,
        target: baseTarget,
        qaPct: Number(Math.min(100, baseQa + 0.5).toFixed(1)),
        errors: 0,
        defectType: 'Zero Defects',
      },
    ];
  }, [currentAssoc, myDefects]);

  // Unified Project Knowledge Library combining SOPs/Playbooks/Updates + Specialty Knowledge + Navigation Manuals
  const unifiedLibrary: KnowledgeLibraryResource[] = useMemo(() => {
    const fromSops: KnowledgeLibraryResource[] = sops.map((s) => ({
      id: s.id,
      code: s.docCode,
      title: s.title,
      pillar:
        s.docType === 'Process Update Flash'
          ? 'Process Update Tracker'
          : s.docType === 'Client Playbook'
          ? 'Client Playbook'
          : 'SOP',
      specialty: s.specialty,
      tower: s.tower,
      systemOrPayer: s.payerFocus,
      updatedAt: s.updatedAt,
      version: s.version,
      acknowledged: s.acknowledgedByCurrentUser || localAckIds.includes(s.id),
      summary: s.summary,
      sections: [
        { heading: 'Standard Operating Step-by-Step Workflow', bullets: s.stepByStepGuide },
        { heading: 'Common QA Audit Pitfalls to Avoid', bullets: s.commonPitfalls },
      ],
      quickCodes: s.relatedCarcRarcCodes,
    }));

    const extraWithAck = EXTRA_LIBRARY_ITEMS.map((item) => ({
      ...item,
      acknowledged: item.acknowledged || localAckIds.includes(item.id),
    }));

    return [...fromSops, ...extraWithAck];
  }, [sops, localAckIds]);

  const filteredLibrary = useMemo(() => {
    return unifiedLibrary.filter((item) => {
      const matchPillar = libraryPillar === 'ALL' || item.pillar === libraryPillar;
      const matchScope =
        !onlyMyProjectScope ||
        item.specialty === 'All Specialties' ||
        item.specialty === currentAssoc.specialty;
      const matchSearch =
        !libSearch.trim() ||
        item.title.toLowerCase().includes(libSearch.toLowerCase()) ||
        item.code.toLowerCase().includes(libSearch.toLowerCase()) ||
        item.systemOrPayer.toLowerCase().includes(libSearch.toLowerCase()) ||
        item.quickCodes.some((c) => c.toLowerCase().includes(libSearch.toLowerCase()));
      return matchPillar && matchScope && matchSearch;
    });
  }, [unifiedLibrary, libraryPillar, onlyMyProjectScope, currentAssoc.specialty, libSearch]);

  const [selectedLibItem, setSelectedLibItem] = useState<KnowledgeLibraryResource>(
    unifiedLibrary[0]
  );

  const handleSubmitAssociateRebuttal = (defectId: string) => {
    const reason = rebuttalInput[defectId]?.trim();
    if (!reason) {
      triggerToast('Please enter your SOP / Playbook / Clinical evidence before submitting.');
      return;
    }
    setDefects((prev) =>
      prev.map((d) =>
        d.id === defectId
          ? {
              ...d,
              rebuttalStatus: 'Rebuttal Pending',
              associateRebuttalReason: reason,
            }
          : d
      )
    );
    triggerToast(`Rebuttal submitted for ${defectId}! Sent to QA Lead for review.`);
  };

  return (
    <div className="space-y-6">
      {/* Personal Associate Banner & Switcher */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-base font-extrabold text-white shadow-lg">
            {currentAssoc.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-white">{currentAssoc.name}</h2>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs">
                {currentAssoc.empId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                {currentAssoc.governanceStage}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {currentAssoc.roleTitle} • Project: <strong className="text-white">{currentAssoc.projectName}</strong> • Tower:{' '}
              <span className="text-indigo-300 font-medium">{currentAssoc.tower}</span> ({currentAssoc.specialty})
            </p>
          </div>
        </div>

        {/* Preview Any Associate Switcher + Sub-View Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-slate-400">Preview Associate:</label>
          <select
            value={activeAssocId}
            onChange={(e) => setActiveAssocId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-medium"
          >
            {associates.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.empId} — {a.specialty})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Associate 4-Pillar Sub-Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            id: 'scorecard_trends',
            title: '1. My Performance Trends & Monthly Scorecard',
            sub: `Composite: ${currentAssoc.compositeScore}% • Prod: ${currentAssoc.productionSlaPct}% • QA: ${currentAssoc.qualityActualPct}%`,
            icon: Target,
          },
          {
            id: 'errors_rebuttals',
            title: '2. Weekly Error Trends & Rebuttal Tracker',
            sub: `${myDefects.length} Audited Claims • ${
              myDefects.filter((d) => d.rebuttalStatus === 'Rebuttal Pending').length
            } Pending Rebuttals`,
            icon: Scale,
          },
          {
            id: 'courses_assessments',
            title: '3. Assigned Courses, PKTs & Compliance',
            sub: `${currentAssoc.assignedWeeklyModules.length} Assigned Modules • PKT: ${currentAssoc.pktScore}%`,
            icon: GraduationCap,
          },
          {
            id: 'knowledge_library',
            title: '4. Project Knowledge Library & Nav Manuals',
            sub: `Specialty Training, SOPs, Updates, Playbooks & EHR Manuals`,
            icon: BookMarked,
          },
        ].map((item) => {
          const Icon = item.icon;
          const active = subView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSubView(item.id as typeof subView)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                active
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Icon className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{item.title}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{item.sub}</div>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          1. MY PERFORMANCE TRENDS & MONTHLY SCORECARD
         ===================================================================== */}
      {subView === 'scorecard_trends' && (
        <div className="space-y-6">
          {/* Monthly Scorecard 5-Card Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-slate-900/90 border border-indigo-500/40 rounded-xl p-4">
              <div className="text-xs text-slate-400">Monthly Composite Scorecard</div>
              <div className="text-2xl font-extrabold text-white tabular-nums mt-1">
                {currentAssoc.compositeScore}%
              </div>
              <div className="text-[11px] text-indigo-300 mt-1">
                Stage: {currentAssoc.governanceStage}
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400">Quality SLA (40% Weight)</div>
              <div
                className={`text-2xl font-bold tabular-nums mt-1 ${
                  currentAssoc.qualityActualPct >= currentAssoc.qualityTargetPct
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >
                {currentAssoc.qualityActualPct}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Target: {currentAssoc.qualityTargetPct}% ({currentAssoc.auditsSampled} claims audited)
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400">Production SLA (35% Weight)</div>
              <div className="text-2xl font-bold text-sky-400 tabular-nums mt-1">
                {currentAssoc.productionSlaPct}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Daily Avg: {currentAssoc.dailyActual} / {currentAssoc.dailyTarget} claims
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400">Process Knowledge PKT (15%)</div>
              <div className="text-2xl font-bold text-indigo-300 tabular-nums mt-1">
                {currentAssoc.pktScore}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Monthly Standardized Assessment
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400">TMS Adherence (10% Weight)</div>
              <div className="text-2xl font-bold text-purple-300 tabular-nums mt-1">
                {currentAssoc.tmsUtilizationPct}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {currentAssoc.tmsBillableHours}h / {currentAssoc.tmsTargetHours}h • AHT {currentAssoc.ahtMinutes}m
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 6-Month Performance Trend Chart & Table (7 Cols) */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    My 6-Month Scorecard & SLA Performance Trajectory (Jun – Nov 2026)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Switch metrics to inspect your monthly progression across all 4 RCM pillars
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                  {(
                    [
                      { id: 'compositeScore', label: 'Composite' },
                      { id: 'qualityPct', label: 'Quality %' },
                      { id: 'productionPct', label: 'Production %' },
                      { id: 'pktScore', label: 'PKT %' },
                      { id: 'tmsAdherencePct', label: 'TMS %' },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setTrendMetric(m.id)}
                      className={`px-2.5 py-1 rounded-lg font-semibold ${
                        trendMetric === m.id
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Bar Chart */}
              <div className="grid grid-cols-6 gap-3 items-end h-40 bg-slate-950/90 p-4 rounded-xl border border-slate-800">
                {currentAssoc.history.map((h) => {
                  const val = h[trendMetric];
                  const barHeight = Math.max(20, Math.min(100, (val - 60) * 2.3));
                  return (
                    <div key={h.month} className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="text-xs font-bold text-white tabular-nums">{val}%</div>
                      <div className="w-full bg-slate-800 rounded-t-lg h-24 flex items-end overflow-hidden">
                        <div
                          className="w-full bg-gradient-to-t from-indigo-600 to-sky-400 rounded-t-lg transition-all"
                          style={{ height: `${barHeight}%` }}
                        />
                      </div>
                      <div className="text-[11px] font-semibold text-slate-300">{h.month} '26</div>
                    </div>
                  );
                })}
              </div>

              {/* Monthly Scorecard Breakdown Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs tabular-nums">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-950/60">
                      <th className="py-2.5 px-3">Month</th>
                      <th className="py-2.5 px-3 text-right">Production (35%)</th>
                      <th className="py-2.5 px-3 text-right">Quality (40%)</th>
                      <th className="py-2.5 px-3 text-right">PKT (15%)</th>
                      <th className="py-2.5 px-3 text-right">TMS (10%)</th>
                      <th className="py-2.5 px-3 text-right">Composite Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {currentAssoc.history.map((h) => (
                      <tr key={h.month} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 font-bold text-white">{h.month} 2026</td>
                        <td className="py-2.5 px-3 text-right text-sky-300">{h.productionPct}%</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400 font-semibold">
                          {h.qualityPct}%
                        </td>
                        <td className="py-2.5 px-3 text-right text-indigo-300">{h.pktScore}%</td>
                        <td className="py-2.5 px-3 text-right text-purple-300">
                          {h.tmsAdherencePct}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-extrabold text-white">
                          {h.compositeScore}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Current Week Daily Production & Quality Pulse (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  This Week’s Daily Production, Quality & Defect Pulse
                </h3>
                <p className="text-xs text-slate-400">
                  Daily synced data from PMS Billing Queue, QMS Audits & TMS Timekeeping
                </p>
              </div>

              <div className="space-y-2.5">
                {weeklyPulse.map((d) => (
                  <div
                    key={d.day}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{d.day}</div>
                      <div className="text-[11px] text-slate-400">
                        Defect Log:{' '}
                        <span
                          className={
                            d.errors === 0 ? 'text-emerald-400 font-medium' : 'text-amber-300 font-medium'
                          }
                        >
                          {d.defectType}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 tabular-nums text-right">
                      <div>
                        <div className="font-bold text-sky-300">
                          {d.claims}/{d.target}
                        </div>
                        <div className="text-[10px] text-slate-500">Claims</div>
                      </div>
                      <div>
                        <div
                          className={`font-bold ${
                            d.qaPct >= currentAssoc.qualityTargetPct
                              ? 'text-emerald-400'
                              : 'text-amber-300'
                          }`}
                        >
                          {d.qaPct}%
                        </div>
                        <div className="text-[10px] text-slate-500">Quality</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. WEEKLY ERROR TRENDS & TWO-WAY REBUTTAL TRACKER
         ===================================================================== */}
      {subView === 'errors_rebuttals' && (
        <div className="space-y-6">
          {/* Weekly Error Trends Breakdown */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  My Error Trends of the Week & Root-Cause Breakdown
                </h3>
                <p className="text-xs text-slate-400">
                  Primary focus area: <strong className="text-amber-300">{currentAssoc.topDefectCategory}</strong>
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                {myDefects.length} Claim Audits Logged This Cycle
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-slate-400">Top CARC / Coding Defect Pattern</div>
                <div className="text-sm font-bold text-amber-300">
                  {currentAssoc.topDefectCategory}
                </div>
                <div className="text-[11px] text-slate-400">
                  Auto-triggered weekly refresher module assigned in your Learning queue.
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-slate-400">Critical vs Non-Critical Errors</div>
                <div className="text-sm font-bold text-white tabular-nums">
                  {currentAssoc.criticalErrors} Critical • {myDefects.length} Total Audits
                </div>
                <div className="text-[11px] text-emerald-400">
                  Accepted rebuttals automatically restore deducted QA points.
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-slate-400">Rebuttal Resolution Status</div>
                <div className="text-sm font-bold text-indigo-300 tabular-nums">
                  {myDefects.filter((d) => d.rebuttalStatus === 'Rebuttal Pending').length} Pending •{' '}
                  {myDefects.filter((d) => d.rebuttalStatus === 'Escalated to Calibration').length} In Calibration
                </div>
                <div className="text-[11px] text-slate-400">
                  SLA for QA Lead rebuttal response: 24 business hours.
                </div>
              </div>
            </div>
          </div>

          {/* Associate Rebuttal Tracker */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-indigo-400" />
                  My Claim Audit & Rebuttal Tracker
                </h3>
                <p className="text-xs text-slate-400">
                  Review QA findings, submit SOP/Playbook evidence to dispute an error, and track calibration outcomes
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {['ALL', 'No Rebuttal', 'Rebuttal Pending', 'Escalated to Calibration', 'Rebuttal Accepted'].map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setRebuttalFilter(st)}
                      className={`px-2.5 py-1 rounded-lg font-medium ${
                        rebuttalFilter === st
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {st === 'ALL' ? 'All My Audits' : st}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="space-y-3">
              {myDefects
                .filter((d) => rebuttalFilter === 'ALL' || d.rebuttalStatus === rebuttalFilter)
                .map((def) => (
                  <div
                    key={def.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-300">
                          {def.id} • Claim {def.claimId}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold">
                          {def.severity} (-{def.scoreImpact} pts)
                        </span>
                        <span className="text-slate-400">Payer: {def.payer}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/40 font-semibold">
                        {def.rebuttalStatus}
                      </span>
                    </div>

                    <div className="font-bold text-white">
                      {def.errorCode} — {def.errorCategory}
                    </div>
                    <p className="text-slate-300">
                      <strong>QA Finding ({def.auditorName}):</strong> {def.auditFinding}
                    </p>

                    {def.associateRebuttalReason && (
                      <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 space-y-1">
                        <div className="font-semibold text-indigo-300">Your Submitted Rebuttal:</div>
                        <p className="text-slate-200">{def.associateRebuttalReason}</p>
                        {def.qaResolutionComment && (
                          <p className="text-emerald-300 pt-1 border-t border-indigo-500/20">
                            <strong>QA / Calibration Outcome:</strong> {def.qaResolutionComment}
                          </p>
                        )}
                      </div>
                    )}

                    {def.rebuttalStatus === 'No Rebuttal' && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Enter SOP code, Payer Flash #, or clinical evidence to dispute this audit error..."
                          value={rebuttalInput[def.id] || ''}
                          onChange={(e) =>
                            setRebuttalInput((prev) => ({ ...prev, [def.id]: e.target.value }))
                          }
                          className="flex-1 min-w-0 sm:min-w-[240px] bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                        />
                        <button
                          onClick={() => handleSubmitAssociateRebuttal(def.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold"
                        >
                          Raise Error Rebuttal
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. MY ASSIGNED COURSES, PKT ASSESSMENTS & ANNUAL COMPLIANCE
         ===================================================================== */}
      {subView === 'courses_assessments' && (
        <div className="space-y-6">
          {/* Assigned Weekly Defect & PKT Modules */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                My Assigned Continuous Learning Modules, Defect Refreshers & Monthly PKT
              </h3>
              <p className="text-xs text-slate-400">
                Complete your assigned modules and pass the assessment quiz to boost your Monthly Scorecard PKT (15% weight)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningModules.map((mod) => {
                const isDirectlyAssigned = currentAssoc.assignedWeeklyModules.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                      isDirectlyAssigned
                        ? 'bg-indigo-950/25 border-indigo-500/50'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                          {isDirectlyAssigned ? 'Assigned to You (Due Wed)' : mod.category}
                        </span>
                        <span className="font-mono text-slate-400">
                          {mod.id} • {mod.durationMins}m
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{mod.title}</h4>
                      <p className="text-xs text-slate-300">{mod.summary}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <span className="text-slate-400">Pass Gate: {mod.passMarksPct}%</span>
                      <button
                        onClick={() => onLaunchModuleQuiz(mod)}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Start Course & Quiz</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Annual Mandatory Compliance (HIPAA, POSH, FWA, InfoSec, Ethics) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                My Annual Mandatory Statutory Compliance (HIPAA, POSH, CMS FWA & InfoSec)
              </h3>
              <p className="text-xs text-slate-400">
                Complete annual recertifications and download your verifiable certificates
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complianceCourses.map((c) => {
                const done = c.associateStatus === 'Completed & Certified';
                return (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3 text-xs"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-indigo-300">{c.code}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold ${
                            done
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {c.associateStatus}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-white">{c.title}</div>
                      <div className="text-slate-400">
                        Due: <span className="text-amber-300">{c.dueDate}</span> • Pass:{' '}
                        {c.passThresholdPct}%
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                      {done && (
                        <button
                          onClick={() => onViewCertificate(c)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-1"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Certificate</span>
                        </button>
                      )}
                      <button
                        onClick={() => onLaunchComplianceQuiz(c)}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                      >
                        {done ? 'Retake Exam' : 'Complete Mandatory Exam'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. PROJECT KNOWLEDGE LIBRARY (SPECIALTY TRAINING, SOP, UPDATE TRACKER, PLAYBOOKS, NAVIGATION MANUALS)
         ===================================================================== */}
      {subView === 'knowledge_library' && (
        <div className="space-y-5">
          {/* Filter Bar for the 5 Requested Knowledge Pillars */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-indigo-400" />
                  Project Knowledge Library — Specialty Training, SOPs, Updates, Playbooks & EHR Navigation Manuals
                </h3>
                <p className="text-xs text-slate-400">
                  Curated for <strong className="text-white">{currentAssoc.projectName}</strong> ({currentAssoc.specialty} • {currentAssoc.tower})
                </p>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={onlyMyProjectScope}
                  onChange={(e) => setOnlyMyProjectScope(e.target.checked)}
                  className="rounded border-slate-700"
                />
                <span>Filter strictly to my Specialty ({currentAssoc.specialty})</span>
              </label>
            </div>

            {/* 5 Pillar Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'ALL', label: 'All Library Resources' },
                  { id: 'Specialty Training Knowledge', label: '1. Specialty Training Knowledge' },
                  { id: 'SOP', label: '2. SOPs' },
                  { id: 'Process Update Tracker', label: '3. Process Update Tracker' },
                  { id: 'Client Playbook', label: '4. Client Playbooks' },
                  { id: 'Navigation Manual', label: '5. System & EHR Navigation Manuals' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setLibraryPillar(p.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      libraryPillar === p.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-0 sm:min-w-[240px] flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
                <input
                  type="text"
                  placeholder="Search CPT, CARC, Epic, Athena, Evicore, Ortho..."
                  value={libSearch}
                  onChange={(e) => setLibSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Left-Right Knowledge Library Reader */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Resource Cards */}
            <div className="lg:col-span-5 space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredLibrary.map((item) => {
                const isSelected = item.id === selectedLibItem.id;
                const pillarColor =
                  item.pillar === 'Specialty Training Knowledge'
                    ? 'text-emerald-300 bg-emerald-500/15'
                    : item.pillar === 'Navigation Manual'
                    ? 'text-sky-300 bg-sky-500/15'
                    : item.pillar === 'Process Update Tracker'
                    ? 'text-amber-300 bg-amber-500/20'
                    : 'text-indigo-300 bg-indigo-500/15';

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedLibItem(item)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px]">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${pillarColor}`}>
                        {item.pillar}
                      </span>
                      <span className="font-mono text-slate-400">
                        {item.code} • {item.updatedAt}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white">{item.title}</div>
                    <div className="text-[11px] text-slate-400">
                      {item.specialty} • {item.systemOrPayer}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right 7 Cols: Deep Reader View */}
            {selectedLibItem && (
              <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300">
                        {selectedLibItem.pillar}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {selectedLibItem.code} ({selectedLibItem.version})
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{selectedLibItem.title}</h3>
                    <p className="text-xs text-slate-400">
                      Specialty: <strong className="text-indigo-300">{selectedLibItem.specialty}</strong> • Tower:{' '}
                      <strong className="text-slate-200">{selectedLibItem.tower}</strong> • Platform/Payer:{' '}
                      {selectedLibItem.systemOrPayer}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setLocalAckIds((prev) => [...prev, selectedLibItem.id]);
                      onAcknowledgeSop(selectedLibItem.id);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
                      selectedLibItem.acknowledged || localAckIds.includes(selectedLibItem.id)
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {selectedLibItem.acknowledged || localAckIds.includes(selectedLibItem.id)
                        ? 'Read & Acknowledged'
                        : 'Acknowledge Update'}
                    </span>
                  </button>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">{selectedLibItem.summary}</p>

                <div className="space-y-4">
                  {selectedLibItem.sections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                    >
                      <div className="text-xs font-bold text-indigo-300">{sec.heading}</div>
                      <ul className="space-y-1.5 text-xs text-slate-200 list-disc list-inside">
                        {sec.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="leading-relaxed">
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-[11px] text-slate-400 mr-1">
                    Referenced Codes & Shortcuts:
                  </span>
                  {selectedLibItem.quickCodes.map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono text-[11px]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
