export interface NeuralMetrics {
  dopamineCorruption: number;
  attentionDecay: number;
  grassDeficiency: number;
  neuralStability: number;
  cognitiveFragmentation: number;
}

export const INITIAL_METRICS: NeuralMetrics = {
  dopamineCorruption: 0,
  attentionDecay: 0,
  grassDeficiency: 0,
  neuralStability: 100,
  cognitiveFragmentation: 0,
};

export interface AnswerOption {
  text: string;
  impact: Partial<NeuralMetrics>;
}

export interface Question {
  title: string;
  options: AnswerOption[];
  weight?: number;
}

export const quizVariants: Record<string, {
  color: 'cyan' | 'orange' | 'green';
  diagnosticMessage: string;
  questions: Question[];
}> = {
  '1': {
    color: 'cyan',
    diagnosticMessage: 'MINOR COGNITIVE SCROLL DAMAGE DETECTED',
    questions: [
      { weight: 2, title: "Someone texts you “can I call you real quick?” What is your immediate reaction?", options: [
        { text: "An immediate spike in cortisol.", impact: { neuralStability: -5, cognitiveFragmentation: 10 } },
        { text: "Texting back “in a meeting” from my bed.", impact: { grassDeficiency: 10, dopamineCorruption: 5 } },
        { text: "Letting it ring out and typing “what’s up?” two minutes later.", impact: { attentionDecay: 15 } }
      ]},
      { weight: 2, title: "You are trying to fall asleep. What is the final barrier?", options: [
        { text: "“One more video” turning into a 90-minute rabbit hole.", impact: { dopamineCorruption: 20, attentionDecay: 10 } },
        { text: "Answering a text from four days ago.", impact: { cognitiveFragmentation: 15 } },
        { text: "Checking my alarm six times to make sure it’s actually on.", impact: { neuralStability: -15 } }
      ]},
      { weight: 2, title: "You unlocked your phone to look up something specific. Where are you 45 seconds later?", options: [
        { text: "Staring at the home screen, completely forgetting the task.", impact: { attentionDecay: 20, cognitiveFragmentation: 10 } },
        { text: "Deep in the comments section of a random thread.", impact: { dopamineCorruption: 15, grassDeficiency: 5 } },
        { text: "Checking an ex’s LinkedIn profile.", impact: { neuralStability: -10, dopamineCorruption: 10 } }
      ]},
      { weight: 1, title: "You sit down to watch a movie. What happens five minutes in?", options: [
        { text: "I put my phone in another room.", impact: { neuralStability: +10, attentionDecay: -5 } },
        { text: "I pause it to check Wikipedia for an actor's entire filmography.", impact: { cognitiveFragmentation: 15, attentionDecay: 10 } },
        { text: "I start scrolling and miss the entire plot.", impact: { attentionDecay: 25, dopamineCorruption: 15 } }
      ]},
      { weight: 1, title: "You have a free hour. What is the default action?", options: [
        { text: "Do something productive or relaxing.", impact: { grassDeficiency: -10, neuralStability: +5 } },
        { text: "Open an app, get bored, immediately open another app.", impact: { dopamineCorruption: 20, attentionDecay: 15 } },
        { text: "Refresh my email inbox three times for no reason.", impact: { cognitiveFragmentation: 10 } }
      ]}
    ]
  },
  '2': {
    color: 'orange',
    diagnosticMessage: 'MODERATE ATTENTION DEFICIT DETECTED',
    questions: [
      { weight: 2, title: "How many tabs are currently open on your mobile browser?", options: [
        { text: "Enough to make the browser icon change to a smiley face.", impact: { cognitiveFragmentation: 25, attentionDecay: 15 } },
        { text: "42 tabs. None emotionally closed.", impact: { neuralStability: -15, cognitiveFragmentation: 15 } },
        { text: "I don’t check. If I look, the app might crash.", impact: { grassDeficiency: 10, neuralStability: -20 } }
      ]},
      { weight: 2, title: "You are currently listening to music, but you also have a muted video playing on your laptop. Why?", options: [
        { text: "Absolute silence is terrifying.", impact: { neuralStability: -25, dopamineCorruption: 20 } },
        { text: "My brain requires two streams of input to stay calm.", impact: { attentionDecay: 30, cognitiveFragmentation: 20 } },
        { text: "I genuinely forgot it was open.", impact: { attentionDecay: 25 } }
      ]},
      { weight: 2, title: "It’s 3:00 AM. Why are you still awake?", options: [
        { text: "A 3-hour video essay on a niche controversy.", impact: { grassDeficiency: 20, dopamineCorruption: 15 } },
        { text: "I’m deep in a comment section argument.", impact: { neuralStability: -20, cognitiveFragmentation: 15 } },
        { text: "The algorithm found my specific, unaddressed insecurity.", impact: { dopamineCorruption: 30, neuralStability: -30 } }
      ]},
      { weight: 1, title: "Your weekly screen time report pops up.", options: [
        { text: "I review it to optimize my week.", impact: { neuralStability: +5, grassDeficiency: -5 } },
        { text: "I swipe it away before my brain processes the number.", impact: { grassDeficiency: 20, cognitiveFragmentation: 10 } },
        { text: "I laugh at the 11-hour daily average. It's a high score.", impact: { dopamineCorruption: 25, grassDeficiency: 30 } }
      ]},
      { weight: 1, title: "Someone sends you a 4-minute voice note.", options: [
        { text: "I listen to it immediately.", impact: { attentionDecay: -5 } },
        { text: "I listen to it on 2x speed while doing dishes.", impact: { attentionDecay: 15, dopamineCorruption: 10 } },
        { text: "I reply “omg crazy” without listening to a single second.", impact: { cognitiveFragmentation: 20, grassDeficiency: 10 } }
      ]}
    ]
  },
  '3': {
    color: 'green',
    diagnosticMessage: 'SEVERE DOPAMINE CORRUPTION DETECTED',
    questions: [
      { weight: 2, title: "You see a beautiful sunset in real life. What is your immediate thought?", options: [
        { text: "“This looks like a high-end render.”", impact: { grassDeficiency: 40, neuralStability: -20 } },
        { text: "“The graphics out here are crazy.”", impact: { grassDeficiency: 35, cognitiveFragmentation: 20 } },
        { text: "I need to take a photo to prove I was outside.", impact: { dopamineCorruption: 30, grassDeficiency: 25 } }
      ]},
      { weight: 2, title: "How does your brain process real-time, physical conversations lately?", options: [
        { text: "I catch myself looking for a 2x speed toggle on the person.", impact: { attentionDecay: 40, dopamineCorruption: 30 } },
        { text: "I genuinely feel like I need subtitles for human speech.", impact: { cognitiveFragmentation: 35, grassDeficiency: 20 } },
        { text: "I just nod along while mentally scrolling my feed.", impact: { attentionDecay: 35, neuralStability: -25 } }
      ]},
      { weight: 2, title: "Your phone screen goes black for a second and you see your own reflection. What is the vibe?", options: [
        { text: "Jumpscare.", impact: { neuralStability: -30 } },
        { text: "Total existential defeat.", impact: { neuralStability: -40, grassDeficiency: 30 } },
        { text: "I don’t recognize the person looking back.", impact: { cognitiveFragmentation: 40, grassDeficiency: 40 } }
      ]},
      { weight: 1, title: "What happens when your internet goes down for exactly 3 minutes?", options: [
        { text: "I go get a glass of water.", impact: { neuralStability: +10, grassDeficiency: -10 } },
        { text: "I toggle airplane mode repeatedly like a rat hitting a lever.", impact: { dopamineCorruption: 40, neuralStability: -30 } },
        { text: "I legitimately forget how to exist in physical space.", impact: { grassDeficiency: 50, cognitiveFragmentation: 40 } }
      ]},
      { weight: 1, title: "What does your inner monologue sound like?", options: [
        { text: "My own voice, narrating thoughts.", impact: { neuralStability: +5 } },
        { text: "A text-to-speech AI voice reading Reddit posts.", impact: { cognitiveFragmentation: 45, dopamineCorruption: 35 } },
        { text: "A chaotic mashup of trending audios overlapping each other.", impact: { attentionDecay: 40, cognitiveFragmentation: 50 } }
      ]}
    ]
  }
};

