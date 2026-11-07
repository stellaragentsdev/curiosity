export type RcmTower =
  | 'Demographics & Charge Entry'
  | 'Medical Coding'
  | 'Payment Posting'
  | 'Accounts Receivable (AR)'
  | 'Denials Management'
  | 'Appeals & Reconsiderations'
  | 'Patient Calling';

export type ProviderSpecialty =
  | 'Cardiology & Vascular'
  | 'Orthopedics & Sports Med'
  | 'Diagnostic Radiology'
  | 'Multispecialty Primary Care'
  | 'Behavioral Health'
  | 'Gastroenterology';

export const APP_ROLE_LABELS = {
  admin: 'Admin',
  learning_development: 'L&D',
  quality_assurance: 'QA',
  operations: 'Operations',
  associate: 'Associate',
} as const;

export type UserRole = keyof typeof APP_ROLE_LABELS;

export type GovernanceStage =
  | 'Top Quartile (Q1)'
  | 'Core Performer (Q2-Q3)'
  | 'Defect-Based Training (1-2 Wks Below QA)'
  | 'BQT (3 Consecutive Wks Below QA)'
  | 'PIP - 15 Days (4 Consecutive Wks Below QA)';

export interface ProjectMonthlyHistory {
  month: string;
  healthScore: number;
  productionSlaPct: number;
  qualitySlaPct: number;
  tmsUtilizationPct: number;
  pktAvgScore: number;
  claimsProcessed: number;
  bqtCount: number;
  pipCount: number;
}

export type WeeklyAssessmentPillar =
  | '1. Project Knowledge'
  | '2. SOP Adherence'
  | '3. Weekly Process Updates'
  | '4. Weekly Errors & Defects';

export interface ProjectWeeklyAssessment {
  id: string;
  projectId: string;
  projectName: string;
  weekLabel: string;
  pillar: WeeklyAssessmentPillar;
  title: string;
  assignedCount: number;
  completedCount: number;
  avgScorePct: number;
  passThresholdPct: number;
  questionIds: string[];
}

export interface ProjectQuestionBankItem {
  id: string;
  projectId: string;
  projectName: string;
  specialty: ProviderSpecialty;
  tower: RcmTower;
  pillar: WeeklyAssessmentPillar;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  addedBy: string;
  createdAt: string;
}

export interface AutoTriggeredTrainingTicket {
  id: string;
  triggeredDate: string;
  associateId: string;
  associateName: string;
  empId: string;
  projectId: string;
  projectName: string;
  tower: RcmTower;
  specialty: ProviderSpecialty;
  consecutiveWeeksBelowQa: number;
  triggerLevel:
    | 'Week 1-2: Defect-Based Training (DBT)'
    | 'Week 3 Consecutive: Bottom Quartile Training (BQT)'
    | 'Week 4 Consecutive: PIP (15-Day Plan)';
  qualityActualPct: number;
  qualityTargetPct: number;
  defectDriver: string;
  assignedTrainer: string;
  trainingLead: string;
  reportingLead: string;
  operationsManager: string;
  assignedAuditor: string;
  status: 'Open — Pending Trainer Action' | 'In Progress' | 'Closed — Summary Logged';
  trainingSummary?: string;
  closedAt?: string;
  postTrainingQuizScore?: number;
}

export interface ProjectHealth {
  id: string;
  projectName: string;
  clientCode: string;
  specialty: ProviderSpecialty;
  towers: RcmTower[];
  headcount: number;
  healthScore: number; // 0 - 100
  productionSlaPct: number;
  qualitySlaPct: number;
  qualityTargetPct: number;
  tmsUtilizationPct: number;
  pktAvgScore: number;
  bqtCount: number;
  pipCount: number;
  complianceCompletionPct: number;
  trend: 'up' | 'stable' | 'down';
  topDefectDriver: string;
  // Extended Project Profile & Hierarchy Mapping
  ehrSystem: string;
  goLiveDate: string;
  reportingLead: string;
  operationsManager: string;
  deliveryHead: string;
  qaLead: string;
  assignedAuditor: string;
  ldTrainer: string;
  trainingLead: string;
  productionTargetPct: number;
  assignedCourseIds: string[];
  history: ProjectMonthlyHistory[];
}

export interface MonthlyScorecardMetric {
  month: string;
  productionPct: number;
  qualityPct: number;
  pktScore: number;
  tmsAdherencePct: number;
  compositeScore: number;
}

export interface WeeklyQualityStreakItem {
  week: string; // e.g., 'W1 (Oct 17)', 'W2 (Oct 24)', 'W3 (Oct 31)', 'W4 (Nov 07)'
  qualityPct: number;
  targetPct: number;
  belowSla: boolean;
}

