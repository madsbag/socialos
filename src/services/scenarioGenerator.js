// SocialOS — Dynamic Scenario Generator
// Uses Claude API (via Vercel proxy) to generate new scenario variations

import { callAnthropic } from './api';

const CHAPTER_CONTEXT = {
  "ch-1": {
    title: "The Social Operating System",
    focus: "How humans make decisions — emotional prediction machines, status/belonging/certainty optimization, logic vs emotion",
    targetSkills: ["reading the room", "understanding hidden motivations", "choosing timing wisely"],
    sampleSettings: ["classroom", "cafeteria", "group chat", "family dinner", "school hallway"],
  },
  "ch-2": {
    title: "Status & Power Dynamics",
    focus: "Visible vs invisible status, competence vs dominance, social hierarchy, threat responses",
    targetSkills: ["recognizing status plays", "responding to dominance", "building competence-based status"],
    sampleSettings: ["sports team", "group project", "new school", "talent show", "online game lobby"],
  },
  "ch-3": {
    title: "Emotional Pattern Recognition",
    focus: "Anger = boundary violation, withdrawal = overwhelm, arrogance = insecurity, silence = processing or disengagement",
    targetSkills: ["identifying emotional drivers", "reading body language cues", "responding to emotional states"],
    sampleSettings: ["friend's house", "after-school activity", "bus ride", "lunch table", "study group"],
  },
  "ch-3b": {
    title: "Emotional Pattern Recognition II",
    focus: "Guilt = responsibility weight, jealousy = perceived unfairness, excitement = anticipation overflow, sarcasm = masked hurt, over-friendliness = insecurity or manipulation, defensiveness = shame protection",
    targetSkills: ["identifying advanced emotional drivers", "distinguishing similar-looking emotions", "responding to masked emotions"],
    sampleSettings: ["group project", "after-school hangout", "text conversation", "family event", "gaming session", "school trip"],
  },
  "ch-4": {
    title: "Team Mode Mechanics",
    focus: "Group dynamics, free riders, collaboration vs competition, shared responsibility, team roles",
    targetSkills: ["handling free riders", "distributing work fairly", "speaking up in groups", "building team trust"],
    sampleSettings: ["science project", "team sport", "volunteer event", "band practice", "class presentation"],
  },
  "ch-5": {
    title: "Authority Navigation",
    focus: "Dealing with teachers, coaches, parents in authority — unfair situations, picking battles, timing, framing",
    targetSkills: ["choosing when to push back", "framing disagreements constructively", "reading authority figures", "strategic compliance"],
    sampleSettings: ["principal's office", "coach meeting", "parent-teacher conference", "detention", "job interview"],
  },
  "ch-6": {
    title: "Friendship Algorithms",
    focus: "Reciprocity, one-sided friendships, building trust, vulnerability calibration, maintaining boundaries",
    targetSkills: ["assessing reciprocity", "calibrating vulnerability", "setting boundaries", "deepening connections"],
    sampleSettings: ["sleepover", "texting conversation", "walking home", "birthday party", "sharing secrets"],
  },
  "ch-7": {
    title: "Influence Engineering",
    focus: "Persuasion without manipulation, planting ideas, building consensus, reading resistance, timing proposals",
    targetSkills: ["framing ideas", "building buy-in", "reading resistance", "strategic timing"],
    sampleSettings: ["group decision", "convincing a friend", "class vote", "family negotiation", "planning an event"],
  },
  "ch-8": {
    title: "Conflict De-escalation Engine",
    focus: "5-step protocol: recognize, validate, de-escalate, redirect, resolve. Managing heated situations.",
    targetSkills: ["staying calm under pressure", "validating without agreeing", "redirecting anger", "finding resolution"],
    sampleSettings: ["argument with friend", "bullying situation", "sibling fight", "online conflict", "misunderstanding"],
  },
  "ch-9": {
    title: "Social Energy Management",
    focus: "Recognizing social battery limits, saying no gracefully, choosing which events to attend, recharging strategies",
    targetSkills: ["recognizing energy drain", "saying no without guilt", "prioritizing social events", "recharging effectively"],
    sampleSettings: ["weekend plans", "school day transitions", "party invitations", "group activities", "quiet time negotiations"],
  },
  "ch-10": {
    title: "Dynamic Scenarios — Mastery Mode",
    focus: "Multi-character scenarios with reputation consequences, long-term thinking, navigating complex social webs where your pattern matters more than any single choice",
    targetSkills: ["reputation management", "multi-character awareness", "long-term consequence thinking", "pattern consistency", "reading social networks"],
    sampleSettings: ["new school", "friend group shift", "team reorganization", "online community", "neighborhood dynamics"],
  },
  "ch-11": {
    title: "Parental Interaction",
    focus: "Navigating parent relationships — reading mood, timing requests, handling restrictions, earning trust",
    targetSkills: ["reading parental mood", "timing requests", "handling 'no' gracefully", "building trust incrementally"],
    sampleSettings: ["dinner table", "car ride", "homework time", "weekend morning", "after school"],
  },
  "ch-12": {
    title: "Sibling Interactions",
    focus: "Sibling dynamics — sharing, competition, alliance-building, handling annoying behaviors, protecting boundaries",
    targetSkills: ["de-escalating sibling conflict", "sharing fairly", "building sibling alliance", "setting boundaries"],
    sampleSettings: ["shared bedroom", "family game night", "car trip", "chore time", "holiday gathering"],
  },
};

