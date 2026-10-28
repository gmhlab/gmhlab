/**
 * Hero background photographs. The home, projects, publications and contact
 * heroes are GW's own (below); every other one is a **demo placeholder**, not
 * a Center asset. Swap each for a Center photograph (or a local file in this
 * app) before the site goes live.
 *
 * Lorem Picsum serves one fixed photo per numeric id or seed, so these URLs
 * are stable rather than random, but they are stock imagery and they make the
 * pages depend on a third-party host at runtime. The team photo is "Diverse
 * team collaborates around a table in office" by Vitaly Gariev, free under
 * the Unsplash License (unsplash.com/photos/fm4B1xWEIsU) — stock people, so it
 * must never be captioned as, or placed beside the name of, anyone at the
 * Center.
 *
 * The blocks render them decoratively (empty alt) through the brand duotone
 * and a surface wash, under each hero's graphics-kit motif — which is why a
 * placeholder's subject barely matters. A real photograph will matter more:
 * pick one with its subject on the right, where the wash is lightest.
 */

/*
 * GW's own photographs, from the university photo archive. Each is shipped
 * from `public/heroes/` resized to 1920px wide at JPEG quality 50 with `sips`,
 * with no other edit unless noted: it is only ever seen through the duotone
 * and the wash, which hide the compression. Originals are not kept in the repo.
 */

/** Professors Gate in autumn — `Campus-Fall-UP-JMC-2012-9731.jpg` (Jessica
 *  McConnell Burt, 2012, © The George Washington University). The top 50px
 *  (at 1920 wide) are cropped off so the GW book sits at the hero's top. */
export const HOME_HERO_IMAGE = "/heroes/professors-gate.jpg";
/** Kogan Plaza's gazebo through cherry blossom — `Campus_2021_WLA-7028.jpg`
 *  (William Atkins, 14 April 2021, © The George Washington University). */
export const PROJECTS_HERO_IMAGE = "/heroes/kogan-plaza-blossom.jpg";
/** A campus rotunda's "George Washington University" frieze, looking up —
 *  `Campus_2024_WLA_DSCF0072.RAF36558.jpg` (William Atkins, 12 January 2024;
 *  the file carries no copyright field). */
export const PUBLICATIONS_HERO_IMAGE = "/heroes/gw-rotunda.jpg";
/** The campus bust of George Washington in profile —
 *  `George_Bust_2018_WLA-2-3.jpg` (William Atkins, 20 November 2018,
 *  © The George Washington University). */
export const CONTACT_HERO_IMAGE = "/heroes/washington-bust.jpg";
export const INNOVATIONS_HERO_IMAGE = "https://picsum.photos/id/36/1920/1080";
export const TEAM_HERO_IMAGE =
  "https://images.unsplash.com/photo-1758873269276-9518d0cb4a0b?fm=jpg&q=70&w=1920&fit=crop";
export const RESHAPE_HERO_IMAGE =
  "https://picsum.photos/seed/gw-reshape/1920/1080";
export const EQUIP_HERO_IMAGE = "https://picsum.photos/seed/gw-equip/1920/1080";
