import { getWorldById, WORLD_CONCEPTS } from './catalog.js';
import { generateTokens } from './tokens.js';

export function generateWorldSpecimenHtml(worldId: string): string {
  const world = getWorldById(worldId) ?? WORLD_CONCEPTS[0]!;
  const cssTokens = generateTokens(world.id, 'css');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${world.name} — NonGeneric Aesthetic World Specimen</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${world.tokens.googleFontsUrl}" rel="stylesheet" />
  <style>
${cssTokens}

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      min-height: 100dvh;
      background-color: var(--ng-ground-primary);
      color: var(--ng-ink-primary);
      font-family: var(--ng-font-body);
      font-size: var(--ng-step-0);
      line-height: 1.6;
      overflow-x: hidden;
    }

    .specimen-shell {
      width: min(100%, 1320px);
      margin-inline: auto;
      padding: clamp(20px, 4vw, 56px);
      display: grid;
      gap: clamp(28px, 4vw, 64px);
    }

    .masthead {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 18px;
      border-bottom: 1px solid var(--ng-border-hairline);
    }

    .masthead-meta {
      font-family: var(--ng-font-mono);
      font-size: var(--ng-step--1);
      color: var(--ng-ink-muted);
      font-variant-numeric: tabular-nums;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .stage-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
      gap: clamp(24px, 3.5vw, 48px);
      align-items: start;
    }

    .editorial-lead {
      min-width: 0;
      display: grid;
      gap: 20px;
    }

    .kicker {
      font-family: var(--ng-font-mono);
      font-size: var(--ng-step--1);
      color: var(--ng-accent-primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    h1 {
      font-family: var(--ng-font-display);
      font-size: var(--ng-step-4);
      line-height: 1.06;
      letter-spacing: -0.025em;
      color: var(--ng-ink-primary);
    }

    .summary-prose {
      max-width: 64ch;
      color: var(--ng-ink-secondary);
      font-size: var(--ng-step-1);
    }

    .interactive-instrument {
      min-width: 0;
      background-color: var(--ng-ground-elevated);
      border: 1px solid var(--ng-border-hairline);
      padding: clamp(20px, 3vw, 32px);
      display: grid;
      gap: 20px;
    }

    .instrument-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--ng-border-hairline);
      font-family: var(--ng-font-mono);
      font-size: var(--ng-step--1);
      font-variant-numeric: tabular-nums;
    }

    .swatch-strip {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 120px), 1fr));
      gap: 12px;
    }

    .swatch-plate {
      min-width: 0;
      padding: 14px;
      border: 1px solid var(--ng-border-hairline);
      background-color: var(--ng-ground-primary);
      display: grid;
      gap: 6px;
    }

    .swatch-chip {
      height: 28px;
      border: 1px solid var(--ng-border-hairline);
    }

    .swatch-label {
      font-family: var(--ng-font-mono);
      font-size: 0.78rem;
      color: var(--ng-ink-secondary);
      font-variant-numeric: tabular-nums;
    }

    .control-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .tactile-btn {
      min-height: 44px;
      min-width: 44px;
      padding: 10px 18px;
      font-family: var(--ng-font-mono);
      font-size: var(--ng-step--1);
      background-color: var(--ng-ground-primary);
      color: var(--ng-ink-primary);
      border: 1px solid var(--ng-border-hairline);
      cursor: pointer;
    }

    .tactile-btn:focus-visible {
      outline: 2px solid var(--ng-accent-primary);
      outline-offset: 2px;
    }

    .tactile-btn[aria-pressed="true"] {
      background-color: var(--ng-accent-primary);
      color: var(--ng-ground-primary);
    }

    .ledger-table-wrap {
      overflow-x: auto;
      border: 1px solid var(--ng-border-hairline);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-family: var(--ng-font-mono);
      font-size: var(--ng-step--1);
      font-variant-numeric: tabular-nums;
    }

    th, td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--ng-border-hairline);
      text-align: left;
    }

    th.num, td.num {
      text-align: right;
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
</head>
<body>
  <main class="specimen-shell">
    <header class="masthead" data-ng-animate>
      <span class="masthead-meta">WORLD ID // ${world.id}</span>
      <span class="masthead-meta">WELL TIER // ${world.wellTier.toUpperCase()} · MODES: ${world.allowedModes.join(' / ').toUpperCase()}</span>
    </header>

    <section class="stage-grid">
      <div class="editorial-lead">
        <p class="kicker" data-ng-animate>${world.familyLabel}</p>
        <h1 data-ng-animate>${world.name}</h1>
        <p class="summary-prose" data-ng-animate>${world.spark}</p>
        <div class="control-bar" data-ng-animate>
          <button type="button" class="tactile-btn" id="btn-mode-persuade" aria-pressed="true">MODE: PERSUADE [1]</button>
          <button type="button" class="tactile-btn" id="btn-mode-operate" aria-pressed="false">MODE: OPERATE [2]</button>
          <button type="button" class="tactile-btn" id="btn-mode-read" aria-pressed="false">MODE: READ [3]</button>
        </div>
      </div>

      <aside class="interactive-instrument" aria-label="Live OKLCH & GSAP Telemetry Specimen">
        <div class="instrument-header">
          <span>GSAP EASE // ${world.gsapRecipe.primaryEase}</span>
          <span id="live-mode-readout">ACTIVE: PERSUADE</span>
        </div>

        <div class="swatch-strip">
          <div class="swatch-plate">
            <div class="swatch-chip" style="background: var(--ng-ground-primary)"></div>
            <span class="swatch-label">GROUND PRIMARY</span>
          </div>
          <div class="swatch-plate">
            <div class="swatch-chip" style="background: var(--ng-accent-primary)"></div>
            <span class="swatch-label">ACCENT PRIMARY</span>
          </div>
          <div class="swatch-plate">
            <div class="swatch-chip" style="background: var(--ng-accent-secondary)"></div>
            <span class="swatch-label">ACCENT SECONDARY</span>
          </div>
        </div>

        <div class="ledger-table-wrap">
          <table>
            <thead>
              <tr>
                <th>SYSTEM DIMENSION</th>
                <th>SPECIFICATION</th>
                <th class="num">TARGET FPS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Display Voice</td>
                <td>${world.tokens.fontDisplay.replace(/'/g, '')}</td>
                <td class="num">60.0</td>
              </tr>
              <tr>
                <td>Primary GSAP Plugins</td>
                <td>${world.gsapRecipe.plugins.join(', ')}</td>
                <td class="num">60.0</td>
              </tr>
              <tr>
                <td>Reduced Motion</td>
                <td>${world.gsapRecipe.reducedMotionFallback}</td>
                <td class="num">60.0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </aside>
    </section>
  </main>

  <script>
    (function () {
      if (typeof window !== 'undefined' && window.gsap && window.gsap.registerPlugin) {
        window.gsap.registerPlugin();
      }
      const buttons = Array.from(document.querySelectorAll('.tactile-btn'));
      const readout = document.getElementById('live-mode-readout');
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          buttons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
          btn.setAttribute('aria-pressed', 'true');
          if (readout) {
            readout.textContent = 'ACTIVE: ' + (btn.textContent || '').replace('MODE: ', '');
          }
        });
      });
    })();
  </script>
</body>
</html>`;
}