const SYSTEM_PROMPT = `You are the scenario engine for SocialOS, a social skills practice game for teenagers aged 11-15 with ASD.

You generate NEW practice scenarios that follow a strict JSON structure. The scenarios teach social dynamics through branching decision trees.

RULES:
1. Age-appropriate for 11-15 year olds — school, family, friends, online interactions
2. Use clear, direct language. Short sentences. Avoid long words when short ones work.
3. Each choice must have clear social SIGNALS (what it tells others about you)
4. Status impacts must be realistic (-20 to +20 range)
5. Reputation tags should be specific and meaningful (e.g., "strategic", "pushover", "direct-communicator")
6. Turn 2 must branch based on Turn 1 outcome keys
7. Include 3-4 choices per turn with a range of approaches (passive, assertive, aggressive, strategic)
8. Keep setup and situations concrete and specific — not abstract
9. Make it feel like a real situation the player might encounter
10. Use gaming metaphors where they help explain social mechanics

OUTPUT: Return ONLY valid JSON. No markdown, no code blocks, no explanation.`;

function buildGenerationPrompt(chapterId, existingTitles = []) {
  const ctx = CHAPTER_CONTEXT[chapterId];
  if (!ctx) return null;

  const avoidList = existingTitles.length > 0
    ? `\nAVOID duplicating these existing scenarios: ${existingTitles.join(", ")}`
    : "";

  return `Generate ONE new scenario for the chapter "${ctx.title}".

CHAPTER FOCUS: ${ctx.focus}
TARGET SKILLS: ${ctx.targetSkills.join(", ")}
POSSIBLE SETTINGS (pick one or invent similar): ${ctx.sampleSettings.join(", ")}
${avoidList}

The scenario must follow this EXACT JSON structure:
{
  "id": "gen-[unique-short-id]",
  "title": "Short Descriptive Title",
  "energy_cost": [15-25],
  "xp_reward": [40-50],
  "setup": "1-2 sentences setting the scene",
  "characters": ["Name (role/description)", ...],
  "social_context": "The social dynamics and stakes at play",
  "generated": true,
  "turns": [
    {
      "situation": "What's happening right now — specific and vivid",
      "choices": [
        {
          "text": "What the player says or does (in quotes if dialogue)",
          "signals": ["Signal 1", "Signal 2"],
          "outcome": "outcome_key_snake_case",
          "status_impact": [number between -20 and +20],
          "reputation_tag": "one-word-or-hyphenated-tag"
        }
      ]
    },
    {
      "situation_by_outcome": {
        "outcome_key_1": "What happened as a result — specific consequence",
        "outcome_key_2": "Different result path"
      },
      "choices_by_outcome": {
        "outcome_key_1": [
          {
            "text": "Follow-up choice",
            "signals": ["Signal"],
            "outcome": "final_outcome",
            "status_impact": [number],
            "reputation_tag": "tag"
          }
        ],
        "outcome_key_2": [...]
      }
    }
  ]
}

Each turn should have 3-4 choices. Turn 2 must have entries for EVERY outcome key from Turn 1 choices.
Return ONLY the JSON object.`;
}

function buildEmotionGuessPrompt(chapterId) {
  const ctx = CHAPTER_CONTEXT[chapterId];
  if (!ctx) return null;

  // Only chapters focused on emotional recognition get emotion guess
  const emotionChapters = ["ch-3", "ch-3b", "ch-6", "ch-8", "ch-11", "ch-12"];
  if (!emotionChapters.includes(chapterId)) return null;

  return `\n\nADDITIONAL REQUIREMENT: This chapter focuses on emotional pattern recognition.
Add an "emotion_guess" object to Turn 1 with this structure:
"emotion_guess": {
  "prompt": "A question asking the player to identify the emotional driver behind a character's behavior",
  "options": [
    { "text": "Possible emotion/motivation", "correct": false, "explanation": "Why this is wrong" },
    { "text": "The actual emotion/motivation", "correct": true, "explanation": "Why this is the real driver" },
    { "text": "Another plausible but wrong option", "correct": false, "explanation": "Why this misreads the situation" }
  ]
}
Exactly ONE option should be correct. The correct answer should be the non-obvious, analytically deeper read.`;
}

export async function generateScenario(chapterId, existingTitles = []) {
  const prompt = buildGenerationPrompt(chapterId, existingTitles);
  if (!prompt) throw new Error(`No context defined for chapter ${chapterId}`);

  const emotionAddendum = buildEmotionGuessPrompt(chapterId) || "";
  const fullPrompt = prompt + emotionAddendum;

  const data = await callAnthropic({
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: fullPrompt }],
    max_tokens: 2500,
  });

  const text = data.content?.map(b => b.text || "").join("") || "";

  // Parse JSON from response — handle potential markdown wrapping
  let jsonStr = text.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }

  const scenario = JSON.parse(jsonStr);

  // Validate essential structure
  if (!scenario.id || !scenario.title || !scenario.turns || scenario.turns.length < 2) {
    throw new Error("Generated scenario missing required fields");
  }

  // Ensure generated flag
  scenario.generated = true;

  // Add timestamp
  scenario.generated_at = new Date().toISOString();

  return scenario;
}

export function getChapterContext(chapterId) {
  return CHAPTER_CONTEXT[chapterId] || null;
}

export function canGenerateForChapter(chapterId) {
  return !!CHAPTER_CONTEXT[chapterId];
}
