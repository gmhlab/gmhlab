import {
  type Account,
  type CourseProgress,
  type LearningProgress,
  canAccess,
  courseCompletion,
} from "@gmhlab/core";
import { Button, GmhLogo, ResearchGlyph, cn } from "@gmhlab/ui";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Circle,
  Clock,
  Lightbulb,
  Lock,
  Printer,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useMemo, useState } from "react";
import { GMH_DASHBOARD_COPY } from "../shared/gmh-copy";
import {
  type Competency,
  type CompetencyLevel,
  COURSE_PASS_MARK,
  type Course,
  type DashboardLinkComponent,
  type PracticeScenario,
} from "./dashboard-types";
import { Cover, LessonPath } from "./ornaments";
import {
  Chip,
  Confetti,
  DemoNote,
  EASE,
  Item,
  LockBadge,
  PageHero,
  Panel,
  ProgressRing,
  SectionTitle,
  Stagger,
  TiltCard,
  toneAt,
} from "./kit";

const PlainLink: DashboardLinkComponent = ({ href, children, ...props }) => (
  <a href={href} {...props}>
    {children}
  </a>
);

/* ── Catalogue ────────────────────────────────────────────────────────── */

export type EquipAcademyProps = {
  account: Account;
  courses: Course[];
  progress: LearningProgress;
  /** Each course at `${basePath}/${course.id}`; the studio at `practiceHref`. */
  basePath: string;
  practiceHref?: string;
  /** Where locked courses send people to upgrade. */
  storeHref?: string;
  title?: string;
  description?: string;
  /** A photograph behind the hero (see `PageHero` `backdrop`). */
  heroImage?: string;
  /** `object-position` for its crop, e.g. "center 20%". */
  heroImagePosition?: string;
  /** Provenance line for invented teaching content. Pass null to drop. */
  note?: ReactNode | null;
  linkComponent?: DashboardLinkComponent;
};

/** The course catalogue: each course a tilt card with its progress ring. */
export function EquipAcademy({
  account,
  courses,
  progress,
  basePath,
  practiceHref,
  storeHref,
  title = "EQUIP Academy",
  description = "Competency-based training for helpers, trainers and supervisors: learn the skills, practise rating them, and earn a certificate.",
  heroImage,
  heroImagePosition,
  note,
  linkComponent: Link = PlainLink,
}: EquipAcademyProps) {
  return (
    <div className="space-y-10">
      <PageHero
        eyebrow="Learn"
        title={title}
        description={description}
        art={{ kind: "glyph", name: "competency" }}
        backdrop={heroImage ? { src: heroImage, position: heroImagePosition } : undefined}
        actions={
          practiceHref && (
            <Link
              href={practiceHref}
              className="dash-shine inline-flex h-11 items-center gap-2 rounded-full bg-tertiary-container px-5 text-sm font-bold text-on-tertiary-container"
            >
              Open the practice studio <ArrowRight className="size-4" aria-hidden />
            </Link>
          )
        }
      />

      <section>
        <SectionTitle title="Courses" description="Work through the lessons, then pass the quiz to earn the certificate." />
        <Stagger className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, i) => {
            const open = canAccess(account, course);
            const p = progress[course.id];
            const value = courseCompletion(p, course.lessons.length);
            const minutes = course.lessons.reduce((n, l) => n + l.minutes, 0);
            const card = (
              <TiltCard className="dash-panel flex h-full flex-col overflow-hidden">
                <Cover
                  art={{ kind: "glyph", name: course.glyph }}
                  tone={toneAt(i)}
                  photo={course.image}
                  className="aspect-[16/9] w-full !rounded-none"
                >
                  {/* Wrapped: the kit's unlayered `.graphic-pathway { position: relative }`
                      beats Tailwind's layered `absolute` on the element itself. */}
                  <div className="absolute inset-x-5 bottom-3">
                    <LessonPath total={course.lessons.length} done={p?.completed.length ?? 0} />
                  </div>
                </Cover>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap gap-2">
                    <Chip tone={course.level === "Foundation" ? "success" : course.level === "Supervisor" ? "gold" : "info"}>{course.level}</Chip>
                    <Chip>
                      <Clock className="size-3" aria-hidden /> {minutes} min
                    </Chip>
                    {p?.certifiedAt && (
                      <Chip tone="gold">
                        <Award className="size-3" aria-hidden /> Certified
                      </Chip>
                    )}
                  </div>
                  <h3 className="mt-4 font-serif text-xl">{course.title}</h3>
                  <p className="mt-2 text-sm text-on-surface-variant">{course.tagline}</p>
                  <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                    {open ? (
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        {value === 0 ? "Start course" : value === 1 ? "Review" : "Continue"}
                        <ArrowRight className="size-4" aria-hidden />
                      </span>
                    ) : (
                      <LockBadge hint="Practitioner plan" />
                    )}
                    <ProgressRing value={value} size={56} stroke={6} label={<span className="text-xs">{Math.round(value * 100)}%</span>} />
                  </div>
                </div>
              </TiltCard>
            );
            return (
              <Item key={course.id}>
                <Link href={open ? `${basePath}/${course.id}` : (storeHref ?? `${basePath}/${course.id}`)} className="block h-full">
                  {card}
                </Link>
              </Item>
            );
          })}
        </Stagger>
      </section>
      {note !== null && note !== undefined && <DemoNote>{note}</DemoNote>}
    </div>
  );
}

