import { useState, useEffect, useRef } from "react";

// ─── SCENARIO DATABASE ───────────────────────────────────────────────
const SCENARIOS = {
  "level-1": {
    title: "Social Physics",
    color: "#22c55e",
    chapters: {
      "ch-1": {
        title: "The Social Operating System",
        subtitle: "How humans really make decisions",
        concepts: [
          "Humans are emotional prediction machines",
          "Most people optimize for: Status, Belonging, Certainty",
          "Logic is secondary to emotion"
        ],
        scenarios: [
          {
            id: "s1-correct-public",
            title: "The Public Correction",
            energy_cost: 15,
            xp_reward: 40,
            setup: "You're in class. Your teacher makes a factual error while explaining something you know well. Several classmates are nodding along, accepting the wrong information. You know the correct answer with 100% certainty.",
            characters: ["Teacher (Mrs. Chen)", "25 classmates"],
            social_context: "Public classroom setting. Teacher holds authority position. Other students are watching.",
            turns: [
              {
                situation: "Mrs. Chen just stated that the Great Wall of China is visible from space. You know this is a common myth. She's about to move on to the next topic.",
                choices: [
                  {
                    text: "Raise your hand and say: \"Actually, that's a common misconception. NASA has confirmed the Great Wall isn't visible from space.\"",
                    signals: ["Direct correction", "Public challenge to authority", "Factual but socially costly"],
                    outcome: "corrected_public",
                    status_impact: -10,
                    reputation_tag: "know-it-all"
                  },
                  {
                    text: "Raise your hand: \"That's really interesting — I read something different about that recently. Could it depend on the orbit altitude?\"",
                    signals: ["Framed as curiosity", "Gives teacher room to self-correct", "Preserves authority"],
                    outcome: "curious_reframe",
                    status_impact: 15,
                    reputation_tag: "thoughtful"
                  },
                  {
                    text: "Say nothing now. After class, approach Mrs. Chen privately and mention what you read.",
                    signals: ["Avoids public confrontation", "Respects hierarchy", "Delayed but safe"],
                    outcome: "private_after",
                    status_impact: 10,
                    reputation_tag: "respectful"
                  },
                  {
                    text: "Blurt out: \"That's wrong. It's been debunked.\"",
                    signals: ["No filter", "Dismissive tone", "Maximum threat to authority"],
                    outcome: "blunt_correction",
                    status_impact: -25,
                    reputation_tag: "rude"
                  }
                ]
              },
              {
                situation_by_outcome: {
                  corrected_public: "Mrs. Chen pauses. Her smile tightens. \"Well, that's one perspective,\" she says coolly, then moves on. Two classmates smirk. One whispers \"here we go again.\" After class, your friend says you embarrassed her.",
                  curious_reframe: "Mrs. Chen looks interested. \"Good question! Let me look that up for next class.\" A classmate turns to you: \"I didn't know that either.\" The teacher seems to appreciate your approach.",
                  private_after: "Class ends normally. You approach Mrs. Chen at her desk. She listens, checks her phone, and says \"You're right — I'll correct it next class. Thanks for telling me quietly.\" She seems genuinely grateful.",
                  blunt_correction: "The room goes silent. Mrs. Chen's face reddens. \"Thank you for that... input,\" she says icily. Several students stare at you. Someone mutters \"dude, chill.\" The teacher avoids eye contact with you for the rest of class."
                },
                choices_by_outcome: {
                  corrected_public: [
                    { text: "Try to smooth it over: \"I didn't mean to put you on the spot, I just think facts matter.\"", signals: ["Attempted repair", "Still centers self"], outcome: "repair_attempt", status_impact: -5 },
                    { text: "Say nothing and let it go", signals: ["Avoids escalation", "Damage already done"], outcome: "let_go", status_impact: 0 },
                    { text: "Double down with more evidence", signals: ["Escalates", "Prioritizes being right over relationship"], outcome: "double_down", status_impact: -20 }
                  ],
                  curious_reframe: [
                    { text: "After class, share the NASA article with Mrs. Chen via email", signals: ["Helpful follow-through", "Builds relationship"], outcome: "follow_up_positive", status_impact: 10 },
                    { text: "Tell your friend \"I knew she was wrong the whole time\"", signals: ["Bragging", "Undermines the graceful approach you just took"], outcome: "brag_after", status_impact: -10 },
                    { text: "Move on, satisfied with how it went", signals: ["Secure", "Doesn't need validation"], outcome: "move_on_good", status_impact: 5 }
                  ],
                  private_after: [
                    { text: "\"No problem. I figured it would be easier to mention it privately.\"", signals: ["Mature", "Shows social awareness"], outcome: "graceful_close", status_impact: 10 },
                    { text: "\"Yeah, you really should fact-check things before teaching them.\"", signals: ["Judgmental", "Undermines the goodwill you just built"], outcome: "lecture_teacher", status_impact: -15 }
                  ],
                  blunt_correction: [
                    { text: "Apologize: \"Sorry, I didn't mean it to come out that way.\"", signals: ["Damage control", "Shows self-awareness"], outcome: "apologize", status_impact: 5 },
                    { text: "Feel confused about why everyone reacted that way", signals: ["Missing the social signal"], outcome: "confused", status_impact: -5 },
                    { text: "Mutter \"but I was right\" under your breath", signals: ["Defiant", "Misses the point entirely"], outcome: "defiant", status_impact: -15 }
                  ]
                }
              }
            ]
          },
          {
            id: "s1-joining-group",
            title: "The New Group",
            energy_cost: 20,
            xp_reward: 45,
            setup: "It's lunch time. You usually eat alone, which is fine. But today you notice a group of 4 students from your science class sitting together, talking about a video game you really like. You know a LOT about this game.",
            characters: ["Raj (friendly, casual leader)", "Sumi (quiet, observant)", "Tyler (loud, competitive)", "Mika (new student, also trying to fit in)"],
            social_context: "Cafeteria. Open seating. Low-stakes but high-anxiety situation. The group hasn't invited you but hasn't excluded you either.",
            turns: [
              {
                situation: "The group is debating the best strategy in the game. Tyler says something that's completely wrong. Raj and Sumi are nodding along. There's an empty seat at their table.",
                choices: [
                  {
                    text: "Walk up and sit down: \"Hey, I play that game too. Tyler, that strategy actually got nerfed in the last patch — the meta shifted to...\"",
                    signals: ["Confident entry", "But immediately corrects someone", "Positions self as expert over belonging"],
                    outcome: "correct_entry",
                    status_impact: -5,
                    reputation_tag: "try-hard"
                  },
                  {
                    text: "Walk up: \"Hey, mind if I sit here? I heard you talking about [game] — I've been playing it a lot lately.\"",
                    signals: ["Asks permission", "Shows interest", "Doesn't immediately dominate"],
                    outcome: "polite_entry",
                    status_impact: 15,
                    reputation_tag: "cool"
                  },
                  {
                    text: "Hover nearby hoping someone notices you and invites you over",
                    signals: ["Passive", "Creates awkward energy", "Puts burden on others"],
                    outcome: "hover",
                    status_impact: -10,
                    reputation_tag: "awkward"
                  },
                  {
                    text: "Decide it's not worth the energy today and eat alone",
                    signals: ["Self-aware about energy", "But avoids growth opportunity"],
                    outcome: "avoid",
                    status_impact: 0,
                    reputation_tag: null
                  }
                ]
              },
              {
                situation_by_outcome: {
                  correct_entry: "Tyler looks annoyed. \"Uh, okay?\" Raj gives a half-smile. Sumi watches silently. You're sitting there but the vibe shifted. Tyler starts talking to Raj, slightly turning away from you.",
                  polite_entry: "Raj moves his bag: \"Yeah, sure! You play [game]?\" Tyler keeps talking but makes space. Sumi gives you a small nod. You're in.",
                  hover: "You stand near the table for an uncomfortable 30 seconds. Sumi notices and looks at you, then looks away. Nobody invites you. Tyler glances at you and says \"uh, you need something?\"",
                  avoid: "You eat alone. It's peaceful. But later in science class, you hear them planning to play together after school and wish you'd said something."
                },
                choices_by_outcome: {
                  correct_entry: [
                    { text: "Shift approach: \"Sorry, I just got excited. What characters do you guys main?\"", signals: ["Self-correction", "Redirects to them", "Shows awareness"], outcome: "recovery_ask", status_impact: 10 },
                    { text: "Keep sharing game knowledge to prove your value", signals: ["Doubles down on expertise", "Misreads the room"], outcome: "info_dump", status_impact: -15 },
                    { text: "Go quiet and just listen for a while", signals: ["Recalibrates", "Lets tension dissipate"], outcome: "go_quiet", status_impact: 5 }
                  ],
                  polite_entry: [
                    { text: "\"Yeah, I'm pretty into it. What's your favorite part?\" (ask questions first)", signals: ["Shows interest in them", "Builds rapport before sharing"], outcome: "ask_first", status_impact: 15 },
                    { text: "Launch into your detailed tier list and strategy analysis", signals: ["Overloads with info", "Makes it about you"], outcome: "monologue", status_impact: -10 },
                    { text: "Listen for a bit, then add small comments that build on what others say", signals: ["Collaborative", "Reads the flow", "Adds value without dominating"], outcome: "build_on", status_impact: 20 }
                  ],
                  hover: [
                    { text: "Just sit down and say \"Hey, I play that game too\"", signals: ["Recovers from awkward start", "Takes initiative"], outcome: "sit_anyway", status_impact: 5 },
                    { text: "Walk away quickly", signals: ["Retreat", "Embarrassment avoidance"], outcome: "retreat", status_impact: -5 }
                  ],
                  avoid: [
                    { text: "In science class, casually mention to Raj you play the same game", signals: ["Lower-pressure approach", "One-on-one is easier"], outcome: "delayed_connect", status_impact: 10 },
                    { text: "Continue eating alone, it's fine", signals: ["Comfort zone", "No growth"], outcome: "stay_alone", status_impact: 0 }
                  ]
                }
              }
            ]
          }
        ]
      },
      "ch-2": {
        title: "Status & Power Dynamics",
        subtitle: "The invisible hierarchy",
        concepts: [
          "Visible vs invisible status",
          "Competence vs dominance hierarchies",
          "Threat responses shape all reactions"
        ],
        scenarios: [
          {
            id: "s2-classmate-mocks",
            title: "The Mockery",
            energy_cost: 25,
            xp_reward: 50,
            setup: "You're presenting your science project to the class. You spent weeks on it and it's genuinely good. Halfway through, Tyler (the loud kid from the popular group) makes a joke about your presentation style. Several people laugh.",
            characters: ["Tyler (popular, dominant)", "Mrs. Chen (teacher)", "Class of 25"],
            social_context: "Public presentation. High vulnerability moment. Status challenge from a higher-status peer.",
            turns: [
              {
                situation: "Tyler says \"Dude, are you reading a Wikipedia article?\" and a few people laugh. Your heart rate spikes. Mrs. Chen hasn't intervened yet. You're standing at the front of the class.",
                choices: [
                  {
                    text: "Pause, look at Tyler calmly: \"I'll take that as a compliment — Wikipedia is pretty accurate.\" Then continue.",
                    signals: ["Composure under fire", "Reframes the attack", "Doesn't escalate or collapse"],
                    outcome: "calm_reframe",
                    status_impact: 25,
                    reputation_tag: "unshakeable"
                  },
                  {
                    text: "Ignore it completely and keep presenting as if nothing happened",
                    signals: ["Stoic", "Could read as strong or as not picking up the cue"],
                    outcome: "ignore_it",
                    status_impact: 5,
                    reputation_tag: "focused"
                  },
                  {
                    text: "Fire back: \"At least I did the research. When's the last time you read anything?\"",
                    signals: ["Counterattack", "Escalates conflict", "Risky in front of teacher"],
                    outcome: "fire_back",
                    status_impact: -5,
                    reputation_tag: "fighter"
                  },
                  {
                    text: "Get flustered, lose your place, mumble through the rest",
                    signals: ["Visible distress", "Signals vulnerability", "Tyler 'wins'"],
                    outcome: "flustered",
                    status_impact: -20,
                    reputation_tag: "easy-target"
                  }
                ]
              }
            ]
          }
        ]
      },
      "ch-3": {
        title: "Emotional Pattern Recognition",
        subtitle: "Decoding what people actually feel",
        concepts: [
          "Anger = boundary violation",
          "Withdrawal = overwhelm or shutdown",
          "Arrogance = insecurity signal",
          "Silence = processing OR disengagement (context matters)"
        ],
        scenarios: [
          {
            id: "s3-friend-silent",
            title: "The Silent Friend",
            energy_cost: 20,
            xp_reward: 45,
            setup: "Your friend Kai has been quiet all day. Usually he's talkative and jokes around. Today he gave one-word answers at lunch and is staring at his phone without actually using it. When you asked if he's okay, he said \"I'm fine.\"",
            characters: ["Kai (close friend)", "You"],
            social_context: "One-on-one after school. Low external pressure. Emotional reading required.",
            turns: [
              {
                situation: "You're walking home together. Kai said \"I'm fine\" but everything about his behavior says otherwise. You need to identify the emotional driver before choosing how to respond.",
                emotion_guess: {
                  prompt: "Before responding, what do you think Kai is actually feeling?",
                  options: [
                    { text: "Overwhelmed — something happened and he's shutting down", correct: true, explanation: "The withdrawal pattern (quiet, one-word answers, staring blankly) strongly suggests overwhelm. He's not angry at you (no hostility) and not bored (he's physically present but mentally elsewhere)." },
                    { text: "Angry at me — I must have done something", correct: false, explanation: "Anger directed at you would typically show as hostility, avoidance of YOU specifically, or short/sharp responses. Kai is still walking with you — he's not avoiding you." },
                    { text: "Just tired, nothing to worry about", correct: false, explanation: "Possible, but the pattern shift from 'usually talkative' to 'one-word answers + blank staring' suggests more than tiredness. Tired people still engage — this looks like emotional shutdown." },
                    { text: "He wants attention and is being dramatic", correct: false, explanation: "Attention-seeking looks different — it's louder, more performative. Kai is withdrawing, which is the opposite of seeking attention." }
                  ]
                },
                choices: [
                  {
                    text: "\"You don't seem fine, and that's okay. I'm not gonna push it, but I'm here if you want to talk.\"",
                    signals: ["Names what you see", "Gives space", "Offers without demanding"],
                    outcome: "gentle_open",
                    status_impact: 15,
                    reputation_tag: "safe-person"
                  },
                  {
                    text: "\"Come on, tell me what's wrong. I can tell something's up.\"",
                    signals: ["Pushing past his boundary", "Well-intentioned but pressuring"],
                    outcome: "push_it",
                    status_impact: -5,
                    reputation_tag: "pushy"
                  },
                  {
                    text: "Change the subject to something he usually enjoys — bring up a game or a show",
                    signals: ["Indirect support", "Gives him an emotional exit ramp", "Respectful of his space"],
                    outcome: "redirect",
                    status_impact: 10,
                    reputation_tag: "good-friend"
                  },
                  {
                    text: "Match his silence — just walk together without talking",
                    signals: ["Companionable silence", "No pressure", "Being present without words"],
                    outcome: "match_silence",
                    status_impact: 10,
                    reputation_tag: "steady"
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  "level-2": {
    title: "Tactical Interaction",
    color: "#eab308",
    chapters: {
      "ch-4": {
        title: "Team Mode Mechanics",
        subtitle: "Coordination beats brilliance",
        concepts: [
          "Coordination > individual brilliance",
          "Shared ownership language builds trust",
          "Pre-emptive alignment prevents conflict"
        ],
        scenarios: [
          {
            id: "s4-slack-teammate",
            title: "The Free Rider",
            energy_cost: 20,
            xp_reward: 50,
            setup: "You're in a group project with 3 others. One teammate, Jason, hasn't done any work. The project is due in 3 days. The other two members are complaining to you privately. Jason keeps saying \"yeah I'll get to it\" but nothing happens.",
            characters: ["Jason (free rider)", "Priya (frustrated, hard-working)", "Sam (conflict-avoidant)", "You"],
            social_context: "Group project. Shared grade. Building resentment. You need to address this without nuking the team dynamic.",
            turns: [
              {
                situation: "Priya just messaged you: \"I'm done covering for Jason. If he doesn't do his part by tomorrow, I'm telling the teacher.\" Sam says nothing. Jason just posted a meme in the group chat.",
                choices: [
                  {
                    text: "Message the group: \"Hey everyone, let's split up what's left and put names next to each task with deadlines. Jason, can you take [specific task] by tomorrow?\"",
                    signals: ["Structured approach", "Gives Jason a specific, achievable task", "Doesn't accuse, creates accountability"],
                    outcome: "structured_ask",
                    status_impact: 20,
                    reputation_tag: "leader"
                  },
                  {
                    text: "DM Jason directly: \"Hey man, Priya's about to go to the teacher. I wanted to give you a heads up. Can you do [X] by tomorrow?\"",
                    signals: ["Private warning", "Gives Jason a chance to save face", "Uses external pressure without being the bad guy"],
                    outcome: "private_warning",
                    status_impact: 15,
                    reputation_tag: "strategic"
                  },
                  {
                    text: "Tell Priya: \"Go ahead, tell the teacher. It's not our problem to fix.\"",
                    signals: ["Offloads responsibility", "Lets someone else be the enforcer", "Could fracture the team"],
                    outcome: "let_priya",
                    status_impact: -5,
                    reputation_tag: "passive"
                  },
                  {
                    text: "Just do Jason's part yourself to avoid conflict",
                    signals: ["Avoids confrontation", "Enables the behavior", "Builds resentment"],
                    outcome: "do_it_yourself",
                    status_impact: -15,
                    reputation_tag: "doormat"
                  }
                ]
              }
            ]
          }
        ]
      },
      "ch-5": {
        title: "Authority Navigation",
        subtitle: "Working within hierarchies",
        concepts: [
          "Every hierarchy has unwritten rules",
          "How to disagree safely with authority",
          "Managing unfairness without self-destruction"
        ],
        scenarios: []
      },
      "ch-6": {
        title: "Friendship Algorithms",
        subtitle: "The mechanics of connection",
        concepts: [
          "Interest matching is the entry point",
          "Vulnerability pacing — how fast to open up",
          "Reciprocity balance — matching energy",
          "Social signaling — what your actions communicate"
        ],
        scenarios: []
      }
    }
  },
  "level-3": {
    title: "Advanced Strategy",
    color: "#3b82f6",
    chapters: {
      "ch-7": { title: "Influence Engineering", subtitle: "Ideas as shared wins", concepts: ["Ask > Tell", "Frame ideas as shared discoveries", "Pre-empt resistance", "Give credit strategically"], scenarios: [] },
      "ch-8": { title: "Conflict De-escalation", subtitle: "The 5-step protocol", concepts: ["Lower temperature", "Clarify goal", "Reflect emotion", "Offer options", "Anchor to shared objective"], scenarios: [] },
      "ch-9": { title: "Social Energy Management", subtitle: "Your most finite resource", concepts: ["Energy is real and limited", "Recovery mechanics", "Strategic disengagement", "Boundary setting as self-preservation"], scenarios: [] }
    }
  },
  "level-4": {
    title: "Mastery Mode",
    color: "#ef4444",
    chapters: {
      "ch-10": { title: "Dynamic Scenarios", subtitle: "The simulation adapts to you", concepts: ["Multiple characters with memory", "Reputation follows you", "Long-term consequences", "Your patterns shape your world"], scenarios: [] }
    }
  }
};

// ─── CONSTANTS ────────────────────────────────────────────────────────
const LEVEL_ICONS = { "level-1": "◉", "level-2": "◈", "level-3": "◆", "level-4": "★" };

// ─── MAIN APP ─────────────────────────────────────────────────────────
export default function SocialOS() {
  const [screen, setScreen] = useState("home"); // home | levels | chapter | scenario | debrief
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [choiceHistory, setChoiceHistory] = useState([]);
  const [lastOutcome, setLastOutcome] = useState(null);
  const [showSignals, setShowSignals] = useState(false);
  const [emotionGuess, setEmotionGuess] = useState(null);
  const [emotionFeedback, setEmotionFeedback] = useState(null);
  const [animatingChoice, setAnimatingChoice] = useState(null);
  const [energy, setEnergy] = useState(100);
  const [xp, setXp] = useState(0);
  const [reputation, setReputation] = useState({});
  const [completedScenarios, setCompletedScenarios] = useState([]);
  const [debriefText, setDebriefText] = useState("");
  const [debriefLoading, setDebriefLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setFadeIn(false);
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, [screen, selectedScenario, currentTurn]);

  const totalStatus = choiceHistory.reduce((sum, c) => sum + (c.status_impact || 0), 0);

  // ─── NAVIGATION ──────────────────────────────────────────────────
  function goHome() {
    setScreen("home");
    setSelectedLevel(null);
    setSelectedChapter(null);
    setSelectedScenario(null);
    setCurrentTurn(0);
    setChoiceHistory([]);
    setLastOutcome(null);
    setShowSignals(false);
    setEmotionGuess(null);
    setEmotionFeedback(null);
  }

  function openLevel(levelId) {
    setSelectedLevel(levelId);
    setScreen("levels");
  }

  function openChapter(chapterId) {
    setSelectedChapter(chapterId);
    setScreen("chapter");
  }

  function startScenario(scenario) {
    if (energy < scenario.energy_cost) return;
    setSelectedScenario(scenario);
    setCurrentTurn(0);
    setChoiceHistory([]);
    setLastOutcome(null);
    setShowSignals(false);
    setEmotionGuess(null);
    setEmotionFeedback(null);
    setScreen("scenario");
  }

  function makeChoice(choice) {
    setAnimatingChoice(choice.text);
    setShowSignals(false);
    setTimeout(() => {
      setAnimatingChoice(null);
      setChoiceHistory(prev => [...prev, choice]);
      setLastOutcome(choice.outcome);
      const nextTurn = currentTurn + 1;
      if (nextTurn < selectedScenario.turns.length) {
        setCurrentTurn(nextTurn);
        setEmotionGuess(null);
        setEmotionFeedback(null);
      } else {
        finishScenario(choice);
      }
    }, 600);
  }

  async function finishScenario(lastChoice) {
    const allChoices = [...choiceHistory, lastChoice];
    setEnergy(prev => Math.max(0, prev - selectedScenario.energy_cost));
    setXp(prev => prev + selectedScenario.xp_reward);
    const latestTag = allChoices[allChoices.length - 1]?.reputation_tag;
    if (latestTag) {
      setReputation(prev => ({ ...prev, [latestTag]: (prev[latestTag] || 0) + 1 }));
    }
    setCompletedScenarios(prev => [...prev, selectedScenario.id]);
    setScreen("debrief");
    await generateDebrief(allChoices);
  }

  async function generateDebrief(allChoices) {
    setDebriefLoading(true);
    const prompt = buildDebriefPrompt(allChoices);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are the analytical coach in SocialOS, a social intelligence training system designed for people with ASD who think analytically. Your job is to debrief a scenario the player just completed.

Your style:
- Analytical, not emotional. Think game strategy guide, not therapy session.
- Use pattern recognition language: "The signal you sent was...", "The dynamic at play was..."
- Be direct about what worked and what didn't — no sugarcoating, but also no judgment
- Frame social interactions as systems with inputs and outputs
- Reference the specific choices they made
- End with one concrete "pattern to remember" they can use in real life
- Keep it to 3-4 paragraphs max
- Use "you" to address the player directly`,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "Debrief unavailable.";
      setDebriefText(text);
    } catch {
      setDebriefText("Couldn't generate debrief right now. Here's what happened: you made " + allChoices.length + " decisions with a net status impact of " + allChoices.reduce((s, c) => s + (c.status_impact || 0), 0) + ".");
    }
    setDebriefLoading(false);
  }

  function buildDebriefPrompt(allChoices) {
    const scenario = selectedScenario;
    let prompt = `SCENARIO: "${scenario.title}"\nSETUP: ${scenario.setup}\nCHARACTERS: ${scenario.characters.join(", ")}\nSOCIAL CONTEXT: ${scenario.social_context}\n\nPLAYER'S CHOICES:\n`;
    allChoices.forEach((c, i) => {
      prompt += `\nDecision ${i + 1}: "${c.text}"\n- Signals sent: ${c.signals.join(", ")}\n- Status impact: ${c.status_impact > 0 ? "+" : ""}${c.status_impact}\n- Reputation tag: ${c.reputation_tag || "none"}\n`;
    });
    prompt += `\nTotal status change: ${allChoices.reduce((s, c) => s + (c.status_impact || 0), 0)}`;
    prompt += `\n\nProvide the analytical debrief. What social dynamics were at play? What did each choice signal to others? What was the optimal path and why? What pattern should they remember?`;
    return prompt;
  }

  // ─── GET CURRENT TURN DATA ──────────────────────────────────────
  function getCurrentChoices() {
    if (!selectedScenario) return [];
    const turn = selectedScenario.turns[currentTurn];
    if (!turn) return [];
    if (currentTurn === 0) return turn.choices;
    if (turn.choices_by_outcome && lastOutcome) {
      return turn.choices_by_outcome[lastOutcome] || [];
    }
    return turn.choices || [];
  }

  function getCurrentSituation() {
    if (!selectedScenario) return "";
    const turn = selectedScenario.turns[currentTurn];
    if (!turn) return "";
    if (currentTurn === 0) return turn.situation;
    if (turn.situation_by_outcome && lastOutcome) {
      return turn.situation_by_outcome[lastOutcome] || "";
    }
    return turn.situation || "";
  }

  function getCurrentEmotionGuess() {
    if (!selectedScenario) return null;
    const turn = selectedScenario.turns[currentTurn];
    return turn?.emotion_guess || null;
  }

  // ─── RENDER ─────────────────────────────────────────────────────
  const levelEntries = Object.entries(SCENARIOS);

  // Styles
  const bg = "#0a0a0f";
  const surface = "#13131a";
  const surfaceHover = "#1a1a24";
  const border = "#1e1e2a";
  const textPrimary = "#e8e8ed";
  const textSecondary = "#8888a0";
  const accent = "#6ee7b7";
  const accentDim = "#2d6a4f";

  return (
    <div style={{
      minHeight: "100vh",
      background: bg,
      color: textPrimary,
      fontFamily: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Subtle grid background */}
      <div style={{
        position: "fixed", inset: 0, opacity: 0.03,
        backgroundImage: `linear-gradient(${border} 1px, transparent 1px), linear-gradient(90deg, ${border} 1px, transparent 1px)`,
        backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0
      }} />

      {/* Header bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: `${bg}ee`, backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${border}`,
        padding: "12px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={goHome}>
          <span style={{ fontSize: 20, color: accent }}>◎</span>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 2, color: accent }}>SOCIAL<span style={{ color: textSecondary }}>OS</span></span>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 12, color: textSecondary }}>
          <StatPill label="ENERGY" value={energy} max={100} color="#22c55e" />
          <StatPill label="XP" value={xp} color="#eab308" />
          <StatPill label="STATUS" value={totalStatus} color={totalStatus >= 0 ? "#3b82f6" : "#ef4444"} showSign />
        </div>
      </div>

      {/* Content */}
      <div ref={scrollRef} style={{
        maxWidth: 800, margin: "0 auto", padding: "32px 20px 80px",
        position: "relative", zIndex: 1,
        opacity: fadeIn ? 1 : 0,
        transform: fadeIn ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.4s ease, transform 0.4s ease"
      }}>

        {/* ─── HOME SCREEN ─── */}
        {screen === "home" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h1 style={{
                fontSize: 42, fontWeight: 800, letterSpacing: -1,
                background: `linear-gradient(135deg, ${accent}, #a78bfa)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                margin: "0 0 12px"
              }}>SocialOS</h1>
              <p style={{ color: textSecondary, fontSize: 14, margin: 0, letterSpacing: 1 }}>
                SOCIAL INTELLIGENCE SIMULATOR
              </p>
              <p style={{ color: textSecondary, fontSize: 12, marginTop: 8, fontStyle: "italic" }}>
                Pattern recognition for social dynamics
              </p>
            </div>

            {/* Reputation tags */}
            {Object.keys(reputation).length > 0 && (
              <div style={{ marginBottom: 32, padding: "16px 20px", background: surface, border: `1px solid ${border}`, borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: textSecondary, letterSpacing: 2, marginBottom: 10 }}>REPUTATION SIGNALS</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {Object.entries(reputation).map(([tag, count]) => (
                    <span key={tag} style={{
                      padding: "4px 10px", borderRadius: 4, fontSize: 12,
                      background: `${accent}15`, border: `1px solid ${accent}30`, color: accent
                    }}>
                      {tag} ×{count}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Level cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {levelEntries.map(([levelId, level], i) => {
                const chapters = Object.values(level.chapters);
                const hasScenarios = chapters.some(ch => ch.scenarios?.length > 0);
                return (
                  <div
                    key={levelId}
                    onClick={() => openLevel(levelId)}
                    style={{
                      background: surface,
                      border: `1px solid ${border}`,
                      borderLeft: `3px solid ${level.color}`,
                      borderRadius: 8,
                      padding: "20px 24px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      opacity: hasScenarios ? 1 : 0.5,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = surfaceHover; e.currentTarget.style.borderColor = level.color + "60"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = surface; e.currentTarget.style.borderColor = border; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 10, color: level.color, letterSpacing: 2, marginBottom: 6 }}>
                          {LEVEL_ICONS[levelId]} LEVEL {i + 1}
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{level.title}</div>
                        <div style={{ fontSize: 12, color: textSecondary, marginTop: 4 }}>
                          {chapters.length} chapters · {chapters.reduce((n, ch) => n + (ch.scenarios?.length || 0), 0)} scenarios
                        </div>
                      </div>
                      {!hasScenarios && (
                        <span style={{ fontSize: 10, color: textSecondary, background: `${border}`, padding: "4px 10px", borderRadius: 4 }}>
                          COMING SOON
                        </span>
                      )}
                      {hasScenarios && (
                        <span style={{ fontSize: 18, color: textSecondary }}>→</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── LEVEL VIEW ─── */}
        {screen === "levels" && selectedLevel && (
          <div>
            <button onClick={goHome} style={backBtnStyle(textSecondary)}>← Back</button>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: SCENARIOS[selectedLevel].color }}>
              {SCENARIOS[selectedLevel].title}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
              {Object.entries(SCENARIOS[selectedLevel].chapters).map(([chId, ch]) => {
                const hasContent = ch.scenarios?.length > 0;
                return (
                  <div
                    key={chId}
                    onClick={() => hasContent && openChapter(chId)}
                    style={{
                      background: surface, border: `1px solid ${border}`, borderRadius: 8,
                      padding: "20px 24px", cursor: hasContent ? "pointer" : "default",
                      opacity: hasContent ? 1 : 0.45,
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={e => { if (hasContent) e.currentTarget.style.background = surfaceHover; }}
                    onMouseLeave={e => { e.currentTarget.style.background = surface; }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{ch.title}</div>
                    <div style={{ fontSize: 12, color: textSecondary, marginTop: 4 }}>{ch.subtitle}</div>
                    <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {ch.concepts.map((c, i) => (
                        <span key={i} style={{
                          fontSize: 11, padding: "3px 8px", borderRadius: 4,
                          background: `${SCENARIOS[selectedLevel].color}10`,
                          border: `1px solid ${SCENARIOS[selectedLevel].color}25`,
                          color: SCENARIOS[selectedLevel].color
                        }}>{c}</span>
                      ))}
                    </div>
                    {hasContent && (
                      <div style={{ fontSize: 11, color: textSecondary, marginTop: 10 }}>
                        {ch.scenarios.length} scenario{ch.scenarios.length !== 1 ? "s" : ""} available
                      </div>
                    )}
                    {!hasContent && (
                      <div style={{ fontSize: 11, color: textSecondary, marginTop: 10 }}>Scenarios coming soon</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── CHAPTER VIEW ─── */}
        {screen === "chapter" && selectedLevel && selectedChapter && (
          <div>
            <button onClick={() => setScreen("levels")} style={backBtnStyle(textSecondary)}>← Back to {SCENARIOS[selectedLevel].title}</button>
            {(() => {
              const ch = SCENARIOS[selectedLevel].chapters[selectedChapter];
              return (
                <div>
                  <h2 style={{ fontSize: 26, fontWeight: 800, margin: "16px 0 4px" }}>{ch.title}</h2>
                  <p style={{ color: textSecondary, fontSize: 13, margin: "0 0 28px" }}>{ch.subtitle}</p>

                  {/* Key concepts */}
                  <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: "16px 20px", marginBottom: 24 }}>
                    <div style={{ fontSize: 10, color: accent, letterSpacing: 2, marginBottom: 10 }}>KEY CONCEPTS</div>
                    {ch.concepts.map((c, i) => (
                      <div key={i} style={{ fontSize: 13, color: textSecondary, padding: "4px 0", display: "flex", gap: 8 }}>
                        <span style={{ color: accent }}>▸</span> {c}
                      </div>
                    ))}
                  </div>

                  {/* Scenarios */}
                  <div style={{ fontSize: 10, color: textSecondary, letterSpacing: 2, marginBottom: 12 }}>SCENARIOS</div>
                  {ch.scenarios.map(sc => {
                    const done = completedScenarios.includes(sc.id);
                    const lowEnergy = energy < sc.energy_cost;
                    return (
                      <div
                        key={sc.id}
                        onClick={() => !lowEnergy && startScenario(sc)}
                        style={{
                          background: surface, border: `1px solid ${border}`, borderRadius: 8,
                          padding: "20px 24px", marginBottom: 10,
                          cursor: lowEnergy ? "not-allowed" : "pointer",
                          opacity: lowEnergy ? 0.5 : 1,
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={e => { if (!lowEnergy) e.currentTarget.style.background = surfaceHover; }}
                        onMouseLeave={e => { e.currentTarget.style.background = surface; }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <div style={{ fontSize: 16, fontWeight: 700 }}>
                              {done && <span style={{ color: accent, marginRight: 6 }}>✓</span>}
                              {sc.title}
                            </div>
                            <div style={{ fontSize: 12, color: textSecondary, marginTop: 4, lineHeight: 1.5 }}>{sc.setup.slice(0, 120)}...</div>
                          </div>
                          <div style={{ display: "flex", gap: 10, flexShrink: 0, marginLeft: 16 }}>
                            <MiniStat label="ENERGY" value={`-${sc.energy_cost}`} color="#ef4444" />
                            <MiniStat label="XP" value={`+${sc.xp_reward}`} color="#eab308" />
                          </div>
                        </div>
                        {lowEnergy && (
                          <div style={{ fontSize: 11, color: "#ef4444", marginTop: 8 }}>Not enough energy — rest or come back later</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* ─── SCENARIO ─── */}
        {screen === "scenario" && selectedScenario && (
          <div>
            <div style={{ fontSize: 10, color: accent, letterSpacing: 2, marginBottom: 8 }}>
              SCENARIO · TURN {currentTurn + 1}/{selectedScenario.turns.length}
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 16px" }}>{selectedScenario.title}</h2>

            {/* Setup (only on first turn) */}
            {currentTurn === 0 && (
              <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: "16px 20px", marginBottom: 16 }}>
                <div style={{ fontSize: 13, lineHeight: 1.7, color: textSecondary }}>{selectedScenario.setup}</div>
                <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {selectedScenario.characters.map((c, i) => (
                    <span key={i} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, background: `${accent}10`, border: `1px solid ${accent}20`, color: accent }}>{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Situation */}
            <div style={{
              background: `${accent}08`, border: `1px solid ${accent}20`, borderRadius: 8,
              padding: "16px 20px", marginBottom: 20
            }}>
              <div style={{ fontSize: 10, color: accent, letterSpacing: 2, marginBottom: 8 }}>SITUATION</div>
              <div style={{ fontSize: 14, lineHeight: 1.7 }}>{getCurrentSituation()}</div>
            </div>

            {/* Emotion guess (if applicable) */}
            {getCurrentEmotionGuess() && !emotionGuess && (
              <div style={{
                background: "#3b82f610", border: "1px solid #3b82f630", borderRadius: 8,
                padding: "16px 20px", marginBottom: 20
              }}>
                <div style={{ fontSize: 10, color: "#3b82f6", letterSpacing: 2, marginBottom: 8 }}>⚡ EMOTION SCAN REQUIRED</div>
                <div style={{ fontSize: 13, color: textSecondary, marginBottom: 12 }}>{getCurrentEmotionGuess().prompt}</div>
                {getCurrentEmotionGuess().options.map((opt, i) => (
                  <div
                    key={i}
                    onClick={() => { setEmotionGuess(opt); setEmotionFeedback(opt); }}
                    style={{
                      padding: "10px 14px", marginBottom: 6, borderRadius: 6,
                      background: surface, border: `1px solid ${border}`,
                      cursor: "pointer", fontSize: 13, transition: "all 0.2s ease"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = surfaceHover; e.currentTarget.style.borderColor = "#3b82f640"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = surface; e.currentTarget.style.borderColor = border; }}
                  >
                    {opt.text}
                  </div>
                ))}
              </div>
            )}

            {/* Emotion feedback */}
            {emotionFeedback && (
              <div style={{
                background: emotionFeedback.correct ? `${accent}10` : "#ef444410",
                border: `1px solid ${emotionFeedback.correct ? accent + "30" : "#ef444430"}`,
                borderRadius: 8, padding: "16px 20px", marginBottom: 20
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: emotionFeedback.correct ? accent : "#ef4444", marginBottom: 6 }}>
                  {emotionFeedback.correct ? "✓ CORRECT READ" : "✗ MISREAD"}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: textSecondary }}>{emotionFeedback.explanation}</div>
              </div>
            )}

            {/* Choices */}
            {(getCurrentEmotionGuess() ? emotionGuess : true) && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: textSecondary, letterSpacing: 2 }}>CHOOSE YOUR RESPONSE</div>
                  <button
                    onClick={() => setShowSignals(!showSignals)}
                    style={{
                      background: "none", border: `1px solid ${border}`, color: textSecondary,
                      fontSize: 10, padding: "4px 10px", borderRadius: 4, cursor: "pointer",
                      letterSpacing: 1
                    }}
                  >
                    {showSignals ? "HIDE" : "SHOW"} SIGNALS
                  </button>
                </div>
                {getCurrentChoices().map((choice, i) => (
                  <div
                    key={i}
                    onClick={() => !animatingChoice && makeChoice(choice)}
                    style={{
                      padding: "14px 18px", marginBottom: 8, borderRadius: 8,
                      background: animatingChoice === choice.text ? `${accent}15` : surface,
                      border: `1px solid ${animatingChoice === choice.text ? accent + "40" : border}`,
                      cursor: animatingChoice ? "default" : "pointer",
                      transition: "all 0.3s ease",
                      transform: animatingChoice === choice.text ? "scale(0.98)" : "scale(1)",
                    }}
                    onMouseEnter={e => { if (!animatingChoice) { e.currentTarget.style.background = surfaceHover; e.currentTarget.style.borderColor = accent + "30"; } }}
                    onMouseLeave={e => { if (!animatingChoice) { e.currentTarget.style.background = surface; e.currentTarget.style.borderColor = border; } }}
                  >
                    <div style={{ fontSize: 13, lineHeight: 1.6 }}>{choice.text}</div>
                    {showSignals && (
                      <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {choice.signals.map((s, j) => (
                          <span key={j} style={{
                            fontSize: 10, padding: "2px 8px", borderRadius: 3,
                            background: `#a78bfa15`, border: `1px solid #a78bfa25`, color: "#a78bfa"
                          }}>{s}</span>
                        ))}
                        <span style={{
                          fontSize: 10, padding: "2px 8px", borderRadius: 3,
                          background: choice.status_impact >= 0 ? `${accent}15` : "#ef444415",
                          border: `1px solid ${choice.status_impact >= 0 ? accent + "25" : "#ef444425"}`,
                          color: choice.status_impact >= 0 ? accent : "#ef4444"
                        }}>
                          {choice.status_impact > 0 ? "+" : ""}{choice.status_impact} status
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── DEBRIEF ─── */}
        {screen === "debrief" && selectedScenario && (
          <div>
            <div style={{ fontSize: 10, color: accent, letterSpacing: 2, marginBottom: 8 }}>DEBRIEF</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>{selectedScenario.title}</h2>
            <p style={{ color: textSecondary, fontSize: 12, margin: "0 0 24px" }}>Analytical breakdown of your choices</p>

            {/* Choice summary */}
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: "16px 20px", marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: textSecondary, letterSpacing: 2, marginBottom: 12 }}>YOUR PATH</div>
              {choiceHistory.map((c, i) => (
                <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < choiceHistory.length - 1 ? `1px solid ${border}` : "none" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Decision {i + 1}</div>
                  <div style={{ fontSize: 13, color: textSecondary, lineHeight: 1.5 }}>{c.text}</div>
                  <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: 10, padding: "2px 8px", borderRadius: 3,
                      background: c.status_impact >= 0 ? `${accent}15` : "#ef444415",
                      color: c.status_impact >= 0 ? accent : "#ef4444"
                    }}>
                      {c.status_impact > 0 ? "+" : ""}{c.status_impact} status
                    </span>
                    {c.reputation_tag && (
                      <span style={{
                        fontSize: 10, padding: "2px 8px", borderRadius: 3,
                        background: "#a78bfa15", color: "#a78bfa"
                      }}>
                        {c.reputation_tag}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1, background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: textSecondary, letterSpacing: 1 }}>ENERGY SPENT</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#ef4444", marginTop: 4 }}>-{selectedScenario.energy_cost}</div>
              </div>
              <div style={{ flex: 1, background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: textSecondary, letterSpacing: 1 }}>XP EARNED</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#eab308", marginTop: 4 }}>+{selectedScenario.xp_reward}</div>
              </div>
              <div style={{ flex: 1, background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: textSecondary, letterSpacing: 1 }}>NET STATUS</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: totalStatus >= 0 ? accent : "#ef4444", marginTop: 4 }}>
                  {totalStatus > 0 ? "+" : ""}{totalStatus}
                </div>
              </div>
            </div>

            {/* AI Debrief */}
            <div style={{
              background: `${accent}05`, border: `1px solid ${accent}20`, borderRadius: 8,
              padding: "20px 24px", marginBottom: 20
            }}>
              <div style={{ fontSize: 10, color: accent, letterSpacing: 2, marginBottom: 12 }}>◎ COACH ANALYSIS</div>
              {debriefLoading ? (
                <div style={{ color: textSecondary, fontSize: 13 }}>
                  <span style={{ display: "inline-block", animation: "pulse 1.5s infinite" }}>Analyzing social dynamics...</span>
                </div>
              ) : (
                <div style={{ fontSize: 13, lineHeight: 1.8, color: textSecondary, whiteSpace: "pre-wrap" }}>{debriefText}</div>
              )}
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => startScenario(selectedScenario)}
                style={{
                  flex: 1, padding: "12px 20px", borderRadius: 8,
                  background: "none", border: `1px solid ${border}`,
                  color: textSecondary, fontSize: 13, fontWeight: 600,
                  cursor: energy < selectedScenario.energy_cost ? "not-allowed" : "pointer",
                  opacity: energy < selectedScenario.energy_cost ? 0.4 : 1,
                  fontFamily: "inherit"
                }}
              >
                ↻ Replay
              </button>
              <button
                onClick={goHome}
                style={{
                  flex: 1, padding: "12px 20px", borderRadius: 8,
                  background: accent, border: "none",
                  color: bg, fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit"
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700;800&display=swap');
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${bg}; }
        ::-webkit-scrollbar-thumb { background: ${border}; border-radius: 3px; }
      `}</style>
    </div>
  );
}

// ─── HELPER COMPONENTS ────────────────────────────────────────────────
function StatPill({ label, value, max, color, showSign }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 10, letterSpacing: 1, opacity: 0.6 }}>{label}</span>
      <span style={{ fontWeight: 700, fontSize: 13, color }}>
        {showSign && value > 0 ? "+" : ""}{value}{max ? `/${max}` : ""}
      </span>
      {max && (
        <div style={{ width: 40, height: 3, background: "#1e1e2a", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.5s ease" }} />
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 9, letterSpacing: 1, color: "#8888a0", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

function backBtnStyle(color) {
  return {
    background: "none", border: "none", color, fontSize: 12, cursor: "pointer",
    padding: "4px 0", marginBottom: 12, fontFamily: "inherit"
  };
}
