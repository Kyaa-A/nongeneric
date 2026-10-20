import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ASYMMETRIC_BENTO_PACK, generateAsymmetricBentoBlueprint } from '../../packs/components/asymmetric-bento.mjs';
import { detectInText, scanTargets } from '../../scripts/detector.js';

test('ASYMMETRIC_BENTO_PACK metadata properties', () => {
    assert.equal(ASYMMETRIC_BENTO_PACK.id, 'asymmetric-bento');
    assert.equal(ASYMMETRIC_BENTO_PACK.title, 'Asymmetric 7:5 Bento & Specimen Stage');
    assert.equal(ASYMMETRIC_BENTO_PACK.category, 'components');
    assert.equal(ASYMMETRIC_BENTO_PACK.typography.display, 'Cormorant Garamond');
    assert.equal(ASYMMETRIC_BENTO_PACK.typography.body, 'Work Sans');
    assert.equal(ASYMMETRIC_BENTO_PACK.typography.mono, 'IBM Plex Mono');
});

const frameworks = ['vanilla', 'react', 'vue', 'svelte'];

test('generateAsymmetricBentoBlueprint code analysis', () => {
    for (const framework of frameworks) {
        const blueprint = generateAsymmetricBentoBlueprint({ framework });

        assert.equal(blueprint.id, 'asymmetric-bento');
        assert.equal(blueprint.framework, framework);

        const findings = detectInText(blueprint.code, 'AsymmetricBento.js', { scopes: ['motion', 'security'] });
        assert.equal(findings.length, 0, `Expected 0 findings for ${framework}, but got ${findings.length}`);
    }
});

test('Showcase HTML validation', () => {
    const report = scanTargets(['examples/showcases/asymmetric-bento.html']);

    if (report.primaryCount > 0) {
        console.error('Detector findings for showcase:');
        for (const finding of report.findings) {
            console.error(`- [${finding.ruleId}] Line ${finding.line}: ${finding.description}`);
        }
    }

    assert.equal(report.primaryCount, 0, `Expected 0 primary findings, but found ${report.primaryCount}`);
});