/* ── Course player ────────────────────────────────────────────────────── */

export type CoursePlayerProps = {
  course: Course;
  progress?: CourseProgress;
  learnerName: string;
  backHref: string;
  onCompleteLesson: (lessonId: string) => Promise<unknown>;
  /** Record a quiz attempt (0–1). */
  onQuizSubmit: (score: number) => Promise<unknown>;
  onCertify: () => Promise<unknown>;
  /** Certificate issuer line. */
  issuer?: string;
  note?: ReactNode | null;
  linkComponent?: DashboardLinkComponent;
};

type Step = { kind: "lesson"; index: number } | { kind: "quiz" } | { kind: "certificate" };

/**
 * One course: a lesson rail, the lesson itself (sections, key points, a try-it
 * prompt), the quiz with explained answers, and a printable certificate.
 */
export function CoursePlayer({
  course,
  progress,
  learnerName,
  backHref,
  onCompleteLesson,
  onQuizSubmit,
  onCertify,
  issuer = GMH_DASHBOARD_COPY.organisation,
  note,
  linkComponent: Link = PlainLink,
}: CoursePlayerProps) {
  const completed = progress?.completed ?? [];
  const firstOpen = course.lessons.findIndex((l) => !completed.includes(l.id));
  const [step, setStep] = useState<Step>(
    progress?.certifiedAt
      ? { kind: "certificate" }
      : firstOpen === -1
        ? { kind: "quiz" }
        : { kind: "lesson", index: firstOpen },
  );
  const allDone = course.lessons.every((l) => completed.includes(l.id));
  const passed = (progress?.quizScore ?? 0) >= COURSE_PASS_MARK;
  const value = courseCompletion(progress, course.lessons.length);

  const rail = (
    <Panel className="p-3 lg:sticky lg:top-24">
      <div className="flex items-center gap-3 p-3">
        <ProgressRing value={value} size={52} stroke={6} label={<span className="text-xs">{Math.round(value * 100)}%</span>} />
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{course.level}</div>
          <div className="truncate font-semibold">{course.title}</div>
        </div>
      </div>
      <ol className="mt-2 space-y-0.5">
        {course.lessons.map((lesson, i) => {
          const done = completed.includes(lesson.id);
          const active = step.kind === "lesson" && step.index === i;
          return (
            <li key={lesson.id}>
              <button
                type="button"
                onClick={() => setStep({ kind: "lesson", index: i })}
                className={cn(
                  "relative isolate flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition",
                  active ? "font-semibold text-on-secondary-container" : "hover:bg-surface-container",
                )}
                aria-current={active ? "step" : undefined}
              >
                {active && (
                  <motion.span layoutId="dash-lesson-pill" className="absolute inset-0 -z-10 rounded-2xl bg-secondary-container" />
                )}
                {done ? (
                  <CheckCircle2 className="size-5 shrink-0 text-success" aria-label="Done" />
                ) : (
                  <Circle className="size-5 shrink-0 text-outline" aria-label="Not done" />
                )}
                <span className="flex-1">{lesson.title}</span>
                <span className="text-xs text-on-surface-variant tabular-nums">{lesson.minutes}′</span>
              </button>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            disabled={!allDone}
            onClick={() => setStep({ kind: "quiz" })}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition disabled:opacity-50",
              step.kind === "quiz" ? "bg-secondary-container font-semibold" : "hover:bg-surface-container",
            )}
          >
            {passed ? <CheckCircle2 className="size-5 text-success" /> : allDone ? <Lightbulb className="size-5 text-primary" /> : <Lock className="size-5 text-outline" />}
            <span className="flex-1">Quiz</span>
            {progress?.quizScore !== undefined && <span className="text-xs tabular-nums">{Math.round(progress.quizScore * 100)}%</span>}
          </button>
        </li>
        <li>
          <button
            type="button"
            disabled={!passed}
            onClick={() => setStep({ kind: "certificate" })}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition disabled:opacity-50",
              step.kind === "certificate" ? "bg-secondary-container font-semibold" : "hover:bg-surface-container",
            )}
          >
            <Award className={cn("size-5", passed ? "text-tertiary" : "text-outline")} />
            <span className="flex-1">Certificate</span>
          </button>
        </li>
      </ol>
    </Panel>
  );

  return (
    <div className="space-y-6">
      <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4" aria-hidden /> All courses
      </Link>
      <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside>{rail}</aside>
        <AnimatePresence mode="wait">
          <motion.div
            key={step.kind === "lesson" ? `l${step.index}` : step.kind}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="min-w-0"
          >
            {step.kind === "lesson" && (
              <LessonView
                course={course}
                index={step.index}
                done={completed.includes(course.lessons[step.index]!.id)}
                onComplete={async () => {
                  const lesson = course.lessons[step.index]!;
                  await onCompleteLesson(lesson.id);
                  const nextIndex = course.lessons.findIndex((l, i) => i > step.index && !completed.includes(l.id));
                  setStep(nextIndex === -1 ? { kind: "quiz" } : { kind: "lesson", index: nextIndex });
                }}
                onNext={() =>
                  setStep(step.index + 1 < course.lessons.length ? { kind: "lesson", index: step.index + 1 } : { kind: "quiz" })
                }
              />
            )}
            {step.kind === "quiz" && (
              <QuizView
                course={course}
                best={progress?.quizScore}
                onSubmit={onQuizSubmit}
                onPassed={async () => {
                  await onCertify();
                  setStep({ kind: "certificate" });
                }}
              />
            )}
            {step.kind === "certificate" && (
              <Certificate
                course={course}
                learnerName={learnerName}
                issuer={issuer}
                date={progress?.certifiedAt ?? new Date().toISOString()}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {note !== null && note !== undefined && <DemoNote>{note}</DemoNote>}
    </div>
  );
}

function LessonView({
  course,
  index,
  done,
  onComplete,
  onNext,
}: {
  course: Course;
  index: number;
  done: boolean;
  onComplete: () => Promise<void>;
  onNext: () => void;
}) {
  const lesson = course.lessons[index]!;
  const [busy, setBusy] = useState(false);
  return (
    <article className="space-y-6">
      <header className="dash-hero px-8 py-8">
        <div className="dash-aurora" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-brand-band-accent">
            Lesson {index + 1} of {course.lessons.length} · {lesson.minutes} min
          </div>
          <LessonPath total={course.lessons.length} done={index} className="w-64 max-w-full" />
        </div>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl">{lesson.title}</h1>
        <p className="mt-3 max-w-2xl text-lg/relaxed opacity-85">{lesson.summary}</p>
      </header>

      <Panel className="dash-prose p-8">
        {lesson.sections.map((section, i) => (
          <motion.section
            key={section.heading}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
            className={cn(i > 0 && "mt-8")}
          >
            <h2 className="font-serif text-2xl">{section.heading}</h2>
            <p className="text-base">{section.body}</p>
          </motion.section>
        ))}
      </Panel>

      <div className="grid gap-6 md:grid-cols-2">
        <Panel className="bg-secondary-container/60 p-6">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider">Key points</h3>
          <ul className="space-y-2">
            {lesson.keyPoints.map((point) => (
              <li key={point} className="flex gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </Panel>
        {lesson.tryIt && (
          <Panel className="relative overflow-hidden p-6">
            <div className="absolute -right-6 -top-6 opacity-20" aria-hidden>
              <ResearchGlyph name="lived-experience" size={120} />
            </div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
              <Lightbulb className="size-4 text-tertiary" aria-hidden /> Try it
            </h3>
            <p>{lesson.tryIt}</p>
          </Panel>
        )}
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        {done ? (
          <Button size="lg" onClick={onNext}>
            Next <ArrowRight aria-hidden />
          </Button>
        ) : (
          <Button
            size="lg"
            className="dash-shine"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onComplete();
              } finally {
                setBusy(false);
              }
            }}
          >
            <CheckCircle2 aria-hidden /> Mark complete and continue
          </Button>
        )}
      </div>
    </article>
  );
}

function QuizView({
  course,
  best,
  onSubmit,
  onPassed,
}: {
  course: Course;
  best?: number;
  onSubmit: (score: number) => Promise<unknown>;
  onPassed: () => Promise<void>;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [party, setParty] = useState(false);
  const score = course.quiz.filter((q) => answers[q.id] === q.answer).length / course.quiz.length;
  const passed = score >= COURSE_PASS_MARK;
  const ready = course.quiz.every((q) => answers[q.id] !== undefined);

  return (
    <div className="space-y-6">
      {party && <Confetti onDone={() => setParty(false)} />}
      <header>
        <h1 className="font-serif text-3xl">Check your understanding</h1>
        <p className="mt-2 text-on-surface-variant">
          {course.quiz.length} questions. Score {Math.round(COURSE_PASS_MARK * 100)}% to earn the certificate.
          {best !== undefined && ` Your best so far: ${Math.round(best * 100)}%.`}
        </p>
      </header>

      {course.quiz.map((q, qi) => (
        <Panel key={q.id} className="p-6">
          <div className="mb-4 flex gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-on-primary">{qi + 1}</span>
            <h2 className="pt-1 font-semibold">{q.prompt}</h2>
          </div>
          <div className="grid gap-2" role="radiogroup" aria-label={q.prompt}>
            {q.options.map((option, oi) => {
              const chosen = answers[q.id] === oi;
              const correct = submitted && oi === q.answer;
              const wrong = submitted && chosen && oi !== q.answer;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={chosen}
                  disabled={submitted}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition",
                    correct
                      ? "border-success bg-success-container text-on-success-container"
                      : wrong
                        ? "border-error bg-error-container text-on-error-container"
                        : chosen
                          ? "border-primary bg-primary/8 ring-2 ring-primary/30"
                          : "border-outline-variant hover:border-outline hover:bg-surface-container",
                  )}
                >
                  {correct ? (
                    <CheckCircle2 className="size-5 shrink-0" aria-hidden />
                  ) : wrong ? (
                    <XCircle className="size-5 shrink-0" aria-hidden />
                  ) : (
                    <span className={cn("size-5 shrink-0 rounded-full border-2", chosen ? "border-[6px] border-primary" : "border-outline")} />
                  )}
                  {option}
                </button>
              );
            })}
          </div>
          <AnimatePresence>
            {submitted && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 text-sm text-on-surface-variant"
              >
                {q.why}
              </motion.p>
            )}
          </AnimatePresence>
        </Panel>
      ))}

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("flex flex-wrap items-center justify-between gap-4 p-6", passed ? "dash-hero" : "dash-panel")}
        >
          <div>
            <div className="font-serif text-3xl">{Math.round(score * 100)}%</div>
            <div className={cn("text-sm", passed ? "opacity-85" : "text-on-surface-variant")}>
              {passed ? "You passed. Your certificate is ready." : "Not quite — review the explanations and try again."}
            </div>
          </div>
          {passed ? (
            <Button size="lg" variant="accent" className="dash-shine" onClick={onPassed}>
              <Award aria-hidden /> Claim certificate
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
              }}
            >
              <RotateCcw aria-hidden /> Try again
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="flex justify-end">
          <Button
            size="lg"
            disabled={!ready}
            onClick={async () => {
              setSubmitted(true);
              await onSubmit(score);
              if (score >= COURSE_PASS_MARK) setParty(true);
            }}
          >
            Submit answers
          </Button>
        </div>
      )}
    </div>
  );
}

