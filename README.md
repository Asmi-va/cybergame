# SafeRon Digital Safety Academy

Cyber-safety learning product for ages **8–16** in India: **courses → practice → story → certificate**.

**Brand:** saffron (`#FF9933`) for awareness, black for focus. Tagline: **Learn · Trust · Verify**. Logo: `/public/saferon-logo.png`.

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm build
pnpm start
```

Optional INSIDER multiplayer (local only):

```bash
pnpm insider-server
```

## Product map

| Area | Route | Notes |
|------|--------|--------|
| Home | `/` | Investor / learner entry |
| Academy hub | `/academy` | Unified courses + practice + path + story |
| Course player | `/courses/[slug]` | Interactive or video |
| Practice | `/games/[slug]` | Shared academy chrome + XP |
| Story | `/nayapur` | Neighbourhood missions |
| Profile | `/profile` | XP + certificates (device-local) |

`/courses` and `/games` list pages redirect into `/academy` tabs so the product feels one.

`/campus` is **legacy** (older Navrang dump) — not in primary nav. Prefer Academy.

## Investor demo path (10 min)

1. `/` — brand + interactive path  
2. `/academy?tab=path` — show one journey  
3. `/courses/digital-citizenship` — Learn → Sim → Quiz → certificate  
4. `/games/find-the-fake-login` — practice with academy chrome  
5. `/profile` — XP + printable certificate  

## Deploy & funding

See **[FUNDING.md](./FUNDING.md)** (product + funding checklists) and **[DEPLOY.md](./DEPLOY.md)**.

- Progress is **localStorage only** (privacy-first MVP; no accounts).
- Course intro videos live in `public/course-videos/` (~29–34MB each after compression).
- INSIDER live WebSocket is localhost-only; use offline practice on hosted demos.
- Investor tour: `/` → `/academy?tab=path` → one course (name → 10Q → cert) → `/nayapur` → `/profile` → `/privacy`.

## Helplines (in product)

- Childline **1098**
- Cybercrime **1930**
