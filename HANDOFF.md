# SocialOS — Claude Code Handoff Document

## Project Overview

SocialOS is a social intelligence training web app designed for people with ASD (Autism Spectrum Disorder) who think analytically. Built by Madhur (43, ASD, diagnosed 5 years ago) for his 14-year-old son who also has ASD and struggles with social interaction.

**Core philosophy:** Instead of expecting neurodivergent minds to intuitively "pick up" social cues, SocialOS teaches social dynamics as learnable, analytical systems — pattern recognition, status dynamics, energy management, and influence engineering. Think game strategy guide, not therapy.

---

## Background & Motivation

- Madhur has been working with ChatGPT to develop a social training framework for his son
- The framework was developed over multiple ChatGPT conversations and then consolidated into the SocialOS curriculum
- The app needs two modes: **guided** (Madhur coaches his son through scenarios together) and **independent** (son practices alone with AI coaching)
- The analytical framing is intentional — gaming metaphors (energy bars, XP, reputation systems, branching outcomes) make social learning engaging for ASD minds
- This is NOT social etiquette training or "be nice" lectures — it's pattern recognition and systems thinking applied to social dynamics

---

## Curriculum Architecture (4 Levels)

### Level 1 — Social Physics (Foundations) ✅ BUILT
How humans actually make decisions.

**Chapter 1: The Social Operating System**
- Concepts: Humans are emotional prediction machines; people optimize for status, belonging, certainty; logic is secondary to emotion
- Scenarios built: "The Public Correction" (deep branching), "The New Group" (deep branching)

**Chapter 2: Status & Power Dynamics**
- Concepts: Visible vs invisible status, competence vs dominance, threat responses
- Scenarios built: "The Mockery" (1 turn)

**Chapter 3: Emotional Pattern Recognition**
- Concepts: Anger = boundary violation, withdrawal = overwhelm, arrogance = insecurity, silence = processing or disengagement
- Scenarios built: "The Silent Friend" (includes Emotion Scan mechanic — player must identify emotional driver before choosing response)

### Level 2 — Tactical Interaction Skills 🟡 PARTIALLY BUILT
**Chapter 4: Team Mode Mechanics** — 1 scenario built ("The Free Rider")
**Chapter 5: Authority Navigation** — structure only, no scenarios
**Chapter 6: Friendship Algorithms** — structure only, no scenarios

### Level 3 — Advanced Social Strategy 🔴 NOT BUILT
**Chapter 7: Influence Engineering** — structure only
**Chapter 8: Conflict De-escalation Engine** — structure only (has 5-step protocol defined)
**Chapter 9: Social Energy Management** — structure only

### Level 4 — Mastery Mode 🔴 NOT BUILT
**Chapter 10: Dynamic Scenarios** — concept defined (multiple characters, memory, reputation system, long-term consequences)

---

## Technical Architecture

### Current Stack
- **Frontend:** React (single-file component) + Vite
- **AI:** Claude API (Sonnet) for post-scenario analytical debrief
- **State:** React useState (local, resets on refresh)
- **Styling:** Inline styles, IBM Plex Mono font, dark theme with green accent
- **Build:** Vite React template

### File Structure
```
socialos/
├── src/
│   ├── App.jsx          # Everything lives here — scenarios, UI, game logic
│   └── main.jsx         # Entry point
├── package.json
├── vite.config.js
├── README.md
├── HANDOFF.md           # This file
└── .gitignore
```

### Key Design Decisions
1. **Single-file architecture** — All scenarios, components, and logic in App.jsx for simplicity. Should be refactored as it grows.
2. **Hybrid scenario system** — Pre-written core scenarios with AI-generated variations planned for Phase 2.
3. **Claude API for debrief only** — Scenarios are pre-written with branching trees. Claude generates the analytical debrief after completion.
4. **No backend yet** — All state is local. Persistence planned for Phase 2.
5. **Hosting target:** Vercel or Netlify (simplest possible, free tier).

---

## What's Built (Phase 1)

### Scenario Engine
- Level/Chapter/Scenario navigation hierarchy
- Branching decision trees with multiple turns
- Each choice carries: text, signals (what it communicates), outcome key, status_impact, reputation_tag
- Outcomes from Turn 1 determine the situation and choices in Turn 2
- Turn counter in header

### Emotion Scan Mechanic
- Special interaction type in Chapter 3 scenarios
- Player must identify the emotional driver (multiple choice with correct answer) before seeing response options
- Immediate feedback with explanation of why each answer is correct/incorrect

### Signal Reveal System
- Toggle button "SHOW/HIDE SIGNALS" on scenario screen
- When enabled, each choice shows: signal tags (what the choice communicates to others), status impact number
- This is the core coaching tool — lets the player see the social dynamics analytically