export interface AssociateProfile {
  id: string;
  empId: string;
  name: string;
  email: string;
  systemRole: 'RCM Associate' | 'QA Auditor' | 'Process Trainer' | 'Team Lead' | 'L&D Admin';
  roleTitle: string;
  shift: 'US Day (EST)' | 'US Central (CST)' | 'Global Overlap' | 'APAC Day';
  batchCode: string;
  certifications: string[];
  userGroupIds: string[];
  projectId: string;
  projectName: string;
  tower: RcmTower;
  specialty: ProviderSpecialty;
  // Full 6-Role Hierarchy Mapping for every user
  supervisor: string; // Reporting Lead
  reportingLead: string;
  operationsManager: string;
  assignedTrainer: string;
  trainingLead: string;
  assignedAuditor: string;
  tenureMonths: number;
  // Daily & Monthly Production
  dailyTarget: number;
  dailyActual: number;
  productionSlaPct: number;
  // Quality & Consecutive Week Streak Engine
  qualityTargetPct: number;
  qualityActualPct: number;
  consecutiveWeeksBelowQa: number; // 1 = Defect Based Training, 3 = BQT, 4 = PIP (15 Days)
  pipDaysRemaining?: number; // 15-Day PIP countdown when consecutiveWeeksBelowQa >= 4
  weeklyQualityStreak: WeeklyQualityStreakItem[];
  auditsSampled: number;
  criticalErrors: number;
  // TMS (Time Management System)
  tmsBillableHours: number;
  tmsTargetHours: number;
  tmsUtilizationPct: number;
  shrinkagePct: number;
  ahtMinutes: number;
  // Knowledge & Governance
  pktScore: number;
  compositeScore: number;
  governanceStage: GovernanceStage;
  bqtWeek?: number;
  pipStage?: string;
  topDefectCategory: string;
  assignedWeeklyModules: string[];
  annualCompliancePct: number;
  history: MonthlyScorecardMetric[];
}

export interface UserGroup {
  id: string;
  name: string;
  code: string;
  groupType:
    | 'BQT / PIP Remediation Cohort'
    | 'Tower & Specialty Guild'
    | 'New Hire Onboarding Batch'
    | 'Annual Compliance Cohort'
    | 'QA & Trainer Calibration Council';
  towerScope: RcmTower | 'All Towers';
  specialtyScope: ProviderSpecialty | 'All Specialties';
  owner: string;
  memberIds: string[];
  assignedCourseIds: string[];
  description: string;
  targetSlaGate: string;
  createdAt: string;
}

export type RebuttalStatus =
  | 'No Rebuttal'
  | 'Rebuttal Pending'
  | 'Rebuttal Accepted'
  | 'Rebuttal Rejected'
  | 'Escalated to Calibration';

export interface AuditDefectRecord {
  id: string;
  claimId: string;
  auditDate: string;
  associateId: string;
  associateName: string;
  projectName: string;
  tower: RcmTower;
  specialty: ProviderSpecialty;
  payer: string;
  errorCode: string;
  errorCategory: string;
  severity: 'Critical (Fatal)' | 'Major' | 'Minor';
  scoreImpact: number;
  auditorName: string;
  auditFinding: string;
  rebuttalStatus: RebuttalStatus;
  associateRebuttalReason?: string;
  qaResolutionComment?: string;
  autoAssignedTrainingId?: string;
  autoAssignedTrainingTitle?: string;
}

export interface CalibrationSession {
  id: string;
  title: string;
  scheduledDate: string;
  tower: RcmTower;
  specialty: ProviderSpecialty;
  facilitator: string;
  participantsCount: number;
  claimsCalibrated: number;
  preSessionVariancePct: number;
  postSessionAgreementPct: number;
  status: 'Completed' | 'Scheduled' | 'In Review';
  keyOutcome: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ContinuousLearningModule {
  id: string;
  title: string;
  category:
    | 'Defect-Triggered Weekly'
    | 'BQT Intensive Remediation'
    | 'PIP Milestone Assessment'
    | 'Process Knowledge Test (PKT)'
    | 'New Payer Update';
  tower: RcmTower;
  specialty: ProviderSpecialty | 'All Specialties';
  triggerCondition: string;
  durationMins: number;
  passMarksPct: number;
  assignedAssociatesCount: number;
  completionRatePct: number;
  summary: string;
  keyTakeaways: string[];
  questions: QuizQuestion[];
}

export interface MandatoryComplianceCourse {
  id: string;
  code: string;
  title: string;
  category:
    | 'HIPAA Privacy & Security'
    | 'POSH (Prevention of Sexual Harassment)'
    | 'FWA (Fraud, Waste & Abuse)'
    | 'InfoSec & PHI Data Protection'
    | 'Workplace Ethics & CMS Compliance';
  regulatoryAuthority: string;
  validityPeriod: 'Annual (365 Days)';
  dueDate: string;
  passThresholdPct: number;
  durationMins: number;
  orgCompletionPct: number;
  orgOverdueCount: number;
  associateStatus: 'Completed & Certified' | 'Due Soon (14 Days)' | 'Action Required' | 'Overdue';
  associateScore?: number;
  completedDate?: string;
  certificateId?: string;
  policyHighlights: string[];
  questions: QuizQuestion[];
}

export interface SopPlaybookItem {
  id: string;
  docCode: string;
  title: string;
  docType: 'SOP' | 'Client Playbook' | 'Process Update Flash' | 'Coding & Payer Alert';
  tower: RcmTower;
  specialty: ProviderSpecialty;
  payerFocus: string;
  version: string;
  updatedAt: string;
  author: string;
  readAckPct: number;
  acknowledgedByCurrentUser: boolean;
  summary: string;
  stepByStepGuide: string[];
  commonPitfalls: string[];
  relatedCarcRarcCodes: string[];
}

export interface DailyUploadBatch {
  id: string;
  uploadedAt: string;
  sourceSystem: 'Production Tracker (PMS/EHR)' | 'QMS Audit Engine' | 'TMS Workforce & Shrinkage';
  fileName: string;
  projectScope: string;
  rowsImported: number;
  slaBreachesDetected: number;
  autoTrainingsAssigned: number;
  bqtPipFlagsRaised: number;
  uploadedBy: string;
  status: 'Synced & Governed' | 'Validation Warning' | 'Demo Simulation';
}

export interface TrainerDirectoryProfile {
  id: string;
  name: string;
  role: 'Process Trainer' | 'Training Lead';
  assignedProjectIds: string[];
  specialtyFocus: string;
}