function Certificate({
  course,
  learnerName,
  issuer,
  date,
}: {
  course: Course;
  learnerName: string;
  issuer: string;
  date: string;
}) {
  return (
    <div className="space-y-4">
      <motion.div
        className="dash-hero dash-certificate relative aspect-[1.414/1] w-full p-[6%] text-center"
        initial={{ opacity: 0, rotateX: 18, y: 30 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ transformPerspective: 1200 }}
      >
        <div className="dash-aurora" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div className="absolute inset-[3%] rounded-[20px] border border-brand-band-accent/50" aria-hidden />
        <div className="absolute inset-[4%] rounded-[16px] border border-brand-band-accent/25" aria-hidden />
        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="dash-sidebar-brand mb-[3%]">
            <GmhLogo href={undefined} />
          </div>
          <div className="text-[clamp(10px,1.4vw,14px)] font-bold uppercase tracking-[0.3em] text-brand-band-accent">
            Certificate of completion
          </div>
          <div className="mt-[3%] text-[clamp(12px,1.6vw,16px)] opacity-80">This certifies that</div>
          <div className="dash-gold-text mt-[1.5%] font-serif text-[clamp(28px,5vw,56px)] leading-tight">{learnerName}</div>
          <div className="mt-[2%] text-[clamp(12px,1.6vw,16px)] opacity-80">has completed</div>
          <div className="mt-[1%] font-serif text-[clamp(18px,2.8vw,30px)]">{course.title}</div>
          <div className="mt-[4%] flex items-center gap-6 text-[clamp(10px,1.2vw,13px)] opacity-80">
            <span>{issuer}</span>
            <span aria-hidden>·</span>
            <span>{new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
          <div className="absolute bottom-[4%] right-[5%] opacity-90" aria-hidden>
            <ResearchGlyph name={course.glyph} size={64} />
          </div>
        </div>
      </motion.div>
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => window.print()}>
          <Printer aria-hidden /> Print or save as PDF
        </Button>
      </div>
    </div>
  );
}

