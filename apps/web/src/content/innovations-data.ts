/**
 * The GW Center for Global Mental Health innovations index — the tools,
 * platforms and instrument sets the Center builds and hands to other people,
 * as distinct from the studies in `./projects-data`.
 *
 * The shape these are written against (`Innovation`) lives in `@gmhlab/blocks`.
 *
 * `slug` is the last segment of the detail-page href. Only slugs present in
 * `INNOVATION_DETAIL_SLUGS` (`./innovation-detail-data`) render as links — the
 * other three have no detail record yet, and linking them would ship 404s.
 */

import type { Innovation } from "@gmhlab/blocks";

export const INNOVATIONS: Innovation[] = [
  {
    slug: "equip",
    glyph: "competency",
    logo: "/projects/equip.png",
    status: "WHO/UNICEF Partnership",
    statusTone: "info",
    heading: "EQUIP Platform",
    body: "Competency-based training and supervision system for non-specialist mental health providers. Standardizes quality assessment across diverse healthcare settings.",
    reach: "36+ countries",
    publications: "12 publications",
  },
  {
    slug: "passive-sensing",
    glyph: "sensing",
    status: "In Development",
    statusTone: "warning",
    heading: "Passive Sensing Technology",
    body: "Smartphone-based behavioral monitoring that uses GPS, accelerometer, and usage patterns to personalize depression interventions for new mothers.",
    reach: "Nepal",
    publications: "3 publications",
  },
  {
    slug: "validated-assessment-tools",
    glyph: "measurement",
    status: "Active",
    statusTone: "success",
    heading: "Validated Assessment Tools",
    body: "Culturally adapted and psychometrically validated mental health screening instruments (PHQ-9, GAD-7, EPDS) for use in LMIC contexts.",
    reach: "8+ countries",
    publications: "6 publications",
  },
  {
    slug: "reshape-stigma-toolkit",
    glyph: "stigma",
    status: "Active",
    statusTone: "success",
    heading: "RESHAPE Stigma Toolkit",
    body: "Evidence-based interventions combining social contact, education, and skills training to reduce mental health stigma among healthcare providers.",
    reach: "Nepal, Ethiopia, India",
    publications: "5 publications",
  },
];

/** Funders and implementing partners named across the innovation pages. */
export const INNOVATION_PARTNERS = [
  "WHO",
  "UNICEF",
  "NIMH",
  "World Bank",
  "Carter Center",
];

