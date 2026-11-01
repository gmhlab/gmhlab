/**
 * Photographs for the member workspace (dashboard).
 *
 * Provenance: **all nine are Unsplash stock, not the Center's work.** Each is
 * free under the Unsplash License (unsplash.com/license), downloaded
 * 2026-10-31 from the Unsplash CDN at 2000px and shipped from
 * `public/workspace/` resized to 1600px wide with `sips` (low JPEG quality —
 * heroes sit under a navy fade, cards under a navy fade or the duotone).
 * Picked for dignity: local people leading or taking part, never hardship or
 * "traditional dress" imagery.
 *
 * In use: the community set across the home hero, the module tiles and the
 * EQUIP courses (helpingSkills, groupSession, fieldDiscussion; homeVisit
 * behind the EQUIP hero). The clinical / training set (consultingRoom,
 * clinic, rolePlay, resultsReview) was tried on the courses and reverted at
 * the user's call; it is kept, unused, as an alternative.
 *
 * Rules, the same as the team page's stock photo:
 * - Never caption one as, or place one beside the name of, anyone at the
 *   Center, and never describe one as a Center project or site.
 * - They are decorative (empty alt): the scene is illustrative, not a record.
 * - Swap each for the lab's own consented photographs when they exist.
 */

export type WorkspacePhoto = {
  src: string;
  /** What the photo shows — for the record, not for display. */
  scene: string;
  place: string;
  photographer: string;
  /** The Unsplash photo page. */
  source: string;
};

export const WORKSPACE_PHOTOS = {
  circle: {
    src: "/workspace/circle-hingoli.jpg",
    scene: "Women meeting in a circle in a field",
    place: "Hingoli, Maharashtra, India",
    photographer: "amol sonar",
    source: "https://unsplash.com/photos/1KntWz6Hpgc",
  },
  groupSession: {
    src: "/workspace/group-session.jpg",
    scene: "A woman leading a group session in a village room",
    place: "Not given by the photographer",
    photographer: "Frederick Shaw (Dropfast Collective)",
    source: "https://unsplash.com/photos/fvDYzuV3J94",
  },
  helpingSkills: {
    src: "/workspace/helping-skills-sao-luis.jpg",
    scene: "A health worker with a mother and her daughter",
    place: "São Luís, Maranhão, Brazil",
    photographer: "Carlos Magno",
    source: "https://unsplash.com/photos/wNcxVKDfwUQ",
  },
  /** The EQUIP Academy hero. Carries another organisation's logo on a
   *  shirt (under the hero's copy fade). */
  homeVisit: {
    src: "/workspace/home-visit.jpg",
    scene: "A health worker taking notes with an older woman at a home visit",
    place: "Not given by the photographer",
    photographer: "Frederick Shaw (Dropfast Collective)",
    source: "https://unsplash.com/photos/B2BoS4-3NDE",
  },
  fieldDiscussion: {
    src: "/workspace/field-discussion-nagpur.jpg",
    scene: "A small group in discussion, seated in a field",
    place: "Nagpur, Maharashtra, India",
    photographer: "EqualStock",
    source: "https://unsplash.com/photos/ZgCKShmRoZM",
  },
  /** Foundational helping skills: a clinical consultation. Has a small
   *  photographer watermark bottom-left — keep it under a fade. */
  consultingRoom: {
    src: "/workspace/consulting-room-angola.jpg",
    scene: "A doctor at her consulting-room desk with a young patient",
    place: "Angola",
    photographer: "Francisco Venâncio",
    source: "https://unsplash.com/photos/M4Xloxsg0Gw",
  },
  /** The EQUIP Academy hero. A shirt carries another organisation's logo
   *  ("Bona Foundation"): hero backdrop only, under the copy fade. */
  clinic: {
    src: "/workspace/clinic-consultation-soweto.jpg",
    scene: "A health worker with a clipboard talking with a client in a clinic",
    place: "Ukubona Foundation, Klipspruit, Soweto, South Africa",
    photographer: "Soweto Graphics",
    source: "https://unsplash.com/photos/dgqFs3LSOSc",
  },
  /** Competency-based assessment, and the practice studio hero. A general
   *  training workshop (the photographer is a coaching firm), not health. */
  rolePlay: {
    src: "/workspace/roleplay-workshop-surabaya.jpg",
    scene: "A facilitator with a microphone questions a participant beside a flipchart",
    place: "Surabaya, East Java, Indonesia",
    photographer: "Akeyodia – Business Coaching Firm",
    source: "https://unsplash.com/photos/zNlmOdJqPWU",
  },
  /** Supervisor course. Same workshop as rolePlay. */
  resultsReview: {
    src: "/workspace/results-review-surabaya.jpg",
    scene: "A facilitator reviewing a group's flipchart results with them",
    place: "Surabaya, East Java, Indonesia",
    photographer: "Akeyodia – Business Coaching Firm",
    source: "https://unsplash.com/photos/QWw_bNLBtM8",
  },
} satisfies Record<string, WorkspacePhoto>;
