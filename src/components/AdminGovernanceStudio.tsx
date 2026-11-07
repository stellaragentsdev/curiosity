import React, { useState } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  FolderKanban,
  GraduationCap,
  Layers,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  UsersRound,
} from 'lucide-react';
import {
  AssociateProfile,
  AuditDefectRecord,
  ContinuousLearningModule,
  MandatoryComplianceCourse,
  ProjectHealth,
  ProviderSpecialty,
  RcmTower,
  UserGroup,
} from '../types/rcm';
import { PROVIDER_SPECIALTIES, RCM_TOWERS } from '../data/mockRcmData';

interface AdminGovernanceStudioProps {
  projects: ProjectHealth[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectHealth[]>>;
  associates: AssociateProfile[];
  setAssociates: React.Dispatch<React.SetStateAction<AssociateProfile[]>>;
  userGroups: UserGroup[];
  setUserGroups: React.Dispatch<React.SetStateAction<UserGroup[]>>;
  learningModules: ContinuousLearningModule[];
  setLearningModules: React.Dispatch<React.SetStateAction<ContinuousLearningModule[]>>;
  complianceCourses: MandatoryComplianceCourse[];
  setComplianceCourses: React.Dispatch<React.SetStateAction<MandatoryComplianceCourse[]>>;
  defects: AuditDefectRecord[];
  initialSubTab?: 'projects' | 'users' | 'courses' | 'groups';
  initialProjectId?: string;
  initialUserId?: string;
  onLaunchModuleQuiz: (mod: ContinuousLearningModule) => void;
  onLaunchComplianceQuiz: (course: MandatoryComplianceCourse) => void;
  triggerToast: (msg: string) => void;
}

export const AdminGovernanceStudio: React.FC<AdminGovernanceStudioProps> = ({
  projects,
  setProjects,
  associates,
  setAssociates,
  userGroups,
  setUserGroups,
  learningModules,
  setLearningModules,
  complianceCourses,
  setComplianceCourses,
  defects,
  initialSubTab = 'projects',
  initialProjectId,
  initialUserId,
  onLaunchModuleQuiz,
  onLaunchComplianceQuiz,
  triggerToast,
}) => {
  const [subTab, setSubTab] = useState<'projects' | 'users' | 'courses' | 'groups'>(initialSubTab);

  // =========================================================================
  // 1. PROJECT PROFILE & ADD PROJECT STATE
  // =========================================================================
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || projects[0]?.id || 'PRJ-CARD-01'
  );
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjCode, setNewProjCode] = useState('');
  const [newProjSpecialty, setNewProjSpecialty] = useState<ProviderSpecialty>('Cardiology & Vascular');
  const [newProjTowers, setNewProjTowers] = useState<RcmTower[]>([
    'Medical Coding',
    'Accounts Receivable (AR)',
    'Denials Management',
  ]);
  const [newProjEhr, setNewProjEhr] = useState('Epic Resolute PB/HB');
  const [newProjHeadcount, setNewProjHeadcount] = useState(40);
  const [newProjQualTarget, setNewProjQualTarget] = useState(98.0);
  const [newProjProdTarget, setNewProjProdTarget] = useState(95.0);
  const [newProjDeliveryHead, setNewProjDeliveryHead] = useState('Meera Krishnan');
  const [newProjQaLead, setNewProjQaLead] = useState('Deepa Madhavan');
  const [newProjTrainer, setNewProjTrainer] = useState('Ritu Chatterjee');
  const [histMetricKey, setHistMetricKey] = useState<
    'healthScore' | 'productionSlaPct' | 'qualitySlaPct' | 'tmsUtilizationPct' | 'pktAvgScore'
  >('healthScore');

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const toggleTowerSelection = (tower: RcmTower) => {
    setNewProjTowers((prev) =>
      prev.includes(tower) ? prev.filter((t) => t !== tower) : [...prev, tower]
    );
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) {
      triggerToast('Please enter a Project Name.');
      return;
    }
    const id = `PRJ-${Date.now().toString().slice(-4)}`;
    const code = newProjCode.trim() || `RCM-${Math.floor(10 + Math.random() * 89)}`;
    const created: ProjectHealth = {
      id,
      projectName: newProjName.trim(),
      clientCode: code.toUpperCase(),
      specialty: newProjSpecialty,
      towers: newProjTowers.length ? newProjTowers : ['Accounts Receivable (AR)', 'Denials Management'],
      headcount: newProjHeadcount,
      healthScore: 90,
      productionSlaPct: newProjProdTarget,
      qualitySlaPct: newProjQualTarget,
      qualityTargetPct: newProjQualTarget,
      tmsUtilizationPct: 92.0,
      pktAvgScore: 89.0,
      bqtCount: 1,
      pipCount: 0,
      complianceCompletionPct: 96.0,
      trend: 'up',
      topDefectDriver: 'New Project Nesting — Baseline Calibration Active',
      ehrSystem: newProjEhr,
      goLiveDate: '2026-11-07',
      deliveryHead: newProjDeliveryHead,
      reportingLead: 'Deepak Nair',
      operationsManager: newProjDeliveryHead,
      qaLead: newProjQaLead,
      assignedAuditor: 'Neha Kulkarni',
      ldTrainer: newProjTrainer,
      trainingLead: 'Samrat Bose',
      productionTargetPct: newProjProdTarget,
      assignedCourseIds: ['MOD-PKT-204', 'COMP-HIPAA-2026', 'COMP-POSH-2026'],
      history: [
        { month: 'Jun', healthScore: 84, productionSlaPct: 91.5, qualitySlaPct: 95.8, tmsUtilizationPct: 89.0, pktAvgScore: 85.0, claimsProcessed: 12400, bqtCount: 3, pipCount: 1 },
        { month: 'Jul', healthScore: 85, productionSlaPct: 92.2, qualitySlaPct: 96.2, tmsUtilizationPct: 89.8, pktAvgScore: 86.0, claimsProcessed: 13100, bqtCount: 3, pipCount: 1 },
        { month: 'Aug', healthScore: 87, productionSlaPct: 93.4, qualitySlaPct: 96.8, tmsUtilizationPct: 90.5, pktAvgScore: 87.2, claimsProcessed: 13900, bqtCount: 2, pipCount: 0 },
        { month: 'Sep', healthScore: 88, productionSlaPct: 94.0, qualitySlaPct: 97.2, tmsUtilizationPct: 91.0, pktAvgScore: 88.0, claimsProcessed: 14500, bqtCount: 2, pipCount: 0 },
        { month: 'Oct', healthScore: 89, productionSlaPct: 94.6, qualitySlaPct: 97.6, tmsUtilizationPct: 91.5, pktAvgScore: 88.5, claimsProcessed: 15200, bqtCount: 1, pipCount: 0 },
        { month: 'Nov', healthScore: 90, productionSlaPct: newProjProdTarget, qualitySlaPct: newProjQualTarget, tmsUtilizationPct: 92.0, pktAvgScore: 89.0, claimsProcessed: 15800, bqtCount: 1, pipCount: 0 },
      ],
    };
    setProjects((prev) => [created, ...prev]);
    setSelectedProjectId(created.id);
    setShowAddProject(false);
    setNewProjName('');
    setNewProjCode('');
    triggerToast(`Created RCM Project "${created.projectName}" (${created.clientCode}) with 6-month baseline history.`);
  };

  // =========================================================================
  // 2. USER PROFILE & ADD USER STATE
  // =========================================================================
  const [selectedUserId, setSelectedUserId] = useState<string>(
    initialUserId || associates[0]?.id || 'ASSOC-101'
  );
  const [userSearch, setUserSearch] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserSystemRole, setNewUserSystemRole] = useState<AssociateProfile['systemRole']>('RCM Associate');
  const [newUserTitle, setNewUserTitle] = useState('AR & Denials Analyst');
  const [newUserProjectId, setNewUserProjectId] = useState(projects[0]?.id || 'PRJ-ORTH-02');
  const [newUserTower, setNewUserTower] = useState<RcmTower>('Denials Management');
  const [newUserShift, setNewUserShift] = useState<AssociateProfile['shift']>('US Day (EST)');
  const [newUserDailyTarget, setNewUserDailyTarget] = useState(50);
  const [newUserGroupId, setNewUserGroupId] = useState('UG-NEWHIRE-B42');
  const [newUserCerts, setNewUserCerts] = useState('CRCR, HIPAA-2026');
  const [newUserBatch, setNewUserBatch] = useState('BATCH-42 (Oct 2026 Nesting)');
  const [newUserReportingLead, setNewUserReportingLead] = useState('Deepak Nair');
  const [newUserManager, setNewUserManager] = useState('Vikram Deshmukh');
  const [newUserTrainer, setNewUserTrainer] = useState('Ananya Iyer');
  const [newUserTrainingLead, setNewUserTrainingLead] = useState('Samrat Bose');
  const [newUserAuditor, setNewUserAuditor] = useState('Neha Kulkarni');

  const activeUser = associates.find((u) => u.id === selectedUserId) || associates[0];

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) {
      triggerToast('Please enter the full name of the employee.');
      return;
    }
    const targetProj = projects.find((p) => p.id === newUserProjectId) || projects[0];
    const newId = `ASSOC-${Math.floor(200 + Math.random() * 799)}`;
    const empCode = `RCM-${Math.floor(6000 + Math.random() * 3000)}`;
    const createdUser: AssociateProfile = {
      id: newId,
      empId: empCode,
      name: newUserName.trim(),
      email:
        newUserEmail.trim() ||
        `${newUserName.trim().toLowerCase().replace(/\s+/g, '.')}@rcmhealth.org`,
      systemRole: newUserSystemRole,
      roleTitle: newUserTitle,
      shift: newUserShift,
      batchCode: newUserBatch,
      certifications: newUserCerts
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      userGroupIds: [newUserGroupId, 'UG-COMPLIANCE-2026'],
      projectId: targetProj.id,
      projectName: targetProj.projectName,
      tower: newUserTower,
      specialty: targetProj.specialty,
      supervisor: newUserReportingLead,
      reportingLead: newUserReportingLead,
      operationsManager: newUserManager,
      assignedTrainer: newUserTrainer,
      trainingLead: newUserTrainingLead,
      assignedAuditor: newUserAuditor,
      tenureMonths: 1,
      dailyTarget: newUserDailyTarget,
      dailyActual: newUserDailyTarget,
      productionSlaPct: 100.0,
      qualityTargetPct: targetProj.qualityTargetPct,
      qualityActualPct: 98.0,
      auditsSampled: 15,
      criticalErrors: 0,
      tmsBillableHours: 7.7,
      tmsTargetHours: 8.0,
      tmsUtilizationPct: 96.3,
      shrinkagePct: 3.5,
      ahtMinutes: 8.2,
      pktScore: 90,
      compositeScore: 96.8,
      governanceStage: 'Core Performer (Q2-Q3)',
      consecutiveWeeksBelowQa: 0,
      weeklyQualityStreak: [
        { week: 'W1 (Oct 17)', qualityPct: 97.8, targetPct: targetProj.qualityTargetPct, belowSla: false },
        { week: 'W2 (Oct 24)', qualityPct: 98.0, targetPct: targetProj.qualityTargetPct, belowSla: false },
        { week: 'W3 (Oct 31)', qualityPct: 98.0, targetPct: targetProj.qualityTargetPct, belowSla: false },
        { week: 'W4 (Nov 07)', qualityPct: 98.0, targetPct: targetProj.qualityTargetPct, belowSla: false },
      ],
      topDefectCategory: 'New Hire Nesting — Zero Critical Defects',
      assignedWeeklyModules: ['MOD-PKT-204'],
      annualCompliancePct: 100,
      history: [
        { month: 'Jun', productionPct: 95, qualityPct: 97.0, pktScore: 88, tmsAdherencePct: 95, compositeScore: 94.8 },
        { month: 'Jul', productionPct: 96, qualityPct: 97.2, pktScore: 88, tmsAdherencePct: 95, compositeScore: 95.1 },
        { month: 'Aug', productionPct: 97, qualityPct: 97.5, pktScore: 89, tmsAdherencePct: 96, compositeScore: 95.6 },
        { month: 'Sep', productionPct: 98, qualityPct: 97.8, pktScore: 90, tmsAdherencePct: 96, compositeScore: 96.1 },
        { month: 'Oct', productionPct: 99, qualityPct: 98.0, pktScore: 90, tmsAdherencePct: 96, compositeScore: 96.5 },
        { month: 'Nov', productionPct: 100, qualityPct: 98.0, pktScore: 90, tmsAdherencePct: 96.3, compositeScore: 96.8 },
      ],
    };

    setAssociates((prev) => [createdUser, ...prev]);
    setUserGroups((prev) =>
      prev.map((g) =>
        g.id === newUserGroupId ? { ...g, memberIds: [...g.memberIds, createdUser.id] } : g
      )
    );
    setSelectedUserId(createdUser.id);
    setShowAddUser(false);
    setNewUserName('');
    setNewUserEmail('');
    triggerToast(
      `Added User "${createdUser.name}" (${createdUser.empId}) to ${targetProj.projectName} and enrolled in ${newUserGroupId}.`
    );
  };

  // =========================================================================
  // 3. COURSES BUILDER & MANAGEMENT STATE
  // =========================================================================
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseTypeChoice, setCourseTypeChoice] = useState<'process' | 'compliance'>('process');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState<ContinuousLearningModule['category']>(
    'Defect-Triggered Weekly'
  );
  const [newCourseTower, setNewCourseTower] = useState<RcmTower>('Denials Management');
  const [newCourseSpecialty, setNewCourseSpecialty] = useState<ProviderSpecialty | 'All Specialties'>(
    'Orthopedics & Sports Med'
  );
  const [newCourseDuration, setNewCourseDuration] = useState(30);
  const [newCoursePassPct, setNewCoursePassPct] = useState(85);
  const [newCourseTrigger, setNewCourseTrigger] = useState(
    'Auto-assigned when weekly Quality SLA < 97.5% or CARC defect logged'
  );
  const [newCourseSummary, setNewCourseSummary] = useState('');

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) {
      triggerToast('Please enter a Course Title.');
      return;
    }

    if (courseTypeChoice === 'process') {
      const mod: ContinuousLearningModule = {
        id: `MOD-CUST-${Math.floor(400 + Math.random() * 500)}`,
        title: newCourseTitle.trim(),
        category: newCourseCategory,
        tower: newCourseTower,
        specialty: newCourseSpecialty,
        triggerCondition: newCourseTrigger,
        durationMins: newCourseDuration,
        passMarksPct: newCoursePassPct,
        assignedAssociatesCount: 24,
        completionRatePct: 0,
        summary:
          newCourseSummary.trim() ||
          `Targeted RCM training module for ${newCourseTower} (${newCourseSpecialty}) covering payer guidelines, CARC/RARC root-cause prevention, and QA rubric adherence.`,
        keyTakeaways: [
          'Verify payer-specific LCD/NCD and clinical documentation before claim submission or appeal.',
          'Follow standardized 8-point SOAP annotation format for 100% QA compliance.',
        ],
        questions: [
          {
            id: 'CQ1',
            question: `What is the primary quality governance objective of "${newCourseTitle.trim()}"?`,
            options: [
              'Bypassing clearinghouse front-end edits without documentation',
              'Preventing repeat CARC/RARC audit defects and achieving >= 98% first-pass resolution',
              'Writing off balances under $250 automatically',
              'Skipping secondary insurance billing',
            ],
            correctIndex: 1,
            explanation:
              'All defect-triggered RCM learning modules focus on root-cause elimination and first-pass resolution.',
          },
        ],
      };
      setLearningModules((prev) => [mod, ...prev]);
      triggerToast(`Published new Process & Continuous Learning Course "${mod.title}" (${mod.id}).`);
    } else {
      const code = `COMP-${Math.floor(2026 + Math.random() * 90)}`;
      const comp: MandatoryComplianceCourse = {
        id: `COMP-${Date.now().toString().slice(-4)}`,
        code,
        title: newCourseTitle.trim(),
        category: 'HIPAA Privacy & Security',
        regulatoryAuthority: 'Corporate L&D & Statutory Compliance Board',
        validityPeriod: 'Annual (365 Days)',
        dueDate: '2026-12-31',
        passThresholdPct: newCoursePassPct,
        durationMins: newCourseDuration,
        orgCompletionPct: 0,
        orgOverdueCount: 0,
        associateStatus: 'Action Required',
        policyHighlights: [
          newCourseSummary.trim() ||
            'Mandatory annual statutory certification required for all RCM personnel.',
          'Requires passing score on final assessment to generate verifiable annual certificate.',
        ],
        questions: [
          {
            id: 'CCQ1',
            question: `Which employees are required to complete "${newCourseTitle.trim()}" before the annual deadline?`,
            options: [
              'Only night-shift associates',
              'All active RCM associates, QAs, trainers, and operations leaders without exception',
              'Only new hires in their first week',
              'Optional for coding teams',
            ],
            correctIndex: 1,
            explanation: 'Annual statutory and client BAA compliance courses are mandatory across 100% of the workforce.',
          },
        ],
      };
      setComplianceCourses((prev) => [comp, ...prev]);
      triggerToast(`Published new Annual Mandatory Compliance Course "${comp.title}" (${comp.code}).`);
    }

    setShowAddCourse(false);
    setNewCourseTitle('');
    setNewCourseSummary('');
  };

  // =========================================================================
  // 4. USER GROUPS / COHORT MANAGEMENT STATE
  // =========================================================================
  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    userGroups[0]?.id || 'UG-BQT-NOV'
  );
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCode, setNewGroupCode] = useState('');
  const [newGroupType, setNewGroupType] = useState<UserGroup['groupType']>(
    'BQT / PIP Remediation Cohort'
  );
  const [newGroupTower, setNewGroupTower] = useState<RcmTower | 'All Towers'>('All Towers');
  const [newGroupSpecialty, setNewGroupSpecialty] = useState<ProviderSpecialty | 'All Specialties'>(
    'All Specialties'
  );
  const [newGroupTargetGate, setNewGroupTargetGate] = useState(
    'Achieve >= 97.5% Quality SLA & 100% Weekly Defect Quiz completion'
  );
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [courseToAssignGroup, setCourseToAssignGroup] = useState<string>('MOD-WK-101');
  const [userToAddGroup, setUserToAddGroup] = useState<string>('ASSOC-101');

  const activeGroup = userGroups.find((g) => g.id === selectedGroupId) || userGroups[0];

  const handleCreateUserGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      triggerToast('Please enter a User Group Name.');
      return;
    }
    const id = `UG-${Date.now().toString().slice(-4)}`;
    const createdGroup: UserGroup = {
      id,
      name: newGroupName.trim(),
      code: newGroupCode.trim() || `GRP-${Math.floor(100 + Math.random() * 899)}`,
      groupType: newGroupType,
      towerScope: newGroupTower,
      specialtyScope: newGroupSpecialty,
      owner: 'Samrat Bose (L&D Admin)',
      memberIds: ['ASSOC-101', 'ASSOC-103'],
      assignedCourseIds: ['MOD-WK-101', 'MOD-PKT-204'],
      description:
        newGroupDesc.trim() ||
        `Targeted RCM cohort for ${newGroupTower} (${newGroupSpecialty}) governed by L&D.`,
      targetSlaGate: newGroupTargetGate,
      createdAt: '2026-11-07',
    };
    setUserGroups((prev) => [createdGroup, ...prev]);
    setSelectedGroupId(createdGroup.id);
    setShowAddGroup(false);
    setNewGroupName('');
    setNewGroupCode('');
    setNewGroupDesc('');
    triggerToast(`Created User Group "${createdGroup.name}" (${createdGroup.code}).`);
  };

  const handleAddMemberToGroup = () => {
    if (!activeGroup) return;
    if (activeGroup.memberIds.includes(userToAddGroup)) {
      triggerToast('User is already a member of this User Group.');
      return;
    }
    setUserGroups((prev) =>
      prev.map((g) =>
        g.id === activeGroup.id
          ? { ...g, memberIds: [...g.memberIds, userToAddGroup] }
          : g
      )
    );
    setAssociates((prev) =>
      prev.map((a) =>
        a.id === userToAddGroup && !a.userGroupIds.includes(activeGroup.id)
          ? { ...a, userGroupIds: [...a.userGroupIds, activeGroup.id] }
          : a
      )
    );
    const addedUser = associates.find((a) => a.id === userToAddGroup);
    triggerToast(`Added ${addedUser?.name} to "${activeGroup.name}".`);
  };

  const handleAssignCourseToGroup = () => {
    if (!activeGroup) return;
    setUserGroups((prev) =>
      prev.map((g) =>
        g.id === activeGroup.id && !g.assignedCourseIds.includes(courseToAssignGroup)
          ? { ...g, assignedCourseIds: [...g.assignedCourseIds, courseToAssignGroup] }
          : g
      )
    );
    setAssociates((prev) =>
      prev.map((a) =>
        activeGroup.memberIds.includes(a.id) &&
        !a.assignedWeeklyModules.includes(courseToAssignGroup)
          ? { ...a, assignedWeeklyModules: [...a.assignedWeeklyModules, courseToAssignGroup] }
          : a
      )
    );
    triggerToast(
      `Assigned Course "${courseToAssignGroup}" to all ${activeGroup.memberIds.length} members of "${activeGroup.name}"!`
    );
  };

  return (
    <div className="space-y-6">
      {/* L&D Admin Studio Sub-Navigation Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              L&D Admin Governance Studio — Projects, Users, Courses & Cohorts
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspect multi-month project historical trajectories, manage 360° Project & User Profiles, author courses, and govern User Groups
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              {
                id: 'projects',
                label: `Projects & Historical Data (${projects.length})`,
                icon: FolderKanban,
              },
              {
                id: 'users',
                label: `Users & User Profiles (${associates.length})`,
                icon: Users,
              },
              {
                id: 'courses',
                label: `Courses Catalog & Builder (${learningModules.length + complianceCourses.length})`,
                icon: GraduationCap,
              },
              {
                id: 'groups',
                label: `User Groups / Cohorts (${userGroups.length})`,
                icon: UsersRound,
              },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const active = subTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSubTab(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          SUB-TAB 1: PROJECTS, PROJECT PROFILE & HISTORICAL DATA
         ===================================================================== */}
      {subTab === 'projects' && (
        <div className="space-y-6">
          {/* Action Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 border border-slate-800 rounded-xl px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Select Project Profile:</span>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    p.id === activeProject.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {p.clientCode} • {p.projectName}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddProject((prev) => !prev)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddProject ? 'Close Form' : '+ Add New RCM Project'}</span>
            </button>
          </div>

          {/* Add New RCM Project Form */}
          {showAddProject && (
            <form
              onSubmit={handleAddProject}
              className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-emerald-400" />
                  Onboard New Medical Billing RCM Client Project
                </h3>
                <span className="text-xs text-slate-400">
                  Initializes Project Health, SLA Governance & 6-Month Baseline History
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Project / Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Pacific Coast Oncology RCM"
                    value={newProjName}
                    onChange={(e) => setNewProjName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Client Short Code</label>
                  <input
                    type="text"
                    placeholder="e.g., PCO-ONC"
                    value={newProjCode}
                    onChange={(e) => setNewProjCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Provider Specialty</label>
                  <select
                    value={newProjSpecialty}
                    onChange={(e) => setNewProjSpecialty(e.target.value as ProviderSpecialty)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  >
                    {PROVIDER_SPECIALTIES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">EHR / Billing PMS Platform</label>
                  <input
                    type="text"
                    value={newProjEhr}
                    onChange={(e) => setNewProjEhr(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Allocated Headcount (FTEs)</label>
                  <input
                    type="number"
                    value={newProjHeadcount}
                    onChange={(e) => setNewProjHeadcount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Contracted Quality SLA %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newProjQualTarget}
                    onChange={(e) => setNewProjQualTarget(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Contracted Production SLA %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newProjProdTarget}
                    onChange={(e) => setNewProjProdTarget(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Delivery Head / QA / Trainer</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <input
                      type="text"
                      value={newProjDeliveryHead}
                      onChange={(e) => setNewProjDeliveryHead(e.target.value)}
                      placeholder="Ops Head"
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"
                    />
                    <input
                      type="text"
                      value={newProjQaLead}
                      onChange={(e) => setNewProjQaLead(e.target.value)}
                      placeholder="QA Lead"
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"
                    />
                    <input
                      type="text"
                      value={newProjTrainer}
                      onChange={(e) => setNewProjTrainer(e.target.value)}
                      placeholder="Trainer"
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Active RCM Towers Checkboxes */}
              <div className="space-y-1.5 text-xs">
                <label className="block text-slate-300 font-medium">
                  Select Active RCM Scope Towers for this Client:
                </label>
                <div className="flex flex-wrap gap-2">
                  {RCM_TOWERS.map((tower) => {
                    const checked = newProjTowers.includes(tower);
                    return (
                      <button
                        key={tower}
                        type="button"
                        onClick={() => toggleTowerSelection(tower)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          checked
                            ? 'bg-indigo-600/25 border-indigo-500 text-indigo-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {checked ? '✓ ' : '+ '}
                        {tower}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white"
                >
                  Create Project & Initialize Governance
                </button>
              </div>
            </form>
          )}

          {/* 360° PROJECT PROFILE & HISTORICAL PERFORMANCE VIEW */}
          {activeProject && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 5 Cols: Project Profile Card & Governance Metadata */}
              <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {activeProject.clientCode}
                      </span>
                      <span className="text-xs text-emerald-400 font-semibold">
                        {activeProject.specialty}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {activeProject.projectName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      EHR / Billing Platform: <strong className="text-slate-200">{activeProject.ehrSystem}</strong> • Go-Live:{' '}
                      {activeProject.goLiveDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-emerald-400 tabular-nums">
                      {activeProject.healthScore}%
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">
                      Project Health
                    </div>
                  </div>
                </div>

                {/* 6-Role Organizational Mapping for Project */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] uppercase text-slate-400">Reporting Lead</div>
                    <div className="font-semibold text-white mt-0.5">{activeProject.reportingLead}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] uppercase text-slate-400">Operations Manager</div>
                    <div className="font-semibold text-sky-300 mt-0.5">{activeProject.operationsManager}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] uppercase text-slate-400">Assigned Trainer</div>
                    <div className="font-semibold text-emerald-300 mt-0.5">{activeProject.ldTrainer}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] uppercase text-slate-400">Training Lead</div>
                    <div className="font-semibold text-indigo-300 mt-0.5">{activeProject.trainingLead}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] uppercase text-slate-400">QA Auditor</div>
                    <div className="font-semibold text-amber-300 mt-0.5">{activeProject.assignedAuditor}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] uppercase text-slate-400">QA Governance Lead</div>
                    <div className="font-semibold text-purple-300 mt-0.5">{activeProject.qaLead}</div>
                  </div>
                </div>

                {/* Current SLA Snapshot */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Production SLA</div>
                    <div className="text-base font-bold text-white tabular-nums">
                      {activeProject.productionSlaPct}%
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Target: {activeProject.productionTargetPct}%
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Quality SLA</div>
                    <div className="text-base font-bold text-emerald-400 tabular-nums">
                      {activeProject.qualitySlaPct}%
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Target: {activeProject.qualityTargetPct}%
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[11px] text-slate-400">TMS Utilization</div>
                    <div className="text-base font-bold text-sky-300 tabular-nums">
                      {activeProject.tmsUtilizationPct}%
                    </div>
                    <div className="text-[10px] text-slate-500">{activeProject.headcount} FTEs</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[11px] text-slate-400">BQT / PIP Count</div>
                    <div className="text-base font-bold text-amber-300 tabular-nums">
                      {activeProject.bqtCount} / {activeProject.pipCount}
                    </div>
                    <div className="text-[10px] text-slate-500">Active Coaching</div>
                  </div>
                </div>

                {/* Active Towers & Primary Defect Focus */}
                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-slate-300">Active RCM Functional Towers:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProject.towers.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-[11px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 text-xs space-y-1">
                  <div className="font-semibold text-amber-300">
                    Primary Defect Driver & Weekly Training Focus:
                  </div>
                  <div className="text-slate-200">{activeProject.topDefectDriver}</div>
                </div>
              </div>

              {/* Right 7 Cols: 6-Month Project Historical Trajectory & Monthly Breakdown Table */}
              <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      6-Month Project Historical Performance Trajectory (Jun – Nov 2026)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Track monthly SLA evolution, claims volume, and BQT/PIP headcount trends for{' '}
                      <strong className="text-white">{activeProject.projectName}</strong>
                    </p>
                  </div>

                  {/* Metric Selector for Visual Bar Chart */}
                  <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                    {(
                      [
                        { id: 'healthScore', label: 'Health Score' },
                        { id: 'qualitySlaPct', label: 'Quality %' },
                        { id: 'productionSlaPct', label: 'Prod %' },
                        { id: 'tmsUtilizationPct', label: 'TMS %' },
                        { id: 'pktAvgScore', label: 'PKT Avg' },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setHistMetricKey(m.id)}
                        className={`px-2.5 py-1 rounded-lg font-semibold ${
                          histMetricKey === m.id
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive 6-Month Historical Bar Chart */}
                <div className="grid grid-cols-6 gap-3 items-end h-40 bg-slate-950/90 p-4 rounded-xl border border-slate-800">
                  {activeProject.history.map((m) => {
                    const val = m[histMetricKey];
                    const barHeight = Math.max(18, Math.min(100, (val - 65) * 2.8));
                    return (
                      <div key={m.month} className="flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="text-xs font-bold text-white tabular-nums">{val}%</div>
                        <div className="w-full bg-slate-800/80 rounded-t-lg h-24 flex items-end overflow-hidden">
                          <div
                            className="w-full bg-gradient-to-t from-indigo-600 to-emerald-400 rounded-t-lg transition-all duration-300"
                            style={{ height: `${barHeight}%` }}
                          />
                        </div>
                        <div className="text-[11px] font-semibold text-slate-300">{m.month} '26</div>
                        <div className="text-[10px] text-slate-500 tabular-nums">
                          {(m.claimsProcessed / 1000).toFixed(1)}k clms
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 6-Month Historical Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-950/60">
                        <th className="py-2.5 px-3">Month</th>
                        <th className="py-2.5 px-3 text-right">Claims Processed</th>
                        <th className="py-2.5 px-3 text-right">Health Score</th>
                        <th className="py-2.5 px-3 text-right">Production SLA</th>
                        <th className="py-2.5 px-3 text-right">Quality SLA</th>
                        <th className="py-2.5 px-3 text-right">TMS Util %</th>
                        <th className="py-2.5 px-3 text-right">PKT Avg</th>
                        <th className="py-2.5 px-3 text-center">BQT / PIP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70 tabular-nums">
                      {activeProject.history.map((h) => (
                        <tr key={h.month} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-bold text-white">{h.month} 2026</td>
                          <td className="py-2.5 px-3 text-right text-slate-300">
                            {h.claimsProcessed.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-indigo-300">
                            {h.healthScore}%
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-200">
                            {h.productionSlaPct}%
                          </td>
                          <td className="py-2.5 px-3 text-right font-semibold text-emerald-400">
                            {h.qualitySlaPct}%
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-300">
                            {h.tmsUtilizationPct}%
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-300">
                            {h.pktAvgScore}%
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="text-amber-300 font-semibold">{h.bqtCount} BQT</span>
                            {' / '}
                            <span className="text-rose-400 font-semibold">{h.pipCount} PIP</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Cross-Project Historical Health Comparison Matrix */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  All RCM Projects — 6-Month Historical Health Score & Quality SLA Comparison (Jun – Nov 2026)
                </h3>
                <p className="text-xs text-slate-400">
                  Executive L&D view comparing month-over-month project health trajectory across all provider specialties
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-950/60">
                    <th className="py-3 px-4">Project & Specialty</th>
                    <th className="py-3 px-4 text-right">Jun '26</th>
                    <th className="py-3 px-4 text-right">Jul '26</th>
                    <th className="py-3 px-4 text-right">Aug '26</th>
                    <th className="py-3 px-4 text-right">Sep '26</th>
                    <th className="py-3 px-4 text-right">Oct '26</th>
                    <th className="py-3 px-4 text-right">Nov '26 (Current)</th>
                    <th className="py-3 px-4 text-center">6M Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 tabular-nums">
                  {projects.map((p) => {
                    const first = p.history[0]?.healthScore || p.healthScore;
                    const last = p.history[p.history.length - 1]?.healthScore || p.healthScore;
                    const diff = last - first;
                    return (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedProjectId(p.id)}
                        className="hover:bg-slate-800/40 cursor-pointer"
                      >
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{p.projectName}</div>
                          <div className="text-[11px] text-indigo-300">
                            {p.clientCode} • {p.specialty}
                          </div>
                        </td>
                        {p.history.map((h) => (
                          <td key={h.month} className="py-3 px-4 text-right">
                            <div className="font-bold text-slate-200">{h.healthScore}%</div>
                            <div className="text-[10px] text-slate-500">QA {h.qualitySlaPct}%</div>
                          </td>
                        ))}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              diff > 0
                                ? 'bg-emerald-500/15 text-emerald-300'
                                : diff < 0
                                ? 'bg-rose-500/15 text-rose-300'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {diff > 0 ? `+${diff} pts` : `${diff} pts`}
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
      )}

      {/* =====================================================================
          SUB-TAB 2: USERS DIRECTORY, ADD USER & 360° USER PROFILE
         ===================================================================== */}
      {subTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 border border-slate-800 rounded-xl px-4 py-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search users by name, Emp ID, tower, project, certification..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white"
              />
            </div>
            <button
              onClick={() => setShowAddUser((prev) => !prev)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>{showAddUser ? 'Close User Form' : '+ Add New User / Associate'}</span>
            </button>
          </div>

          {/* Add New User Form */}
          {showAddUser && (
            <form
              onSubmit={handleAddUser}
              className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-5 space-y-4"
            >
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                Add New RCM Employee / QA Auditor / Process Trainer
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Kavya Nair"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Work Email</label>
                  <input
                    type="email"
                    placeholder="kavya.nair@rcmhealth.org"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">System Access Role</label>
                  <select
                    value={newUserSystemRole}
                    onChange={(e) =>
                      setNewUserSystemRole(e.target.value as AssociateProfile['systemRole'])
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="RCM Associate">RCM Associate</option>
                    <option value="QA Auditor">QA Auditor</option>
                    <option value="Process Trainer">Process Trainer</option>
                    <option value="Team Lead">Team Lead / Ops Supervisor</option>
                    <option value="L&D Admin">L&D Governance Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Job Designation</label>
                  <input
                    type="text"
                    value={newUserTitle}
                    onChange={(e) => setNewUserTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Assign Project</label>
                  <select
                    value={newUserProjectId}
                    onChange={(e) => setNewUserProjectId(e.target.value)}
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
                  <label className="block text-slate-300 mb-1">Primary RCM Tower</label>
                  <select
                    value={newUserTower}
                    onChange={(e) => setNewUserTower(e.target.value as RcmTower)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  >
                    {RCM_TOWERS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Shift Window & Daily Target</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <select
                      value={newUserShift}
                      onChange={(e) =>
                        setNewUserShift(e.target.value as AssociateProfile['shift'])
                      }
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"
                    >
                      <option value="US Day (EST)">US Day (EST)</option>
                      <option value="US Central (CST)">US Central (CST)</option>
                      <option value="Global Overlap">Global Overlap</option>
                      <option value="APAC Day">APAC Day</option>
                    </select>
                    <input
                      type="number"
                      value={newUserDailyTarget}
                      onChange={(e) => setNewUserDailyTarget(Number(e.target.value))}
                      placeholder="Target/day"
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Initial User Group / Cohort</label>
                  <select
                    value={newUserGroupId}
                    onChange={(e) => setNewUserGroupId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  >
                    {userGroups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Training Batch</label>
                  <input
                    type="text"
                    value={newUserBatch}
                    onChange={(e) => setNewUserBatch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Reporting Lead *</label>
                  <input
                    type="text"
                    value={newUserReportingLead}
                    onChange={(e) => setNewUserReportingLead(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Operations Manager *</label>
                  <input
                    type="text"
                    value={newUserManager}
                    onChange={(e) => setNewUserManager(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Assigned Trainer *</label>
                  <input
                    type="text"
                    value={newUserTrainer}
                    onChange={(e) => setNewUserTrainer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Training Lead *</label>
                  <input
                    type="text"
                    value={newUserTrainingLead}
                    onChange={(e) => setNewUserTrainingLead(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Assigned QA Auditor *</label>
                  <input
                    type="text"
                    value={newUserAuditor}
                    onChange={(e) => setNewUserAuditor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex-1 min-w-0 sm:min-w-[240px] text-xs">
                  <label className="block text-slate-300 mb-1">
                    Certifications (comma-separated, e.g. AAPC CPC, CRCR, HIPAA-2026)
                  </label>
                  <input
                    type="text"
                    value={newUserCerts}
                    onChange={(e) => setNewUserCerts(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white"
                >
                  Save User Profile & Auto-Assign HIPAA/POSH
                </button>
              </div>
            </form>
          )}

          {/* Directory Table + 360° User Profile Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Users List (7 Cols) */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  RCM Employee Directory (Click any row for 360° User Profile)
                </h3>
                <span className="text-xs text-slate-400">{associates.length} Active Users</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-950/60">
                      <th className="py-3 px-4">Employee & Role</th>
                      <th className="py-3 px-4">Project & RCM Tower</th>
                      <th className="py-3 px-4">Shift & Groups</th>
                      <th className="py-3 px-4 text-right">Scorecard</th>
                      <th className="py-3 px-4">Governance Stage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {associates
                      .filter(
                        (u) =>
                          !userSearch.trim() ||
                          u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.empId.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.tower.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.projectName.toLowerCase().includes(userSearch.toLowerCase())
                      )
                      .map((u) => {
                        const isSelected = u.id === activeUser.id;
                        return (
                          <tr
                            key={u.id}
                            onClick={() => setSelectedUserId(u.id)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-indigo-600/15' : 'hover:bg-slate-800/40'
                            }`}
                          >
                            <td className="py-3 px-4">
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{u.name}</span>
                                <span className="text-[10px] font-mono text-indigo-300">
                                  {u.empId}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {u.systemRole} • {u.roleTitle}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-slate-200 font-medium">{u.projectName}</div>
                              <div className="text-[11px] text-indigo-300">
                                {u.tower} ({u.specialty})
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-slate-300">{u.shift}</div>
                              <div className="text-[10px] text-slate-500">
                                {u.userGroupIds.length} User Groups
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right tabular-nums">
                              <div className="font-bold text-white">{u.compositeScore}%</div>
                              <div className="text-[10px] text-emerald-400">
                                QA {u.qualityActualPct}%
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                                {u.governanceStage}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 360° User Profile Card (5 Cols) */}
            {activeUser && (
              <div className="lg:col-span-5 bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-base font-extrabold text-white">
                      {activeUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{activeUser.name}</h3>
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[11px]">
                          {activeUser.empId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        {activeUser.roleTitle} ({activeUser.systemRole})
                      </p>
                      <p className="text-[11px] text-slate-400">{activeUser.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-extrabold text-emerald-400 tabular-nums">
                      {activeUser.compositeScore}%
                    </div>
                    <div className="text-[10px] uppercase text-slate-400">Composite Score</div>
                  </div>
                </div>

                {/* 6-Role Organizational Mapping & Hierarchy */}
                <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2 text-xs">
                  <div className="font-bold text-indigo-300 flex items-center justify-between">
                    <span>6-Role Organizational Mapping</span>
                    <span className="text-[10px] font-mono text-slate-400">{activeUser.batchCode}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block">1. Assigned Project</span>
                      <span className="font-semibold text-white">{activeUser.projectName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">2. Reporting Lead</span>
                      <span className="font-semibold text-slate-200">{activeUser.reportingLead}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">3. Operations Manager</span>
                      <span className="font-semibold text-sky-300">{activeUser.operationsManager}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">4. Assigned Trainer</span>
                      <span className="font-semibold text-emerald-300">{activeUser.assignedTrainer}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">5. Training Lead</span>
                      <span className="font-semibold text-indigo-300">{activeUser.trainingLead}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">6. Assigned QA Auditor</span>
                      <span className="font-semibold text-amber-300">{activeUser.assignedAuditor}</span>
                    </div>
                  </div>
                </div>

                {/* Consecutive Weeks Below QA SLA Escalation Status */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">Consecutive Weeks Below QA SLA</div>
                    <div className="font-bold text-white mt-0.5">
                      {activeUser.consecutiveWeeksBelowQa} Consecutive Wks • {activeUser.governanceStage}
                    </div>
                  </div>
                  {activeUser.pipDaysRemaining && (
                    <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                      {activeUser.pipDaysRemaining}d PIP Left
                    </span>
                  )}
                </div>

                {/* Certifications & User Groups */}
                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-slate-300">
                    Earned RCM & Compliance Certifications:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeUser.certifications.map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold"
                      >
                        ✓ {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-slate-300">
                    Enrolled User Groups / Learning Cohorts:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeUser.userGroupIds.map((gid) => {
                      const grp = userGroups.find((g) => g.id === gid);
                      return (
                        <span
                          key={gid}
                          className="px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[11px]"
                        >
                          {grp ? grp.name : gid}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Assigned Courses & Recent QA Audit Defects */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="font-semibold text-slate-200">
                    Assigned Continuous Learning Modules ({activeUser.assignedWeeklyModules.length}):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeUser.assignedWeeklyModules.map((mId) => (
                      <span
                        key={mId}
                        className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-mono text-[11px]"
                      >
                        {mId}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    Logged QA Audit Defects:{' '}
                    <strong className="text-amber-300">
                      {defects.filter((d) => d.associateId === activeUser.id).length} claim records
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 3: COURSES CATALOG & COURSE BUILDER
         ===================================================================== */}
      {subTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 border border-slate-800 rounded-xl px-4 py-3">
            <div className="text-xs text-slate-300">
              Manage all <strong>Defect-Triggered Weekly Courses</strong>, <strong>BQT/PIP Remediation Modules</strong>, <strong>Monthly PKTs</strong>, and <strong>Annual Mandatory HIPAA/POSH Courses</strong>
            </div>
            <button
              onClick={() => setShowAddCourse((prev) => !prev)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddCourse ? 'Close Course Builder' : '+ Create New RCM / Compliance Course'}</span>
            </button>
          </div>

          {showAddCourse && (
            <form
              onSubmit={handleCreateCourse}
              className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-5 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  Author New RCM Process Course or Annual Statutory Compliance Course
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setCourseTypeChoice('process')}
                    className={`px-3 py-1 rounded-lg font-semibold ${
                      courseTypeChoice === 'process'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-950 text-slate-400'
                    }`}
                  >
                    Process / Defect / PKT Course
                  </button>
                  <button
                    type="button"
                    onClick={() => setCourseTypeChoice('compliance')}
                    className={`px-3 py-1 rounded-lg font-semibold ${
                      courseTypeChoice === 'compliance'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-950 text-slate-400'
                    }`}
                  >
                    Annual Mandatory Compliance (HIPAA/POSH)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="lg:col-span-2">
                  <label className="block text-slate-300 mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Cardiology NCCI Modifier -25 & -59/XS Deep-Dive"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Course Category</label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) =>
                      setNewCourseCategory(
                        e.target.value as ContinuousLearningModule['category']
                      )
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Defect-Triggered Weekly">Defect-Triggered Weekly</option>
                    <option value="BQT Intensive Remediation">BQT Intensive Remediation</option>
                    <option value="PIP Milestone Assessment">PIP Milestone Assessment</option>
                    <option value="Process Knowledge Test (PKT)">Process Knowledge Test (PKT)</option>
                    <option value="New Payer Update">New Payer Update</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Target RCM Tower</label>
                  <select
                    value={newCourseTower}
                    onChange={(e) => setNewCourseTower(e.target.value as RcmTower)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  >
                    {RCM_TOWERS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Provider Specialty</label>
                  <select
                    value={newCourseSpecialty}
                    onChange={(e) =>
                      setNewCourseSpecialty(
                        e.target.value as ProviderSpecialty | 'All Specialties'
                      )
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="All Specialties">All Specialties</option>
                    {PROVIDER_SPECIALTIES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Duration (Mins) & Pass %</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="number"
                      value={newCourseDuration}
                      onChange={(e) => setNewCourseDuration(Number(e.target.value))}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"
                    />
                    <input
                      type="number"
                      value={newCoursePassPct}
                      onChange={(e) => setNewCoursePassPct(Number(e.target.value))}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"
                    />
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-slate-300 mb-1">Automated Trigger / SLA Rule</label>
                  <input
                    type="text"
                    value={newCourseTrigger}
                    onChange={(e) => setNewCourseTrigger(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1 w-full text-xs">
                  <label className="block text-slate-300 mb-1">Course Summary & Learning Objective</label>
                  <input
                    type="text"
                    placeholder="Describe CARC/RARC scenarios, coding guidelines, or HIPAA/POSH rules covered..."
                    value={newCourseSummary}
                    onChange={(e) => setNewCourseSummary(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shrink-0"
                >
                  Publish Course to Catalog
                </button>
              </div>
            </form>
          )}

          {/* Unified Courses Catalog Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                Master L&D Course Catalog (Continuous Learning, BQT/PIP, PKTs & Annual Compliance)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 bg-slate-950/60">
                    <th className="py-3 px-4">Code & Course Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Scope (Tower / Specialty)</th>
                    <th className="py-3 px-4 text-right">Pass Gate</th>
                    <th className="py-3 px-4 text-right">Completion</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {learningModules.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{m.title}</div>
                        <div className="text-[11px] font-mono text-indigo-300">
                          {m.id} • {m.durationMins} mins
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[11px]">
                          {m.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {m.tower} ({m.specialty})
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums font-semibold">
                        {m.passMarksPct}%
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-emerald-400 font-bold">
                        {m.completionRatePct}%
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onLaunchModuleQuiz(m)}
                          className="px-3 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-semibold"
                        >
                          Preview & Quiz
                        </button>
                      </td>
                    </tr>
                  ))}
                  {complianceCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{c.title}</div>
                        <div className="text-[11px] font-mono text-emerald-300">
                          {c.code} • Annual Mandatory ({c.durationMins} mins)
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px]">
                          Annual Statutory Compliance
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">All RCM Towers & Specialties</td>
                      <td className="py-3 px-4 text-right tabular-nums font-semibold">
                        {c.passThresholdPct}%
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-emerald-400 font-bold">
                        {c.orgCompletionPct}%
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onLaunchComplianceQuiz(c)}
                          className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold"
                        >
                          Preview Exam
                        </button>
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
          SUB-TAB 4: USER GROUPS / LEARNING COHORTS MANAGEMENT
         ===================================================================== */}
      {subTab === 'groups' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 border border-slate-800 rounded-xl px-4 py-3">
            <div className="text-xs text-slate-300">
              Organize employees into <strong>BQT/PIP Cohorts</strong>, <strong>Specialty Guilds</strong>, <strong>New Hire Batches</strong>, and <strong>Annual Compliance Groups</strong> for bulk course assignment
            </div>
            <button
              onClick={() => setShowAddGroup((prev) => !prev)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddGroup ? 'Close Form' : '+ Create New User Group'}</span>
            </button>
          </div>

          {showAddGroup && (
            <form
              onSubmit={handleCreateUserGroup}
              className="bg-slate-900 border border-emerald-500/50 rounded-2xl p-5 space-y-4"
            >
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <UsersRound className="w-4 h-4 text-emerald-400" />
                Create New User Group / Learning Cohort
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">User Group Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Cardiology Appeals Escalation Taskforce"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Cohort Code</label>
                  <input
                    type="text"
                    placeholder="e.g., GRP-CARD-APP"
                    value={newGroupCode}
                    onChange={(e) => setNewGroupCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Group Classification</label>
                  <select
                    value={newGroupType}
                    onChange={(e) =>
                      setNewGroupType(e.target.value as UserGroup['groupType'])
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="BQT / PIP Remediation Cohort">BQT / PIP Remediation Cohort</option>
                    <option value="Tower & Specialty Guild">Tower & Specialty Guild</option>
                    <option value="New Hire Onboarding Batch">New Hire Onboarding Batch</option>
                    <option value="Annual Compliance Cohort">Annual Compliance Cohort</option>
                    <option value="QA & Trainer Calibration Council">QA & Trainer Calibration Council</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Tower & Specialty Scope</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <select
                      value={newGroupTower}
                      onChange={(e) =>
                        setNewGroupTower(e.target.value as RcmTower | 'All Towers')
                      }
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"
                    >
                      <option value="All Towers">All Towers</option>
                      {RCM_TOWERS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <select
                      value={newGroupSpecialty}
                      onChange={(e) =>
                        setNewGroupSpecialty(
                          e.target.value as ProviderSpecialty | 'All Specialties'
                        )
                      }
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white"
                    >
                      <option value="All Specialties">All Specialties</option>
                      {PROVIDER_SPECIALTIES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Target SLA Graduation Gate</label>
                  <input
                    type="text"
                    value={newGroupTargetGate}
                    onChange={(e) => setNewGroupTargetGate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-slate-300 mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Purpose of this learning group..."
                      value={newGroupDesc}
                      onChange={(e) => setNewGroupDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-white shrink-0"
                  >
                    Create User Group
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* User Groups List & Active Group Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Groups Cards List (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              {userGroups.map((grp) => {
                const isSelected = grp.id === activeGroup?.id;
                return (
                  <button
                    key={grp.id}
                    onClick={() => setSelectedGroupId(grp.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all space-y-2 ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-indigo-300">{grp.code}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {grp.groupType}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white">{grp.name}</div>
                    <p className="text-xs text-slate-400 line-clamp-2">{grp.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Members: <strong className="text-white">{grp.memberIds.length}</strong></span>
                      <span>Courses: <strong className="text-emerald-400">{grp.assignedCourseIds.length}</strong></span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Group Management Workspace (7 Cols) */}
            {activeGroup && (
              <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
                <div className="border-b border-slate-800 pb-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300">
                      {activeGroup.code}
                    </span>
                    <span className="text-xs text-emerald-400 font-medium">
                      {activeGroup.groupType}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{activeGroup.name}</h3>
                  <p className="text-xs text-slate-400">{activeGroup.description}</p>
                  <div className="text-xs text-amber-300 pt-1">
                    <strong>Target SLA Gate:</strong> {activeGroup.targetSlaGate}
                  </div>
                </div>

                {/* Bulk Actions: Add Member & Bulk Assign Course */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-200">
                      Add Employee to this User Group:
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={userToAddGroup}
                        onChange={(e) => setUserToAddGroup(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                      >
                        {associates.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name} ({a.tower})
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddMemberToGroup}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-200">
                      Bulk-Assign Course to Entire Cohort:
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={courseToAssignGroup}
                        onChange={(e) => setCourseToAssignGroup(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                      >
                        {learningModules.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.id}: {m.title}
                          </option>
                        ))}
                        {complianceCourses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.code}: {c.title}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAssignCourseToGroup}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enrolled Members Table */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-white">
                    Enrolled Cohort Members ({activeGroup.memberIds.length})
                  </div>
                  <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden text-xs">
                    {activeGroup.memberIds.map((mId) => {
                      const member = associates.find((a) => a.id === mId);
                      if (!member) return null;
                      return (
                        <div
                          key={mId}
                          className="p-3 bg-slate-950/70 flex items-center justify-between gap-2"
                        >
                          <div>
                            <div className="font-semibold text-white">
                              {member.name}{' '}
                              <span className="text-[10px] font-mono text-indigo-300">
                                ({member.empId})
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {member.projectName} • {member.tower}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right tabular-nums">
                              <div className="font-bold text-emerald-400">
                                QA {member.qualityActualPct}%
                              </div>
                              <div className="text-[10px] text-slate-400">
                                Prod {member.productionSlaPct}%
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedUserId(member.id);
                                setSubTab('users');
                              }}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-indigo-300 font-medium"
                            >
                              User Profile
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Assigned Group Courses */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-white">
                    Assigned Cohort Curriculum ({activeGroup.assignedCourseIds.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeGroup.assignedCourseIds.map((cId) => (
                      <span
                        key={cId}
                        className="px-3 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 font-mono text-xs"
                      >
                        ✓ {cId}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
