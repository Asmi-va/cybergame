# SafeRon Engineering & Progress Log

## Architecture Overview
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **3D Engine**: Three.js + React Three Fiber (`@react-three/fiber`) + `@react-three/drei`
- **UI & Layout**: Tailwind CSS 4 + Radix/Base-UI Dialogs + Lucide React
- **Platform**: SafeRon — Cyber safety game universe tailored for young learners (ages 4–10)
- **Setting**: Navrang Public School, Lucknow, Uttar Pradesh (during Tech Utsav 2026)

---

## Game 1: Phishing Detective (Fully Implemented)

### Campus Environment
- Stylized 3D school building with corridors, dual wings, signboards, courtyards, trees, benches, perimeter walls, flags, and celebration banners.
- Key stations:
  1. `noticeboard` (School Noticeboard) at `[-6, 1]`
  2. `teacher` (Ms. Meera - In-person adult verification) at `[2, -3]`
  3. `computer` (Festival Computer Lab) at `[8, -4]`
  4. `canteen` (Canteen notice board & dining area) at `[9, 5]`
- Collision detection system preventing wall and bench clipping (`canWalk`).
- Multiple movement modes:
  - WASD / Arrow keys
  - Click-to-walk ground plane raycasting with golden destination indicator
  - On-screen touch directional D-pad for tablet and mobile devices
  - Quick-travel map buttons

### 8 Full Progressive Missions
1. **The scholarship surprise**: Fake scholarship demanding parents' payment PIN.
2. **The urgent exam result alert**: Unofficial results portal threatening withheld grades in 2 hours.
3. **The substitute teacher impersonator**: Phishing email pretending to be Sharma Sir pushing a `.apk` download.
4. **Official Science Exhibition circular**: Authentic school circular from `@navrang.example` (teaching players that legitimate messages exist and need not be feared).
5. **The free canteen samosa & lassi QR trap**: UPI PIN trap promising free cash (teaches that entering a UPI PIN only sends money, never receives it).
6. **The fake festival circular**: Fraudulent notice instructing children to surrender phone unlock codes and passwords.
7. **The urgent software patch attachment**: Malicious compressed `.zip` payload disguised as an urgent security update.
8. **The Grand Tech Fest Master Investigation**: Complex scenario testing verification of physical badge collection and domain consistency without panic.

---

## Game 2: Legit or Scam? (Fully Implemented)

### Gameplay Concept
- Interactive digital fact-checker module for children to inspect real-world Indian situations across 10 diverse scenarios.
- Realistic simulated artifacts (UPI collect requests, street QR stickers, SMS bubbles, WhatsApp forwards, login dialogs, speed post notices).
- 4 meaningful player actions:
  - **Proceed / Safe** (when evidence proves legitimate)
  - **Verify In Person** (speak directly with parents, teachers, or shopkeepers)
  - **Reject & Delete** (refuse unneeded permissions or secret PIN requests)
  - **Report Scam** (alert authorities to dangerous links or identity spoofing)

---

## CyberPlay-Quality Adventures Catalogue & New Playable Games

### 1. Unified Game Catalogue (`GameCatalogueView`)
- Fully integrated into the **"All adventures"** navigation button.
- Categorized by all 5 authentic play styles from the CyberPlay reference guide:
  - **Investigate**
  - **Walk and Fix**
  - **Role-Play**
  - **Strategy & Manage**
  - **Arcade & Puzzle**
- Real-time search, difficulty tags (`Beginner`, `Intermediate`, `Advanced`), play duration badges, and expandable detail modal with mechanics breakdown.

### 2. QR Hunt: Campus Code Investigator (`QrHuntGame`)
- Direct implementation of the CyberPlay **QR Hunt** gameplay loop:
  - Inspection of decoded URL, registered domain, HTTPS encryption status, and physical tampering (peeling sticker overlays).
  - 3 safety checks to run per station before choosing: **Safe to Open**, **Ignore & Avoid**, or **Report QR Trap**.
  - Authentic Indian locations: Canteen billing counter, school bus stop, library desk, and science exhibition hall.

