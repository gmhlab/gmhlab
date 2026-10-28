/**
 * The GW Center for Global Mental Health team.
 *
 * Sourced from the Center's live team page (gwglobalmentalhealth.com/team) and
 * the sixteen staff profiles it links, captured 2026-10-19. Bios are the
 * profiles' own text, with three kinds of mechanical cleanup only: Wix
 * line-break artifacts joined ("Ruta Range" + "l"), bullet lists run into a
 * sentence (Byanjankar), and inline links moved into `links` (Hamdani's
 * "accessed here" NCBI link and bare URL). One typo fixed: "and the The
 * Lancet Commission" (Kohrt). Headshots are the originals behind the team
 * page, resized to 400px, in `public/team/<slug>.jpg`.
 *
 * Corrections made against the live page, each from the person's own profile:
 *
 *   - "Georgia Elefteriou" → **Eleftheriou** (profile heading and URL slug).
 *   - "Kamal Guatam" (profile heading and URL) → **Gautam** (team card and the
 *     bio's own first line).
 *   - "Chneyre Best" (profile heading) → **Chynere** (team card and bio).
 *   - Dristy Gurung's credentials rendered as "Dristy Gurung MSc," with "PhD"
 *     on a separate line; the profile gives **MSc, PhD**.
 *
 * Deliberately left out, rather than guessed:
 *
 *   - **The alumni photos.** All eight are Wix library images (`11062b_…` is
 *     Wix's stock account; the others are its free-photo set), not the alumni
 *     — one is filed as "Male Student" on Gloria Pedersen. Alumni render an
 *     initials monogram until real headshots exist.
 *   - **Anna Viduani's "PhD".** Her profile says she is a Ph.D. candidate who
 *     *completed* a predoctoral fellowship, so neither the degree nor the
 *     current-tense role can both be right. No credential is shown; confirm
 *     with her whether she is current or alumni.
 *   - **The core team's country line** (Kohrt "U.S.A.", Rai "Nepal", Best
 *     "Trinidad & Tobago", Experton "France", Eleftheriou "Cyprus", Rangel
 *     "Lithuania", Gwaikolo "Liberia", de Jong Montero "Panama", Singh and
 *     Gurung "Nepal"). It reads as nationality — Experton practises in DC — while
 *     the affiliates' line is an institution. `location` now means *where the
 *     person is based* for everyone, and is set only where a profile says so.
 *   - **Email, Google Scholar, and ORCID** except for Kohrt and Rai, whose
 *     ORCIDs are already the provenance of `publications-data.ts`. No profile
 *     publishes an address or a scholar link; Hamdani's links an NCBI
 *     bibliography.
 *   - **Student degree levels and alumni destinations** (`degree`, `now`).
 *     The live page gives a field for students and a year for alumni, nothing
 *     more. The fields exist so the Center can fill them.
 *
 * Unresolved title conflicts (team card used; profile disagrees):
 *
 *   - Kamal Gautam — card "Clinical Associate Professor", bio "Clinical
 *     Assistant Professor".
 *   - Nagendra Luitel — card "Clinical Associate Professor", bio "Adjunct
 *     Assistant Professor".
 *
 * Two fields are derived rather than sourced:
 *
 *   - `projects` tags a person only where their own bio names the project or
 *     describes it unambiguously (Best's and Experton's NIH PM+ trial in New
 *     York City is RECOUP-NY, per de Jong Montero's bio; Rai's NIMH passive-
 *     sensing study for mothers in Nepal is StandStrong, per Gautam's). Bios
 *     do not record PI roles, so Kohrt — who leads most of the portfolio — is
 *     tagged only with the EQUIP he names. Ask the Center to confirm tags.
 *   - `authorNames` are the exact spellings under which each person appears in
 *     `PUBLICATIONS`, checked by hand — "de Jong" there is Joop de Jong, not
 *     Ruth de Jong Montero, which is why matching is not by surname.
 */

import type { Person } from "@gmhlab/blocks";

const photo = (slug: string) => `/team/${slug}.jpg`;

