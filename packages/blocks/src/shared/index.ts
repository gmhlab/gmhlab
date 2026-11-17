/* Copy contracts shared by the page blocks, and the GW Center's default copy
 * (gmh-copy.ts). The CTA section that renders them is internal (page-cta.tsx).
 * The lit language — the workspace's look, shared with the public pages — is
 * lit.{tsx,css} and ornaments.tsx. */
export * from "./page-copy"
export * from "./gmh-copy"
export {
  ArtTile,
  type ArtTone,
  Aurora,
  CountUp,
  type LitArt,
  Panel,
  TiltCard,
  toneAt,
  useLitReveal,
} from "./lit"
export * from "./ornaments"
