# SafeRon — Product & funding checklists

*Updated after logo + privacy + TypeScript cleanup.*

---

## A. Original product checklist (from build plan)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Course registry + handbook/4Cs/DPDP tags; routes; certificates; age bands 8–12 / 13–16 | **Done** | `lib/courses/*`, printable cert UI |
| 2 | Wave-1 interactive Learn→Sim→Quiz→Certificate (digital-citizenship, personal-data-dpdp, phishing, gaming-safety) | **Done** | All four in `academy-pack` + interactive player + 10Q quiz |
| 3 | Wave-2 (cyberbullying, identity, india-payment, report-and-get-help) + sims | **Done** | Four courses shipped with in-course sims (no separate “phone-sim” app — SMS/call sims live inside courses) |
| 4 | Promote Legit or Scam to `/games` | **Cancelled** | Practice stack is Fake Login, Phishing Detective, QR Hunt, Social Engineer instead |
| 5 | Nayapur free-fire / scholarship / bank-call (+ soft boss) stories | **Deferred** | Campaign titles exist; **playable now:** bijli-bill, payment-aaya, parcel-stuck. Others = roadmap / funded milestone |
| 6 | Safety-by-design defaults | **Done (MVP)** | Device-local progress, name + guardian ack, no ads, helplines, `/privacy`, analytics **off** unless `NEXT_PUBLIC_ENABLE_ANALYTICS=1` |
| 7 | Home Academy + learn + achievements + certificate gallery | **Done** | Full path available |

---

## B. Funding / deploy checklist

### Done in product (code)

- [x] Unified Academy hub (path / courses / practice / story)
- [x] Official SafeRon logo + Learn · Trust · Verify
- [x] Name gate + 10-question sim quiz → certificate with next steps
- [x] Wave-1 + wave-2 interactive courses
- [x] Practice modules on platform with academy chrome
- [x] Story game mission board for new players (3 playable missions)
- [x] Privacy page + guardian acknowledgment + helplines always in product
- [x] TypeScript build clean; `ignoreBuildErrors` removed
- [x] OG image + favicons from official logo
- [x] Honest `DEPLOY.md` / this funding doc

### Still open (needs you + a short eng pass)

- [x] **Compress course videos** — replaced in `public/course-videos/` (~29–34MB each, down from ~50–60MB). Further ≤12MB pass optional for weak mobile data
- [ ] **Deploy host** (Vercel/etc.) + set `NEXT_PUBLIC_SITE_URL=https://your-domain`
- [ ] **Smoke-test live URL** (phone + laptop): home → course → cert → Nayapur → profile
- [ ] **Pitch deck / one-pager** (problem, product path, pilot ask, use of funds)
- [ ] **Pilot school / NGO LOI** or warm intro list
- [ ] **Legal entity / bank details** for grants
- [ ] **Optional:** Hindi narration, school dashboard, finish Nayapur free-fire/scholarship/bank-call
- [ ] **Do not enable analytics** for child demos unless you consciously set the env flag

---

## C. What is needed from your side (owner list)

1. **Create hosting account** and deploy; send the public URL.
2. **Set env:** `NEXT_PUBLIC_SITE_URL` = your live domain (leave analytics unset).
3. **Walk the investor demo path once** on a phone on mobile data; note broken bits.
4. **Write or approve** a 1-page pitch (ask amount + 12-week pilot metrics).
5. **List 3–5 pilot partners** (schools / NGOs / CSR) you can email.
6. **Decide logo usage rights** (confirm you own/can use the SafeRon mark commercially).
7. **Decide scope of raise:** pilot-only vs product scale (be honest — scale needs accounts/Hindi/dashboard).
8. **Optional later:** re-compress videos to ≤12MB; Hindi voice; teacher worksheet PDF; GST/entity docs for grants.

---

## Pitch one-liner

> SafeRon is a saffron-and-black digital safety academy for ages 8–16 in India: Learn → Practice → Story → Certificate, privacy-first on-device, aligned to trusted online-safety guidance and DPDP habits.
