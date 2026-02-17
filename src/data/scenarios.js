// SocialOS — Scenario Database
export const SCENARIOS = {
  "level-1": {
    title: "Social Physics",
    color: "#58CC02",
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
                    text: "Raise your hand: \"That's really interesting \u2014 I read something different about that recently. Could it depend on the orbit altitude?\"",
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
                  private_after: "Class ends normally. You approach Mrs. Chen at her desk. She listens, checks her phone, and says \"You're right \u2014 I'll correct it next class. Thanks for telling me quietly.\" She seems genuinely grateful.",
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
                    text: "Walk up and sit down: \"Hey, I play that game too. Tyler, that strategy actually got nerfed in the last patch \u2014 the meta shifted to...\"",
                    signals: ["Confident entry", "But immediately corrects someone", "Positions self as expert over belonging"],
                    outcome: "correct_entry",
                    status_impact: -5,
                    reputation_tag: "try-hard"
                  },
                  {
                    text: "Walk up: \"Hey, mind if I sit here? I heard you talking about [game] \u2014 I've been playing it a lot lately.\"",
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
                    text: "Pause, look at Tyler calmly: \"I'll take that as a compliment \u2014 Wikipedia is pretty accurate.\" Then continue.",
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
                    { text: "Overwhelmed \u2014 something happened and he's shutting down", correct: true, explanation: "The withdrawal pattern (quiet, one-word answers, staring blankly) strongly suggests overwhelm. He's not angry at you (no hostility) and not bored (he's physically present but mentally elsewhere)." },
                    { text: "Angry at me \u2014 I must have done something", correct: false, explanation: "Anger directed at you would typically show as hostility, avoidance of YOU specifically, or short/sharp responses. Kai is still walking with you \u2014 he's not avoiding you." },
                    { text: "Just tired, nothing to worry about", correct: false, explanation: "Possible, but the pattern shift from 'usually talkative' to 'one-word answers + blank staring' suggests more than tiredness. Tired people still engage \u2014 this looks like emotional shutdown." },
                    { text: "He wants attention and is being dramatic", correct: false, explanation: "Attention-seeking looks different \u2014 it's louder, more performative. Kai is withdrawing, which is the opposite of seeking attention." }
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
                    text: "Change the subject to something he usually enjoys \u2014 bring up a game or a show",
                    signals: ["Indirect support", "Gives him an emotional exit ramp", "Respectful of his space"],
                    outcome: "redirect",
                    status_impact: 10,
                    reputation_tag: "good-friend"
                  },
                  {
                    text: "Match his silence \u2014 just walk together without talking",
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
    color: "#FFC800",
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
        scenarios: [
          {
            id: "s5-unfair-detention",
            title: "The Unfair Detention",
            energy_cost: 25,
            xp_reward: 55,
            setup: "You were talking to your friend when the bell rang. You both entered class 10 seconds late. The teacher, Mr. Torres, gives YOU a detention but not your friend, who slipped in behind another student. Mr. Torres has a reputation for being strict but fair \u2014 so this feels off. Other students noticed the inconsistency.",
            characters: ["Mr. Torres (strict, generally fair, having a bad day)", "Your friend Kai (also late, got away with it)", "Class of 25"],
            social_context: "Classroom. Public. Authority figure made an inconsistent call. Other students are watching to see how you handle it.",
            turns: [
              {
                situation: "Mr. Torres just said \"That's a detention for being late\" while looking directly at you. Kai is already in his seat, unnoticed. A couple of classmates exchange looks. You're still standing at the door.",
                choices: [
                  {
                    text: "\"Mr. Torres, I understand. Can I talk to you after class about it?\"",
                    signals: ["Accepts the moment", "Doesn't challenge publicly", "Reserves the conversation for private", "Respects the hierarchy"],
                    outcome: "accept_talk_later",
                    status_impact: 20,
                    reputation_tag: "strategic"
                  },
                  {
                    text: "\"But Kai was late too! How come only I get detention?\"",
                    signals: ["Public challenge", "Throws friend under the bus", "Puts teacher on the spot", "Looks like whining"],
                    outcome: "public_challenge",
                    status_impact: -10,
                    reputation_tag: "snitch"
                  },
                  {
                    text: "Say nothing. Sit down. Seethe quietly.",
                    signals: ["Avoids conflict", "Internalizes anger", "Doesn't address the problem", "Might build resentment"],
                    outcome: "silent_seethe",
                    status_impact: -5,
                    reputation_tag: "bottler"
                  },
                  {
                    text: "\"That's not fair and you know it.\" with visible frustration.",
                    signals: ["Direct challenge to authority", "Accusatory tone", "Maximum escalation risk", "Other students might respect the boldness or cringe"],
                    outcome: "direct_challenge",
                    status_impact: -20,
                    reputation_tag: "defiant"
                  }
                ]
              },
              {
                situation_by_outcome: {
                  accept_talk_later: "Mr. Torres nods slightly, surprised. \"Fine. See me after class.\" You sit down. Kai mouths \"sorry\" from across the room. After class, Mr. Torres is at his desk. The room is empty. He looks up: \"Okay, what did you want to discuss?\"",
                  public_challenge: "Mr. Torres's jaw tightens. \"I saw YOU. If Kai was late, that's between me and Kai. Don't worry about other people's consequences.\" The class is dead silent. Kai looks mortified. You've made the situation worse and thrown your friend into it.",
                  silent_seethe: "You sit down. The class moves on, but you can't focus. At lunch, Kai finds you: \"Hey, I feel bad about that. Torres didn't even see me.\" You're still frustrated, and the detention is still happening.",
                  direct_challenge: "Mr. Torres stands up straighter. \"Excuse me? Sit down. Now it's a detention AND you're staying after to discuss your attitude.\" A few students wince. You've doubled the penalty and given him no room to back down. The hierarchy just got enforced hard."
                },
                choices_by_outcome: {
                  accept_talk_later: [
                    { text: "\"I noticed Kai came in at the same time as me but didn't get a detention. I'm not trying to get him in trouble \u2014 I just want to understand the consistency.\"", signals: ["Specific observation", "Not accusatory", "Uses 'consistency' which appeals to his fairness identity", "Mature framing"], outcome: "fair_appeal", status_impact: 20 },
                    { text: "\"I don't think the detention was fair. Can you cancel it?\"", signals: ["Direct ask", "But doesn't provide reasoning", "Puts burden on teacher to justify"], outcome: "blunt_ask", status_impact: 0 },
                    { text: "\"Never mind, it's fine. I'll just do the detention.\"", signals: ["Backs down", "Wastes the opportunity", "But at least doesn't escalate"], outcome: "back_down", status_impact: -5 }
                  ],
                  public_challenge: [
                    { text: "Sit down quietly. Find Kai at lunch and apologize for dragging him into it.", signals: ["Damage control", "Recognizes the mistake", "Repairs friendship first"], outcome: "apologize_kai", status_impact: 5 },
                    { text: "After class, approach Mr. Torres: \"I'm sorry for how I handled that. I was frustrated but I shouldn't have called Kai out.\"", signals: ["Takes ownership", "Separates the fairness issue from the delivery", "Might earn respect"], outcome: "after_class_apology", status_impact: 10 },
                    { text: "Mutter complaints to the person next to you for the rest of class.", signals: ["Keeps the conflict alive", "Distracts others", "Teacher might notice"], outcome: "keep_muttering", status_impact: -10 }
                  ],
                  silent_seethe: [
                    { text: "Tell Kai: \"It's fine. But I'm going to talk to Torres about it tomorrow when I'm less annoyed.\"", signals: ["Delayed but intentional", "Recognizes you're too emotional now", "Strategic wait"], outcome: "strategic_delay", status_impact: 10 },
                    { text: "\"Whatever, it doesn't matter. Teachers are all the same.\"", signals: ["Cynicism", "Gives up on the system", "Misses the learning opportunity"], outcome: "give_up", status_impact: -10 },
                    { text: "Ask Kai if he'd be willing to tell Torres he was late too, so the record is fair.", signals: ["Collaborative solution", "Doesn't snitch but asks friend to step up", "Respects both relationships"], outcome: "ask_kai_help", status_impact: 15 }
                  ],
                  direct_challenge: [
                    { text: "After the extra time, genuinely apologize: \"I was frustrated about the inconsistency, but I handled it badly. Sorry.\"", signals: ["Mature recovery", "Acknowledges the HOW was wrong even if the WHAT was valid", "Teacher might soften"], outcome: "genuine_apology", status_impact: 10 },
                    { text: "Sit through it with arms crossed, wait for it to end.", signals: ["Cold compliance", "No growth", "Teacher writes you off"], outcome: "cold_compliance", status_impact: -10 },
                    { text: "Later, email Mr. Torres a calm explanation of what happened, apologizing for the outburst but explaining the inconsistency.", signals: ["Written channel reduces heat", "Shows effort and thought", "Gives teacher time to reflect privately"], outcome: "email_followup", status_impact: 15 }
                  ]
                }
              }
            ]
          },
          {
            id: "s5-coach-benched",
            title: "The Bench Decision",
            energy_cost: 20,
            xp_reward: 50,
            setup: "You've been on the school basketball team all season and played every game. Today, for the biggest game of the year, Coach Williams tells you you're on the bench and a newer player is starting in your spot. No explanation given. You've been practicing hard and your stats are solid. The game starts in 20 minutes.",
            characters: ["Coach Williams (experienced, doesn't explain decisions often)", "Marcus (the player replacing you, nervous)", "Team (watching the dynamic)"],
            social_context: "Locker room before the game. Team environment. Coach holds absolute authority. How you react will be visible to everyone.",
            turns: [
              {
                situation: "Coach just posted the starting lineup on the whiteboard. Your name isn't on it. Marcus sees it and looks at you awkwardly. A couple teammates glance your way. Coach is already talking to the assistant coach about strategy.",
                choices: [
                  {
                    text: "Walk up to Coach calmly: \"Coach, I noticed I'm not starting. Is there something I should be working on?\"",
                    signals: ["Frames as self-improvement", "Non-confrontational", "Shows maturity", "Gives coach room to explain"],
                    outcome: "calm_inquiry",
                    status_impact: 20,
                    reputation_tag: "team-player"
                  },
                  {
                    text: "\"Coach, why am I benched? I've started every game this season. This doesn't make sense.\"",
                    signals: ["Demands explanation", "Challenges the decision publicly", "Tone matters here \u2014 could go either way"],
                    outcome: "demand_explain",
                    status_impact: -5,
                    reputation_tag: "entitled"
                  },
                  {
                    text: "Say nothing to Coach. Sit on the bench with your game face on. Cheer for the team.",
                    signals: ["Ultimate team player move", "Doesn't address the issue", "But earns massive respect from teammates"],
                    outcome: "silent_team_player",
                    status_impact: 15,
                    reputation_tag: "disciplined"
                  },
                  {
                    text: "Go to Marcus: \"Dude, that should be my spot and you know it.\"",
                    signals: ["Takes it out on the wrong person", "Creates team division", "Marcus didn't make the decision"],
                    outcome: "blame_marcus",
                    status_impact: -25,
                    reputation_tag: "toxic"
                  }
                ]
              },
              {
                situation_by_outcome: {
                  calm_inquiry: "Coach looks at you, slightly impressed. \"It's a matchup decision. Their point guard is fast and Marcus has quicker feet. I need you fresh for the second half \u2014 you're my closer.\" He claps your shoulder. \"Be ready.\" It wasn't about you being worse \u2014 it was strategy.",
                  demand_explain: "Coach's expression hardens. \"Because I'm the coach and I made a decision. If you want to play, show me you can handle adversity.\" He turns away. Teammates look uncomfortable. You have your answer \u2014 sort of \u2014 but the delivery cost you.",
                  silent_team_player: "You sit on the bench and cheer every play. Marcus plays okay but struggles in the second quarter. Coach looks down the bench at you. At halftime, he says \"You're in for the second half. Show me what you've got.\" Your silence spoke louder than words.",
                  blame_marcus: "Marcus looks hurt and confused: \"I didn't ask for this, man.\" Two teammates overhear and one says \"That's not cool.\" Coach catches the end of it and calls you over: \"If I see that attitude again, you're not just benched \u2014 you're off the team. We don't tear each other down.\""
                },
                choices_by_outcome: {
                  calm_inquiry: [
                    { text: "\"Got it, Coach. I'll be ready.\" Go warm up and stay locked in.", signals: ["Accepts the explanation", "Channels energy into preparation", "Coach trusts you more now"], outcome: "ready_response", status_impact: 15 },
                    { text: "\"I still think I should start, but I hear you.\"", signals: ["Honest disagreement", "But accepts the decision", "Borderline \u2014 depends on tone"], outcome: "respectful_disagree", status_impact: 5 }
                  ],
                  demand_explain: [
                    { text: "Take a breath. Sit down. When the game starts, be the loudest voice on the bench cheering.", signals: ["Recovery through action", "Shows Coach you can handle it", "Actions over words"], outcome: "recover_cheering", status_impact: 15 },
                    { text: "Sit on the bench with headphones in, disengaged.", signals: ["Visible sulking", "Team sees it", "Coach notes it"], outcome: "sulk_bench", status_impact: -15 }
                  ],
                  silent_team_player: [
                    { text: "Come in and play your heart out. After the game, ask Coach about what you can improve for next time.", signals: ["Combines action with growth mindset", "Full cycle of maturity"], outcome: "full_maturity", status_impact: 20 },
                    { text: "Come in and play well, but cold-shoulder Coach afterwards.", signals: ["Performance is good but relationship is damaged", "Holding a grudge"], outcome: "play_grudge", status_impact: 0 }
                  ],
                  blame_marcus: [
                    { text: "Immediately find Marcus and apologize: \"I'm sorry, that was out of line. I was frustrated at the situation, not at you. Go kill it out there.\"", signals: ["Quick repair", "Takes ownership", "Redirects to team support"], outcome: "quick_repair", status_impact: 10 },
                    { text: "Go to Coach and apologize for the behavior, then sit on the bench quietly.", signals: ["Addresses the right person", "Shows awareness that Coach saw it"], outcome: "apologize_coach", status_impact: 5 },
                    { text: "Sit on the bench and refuse to cheer or engage.", signals: ["Full shutdown", "Team writes you off", "Coach considers cutting you"], outcome: "total_shutdown", status_impact: -20 }
                  ]
                }
              }
            ]
          }
        ]
      },
      "ch-6": {
        title: "Friendship Algorithms",
        subtitle: "The mechanics of connection",
        concepts: [
          "Interest matching is the entry point",
          "Vulnerability pacing \u2014 how fast to open up",
          "Reciprocity balance \u2014 matching energy",
          "Social signaling \u2014 what your actions communicate"
        ],
        scenarios: [
          {
            id: "s6-one-sided-friendship",
            title: "The One-Sided Friendship",
            energy_cost: 20,
            xp_reward: 50,
            setup: "You and Dev have been friends for about 6 months. You've noticed a pattern: you always text first, you always suggest plans, and when you do hang out, it's always what Dev wants to do. Last week you invited him to play games and he said \"maybe\" then posted on his story hanging out with other people. You like Dev, but something feels off.",
            characters: ["Dev (fun to be around, but inconsistent)", "You"],
            social_context: "No immediate scene \u2014 this is about recognizing a pattern and deciding what to do. It's a slow-burn social problem, not a crisis.",
            turns: [
              {
                situation: "You're looking at your chat with Dev. The last 5 conversations were all started by you. His replies are fine \u2014 friendly, uses emojis \u2014 but he never initiates. You sent \"wanna game tonight?\" two hours ago. No reply yet, but he's online.",
                emotion_guess: {
                  prompt: "What pattern are you actually seeing here?",
                  options: [
                    { text: "Reciprocity imbalance \u2014 I'm investing more energy than I'm getting back", correct: true, explanation: "This is the core issue. The friendship isn't necessarily bad, but the investment is one-sided. Dev enjoys your company when it's convenient, but doesn't invest the same energy. Recognizing this pattern is the first step to deciding what to do about it." },
                    { text: "Dev hates me and is trying to phase me out", correct: false, explanation: "Unlikely. He still replies friendly and hangs out sometimes. This isn't rejection \u2014 it's imbalance. Some people are just passive in friendships. The question is whether that works for you." },
                    { text: "I'm overthinking it \u2014 some people just don't text first", correct: false, explanation: "It's true that some people don't initiate. But when combined with blowing off plans, never suggesting hangouts, and choosing others over you \u2014 it's a pattern, not a personality quirk. Noticing patterns is the skill here." },
                    { text: "He's busy and I should be more understanding", correct: false, explanation: "He might be busy sometimes. But 'busy' doesn't explain consistently choosing other people while leaving your messages on read. Being understanding is good, but not at the expense of noticing when things are genuinely imbalanced." }
                  ]
                },
                choices: [
                  {
                    text: "Stop texting first for a week. See if Dev reaches out. Gather data before making a decision.",
                    signals: ["Strategic patience", "Gathers information", "Doesn't assume \u2014 tests the hypothesis", "Low drama"],
                    outcome: "test_reciprocity",
                    status_impact: 15,
                    reputation_tag: "analytical"
                  },
                  {
                    text: "Text Dev: \"Hey, I've noticed I'm always the one reaching out. Is everything cool between us?\"",
                    signals: ["Direct communication", "Vulnerable", "Gives Dev a chance to explain", "Could be awkward but honest"],
                    outcome: "direct_ask",
                    status_impact: 10,
                    reputation_tag: "direct"
                  },
                  {
                    text: "Keep texting and initiating. Maybe he'll come around eventually.",
                    signals: ["Ignores the pattern", "Hopes for change without evidence", "Continues the imbalance"],
                    outcome: "keep_trying",
                    status_impact: -10,
                    reputation_tag: "people-pleaser"
                  },
                  {
                    text: "Ghost Dev. If he doesn't care, why should you?",
                    signals: ["Reactive", "Doesn't communicate", "Burns the bridge without explanation", "Might regret later"],
                    outcome: "ghost",
                    status_impact: -15,
                    reputation_tag: "cold"
                  }
                ]
              },
              {
                situation_by_outcome: {
                  test_reciprocity: "A week passes. Dev hasn't texted once. You see him at school \u2014 he's friendly, says \"we should hang out sometime\" in the hallway, but never follows up. The data is clear: when you don't initiate, nothing happens.",
                  direct_ask: "Dev replies after an hour: \"Wdym? We're cool bro. I've just been busy with stuff.\" The reply is casual, maybe a little dismissive. He doesn't ask what prompted the question or offer to make plans.",
                  keep_trying: "Another month goes by. Same pattern. You text, he replies sometimes. You suggest plans, he flakes half the time. You're spending energy on someone who isn't investing back, and it's starting to affect how you feel about yourself.",
                  ghost: "Two weeks go by. Dev messages: \"Yoo where you been?\" He seems genuinely confused. He didn't even notice the pattern because he wasn't tracking it the way you were."
                },
                choices_by_outcome: {
                  test_reciprocity: [
                    { text: "Mentally recategorize Dev: he's a casual friend, not a close friend. Stop investing close-friend energy. Stay friendly at school.", signals: ["Realistic adjustment", "No drama", "Protects your energy", "Mature categorization"], outcome: "recategorize", status_impact: 20 },
                    { text: "Have one honest conversation: \"I noticed when I stopped texting, we didn't talk for a week. I'd like this to be more two-way.\"", signals: ["Gives Dev the information", "Clear and fair", "Lets him decide if he wants to step up"], outcome: "honest_convo", status_impact: 15 },
                    { text: "Start investing that energy into other friendships where the balance is better.", signals: ["Resource reallocation", "Positive response", "Doesn't burn the bridge with Dev"], outcome: "invest_elsewhere", status_impact: 15 }
                  ],
                  direct_ask: [
                    { text: "\"No worries. But I'm always the one texting first \u2014 it'd be cool if you hit me up sometimes too.\"", signals: ["Specific and clear", "Not aggressive", "Gives him a concrete action"], outcome: "specific_feedback", status_impact: 10 },
                    { text: "\"Cool, just checking.\" and drop it.", signals: ["Accepts the non-answer", "Nothing changes", "Back to square one"], outcome: "drop_it", status_impact: -5 },
                    { text: "\"If you're busy, I get it. But 'maybe' then hanging out with other people felt bad. Just be straight with me.\"", signals: ["Addresses the specific incident", "Honest about hurt", "Direct but fair"], outcome: "address_specific", status_impact: 15 }
                  ],
                  keep_trying: [
                    { text: "Finally accept the pattern. Pull back energy and invest in other friendships.", signals: ["Late but better than never", "Protects remaining energy"], outcome: "late_acceptance", status_impact: 5 },
                    { text: "Keep going. Maybe next month will be different.", signals: ["Denial", "Emotional sunk cost", "Draining"], outcome: "sunk_cost", status_impact: -15 }
                  ],
                  ghost: [
                    { text: "\"I'm around. Noticed I was always the one reaching out, so I took a step back. Want to actually make plans this time?\"", signals: ["Honest", "Uses the moment as an opening", "Gives him a chance"], outcome: "honest_return", status_impact: 10 },
                    { text: "\"Been busy.\" and leave it at that.", signals: ["Mirrors his energy", "Petty but satisfying", "Nothing gets resolved"], outcome: "mirror_energy", status_impact: -5 }
                  ]
                }
              }
            ]
          },
          {
            id: "s6-new-friend-overshare",
            title: "The Overshare",
            energy_cost: 15,
            xp_reward: 45,
            setup: "You just started getting along with Anya, a girl in your art class. You've talked a few times about music and drawing. Today after class, she invites you to sit with her at lunch. You're excited \u2014 this could become a real friendship. You're at lunch together for the first time.",
            characters: ["Anya (creative, warm, new potential friend)", "You"],
            social_context: "School cafeteria. First one-on-one lunch. Early stage of potential friendship. Both testing the connection.",
            turns: [
              {
                situation: "Anya asks \"So what do you do outside of school?\" She's leaning in, genuinely curious. This is the first time you've talked beyond just class topics. You're nervous but also excited to connect.",
                choices: [
                  {
                    text: "Talk about your gaming hobby, a show you both might like, ask what she's into outside of art. Keep it light and mutual.",
                    signals: ["Appropriate depth for early friendship", "Reciprocal", "Builds common ground", "Leaves room for future conversations"],
                    outcome: "balanced_share",
                    status_impact: 20,
                    reputation_tag: "easy-to-talk-to"
                  },
                  {
                    text: "Open up about feeling lonely, not having many friends, and how much this lunch means to you.",
                    signals: ["Way too deep too fast", "Puts emotional weight on a new connection", "Makes her responsible for your feelings", "Classic overshare"],
                    outcome: "overshare_lonely",
                    status_impact: -15,
                    reputation_tag: "intense"
                  },
                  {
                    text: "Give a one-word answer: \"Gaming.\" Then go quiet and wait for her to carry the conversation.",
                    signals: ["Under-sharing", "Puts all the effort on her", "She might think you're not interested"],
                    outcome: "undershare",
                    status_impact: -10,
                    reputation_tag: "closed-off"
                  },
                  {
                    text: "Launch into a detailed 5-minute explanation of your favorite game's lore, mechanics, and meta strategy.",
                    signals: ["Passionate but one-directional", "Doesn't check if she's interested", "Information dump", "Common ASD pattern to recognize"],
                    outcome: "info_dump",
                    status_impact: -5,
                    reputation_tag: "intense"
                  }
                ]
              },
              {
                situation_by_outcome: {
                  balanced_share: "Anya lights up when you mention a show she also watches. \"Wait, you watch that too?!\" The conversation flows naturally back and forth. She shares that she makes fan art. You ask to see it. By the end of lunch, she says \"Same time tomorrow?\" with a smile.",
                  overshare_lonely: "Anya's expression shifts \u2014 she looks a bit overwhelmed. \"Oh, that's... I'm glad you're here.\" She's kind about it but the vibe changed. She starts talking to someone at the next table. Lunch ends a bit awkwardly. She doesn't mention tomorrow.",
                  undershare: "Anya tries a few more questions. You give short answers each time. She starts checking her phone. \"Well, lunch was nice!\" she says, but it sounds like a polite exit. She didn't get enough from you to feel a connection.",
                  info_dump: "Anya listens politely for a while, but her eyes start glazing over. She nods and says \"That's cool\" a few times but can't find a way into the conversation. When you finally pause, she says \"I don't really game much, but that sounds... complex.\" The connection didn't happen."
                },
                choices_by_outcome: {
                  balanced_share: [
                    { text: "\"Definitely! And if you ever want to draw together, I've been wanting to learn.\"", signals: ["Accepts the invitation warmly", "Suggests a shared activity", "Shows interest in HER thing", "Natural next step"], outcome: "suggest_activity", status_impact: 15 },
                    { text: "\"Cool, see you around.\" and play it very casual.", signals: ["Too cool for school", "Might confuse her after a warm lunch", "Mixed signals"], outcome: "play_cool", status_impact: 0 }
                  ],
                  overshare_lonely: [
                    { text: "Next day in art class, keep it light: \"Hey, that show we talked about dropped a new episode!\"", signals: ["Reset to comfortable depth", "Shows you can read the situation", "Gives the friendship another chance"], outcome: "reset_light", status_impact: 15 },
                    { text: "Text her that night: \"Sorry if I was weird at lunch. I'm just not great at this stuff.\"", signals: ["Self-aware", "But adds more emotional weight", "Texting might help or might make it more awkward"], outcome: "apologize_text", status_impact: 0 },
                    { text: "Assume she thinks you're weird and avoid her.", signals: ["Mind-reading", "Kills the connection preemptively", "Self-fulfilling prophecy"], outcome: "avoid_her", status_impact: -15 }
                  ],
                  undershare: [
                    { text: "Text her later: \"Hey, sorry I was quiet at lunch. I'm better at talking once I know someone. That show you mentioned \u2014 what season are you on?\"", signals: ["Acknowledges the gap", "Opens a conversation in a lower-pressure format", "Gives her a reason to respond"], outcome: "text_recovery", status_impact: 10 },
                    { text: "Tomorrow at lunch, make more effort: ask her questions, share more about yourself.", signals: ["In-person correction", "Shows growth", "Takes initiative"], outcome: "try_harder_tomorrow", status_impact: 10 },
                    { text: "\"She probably thinks I'm boring. No point trying again.\"", signals: ["Catastrophizing", "One lunch doesn't define everything", "Giving up too early"], outcome: "give_up_early", status_impact: -15 }
                  ],
                  info_dump: [
                    { text: "Catch yourself: \"Sorry, I just went way deep on that. What about you \u2014 what do you do outside of art?\"", signals: ["Self-awareness in real time", "Redirects to her", "Shows you know how conversations work even if you struggle sometimes"], outcome: "catch_redirect", status_impact: 15 },
                    { text: "Keep going because she asked and you're just answering the question.", signals: ["Misreads the boredom signals", "Technically true but socially wrong", "She'll avoid asking you things"], outcome: "keep_going", status_impact: -10 },
                    { text: "Notice her glazing over and go quiet, feeling embarrassed.", signals: ["Reads the signal but doesn't know what to do", "Awkward silence follows", "Both people are stuck"], outcome: "embarrassed_silence", status_impact: -5 }
                  ]
                }
              }
            ]
          }
        ]
      },
      "ch-11": {
        title: "Parental Interaction",
        subtitle: "Decoding the people who run your home server",
        concepts: [
          "Parents run on worry firmware",
          "The request vs demand protocol",
          "Timing is a cheat code",
          "The trust economy at home"
        ],
        scenarios: [
          {
            id: "s11-permission-request",
            title: "The Permission Request",
            energy_cost: 15,
            xp_reward: 45,
            setup: "You want to go to your friend Raj's house on Saturday for a gaming session. Your mom is cautious about new friends and unfamiliar houses. She's in the kitchen making dinner after a long workday. You need to bring it up and get her to say yes.",
            characters: ["Mom (protective, tired from work)", "You"],
            social_context: "Home kitchen. Mom is cooking after a long day. One-on-one conversation. You want something, she has veto power.",
            turns: [
              {
                situation: "Mom is chopping vegetables and looks tired. She hasn't asked about your day yet, which usually means work was rough. You need to ask about Saturday.",
                choices: [
                  {
                    text: "\"Hey Mom, I'm going to Raj's house Saturday to game. Just letting you know.\"",
                    signals: ["Announcement, not a request", "Bypasses her authority", "Triggers control instinct"],
                    outcome: "announced",
                    status_impact: -15,
                    reputation_tag: "dismissive"
                  },
                  {
                    text: "\"Hey Mom, how was your day?\" Wait for her to decompress a bit, then ask about Saturday with details.",
                    signals: ["Reads her state first", "Builds goodwill before asking", "Strategic timing"],
                    outcome: "timed_well",
                    status_impact: 20,
                    reputation_tag: "thoughtful"
                  },
                  {
                    text: "\"Mom, can I go to Raj's on Saturday? His mom will be home and I'll be back by dinner.\"",
                    signals: ["Polite request", "Provides safety details upfront", "Addresses likely concerns"],
                    outcome: "direct_polite",
                    status_impact: 15,
                    reputation_tag: "respectful"
                  },
                  {
                    text: "Decide to ask later tonight when she's more relaxed, maybe after dinner.",
                    signals: ["Good timing instinct", "Patient", "But risks forgetting or running out of time"],
                    outcome: "wait_later",
                    status_impact: 5,
                    reputation_tag: "patient"
                  }
                ]
              },
              {
                situation_by_outcome: {
                  announced: "Mom puts down the knife and turns to face you. \"Excuse me? You're GOING? Since when do you tell me what you're doing?\" Her voice is tight. She's not angry about Raj \u2014 she's angry about the approach. This is now harder than it needed to be.",
                  timed_well: "Mom softens a bit as she talks about her day. After a few minutes, the tension in her shoulders drops. When you bring up Saturday, she listens calmly. \"Tell me about this Raj. What's his family like?\"",
                  direct_polite: "Mom considers it. \"Raj... is this the kid from your science class? I don't know his parents.\" She's not saying no, but she's not saying yes either. She needs more information to feel safe.",
                  wait_later: "After dinner, Mom is on the couch watching TV. She seems calmer. Good timing. She looks up when you approach. \"What's up?\""
                },
                choices_by_outcome: {
                  announced: [
                    { text: "\"Sorry, I didn't mean it like that. Can I ASK if I can go to Raj's on Saturday? His mom will be there.\"", signals: ["Self-correction", "Acknowledges the misstep", "Reframes as request"], outcome: "repair_ask", status_impact: 10 },
                    { text: "\"Whatever, forget it.\" and walk away", signals: ["Shuts down", "Creates lingering tension", "Misses the chance entirely"], outcome: "storm_off", status_impact: -20 },
                    { text: "\"Why do I always have to ask permission for everything?\"", signals: ["Escalates", "Makes it about control", "Guaranteed fight"], outcome: "escalate", status_impact: -25 }
                  ],
                  timed_well: [
                    { text: "Answer her questions honestly. Offer to have her talk to Raj's mom first.", signals: ["Addresses her worry firmware", "Gives her a safety check", "Shows maturity"], outcome: "offer_parent_call", status_impact: 20 },
                    { text: "\"He's fine, Mom. Can I just go?\"", signals: ["Impatient", "Dismisses her concern", "Undermines the goodwill you built"], outcome: "dismiss_concern", status_impact: -10 },
                    { text: "Share some things about Raj \u2014 how you know him, what you'd be doing, when you'd be back.", signals: ["Provides certainty", "Reduces unknowns", "Respectful information sharing"], outcome: "share_details", status_impact: 15 }
                  ],
                  direct_polite: [
                    { text: "\"He's in my science class, super nice. His mom is a teacher actually. Want me to get her number so you can talk to her?\"", signals: ["Provides credentials", "Proactive safety measure", "Makes it easy for Mom to say yes"], outcome: "provide_credentials", status_impact: 20 },
                    { text: "\"Mom, I'm 14. You don't need to know everything about everyone.\"", signals: ["Dismisses her concern", "Age argument rarely works", "Triggers more restriction"], outcome: "age_argument", status_impact: -15 },
                    { text: "\"What if I FaceTime you when I get there so you can see the house?\"", signals: ["Creative solution", "Gives her visibility", "Meets in the middle"], outcome: "facetime_offer", status_impact: 15 }
                  ],
                  wait_later: [
                    { text: "Ask casually: \"Hey, would it be okay if I went to my friend Raj's house Saturday? His mom will be home.\"", signals: ["Good timing execution", "Casual but respectful", "Key details included"], outcome: "casual_ask", status_impact: 15 },
                    { text: "\"So... Saturday... I was thinking... \" and trail off nervously", signals: ["Over-thinking it", "Creates suspense which triggers worry"], outcome: "nervous_ask", status_impact: 0 }
                  ]
                }
              }
            ]
          },
          {
            id: "s11-grade-conversation",
            title: "The Grade Conversation",
            energy_cost: 20,
            xp_reward: 50,
            setup: "You got a B- on a math test you studied hard for. Your dad checks the parent portal every evening and values academic performance. He's going to see the grade tonight. You could tell him yourself or wait for him to find it. He's currently in a good mood \u2014 just got home and is talking about weekend plans.",
            characters: ["Dad (high expectations, values effort, can be intense about grades)", "You"],
            social_context: "Home, after school. Dad is in a good mood. The grade is objectively not terrible, but below his expectations. The parent portal means you can't hide it.",
            turns: [
              {
                situation: "Dad is at the kitchen table, scrolling his phone and humming. He hasn't checked the portal yet. You know the B- is there. Dinner is in an hour.",
                choices: [
                  {
                    text: "Go to him now: \"Hey Dad, I wanted to tell you before you see the portal \u2014 I got a B- on the math test. I studied hard but the last section was tougher than expected.\"",
                    signals: ["Proactive honesty", "Shows ownership", "Controls the narrative", "Builds trust"],
                    outcome: "proactive_tell",
                    status_impact: 20,
                    reputation_tag: "honest"
                  },
                  {
                    text: "Wait and hope he doesn't check tonight. Maybe he'll forget.",
                    signals: ["Avoidance", "Delays inevitable", "If he finds it himself, trust goes down"],
                    outcome: "avoid_hope",
                    status_impact: -10,
                    reputation_tag: "avoidant"
                  },
                  {
                    text: "Bring it up but blame the test: \"The teacher made that test way harder than what we studied. Everyone did bad.\"",
                    signals: ["Deflects responsibility", "May or may not be true", "Doesn't build trust"],
                    outcome: "blame_test",
                    status_impact: -5,
                    reputation_tag: "excuse-maker"
                  },
                  {
                    text: "Tell him the grade AND your plan: \"I got a B-, but I already talked to the teacher about what I missed and I'm going to redo the practice problems this weekend.\"",
                    signals: ["Proactive honesty + solution", "Shows maturity", "Addresses his concern before he voices it"],
                    outcome: "grade_with_plan",
                    status_impact: 25,
                    reputation_tag: "mature"
                  }
                ]
              },
              {
                situation_by_outcome: {
                  proactive_tell: "Dad puts his phone down and looks at you. There's a flicker of disappointment, but then he nods slowly. \"I appreciate you telling me. A B- isn't the end of the world. What happened with the last section?\" He's asking questions, not lecturing \u2014 that's a good sign.",
                  avoid_hope: "At dinner, Dad's phone buzzes. He glances at it. \"I got a notification from the school portal...\" He opens it. His good mood visibly shifts. \"A B-? When were you going to tell me about this?\" Now you're dealing with the grade AND the fact that you hid it.",
                  blame_test: "Dad raises an eyebrow. \"Everyone did bad? Or just you?\" He's not buying it wholesale. \"I want to see the test. If it was genuinely unfair, we'll talk to the teacher. But if you just didn't prepare enough, that's a different conversation.\"",
                  grade_with_plan: "Dad listens to the whole thing. His expression goes from concern to something close to impressed. \"You already talked to the teacher?\" He pauses. \"Alright. I trust you to handle it. Let me know if you need help with the practice problems.\" He goes back to his phone. That was... surprisingly easy."
                },
                choices_by_outcome: {
                  proactive_tell: [
                    { text: "Explain honestly what was hard and ask if he can help you practice this weekend.", signals: ["Vulnerability", "Turns it into bonding", "Shows growth mindset"], outcome: "ask_help", status_impact: 15 },
                    { text: "\"I don't know, I just messed up. Sorry.\"", signals: ["Self-critical", "Doesn't move forward", "Makes Dad unsure how to respond"], outcome: "self_blame", status_impact: -5 },
                    { text: "\"It's only a B-, it's not that bad. Can we not make a big deal about it?\"", signals: ["Minimizing", "Dismisses his values", "Might trigger lecture"], outcome: "minimize", status_impact: -10 }
                  ],
                  avoid_hope: [
                    { text: "\"I was going to tell you tonight. I just wanted to wait for the right moment.\"", signals: ["Partial truth", "Damage control", "Better than nothing"], outcome: "delayed_honesty", status_impact: 0 },
                    { text: "\"I forgot about it, it's just one test.\"", signals: ["Dismissive", "Adds insult to injury", "Dad will escalate"], outcome: "dismiss_importance", status_impact: -15 },
                    { text: "\"You're right, I should have told you. I was nervous about your reaction. I'm sorry.\"", signals: ["Full honesty", "Explains the WHY", "Disarms the anger"], outcome: "honest_vulnerable", status_impact: 10 }
                  ],
                  blame_test: [
                    { text: "\"Fair enough. I could've studied more for the last section. Can you help me review it?\"", signals: ["Drops the excuse", "Pivots to ownership", "Recovery move"], outcome: "drop_excuse", status_impact: 10 },
                    { text: "Double down: \"I'm serious, ask anyone in my class.\"", signals: ["Commits to the excuse", "Dad will verify", "Risky"], outcome: "double_down_excuse", status_impact: -10 }
                  ],
                  grade_with_plan: [
                    { text: "\"Thanks Dad. I'll show you how it goes after this weekend.\"", signals: ["Confident follow-through", "Maintains the positive dynamic"], outcome: "confident_close", status_impact: 10 },
                    { text: "\"See? It's not a big deal. I told you.\"", signals: ["Undermines the maturity you just showed", "Sounds defensive retroactively"], outcome: "smug_close", status_impact: -5 }
                  ]
                }
              }
            ]
          }
        ]
      },
      "ch-12": {
        title: "Sibling Interactions",
        subtitle: "The longest multiplayer campaign of your life",
        concepts: [
          "Siblings are permanent party members",
          "The attention economy at home",
          "Shared space = shared rules",
          "The older/younger dynamic"
        ],
        scenarios: [
          {
            id: "s12-shared-space",
            title: "The Shared Space Battle",
            energy_cost: 15,
            xp_reward: 45,
            setup: "Your younger sibling (age 11) keeps barging into your room without knocking, touching your stuff, and being loud while you're trying to focus on homework. You've told them to stop three times this week. Your mom says \"just be patient, they look up to you.\" It's happening again right now.",
            characters: ["Younger sibling (11, wants your attention, doesn't understand boundaries yet)", "Mom (in the next room, mediator)", "You"],
            social_context: "Home, your room. You need to focus. Sibling just walked in without knocking. Mom is nearby and will hear raised voices.",
            turns: [
              {
                situation: "Your sibling just walked into your room without knocking \u2014 again \u2014 and picked up your headphones. You're mid-homework and losing focus. They say \"Can we play something?\" with genuine excitement.",
                choices: [
                  {
                    text: "\"GET OUT! I've told you a hundred times to KNOCK!\" and grab the headphones back.",
                    signals: ["Explosion", "Understandable frustration but scary delivery", "Sibling will cry, Mom will intervene on their side"],
                    outcome: "blow_up",
                    status_impact: -20,
                    reputation_tag: "scary"
                  },
                  {
                    text: "\"Hey, I need you to knock first \u2014 that's the rule. I'm doing homework right now, but I can play with you for 20 minutes after I finish. Deal?\"",
                    signals: ["Names the boundary", "Offers an alternative", "Gives them something to look forward to", "Firm but not mean"],
                    outcome: "boundary_with_deal",
                    status_impact: 20,
                    reputation_tag: "fair"
                  },
                  {
                    text: "Sigh, put homework aside, and play with them to avoid conflict.",
                    signals: ["Avoids confrontation", "Sacrifices your needs", "Reinforces that barging in works"],
                    outcome: "give_in",
                    status_impact: -10,
                    reputation_tag: "pushover"
                  },
                  {
                    text: "Go to Mom: \"Can you please tell them to stay out of my room? I've asked three times this week and nothing changes.\"",
                    signals: ["Escalates to authority", "Might work short-term", "Sibling sees you as a tattler"],
                    outcome: "go_to_mom",
                    status_impact: 0,
                    reputation_tag: "tattler"
                  }
                ]
              },
              {
                situation_by_outcome: {
                  blow_up: "Your sibling's face crumbles. They drop the headphones and run out. You hear them crying to Mom. Two minutes later, Mom appears in your doorway: \"Why did you yell at them like that? They just wanted to play with you.\" Now you're the villain in this story, even though your boundary was valid.",
                  boundary_with_deal: "Your sibling considers this. \"20 minutes? Promise?\" You nod. They put down the headphones and leave \u2014 closing the door behind them. You hear them set a timer on their tablet. The boundary worked, and they got something too.",
                  give_in: "You play for 30 minutes. Your sibling is happy. But when you try to go back to homework, they whine \"just five more minutes\" three times. You're now an hour behind, stressed, and they've learned that barging in gets them what they want.",
                  go_to_mom: "Mom calls your sibling over and says \"Leave your brother alone when he's studying.\" Your sibling sulks and mutters \"you always take his side.\" It works for tonight, but tomorrow they'll probably do it again \u2014 and now they're also resentful."
                },
                choices_by_outcome: {
                  blow_up: [
                    { text: "Take a breath, go apologize: \"I'm sorry I yelled. I was frustrated but I shouldn't have scared you. Can we make a deal about knocking?\"", signals: ["Repair", "Acknowledges the mistake", "Still addresses the boundary", "Shows emotional growth"], outcome: "apologize_repair", status_impact: 15 },
                    { text: "Tell Mom: \"I've asked nicely three times and nothing happened. What am I supposed to do?\"", signals: ["Valid point", "Explains context", "Might shift Mom's perspective"], outcome: "explain_to_mom", status_impact: 5 },
                    { text: "Stay in your room, put headphones on, lock the door.", signals: ["Shutdown", "Avoids repair", "Cold war begins"], outcome: "cold_war", status_impact: -10 }
                  ],
                  boundary_with_deal: [
                    { text: "When the timer goes off, follow through and play with them for exactly 20 minutes.", signals: ["Keeps your word", "Builds trust", "Teaches them that respecting boundaries gets rewarded"], outcome: "follow_through", status_impact: 20 },
                    { text: "\"Actually I'm too tired now, maybe tomorrow.\"", signals: ["Breaks the deal", "Destroys the trust you just built", "Next time they won't believe you"], outcome: "break_deal", status_impact: -15 },
                    { text: "Play with them AND let it extend because you're actually having fun.", signals: ["Genuine connection", "Flexible", "But set this as the new expectation"], outcome: "extend_play", status_impact: 10 }
                  ],
                  give_in: [
                    { text: "When they ask for \"five more minutes,\" say \"Nope, we agreed. I need to finish my homework. We can play again tomorrow.\"", signals: ["Late boundary", "Still better than none", "Starts establishing limits"], outcome: "late_boundary", status_impact: 10 },
                    { text: "Keep playing and do homework late at night.", signals: ["Sacrifice", "Will lead to burnout and resentment", "Teaches nothing"], outcome: "total_sacrifice", status_impact: -15 }
                  ],
                  go_to_mom: [
                    { text: "Later, talk to your sibling directly: \"I'm not trying to get you in trouble. I just need quiet time for homework. Want to work out a schedule together?\"", signals: ["Direct repair", "Includes them in the solution", "Moves past the tattler dynamic"], outcome: "direct_repair", status_impact: 15 },
                    { text: "Let it go and see if Mom's warning sticks.", signals: ["Passive", "Relies on external enforcement", "Probably temporary fix"], outcome: "wait_see", status_impact: 0 }
                  ]
                }
              }
            ]
          },
          {
            id: "s12-unfair-comparison",
            title: "The Unfair Comparison",
            energy_cost: 20,
            xp_reward: 50,
            setup: "At a family dinner, your aunt asks how both kids are doing. Your parent launches into a detailed story about your sibling's recent basketball tournament \u2014 the big save, the coach's praise, the trophy. When they get to you, they say \"and our oldest is doing well too, keeping busy\" and move on. Your sibling smirks. You feel invisible.",
            characters: ["Mom/Dad (proud, not intentionally hurtful)", "Younger sibling (just got praised, oblivious)", "Aunt (asking politely)", "You"],
            social_context: "Family dinner. Extended family present. Public but intimate setting. Comparison is implicit, not intentional.",
            turns: [
              {
                situation: "The conversation has moved past you in 5 seconds flat. Your aunt looks at you expectantly, like she wants to hear more, but your parent has already pivoted to asking about your cousin. Your sibling is beaming. You feel a mix of hurt and anger.",
                emotion_guess: {
                  prompt: "Before reacting, what's the REAL emotion driving your response right now?",
                  options: [
                    { text: "Feeling unseen \u2014 it's not about jealousy, it's about not being valued equally", correct: true, explanation: "This is key. The hurt isn't because your sibling got praised \u2014 it's because you were glossed over. The core need is recognition, not competition. Understanding this changes how you respond." },
                    { text: "Jealousy of my sibling's success", correct: false, explanation: "It might feel like jealousy on the surface, but notice: you wouldn't care if your parent had praised your sibling AND given you equal airtime. It's not about them getting too much \u2014 it's about you getting too little." },
                    { text: "Anger at my parent for being unfair", correct: false, explanation: "The anger is real, but it's a secondary emotion. Underneath it is the feeling of being unseen. Your parent probably didn't do it on purpose \u2014 sports achievements are just easier to narrate. Understanding this helps you address the real issue." },
                    { text: "Embarrassment in front of extended family", correct: false, explanation: "There might be some embarrassment, but the main driver is the feeling of being less important in your parent's eyes. Embarrassment is about what others think; this is about what your parent communicated." }
                  ]
                },
                choices: [
                  {
                    text: "When your aunt looks at you, fill the gap yourself: \"Actually, I've been working on [something you're proud of]. Want to hear about it?\"",
                    signals: ["Self-advocacy", "Doesn't wait for permission", "Takes up space confidently"],
                    outcome: "self_advocate",
                    status_impact: 20,
                    reputation_tag: "confident"
                  },
                  {
                    text: "Stay quiet at dinner. Bring it up with your parent privately later: \"It kind of hurt when you talked about [sibling] for five minutes and I got one sentence.\"",
                    signals: ["Emotional intelligence", "Private conversation", "Addresses the real issue without making a scene"],
                    outcome: "private_later",
                    status_impact: 15,
                    reputation_tag: "mature"
                  },
                  {
                    text: "Make a passive-aggressive comment: \"Yeah, I'm just 'keeping busy.' Nothing interesting going on with me.\"",
                    signals: ["Sarcasm", "Signals hurt but in a way that makes everyone uncomfortable", "Parent may not even realize what they did"],
                    outcome: "passive_aggressive",
                    status_impact: -10,
                    reputation_tag: "sarcastic"
                  },
                  {
                    text: "Shut down. Go quiet for the rest of dinner. Leave the table early.",
                    signals: ["Withdrawal", "Visible but unexplained", "Creates tension without resolution"],
                    outcome: "shut_down",
                    status_impact: -15,
                    reputation_tag: "withdrawn"
                  }
                ]
              },
              {
                situation_by_outcome: {
                  self_advocate: "Your aunt lights up: \"Oh, tell me!\" Your parent looks over, surprised but listening. As you talk about your thing, the attention shifts. Your sibling fidgets \u2014 they're not used to sharing the spotlight. But your parent nods and adds \"Yeah, that's actually been really impressive.\" They just needed a prompt.",
                  private_later: "After dinner, you catch your parent alone. When you tell them how it felt, there's a pause. \"I... didn't realize I did that. I'm sorry. Your sibling's tournament was just fresh in my mind. Tell me \u2014 what should I have said about you?\" They're listening.",
                  passive_aggressive: "Your aunt looks uncomfortable. Your parent frowns: \"What's that supposed to mean?\" Your sibling says \"why are you being weird?\" The mood at the table shifts. You've communicated that you're hurt, but in a way that makes you the problem instead of the oversight.",
                  shut_down: "You push food around your plate. Your aunt tries to engage you: \"So what are you up to these days?\" but you give a one-word answer. After dinner, your parent asks \"Are you okay?\" with genuine confusion. They have no idea what triggered this."
                },
                choices_by_outcome: {
                  self_advocate: [
                    { text: "After dinner, thank your aunt for asking and mention to your parent: \"It felt good to share that. I don't always feel like I get the chance.\"", signals: ["Positive reinforcement", "Gentle feedback", "Keeps the door open"], outcome: "gentle_feedback", status_impact: 15 },
                    { text: "Use the moment to also highlight your sibling: \"And [sibling]'s tournament was awesome too \u2014 did you see that save?\"", signals: ["Generous", "Not competitive", "Models the behavior you want"], outcome: "generous_share", status_impact: 20 },
                    { text: "Keep talking until you've dominated the conversation to make up for being overlooked.", signals: ["Overcorrects", "Now you're doing what your parent did", "Sibling feels sidelined"], outcome: "overcorrect", status_impact: -5 }
                  ],
                  private_later: [
                    { text: "Tell them specifically: \"I'd love it if next time you mentioned [your interest or achievement]. It doesn't have to be a big thing.\"", signals: ["Gives them a concrete action", "Makes it easy to do better", "Constructive"], outcome: "specific_ask", status_impact: 15 },
                    { text: "\"It's fine, forget it. I don't want to make it a big deal.\"", signals: ["Downplays your own feelings", "Parent can't fix what they don't understand", "Missed opportunity"], outcome: "backtrack", status_impact: -5 }
                  ],
                  passive_aggressive: [
                    { text: "Catch yourself: \"Sorry, that came out wrong. I guess I just felt like I got skipped over a bit.\"", signals: ["Self-correction", "Honest vulnerability", "Salvages the moment"], outcome: "recover_honest", status_impact: 10 },
                    { text: "\"Nothing. Forget it.\" and go back to eating.", signals: ["Shuts down", "Everyone stays confused", "Resentment builds"], outcome: "shut_it_down", status_impact: -10 }
                  ],
                  shut_down: [
                    { text: "When they ask if you're okay, be honest: \"Yeah... I just felt like at dinner, [sibling] got the spotlight and I got one sentence. It stung.\"", signals: ["Uses the opening", "Honest", "Lets them understand"], outcome: "open_up", status_impact: 15 },
                    { text: "\"I'm fine.\" and go to your room.", signals: ["Classic shutdown", "They can't help what they don't know", "You stew alone"], outcome: "isolate", status_impact: -10 }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  },
  "level-3": {
    title: "Advanced Strategy",
    color: "#1CB0F6",
    chapters: {
      "ch-7": {
        title: "Influence Engineering",
        subtitle: "Ideas as shared wins",
        concepts: [
          "Ask > Tell",
          "Frame ideas as shared discoveries",
          "Pre-empt resistance",
          "Give credit strategically"
        ],
        scenarios: [
          {
            id: "s7-group-project-idea",
            title: "The Better Idea",
            energy_cost: 20,
            xp_reward: 55,
            setup: "Your group has been assigned a history presentation. The group (Priya, Kai, and you) brainstormed and decided to do a timeline poster. You think a mock news broadcast would be way more engaging and would get a better grade. Priya is already excited about the poster and has started sketching. Kai doesn't care either way.",
            characters: ["Priya (invested in the poster idea, organized)", "Kai (laid-back, goes with the flow)", "You"],
            social_context: "Group project meeting in the library. Priya has already started working on the agreed plan. Changing direction means disrupting her effort. But your idea is genuinely better.",
            turns: [
              {
                situation: "Priya has her colored markers out and is sketching sections for the timeline poster. She's clearly invested. Kai is scrolling his phone. You keep thinking about how much better a news broadcast would be \u2014 the teacher loves creative presentations.",
                choices: [
                  {
                    text: "\"Hey Priya, that sketch looks really good. I had a random thought \u2014 what if we took your timeline research and turned it into a fake news broadcast? Like, we could be reporters covering the events live. Your research would be the backbone of the script.\"",
                    signals: ["Compliments her work first", "Frames new idea as building ON her contribution", "She keeps ownership", "Collaborative pitch"],
                    outcome: "build_on_hers",
                    status_impact: 25,
                    reputation_tag: "influencer"
                  },
                  {
                    text: "\"I think we should do a news broadcast instead of a poster. It'll get a way better grade.\"",
                    signals: ["Direct rejection of current plan", "Doesn't acknowledge Priya's work", "Positions as your idea vs her idea"],
                    outcome: "blunt_replace",
                    status_impact: -10,
                    reputation_tag: "steamroller"
                  },
                  {
                    text: "\"What if we asked the teacher which format they'd prefer? I'm curious if something more interactive would score higher.\"",
                    signals: ["Uses external authority to validate", "Doesn't directly oppose Priya", "Gets teacher buy-in which strengthens your case"],
                    outcome: "teacher_validation",
                    status_impact: 15,
                    reputation_tag: "strategic"
                  },
                  {
                    text: "Say nothing. The poster will be fine. Not worth the conflict.",
                    signals: ["Avoids friction", "But settles for a worse outcome", "Doesn't contribute your best thinking"],
                    outcome: "stay_quiet",
                    status_impact: -5,
                    reputation_tag: "passive"
                  }
                ]
              },
              {
                situation_by_outcome: {
                  build_on_hers: "Priya pauses, looks at her sketch, then back at you. \"Wait \u2014 so like, I'd still use all this research but we'd present it as a broadcast?\" You nod. Kai looks up from his phone: \"That sounds actually fun. I could be the anchor.\" Priya grins: \"Okay, that's way cooler than a poster. Let's do it.\"",
                  blunt_replace: "Priya's face falls. She looks at her sketch. \"I already started working on this. You could've said something before I spent an hour on it.\" Kai senses tension and stays out of it. The mood is tense. Even if she agrees to change, she's annoyed.",
                  teacher_validation: "\"Good idea,\" Kai says. You approach the teacher, who says: \"Both work, but creative formats usually stand out.\" When you relay this to the group, Priya says \"Hmm, interesting. What were you thinking?\" The door is open.",
                  stay_quiet: "The poster turns out fine \u2014 solid B+. Another group does an interactive skit and gets an A. You think: that could've been us. Priya and Kai never know you had a better idea."
                },
                choices_by_outcome: {
                  build_on_hers: [
                    { text: "\"Priya, your research structure is perfect for the script. Want to write the script together? Kai and I can handle the performance parts.\"", signals: ["Gives her the high-value role", "Collaborative split", "Everyone has ownership"], outcome: "collaborative_split", status_impact: 15 },
                    { text: "Take over the planning: \"Okay so here's how we should structure the broadcast...\"", signals: ["Momentum is good but you're taking over", "Priya might feel sidelined from HER idea being transformed"], outcome: "take_over", status_impact: -5 }
                  ],
                  blunt_replace: [
                    { text: "\"You're right, I should've said something earlier. Your research is really solid \u2014 what if we used it in a different format? I don't want to waste what you've done.\"", signals: ["Acknowledges the mistake", "Reframes as respecting her work", "Recovery attempt"], outcome: "recover_respect", status_impact: 10 },
                    { text: "\"I mean, do you want a B or an A? The broadcast is just better.\"", signals: ["Doubles down", "Makes it about winning vs feelings", "Guarantees resentment even if she agrees"], outcome: "grade_argument", status_impact: -15 }
                  ],
                  teacher_validation: [
                    { text: "\"What if we combined Priya's research into a news broadcast format? She's already got great content \u2014 we'd just present it differently.\"", signals: ["Now pitches the idea with external backing", "Still credits Priya's work", "Well-timed reveal"], outcome: "backed_pitch", status_impact: 15 },
                    { text: "\"The teacher basically said our poster idea is boring. We should switch.\"", signals: ["Weaponizes the teacher's words", "Exaggerates", "Makes Priya defensive"], outcome: "weaponize_teacher", status_impact: -10 }
                  ],
                  stay_quiet: [
                    { text: "For the next group project, promise yourself you'll speak up earlier \u2014 before anyone starts working.", signals: ["Learns from the experience", "Pre-emptive alignment for next time"], outcome: "learn_for_next", status_impact: 5 },
                    { text: "Complain to friends that your group held you back.", signals: ["Blames others for your silence", "You chose not to speak up"], outcome: "blame_others", status_impact: -10 }
                  ]
                }
              }
            ]
          },
          {
            id: "s7-cafeteria-plan",
            title: "The Weekend Plan",
            energy_cost: 15,
            xp_reward: 45,
            setup: "Your friend group (Raj, Sumi, Tyler) is trying to decide what to do Saturday. Tyler wants to go to the mall. Sumi wants to see a movie. Raj doesn't care. You really want to check out a new gaming caf\u00e9 that opened nearby, but Tyler tends to dominate group decisions and he's already said \"mall\" three times.",
            characters: ["Tyler (loud, dominant, stubborn about his preferences)", "Sumi (has opinions but doesn't push hard)", "Raj (go-with-the-flow)", "You"],
            social_context: "Cafeteria, planning a group outing. Tyler has social weight. You need to influence the decision without directly opposing him.",
            turns: [
              {
                situation: "Tyler is saying \"Mall. Mall. Come on, mall is the move.\" Sumi quietly said \"I'd rather see a movie\" once and Tyler talked over her. Raj is eating. You haven't said anything yet but you want the gaming caf\u00e9.",
                choices: [
                  {
                    text: "\"Tyler, the mall's always there. But that new gaming caf\u00e9 just opened \u2014 it's got tournament setups and you can try VR for free on opening weekend. After that, it'll cost money. We could always do mall next weekend.\"",
                    signals: ["Acknowledges his suggestion", "Adds urgency/scarcity to your idea", "Gives him a face-saving pivot", "Doesn't oppose \u2014 redirects"],
                    outcome: "urgency_redirect",
                    status_impact: 20,
                    reputation_tag: "persuasive"
                  },
                  {
                    text: "\"What if we put it to a vote? Everyone says what they want.\"",
                    signals: ["Democratic", "Fair process", "But Tyler might feel outnumbered and get annoyed"],
                    outcome: "vote_suggest",
                    status_impact: 10,
                    reputation_tag: "fair"
                  },
                  {
                    text: "\"I want to go to the gaming caf\u00e9. Mall is boring.\"",
                    signals: ["Direct opposition to Tyler", "Dismisses his preference", "Sets up a power struggle"],
                    outcome: "direct_oppose",
                    status_impact: -10,
                    reputation_tag: "combative"
                  },
                  {
                    text: "Say nothing. Go wherever the group goes.",
                    signals: ["Avoids conflict", "But never gets what you want", "Invisible in the group dynamic"],
                    outcome: "go_along",
                    status_impact: -5,
                    reputation_tag: "invisible"
                  }
                ]
              },
              {
                situation_by_outcome: {
                  urgency_redirect: "Tyler pauses. \"Wait, free VR?\" Sumi looks interested too: \"That actually sounds fun.\" Raj nods. Tyler's now thinking about it as HIS discovery: \"Alright, let's hit the gaming caf\u00e9. But mall next weekend for sure.\" Sumi catches your eye and grins \u2014 she knows what you did.",
                  vote_suggest: "\"Fine,\" Tyler says, crossing his arms. Vote: Sumi says movie, you say gaming caf\u00e9, Raj says \"whatever.\" Tyler says mall. It's a three-way tie with one abstain. Tyler says \"See? Nobody can decide. Just go to the mall.\" The vote didn't work because Tyler doesn't respect democratic processes.",
                  direct_oppose: "Tyler's eyes narrow. \"Mall is boring? Since when?\" Now it's you vs Tyler. Sumi looks at her phone. Raj keeps eating. The group dynamic just became a power contest between you two, and Tyler is louder.",
                  go_along: "Tyler wins by default. You go to the mall. It's fine \u2014 you hang out, eat food court stuff. But you walk past a poster for the gaming caf\u00e9 and think about what could've been. Sumi whispers \"I didn't want to come here either.\""
                },
                choices_by_outcome: {
                  urgency_redirect: [
                    { text: "Go with it gracefully. At the caf\u00e9, make sure Tyler has fun: \"Dude, you should try the racing VR \u2014 it's insane.\"", signals: ["Ensures Tyler feels good about the decision", "Solidifies your influence for next time", "Everyone wins"], outcome: "ensure_fun", status_impact: 15 },
                    { text: "\"See? My ideas are better.\" with a smirk.", signals: ["Gloating", "Undermines the collaborative framing", "Tyler remembers this next time"], outcome: "gloat", status_impact: -10 }
                  ],
                  vote_suggest: [
                    { text: "\"Okay, how about a compromise: gaming caf\u00e9 first since it's new, then mall next time? That way everyone gets their pick.\"", signals: ["Builds on the process", "Offers sequence instead of competition", "Tyler gets his thing too \u2014 just later"], outcome: "compromise_sequence", status_impact: 15 },
                    { text: "\"Tyler, you can't just override a vote because you didn't win.\"", signals: ["Calls out the behavior", "But creates direct confrontation", "Tyler will dig in harder"], outcome: "call_out_tyler", status_impact: -5 }
                  ],
                  direct_oppose: [
                    { text: "De-escalate: \"I didn't mean it's boring, I just meant we go there all the time. What if we tried something new this once?\"", signals: ["Softens the language", "Reframes as novelty not rejection", "Gives Tyler room to agree without losing face"], outcome: "soften_reframe", status_impact: 10 },
                    { text: "Stand your ground: \"I'm going to the gaming caf\u00e9. You guys can come or not.\"", signals: ["Power move", "Might split the group", "Bold but risky"], outcome: "power_move", status_impact: 5 }
                  ],
                  go_along: [
                    { text: "Bond with Sumi: \"Next time let's plan something together before Tyler decides for everyone.\"", signals: ["Builds alliance", "Strategic for future decisions", "Doesn't challenge Tyler directly \u2014 works around him"], outcome: "build_alliance", status_impact: 10 },
                    { text: "Just accept that Tyler always decides.", signals: ["Learned helplessness", "Gives away your social agency"], outcome: "accept_pattern", status_impact: -10 }
                  ]
                }
              }
            ]
          }
        ]
      },
      "ch-8": {
        title: "Conflict De-escalation",
        subtitle: "The 5-step protocol",
        concepts: ["Lower temperature", "Clarify goal", "Reflect emotion", "Offer options", "Anchor to shared objective"],
        scenarios: [
          {
            id: "s8-lunch-table-blowup",
            title: "The Lunch Table Blowup",
            energy_cost: 25,
            xp_reward: 50,
            setup: "Your friend Marcus is furious. He just found out that another friend, Dante, told people about something Marcus shared in confidence. Marcus is standing at the lunch table, voice raised, fists clenched, and the whole cafeteria is starting to watch.",
            characters: ["Marcus (your close friend, betrayed and angry)", "Dante (the one who shared the secret, looking guilty)", "Cafeteria onlookers"],
            social_context: "Public cafeteria. Marcus is in full threat mode. Dante is defensive. You're caught between two friends. The audience makes everything 10x harder because Marcus's status feels at stake.",
            turns: [
              {
                situation: "Marcus slams his tray down and says loudly: \"Everyone knows now because of YOU. I trusted you!\" Dante starts to say \"Bro, I didn't mean\u2014\" but Marcus cuts him off. People at nearby tables are staring. Marcus looks at you: \"You heard what he did, right?\"",
                emotion_guess: {
                  prompt: "What is the PRIMARY emotional driver behind Marcus's loud, aggressive behavior right now?",
                  options: [
                    { text: "He's an angry person who can't control himself", correct: false, explanation: "This reads the surface, not the system. Anger here is OUTPUT, not the driver. Something deeper is fueling it." },
                    { text: "He feels humiliated and is trying to reclaim control of his narrative", correct: true, explanation: "His secret being shared stripped him of control over his own story. The public display is his brain trying to reclaim status and agency. The volume isn't about Dante \u2014 it's about the audience." },
                    { text: "He wants to punish Dante for being a bad friend", correct: false, explanation: "Punishment might be a secondary goal, but it's not the core driver. If this happened privately with no witnesses, the reaction would be very different. The audience is the key variable." }
                  ]
                },
                choices: [
                  {
                    text: "\"Yeah, that was really messed up, Dante.\" Take Marcus's side immediately.",
                    signals: ["Alliance with Marcus", "Public condemnation of Dante", "Escalation through validation"],
                    outcome: "sided_with_marcus",
                    status_impact: -5,
                    reputation_tag: "loyal-but-escalating"
                  },
                  {
                    text: "\"Hey Marcus, I hear you. That's a real violation of trust. Can we go talk somewhere not here?\"",
                    signals: ["Validating emotion without escalating", "Attempting to remove audience", "De-escalation step 1: lower temperature"],
                    outcome: "validated_and_redirected",
                    status_impact: 15,
                    reputation_tag: "de-escalator"
                  },
                  {
                    text: "\"Both of you need to calm down. This isn't the place.\"",
                    signals: ["Commanding authority", "Dismissing emotions", "Logic over feelings"],
                    outcome: "told_to_calm_down",
                    status_impact: -10,
                    reputation_tag: "tone-deaf"
                  },
                  {
                    text: "Stay quiet, look down. You don't want to get involved.",
                    signals: ["Disengagement", "Avoiding conflict", "No support for either friend"],
                    outcome: "stayed_silent",
                    status_impact: -5,
                    reputation_tag: "bystander"
                  }
                ]
              },
              {
                situation_by_outcome: {
                  sided_with_marcus: "Marcus feels backed up and gets louder: \"See? Even he knows!\" Dante looks stung and says \"Fine, I guess I'm the villain then\" and starts to leave. This is getting worse, not better. Marcus is still amped up.",
                  validated_and_redirected: "Marcus takes a breath. He's still angry, but your acknowledgment of his feelings lowered the pressure by a notch. \"Yeah... yeah, not here.\" He picks up his tray. Dante is still standing there, unsure what to do.",
                  told_to_calm_down: "Marcus turns on you: \"Don't tell me to calm down! You don't even know what happened!\" Now you're a target too. Dante uses the distraction to slip away. Marcus is now angry at both of you.",
                  stayed_silent: "Marcus looks at you with disappointment: \"Nothing? Okay then.\" He turns back to Dante and it escalates further. A teacher starts walking over. You missed the window to help."
                },
                choices_by_outcome: {
                  sided_with_marcus: [
                    {
                      text: "\"Marcus, you're right to be mad. But let's handle this smart, not loud. You want Dante to understand, right?\"",
                      signals: ["Redirecting from public to productive", "Reframing the goal", "De-escalation step 4: offer options"],
                      outcome: "redirected_late",
                      status_impact: 10,
                      reputation_tag: "strategic-recovery"
                    },
                    {
                      text: "\"Dante, you owe him an apology. Right now.\"",
                      signals: ["Forcing resolution", "Public pressure", "Escalating further"],
                      outcome: "forced_apology",
                      status_impact: -10,
                      reputation_tag: "aggressive"
                    },
                    {
                      text: "\"Marcus, I've got your back. Let's walk.\"",
                      signals: ["Physical removal from scene", "Loyal support", "Breaking the loop"],
                      outcome: "extracted_marcus",
                      status_impact: 5,
                      reputation_tag: "solid-friend"
                    }
                  ],
                  validated_and_redirected: [
                    {
                      text: "Walk with Marcus to a quieter spot. Say to Dante: \"Give us five minutes, then come find us.\"",
                      signals: ["Managing both sides", "Creating cooling space", "De-escalation step 5: anchor to shared objective"],
                      outcome: "mediated_separation",
                      status_impact: 20,
                      reputation_tag: "mediator"
                    },
                    {
                      text: "\"Marcus, what do you actually need from Dante right now?\"",
                      signals: ["Clarifying the goal", "Moving from emotion to resolution", "De-escalation step 2: clarify goal"],
                      outcome: "clarified_goal",
                      status_impact: 15,
                      reputation_tag: "clear-thinker"
                    },
                    {
                      text: "\"Dante, you should probably give him space right now.\"",
                      signals: ["Protecting Marcus", "Dismissing Dante's perspective", "Partial de-escalation"],
                      outcome: "dismissed_dante",
                      status_impact: 5,
                      reputation_tag: "partial-mediator"
                    }
                  ],
                  told_to_calm_down: [
                    {
                      text: "\"You're right, I don't know everything. Tell me what happened.\"",
                      signals: ["Admitting mistake", "Showing willingness to listen", "Recovery attempt"],
                      outcome: "recovered_by_listening",
                      status_impact: 5,
                      reputation_tag: "humble-recovery"
                    },
                    {
                      text: "\"I'm trying to help, Marcus. If you don't want it, I'll leave.\"",
                      signals: ["Defensive withdrawal", "Conditional support", "Ultimatum"],
                      outcome: "gave_ultimatum",
                      status_impact: -10,
                      reputation_tag: "conditional-friend"
                    },
                    {
                      text: "\"Okay, I hear you. I should have said it differently. What happened with Dante was wrong.\"",
                      signals: ["Acknowledging your misstep", "Validating his anger", "Repairing the rupture"],
                      outcome: "self_corrected",
                      status_impact: 10,
                      reputation_tag: "self-aware"
                    }
                  ],
                  stayed_silent: [
                    {
                      text: "Text Marcus later: \"Hey, I'm sorry I froze. That was messed up what Dante did. You okay?\"",
                      signals: ["Delayed support", "Private repair attempt", "Acknowledging the freeze"],
                      outcome: "texted_later",
                      status_impact: 5,
                      reputation_tag: "late-support"
                    },
                    {
                      text: "Catch Dante after and say: \"You need to fix that. Go apologize for real.\"",
                      signals: ["Behind-the-scenes intervention", "Pushing resolution indirectly", "Avoiding direct conflict"],
                      outcome: "worked_indirectly",
                      status_impact: 0,
                      reputation_tag: "behind-the-scenes"
                    },
                    {
                      text: "Do nothing. It's between them.",
                      signals: ["Full disengagement", "Preserving self", "No investment in the friendship"],
                      outcome: "fully_disengaged",
                      status_impact: -15,
                      reputation_tag: "uninvested"
                    }
                  ]
                }
              }
            ]
          },
          {
            id: "s8-group-chat-war",
            title: "The Group Chat War",
            energy_cost: 20,
            xp_reward: 45,
            setup: "The class group chat has exploded. Two people, Kira and Jaylen, are going back and forth about who ruined the group presentation. Screenshots are being shared. People are picking sides. Your phone is blowing up with notifications.",
            characters: ["Kira (blaming Jaylen publicly)", "Jaylen (defensive, getting personal)", "15+ people watching and reacting in the chat"],
            social_context: "Group chat with your whole class. Everything is in text \u2014 permanent, screenshottable, no tone of voice. The audience effect is massive because EVERYONE can see EVERY message.",
            turns: [
              {
                situation: "Kira just posted: \"Jaylen literally did NOTHING for the presentation and now we all got a bad grade because of him.\" Jaylen responds: \"Maybe if you weren't such a control freak nobody would want to help you.\" Three people sent laugh emojis. Someone says \"spill the tea.\" The chat is moving fast.",
                choices: [
                  {
                    text: "Type: \"Yo can we not do this in the group chat? This is between you two.\"",
                    signals: ["Boundary setting", "Reducing audience", "Not taking sides"],
                    outcome: "called_out_chat",
                    status_impact: 5,
                    reputation_tag: "reasonable"
                  },
                  {
                    text: "DM Kira privately: \"Hey, I get you're frustrated. Want to talk about what actually happened?\"",
                    signals: ["Private de-escalation", "Validating without public involvement", "Strategic side channel"],
                    outcome: "dm_kira",
                    status_impact: 10,
                    reputation_tag: "strategic"
                  },
                  {
                    text: "DM Jaylen privately: \"This is getting out of hand. Don't say anything else in the chat, it'll only get worse.\"",
                    signals: ["Private coaching", "Preventing escalation", "Looking out for someone who's losing"],
                    outcome: "dm_jaylen",
                    status_impact: 10,
                    reputation_tag: "wise-advisor"
                  },
                  {
                    text: "Type: \"Actually the presentation had multiple issues. Let's figure out what went wrong instead of blaming one person.\"",
                    signals: ["Reframing the conflict", "Spreading accountability", "Trying to redirect energy"],
                    outcome: "reframed_public",
                    status_impact: 5,
                    reputation_tag: "reframer"
                  }
                ]
              },
              {
                situation_by_outcome: {
                  called_out_chat: "Kira responds: \"No, everyone should know what happened.\" But a couple people agree with you: \"yeah this is awkward.\" The pace of messages slows slightly. Jaylen hasn't responded yet.",
                  dm_kira: "Kira DMs you back: \"I'm just so mad. He literally didn't do his section and I had to stay up until 2am to fix it.\" In the group chat, things are still escalating. Someone posted a meme about Jaylen.",
                  dm_jaylen: "Jaylen replies: \"She's making it sound way worse than it was. I did help, she just didn't like how I did it.\" In the group chat, Kira just posted screenshots of their DMs about the project.",
                  reframed_public: "Kira says: \"You weren't even in our group, you don't know.\" Jaylen says: \"At least someone has sense.\" You're now involved publicly. Two different people are asking what you think really happened."
                },
                choices_by_outcome: {
                  called_out_chat: [
                    {
                      text: "DM both Kira and Jaylen separately: \"I think you both have valid points. Can we meet up tomorrow and actually figure this out?\"",
                      signals: ["Dual mediation", "Moving online to offline", "Anchoring to shared goal"],
                      outcome: "dual_mediation",
                      status_impact: 15,
                      reputation_tag: "peacemaker"
                    },
                    {
                      text: "Mute the chat. You said your piece.",
                      signals: ["Boundary protection", "Disengagement after contribution", "Self-preservation"],
                      outcome: "muted_after_attempt",
                      status_impact: 0,
                      reputation_tag: "boundaried"
                    },
                    {
                      text: "Type: \"If anyone actually wants to figure out the grade situation, we should talk to the teacher as a group.\"",
                      signals: ["Redirecting to solution", "Involving authority constructively", "Goal-focused"],
                      outcome: "redirected_to_solution",
                      status_impact: 10,
                      reputation_tag: "solution-finder"
                    }
                  ],
                  dm_kira: [
                    {
                      text: "\"That sounds really frustrating. Do you want to talk to the teacher about getting the grade situation fixed? That might help more than the group chat.\"",
                      signals: ["Acknowledging feeling", "Redirecting to productive action", "De-escalation step 4: offer options"],
                      outcome: "redirected_kira",
                      status_impact: 15,
                      reputation_tag: "practical-helper"
                    },
                    {
                      text: "\"I get it. But the group chat thing is making you look bad too. Maybe delete those messages?\"",
                      signals: ["Honest feedback", "Protecting her reputation", "Risk of being seen as criticism"],
                      outcome: "advised_kira",
                      status_impact: 5,
                      reputation_tag: "honest-friend"
                    },
                    {
                      text: "\"Want me to talk to Jaylen? Maybe I can get him to acknowledge what happened.\"",
                      signals: ["Offering to mediate", "Taking on responsibility", "Potential overstepping"],
                      outcome: "offered_to_mediate",
                      status_impact: 10,
                      reputation_tag: "fixer"
                    }
                  ],
                  dm_jaylen: [
                    {
                      text: "\"I hear you. But the screenshots Kira posted look bad. Maybe DM her directly and work it out before this gets worse.\"",
                      signals: ["Honest assessment", "Pushing toward direct resolution", "Showing consequences"],
                      outcome: "pushed_direct_resolution",
                      status_impact: 10,
                      reputation_tag: "straight-shooter"
                    },
                    {
                      text: "\"What actually happened with your part of the project? What's the full story?\"",
                      signals: ["Gathering information", "Showing you care about truth", "Not jumping to conclusions"],
                      outcome: "gathered_intel",
                      status_impact: 10,
                      reputation_tag: "investigator"
                    },
                    {
                      text: "\"Just don't respond anymore. Let her burn herself out. The less you say, the better you look.\"",
                      signals: ["Strategic silence coaching", "Reputation management", "Playing the long game"],
                      outcome: "coached_silence",
                      status_impact: 5,
                      reputation_tag: "strategist"
                    }
                  ],
                  reframed_public: [
                    {
                      text: "\"I wasn't in the group, you're right. I just think blaming one person in a group chat isn't going to fix the grade. Talk to the teacher.\"",
                      signals: ["Acknowledging limits", "Redirecting to solution", "Not getting pulled into blame game"],
                      outcome: "redirected_gracefully",
                      status_impact: 10,
                      reputation_tag: "composed"
                    },
                    {
                      text: "\"I'll stay out of the details. Just saying, we've all had group project issues. This doesn't need to be a public trial.\"",
                      signals: ["Normalizing the situation", "De-escalating intensity", "Universal framing"],
                      outcome: "normalized",
                      status_impact: 10,
                      reputation_tag: "perspective-giver"
                    },
                    {
                      text: "Stop responding. You've been pulled in deeper than intended.",
                      signals: ["Recognizing overextension", "Strategic retreat", "Energy conservation"],
                      outcome: "strategic_retreat",
                      status_impact: 0,
                      reputation_tag: "knows-limits"
                    }
                  ]
                }
              }
            ]
          }
        ]
      },
      "ch-9": {
        title: "Social Energy Management",
        subtitle: "Your most finite resource",
        concepts: ["Energy is real and limited", "Recovery mechanics", "Strategic disengagement", "Boundary setting as self-preservation"],
        scenarios: [
          {
            id: "s9-overloaded-weekend",
            title: "The Overloaded Weekend",
            energy_cost: 15,
            xp_reward: 45,
            setup: "It's Friday afternoon. You've had an exhausting week \u2014 two tests, a group project conflict, and a tough conversation with a friend. Now you have three social invitations for the weekend and you're running on empty.",
            characters: ["Mom (wants family dinner Saturday)", "Best friend Alex (birthday party Saturday night)", "Classmate group (study session Sunday for Monday test)"],
            social_context: "You need to manage three competing social demands with limited energy. Each one has different stakes: family obligation, friendship loyalty, and academic necessity. You can't do all three at full capacity.",
            turns: [
              {
                situation: "You check your phone: Mom texted \"Family dinner Saturday, Grandma is coming. Non-negotiable.\" Alex texted \"My party is Saturday at 7, you HAVE to come!\" And the study group chat says \"Sunday 2pm, everyone needs to be there.\" Your energy feels like it's at about 20%. What's your priority framework?",
                emotion_guess: {
                  prompt: "What is the most important factor to consider when you're socially overloaded?",
                  options: [
                    { text: "Which event has the most people who will notice if you're missing", correct: false, explanation: "This optimizes for other people's perception, not your actual capacity. When you're depleted, prioritizing appearances leads to poor performance everywhere." },
                    { text: "Your own recovery needs and which obligations have the highest actual consequences", correct: true, explanation: "Triage is the correct framework: what are the real consequences of each option, and what does your energy actually allow? You can't pour from an empty cup. Protecting some recovery time means you'll show up better wherever you do go." },
                    { text: "The event that sounds the most fun", correct: false, explanation: "Fun is important, but when you're at 20% energy, a 'fun' event can still drain you completely and leave you unable to function for the mandatory stuff." }
                  ]
                },
                choices: [
                  {
                    text: "Commit to all three. You'll push through. People are counting on you.",
                    signals: ["People-pleasing", "Ignoring personal limits", "Setting up for crash"],
                    outcome: "committed_all",
                    status_impact: -10,
                    reputation_tag: "overextended"
                  },
                  {
                    text: "Family dinner is locked. Tell Alex you'll come to the party for an hour. Skip the study group and study alone.",
                    signals: ["Prioritizing obligations with real consequences", "Partial attendance strategy", "Self-aware capacity management"],
                    outcome: "strategic_triage",
                    status_impact: 15,
                    reputation_tag: "strategic-planner"
                  },
                  {
                    text: "Cancel everything except the study group. Academics come first.",
                    signals: ["Academic priority", "Dismissing social obligations", "Avoidance framing"],
                    outcome: "academics_only",
                    status_impact: -5,
                    reputation_tag: "isolated"
                  },
                  {
                    text: "Tell everyone you're sick. Stay home and recharge all weekend.",
                    signals: ["Lying to avoid conflict", "Full retreat", "Short-term relief, long-term trust damage"],
                    outcome: "fake_sick",
                    status_impact: -15,
                    reputation_tag: "flaky"
                  }
                ]
              },
              {
                situation_by_outcome: {
                  committed_all: "It's Saturday evening. You survived family dinner but you were clearly distracted \u2014 Grandma noticed. Now you're at Alex's party and you're completely drained. You've been standing in a corner for 20 minutes. Alex comes over: \"Hey, you okay? You seem really out of it.\"",
                  strategic_triage: "Family dinner went well because you were present. You show up at Alex's party at 8pm with a plan to leave by 9. Alex sees you arrive: \"YES! You made it!\" You have about 45 minutes of real social energy left.",
                  academics_only: "It's Saturday and you've been home alone all day. Mom is hurt you skipped family dinner: \"Grandma asked about you.\" Alex texted: \"So you're really not coming? Wow.\" You feel guilty but you do feel rested. The study group is tomorrow.",
                  fake_sick: "It's Saturday. Mom brought you soup. Grandma called to check on you. Alex texted \"Feel better\" with a sad face. But then someone posted a story of you at the store earlier today. Alex sees it and DMs you: \"Thought you were sick?\""
                },
                choices_by_outcome: {
                  committed_all: [
                    {
                      text: "\"Honestly? I'm running on empty. This week destroyed me. But I wanted to be here for your birthday.\"",
                      signals: ["Vulnerability", "Honesty about capacity", "Showing the effort behind the presence"],
                      outcome: "honest_with_alex",
                      status_impact: 10,
                      reputation_tag: "authentic"
                    },
                    {
                      text: "\"I'm fine! Let's go!\" Force yourself to be energetic.",
                      signals: ["Masking", "Performing energy you don't have", "Risking shutdown"],
                      outcome: "forced_energy",
                      status_impact: -5,
                      reputation_tag: "masking"
                    },
                    {
                      text: "\"I'm gonna head out actually. Happy birthday though.\"",
                      signals: ["Abrupt exit", "Recognizing limits too late", "Better late than never"],
                      outcome: "left_early",
                      status_impact: 0,
                      reputation_tag: "late-boundary-setter"
                    }
                  ],
                  strategic_triage: [
                    {
                      text: "Enjoy the party for 45 minutes. Be genuinely present. Leave at 9 with: \"Happy birthday, this was great. I've got to get some rest for the study grind tomorrow.\"",
                      signals: ["Quality over quantity", "Clear exit with valid reason", "Warm departure"],
                      outcome: "clean_exit",
                      status_impact: 15,
                      reputation_tag: "quality-friend"
                    },
                    {
                      text: "You're having fun and Alex wants you to stay. Push it to 10pm.",
                      signals: ["Extending past plan", "Social momentum override", "Tomorrow-you pays the cost"],
                      outcome: "extended_stay",
                      status_impact: 5,
                      reputation_tag: "flexible"
                    },
                    {
                      text: "Leave at 8:30 \u2014 even earlier than planned. You're more drained than expected.",
                      signals: ["Listening to your body", "Adjusting the plan", "Might seem like a token appearance"],
                      outcome: "early_exit",
                      status_impact: 5,
                      reputation_tag: "self-aware"
                    }
                  ],
                  academics_only: [
                    {
                      text: "Text Mom: \"I'm sorry about dinner. I was really burnt out. Can I call Grandma tomorrow?\" Text Alex: \"I know I missed it. I'm sorry. Can I take you out for your birthday next week?\"",
                      signals: ["Repair attempts", "Acknowledging impact", "Offering alternatives"],
                      outcome: "repair_attempts",
                      status_impact: 10,
                      reputation_tag: "accountable"
                    },
                    {
                      text: "Don't respond yet. You needed this and they'll understand eventually.",
                      signals: ["Avoidance", "Hoping it blows over", "No repair attempt"],
                      outcome: "delayed_response",
                      status_impact: -10,
                      reputation_tag: "avoidant"
                    },
                    {
                      text: "Show up to the study group well-rested and crush it. Let the results speak.",
                      signals: ["Proving the sacrifice was worth it", "Actions over words", "Compartmentalizing"],
                      outcome: "proved_it",
                      status_impact: 0,
                      reputation_tag: "results-focused"
                    }
                  ],
                  fake_sick: [
                    {
                      text: "Come clean immediately: \"You're right, I wasn't sick. I was completely overwhelmed and didn't know how to say no. I'm sorry.\"",
                      signals: ["Honesty after being caught", "Vulnerability", "Owning the mistake"],
                      outcome: "came_clean",
                      status_impact: 5,
                      reputation_tag: "eventually-honest"
                    },
                    {
                      text: "\"I was feeling better and needed to grab medicine. I'm still not 100%.\" Double down on the lie.",
                      signals: ["Escalating deception", "Protecting the cover story", "Digging deeper"],
                      outcome: "doubled_down",
                      status_impact: -20,
                      reputation_tag: "deceptive"
                    },
                    {
                      text: "Don't respond. You need to think about how to handle this.",
                      signals: ["Freezing under pressure", "Delayed response", "No quick fix"],
                      outcome: "froze",
                      status_impact: -5,
                      reputation_tag: "deer-in-headlights"
                    }
                  ]
                }
              }
            ]
          },
          {
            id: "s9-social-battery-school",
            title: "The Draining Day",
            energy_cost: 15,
            xp_reward: 45,
            setup: "You're at school and you can feel your social battery dying. It's only 1pm. You've had a presentation, a group work session, and lunch with a big group. You have two more class periods, then your friend wants to hang out after school.",
            characters: ["Your body/brain (sending shutdown signals)", "Teacher (expects participation)", "Friend Kai (excited to hang after school)", "Classmates"],
            social_context: "You're in a public environment where you can't fully withdraw. The challenge is managing the remaining day without crashing, while protecting the relationships that matter.",
            turns: [
              {
                situation: "You're sitting in class and you can feel the shutdown coming: everything is too loud, your brain feels foggy, you can't track the conversation. The teacher asks the class a question and looks around for volunteers. Kai texts you under the desk: \"We still on for after school? So excited!\" Your next class has a group activity.",
                choices: [
                  {
                    text: "Put your head down for a moment. Ask the teacher if you can use the restroom and take 5 minutes in a quiet hallway.",
                    signals: ["Recognizing the warning signs", "Micro-recovery strategy", "Protecting remaining capacity"],
                    outcome: "took_micro_break",
                    status_impact: 10,
                    reputation_tag: "self-regulator"
                  },
                  {
                    text: "Push through. Raise your hand. Answer the question. Keep performing.",
                    signals: ["Ignoring shutdown signals", "Performing normalcy", "Spending energy you don't have"],
                    outcome: "pushed_through",
                    status_impact: -5,
                    reputation_tag: "masked-struggle"
                  },
                  {
                    text: "Text Kai back: \"Hey, I'm really drained today. Can we do tomorrow instead?\"",
                    signals: ["Proactive boundary setting", "Honest about capacity", "Protecting the hangout quality"],
                    outcome: "rescheduled_kai",
                    status_impact: 10,
                    reputation_tag: "honest-communicator"
                  },
                  {
                    text: "Put in earbuds (one ear). Zone out. Don't engage with anything for the rest of the period.",
                    signals: ["Full withdrawal in public", "Visible disengagement", "Emergency shutdown mode"],
                    outcome: "full_withdrawal",
                    status_impact: -5,
                    reputation_tag: "checked-out"
                  }
                ]
              },
              {
                situation_by_outcome: {
                  took_micro_break: "The 5 minutes in the quiet hallway helped. You're back to maybe 15% instead of 5%. The next class group activity starts. You can participate minimally without crashing. Kai's text is still unanswered.",
                  pushed_through: "You answered the question but it came out mumbled and confused. The teacher moved on. You're now at 0%. The group activity in next period is going to be brutal. Kai's text is still unanswered.",
                  rescheduled_kai: "Kai texts back: \"Aw okay, hope you feel better! Tomorrow works.\" Relief. But you still have to survive two more periods. The group activity is next.",
                  full_withdrawal: "The teacher noticed: \"Everything okay?\" You nodded. A classmate whispered \"is he sleeping?\" You got some rest but now you feel self-conscious. Group activity is next and your group is going to expect you to contribute."
                },
                choices_by_outcome: {
                  took_micro_break: [
                    {
                      text: "In the group activity, take the quietest role \u2014 note-taker or researcher. Contribute without leading. Then text Kai: \"I'm pretty wiped. Can we keep it chill? Like just hang at my place?\"",
                      signals: ["Strategic low-energy participation", "Modifying plans to match capacity", "Honest without canceling"],
                      outcome: "low_key_approach",
                      status_impact: 15,
                      reputation_tag: "adaptive"
                    },
                    {
                      text: "Tell your group: \"I'm taking the lead on this one\" and use the small energy burst to power through everything.",
                      signals: ["Overcompensating", "Spending the recovery gains", "Boom-bust cycle"],
                      outcome: "overcorrected",
                      status_impact: 0,
                      reputation_tag: "boom-bust"
                    },
                    {
                      text: "Do the group activity on autopilot. Save everything for hanging with Kai.",
                      signals: ["Prioritizing friendship over classwork", "Energy allocation choice", "Others may notice the low effort"],
                      outcome: "saved_for_kai",
                      status_impact: -5,
                      reputation_tag: "selective-effort"
                    }
                  ],
                  pushed_through: [
                    {
                      text: "Admit to your group: \"I'm having a rough day. I can do the quiet parts but I can't present or lead right now.\"",
                      signals: ["Vulnerability in a group setting", "Setting expectations", "Better late than never"],
                      outcome: "admitted_to_group",
                      status_impact: 10,
                      reputation_tag: "vulnerable"
                    },
                    {
                      text: "Try to get through the group activity on willpower. Cancel Kai via text.",
                      signals: ["Last reserves mode", "Triage too late", "Survival mode"],
                      outcome: "survival_mode",
                      status_impact: -5,
                      reputation_tag: "barely-surviving"
                    },
                    {
                      text: "Ask the teacher if you can work independently today. You're not in a state for group work.",
                      signals: ["Requesting accommodation", "Self-advocacy", "May seem antisocial"],
                      outcome: "requested_solo",
                      status_impact: 5,
                      reputation_tag: "self-advocate"
                    }
                  ],
                  rescheduled_kai: [
                    {
                      text: "In the group activity, be honest: \"I'm running low today. I'll do the written part but someone else should present.\" Use the energy savings from canceling Kai wisely.",
                      signals: ["Honest role negotiation", "Using freed energy strategically", "Team awareness"],
                      outcome: "strategic_redistribution",
                      status_impact: 15,
                      reputation_tag: "smart-allocator"
                    },
                    {
                      text: "Now that the after-school pressure is off, you relax and actually do well in the group activity.",
                      signals: ["Relief response", "Freed mental space", "Good energy management"],
                      outcome: "relief_performance",
                      status_impact: 10,
                      reputation_tag: "relief-performer"
                    },
                    {
                      text: "Coast through the rest of the day on minimum energy. Go home and decompress.",
                      signals: ["Pure conservation mode", "Getting to the finish line", "No extra investment"],
                      outcome: "coasted_home",
                      status_impact: 0,
                      reputation_tag: "survivor"
                    }
                  ],
                  full_withdrawal: [
                    {
                      text: "Tell your group directly: \"I checked out last period because I'm really drained. I'll do what I can but I'm not at 100%.\"",
                      signals: ["Owning the visible shutdown", "Transparency", "Setting realistic expectations"],
                      outcome: "owned_it",
                      status_impact: 10,
                      reputation_tag: "transparent"
                    },
                    {
                      text: "Overcompensate in the group activity to make up for looking checked out earlier.",
                      signals: ["Guilt-driven overcorrection", "Spending nonexistent energy", "Crash incoming"],
                      outcome: "guilt_overcorrection",
                      status_impact: -10,
                      reputation_tag: "guilt-driven"
                    },
                    {
                      text: "Ask your group if you can take the simplest task. No explanation needed.",
                      signals: ["Quiet self-management", "Not drawing attention", "Minimal viable participation"],
                      outcome: "quiet_minimum",
                      status_impact: 5,
                      reputation_tag: "low-key"
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  },
  "level-4": {
    title: "Mastery Mode",
    color: "#FF4B4B",
    chapters: {
      "ch-10": {
        title: "Dynamic Scenarios",
        subtitle: "The simulation adapts to you",
        concepts: ["Multiple characters with memory", "Reputation follows you", "Long-term consequences", "Your patterns shape your world"],
        scenarios: [
          {
            id: "s10-new-school-day1",
            title: "New School: Day One",
            energy_cost: 25,
            xp_reward: 50,
            setup: "You've transferred to a new school mid-semester. Nobody knows you. Your reputation is blank. Today is day one \u2014 every interaction is writing the first draft of who you'll be here. You have three key encounters that will shape how people see you.",
            characters: ["Ms. Rivera (homeroom teacher, testing the new kid)", "Devon (popular, confident, sizing you up)", "Noor (quiet, observant, sitting alone)", "The Class (watching how you handle yourself)"],
            social_context: "New environment. Zero established reputation. Everyone is forming first impressions. The social hierarchy is already established and you're the unknown variable being evaluated by everyone simultaneously.",
            mastery_flags: { tracks_reputation: true, multi_character: true, consequences_carry: true },
            turns: [
              {
                situation: "First period. Ms. Rivera introduces you: \"Everyone, this is our new student.\" The class stares. Ms. Rivera says \"Tell us something about yourself.\" Devon leans back in his chair, arms crossed, watching. Noor glances up from her book. This is your first impression on 25 people at once.",
                choices: [
                  {
                    text: "\"Hi, I'm [name]. I'm into [genuine interest]. Still figuring this place out, so go easy on me.\" Light, honest, slightly self-deprecating.",
                    signals: ["Authentic", "Approachable", "Not trying too hard", "Slight vulnerability as strength"],
                    outcome: "authentic_intro",
                    status_impact: 15,
                    reputation_tag: "authentic"
                  },
                  {
                    text: "\"Hey.\" That's it. Minimal. Sit down.",
                    signals: ["Mystery", "Could read as cool or antisocial", "Refusing to perform"],
                    outcome: "minimal_intro",
                    status_impact: 0,
                    reputation_tag: "mystery"
                  },
                  {
                    text: "\"Hi everyone! I'm so excited to be here! I was at [old school] and I did [list of achievements].\" Enthusiastic, detailed.",
                    signals: ["Trying to establish status quickly", "Might seem desperate or bragging", "High-energy approach"],
                    outcome: "oversold_intro",
                    status_impact: -10,
                    reputation_tag: "try-hard"
                  },
                  {
                    text: "\"I'm [name]. I don't really do the whole introduction thing. Can I just sit?\" Direct refusal.",
                    signals: ["Boundary setting", "Anti-authority undertone", "Could read as confident or rude"],
                    outcome: "refused_intro",
                    status_impact: 5,
                    reputation_tag: "rebel"
                  }
                ]
              },
              {
                situation_by_outcome: {
                  authentic_intro: "A few people smile. Devon nods \u2014 not hostile, not welcoming, just... noting. Noor looks interested. At lunch, you're carrying your tray and face a choice: Devon's table (big group, loud, clearly the social hub) has an empty seat. Noor is sitting alone with her book at a small table by the window.",
                  minimal_intro: "Devon smirks. A couple people whisper. Noor doesn't react. At lunch, nobody approaches you specifically. Devon's table is full but someone could scoot over. Noor is alone at a small table. You're standing with your tray, looking for a spot.",
                  oversold_intro: "Devon rolls his eyes. Someone whispers \"oh god.\" Noor looks back down at her book. At lunch, you notice people actively avoiding eye contact. Devon's table is definitely not inviting you. Noor's table is the only one with space that isn't explicitly unwelcoming.",
                  refused_intro: "Ms. Rivera looks surprised but lets it go. Devon raises an eyebrow \u2014 respect or annoyance, hard to tell. A few people look uncomfortable. At lunch, Devon actually waves you over: \"Yo, new kid. You're funny. Sit.\" But Noor catches your eye from her table with a slight nod."
                },
                choices_by_outcome: {
                  authentic_intro: [
                    {
                      text: "Sit with Devon's group. This is where the social capital is. Be friendly, ask questions, listen more than talk.",
                      signals: ["Social investment in high-status group", "Strategic positioning", "Risk of seeming like a follower"],
                      outcome: "joined_devon",
                      status_impact: 10,
                      reputation_tag: "social-climber"
                    },
                    {
                      text: "Sit with Noor. You're curious about the quiet person \u2014 they usually see the most.",
                      signals: ["Independent choice", "Not chasing status", "Valuing depth over popularity"],
                      outcome: "joined_noor",
                      status_impact: 10,
                      reputation_tag: "independent-thinker"
                    },
                    {
                      text: "Sit at an empty table. You don't need to attach to anyone on day one.",
                      signals: ["Self-sufficient", "Not desperate", "Might seem standoffish"],
                      outcome: "sat_alone",
                      status_impact: 5,
                      reputation_tag: "self-contained"
                    }
                  ],
                  minimal_intro: [
                    {
                      text: "Walk up to Devon's table confidently: \"Room for one more?\" Own the mystery you created.",
                      signals: ["Confidence play", "Approaching high status group", "Using mystery as leverage"],
                      outcome: "approached_devon",
                      status_impact: 10,
                      reputation_tag: "confident"
                    },
                    {
                      text: "Sit near Noor. Nod but don't force conversation. Match her energy.",
                      signals: ["Energy matching", "Respecting quiet", "Building through proximity not words"],
                      outcome: "matched_noor",
                      status_impact: 10,
                      reputation_tag: "reader-of-rooms"
                    },
                    {
                      text: "Find a random table with a few people and just eat. See who talks to you.",
                      signals: ["Passive approach", "Letting social dynamics come to you", "Low investment"],
                      outcome: "passive_lunch",
                      status_impact: 0,
                      reputation_tag: "observer"
                    }
                  ],
                  oversold_intro: [
                    {
                      text: "Sit with Noor. Say: \"I totally oversold myself in there, didn't I?\" Self-awareness as recovery.",
                      signals: ["Self-awareness", "Humor about your mistake", "Choosing authenticity after failing at performance"],
                      outcome: "recovered_with_noor",
                      status_impact: 15,
                      reputation_tag: "self-correcting"
                    },
                    {
                      text: "Sit alone. Recalibrate. Tomorrow is a new day.",
                      signals: ["Strategic retreat", "Processing the mistake", "Reset planned"],
                      outcome: "recalibrated_alone",
                      status_impact: 5,
                      reputation_tag: "resilient"
                    },
                    {
                      text: "Try to join a random table and be much more chill this time. Learn from the introduction.",
                      signals: ["Adapting in real-time", "Not giving up", "Adjusted approach"],
                      outcome: "adjusted_approach",
                      status_impact: 5,
                      reputation_tag: "adaptive"
                    }
                  ],
                  refused_intro: [
                    {
                      text: "Go to Devon's table. He invited you \u2014 that's rare. See what his deal is.",
                      signals: ["Accepting social bid from high-status", "Curiosity", "Could be seen as Devon's recruit"],
                      outcome: "accepted_devon",
                      status_impact: 10,
                      reputation_tag: "devon-adjacent"
                    },
                    {
                      text: "Go to Noor. Devon's invitation felt performative. Noor's nod felt genuine.",
                      signals: ["Reading authenticity", "Independent judgment", "Choosing depth"],
                      outcome: "chose_noor_over_devon",
                      status_impact: 15,
                      reputation_tag: "authentic-reader"
                    },
                    {
                      text: "\"Thanks Devon, maybe tomorrow.\" Sit somewhere neutral. Don't commit on day one.",
                      signals: ["Keeping options open", "Not being claimed by anyone", "Playing the long game"],
                      outcome: "stayed_neutral",
                      status_impact: 10,
                      reputation_tag: "strategic-neutral"
                    }
                  ]
                }
              }
            ]
          },
          {
            id: "s10-reputation-test",
            title: "The Reputation Test",
            energy_cost: 25,
            xp_reward: 50,
            setup: "You've been at the new school for two weeks. A reputation is forming based on your patterns. Today, three situations test whether you'll stay consistent or break pattern. The school is watching \u2014 not obviously, but your social data is being processed by everyone around you.",
            characters: ["Devon (now knows you somewhat)", "Noor (you've talked a few times)", "Tyler (class clown, testing boundaries)", "Ms. Rivera (observing your pattern)"],
            social_context: "Your reputation is still forming. Consistency builds trust. But rigidity makes you predictable. The challenge is knowing when to stay on-pattern and when a situation demands you break it.",
            mastery_flags: { tracks_reputation: true, multi_character: true, consequences_carry: true },
            turns: [
              {
                situation: "Tyler, the class clown, makes a joke about Noor during class: \"Noor probably talks to her books more than people.\" A few people laugh. Noor doesn't react but you notice her grip her pen tighter. Devon chuckles. Ms. Rivera didn't hear. Tyler looks at you to see if you'll laugh too.",
                choices: [
                  {
                    text: "Don't laugh. Make eye contact with Tyler and shake your head slightly. A quiet \"not cool\" signal.",
                    signals: ["Standing ground without spectacle", "Subtle social pressure on Tyler", "Protecting Noor without making it a scene"],
                    outcome: "quiet_stand",
                    status_impact: 15,
                    reputation_tag: "principled"
                  },
                  {
                    text: "\"Tyler, if books could talk, they'd have better material than that.\" Turn it back on him with humor.",
                    signals: ["Deflection through wit", "Not directly confrontational", "Entertaining while protecting"],
                    outcome: "deflected_with_humor",
                    status_impact: 20,
                    reputation_tag: "quick-wit"
                  },
                  {
                    text: "Laugh along. You can't fight every battle and Tyler is socially powerful.",
                    signals: ["Compliance", "Prioritizing self-preservation", "Abandoning Noor"],
                    outcome: "laughed_along",
                    status_impact: -15,
                    reputation_tag: "follower"
                  },
                  {
                    text: "\"That's not funny, Tyler.\" Direct, public callout.",
                    signals: ["Public confrontation", "Moral stand", "High risk, potentially high reward"],
                    outcome: "direct_callout",
                    status_impact: 10,
                    reputation_tag: "direct"
                  }
                ]
              },
              {
                situation_by_outcome: {
                  quiet_stand: "Tyler notices your head shake and moves on. He didn't lose face but he got the message. Noor relaxes slightly. After class, two things happen: Devon says \"You're pretty chill, you know that?\" and Noor falls into step with you in the hallway and quietly says \"Thanks for that.\"",
                  deflected_with_humor: "The class erupts. Even Tyler laughs: \"Okay okay, fair.\" The tension breaks. Devon gives you an approving look. Noor allows herself a small smile. After class, multiple people come up to you \u2014 you're suddenly visible in a new way.",
                  laughed_along: "Tyler is satisfied. Devon doesn't notice or care. But Noor saw you laugh. After class, she walks past you without making eye contact. You can feel the temperature drop. Devon invites you to hang out after school.",
                  direct_callout: "The room goes quiet. Tyler's smile drops: \"Relax, it was a joke.\" Devon watches carefully. Some people look uncomfortable. Noor looks at you with something between gratitude and worry. Ms. Rivera looks up: \"What's going on back there?\""
                },
                choices_by_outcome: {
                  quiet_stand: [
                    {
                      text: "To Devon: \"Thanks man.\" To Noor: \"Anytime. Tyler's jokes are lazy.\" Build both bridges without overcommitting.",
                      signals: ["Balanced social investment", "Not choosing sides publicly", "Building diverse connections"],
                      outcome: "built_both_bridges",
                      status_impact: 15,
                      reputation_tag: "bridge-builder"
                    },
                    {
                      text: "Walk with Noor. Ask about the book she's reading. Let Devon's comment sit without chasing it.",
                      signals: ["Prioritizing depth", "Not chasing popular approval", "Authentic interest"],
                      outcome: "deepened_with_noor",
                      status_impact: 10,
                      reputation_tag: "depth-seeker"
                    },
                    {
                      text: "Catch up to Devon: \"Hey, want to grab lunch?\" This is your opening to the inner circle.",
                      signals: ["Pursuing social capital", "Leveraging the approval", "Strategic move"],
                      outcome: "pursued_devon",
                      status_impact: 10,
                      reputation_tag: "socially-strategic"
                    }
                  ],
                  deflected_with_humor: [
                    {
                      text: "Enjoy the moment but don't let it go to your head. In the hallway, find Noor: \"Hey, Tyler can be a lot. You good?\"",
                      signals: ["Checking in privately", "Not letting social success distract from what matters", "Grounded"],
                      outcome: "checked_on_noor",
                      status_impact: 15,
                      reputation_tag: "grounded-star"
                    },
                    {
                      text: "Ride the wave. This is the most social capital you've had since arriving. Talk to everyone who approaches.",
                      signals: ["Maximizing social opportunity", "Building network", "Risk of spreading thin"],
                      outcome: "rode_the_wave",
                      status_impact: 10,
                      reputation_tag: "social-surfer"
                    },
                    {
                      text: "Head to your next class calmly. Don't let one good moment define you either.",
                      signals: ["Emotional regulation", "Not reactive to good OR bad", "Steady presence"],
                      outcome: "stayed_steady",
                      status_impact: 10,
                      reputation_tag: "steady"
                    }
                  ],
                  laughed_along: [
                    {
                      text: "Catch Noor after class: \"Hey, I should have said something about Tyler's comment. That wasn't cool of me.\"",
                      signals: ["Owning the failure", "Attempting repair", "Accountability"],
                      outcome: "apologized_to_noor",
                      status_impact: 10,
                      reputation_tag: "accountable"
                    },
                    {
                      text: "Hang out with Devon after school. You've made your choice about which group you're in.",
                      signals: ["Committing to social hierarchy", "Trading authenticity for position", "Ignoring the damage"],
                      outcome: "joined_devon_group",
                      status_impact: -5,
                      reputation_tag: "hierarchy-player"
                    },
                    {
                      text: "Go home and think about it. You don't feel good about what happened but you're not sure what to do.",
                      signals: ["Processing", "Uncertainty", "At least not doubling down"],
                      outcome: "went_home_thinking",
                      status_impact: 0,
                      reputation_tag: "processing"
                    }
                  ],
                  direct_callout: [
                    {
                      text: "\"Nothing, Ms. Rivera. Just a disagreement about comedy.\" De-escalate the teacher situation while keeping your stance.",
                      signals: ["Managing authority involvement", "Not escalating further", "Keeping it between peers"],
                      outcome: "deflected_teacher",
                      status_impact: 10,
                      reputation_tag: "composed-under-pressure"
                    },
                    {
                      text: "\"Tyler made a comment about Noor and I said it wasn't funny.\" Let the teacher handle it.",
                      signals: ["Involving authority", "Transparency", "Could be seen as snitching or as brave"],
                      outcome: "involved_teacher",
                      status_impact: 5,
                      reputation_tag: "authority-user"
                    },
                    {
                      text: "Stare Tyler down. Say nothing more. Let the silence do the work.",
                      signals: ["Power move", "Confidence under tension", "High-stakes social play"],
                      outcome: "held_ground_silently",
                      status_impact: 15,
                      reputation_tag: "unflinching"
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  }
};
