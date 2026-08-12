#!/usr/bin/env node
// Syncs src/data/quotes.json with Airtable, so Quote.tsx can render the
// "Troupe Wisdom" quote instantly from the static bundle instead of
// fetching Airtable in the visitor's browser on every page load (which is
// what caused the pop-in fade you didn't like).
//
// Quote.tsx keeps the "rotates to a new quote once a day" behavior — it
// still computes `dayIndex = floor(Date.now() / 86400000) % quotes.length`
// on the client — but that's pure local math against the bundled array now,
// no network round trip, so there's nothing to wait on and nothing to fade in.
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

    const valid = (data.records ?? [])
        .filter((r) => r.fields.Subject && r.fields.Name)
        .sort(
            (a, b) =>
                new Date(a.createdTime).getTime() -
                new Date(b.createdTime).getTime(),
        )
        .map((r) => ({ text: r.fields.Subject, author: r.fields.Name }));

    if (valid.length === 0) {
        console.log('No valid quotes found on Airtable — leaving quotes.json untouched.');
        return;
    }

    const existingRaw = await readFile(QUOTES_JSON_PATH, 'utf-8').catch(() => '[]');
    const existing = JSON.parse(existingRaw);

    if (JSON.stringify(existing) === JSON.stringify(valid)) {
        console.log('quotes.json already up to date.');
        return;
    }

    await writeFile(QUOTES_JSON_PATH, JSON.stringify(valid, null, 2) + '\n');
    console.log(`Wrote ${valid.length} quote(s) to quotes.json.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
