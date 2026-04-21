export type RequestVersionTracker = {
  next: () => number;
  isActive: (version: number) => boolean;
};

export function createRequestVersionTracker(): RequestVersionTracker {
  let activeVersion = 0;

  return {
    next: () => {
      activeVersion += 1;
      return activeVersion;
    },
    isActive: (version: number) => version === activeVersion,
  };
}

