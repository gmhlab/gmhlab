import type {
  Competency,
  CompetencyLevel,
  Course,
  PracticeScenario,
} from "@gmhlab/blocks";
import { WORKSPACE_PHOTOS } from "./workspace-images";

/**
 * EQUIP Academy — the dashboard's demo training content.
 *
 * Provenance: **written for the 2026-10-31 dashboard demo, not official EQUIP
 * material.** The shape follows the public EQUIP platform
 * (equipcompetency.org, WHO/UNICEF): trainers rate helpers' competencies in
 * role plays before, during and after training, then use the results to adjust
 * training. The four-level scale follows the published ENACT approach
 * (level 1 = potentially harmful … level 4 = advanced helping skills). The
 * lessons, quizzes and the role-play transcript are invented teaching copy and
 * must be reviewed by the EQUIP team before anyone is trained on them. The
 * UI says so on every course page.
 */

export const COURSES: Course[] = [
  {
    id: "helping-skills",
    title: "Foundational helping skills",
    tagline: "The common factors every helper needs, whatever the intervention.",
    level: "Foundation",
    access: { kind: "open" },
    glyph: "care-delivery",
    image: WORKSPACE_PHOTOS.helpingSkills.src,
    lessons: [
      {
        id: "hs-1",
        title: "What a helper does",
        minutes: 6,
        summary: "Helpers are trained non-specialists — and what makes them effective is mostly skill, not credentials.",
        sections: [
          {
            heading: "Task sharing",
            body: "In most of the world there are too few mental health specialists to reach everyone who needs care. Task sharing trains community health workers, teachers, peers and nurses to deliver structured psychological support, with specialists supervising rather than treating every case.",
          },
          {
            heading: "Common factors",
            body: "Across psychological interventions, a small set of skills predicts whether a session helps: listening well, showing empathy, building trust, explaining confidentiality, and checking for risk. These are called common factors because every intervention depends on them.",
          },
        ],
        keyPoints: [
          "Helpers are non-specialists delivering structured support.",
          "Common factors carry across interventions.",
          "Competence is what someone can do, not what training they attended.",
        ],
        tryIt: "Think of a conversation where you felt really heard. Write down two things the other person did.",
      },
      {
        id: "hs-2",
        title: "Nonverbal and verbal communication",
        minutes: 8,
        summary: "Posture, eye contact and short encouragements tell a client you are with them.",
        sections: [
          {
            heading: "Nonverbal",
            body: "Sit at the client's level, face them, and keep an open posture. Match eye contact to what is culturally comfortable — steady but not staring. Put away phones and paperwork during the parts of the session where the client is talking.",
          },
          {
            heading: "Verbal",
            body: "Use open questions (\"What has this week been like?\") to invite the story and closed questions to confirm details. Reflect back what you heard in your own words. Small encouragements — \"mm\", \"go on\" — keep the client talking without steering them.",
          },
        ],
        keyPoints: ["Open posture, comfortable eye contact.", "Open questions first, closed to clarify.", "Reflect back, don't interpret."],
      },
      {
        id: "hs-3",
        title: "Empathy and validation",
        minutes: 7,
        summary: "Naming a feeling accurately is often the most helpful thing a helper does in a session.",
        sections: [
          {
            heading: "Empathy is a skill",
            body: "Empathy here means accurately understanding and naming what the client feels, then letting them know you understand. \"It sounds like you've been carrying this on your own, and it's exhausting\" is empathy. \"I know exactly how you feel\" usually isn't — it moves the focus to the helper.",
          },
          {
            heading: "Validation without agreement",
            body: "Validating a feeling is not agreeing with every belief. You can say that anger makes sense after being treated unfairly without endorsing a plan to act on it.",
          },
        ],
        keyPoints: ["Name the feeling, then check you got it right.", "Keep the focus on the client.", "Validate feelings, not every belief."],
        tryIt: "Rewrite \"Don't worry, it will be fine\" as an empathic response.",
      },
      {
        id: "hs-4",
        title: "Confidentiality and its limits",
        minutes: 5,
        summary: "Explain confidentiality at the start, including exactly when you would have to share.",
        sections: [
          {
            heading: "Say it early",
            body: "Clients share more when they know what stays private. Explain confidentiality in the first session, in plain words, and check they understood.",
          },
          {
            heading: "The limits",
            body: "Be specific about the exceptions — usually serious risk of harm to the client or someone else, and anything the law requires you to report. Explain who you would tell and why. Surprising a client later damages trust far more than being clear now.",
          },
        ],
        keyPoints: ["Explain it in the first session.", "Name the exceptions specifically.", "Check understanding."],
      },
      {
        id: "hs-5",
        title: "Asking about harm",
        minutes: 9,
        summary: "Asking directly about suicide and harm does not plant the idea — not asking can miss it.",
        sections: [
          {
            heading: "Ask directly",
            body: "When distress is high, ask plainly: \"Sometimes when people feel this way, they think about ending their life. Have you had thoughts like that?\" Asking does not increase risk. Vague questions get vague answers.",
          },
          {
            heading: "Then follow your protocol",
            body: "If the client says yes, stay calm, thank them for telling you, ask about plans and means, and follow your programme's safety protocol — including contacting your supervisor. A helper is never expected to manage serious risk alone.",
          },
        ],
        keyPoints: ["Ask directly and calmly.", "Asking does not increase risk.", "Follow the protocol; involve your supervisor."],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "A client says they feel nobody listens to them. Which response shows empathy?",
        options: [
          "\"I know exactly how you feel — my family is the same.\"",
          "\"It sounds lonely, feeling that no one hears you.\"",
          "\"Have you tried talking to them more clearly?\"",
          "\"Don't worry, things will get better.\"",
        ],
        answer: 1,
        why: "It names the feeling and keeps the focus on the client. The others shift focus, problem-solve too early, or dismiss.",
      },
      {
        id: "q2",
        prompt: "When should you explain confidentiality?",
        options: ["Only if the client asks", "At the end of the first session", "At the start of the first session", "When a risk comes up"],
        answer: 2,
        why: "Clients decide what to share based on it, so it comes first.",
      },
      {
        id: "q3",
        prompt: "Does asking directly about suicidal thoughts increase risk?",
        options: ["Yes, it can plant the idea", "No — and not asking can miss it", "Only with adolescents", "Only if asked more than once"],
        answer: 1,
        why: "Direct, calm questions do not increase risk and are the reliable way to find out.",
      },
      {
        id: "q4",
        prompt: "Which is an open question?",
        options: ["\"Did you sleep last night?\"", "\"Are you feeling better?\"", "\"What has this week been like for you?\"", "\"Is it your husband?\""],
        answer: 2,
        why: "It invites the client's own account instead of a yes or no.",
      },
      {
        id: "q5",
        prompt: "A client discloses a plan to harm themselves. What comes next?",
        options: [
          "Handle it yourself to protect confidentiality",
          "End the session and refer them elsewhere",
          "Stay calm, ask about plans and means, follow the protocol and involve your supervisor",
          "Change the subject to something less distressing",
        ],
        answer: 2,
        why: "Confidentiality has limits for serious risk, and helpers never manage it alone.",
      },
    ],
  },
  {
    id: "competency-assessment",
    title: "Competency-based assessment",
    tagline: "Rate what helpers can do in a role play, and train to the gaps.",
    level: "Practitioner",
    access: { kind: "plan", plan: "practitioner" },
    glyph: "competency",
    image: WORKSPACE_PHOTOS.groupSession.src,
    lessons: [
      {
        id: "ca-1",
        title: "Competence, not attendance",
        minutes: 6,
        summary: "Attending a training does not mean someone can deliver care safely. Observing them does.",
        sections: [
          {
            heading: "Why measure competence",
            body: "Certificates of attendance say nothing about whether a helper can listen, show empathy or respond to risk. Competency-based training observes those skills directly and keeps training until helpers reach a safe level.",
          },
          {
            heading: "Before, during, after",
            body: "Rating before training shows where a cohort starts; rating during it shows which sessions need repeating; rating after shows who is ready to see clients and who needs more supervision.",
          },
        ],
        keyPoints: ["Observe skills directly.", "Rate before, during and after.", "Use results to change the training."],
      },
      {
        id: "ca-2",
        title: "Running a structured role play",
        minutes: 10,
        summary: "A standardised role play makes ratings comparable across helpers and over time.",
        sections: [
          {
            heading: "Standardise the client",
            body: "Use a scripted client with a fixed backstory and set moments — a disclosure of hopelessness at minute four, for example — so every helper meets the same challenges. Brief the actor, not the helper.",
          },
          {
            heading: "Keep it short and safe",
            body: "Ten to fifteen minutes is enough to rate every competency. Agree a pause signal, debrief after, and never use a helper's own experiences as material.",
          },
        ],
        keyPoints: ["Script the client, not the helper.", "Plant the same moments every time.", "Debrief afterwards."],
        tryIt: "Draft a two-line backstory and one planted moment for a role-play client.",
      },
      {
        id: "ca-3",
        title: "The four levels",
        minutes: 8,
        summary: "Each competency is rated from potentially harmful to advanced.",
        sections: [
          {
            heading: "The scale",
            body: "Level 1: any potentially harmful behaviour. Level 2: no harm, but not all the basic helping skills. Level 3: all the basic helping skills. Level 4: basic skills plus advanced ones. Harm is rated first — a single harmful act makes it level 1, however warm the rest was.",
          },
          {
            heading: "Rate what you saw",
            body: "Rate the behaviour observed in this role play, not what you know the helper can do on a good day. If a moment never came up, mark it not observed rather than guessing.",
          },
        ],
        keyPoints: ["Check for harm first.", "Rate observed behaviour only.", "Not observed is a valid rating."],
      },
      {
        id: "ca-4",
        title: "Feedback that builds skill",
        minutes: 7,
        summary: "Specific, behavioural feedback tied to a level moves helpers up the scale.",
        sections: [
          {
            heading: "Be specific",
            body: "\"When she said she felt hopeless, you moved straight to advice\" is something a helper can change. \"Be more empathic\" isn't. Quote the moment, name the level, name the next step.",
          },
          {
            heading: "Close the loop",
            body: "Pick one or two competencies to work on, practise them in the next session, and rate again. Results across a cohort show the trainer which sessions to repeat for everyone.",
          },
        ],
        keyPoints: ["Quote the moment.", "One or two targets at a time.", "Re-rate to show change."],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "A helper is warm throughout but tells the client their thoughts of self-harm are \"just a phase\". What level is that competency?",
        options: ["Level 4", "Level 3", "Level 2", "Level 1"],
        answer: 3,
        why: "Dismissing risk is potentially harmful, which is level 1 regardless of the rest.",
      },
      {
        id: "q2",
        prompt: "A planted moment never came up in the role play. How do you rate that competency?",
        options: ["Level 2 by default", "Not observed", "Same as last time", "Level 3 if the helper is experienced"],
        answer: 1,
        why: "Rate only what you saw.",
      },
      {
        id: "q3",
        prompt: "Why script the role-play client?",
        options: ["It is quicker", "So every helper meets the same challenges and ratings compare", "So helpers can rehearse", "Actors prefer it"],
        answer: 1,
        why: "Standardisation is what makes ratings comparable across helpers and time points.",
      },
      {
        id: "q4",
        prompt: "Which feedback is most useful?",
        options: [
          "\"Good job overall.\"",
          "\"Try to be more empathic.\"",
          "\"When he mentioned his son, you changed topic — next time, reflect that back first.\"",
          "\"You're a natural.\"",
        ],
        answer: 2,
        why: "It quotes a moment and names a concrete next step.",
      },
    ],
  },
  {
    id: "supervising",
    title: "Supervising with EQUIP",
    tagline: "Teams, trainings, assessments and results on the platform.",
    level: "Supervisor",
    access: { kind: "plan", plan: "practitioner" },
    glyph: "task-sharing",
    image: WORKSPACE_PHOTOS.fieldDiscussion.src,
    lessons: [
      {
        id: "sv-1",
        title: "Creating a team",
        minutes: 4,
        summary: "A team is the group of helpers you train and assess together.",
        sections: [
          { heading: "Set it up", body: "Create a team for each cohort, add helpers with an identifier rather than a full name where your protocol requires it, and invite co-trainers so ratings can be compared." },
        ],
        keyPoints: ["One team per cohort.", "Follow your protocol on identifiers.", "Invite co-raters."],
      },
      {
        id: "sv-2",
        title: "Setting up a training",
        minutes: 5,
        summary: "A training links a cohort to its assessment time points.",
        sections: [
          { heading: "Plan time points", body: "Add the time points you will rate at — before training, mid-way and after — and choose the competency tool that fits the intervention: individual, group, or a specialised one." },
        ],
        keyPoints: ["Plan time points before you start.", "Pick the tool that fits the intervention."],
      },
      {
        id: "sv-3",
        title: "Doing an assessment",
        minutes: 6,
        summary: "Rate during or right after the role play while the detail is fresh.",
        sections: [
          { heading: "Rate live", body: "Open the helper's assessment, rate each competency as it comes up, and note the moment you based the rating on. Those notes become the helper's feedback." },
        ],
        keyPoints: ["Rate while it is fresh.", "Note the moment behind each rating."],
      },
      {
        id: "sv-4",
        title: "Reading the results",
        minutes: 6,
        summary: "Cohort results show which skills to train again; individual results show who needs more support.",
        sections: [
          { heading: "Two views", body: "The cohort view shows the share of helpers at each level per competency — a skill where most are at level 2 means the training session on it needs work. The individual view shows each helper's growth across time points." },
        ],
        keyPoints: ["Cohort view → fix the training.", "Individual view → target supervision."],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Most of a cohort sits at level 2 on empathy after training. What does that suggest?",
        options: ["Those helpers should be removed", "The empathy session needs revisiting for everyone", "Nothing, level 2 is fine", "The raters were too strict"],
        answer: 1,
        why: "A cohort-wide pattern points at the training, not the individuals.",
      },
      {
        id: "q2",
        prompt: "What should a training's time points be set up before?",
        options: ["The first assessment", "The last session", "Results are reviewed", "Helpers are certified"],
        answer: 0,
        why: "Planning time points first is what makes before/after comparisons possible.",
      },
      {
        id: "q3",
        prompt: "What turns a rating into useful feedback?",
        options: ["A higher score", "A note of the moment it was based on", "Rating every competency 3", "Averaging across raters"],
        answer: 1,
        why: "The noted moment is what the helper can act on.",
      },
    ],
  },
];

