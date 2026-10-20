import test from 'node:test';
import assert from 'node:assert';
import { FINTECH_LEDGER_WORLD, validateFinancialTableMarkup } from '../../packs/worlds/fintech-ledger.mjs';

test('FINTECH_LEDGER_WORLD structure', () => {
  assert.strictEqual(FINTECH_LEDGER_WORLD.id, 'fintech-ledger');
  assert.strictEqual(FINTECH_LEDGER_WORLD.name, 'Institutional Ledger & High-Density Telemetry');
  assert.strictEqual(FINTECH_LEDGER_WORLD.category, 'swiss_grids');
  assert.deepStrictEqual(FINTECH_LEDGER_WORLD.VisitorModes, ['operate', 'decide']);
  assert.strictEqual(FINTECH_LEDGER_WORLD.Typography.display, 'Instrument Serif');
  assert.strictEqual(FINTECH_LEDGER_WORLD.Typography.body, 'Plus Jakarta Sans');
  assert.strictEqual(FINTECH_LEDGER_WORLD.Typography.mono, 'JetBrains Mono');

  assert.ok(FINTECH_LEDGER_WORLD.Palette.alabaster.includes('oklch'));
  assert.ok(FINTECH_LEDGER_WORLD.Palette.obsidian.includes('oklch'));

  assert.strictEqual(FINTECH_LEDGER_WORLD.LayoutGrammar.numericCells, 'right-aligned');
  assert.strictEqual(FINTECH_LEDGER_WORLD.SurfaceRules.entry, 'direct-to-workspace entry');
});

test('validateFinancialTableMarkup() validation', () => {
  const validHtml = `
    <table>
      <tr>
        <td class="text-right tabular-nums">1,234.56</td>
      </tr>
    </table>
  `;
  const validResult = validateFinancialTableMarkup(validHtml);
  assert.strictEqual(validResult.valid, true);

  const missingTabularNumsHtml = `
    <table>
      <tr>
        <td class="text-right">1,234.56</td>
      </tr>
    </table>
  `;
  const missingResult = validateFinancialTableMarkup(missingTabularNumsHtml);
  assert.strictEqual(missingResult.valid, false);
  assert.ok(missingResult.errors.includes('Missing tabular-nums for numeric alignment'));

  const notRightAlignedHtml = `
    <table>
      <tr>
        <td class="tabular-nums">1,234.56</td>
      </tr>
    </table>
  `;
  const notAlignedResult = validateFinancialTableMarkup(notRightAlignedHtml);
  assert.strictEqual(notAlignedResult.valid, false);
  assert.ok(notAlignedResult.errors.includes('Numeric cells are not right-aligned'));

  const slopHtml = `
    <div class="kpi-card">
      <span class="badge">+12.5%</span>
      <span class="tabular-nums text-right">1,000</span>
    </div>
  `;
  const slopResult = validateFinancialTableMarkup(slopHtml);
  assert.strictEqual(slopResult.valid, false);
  assert.ok(slopResult.errors.includes('Found sparkline-card slop'));
});