### 3. Clean Desk Challenge (`CleanDeskGame`)
- Direct implementation of the CyberPlay **Clean Desk Challenge** walk-and-fix loop:
  - Audit of computer lab workstations and teacher desks at end-of-day.
  - Document & asset classifications: `Public`, `Internal`, `Confidential`, `Restricted`, and `Decoy`.
  - Actions: **Lock Screen**, **Secure Shred**, **Lock in Drawer**, and **Leave Untouched**.
  - Penalty for disturbing harmless decoys (such as mugs and desk plants) to train restraint and avoid over-fixing.
  - Scoring from S-grade to C-grade.

### 4. Data Dash: Cyber Runner (`DataDashGame`)
- Direct implementation of the CyberPlay **Data Dash** arcade runner:
  - 3-lane navigation with real-time obstacle avoidance.
  - Deliver clean data capsules, steer into official HTTPS portals, and dodge malware traps (`.exe` payloads and spoofed gates).
  - Touch buttons ("Steer Left", "Steer Right") and keyboard arrow/A-D support.
  - Life meter, scoring multipliers, and session debriefs.

### 5. Mobile & Tablet Responsiveness
- Dedicated touch controls on mobile devices (D-pad for 3D exploration and swipe/tap buttons for arcade).
- Responsive viewports (`100dvh`), flexible mission cards, responsive typography, and adaptive layouts for all screen sizes.

---

## 3D Real-Time Environments Across All Games (`environments.tsx` & `game-backdrop-3d.tsx`)
All games in the platform now feature real-time 3D rendered worlds matching *Phishing Detective*:
- **Navrang School Campus** (*Phishing Detective 3D*): Courtyard, dual school wings, noticeboard station, tech fest flags, trees, and benches.
- **Computer Lab & Server Facility** (*Clean Desk Challenge* & *Portal Security Scenarios*): Dual-monitor student desks, glowing server racks with active LEDs, teacher master workstation, and network whiteboards.
- **Bazaar & Courtyard Marketplace** (*Legit or Scam?* & *QR Hunt*): Street stalls, book depot with canopies, canteen counters, and trees.
- **Cyber Highway Grid** (*Data Dash*): 3-lane neon track with floating cyber pillars and data packet targets.
- Embedded live across all game interfaces via GPU-accelerated Three.js viewports with floating detective characters.



### 10 Diverse Scenarios Included
1. **The "Cashback Reward" Payment Request**: UPI collect request of ₹500 pretending to be a reward credit.
2. **Pasted QR Code at Bus Stop Book Stall**: Sticker overlay placed over vendor's genuine QR board.
3. **Quarter 3 Tuition Fee Reminder**: Authentic school fee notice with standard calm deadlines and portal links.
4. **National Talent Scheme WhatsApp Forward**: Viral chain forward with fake `.site` link harvesting Aadhaar numbers.
5. **Free 1,000 Diamonds & Mythic Skin Generator**: Gaming scam asking for game password and 2FA deactivation.
6. **India Post Address Incomplete Notification**: Smishing scam asking for ₹5 re-delivery fee to steal credit cards.
7. **School Library Book Reservation Confirmation**: Authentic library notification mirroring an in-person hold.
8. **Festival Photo Contest "Location Permission" App**: Aggressive ad requesting 24/7 GPS, mic, and contact access.
9. **Urgent WhatsApp from "Mama ji" (Uncle)**: Family emergency impersonation asking for secret ₹2,000 transfer.
10. **Mid-Day Attendance Verification Link**: Typosquatting portal attack using `navrangg-school.org`.

### Evidence & Learning System
- Interactive evidence accordion breaking down domain mechanics, pressure tactics, and privacy risks.
- Real-world verification protocol for every case.
- Educational explanation and core safety rule for each outcome.
- Persistence via `localStorage` (`saferon-legit-or-scam-v1`) tracking XP and completed cases.


### Evidence & Decision System
- Simulated message reader with sender breakdown, time, subject, body, and exact link preview.
- 3 interactive investigation clues per mission explaining indicators (domain spoofing, false urgency, unexpected attachments, password demands, UPI PIN mechanics).
- Mandatory real-world in-person verification with teacher Ms. Meera before final decision can be made.
- Non-punitive learning feedback with explanation on both correct and incorrect choices, allowing kids to learn and try again.
- Local persistence in `localStorage` under `saferon-detective-v1` storing XP, active mission, clues discovered, teacher verification, and completed missions.
- Pause, audio toggles, guidance options, case journal, and game selection dialog.

