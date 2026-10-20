import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { detectInText, scanTargets } from '../scripts/detector.js';
import { ANTIPATTERN_RULES } from '../scripts/rules-registry.js';

describe('NonGeneric 82-Rule Anti-Slop, Motion & Responsive Detector', () => {
  it('registers all 82 deterministic rules across 6 categories', () => {
    assert.equal(ANTIPATTERN_RULES.length, 82);
    const ids = new Set(ANTIPATTERN_RULES.map((r) => r.id));
    assert.equal(ids.size, 82, 'All rule IDs must be unique');
  });

  it('passes examples/crafted-knightvision.html with 0 primary findings and 0 advisories', () => {
    const report = scanTargets(['examples/crafted-knightvision.html']);
    assert.equal(report.primaryCount, 0, JSON.stringify(report.findings, null, 2));
    assert.equal(report.advisoryCount, 0, JSON.stringify(report.advisories, null, 2));
  });

  it('flags visual, copy, motion, and responsive slop in examples/broken-ai-slop.html', () => {
    const report = scanTargets(['examples/broken-ai-slop.html']);
    assert.ok(report.primaryCount >= 15, `Expected >=15 primary findings, got ${report.primaryCount}`);
    const ruleIds = new Set(report.findings.map((f) => f.ruleId));
    assert.ok(ruleIds.has('overused-font'));
    assert.ok(ruleIds.has('gradient-text'));
    assert.ok(ruleIds.has('purple-blue-gradient'));
    assert.ok(ruleIds.has('side-tab'));
    assert.ok(ruleIds.has('bounce-easing'));
    assert.ok(ruleIds.has('gsap-layout-thrash'));
    assert.ok(ruleIds.has('viewport-width-overflow'));
    assert.ok(ruleIds.has('rigid-desktop-width'));
    assert.ok(ruleIds.has('marketing-buzzword'));
  });

  it('detects GSAP motion anti-patterns accurately', () => {
    const badGsap = `
      import gsap from 'gsap';
      import { ScrollTrigger } from 'gsap/ScrollTrigger';
      // Missing gsap.registerPlugin(ScrollTrigger)
      useEffect(() => {
        const tl = gsap.timeline();
        tl.to('.box', { width: 400, top: 20, scrollTrigger: { trigger: '.box' } });
        gsap.to('.panel', {
          xPercent: -100,
          ease: 'power2.out',
          scrollTrigger: { containerAnimation: otherTween }
        });
      }, []);
    `;
    const findings = detectInText(badGsap, 'Component.tsx');
    const ids = new Set(findings.map((f) => f.ruleId));
    assert.ok(ids.has('gsap-layout-thrash'));
    assert.ok(ids.has('gsap-nested-scrolltrigger'));
    assert.ok(ids.has('gsap-container-ease'));
    assert.ok(ids.has('gsap-missing-cleanup'));
    assert.ok(ids.has('gsap-missing-register'));
    assert.ok(ids.has('missing-reduced-motion'));
  });

  it('honors inline nongeneric-disable and impeccable-disable waivers', () => {
    const code = `
      /* nongeneric-disable-next-line overused-font */
      .legacy { font-family: 'Inter', sans-serif; }
      .brand { font-family: 'Roboto', sans-serif; } /* impeccable-disable-line overused-font */
    `;
    const findings = detectInText(code, 'styles.css');
    assert.equal(findings.filter((f) => f.ruleId === 'overused-font').length, 0);
  });
});
