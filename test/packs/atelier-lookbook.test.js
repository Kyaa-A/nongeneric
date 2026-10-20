import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ATELIER_LOOKBOOK_WORLD, compileAtelierLookbookCss } from '../../packs/worlds/atelier-lookbook.mjs';

describe('Atelier Lookbook World Pack', () => {
  it('should conform to the AestheticWorld shape', () => {
    assert.equal(ATELIER_LOOKBOOK_WORLD.id, 'atelier-lookbook');
    assert.equal(ATELIER_LOOKBOOK_WORLD.name, 'Independent Atelier & Tactile Lookbook');
    assert.equal(ATELIER_LOOKBOOK_WORLD.category, 'editorial_fashion');
    assert.ok(ATELIER_LOOKBOOK_WORLD.VisitorModes.includes('immerse'));
    assert.ok(ATELIER_LOOKBOOK_WORLD.VisitorModes.includes('convert'));
    assert.ok(ATELIER_LOOKBOOK_WORLD.VisitorModes.includes('decide'));

    assert.match(ATELIER_LOOKBOOK_WORLD.Typography.display, /Playfair Display/);
    assert.match(ATELIER_LOOKBOOK_WORLD.Typography.body, /Instrument Sans/);
    assert.match(ATELIER_LOOKBOOK_WORLD.Typography.mono, /IBM Plex Mono/);

    assert.equal(ATELIER_LOOKBOOK_WORLD.Palette['unbleached-silk'], 'oklch(0.96 0.012 78)');
    assert.equal(ATELIER_LOOKBOOK_WORLD.Palette['espresso-umber'], 'oklch(0.18 0.018 52)');
    assert.equal(ATELIER_LOOKBOOK_WORLD.Palette['oxidized-bronze'], 'oklch(0.52 0.09 64)');

    assert.ok(ATELIER_LOOKBOOK_WORLD.LayoutGrammar);
    assert.ok(ATELIER_LOOKBOOK_WORLD.SurfaceRules);
    assert.ok(ATELIER_LOOKBOOK_WORLD.MotionLanguage);
    assert.ok(ATELIER_LOOKBOOK_WORLD.AntiHero);
  });

  it('should compile CSS with correct tokens', () => {
    const css = compileAtelierLookbookCss();
    assert.match(css, /--ng-unbleached-silk:\s*oklch\(0\.96 0\.012 78\)/);
    assert.match(css, /--ng-espresso-umber:\s*oklch\(0\.18 0\.018 52\)/);
    assert.match(css, /--ng-oxidized-bronze:\s*oklch\(0\.52 0\.09 64\)/);
    assert.match(css, /--ng-font-display:\s*'Playfair Display', serif/);
    assert.match(css, /--ng-font-body:\s*'Instrument Sans', sans-serif/);
    assert.match(css, /--ng-font-mono:\s*'IBM Plex Mono', monospace/);
  });
});