### Gamification
- **Energy system:** Each scenario costs energy (e.g., 15-25 points). Starts at 100. Can't play if energy too low.
- **XP:** Earned per completed scenario (40-50 XP)
- **Status score:** Running total of status_impact from all choices across all scenarios
- **Reputation tags:** Accumulated labels like "thoughtful", "know-it-all", "leader", "easy-target", etc. Displayed on home screen.
- **Stats in header:** Energy bar, XP counter, Status score — always visible

### AI Coaching Debrief
- After scenario completion, calls Claude API (Sonnet)
- System prompt instructs analytical coaching style: pattern recognition language, no therapy-speak, direct about what worked and didn't
- Sends full scenario context + all player choices with signals and status impacts
- Generates 3-4 paragraph analysis ending with one "pattern to remember"
- Fallback text if API call fails

### UI/UX
- Dark theme (#0a0a0f background), green accent (#6ee7b7)
- IBM Plex Mono monospace font throughout
- Subtle grid background pattern
- Fade-in transitions between screens
- Hover effects on all interactive elements
- Color-coded levels (green/yellow/blue/red)
- Concept tags on chapter cards
- "Coming Soon" badges on unbuilt content
- Responsive layout, max-width 800px

---

## What's Next (Prioritized)

### Immediate (Phase 1.5)
1. **Push to GitHub** — repo is git-initialized, needs remote + push
2. **Deploy to Vercel** — `vercel` CLI or connect GitHub repo
3. **Add more scenarios** — Priority chapters: Authority Navigation (Ch5), Friendship Algorithms (Ch6), Influence Engineering (Ch7)
4. **Persist state** — localStorage for energy, XP, reputation, completed scenarios so progress survives refresh

### Phase 2 — AI-Generated Variations
5. **Dynamic scenario generation** — Use Claude API to generate scenario variations based on the core templates, maintaining the same analytical framework and branching structure
6. **Guided mode** — Parent dashboard where Madhur can see what his son practiced, add commentary, assign specific scenarios
7. **Backend** — Simple persistence layer (Supabase or Firebase) for cross-device progress

### Phase 3 — Advanced Features
8. **Chapter 9: Energy Management system** — Interactive energy bar that depletes based on scenario choices, recovery mechanics, strategic disengagement training
9. **Level 4: Mastery Mode** — Dynamic scenario engine with character memory, reputation consequences across scenarios, long-term tracking
10. **Conflict De-escalation Engine** — Multi-branch conflict simulations using the 5-step protocol

### Phase 4 — Polish
11. **Independent practice mode** — AI acts as full coach (not just debrief), guiding through scenarios conversationally
12. **Mobile optimization** — Touch interactions, responsive improvements
13. **Sound/haptic feedback** — Optional, for gamification feel

---

## Scenario Data Structure Reference

Each scenario follows this structure in the SCENARIOS object:

```javascript
{
  id: "unique-id",
  title: "Scenario Name",
  energy_cost: 20,          // Deducted from player energy
  xp_reward: 45,            // Added on completion
  setup: "Context paragraph...",
  characters: ["Name (description)", ...],
  social_context: "Setting and social dynamics description",
  turns: [
    {
      // Turn 1 — fixed situation
      situation: "What's happening right now...",
      // Optional: emotion_guess (for Emotion Scan mechanic)
      emotion_guess: {
        prompt: "Question to player",
        options: [
          { text: "Option", correct: true/false, explanation: "Why" }
        ]
      },
      choices: [
        {
          text: "What the player says/does",
          signals: ["Signal 1", "Signal 2"],    // What this communicates
          outcome: "outcome_key",                // Links to next turn
          status_impact: 15,                     // Positive or negative
          reputation_tag: "label"                // Accumulated tag
        }
      ]
    },
    {
      // Turn 2+ — branched by previous outcome
      situation_by_outcome: {
        "outcome_key": "What happened as a result..."
      },
      choices_by_outcome: {
        "outcome_key": [
          { text: "...", signals: [...], outcome: "...", status_impact: N }
        ]
      }
    }
  ]
}
```

---

## Claude API Integration

The debrief uses the Anthropic Messages API:
- Model: `claude-sonnet-4-20250514`
- Max tokens: 1000
- System prompt enforces analytical coaching style
- User message contains: scenario setup, characters, social context, all player choices with signals and status impacts
- No API key is hardcoded — needs to be handled via environment variable or proxy for production

**Important:** The current implementation calls the API directly from the frontend. For production, this should go through a backend proxy to protect the API key.

---

## Notes for Claude Code

- The project uses Vite with React — `npm run dev` to start local server
- Everything is in `src/App.jsx` — this will need refactoring as scenarios grow (separate scenario data files, component extraction)
- The scenario data structure is designed to be extensible — new scenarios just need to follow the pattern in the SCENARIOS object
- Madhur prefers direct, efficient communication — show solutions, don't over-explain
- Madhur has GCP experience but wants simplest possible hosting (Vercel recommended)
- macOS is the default development environment