/* ── Practice studio ──────────────────────────────────────────────────── */

export type PracticeStudioProps = {
  scenarios: PracticeScenario[];
  competencies: Competency[];
  levels: CompetencyLevel[];
  backHref: string;
  /** A photograph behind the hero. */
  heroImage?: string;
  note?: ReactNode | null;
  linkComponent?: DashboardLinkComponent;
};

/** A radar of up to two series over the competencies, 1–4 scale. */
function Radar({
  competencies,
  series,
}: {
  competencies: Competency[];
  series: { label: string; values: Record<string, number>; tone: "gold" | "navy" }[];
}) {
  const size = 340;
  const c = size / 2;
  const r = c - 56;
  const n = competencies.length;
  const point = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    const d = (r * v) / 4;
    return [c + Math.cos(a) * d, c + Math.sin(a) * d] as const;
  };
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-md" role="img" aria-label="Your ratings against the expert ratings">
      {[1, 2, 3, 4].map((ring) => (
        <polygon
          key={ring}
          points={competencies.map((_, i) => point(i, ring).join(",")).join(" ")}
          fill="none"
          stroke="var(--gmh-color-outline-variant)"
          strokeWidth={ring === 4 ? 1.2 : 0.8}
        />
      ))}
      {competencies.map((comp, i) => {
        const [x, y] = point(i, 4);
        const [lx, ly] = point(i, 4.9);
        return (
          <g key={comp.id}>
            <line x1={c} y1={c} x2={x} y2={y} stroke="var(--gmh-color-outline-variant)" strokeWidth={0.8} />
            <text
              x={lx}
              y={ly}
              textAnchor={Math.abs(lx - c) < 8 ? "middle" : lx > c ? "start" : "end"}
              dominantBaseline="middle"
              fontSize={11}
              fontWeight={600}
              fill="var(--gmh-color-on-surface-variant)"
            >
              {comp.short}
            </text>
          </g>
        );
      })}
      {series.map((s, si) => (
        <motion.polygon
          key={s.label}
          points={competencies.map((comp, i) => point(i, s.values[comp.id] ?? 0).join(",")).join(" ")}
          fill={s.tone === "gold" ? "color-mix(in srgb, var(--gmh-color-tertiary-container) 40%, transparent)" : "color-mix(in srgb, var(--gmh-color-primary) 18%, transparent)"}
          stroke={s.tone === "gold" ? "var(--gmh-color-tertiary-container)" : "var(--gmh-color-primary)"}
          strokeWidth={2.2}
          strokeLinejoin="round"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: si * 0.25 }}
          style={{ transformOrigin: `${c}px ${c}px` }}
        />
      ))}
    </svg>
  );
}

