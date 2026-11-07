import type { AppDimensionId, EnterprisePersona } from '../components/FiveDimensionsCommandCenter';

/**
 * Demo profile presentation rules. These only change what the UI shows for a
 * sample persona; they are NOT access control (there is no login or backend).
 */
export type ProfileKind = 'associate' | 'trainer' | 'admin';

export function profileForPersona(persona: EnterprisePersona): ProfileKind {
  if (persona === 'associate') return 'associate';
  if (persona === 'trainer') return 'trainer';
  return 'admin'; // 'admin' and 'operations' share the organisation view
}

export const PROFILE_LABELS: Record<ProfileKind, string> = {
  associate: 'Associate',
  trainer: 'Trainer / QA',
  admin: 'L&D Admin / Operations',
};

export const DIMENSION_LABELS: Record<AppDimensionId, string> = {
  dim_org_learning: 'Organizational Learning',
  dim_process_intell: 'Process Training Intell',
  dim_nht_training: 'NHT Training',
  dim_cs_training: 'CS Trainings',
  dim_games_hub: 'Learning Hub & Games',
};

const ALL_DIMENSIONS = Object.keys(DIMENSION_LABELS) as AppDimensionId[];

export const PROFILE_DIMENSIONS: Record<ProfileKind, AppDimensionId[]> = {
  associate: ['dim_process_intell', 'dim_org_learning', 'dim_cs_training', 'dim_games_hub'],
  trainer: ['dim_process_intell', 'dim_nht_training', 'dim_cs_training', 'dim_org_learning', 'dim_games_hub'],
  admin: ALL_DIMENSIONS,
};

/** Process Training Intelligence sub-tabs visible per profile. */
export const PROFILE_PROCESS_TABS: Record<ProfileKind, string[]> = {
  associate: ['associate_portal', 'knowledge'],
  trainer: ['dashboard', 'project_directories', 'scorecards', 'clp_dashboard', 'trainer_hub', 'quality', 'associate_portal', 'knowledge'],
  admin: ['dashboard', 'project_directories', 'scorecards', 'clp_dashboard', 'trainer_hub', 'quality', 'associate_portal', 'admin_studio', 'reports', 'upload', 'knowledge'],
};

const DIMENSION_TABS: Record<string, AppDimensionId> = {
  org_learning: 'dim_org_learning',
  nht_training: 'dim_nht_training',
  cs_training: 'dim_cs_training',
  games_hub: 'dim_games_hub',
};

/** Tabs reachable outside the sub-nav (e.g. from overview cards). */
const EXTRA_TABS: Record<ProfileKind, string[]> = {
  associate: ['training_modules', 'learning', 'compliance'],
  trainer: ['training_modules', 'learning', 'compliance'],
  admin: ['training_modules', 'learning', 'compliance'],
};

export function isTabAllowed(profile: ProfileKind, tab: string): boolean {
  if (tab === 'overview') return true;
  if (tab in DIMENSION_TABS) return PROFILE_DIMENSIONS[profile].includes(DIMENSION_TABS[tab]);
  return PROFILE_PROCESS_TABS[profile].includes(tab) || EXTRA_TABS[profile].includes(tab);
}

export function isDimensionAllowed(profile: ProfileKind, dim: AppDimensionId): boolean {
  return PROFILE_DIMENSIONS[profile].includes(dim);
}

/** First tab to open when a profile selects a dimension. */
export function defaultTabForDimension(profile: ProfileKind, dim: AppDimensionId): string {
  if (dim === 'dim_process_intell') return PROFILE_PROCESS_TABS[profile][0];
  return Object.keys(DIMENSION_TABS).find((t) => DIMENSION_TABS[t] === dim) ?? 'overview';
}

/**
 * Resolve the tab/workspace actually rendered for a profile. Pure and
 * synchronous: any disallowed request falls back to the profile overview.
 */
export function resolveView(
  profile: ProfileKind,
  tab: string,
  dimension: AppDimensionId
): { tab: string; dimension: AppDimensionId } {
  const dimOk = isDimensionAllowed(profile, dimension);
  const tabOk = isTabAllowed(profile, tab);
  if (dimOk && tabOk) return { tab, dimension };
  return { tab: 'overview', dimension: dimOk ? dimension : 'dim_process_intell' };
}
