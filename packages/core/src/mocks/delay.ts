/** Simulated network latency, so loading states are visible in demos. */
export const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
