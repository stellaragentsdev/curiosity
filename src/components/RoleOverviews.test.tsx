import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AdminOverview, TrainerOverview } from './RoleOverviews';
import {
  INITIAL_ASSOCIATES, INITIAL_AUTO_TRIGGERED_TICKETS, INITIAL_CALIBRATIONS, INITIAL_COMPLIANCE_COURSES,
  INITIAL_DEFECTS, INITIAL_LEARNING_MODULES, INITIAL_PROJECTS, INITIAL_SOPS,
} from '../data/mockRcmData';
import { INITIAL_NHT_BATCHES } from './FiveDimensionsCommandCenter';

const noop = () => {};

describe('mobile layouts for role overview tables (static markup)', () => {
  it('trainer coaching queue has a mobile card list and a desktop-only table', () => {
    const html = renderToStaticMarkup(
      <TrainerOverview tickets={INITIAL_AUTO_TRIGGERED_TICKETS} associates={INITIAL_ASSOCIATES} defects={INITIAL_DEFECTS}
        calibrations={INITIAL_CALIBRATIONS} nhtBatches={INITIAL_NHT_BATCHES} learningModules={INITIAL_LEARNING_MODULES} onNavigate={noop} />
    );
    expect(html).toMatch(/<ul class="[^"]*sm:hidden[^"]*" aria-label="Coaching queue">/);
    expect(html).toMatch(/<table class="[^"]*hidden[^"]*min-w-\[520px\][^"]*sm:table/);
    const mobile = html.slice(html.indexOf('aria-label="Coaching queue"'), html.indexOf('<table'));
    const open = INITIAL_AUTO_TRIGGERED_TICKETS.filter((t) => t.status !== 'Closed — Summary Logged').slice(0, 6);
    expect((mobile.match(/>Review</g) ?? []).length).toBe(open.length);
    expect(mobile).toContain('Quality ');
  });
  it('admin project health has a mobile card list and a desktop-only table', () => {
    const html = renderToStaticMarkup(
      <AdminOverview projects={INITIAL_PROJECTS} learningModules={INITIAL_LEARNING_MODULES} complianceCourses={INITIAL_COMPLIANCE_COURSES}
        sops={INITIAL_SOPS} summary={{ avgHealth: '90', avgQual: '95', avgCompliance: '88', totalBqt: 1, totalPip: 0, pendingRebuttals: 2 }} onNavigate={noop} />
    );
    expect(html).toMatch(/aria-label="Project health"/);
    expect(html).toMatch(/<table class="[^"]*hidden[^"]*sm:table/);
  });
});
