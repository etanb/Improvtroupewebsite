#!/usr/bin/env node
// Syncs src/data/quotes.json with Airtable, so Quote.tsx can render the
// "Troupe Wisdom" quote instantly from the static bundle instead of
// fetching Airtable in the visitor's browser on every page load.
//
// Each quote gets a permanent `slot` number the first time it's ever
// synced, matched by Airtable's stable record `id`. Slots are never
// reassigned for a quote that's already been seen before — a new quote
// just gets the next unused slot number. That means adding a new quote
// never shifts which day everyone else's existing quotes show on; see
// Quote.tsx for how `slot` is turned into "today's quote."
//
// Requires these as environment variables (set as GitHub Actions repo
// secrets — see .github/workflows/sync-events.yml):
//   AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID
//
// Usage:
//   AIRTABLE_TOKEN=... AIRTABLE_BASE_ID=... AIRTABLE_TABLE_ID=... node scripts/syncQuote.mjs

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUOTES_JSON_PATH = path.join(__dirname, '../src/data/quotes.json');

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID;

async function main() {
    if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
        throw new Error(
            'Missing AIRTABLE_TOKEN / AIRTABLE_BASE_ID / AIRTABLE_TABLE_ID env vars.',
        );
    }

    const url = new URL(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`,
    );
    url.searchParams.set('filterByFormula', 'NOT(Name="")');
    url.searchParams.set('pageSize', '100');

    const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    });
    if (!res.ok) {
        throw new Error(`Airtable API returned ${res.status}`);
    }
    const data = await res.json();

    const fetched = (data.records ?? [])
        .filter((r) => r.fields.Subject && r.fields.Name)
        .sort(
            (a, b) =>
                new Date(a.createdTime).getTime() -
                new Date(b.createdTime).getTime(),
        );

    if (fetched.length === 0) {
        console.log('No valid quotes found on Airtable — leaving quotes.json untouched.');
        return;
    }

    // Load whatever slot assignments already exist so we can preserve them.
    const existingRaw = await readFile(QUOTES_JSON_PATH, 'utf-8').catch(() => '[]');
    const existing = JSON.parse(existingRaw);
    const existingById = new Map(
        existing.filter((q) => q.id != null).map((q) => [q.id, q]),
    );

    let nextSlot =
        existing.length > 0
            ? Math.max(...existing.map((q) => q.slot ?? -1)) + 1
            : 0;

    const merged = fetched.map((r) => {
        const prior = existingById.get(r.id);
        const slot = prior ? prior.slot : nextSlot++;
        return { id: r.id, text: r.fields.Subject, author: r.fields.Name, slot };
    });

    merged.sort((a, b) => a.slot - b.slot);

    if (JSON.stringify(existing) === JSON.stringify(merged)) {
        console.log('quotes.json already up to date.');
        return;
    }

    await writeFile(QUOTES_JSON_PATH, JSON.stringify(merged, null, 2) + '\n');
    console.log(`Wrote ${merged.length} quote(s) to quotes.json.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