export const TEAM: Person[] = [
  /* -- Core team, in the live page's order --------------------------------- */
  {
    slug: "brandon-kohrt",
    name: "Brandon Kohrt",
    group: "core",
    credentials: ["MD", "PhD"],
    role: "Director",
    photo: photo("brandon-kohrt"),
    projects: ["equip"],
    authorNames: ["Brandon A. Kohrt", "Brandon Kohrt"],
    links: { orcid: "0000-0002-3829-4820" },
    bio: [
      "Brandon Kohrt, MD, PhD is a psychiatrist and anthropologist who has worked for 25 years to improve mental health services in countries affected by war and political violence, disasters, and other forms of adversity. He holds the Charles and Sonia Akman Professorship in Global Psychiatry at George Washington University, where he is Professor of Psychiatry and Behavioral Health, Global Health, and Anthropology, and Director of the Center for Global Mental Health Equity. He works regularly with the World Health Organization, UNICEF, and humanitarian organizations around the world.",
      "Dr. Kohrt is the academic partner lead for the World Health Organization/Unicef Ensuring Quality In Psychosocial and Mental Healthcare (EQUIP) initiative to establish competency frameworks and assessments for providers of psychological and other mental health services around the world. Dr. Kohrt’s work also addresses development of mental health assessment tools and trials for reducing stigma in healthcare settings to improve the quality of mental health services.",
      "Dr. Kohrt is co-editor of the book Global Mental Health: Anthropological Perspectives, and co-editor-in-chief of Social Science & Medicine: Mental Health. Dr. Kohrt was Commissioner for the Time for United Action on Depression: a Lancet–World Psychiatric Association Commission and The Lancet Commission on Ending Stigma and Discrimination in Mental Health.",
    ],
  },
  {
    slug: "sauharda-rai",
    name: "Sauharda Rai",
    group: "core",
    credentials: ["PhD"],
    role: "Assistant Research Professor",
    photo: photo("sauharda-rai"),
    projects: ["reshape", "equip-su", "scape-u", "standstrong"],
    authorNames: ["Sauharda Rai"],
    links: { orcid: "0000-0002-9393-1466" },
    bio: [
      "Sauharda Rai, PhD, is an Assistant Research Professor of Psychiatry and Behavioral Health at George Washington University (GWU). Over the past decade, Dr. Rai has worked in the field of global mental health, focusing on stigma, health system strengthening, integrating technology in mental health care, and studying the psychosocial impact of conflict and migration. His research employs mixed methods, combining intervention research, implementation science, and participatory approaches in low-resource settings. He has extensively collaborated with individuals with lived experience of mental health conditions to develop participatory approaches in mental health research and practice.",
      "At the GWU Center for Global Mental Health Equity, Dr. Rai leads studies in Nepal and Uganda to develop and test interventions aimed at improving mental health care at the primary care, community, and home levels via stigma reduction and collaborating with people with lived experience. His current projects (Role: Co-PI) include an NIMH R01 study RESHAPE (Reducing stigma among healthcare providers in Nepal); NIMH R34 study EQUIP-SU (Ensuring Quality in Psychological Support – Service User Quality Assessment); and a Wellcome Trust-funded study in Uganda SCAPE-U (Strengthening care in collaboration with individuals with lived experience of psychosis). He is also working on an NIMH R21/33 study testing passive sensing technology to enhance depression treatment for mothers in Nepal, as well as the Jumla Mental Health Study, which examines the long-term mental health impact of conflict across the life course.",
      "In addition to his research, Dr. Rai teaches Global Mental Health at GWU and runs an annual summer course in Nepal on developing, adapting, and validating mental health assessments and measures.",
    ],
  },
  {
    slug: "chynere-best",
    name: "Chynere Best",
    group: "core",
    credentials: ["PhD"],
    role: "Research Scientist",
    photo: photo("chynere-best"),
    projects: ["recoup-ny"],
    authorNames: ["Chynere Best"],
    bio: [
      "Chynere Best coordinates a NIH funded clinical trial intended to test the effectiveness of Problem Management Plus (PM+) as a task sharing intervention adapted and implemented in New York City communities. She liaises with interested community organizations and coordinates various research activities.",
      "Chynere's research explores reciprocal learning in task sharing interventions adapted from low and middle income countries to high income countries.",
    ],
  },
  {
    slug: "ruta-rangel",
    name: "Ruta Rangel",
    group: "core",
    credentials: ["MSc", "MPH"],
    role: "EQUIP Program Manager",
    photo: photo("ruta-rangel"),
    projects: ["equip"],
    authorNames: ["Ruta Rangel"],
    bio: [
      "Ruta Rangel oversees the Ensuring Quality in Psychological Support (EQUIP) project, a collaboration between the World Health Organization and UNICEF. The project aims to improve the quality of mental health support delivered by non-specialists in low-resource areas by building sustainable and accessible services using a competency-based approach.",
      "Ruta plays a crucial role in coordinating various activities within the project, including technical support, evaluations, partner coordination, graphic design, and much more.",
    ],
  },
  {
    slug: "wilfred-gwaikolo",
    name: "Wilfred Gwaikolo",
    group: "core",
    credentials: ["MPH", "MSc"],
    role: "Research Associate",
    photo: photo("wilfred-gwaikolo"),
    projects: ["equip-su", "scape-u"],
    authorNames: ["Wilfred Gwaikolo"],
    bio: [
      "Wilfred Gwaikolo is a Research Associate at George Washington University with over 13 years of experience in global mental health, particularly in low-resource settings. His work focuses on health system strengthening, stigma reduction, and engaging individuals with lived experience. His research employs evidence-based mixed-methods research, implementation science, and participatory approaches and has been published in several peer-reviewed journals.",
      "He holds a Master of Science in Global Health Policy and Management with a focus on Health Economics and Analytics from Brandeis University, as well as a Master of Public Health from Cuttington University in Liberia.",
      "Previously, he served as Deputy Program Lead for The Carter Center Mental Health Program in Liberia, supporting the government in strengthening public mental health services. At GWU, Wilfred currently works on several global mental health research initiatives. His research portfolio includes coordinating the economic evaluation of a task-sharing global mental health clinical trial in New York City and Duluth, Minnesota. He is a collaborator on the Wellcome Trust-funded SCAPE-U study in Uganda, which focuses on strengthening care in collaboration with individuals with lived experience of psychosis. Additionally, he serves as Co-PI on the NIH-funded EQUIP-SU project, which aims to ensure quality in psychological support through service user quality assessments in Liberia and Nepal. He is also pursuing a PhD in Global Public Health at the Milken Institute School of Public Health at George Washington University.",
    ],
  },
  {
    slug: "ruth-de-jong-montero",
    name: "Ruth de Jong Montero",
    group: "core",
    credentials: ["MSc"],
    role: "Research Assistant",
    location: "New York City",
    photo: photo("ruth-de-jong-montero"),
    projects: ["recoup-ny"],
    bio: [
      "Ruth Marie de Jong Montero, MSc is a dedicated Global Health professional with a strong academic foundation in International and European Law. She holds an MSc in Global Health from Georgetown University and an LLB in International and European Law from Rijksuniversiteit Groningen. Her expertise lies in maternal, reproductive, and mental health.",
      "Based in New York City, Ruth Marie works as a Research Assistant at the Center for Global Mental Health Equity at George Washington University. Most of her work focuses on supporting the RECOUP-NY study, which tests the effectiveness of Problem Management Plus (PM+) in New York City. Additionally, Ruth Marie supports the Center in publication writing.",
      "Fluent in English, Spanish, and Dutch, Ruth Marie thrives in diverse environments and is committed to advancing equitable healthcare worldwide.",
    ],
  },
  {
    slug: "dristy-gurung",
    name: "Dristy Gurung",
    group: "core",
    credentials: ["MSc", "PhD"],
    role: "Postdoctoral Fellow",
    photo: photo("dristy-gurung"),
    projects: ["reshape"],
    authorNames: ["Dristy Gurung"],
    bio: [
      "Dristy Gurung is a postdoctoral researcher in global mental health at the Centre for Global Mental Health Equity, George Washington University, USA, with research interests in reducing mental health stigma including understanding and measuring structural stigma, health system strengthening, and implementation science.",
      "Her work focuses on co-producing mental health interventions with people with lived experiences (PWLEs) to improve access to and quality of mental health services. She has experience in leading and managing randomised controlled trials such as the NIH-funded R01 project- Reducing Stigma among Healthcare Providers to Improve Mental Health Services (RESHAPE) (Role: Co-I and project manager), and leading transcultural translation and adaptation of mental health interventions and evaluation tools such as in MRC funded INDIGO Partnership program (Role: work package and site lead). She also has comprehensive experience conducting systematic and scoping reviews, policy reviews and analysis, mixed-methods and participatory approaches (e.g. photovoice), and implementation research.",
      "She was a commissioner on the “Lancet Commission on ending stigma and discrimination in mental health”. She chaired the launch event of the commission report, which the World Health Organization hosted. Her work not only focuses on promoting inclusivity within mental health systems but also in other areas of global health, such as addressing the geographical and gender gaps within the health and research workforce by strengthening the capacities of early-career researchers. She was awarded the Visionary Innovators Shaping Tomorrow’s Advancements (VISTA) award by the National Institute of Mental Health, USA, during the NIMH Global Mental Health conference in October 2023 for her contributions and work as an early-career researcher.",
    ],
  },

  /* -- Affiliates ---------------------------------------------------------- */
  {
    slug: "jun-shigemura",
    name: "Jun Shigemura",
    group: "affiliate",
    credentials: ["MD", "PhD"],
    role: "Visiting Professor",
    affiliation: "Faculty of Health Sciences, Mejiro University",
    location: "Saitama, Japan",
    photo: photo("jun-shigemura"),
    bio: [
      "Dr. Jun Shigemura is a psychiatrist and Professor within the Faculty of Health Sciences at Mejiro University in Saitama, Japan. He also holds an Adjunct Professorship in the Department of Psychiatry at the Uniformed Services University of the Health Sciences in Bethesda, Maryland.",
      "In 1994, Dr. Shigemura earned his M.D. degree from Keio University in Tokyo, Japan. From 1999 to 2020, he served at the National Defense Medical College, a medical school affiliated with Japan's Ministry of Defense. Between 2003 and 2005, he served as a visiting researcher at the Center for the Study of Traumatic Stress at the Uniformed Services University of the Health Sciences.",
      "Dr. Shigemura's specialization is disaster psychiatry and psychological trauma, focusing on the psychosocial consequences of chemical, biological, radiological, and nuclear (CBRN) disasters. The Japanese people were deeply impacted by the 2011 Great East Japan Earthquake (GEJE)—a combination of earthquake, tsunami, and the Fukushima nuclear power plant disaster—which tragically claimed over 18,000 lives. He led a team of mental healthcare professionals, providing crucial treatment and organizational support to first responders in Fukushima nuclear plant workers and the military.",
      "Dr. Shigemura participated in a series of studies on nuclear power plant workers (e.g., Shigemura J et al., JAMA, 2012; Hasegawa A et al., Lancet, 2015) and military disaster workers (Nagamine M et al., JAMA Network Open; Saito T et al., British Journal of Psychiatry, 2022). He is the President of the Japanese Society for Traumatic Stress Studies (2023-2025), an Editorial Board member of the European Journal of Psychotraumatology, and a member of the Traumatic Stress Global Networking Community of CINP (The International College of Neuropsychopharmacology).",
    ],
  },
  {
    slug: "anna-viduani",
    name: "Anna Viduani",
    group: "affiliate",
    role: "Visiting Predoctoral Fellow",
    affiliation: "Universidade Federal do Rio Grande do Sul",
    location: "Brazil",
    photo: photo("anna-viduani"),
    projects: ["idea"],
    authorNames: ["Anna Viduani"],
    bio: [
      "Anna Viduani is a clinical psychologist trained at the Federal University of Rio Grande do Sul (UFRGS), where she also earned a Master’s degree in Psychiatry and Behavioral Sciences, with a focus on child and adolescent mental health. She is currently a Ph.D. candidate in the same program and completed a predoctoral fellowship at CGMHE. Anna is a researcher at Prodia – the Childhood and Adolescent Depression Program at UFRGS/HCPA – where she has contributed to data collection and analysis for the Identifying Depression Early in Adolescence (IDEA) Project.",
      "Her research centers on child and adolescent depression, with a strong emphasis on qualitative methodologies and language analysis to explore lived experiences and inform more person-centered approaches to mental health care. Alongside her academic work, Anna maintains a private clinical practice, offering psychological assessment and psychotherapy for children, adolescents, and adults.",
    ],
  },
  {
    slug: "nagendra-luitel",
    name: "Nagendra Luitel",
    group: "affiliate",
    credentials: ["PhD"],
    role: "Clinical Associate Professor",
    affiliation: "Transcultural Psychosocial Organization Nepal",
    location: "Nepal",
    photo: photo("nagendra-luitel"),
    authorNames: ["Nagendra P. Luitel", "Nagendra P Luitel"],
    bio: [
      "Nagendra Luitel, MA, MPhil, PhD, is a global mental health researcher from Nepal. He holds a PhD in the integration of mental health services into primary and community healthcare systems from the University of Amsterdam, the Netherlands. Currently, he serves as a Research Advisor for Transcultural Psychosocial Organization (TPO) Nepal and as an Adjunct Assistant Professor at George Washington University in the USA. Dr. Luitel has been actively involved in mental health research since 2006 and has played a key role in the development of community-based mental health services and systems in Nepal.",
      "Over the years, Dr. Luitel has co-led numerous multi-year and multi-country research projects focusing on assessing mental health problems and service needs, adapting and validating mental health instruments, and developing and evaluating community-based interventions to improve the utilization of mental health services. His recent studies have concentrated on addressing barriers to mental health care on both the demand and supply sides.",
      "Dr. Luitel has overseen multiple Randomized Controlled Trials evaluating the feasibility, acceptability, and effectiveness of community-based psychological interventions, including WHO Problem Management Plus (PM+), Interpersonal Therapy (IPT) among adolescents, and the Thinking Healthy Program (THP) in Nepal. The results and best practices from Dr. Luitel's research programs have been widely utilized in policies, treatment protocols, guidelines, and training materials by the Ministry of Health and Population (MoH) in Nepal. Dr. Luitel has authored over 100 research articles in international peer-reviewed journals.",
    ],
  },
  {
    slug: "syed-usman-hamdani",
    name: "Syed Usman Hamdani",
    group: "affiliate",
    credentials: ["PhD", "MBBS"],
    role: "Clinical Professor",
    affiliation:
      "Global Institute of Human Development, Shifa Tameer-e-Millat University",
    location: "Pakistan",
    photo: photo("syed-usman-hamdani"),
    links: {
      bibliography:
        "https://www.ncbi.nlm.nih.gov/myncbi/1pu0jq77bjlka/bibliography/public/",
    },
    bio: [
      "Dr. Syed Usman Hamdani (Post doctorate in Child and Adolescent Mental Health, PhD, M.B.B.S), Founding director of Global Institute of Human Development, at Shifa Tameer-e-Milat University.",
      "A global mental health clinical academic who has significantly contributed to mental health research as a global mental health funder, clinical academic, director of non-profit mental health research organizations, founder of the department of public health research, advisor to the ministries of health, and education, served on task forces and advised national and international partners, funders and UN agencies such as the World Bank, WHO and UNICEF on mental health research, policy and practice.",
      "He worked as Research Lead for Mental Health Translation at Wellcome Trust and designed targeted funding calls to create a step-change in mental health science globally. He brings grass-root experience of leading multi-collaborative randomized controlled trials of psychosocial interventions in low resource settings, working with diverse teams, and publishing in highest impact factor journals. His research work has been supported by most prestigious mental health research funders.",
      "He is a Research Fellow at SNF Global Center for Child and Adolescent Mental Health, Child Mind Institute, New York, USA. Dr. Hamdani aspires to use his knowledge, skills and networks to accelerate the impact of mental health research globally and make evidence based mental health services available in a sustainable and scalable manner.",
    ],
  },
  {
    slug: "kamal-gautam",
    name: "Kamal Gautam",
    group: "affiliate",
    credentials: ["MD"],
    role: "Clinical Associate Professor",
    affiliation: "Transcultural Psychosocial Organization Nepal",
    location: "Nepal",
    photo: photo("kamal-gautam"),
    /* "unicef-mmapp": his bio names integrating the MMAP tool into Nepal's
       Multiple Indicator Cluster Survey with UNICEF. */
    projects: ["reshape", "equip-su", "standstrong", "alive", "unicef-mmapp"],
    authorNames: ["Kamal Gautam"],
    bio: [
      "Dr. Kamal Gautam, MD is a Psychiatrist and Executive Director at a leading mental health organization in Nepal viz. Transcultural Psychosocial Organization Nepal (TPO Nepal). He is a Clinical Assistant Professor at the Center for Global Mental Health Equity, Department of Psychiatry and Behavioural Health, The George Washington University, Washington, D.C., USA. Over the past decade, he has been dedicated to global mental health especially focusing on integrating mental health into primary health care and communities; strengthening the government health, education and protection systems; and drafting, endorsement and implementation of policies and action plans to foster mental health care in Nepal. He also serves as a MHPSS Expert to Unicef.",
      "His research areas of interest include integration of mental health into primary care, stigma reduction, suicide prevention and child and adolescent mental health (prevention and promotion). He worked in team under the NIH-funded R01 project Reducing Stigma among Healthcare Providers to Improve Mental Health Services (RESHAPE) (Role: Co-I). His current research projects include NIMH R34 study EQUIP-SU (Ensuring Quality in Psychological Support – Service User Quality Assessment) (Role: Co-I); University of Melbourne funded “Perceptions and experiences of media professionals in relation to media reporting of suicide-related news in Nepal” (Role: PI); NIMH funded R33 study StandStrong 3 (Sensing Technology to personAlize materNal DepreSsion TReatment in lOw resource settiNGs) (Role: Co-I) and the Wellcome Trust funded project ALIVE (Improving Adolescent mentaL health by reducing the Impact of poverty). He also leads the Lived Experience Advisory (LEA) Group at TPO Nepal and has also been contributing to formation and operationalization of Adolescent Advisory Group (AAG) at TPO Nepal. These groups have been engaged in project designing, implementation and co-creation of interventions.",
      "He has contributed to national level mental health training curriculum development and endorsement based on task-sharing approaches of WHO. These include National Health Training Centre (NHTC) accredited training modules on mental health, Module 1 to 6. Additionally, he leads the technical working group formed under the National Planning Commission of the Government of Nepal which has been drafting the National Action Plan against Suicide. He also provided technical assistance to the Ministry of Health & Population (MoHP) in inclusion of mental health module, capacity building of researchers and writing workshop under the Nepal Demographic Survey (NDHS) 2022. He has been providing technical assistance to the National Statistics Office (NSO) under the Prime Minister’s Office to integrate MMAPP (Measuring Mental Health of Adolescents at the Population Level) tool in the Multiple Indicator Cluster Survey (MICS) in collaboration with Unicef. He has published a number of book chapters and articles.",
    ],
  },
  {
    slug: "prabin-byanjankar",
    name: "Prabin Byanjankar",
    group: "affiliate",
    credentials: ["MSc"],
    role: "Senior Digital Health Technology Consultant",
    // The live page's affiliation line reads "Standstrong Project, Nepal" — a
    // project, not an institution, so it became a project tag instead.
    location: "Nepal",
    photo: photo("prabin-byanjankar"),
    projects: ["standstrong", "reshape", "alive"],
    authorNames: ["Prabin Byanjankar"],
    bio: [
      "I'm an IT professional skilled in software development, data analytics and development management. For the past 15 years, I have been developing various software, leading and managing multiple development teams for several years which consisted of team leads, developers, quality assurance analysts building various systems by implementing agile frameworks and development processes.",
      "I joined the StandStrong team in August 2018, during its pilot phase, and have since played an ongoing role in shaping the project through technical decision-making, implementation, and maintenance of mobile applications, database systems, and data management workflows. In addition to StandStrong, I’ve recently contributed as a consultant to the development of digital mental health applications for projects such as Reshape and Alive.",
      "Mobile applications I have implemented include: Maintaining EBM App (Electronic Behaviour Monitoring), StandStrong Counselor App, StandStrong Mother App, Implicit Association Test (IAT), BART-Y, Delay Gratification, and Emotional Go/No-Go.",
      "In addition, I serve as the Co-founder and Director of Right Find Professional Pvt. Ltd., a company providing software and HR consulting solutions. I also offer consulting services in data analytics and ERP implementation projects.",
      "I completed MSc in Information Technology from the University of Stuttgart in 2009 which opened the door to becoming the computer science lecturer in Nepal. Then, I started my professional career by writing health care software and continue building skills by leading and coaching junior developers.",
      "I believe in sharing knowledge and building high quality systems to solve everyday problems of people and organisations. I always encourage people to write highly maintainable code following the best practices and standards.",
    ],
  },
  {
    slug: "laure-experton",
    name: "Laure Experton",
    group: "affiliate",
    credentials: ["MD"],
    role: "Assistant Professor",
    photo: photo("laure-experton"),
    projects: ["recoup-ny"],
    bio: [
      "Dr. Laure Experton is an Assistant Professor of Psychiatry and Behavioral Sciences and an outpatient psychiatrist at George Washington University. She completed her psychiatry residency at Georgetown University Hospital, where she served as Chief Resident and pursued advanced training in psychotherapy and global health through the Washington Baltimore Center for Psychoanalysis and the Global Health Equity Track. Dr. Experton earned her medical degree from the Royal College of Surgeons in Ireland and holds a Bachelor of Science from McGill University. Her dedication to education has earned her numerous awards, including recognition from the American Psychiatric Association and Georgetown University.",
      "Dr. Experton is deeply committed to advancing mental health equity both locally and globally. Her work focuses on integrating mental health into primary care and supporting culturally tailored training of non-specialist providers in mental health delivery. She has collaborated with organizations such as MUSO in Mali to improve mental health care access in rural areas. Currently, she leads projects implementing WHO evidence-based psychological interventions to reduce distress among people facing adversity, including Problem Management Plus (PM+) in New York City and Washington, DC, and Self-Help Plus (SH+) in Senegal in collaboration with the World Bank. As a Population Health and Health Services Research Scholar, she has received grants to support her initiatives, driving innovative approaches to address mental health disparities. In addition to her clinical and global health work, Dr. Experton has conducted research on HIV and women's health, resulting in several peer-reviewed publications.",
      "Dr. Experton combines her clinical expertise, cultural sensitivity, and dedication to health equity to address mental health disparities on both local and global scales. She is fluent in English, French, and proficient in Spanish.",
    ],
  },

  /* -- Students: the live page gives a field only -------------------------- */
  {
    slug: "farhana-alam",
    name: "Farhana Alam",
    group: "student",
    program: "Neuroscience",
    photo: photo("farhana-alam"),
  },
  {
    slug: "shawn-bayrd",
    name: "Shawn Bayrd",
    group: "student",
    program: "Public Health",
    photo: photo("shawn-bayrd"),
  },
  {
    slug: "zuhrat-inam",
    name: "Zuhrat Inam",
    group: "student",
    program: "Public Health",
    photo: photo("zuhrat-inam"),
  },
  {
    slug: "radhika-wikramanayake",
    name: "Radhika Wikramanayake",
    group: "student",
    program: "Public Health",
    photo: photo("radhika-wikramanayake"),
  },

  /* -- Alumni: no `now` yet; photos only where the headshot is the person -- */
  { slug: "georgia-eleftheriou", name: "Georgia Eleftheriou", group: "alumni", credentials: ["PhD"], photo: photo("georgia-eleftheriou") },
  { slug: "ritika-singh", name: "Ritika Singh", group: "alumni", credentials: ["MSc"], photo: photo("ritika-singh") },
  { slug: "mansurat-raji", name: "Mansurat Raji", group: "alumni", credentials: ["MPH"], year: 2024 },
  { slug: "christina-juan", name: "Christina Juan", group: "alumni", credentials: ["DrPH"], year: 2024 },
  { slug: "anvita-bhardwaj", name: "Anvita Bhardwaj", group: "alumni", credentials: ["DrPH"], year: 2024 },
  { slug: "gloria-pedersen", name: "Gloria Pedersen", group: "alumni", credentials: ["DrPH"], year: 2023 },
  { slug: "abdelrhman-elnasseh", name: "Abdelrhman Elnasseh", group: "alumni", credentials: ["MD"], year: 2023 },
  { slug: "syed-shabab-wahid", name: "Syed Shabab Wahid", group: "alumni", credentials: ["DrPH"], year: 2021 },
  { slug: "katherine-ottman", name: "Katherine Ottman", group: "alumni", credentials: ["MSc"], year: 2021 },
  { slug: "anubhuti-poudyal", name: "Anubhuti Poudyal", group: "alumni", credentials: ["MPH"], year: 2021 },
];
