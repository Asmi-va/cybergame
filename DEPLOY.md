# SafeRon — Deploy & funding readiness

*Honest status for pilots, Vercel deploy, and investor diligence.*

## Verdict

| Question | Answer |
|----------|--------|
| Ready for a **hosted pilot demo**? | **Almost** — after video compress + one clean deploy |
| Ready for **production schools at scale**? | **No** — needs accounts/consent, Hindi, tighter TS, unified XP |
| Ready for **pre-seed / grant pitch**? | **Yes as MVP narrative** — product spine is clear; call out gaps |

**Pitch line:** SafeRon is one saffron+black academy (Learn → Practice → Story → Certificate) for ages 8–16 in India, aligned to digital-safety guidance and DPDP habits, privacy-first on-device.

## Deploy checklist (P0 before public URL)

1. ~~Compress videos~~ — done (~29–34MB each in `public/course-videos/`). Optional: further pass to ≤12MB for weak mobile.
2. `pnpm build` — TypeScript is enforced (`ignoreBuildErrors` removed).
3. Confirm INSIDER WebSocket is off or documented as local-only on hosted demos.
4. Set Vercel project → Production URL → smoke: `/` → `/academy` → one course → certificate → `/nayapur` mission board.
5. OG / favicon already use `/og-saferon.png` and `/saferon-logo.png`.

```bash
pnpm install
pnpm build
pnpm start
```

Progress is **localStorage only** (no server accounts) — say that in every school/pilot call.

## Funding readiness (what is strong)

- Unified Academy hub + learning path (not a folder of demos)
- Official brand mark + Learn · Trust · Verify
- Interactive courses with name gate, sims, 10Q quiz, printable cert + next steps
- Curriculum spine (handbook / 4Cs / DPDP habits) + Childline 1098 / 1930
- Privacy-first MVP suitable for early pilots without collecting child accounts

## Funding blockers (say upfront)

| Risk | Why investors ask | Mitigation |
|------|-------------------|------------|
| `ignoreBuildErrors: true` | Looks unfinished | Fix Nayapur TS, then turn off |
| ~220MB raw videos | India mobile / demo flakiness | Compress before launch |
| Split XP (platform vs Nayapur vs campus) | Not one product metric | Merge or sandbox `/campus` |
| No school admin / parental consent | Hard to sell to CBSE chains | Pilot with device-local + teacher-led; roadmap DPDP consent |
| English-only | Market coverage | Hindi track as funded milestone |
| Partial Nayapur missions | Story incomplete | Ship 3 playable missions; roadmap rest |

## Suggested ask framing

- **Use of funds:** video compression + Hindi narration; school pilot kit; DPDP consent + teacher dashboard; finish Nayapur campaign; remove tech debt (`tsc`, XP merge).
- **12-week pilot metric:** N schools, completion rate on 2 courses, certificate downloads, qualitative parent/teacher NPS — not vanity DAU.

## Do not hand investors

- `PROGRESS.md` (outdated Navrang framing)
- `/campus` as the product tour
- Live INSIDER multiplayer without setup notes
