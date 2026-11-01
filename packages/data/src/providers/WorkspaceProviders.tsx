import type {
  Account,
  AccountActivity,
  AccountService,
  CheckoutService,
  LearningProgress,
  LearningService,
  MediaService,
  Order,
  Photo,
  PublishedProfile,
  ReviewQueue,
} from "@gmhlab/core";
import { type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  AccountContext,
  CheckoutContext,
  LearningContext,
  MediaContext,
  ProfilesContext,
} from "../contexts/WorkspaceContexts";

/**
 * The member workspace's providers. Each takes its backend as a required
 * `service` prop (stable references — a new object re-runs the load), and
 * each reloads when the signed-in user changes, which it reads from an
 * enclosing `AuthProvider`. Render them inside one.
 */

/** The auth user's id, or null — the key every workspace load follows. */
function useUserKey(): string | null {
  return useContext(AuthContext)?.user?.id ?? null;
}

const NO_ACTIVITY: AccountActivity = { requests: [], submissions: [] };

export function AccountProvider({ service, children }: { service: AccountService; children?: ReactNode }) {
  const userKey = useUserKey();
  const [account, setAccount] = useState<Account | null>(null);
  const [activity, setActivity] = useState<AccountActivity>(NO_ACTIVITY);
  const [queue, setQueue] = useState<ReviewQueue | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await service.getAccount();
    const [nextActivity, nextQueue] = await Promise.all([
      next ? service.getActivity() : NO_ACTIVITY,
      next?.tier === "admin" ? service.getReviewQueue() : null,
    ]);
    setAccount(next);
    setActivity(nextActivity);
    setQueue(nextQueue);
  }, [service]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    refresh().finally(() => {
      if (!cancelled) setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [refresh, userKey]);

  const after = useCallback(
    <T,>(run: () => Promise<T>) =>
      async () => {
        const result = await run();
        await refresh();
        return result;
      },
    [refresh],
  );

  const value = useMemo(
    () => ({
      account,
      activity,
      queue,
      isLoading,
      refresh,
      saveProfile: (profile: Parameters<AccountService["saveProfile"]>[0]) =>
        after(() => service.saveProfile(profile))(),
      requestAccess: (input: Parameters<AccountService["requestAccess"]>[0]) =>
        after(() => service.requestAccess(input))(),
      decideSubmission: (id: string, approve: boolean, note?: string) =>
        after(() => service.decideSubmission(id, approve, note))(),
      decideRequest: (id: string, approve: boolean) => after(() => service.decideRequest(id, approve))(),
    }),
    [account, activity, queue, isLoading, refresh, after, service],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function LearningProvider({ service, children }: { service: LearningService; children?: ReactNode }) {
  const userKey = useUserKey();
  const [progress, setProgress] = useState<LearningProgress>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    service
      .getProgress()
      .then((p) => !cancelled && setProgress(p))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [service, userKey]);

  const value = useMemo(() => {
    const apply = (courseId: string) => (next: Awaited<ReturnType<LearningService["certify"]>>) => {
      setProgress((p) => ({ ...p, [courseId]: next }));
      return next;
    };
    return {
      progress,
      isLoading,
      completeLesson: (courseId: string, lessonId: string) =>
        service.completeLesson(courseId, lessonId).then(apply(courseId)),
      recordQuiz: (courseId: string, score: number) => service.recordQuiz(courseId, score).then(apply(courseId)),
      certify: (courseId: string) => service.certify(courseId).then(apply(courseId)),
    };
  }, [progress, isLoading, service]);

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function MediaProvider({ service, children }: { service: MediaService; children?: ReactNode }) {
  const userKey = useUserKey();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    service
      .listPhotos()
      .then((p) => !cancelled && setPhotos(p))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [service, userKey]);

  const value = useMemo(
    () => ({
      photos,
      isLoading,
      upload: async (upload: Parameters<MediaService["uploadPhoto"]>[0]) => {
        const photo = await service.uploadPhoto(upload);
        setPhotos((list) => [photo, ...list]);
        return photo;
      },
      remove: async (id: string) => {
        await service.removePhoto(id);
        setPhotos((list) => list.filter((p) => p.id !== id));
      },
    }),
    [photos, isLoading, service],
  );

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
}

/** Render inside an `AccountProvider`: checkout refreshes the account. */
export function CheckoutProvider({ service, children }: { service: CheckoutService; children?: ReactNode }) {
  const userKey = useUserKey();
  const refreshAccount = useContext(AccountContext)?.refresh;
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    let cancelled = false;
    service.getOrders().then((o) => !cancelled && setOrders(o));
    return () => {
      cancelled = true;
    };
  }, [service, userKey]);

  const value = useMemo(
    () => ({
      orders,
      checkout: async (...args: Parameters<CheckoutService["checkout"]>) => {
        const order = await service.checkout(...args);
        setOrders((list) => [order, ...list]);
        await refreshAccount?.();
        return order;
      },
    }),
    [orders, service, refreshAccount],
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export type WorkspaceServices = {
  account: AccountService;
  learning: LearningService;
  media: MediaService;
  checkout: CheckoutService;
};

/**
 * The four workspace providers in order. Renders no DOM. Mount it only where
 * the workspace is used (the dashboard's layout), inside `AllProviders`.
 */
export function WorkspaceProviders({ services, children }: { services: WorkspaceServices; children?: ReactNode }) {
  return (
    <AccountProvider service={services.account}>
      <LearningProvider service={services.learning}>
        <MediaProvider service={services.media}>
          <CheckoutProvider service={services.checkout}>{children}</CheckoutProvider>
        </MediaProvider>
      </LearningProvider>
    </AccountProvider>
  );
}

/**
 * The approved public profiles (`AccountService.getPublishedProfiles`), for
 * the public site. Mount it at the root — it needs no session — and call
 * `refresh` where the profiles show, since approvals happen elsewhere.
 */
export function ProfilesProvider({ service, children }: { service: AccountService; children?: ReactNode }) {
  const [profiles, setProfiles] = useState<PublishedProfile[]>([]);
  const refresh = useCallback(async () => {
    setProfiles(await service.getPublishedProfiles());
  }, [service]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  const value = useMemo(() => ({ profiles, refresh }), [profiles, refresh]);
  return <ProfilesContext.Provider value={value}>{children}</ProfilesContext.Provider>;
}
