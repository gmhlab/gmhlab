"use client";

import { CoursePlayer, type DashboardLinkComponent, LockedModule } from "@gmhlab/blocks";
import { canAccess } from "@gmhlab/core";
import { useAccount, useLearning } from "@gmhlab/data";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { DASHBOARD_MODULES } from "@/content/dashboard-modules";
import { EQUIP_DEMO_NOTE } from "@/content/dashboard-notes";
import { COURSES } from "@/content/equip-training";

const NextLink = Link as unknown as DashboardLinkComponent;

export default function CourseRoute() {
  const { course: id } = useParams<{ course: string }>();
  const { account } = useAccount();
  const learning = useLearning();
  const course = COURSES.find((c) => c.id === id);
  if (!course) notFound();
  if (!account) return null;

  if (!canAccess(account, course)) {
    const pack = DASHBOARD_MODULES.find((m) => m.id === "equip")!;
    return (
      <LockedModule
        module={{ ...pack, title: course.title, tagline: course.tagline, access: course.access, price: undefined }}
        storeHref="/dashboard#store"
        linkComponent={NextLink}
      />
    );
  }

  return (
    <CoursePlayer
      key={`${course.id}-${account.id}`}
      course={course}
      progress={learning.progress[course.id]}
      learnerName={account.name}
      backHref="/dashboard/equip"
      onCompleteLesson={(lessonId) => learning.completeLesson(course.id, lessonId)}
      onQuizSubmit={(score) => learning.recordQuiz(course.id, score)}
      onCertify={() => learning.certify(course.id)}
      note={EQUIP_DEMO_NOTE}
      linkComponent={NextLink}
    />
  );
}