/**
 * Rate a scripted role play on every competency, then compare against the
 * expert consensus on a radar, with the experts' reasoning for each.
 */
export function PracticeStudio({
  scenarios,
  competencies,
  levels,
  backHref,
  heroImage,
  note,
  linkComponent: Link = PlainLink,
}: PracticeStudioProps) {
  const [scenarioId, setScenarioId] = useState(scenarios[0]?.id);
  const scenario = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0];
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);

  const agreement = useMemo(() => {
    if (!scenario) return 0;
    const exact = competencies.filter((c) => ratings[c.id] === scenario.expert[c.id]).length;
    return exact / competencies.length;
  }, [competencies, ratings, scenario]);

  if (!scenario) return null;
  const complete = competencies.every((c) => ratings[c.id] !== undefined);

  return (
    <div className="space-y-8">
      <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4" aria-hidden /> EQUIP Academy
      </Link>
      <PageHero
        eyebrow="Practice studio"
        title="Rate a role play"
        description="Read the session, rate each competency from 1 to 4, then compare with the expert consensus."
        art={{ kind: "glyph", name: "measurement" }}
        backdrop={heroImage ? { src: heroImage, position: "center 40%" } : undefined}
      >
        {scenarios.length > 1 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {scenarios.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setScenarioId(s.id);
                  setRatings({});
                  setRevealed(false);
                }}
                className={cn("rounded-full px-4 py-1.5 text-sm font-semibold ring-1 ring-white/25", s.id === scenario.id ? "bg-white/20" : "hover:bg-white/10")}
              >
                {s.title}
              </button>
            ))}
          </div>
        )}
      </PageHero>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Panel className="p-6 xl:sticky xl:top-24 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto">
          <h2 className="font-serif text-2xl">{scenario.title}</h2>
          <p className="mt-2 text-sm text-on-surface-variant">{scenario.setting}</p>
          <ol className="mt-6 space-y-3">
            {scenario.lines.map((line, i) => {
              const helper = line.speaker === scenario.lines[0]?.speaker;
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: helper ? -10 : 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
                  className={cn("flex", helper ? "justify-start" : "justify-end")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-3xl px-4 py-3 text-sm",
                      helper ? "rounded-bl-md bg-secondary-container text-on-secondary-container" : "rounded-br-md bg-surface-container-highest",
                    )}
                  >
                    <div className="mb-0.5 text-[11px] font-bold uppercase tracking-wider opacity-70">{line.speaker}</div>
                    {line.line}
                    {revealed && line.note && (
                      <div className="mt-2 rounded-xl bg-warning-container px-2.5 py-1.5 text-xs text-on-warning-container">
                        Rater note: {line.note}
                      </div>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </Panel>

        <div className="space-y-4">
          {competencies.map((comp) => {
            const mine = ratings[comp.id];
            const expert = scenario.expert[comp.id];
            const match = revealed && mine === expert;
            return (
              <Panel key={comp.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{comp.name}</h3>
                    <p className="text-sm text-on-surface-variant">{comp.look}</p>
                  </div>
                  {revealed && (
                    <Chip tone={match ? "success" : "warning"}>
                      {match ? "Matches the experts" : `Experts: ${expert}`}
                    </Chip>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2" role="radiogroup" aria-label={comp.name}>
                  {levels.map((level) => {
                    const chosen = mine === level.value;
                    const isExpert = revealed && expert === level.value;
                    return (
                      <button
                        key={level.value}
                        type="button"
                        role="radio"
                        aria-checked={chosen}
                        disabled={revealed}
                        title={level.hint}
                        onClick={() => setRatings((r) => ({ ...r, [comp.id]: level.value }))}
                        className={cn(
                          "relative rounded-2xl border px-2 py-2.5 text-center transition",
                          chosen
                            ? "border-primary bg-primary text-on-primary shadow-level2"
                            : "border-outline-variant hover:border-outline hover:bg-surface-container",
                          isExpert && !chosen && "border-tertiary-container ring-2 ring-tertiary-container",
                        )}
                      >
                        <div className="font-serif text-xl leading-none">{level.value}</div>
                        <div className="mt-1 text-[11px] leading-tight opacity-80">{level.name}</div>
                      </button>
                    );
                  })}
                </div>
                <AnimatePresence>
                  {revealed && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 text-sm text-on-surface-variant"
                    >
                      {scenario.rationale[comp.id]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </Panel>
            );
          })}

          {!revealed ? (
            <div className="flex justify-end">
              <Button size="lg" className={cn(complete && "dash-shine")} disabled={!complete} onClick={() => setRevealed(true)}>
                Compare with the experts
              </Button>
            </div>
          ) : (
            <Panel className="grid items-center gap-6 p-6 md:grid-cols-[auto_1fr]">
              <Radar
                competencies={competencies}
                series={[
                  { label: "Experts", values: scenario.expert, tone: "gold" },
                  { label: "You", values: ratings, tone: "navy" },
                ]}
              />
              <div>
                <div className="font-serif text-4xl">{Math.round(agreement * 100)}%</div>
                <p className="text-on-surface-variant">exact agreement with the expert ratings</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-primary" /> You
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-tertiary-container" /> Experts
                  </span>
                </div>
                <Button
                  className="mt-6"
                  variant="outline"
                  onClick={() => {
                    setRatings({});
                    setRevealed(false);
                  }}
                >
                  <RotateCcw aria-hidden /> Rate again
                </Button>
              </div>
            </Panel>
          )}
        </div>
      </div>
      {note !== null && note !== undefined && <DemoNote>{note}</DemoNote>}
    </div>
  );
}
