export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  citations?: string[];
  actionableSteps?: string[];
  suggestedSopCode?: string;
}

export const QUICK_AI_PROMPTS = [
  'How do I appeal CO-197 Prior Auth denial for Ortho CPT 29881?',
  'When do I use Modifier -25 vs Modifier -59 / XS in Cardiology?',
  'What is our HIPAA 3-point verification script for Behavioral Health calls?',
  'How does the Automated BQT & PIP trigger engine work for <95% Quality?',
  'What is the difference between Modifier -PT and -33 on GI Colonoscopy?',
  'What is valid Proof of Timely Filing (POTF) for overturning CO-29?',
];

export function generateTrainerSamResponse(query: string): Omit<AiChatMessage, 'id' | 'sender' | 'timestamp'> {
  const q = query.toLowerCase();

  if (q.includes('197') || q.includes('prior auth') || q.includes('evicore') || q.includes('29881')) {
    return {
      text: 'For **CARC CO-197 (Precertification/Authorization/Notification Absent)** on Orthopedic procedures (such as CPT 29881 Knee Arthroscopy), do **not** write off the claim or adjust to CO-45 before completing the 3-step Evicore/Payer Portal check.',
      citations: ['SOP-OR-12 v3.4 (Summit Ortho Playbook)', 'Module MOD-WK-101 (CO-197 Retro-Appeal Protocol)'],
      actionableSteps: [
        '1. Check Loop 2300 REF*G1 on the 837P to see if an auth number was present but dropped in clearinghouse translation.',
        '2. Search Evicore / CareCore by Rendering Provider TIN/NPI +-30 days from DOS. If CPT 29880 was authorized and 29881 was performed intra-operatively, submit an **Intra-Operative CPT Modification** with the signed Op-Note.',
        '3. If emergent/trauma admit (POS 21/23), file a Level-1 Reconsideration citing the Emergency Exception Rule with the ER Face Sheet + Operative Note.',
      ],
      suggestedSopCode: 'SOP-OR-12 v3.4',
    };
  }

  if (q.includes('25') || q.includes('59') || q.includes('xs') || q.includes('cardiology') || q.includes('modifier')) {
    return {
      text: 'In **Cardiology & Vascular Coding**, **Modifier -25** applies only to E/M codes (99202–99215) when a significant, separately identifiable E/M service occurs on the same day as a minor procedure. For NCCI Procedure-to-Procedure (PTP) edits between two non-E/M procedures, CMS requires specific **X{EPSU}** modifiers instead of generic Modifier -59 whenever applicable.',
      citations: ['SOP-CV-08 v2.1 (Cardiology Modifier Matrix)', 'Calibration Session CAL-302'],
      actionableSteps: [
        'Use **Modifier -25** on the E/M code only if the note documents a standalone history, exam/MDM, or new symptom evaluation beyond routine pre-procedure work.',
        'Use **Modifier -26** (Professional Component) when billing hospital outpatient/ASC Echo (93306) where the facility owns the equipment.',
        'Use **Modifier XS** (Separate Organ/Structure) for interventions on distinct coronary vessels (e.g., LAD vs RCA) rather than generic -59.',
      ],
      suggestedSopCode: 'SOP-CV-08 v2.1',
    };
  }

  if (q.includes('hipaa') || q.includes('posh') || q.includes('calling') || q.includes('verification') || q.includes('behavioral')) {
    return {
      text: 'For **Patient Calling & Behavioral Health (MindBridge)**, strict **3-Point HIPAA Identity Verification** and **Annual HIPAA/POSH Compliance** rules apply on every inbound and outbound call.',
      citations: ['COMP-HIPAA-2026', 'COMP-POSH-2026', 'Module MOD-PIP-105'],
      actionableSteps: [
        '1. State the mandatory call-recording notice first.',
        '2. Confirm **Full Patient Name**, **Date of Birth**, and **Billing Zip Code (or Last 4 SSN)** BEFORE naming the Behavioral Health specialty, dates of service, or account balance.',
        '3. Never leave clinical/specialty details on an unverified voicemail; leave only the administrative callback number.',
      ],
      suggestedSopCode: 'FLASH-2026-11-06',
    };
  }

  if (q.includes('bqt') || q.includes('pip') || q.includes('sla') || q.includes('scorecard') || q.includes('trigger')) {
    return {
      text: '**Trainer Sam’s Governance Engine** automatically evaluates daily Production, Quality Audits, TMS Utilization, and Monthly PKT scores to govern **Weekly Defect Training, BQT (Bottom Quartile Transformation), and PIP (Performance Improvement Plan)**:',
      citations: ['RCM L&D Governance Charter v4.0', 'Monthly Scorecard Weightage Matrix'],
      actionableSteps: [
        '**Composite Monthly Scorecard Formula:** Quality SLA (40%) + Production SLA (35%) + Monthly PKT Score (15%) + TMS Utilization & Shrinkage Adherence (10%).',
        '**Defect-Triggered Weekly Module:** Auto-assigned immediately when a QA logs any Critical or Major defect or when weekly Quality dips below project SLA (97.0%–98.5%).',
        '**BQT (Bottom Quartile Coaching):** Triggered when an associate lands in the bottom 25% of their tower or stays between 85%–92% Quality for 2 consecutive weeks (4-week structured coaching).',
        '**PIP (Performance Improvement Plan):** Triggered if Quality < 85%, >2 Critical/Fatal HIPAA/Integrity errors in a month, or unimproved after 4 weeks of BQT.',
      ],
    };
  }

  if (q.includes('pt') || q.includes('33') || q.includes('colonoscopy') || q.includes('gastro')) {
    return {
      text: 'When a **Preventive Screening Colonoscopy** converts to a diagnostic/therapeutic procedure (such as polyp removal CPT 45380 or 45385), the modifier depends on the payer type:',
      citations: ['SOP-GE-15 v4.0 (Gastroenterology Screening vs Diagnostic Alert)'],
      actionableSteps: [
        '**Medicare Part B:** Append **Modifier -PT** to the surgical CPT code (e.g., 45385-PT) and keep **ICD-10 Z12.11** as the Primary Diagnosis and the polyp finding (e.g., D12.2) as Secondary.',
        '**Commercial ACA Plans:** Append **Modifier -33** (Preventive Service) with Z12.11 primary so the patient’s deductible/copay (PR-1/PR-2) is waived under ACA preventive mandate.',
      ],
      suggestedSopCode: 'SOP-GE-15 v4.0',
    };
  }

  if (q.includes('29') || q.includes('timely filing') || q.includes('tfl') || q.includes('potf')) {
    return {
      text: 'To overturn a **CARC CO-29 (The time limit for filing has expired)** denial, payers require electronic clearinghouse **Proof of Timely Filing (POTF)** or Primary EOB proof for secondary claims:',
      citations: ['Module MOD-BQT-102 (Payer Timely Filing Matrix & POTF)'],
      actionableSteps: [
        '1. Pull the **277CA Claim Acknowledgment Report** showing Status Category `A1/A2` (Accepted into Payer Adjudication System) with the Payer Claim Control Number (PCCN) dated prior to the TFL deadline.',
        '2. If the claim is Secondary, verify the adjudication date on the **Primary EOB/835 ERA** — Secondary TFL starts from the Primary payment/denial date, not DOS.',
        '3. Route any claim within 15 days of TFL expiration directly to the **Priority Appeals Queue**.',
      ],
    };
  }

  return {
    text: `I analyzed your query ("${query}") against our active **RCM SOPs, Payer Playbooks, CARC/RARC Denial Matrix, and L&D Governance Rules**. Here is the recommended operational protocol:`,
    citations: ['SOP-OR-12 v3.4', 'SOP-CV-08 v2.1', 'FLASH-2026-11-06', 'RCM Quality & BQT Rubric'],
    actionableSteps: [
      'Verify the specific CARC & RARC group codes on the 835 ERA before selecting an adjustment or appeal action.',
      'Check the Specialty Playbook for client-specific write-off thresholds and required supporting clinical documents (Op-Note, Auth #, 277CA).',
      'Document your action using the standardized 8-point SOAP note template in the PMS to ensure 100% QA audit compliance.',
    ],
  };
}
