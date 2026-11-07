import { describe, expect, it } from 'vitest';
import { classifyDemoQuery, generateTrainerSamResponse, QUICK_AI_PROMPTS } from './rcmAiAssistant';

describe('classifyDemoQuery', () => {
  it('routes each quick prompt to its intended topic', () => {
    expect(QUICK_AI_PROMPTS.map(classifyDemoQuery)).toEqual([
      'prior_auth', 'cardiology_modifier', 'hipaa_calling', 'governance', 'colonoscopy_modifier', 'timely_filing',
    ]);
  });
  it('regression: Modifier -PT vs -33 goes to colonoscopy, not cardiology', () => {
    expect(classifyDemoQuery('What is the difference between Modifier -PT and -33 on GI Colonoscopy?')).toBe('colonoscopy_modifier');
    expect(classifyDemoQuery('When should I use modifier PT?')).toBe('colonoscopy_modifier');
  });
  it.each(['Can you write a prompt for me?', 'Will the payer accept this?', 'Report for 2025', 'Update in 2029', 'option 33rd', 'xsmall'])(
    'no false positive for %s', (q) => expect(classifyDemoQuery(q)).toBe('fallback'));
  it('generic "modifier" alone falls back', () => expect(classifyDemoQuery('which modifier?')).toBe('fallback'));
  it('labels every response as demo', () => {
    for (const q of [...QUICK_AI_PROMPTS, 'hello']) expect(generateTrainerSamResponse(q).text.startsWith('[DEMO]')).toBe(true);
  });
});