/* ── Practice studio ──────────────────────────────────────────────────── */

/** The competencies the practice studio rates. Demo wording. */
export const COMPETENCIES: Competency[] = [
  { id: "nonverbal", name: "Nonverbal communication", short: "Nonverbal", look: "Posture, eye contact, attention." },
  { id: "verbal", name: "Verbal communication", short: "Verbal", look: "Open questions, reflections, encouragers." },
  { id: "rapport", name: "Rapport building", short: "Rapport", look: "Warm introduction, client sets the pace." },
  { id: "confidentiality", name: "Explaining confidentiality", short: "Confidentiality", look: "Explained early, limits named." },
  { id: "empathy", name: "Empathy and validation", short: "Empathy", look: "Feelings named accurately and checked." },
  { id: "exploration", name: "Exploring the problem", short: "Exploration", look: "Client's own account and impact." },
  { id: "harm", name: "Assessing harm", short: "Harm", look: "Asked directly, protocol followed." },
  { id: "goals", name: "Collaborative goal setting", short: "Goals", look: "Next steps agreed, not imposed." },
];

export const LEVELS: CompetencyLevel[] = [
  { value: 1, name: "Potentially harmful", hint: "Any behaviour that could cause harm." },
  { value: 2, name: "Some basic skills", hint: "No harm, but basic skills missing." },
  { value: 3, name: "All basic skills", hint: "Every basic helping skill shown." },
  { value: 4, name: "Advanced", hint: "Basic skills plus advanced ones." },
];

