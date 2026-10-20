import { createHash, randomBytes } from 'node:crypto';
import { STRUCTURAL_COMPOSITIONS, WORLD_CONCEPTS } from './catalog.js';
export function sha256Hex(input) {
    return createHash('sha256').update(input, 'utf8').digest('hex');
}
function rankByDigest(items, salt, getId) {
    return [...items]
        .map((item) => {
        const id = getId(item);
        const digest = sha256Hex(`${salt}:${id}`);
        return { item, id, digest };
    })
        .sort((a, b) => b.digest.localeCompare(a.digest) || a.id.localeCompare(b.id))
        .map((entry) => entry.item);
}
const MODE_RULES_MAP = {
    persuade: {
        directions: 'On a Persuade surface the design is what the visitor judges, so the world may own and structure the page. The opening must make the offer intelligible and desirable, expose a clear primary action, and demonstrate a working proof in the first viewport that only this product can deliver.',
        comps: 'Material coverage is required: the world owns the ground, major surfaces, and display headlines. Never fall back to a generic SaaS split hero with a badge pill over a 3-column icon-in-colored-circle grid.',
    },
    experience: {
        directions: 'On an Experience surface the interactive or narrative work itself leads from the first viewport. The world provides the spatial stage, kinetic typography, and sensory feedback.',
        comps: 'Commit to one dominant spatial or interactive move per viewport region while keeping surrounding controls legible, keyboard-accessible, and reduced-motion-safe.',
    },
    operate: {
        directions: 'On an Operate surface the visitor came to get a job done. Someone who uses tools in this category should know where everything is before they notice the world. The world lends ONLY four things: type, palette, density, and one signature move. It never costumes standard controls or navigation.',
        comps: 'Every control is a standard, high-craft platform control (sortable tables, filter bars, keyboard shortcuts, clear status colors). State colors (emerald for healthy, amber for warning, red for critical) carry strict semantic meaning.',
    },
    read: {
        directions: 'On a Read surface the visitor came to understand something. The world owns the frame (masthead, navigation rail, ground, section openers, marginalia, and code/table styling) while the reading column stays serene at 60–75ch and >=16px.',
        comps: 'Never push noisy world textures or decorative animations behind the running prose column. Comprehension, contrast (>=7:1), and wayfinding lead at every step.',
    },
};
export function rollConceptSeed(options = {}) {
    const scope = options.scope ?? 'direction';
    const mode = options.mode ?? 'persuade';
    const grain = options.grain ?? 'product';
    const platform = options.platform ?? 'web';
    const reroll = Math.max(0, options.reroll ?? 0);
    const candidateCount = Math.min(7, Math.max(5, options.candidateCount ?? 6));
    const key = options.fromKey && /^[a-f0-9]{8}$/i.test(options.fromKey)
        ? options.fromKey.toLowerCase()
        : randomBytes(4).toString('hex');
    const seedReference = `ng-${sha256Hex(`nongeneric-seed:${key}:${reroll}`).slice(0, 8)}`;
    // Break the LLM #1 ranking rut by deterministically selecting from indices 2..candidateCount
    const indexDigest = Number.parseInt(sha256Hex(`${scope}:${key}:index:${reroll}`).slice(0, 8), 16);
    const assignedIndex = 2 + (indexDigest % (candidateCount - 1));
    const indicesPool = Array.from({ length: candidateCount }, (_, idx) => idx + 1);
    const rankedIndices = rankByDigest(indicesPool, `${scope}:${key}:dealt:${reroll}`, (n) => String(n));
    const dealtIndices = [
        assignedIndex,
        rankedIndices.find((n) => n !== assignedIndex) ?? 2,
        rankedIndices.find((n) => n !== assignedIndex && n !== rankedIndices[0]) ?? 3,
    ];
    // Select Challenger Worlds across well tiers
    const tierQuotas = mode === 'operate'
        ? { graphic: 2, interaction: 2, atmosphere: 0 }
        : { graphic: 2, interaction: 1, atmosphere: 1 };
    const tiers = ['graphic', 'interaction', 'atmosphere'];
    const challengers = [];
    for (const tier of tiers) {
        const quota = tierQuotas[tier];
        if (quota <= 0)
            continue;
        const pool = WORLD_CONCEPTS.filter((w) => w.wellTier === tier && w.allowedModes.includes(mode));
        const ranked = rankByDigest(pool.length > 0 ? pool : WORLD_CONCEPTS.filter((w) => w.wellTier === tier), `${scope}:${key}:tier:${tier}:${reroll}`, (w) => w.id);
        challengers.push(...ranked.slice(0, quota));
    }
    // Select Structural Compositions
    const compPool = STRUCTURAL_COMPOSITIONS.filter((c) => c.surface === mode);
    const rankedComps = rankByDigest(compPool.length > 0 ? compPool : STRUCTURAL_COMPOSITIONS, `${scope}:${key}:comp:${grain}:${reroll}`, (c) => c.id);
    const compositions = rankedComps.slice(0, 3);
    const result = {
        key,
        seedReference,
        scope,
        mode,
        grain,
        platform,
        reroll,
        assignedIndex,
        dealtIndices,
        challengers,
        compositions,
        modeRules: MODE_RULES_MAP[mode],
    };
    if (options.register) {
        result.register = options.register;
    }
    return result;
}
export function formatConceptSeed(roll) {
    const lines = [];
    lines.push(`${roll.scope.toUpperCase()} CONCEPT SEED (key: ${roll.key}; ref: ${roll.seedReference}; mode: ${roll.mode}; grain: ${roll.grain}; platform: ${roll.platform}; reroll: ${roll.reroll}; source: offline-catalog)`);
    lines.push('');
    if (roll.scope === 'direction') {
        lines.push(`ASSIGNED GROUNDED CANDIDATE: Build candidate #${roll.assignedIndex} of your grounded list (breaks the LLM #1 ranking rut).`);
    }
    else {
        lines.push(`DEALT SURFACE STRUCTURES: Present candidates ${roll.dealtIndices.join(', ')} of your grounded list; candidate #${roll.assignedIndex} leads.`);
    }
    lines.push('');
    lines.push('CHALLENGER WORLDS (Fuse & Weigh on Audience Identification + Product Clarity):');
    roll.challengers.forEach((c, idx) => {
        lines.push(`  ${idx + 1}. ${c.name} (${c.form})`);
        lines.push(`     SOURCE ID: ${c.id} [${c.wellTier} well · ${c.familyLabel}]`);
        lines.push(`     CREATIVE SPARK: ${c.spark}`);
        lines.push(`     SYSTEM GRAMMAR:`);
        for (const rule of c.system) {
            lines.push(`       - ${rule}`);
        }
        lines.push(`     GSAP MOTION RECIPE (${c.gsapRecipe.plugins.join(', ')} | ease: ${c.gsapRecipe.primaryEase}):`);
        lines.push(`       - Entrance: ${c.gsapRecipe.entrancePattern}`);
        lines.push(`       - Scroll:   ${c.gsapRecipe.scrollPattern}`);
        lines.push(`       - Interact: ${c.gsapRecipe.interactionPattern}`);
        lines.push(`       - Reduced:  ${c.gsapRecipe.reducedMotionFallback}`);
        lines.push(`     WEB LEVERAGE: ${c.webLeverage}`);
        lines.push('');
    });
    lines.push('STRUCTURAL COMPOSITIONS (Rivals to Habitual SaaS Layouts):');
    roll.compositions.forEach((comp, idx) => {
        lines.push(`  C${idx + 1}. ${comp.name} (${comp.form})`);
        lines.push(`      SOURCE ID: ${comp.id} [surface: ${comp.surface} · grain: ${comp.grain}]`);
        lines.push(`      SPARK: ${comp.spark}`);
        lines.push(`      COMPOSITION GRAMMAR:`);
        for (const g of comp.grammar) {
            lines.push(`        - ${g}`);
        }
        lines.push(`      WEB LEVERAGE: ${comp.webLeverage}`);
        lines.push('');
    });
    lines.push(`MODE RULES (${roll.mode.toUpperCase()}):`);
    lines.push(`  DIRECTIONS: ${roll.modeRules.directions}`);
    lines.push(`  COMPS & EXECUTION: ${roll.modeRules.comps}`);
    lines.push('');
    lines.push(`SEED REFERENCE: ${roll.seedReference} (record this on your surface brief FORM line).`);
    return lines.join('\n');
}
