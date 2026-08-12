#!/usr/bin/env node
// Syncs src/data/shows.json with the rolodex.lol events API.
//
// What this DOES do automatically:
//   - date            -> passthrough (already "YYYY-MM-DD" on both sides)
//   - time             "18:30:00" (24h)      -> "6:30 PM" (matches existing format)
//   - ticket_link      -> ticketUrl
//   - description      -> description (rendered as-is in place of the old
//                          "w/ guest · guest · guest" chip row — see
//                          VENUE_ALIASES below and Shows.tsx)
//   - venue            -> passthrough, except for known aliases (see
//                          VENUE_ALIASES below)
//
// What this DOES NOT do:
//   - It never overwrites or removes any show already in shows.json. Existing
//     entries (your 9 historical, hand-entered shows) are left exactly as
//     they are, guests array and all. Shows.tsx knows how to render either
//     shape (description OR guests) so old and new entries can coexist.
//   - It does not normalize venue names beyond the VENUE_ALIASES map below.
//     If rolodex.lol starts returning some other address instead of a venue
//     name, add it to the map. Anything else that looks like a street
//     address gets a console warning so you can fix it by hand.
//
// Usage:
//   node scripts/syncEvents.mjs
//
// Run this whenever you want to pull in newly-added rolodex.lol events. It's
// safe to re-run; already-synced events (matched by date+venue) are skipped.

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHOWS_JSON_PATH = path.join(__dirname, '../src/data/shows.json');
const API_URL = 'https://rolodex.lol/api/events?troupe=late-for-work&from=2020-01-01';

// Map raw `venue` strings from the API to the display name we actually want.
// Add to this as rolodex.lol events come in with an address instead of a name.
const VENUE_ALIASES = {
    '429 Eastlake Ave E, Seattle, WA 98109': 'Black Lodge',
};

function convertTime(time24) {
    // "18:30:00" -> "6:30 PM"
    if (!time24) return undefined;
    const [hStr, mStr] = time24.split(':');
    let hours = parseInt(hStr, 10);
    const minutes = mStr;
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${meridiem}`;
}

function normalizeVenue(venue) {
    return VENUE_ALIASES[venue] ?? venue;
}

function looksLikeUnmappedAddress(venue) {
    // Rough heuristic: starts with a street number, or contains a zip code,
    // and isn't already covered by VENUE_ALIASES.
    return /^\d+\s/.test(venue) || /\b\d{5}\b/.test(venue);
}

function transformApiEvent(apiEvent) {
    return {
        date: apiEvent.date,
        time: convertTime(apiEvent.time),
        venue: normalizeVenue(apiEvent.venue),
        ticketUrl: apiEvent.ticket_link || '',
        description: apiEvent.description || '',
    };
}

function sameShow(a, b) {
    return a.date === b.date && a.venue === b.venue;
}

async function main() {
    const existingRaw = await readFile(SHOWS_JSON_PATH, 'utf-8');
    const existing = JSON.parse(existingRaw);

    const res = await fetch(API_URL);
    if (!res.ok) {
        throw new Error(`rolodex.lol API returned ${res.status}`);
    }
    const apiEvents = await res.json();

    const transformed = apiEvents.map(transformApiEvent);

    const toAdd = transformed.filter(
        (t) => !existing.some((e) => sameShow(e, t)),
    );

    if (toAdd.length === 0) {
        console.log('Nothing new to sync. shows.json is already up to date.');
        return;
    }

    for (const show of toAdd) {
        if (looksLikeUnmappedAddress(show.venue)) {
            console.warn(
                `⚠️  "${show.date}" venue looks like an unmapped address: "${show.venue}". ` +
                    `Add it to VENUE_ALIASES in this script if it should map to a real venue name.`,
            );
        }
    }

    const merged = [...toAdd, ...existing].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
    );

    await writeFile(SHOWS_JSON_PATH, JSON.stringify(merged, null, 2) + '\n');
    console.log(`Added ${toAdd.length} show(s) from rolodex.lol to shows.json.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
