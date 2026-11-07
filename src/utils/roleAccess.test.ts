/// <reference types="vite/client" />
import html from '../../index.html?raw';
import { describe, expect, it } from 'vitest';
import { BRAND_FULL_TITLE, BRAND_TAGLINE } from '../config/brand';
import {
  PROFILE_DIMENSIONS,
  PROFILE_PROCESS_TABS,
  defaultTabForDimension,
  isDimensionAllowed,
  isTabAllowed,
  profileForPersona,
} from './roleAccess';

describe('profile mapping', () => {
  it('maps personas to the three sample profiles', () => {
    expect(profileForPersona('associate')).toBe('associate');
    expect(profileForPersona('trainer')).toBe('trainer');
    expect(profileForPersona('admin')).toBe('admin');
    expect(profileForPersona('operations')).toBe('admin');
  });
});

describe('module visibility', () => {
  it('associate does not see admin or trainer-only modules', () => {
    for (const t of ['admin_studio', 'upload', 'reports', 'trainer_hub', 'scorecards', 'quality', 'dashboard']) {
      expect(isTabAllowed('associate', t)).toBe(false);
    }
    expect(isDimensionAllowed('associate', 'dim_nht_training')).toBe(false);
    expect(isTabAllowed('associate', 'nht_training')).toBe(false);
  });
  it('associate keeps personal learning entry points', () => {
    for (const t of ['overview', 'associate_portal', 'knowledge', 'training_modules', 'org_learning', 'cs_training', 'games_hub']) {
      expect(isTabAllowed('associate', t)).toBe(true);
    }
  });
  it('trainer sees coaching and quality but not admin management', () => {
    for (const t of ['trainer_hub', 'quality', 'scorecards', 'nht_training']) expect(isTabAllowed('trainer', t)).toBe(true);
    for (const t of ['admin_studio', 'upload', 'reports']) expect(isTabAllowed('trainer', t)).toBe(false);
  });
  it('admin sees every dimension and process tab', () => {
    expect(PROFILE_DIMENSIONS.admin).toHaveLength(5);
    expect(PROFILE_PROCESS_TABS.admin).toEqual(expect.arrayContaining(['admin_studio', 'reports', 'upload']));
  });
  it('default tab for a dimension is always allowed for that profile', () => {
    for (const p of ['associate', 'trainer', 'admin'] as const) {
      for (const d of PROFILE_DIMENSIONS[p]) expect(isTabAllowed(p, defaultTabForDimension(p, d))).toBe(true);
    }
  });
});

describe('branding', () => {
  it('uses the L&D Intelligence System tagline', () => {
    expect(BRAND_TAGLINE).toBe('L&D Intelligence System');
    expect(BRAND_FULL_TITLE).toBe('Curiosity — L&D Intelligence System');
    expect(html).toContain('<title>Curiosity — L&D Intelligence System</title>');
    expect(html).not.toContain('RCM Learning & Performance Intelligence');
  });
});
