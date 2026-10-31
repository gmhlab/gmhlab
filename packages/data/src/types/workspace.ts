import type {
  AccessRequest,
  Account,
  AccountActivity,
  CourseProgress,
  LearningProgress,
  Order,
  OrderLine,
  Photo,
  PhotoUpload,
  PlanSku,
  Profile,
  ProfileSubmission,
  ReviewQueue,
} from "@gmhlab/core";

/**
 * The signed-in account, its own requests and submissions, and — for admins —
 * the review queue. Reloads whenever the auth user changes, so signing in,
 * out or across accounts is picked up without a refresh.
 */
export interface AccountContextType {
  /** null when signed out (or not loaded yet — see `isLoading`). */
  account: Account | null;
  activity: AccountActivity;
  /** Admins only; null for everyone else. */
  queue: ReviewQueue | null;
  /** True until the first load for the current user finishes. */
  isLoading: boolean;
  refresh: () => Promise<void>;
  /** Resolves with the submission filed for review, or null. */
  saveProfile: (profile: Profile) => Promise<ProfileSubmission | null>;
  requestAccess: (input: Pick<AccessRequest, "kind" | "project" | "note">) => Promise<AccessRequest>;
  decideSubmission: (id: string, approve: boolean, note?: string) => Promise<void>;
  decideRequest: (id: string, approve: boolean) => Promise<void>;
}

/** Course progress for the signed-in account. */
export interface LearningContextType {
  progress: LearningProgress;
  isLoading: boolean;
  completeLesson: (courseId: string, lessonId: string) => Promise<CourseProgress>;
  recordQuiz: (courseId: string, score: number) => Promise<CourseProgress>;
  certify: (courseId: string) => Promise<CourseProgress>;
}

/** The photo library. */
export interface MediaContextType {
  photos: Photo[];
  isLoading: boolean;
  upload: (upload: PhotoUpload) => Promise<Photo>;
  remove: (id: string) => Promise<void>;
}

/**
 * Storefront checkout. A successful checkout refreshes the account, since a
 * plan or module was just granted.
 */
export interface CheckoutContextType {
  orders: Order[];
  checkout: (lines: OrderLine[], plan?: PlanSku) => Promise<Order>;
}