export function getWeightedRandomQuestions(pool: Question[], count: number): Question[] {
  const selected: Question[] = [];
  const available = [...pool];
  
  while (selected.length < count && available.length > 0) {
    const totalWeight = available.reduce((sum, q) => sum + (q.weight || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < available.length; i++) {
      random -= (available[i].weight || 1);
      if (random <= 0) {
        selected.push(available[i]);
        available.splice(i, 1);
        break;
      }
    }
  }
  return selected;
}

export function getAdaptiveMessage(
  profile: NeuralMetrics, 
  impact: Partial<NeuralMetrics>, 
  progressRatio: number
): string {
  const totalImpact = Object.values(impact).reduce((a, b) => Math.abs(a as number) + Math.abs(b as number), 0);
  
  // Late Stage: Cinematic, clinical, severe evaluation tone (Progress > 0.6)
  if (progressRatio > 0.6) {
    if (totalImpact > 35) {
      if (impact.cognitiveFragmentation) return "CRITICAL COGNITIVE FRAGMENTATION CONFIRMED...";
      if (impact.grassDeficiency) return "SEVERE REAL-WORLD DISCONNECT DETECTED...";
      return "DOPAMINE RECEPTORS CRITICALLY COMPROMISED...";
    }
    if (profile.attentionDecay > 50) return "ATTENTION RETENTION IN TERMINAL DECLINE...";
    if (profile.dopamineCorruption > 50) return "SEVERE EXTERNAL STIMULATION DEPENDENCY CONFIRMED...";
    if (profile.neuralStability < 50) return "NEURAL STABILITY FALLING BELOW OPERATIONAL LIMITS...";
    
    return "FINALIZING NEURAL DIAGNOSIS...";
  }
  
  // Mid Stage: More analytical, slightly concerning (Progress > 0.3)
  if (progressRatio > 0.3) {
    if (totalImpact > 25) {
      if (impact.dopamineCorruption) return "COMPULSIVE STIMULATION PATTERNS DETECTED...";
      if (impact.attentionDecay) return "ATTENTION RETENTION INSTABILITY DETECTED...";
      return "ANOMALOUS BEHAVIORAL PATTERN IDENTIFIED...";
    }
    if (profile.grassDeficiency > 30) return "OUTDOOR EXPOSURE METRICS FALLING...";
    if (profile.cognitiveFragmentation > 30) return "MULTI-STREAM THOUGHT PROCESSING DETECTED...";
    
    return "CORRELATING NEURAL RESPONSES...";
  }

  // Early Stage: Playful, humorous, internet-relatable
  if (totalImpact > 15) return "Behavior pattern noted...";
  if (impact.dopamineCorruption) return "Algorithm dependency detected...";
  if (impact.attentionDecay) return "Focus span anomaly detected...";
  if (impact.grassDeficiency) return "Screen-time overexposure logged...";

  return "CALIBRATING NEURAL BASELINE...";
}

export function getFinishingMessages(profile: NeuralMetrics): string[] {
  const msgs = ["COMPILING FINAL NEURAL PROFILE..."];
  
  if (profile.dopamineCorruption > 30) msgs.push("QUANTIFYING DOPAMINE CORRUPTION...");
  if (profile.attentionDecay > 30) msgs.push("MEASURING ATTENTION DECAY...");
  if (profile.grassDeficiency > 30) msgs.push("ISOLATING REAL-WORLD DISCONNECT...");
  if (profile.cognitiveFragmentation > 30) msgs.push("ANALYZING COGNITIVE FRAGMENTATION...");
  if (profile.neuralStability < 60) msgs.push("EVALUATING NEURAL STABILITY...");
  
  msgs.push("PREPARING NEURAL WIPE...");
  return msgs;
}

// ─── Metric Interpretation Engine ────────────────────────────────────────────

const interpretations: Record<keyof NeuralMetrics, [string, string, string]> = {
  dopamineCorruption: [
    // low (0–30)
    "Your brain still remembers how boredom works.",
    // medium (31–55)
    "You now expect stimulation during moments previously handled by thoughts.",
    // high (56+)
    "Silence now registers as a system malfunction.",
  ],
  attentionDecay: [
    "You can still complete videos longer than 90 seconds.",
    "Your focus now refreshes itself every few seconds without permission.",
    "You reach for your phone during loading screens out of pure reflex.",
  ],
  grassDeficiency: [
    "Outdoor exposure remains technically possible.",
    "Natural sunlight is becoming an occasional, increasingly surprising event.",
    "The algorithm now understands your daily routine better than the sun does.",
  ],
  neuralStability: [
    // Note: inverted — HIGH value = good → index 0 (healthy), LOW value = bad → index 2
    "Core cognitive systems remain mostly operational.",
    "Neural baseline is drifting. Minor instability detected.",
    "Your nervous system appears permanently braced for the next notification.",
  ],
  cognitiveFragmentation: [
    "You occasionally finish one task before opening another.",
    "You consume content while simultaneously searching for better content.",
    "Your thoughts now compete with each other for foreground processing.",
  ],
};

export function getMetricInterpretation(key: keyof NeuralMetrics, value: number): string {
  const tiers = interpretations[key];
  if (key === 'neuralStability') {
    // Stability is inverted — high is healthy
    if (value >= 75) return tiers[0];
    if (value >= 50) return tiers[1];
    return tiers[2];
  }
  if (value <= 30) return tiers[0];
  if (value <= 55) return tiers[1];
  return tiers[2];
}

// ─── Cinematic Exit Line Engine ───────────────────────────────────────────────

export function getExitLine(profile: NeuralMetrics): string {
  const { dopamineCorruption: dc, attentionDecay: ad, grassDeficiency: gd, cognitiveFragmentation: cf, neuralStability: ns } = profile;
  const total = dc + ad + gd + cf + Math.max(0, 100 - ns);

  // Severe cases — max impact lines
  if (total > 280) return "Patient re-released into algorithmic society. Prognosis: buffering.";
  if (dc > 65 && ad > 55) return "Further exposure to short-form content not recommended. Recommendation ignored.";
  if (ns < 35) return "Neural recovery remains theoretically possible. We have noted the theory.";
  if (gd > 65) return "Touching grass advised. Statistically, it will not happen.";
  if (cf > 60 && ad > 50) return "Case forwarded to the attention span department. They were unavailable.";
  if (dc > 55 && gd > 45) return "The outdoors will remain open. Whether you use it is unclear.";
  if (ad > 60) return "Your focus will return. We have no evidence to support this.";

  // Moderate cases — wry clinical observations
  if (total > 180) return "Patient discharged back into algorithmic society.";
  if (dc > 40) return "Dopamine pathway rehabilitation available. Enrollment requires attention spans exceeding 3 minutes.";
  if (gd > 40) return "A walk outside has been prescribed. Reception of this recommendation: unlikely.";
  if (ad > 40) return "Attention restoration possible. Estimated timeline: unclear.";
  if (cf > 40) return "Recommend closing one tab. One. Start there.";

  // Mild cases — lighter, slightly hopeful
  if (total > 80) return "Minor neural drift detected. Recovery window still open.";
  return "Neural baseline intact. Do not press your luck.";
}


export interface DiagnosisResult {
  classification: string;
  subtitle: string;
  medicalNotes: string[];
  severity: 'low' | 'moderate' | 'high' | 'critical';
  metrics: {
    label: string;
    key: keyof NeuralMetrics;
    unit: string;
    criticalThreshold: number;
    invert?: boolean; // neuralStability is "good when high"
  }[];
}

export function getDiagnosis(profile: NeuralMetrics): DiagnosisResult {
  const { dopamineCorruption: dc, attentionDecay: ad, grassDeficiency: gd, cognitiveFragmentation: cf, neuralStability: ns } = profile;
  const stabilityDamage = Math.max(0, 100 - ns);

  const scores = { dc, ad, gd, cf, stabilityDamage };
  const dominant = (Object.keys(scores) as (keyof typeof scores)[])
    .reduce((a, b) => scores[a] >= scores[b] ? a : b);

  const total = dc + ad + gd + cf + stabilityDamage;

  // ── Clinical Observations ─────────────────────────────────────────────────────
  // Curated, psychologically accurate, and emotionally recognizable
  const notes: string[] = [];

  if (dc > 40)  notes.push("Background stimulation dependency confirmed. Idle moments register as mild discomfort.");
  if (ad > 40)  notes.push("Sequential content consumption no longer operational. Parallel input now baseline.");
  if (gd > 40)  notes.push("Natural environment exposure below clinical threshold. Algorithm has replaced ecosystem.");
  if (cf > 40)  notes.push("User no longer processes single content streams. Context switching is now reflexive.");
  if (ns < 60)  notes.push("Extended silence triggers stimulation-seeking behavior. Resting state: unavailable.");
  if (dc > 25 && ad > 25) notes.push("App-switching behavior detected at sub-conscious execution speed.");
  if (gd > 30 && dc > 20) notes.push("Doomscroll pattern confirmed. Content loop replaces intentional browsing.");
  if (cf > 30)  notes.push("User consumes content while simultaneously searching for different content.");
  if (notes.length === 0) notes.push("Minor behavioral drift detected. No acute anomalies. Monitor screen time.");

  // Limit to 3 most relevant observations
  const finalNotes = notes.slice(0, 3);

  const metrics: DiagnosisResult['metrics'] = [
    { label: 'DOPAMINE CORRUPTION',     key: 'dopamineCorruption',    unit: '%', criticalThreshold: 50 },
    { label: 'ATTENTION DECAY',         key: 'attentionDecay',        unit: '%', criticalThreshold: 50 },
    { label: 'GRASS DEFICIENCY',        key: 'grassDeficiency',       unit: '%', criticalThreshold: 50 },
    { label: 'NEURAL STABILITY',        key: 'neuralStability',       unit: '%', criticalThreshold: 50, invert: true },
    { label: 'COGNITIVE FRAGMENTATION', key: 'cognitiveFragmentation', unit: '%', criticalThreshold: 50 },
  ];

  // ══════════════════════════════════════════════════════════════════════════════
  // MILD TIER  (total < 90)
  // ══════════════════════════════════════════════════════════════════════════════
  if (total < 90) {
    if (dc > 20 && ad > 20) return {
      classification: 'MILDLY NOTIFICATION CONDITIONED',
      subtitle: 'Capable of functioning offline. Requires periodic reassurance from the feed.',
      medicalNotes: finalNotes, severity: 'low', metrics,
    };
    if (gd > 20 && ns < 85) return {
      classification: 'SLIGHTLY ALGORITHM-DEPENDENT',
      subtitle: 'Feed engagement slightly exceeds offline activity. Nothing clinical. Yet.',
      medicalNotes: finalNotes, severity: 'low', metrics,
    };
    if (dominant === 'dc') return {
      classification: 'PRODUCTIVITY DRIFT DETECTED',
      subtitle: 'To-do list exists. Has not been opened today. Possibly not this week.',
      medicalNotes: finalNotes, severity: 'low', metrics,
    };
    if (dominant === 'ad') return {
      classification: 'FUNCTIONALLY ONLINE',
      subtitle: 'Attention fragmentation within technically acceptable parameters. For now.',
      medicalNotes: finalNotes, severity: 'low', metrics,
    };
    if (dominant === 'gd') return {
      classification: 'MILD REAL-WORLD AVOIDANCE',
      subtitle: 'Outdoor exposure below recommended daily levels. Phone remains primary environment.',
      medicalNotes: finalNotes, severity: 'low', metrics,
    };
    if (dominant === 'cf') return {
      classification: 'LOW-GRADE CONTEXT SWITCHING',
      subtitle: 'Occasionally starts one task before opening several others. Recognizes the pattern.',
      medicalNotes: finalNotes, severity: 'low', metrics,
    };
    return {
      classification: 'TEMPORARILY FUNCTIONAL',
      subtitle: 'Baseline neural integrity maintained. Holding together reasonably well.',
      medicalNotes: finalNotes, severity: 'low', metrics,
    };
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // MODERATE TIER  (90 ≤ total < 210)
  // ══════════════════════════════════════════════════════════════════════════════
  if (total < 210) {
    if (dc > 40 && cf > 40) return {
      classification: 'CHRONICALLY STIMULATED',
      subtitle: 'Sustained focus now requires deliberate effort and three failed attempts.',
      medicalNotes: finalNotes, severity: 'moderate', metrics,
    };
    if (ad > 40 && cf > 40) return {
      classification: 'ATTENTION SPAN COMPROMISED',
      subtitle: 'Capable of finishing tasks. Simply chooses not to, repeatedly.',
      medicalNotes: finalNotes, severity: 'moderate', metrics,
    };
    if (gd > 40 && dc > 30) return {
      classification: 'DOOMSCROLL POSITIVE',
      subtitle: 'Content loop has replaced intentional browsing. Outdoors remain theoretical.',
      medicalNotes: finalNotes, severity: 'moderate', metrics,
    };
    if (ns < 55 && ad > 30) return {
      classification: 'EMOTIONALLY BUFFERED',
      subtitle: 'Reality is processed through a content layer. Direct experience feels underproduced.',
      medicalNotes: finalNotes, severity: 'moderate', metrics,
    };
    if (dc > 50 && ad > 30) return {
      classification: 'FEED-RESPONSIVE ORGANISM',
      subtitle: 'Behavioral patterns now optimized for algorithmic delivery. Adaptation: complete.',
      medicalNotes: finalNotes, severity: 'moderate', metrics,
    };
    if (dominant === 'dc') return {
      classification: 'DOPAMINE LOOP ACTIVE',
      subtitle: 'Reward cycle has migrated from lived experience to content refresh rate.',
      medicalNotes: finalNotes, severity: 'moderate', metrics,
    };
    if (dominant === 'ad') return {
      classification: 'SUSTAINED ATTENTION FAILURE',
      subtitle: 'Long-form content is technically possible. Execution is a different matter.',
      medicalNotes: finalNotes, severity: 'moderate', metrics,
    };
    if (dominant === 'gd') return {
      classification: 'PROLONGED INDOOR PROTOCOL',
      subtitle: 'Outdoor engagement remains available. Has simply not been selected recently.',
      medicalNotes: finalNotes, severity: 'moderate', metrics,
    };
    if (dominant === 'cf') return {
      classification: 'PARALLEL PROCESSING DISORDER',
      subtitle: 'Currently watching something, reading something else, and thinking about a third thing.',
      medicalNotes: finalNotes, severity: 'moderate', metrics,
    };
    if (dominant === 'stabilityDamage') return {
      classification: 'BASELINE INSTABILITY CONFIRMED',
      subtitle: 'Neural resting state requires background stimulation to feel normal.',
      medicalNotes: finalNotes, severity: 'moderate', metrics,
    };
    return {
      classification: 'CHRONICALLY OVERSTIMULATED',
      subtitle: 'Multiple systems affected simultaneously. Prognosis under evaluation.',
      medicalNotes: finalNotes, severity: 'moderate', metrics,
    };
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // SEVERE TIER  (total ≥ 210)
  // ══════════════════════════════════════════════════════════════════════════════
  if (dc > 60 && ad > 60 && gd > 40) return {
    classification: 'HUMAN AUTOPLAY SYSTEM',
    subtitle: 'Content consumption is now fully automated. Conscious participation: optional.',
    medicalNotes: finalNotes, severity: 'critical', metrics,
  };
  if (cf > 60 && ad > 50 && ns < 40) return {
    classification: 'NEURAL SILENCE INTOLERANCE',
    subtitle: 'Quiet moments now feel like a loading error. System demands constant input.',
    medicalNotes: finalNotes, severity: 'critical', metrics,
  };
  if (gd > 60 && dc > 50) return {
    classification: 'FULLY FEED-COMPATIBLE',
    subtitle: 'Real-world input has been replaced by curated alternatives. Seamlessly.',
    medicalNotes: finalNotes, severity: 'critical', metrics,
  };
  if (cf > 60 && dc > 50) return {
    classification: 'COGNITIVE FRAGMENTATION DETECTED',
    subtitle: 'Thoughts are now queued, not sequential. Focus window: approximately 8 seconds.',
    medicalNotes: finalNotes, severity: 'critical', metrics,
  };
  if (ns < 35 && ad > 50) return {
    classification: 'REALITY BUFFERING',
    subtitle: 'Unmediated experience now feels unfinished. Content layer required to process events.',
    medicalNotes: finalNotes, severity: 'critical', metrics,
  };
  if (gd > 70) return {
    classification: 'SEVERE TOUCH-GRASS DEFICIENCY',
    subtitle: 'Real-world interface has been offline long enough to feel unfamiliar.',
    medicalNotes: finalNotes, severity: 'critical', metrics,
  };
  if (dc > 70) return {
    classification: 'TERMINAL DOPAMINE DEPENDENCY',
    subtitle: 'Reward system has been fully delegated to external content infrastructure.',
    medicalNotes: finalNotes, severity: 'critical', metrics,
  };
  if (ad > 70) return {
    classification: 'ATTENTION ARCHITECTURE COLLAPSED',
    subtitle: 'Sustained focus has been permanently subcontracted to the algorithm.',
    medicalNotes: finalNotes, severity: 'critical', metrics,
  };
  return {
    classification: 'FULLY ALGORITHM-COMPATIBLE',
    subtitle: 'Behavioral signature is now indistinguishable from content-optimized automation.',
    medicalNotes: finalNotes, severity: 'critical', metrics,
  };
}


// ─── Live Contextual Time-Aware Question Engine ───────────────────────────────

type TimeSlot = 'lateNight' | 'morning' | 'afternoon' | 'evening' | 'default';

/** Returns a formatted 12-hour time string like "4:21 PM" */
function getLiveTime(): string {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, '0');
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m} ${period}`;
}

// Templates use {time} as the live injection point
type ContextualTemplate = {
  title: (time: string) => string;
  options: { text: string; impact: Partial<NeuralMetrics> }[];
};

const contextualTemplates: Record<TimeSlot, ContextualTemplate[]> = {
  morning: [
    {
      title: t => `It's ${t}. How many apps have already opened before your brain fully loaded?`,
      options: [
        { text: "Three. One of them twice.", impact: { dopamineCorruption: 20, attentionDecay: 15 } },
        { text: "I checked one notification and lost the next 40 minutes in the process.", impact: { dopamineCorruption: 25, cognitiveFragmentation: 15 } },
        { text: "My morning routine is: alarm, scroll, guilt, repeat.", impact: { neuralStability: -20, grassDeficiency: 15 } },
      ],
    },
    {
      title: t => `It's ${t}. Be honest — did Instagram open before your curtains did?`,
      options: [
        { text: "The curtains are still closed.", impact: { grassDeficiency: 20, dopamineCorruption: 20 } },
        { text: "I checked 'just the notifications'. That was 30 minutes ago.", impact: { attentionDecay: 25, dopamineCorruption: 15 } },
        { text: "The phone is the light source in this room.", impact: { grassDeficiency: 25, neuralStability: -15 } },
      ],
    },
    {
      title: t => `It's ${t}. Your day has started. Has your attention span?`,
      options: [
        { text: "Clinically, no. Physically, I am vertical.", impact: { attentionDecay: 20, cognitiveFragmentation: 15 } },
        { text: "I tried to focus. The algorithm had other plans.", impact: { dopamineCorruption: 25, attentionDecay: 20 } },
        { text: "Attention spans are a pre-smartphone concept.", impact: { cognitiveFragmentation: 20, dopamineCorruption: 15 } },
      ],
    },
  ],
  afternoon: [
    {
      title: t => `It's ${t}. That '5 minute break' became a full side quest, didn't it?`,
      options: [
        { text: "It started with one video. I'm on episode 7 of a content rabbit hole.", impact: { attentionDecay: 25, dopamineCorruption: 20 } },
        { text: "I opened a document. Then I opened Instagram. The document is still open.", impact: { cognitiveFragmentation: 25, attentionDecay: 15 } },
        { text: "The break is the work now. Productivity is a myth I visit occasionally.", impact: { grassDeficiency: 20, dopamineCorruption: 20 } },
      ],
    },
    {
      title: t => `It's ${t}. The productivity window was open earlier. What happened to it?`,
      options: [
        { text: "It was open briefly. I scrolled past it.", impact: { attentionDecay: 20, dopamineCorruption: 25 } },
        { text: "YouTube said 'one more video'. YouTube lied.", impact: { dopamineCorruption: 30, attentionDecay: 20 } },
        { text: "Productivity is theoretical. I am in research mode.", impact: { grassDeficiency: 15, cognitiveFragmentation: 20 } },
      ],
    },
    {
      title: t => `It's ${t}. You opened YouTube for one video. Explain the current situation.`,
      options: [
        { text: "There are now 12 tabs open. None are the original video.", impact: { cognitiveFragmentation: 30, attentionDecay: 20 } },
        { text: "I'm watching a documentary on a topic I had zero interest in 3 hours ago.", impact: { dopamineCorruption: 25, grassDeficiency: 15 } },
        { text: "The algorithm understood me better than I understood myself.", impact: { dopamineCorruption: 30, neuralStability: -20 } },
      ],
    },
  ],
  evening: [
    {
      title: t => `It's ${t}. You said you'd sleep early tonight.`,
      options: [
        { text: "I said a lot of things. Pre-9PM me was optimistic.", impact: { dopamineCorruption: 20, grassDeficiency: 20 } },
        { text: "Sleep early is still technically possible. Probably.", impact: { attentionDecay: 20, dopamineCorruption: 15 } },
        { text: "The scroll must continue until I find something worth stopping for.", impact: { dopamineCorruption: 30, neuralStability: -20 } },
      ],
    },
    {
      title: t => `It's ${t}. Your thumb is still scrolling like it's on payroll.`,
      options: [
        { text: "It has operated independently for approximately two hours.", impact: { attentionDecay: 25, dopamineCorruption: 25 } },
        { text: "The scrolling is automatic. I'm just the host.", impact: { cognitiveFragmentation: 25, dopamineCorruption: 20 } },
        { text: "I put the phone down three times. It came back to me.", impact: { dopamineCorruption: 30, neuralStability: -15 } },
      ],
    },
    {
      title: t => `It's ${t}. Do you actually remember experiencing today?`,
      options: [
        { text: "Most of it was content. I believe I was present.", impact: { cognitiveFragmentation: 20, grassDeficiency: 25 } },
        { text: "I had a plan. It did not survive contact with my phone.", impact: { attentionDecay: 20, dopamineCorruption: 20 } },
        { text: "Time is passing. I am watching it from inside a screen.", impact: { neuralStability: -25, grassDeficiency: 30 } },
      ],
    },
  ],
  lateNight: [
    {
      title: t => `It's ${t}. Why are you still negotiating with the algorithm?`,
      options: [
        { text: "I told myself 'five more minutes' approximately six times.", impact: { dopamineCorruption: 20, attentionDecay: 15 } },
        { text: "The algorithm found something I did not consent to caring about.", impact: { dopamineCorruption: 30, neuralStability: -20 } },
        { text: "Sleep felt optional. The content did not.", impact: { grassDeficiency: 25, dopamineCorruption: 25 } },
      ],
    },
    {
      title: t => `It's ${t}. Your ancestors survived predators for this?`,
      options: [
        { text: "They would not understand. The engagement metrics are different now.", impact: { cognitiveFragmentation: 25, grassDeficiency: 20 } },
        { text: "I am the apex predator of the comment section.", impact: { dopamineCorruption: 25, neuralStability: -15 } },
        { text: "I cannot explain this to them or to myself.", impact: { cognitiveFragmentation: 20, attentionDecay: 20 } },
      ],
    },
    {
      title: t => `It's ${t}. The room is silent. Why is your brain still buffering?`,
      options: [
        { text: "It absorbed too many inputs today and has not finished processing.", impact: { cognitiveFragmentation: 30, attentionDecay: 20 } },
        { text: "One more scroll and I'll definitely be able to sleep.", impact: { dopamineCorruption: 30, neuralStability: -20 } },
        { text: "Sleep is the next tab. I'll get to it eventually.", impact: { grassDeficiency: 20, dopamineCorruption: 25 } },
      ],
    },
  ],
  default: [
    {
      title: t => `It's ${t}. Right now — how many other tabs or apps are also open?`,
      options: [
        { text: "Enough that this one required a conscious decision to focus on.", impact: { cognitiveFragmentation: 20, attentionDecay: 15 } },
        { text: "I am not checking. The number has historically been alarming.", impact: { dopamineCorruption: 20, cognitiveFragmentation: 15 } },
        { text: "The tabs are open. They are watching. We coexist.", impact: { attentionDecay: 25, neuralStability: -10 } },
      ],
    },
  ],
};

export function getContextualQuestion(): Question {
  const now = new Date();
  const hour = now.getHours();
  const time = getLiveTime();

  let slot: TimeSlot;
  if (hour >= 0 && hour < 4)        slot = 'lateNight';
  else if (hour >= 6 && hour < 10)  slot = 'morning';
  else if (hour >= 12 && hour < 17) slot = 'afternoon';
  else if (hour >= 19 && hour < 24) slot = 'evening';
  else                               slot = 'default';

  const pool = contextualTemplates[slot];

  // Weighted random pick
  const totalWeight = pool.length; // all equal weight in templates
  const picked = pool[Math.floor(Math.random() * totalWeight)];

  return {
    weight: 3, // always prioritise rendering-wise
    title: picked.title(time),
    options: picked.options,
  };
}