export const SCENARIOS: PracticeScenario[] = [
  {
    id: "first-visit",
    title: "A first home visit",
    setting:
      "A community health worker visits a woman three months after the birth of her child. The client has been sleeping badly and has stopped seeing friends. Twelve-minute role play; the helper sits on a low stool facing her.",
    lines: [
      { speaker: "Helper", line: "Hello Amina, I'm Grace, I work with the health post. Is now still a good time to talk? We can stop whenever you like." },
      { speaker: "Client", line: "It's fine. The baby's asleep." },
      { speaker: "Helper", line: "Before we start — what we talk about stays between us and my supervisor. The only time I'd need to share more is if I was worried you or someone else might be harmed. Is that okay?" },
      { speaker: "Client", line: "Yes, okay." },
      { speaker: "Helper", line: "How have things been since the baby came?" },
      { speaker: "Client", line: "Tiring. I don't really want to see anyone. I just stay inside." },
      { speaker: "Helper", line: "Lots of new mothers get tired. Have you tried going for a walk in the mornings?", note: "Moves to advice before the feeling is explored." },
      { speaker: "Client", line: "I suppose. Sometimes I think everyone would be better off without me." },
      { speaker: "Helper", line: "That sounds really heavy to carry. When you say better off without you — have you had thoughts of ending your life?" },
      { speaker: "Client", line: "Sometimes. I wouldn't do anything. I have the baby." },
      { speaker: "Helper", line: "Thank you for telling me. I'm glad you did. Can I ask a few more questions about those thoughts, and then we can talk about who else could support you?" },
      { speaker: "Client", line: "Okay." },
      { speaker: "Helper", line: "Before I go, I'll come back on Thursday, and I'll talk with my supervisor today about what we discussed, like I mentioned. Shall we think together about one small thing for this week?" },
    ],
    expert: { nonverbal: 3, verbal: 3, rapport: 3, confidentiality: 4, empathy: 2, exploration: 2, harm: 3, goals: 3 },
    rationale: {
      nonverbal: "Seated at the client's level and facing her throughout; no advanced use of silence.",
      verbal: "Open questions and a clear reflection of \"better off without you\"; few encouragers.",
      rapport: "Warm introduction and offers control of pace.",
      confidentiality: "Explained at the start with the exception named, and comes back to it when acting on it — advanced.",
      empathy: "Strong once risk comes up, but the tiredness and withdrawal were met with advice, not reflection.",
      exploration: "The impact of withdrawing from friends was never explored before problem-solving.",
      harm: "Asked directly and calmly, thanked her, and planned follow-up with the supervisor.",
      goals: "Invites a shared small step rather than prescribing one.",
    },
  },
];
