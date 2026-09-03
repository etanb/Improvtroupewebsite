# Late For Work — Website

Static marketing site for the Late For Work improv troupe. Built with React + Vite, deployed on Vercel. Most content is either hardcoded in the repo or pulled live from external services at page load — no server, no database queries, no redeploys needed for routine updates.

---

## Tech Stack

- **React + TypeScript** — UI components
- **Vite** — build tool and dev server
- **Tailwind CSS + shadcn/ui** — styling
- **Vercel** — hosting and deployment

---

## Project Structure

```
src/
├── app/
│   └── components/
│       ├── Header.tsx       # Sticky nav with smooth scroll
│       ├── Hero.tsx         # Landing section with live Instagram photos
│       ├── Quote.tsx        # Live rotating ensemble quote
│       ├── Shows.tsx        # Upcoming + past shows, driven by shows.json
│       ├── Contact.tsx      # Contact form (Formspree)
│       └── Footer.tsx
├── data/
│   ├── shows.json           # ← Edit this to update shows
│   └── members.json         # ← Edit this to add/remove ensemble members
└── imports/
    └── ...                  # Static assets (star doodles, etc.)
```

---

## Updating Content

### Adding or editing a show

Open `src/data/shows.json` and add an entry to the array. The site automatically splits shows into "Coming Up" and "Past Shows" based on today's date — no other changes needed.

```json
{
  "date": "2026-08-10",
  "time": "7:30 PM",
  "venue": "Black Lodge",
  "ticketUrl": "https://dice.fm/your-event-link",
  "guests": ["Guest Group One", "Guest Group Two"]
}
```

- `date` must be in `YYYY-MM-DD` format
- `ticketUrl` can be left as `""` if there's no ticket link yet
- The site shows the next **2** upcoming shows and the most recent **6** past shows

### Adding or removing ensemble members (for quotes)

Open `src/data/members.json` and add or remove the email → name entry. Then update the corresponding formula in Airtable (see below) to match.

---

## External Services

### 1. Instagram Photos — [Behold.so](https://behold.so)

The three polaroid photos in the hero section are pulled live from the troupe's Instagram account via Behold's JSON feed.

- **How it works:** On page load, `Hero.tsx` fetches `https://feeds.behold.so/qAzM0CUN4ODlHwG8vgtS`, takes the 3 most recent posts, and displays them as polaroid cards. Video posts use the thumbnail image. Each card links to its individual Instagram post.
- **If the fetch fails:** The frames still render but stay as gray placeholders.
- **To update:** Nothing to do — it always shows the 3 most recent posts automatically.
- **Account:** Managed at [behold.so](https://behold.so)

---

### 2. Rotating Quote — [Airtable](https://airtable.com) + [Zapier](https://zapier.com)

The "Troupe Wisdom" quote section displays the most recent quote submitted by an ensemble member via email.

#### How a quote gets submitted

1. An ensemble member emails `lfwquotation@gmail.com` with their quote as the **subject line** (body is ignored for display but logged)
2. Gmail automatically applies the **LFWTEAM** label to emails from approved senders (via a Gmail filter)
3. Zapier watches for new emails with the LFWTEAM label and creates a record in Airtable
4. Airtable's `Name` formula field maps the sender's email to their display name
5. On page load, `Quote.tsx` fetches the most recent record with a non-empty `Name` field and displays it

#### Approved senders

Only emails from the following addresses are accepted. The Gmail filter enforces this before Zapier ever sees the email.

| Email | Display Name |
|-------|-------------|
| cburnitz@gmail.com | Christine |
| annroepke@gmail.com | Annie |
| ants.jia.games@gmail.com | Anton |
| bstrukus@gmail.com | Ben |
| lyamagawa@gmail.com | Laure |
| thecoby0@gmail.com | Coby |
| etan.berkowitz@gmail.com | Etan |

#### Adding a new member

1. Add their email → name to `src/data/members.json`
2. Add their email to the Gmail filter on `lfwquotation@gmail.com` (Settings → Filters → edit the LFWTEAM filter)
3. Add a new `IF` clause to the `Name` formula field in Airtable

#### Airtable structure

- **Base:** Late For Work
- **Table:** Quotes
- **Fields:** `SenderEmail` (text), `Subject` (text), `Body` (long text), `Name` (formula)
- The `Name` formula maps `SenderEmail` to a display name using nested `IF()` statements. If the email isn't in the list, `Name` returns empty and the record is ignored by the site.

#### Zapier setup

- **Trigger:** Gmail — New Email in label LFWTEAM (connected to `lfwquotation@gmail.com`)
- **Action:** Airtable — Create Record, mapping From Email → `SenderEmail`, Subject → `Subject`, Body Plain → `Body`
- Free tier (2-step zap)

---

### 3. Contact Form — [Formspree](https://formspree.io)

The contact form in `Contact.tsx` POSTs to Formspree, which forwards submissions to the troupe's email address.

- **Endpoint:** `https://formspree.io/f/xqewgeoq`
- **Account:** Managed at [formspree.io](https://formspree.io)
- Submissions include name, email, and message

---

## Environment Variables

Sensitive keys are stored as environment variables, not in the codebase. For local development, create a `.env` file in the project root (it is gitignored). For production, these are set in the Vercel project dashboard under Settings → Environment Variables.

```
VITE_AIRTABLE_TOKEN=...
VITE_AIRTABLE_BASE_ID=...
VITE_AIRTABLE_TABLE_ID=...
```

Note: because this is a client-side app, these variables are bundled into the JavaScript at build time and are technically visible in the browser. The Airtable token has read/write scope limited to the Late For Work base only, so exposure risk is minimal.

---

## Local Development

```bash
pnpm install
pnpm dev
```

Create a `.env` file with the three Airtable variables before running locally if you want the quote section to load.

## Deployment

The site is deployed on Vercel. Any push to the main branch triggers an automatic redeploy. Environment variables must be set in the Vercel dashboard — they are not committed to the repo.
