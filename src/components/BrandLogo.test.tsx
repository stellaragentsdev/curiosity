/// <reference types="vite/client" />
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import html from '../../index.html?raw';
import { CuriosityBrandLogo } from './FiveDimensionsCommandCenter';

describe('rover brand logo', () => {
  it('renders the rover image as decorative next to the Curiosity wordmark and tagline', () => {
    const out = renderToStaticMarkup(<CuriosityBrandLogo />);
    expect(out).toMatch(/<img[^>]*alt=""[^>]*aria-hidden="true"/);
    expect(out).toContain('Curiosity');
    expect(out).toContain('L&amp;D Intelligence System');
  });
  it('uses the rover favicon', () => {
    expect(html).toContain('<link rel="icon" type="image/png" href="/favicon-rover.png" />');
  });
});
