import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { FavoritesProvider, useFavorites } from "../FavoritesContext";

type FavoritesSnapshot = ReturnType<typeof useFavorites>;

function createSnapshotProbe(onSnapshot: (snapshot: FavoritesSnapshot) => void) {
  return function SnapshotProbe() {
    const favorites = useFavorites();
    React.useEffect(() => {
      onSnapshot(favorites);
    }, [favorites]);
    return null;
  };
}

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

async function flushAsync(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe("FavoritesContext unmount guards", () => {
  let latestSnapshot: FavoritesSnapshot | null = null;
  const asyncStorageMock = AsyncStorage as unknown as {
    getItem: jest.Mock;
    setItem: jest.Mock;
    removeItem: jest.Mock;
  };

  beforeEach(() => {
    latestSnapshot = null;
    jest.clearAllMocks();
    asyncStorageMock.getItem.mockResolvedValue(null);
    asyncStorageMock.setItem.mockResolvedValue(undefined);
    asyncStorageMock.removeItem.mockResolvedValue(undefined);
  });

  it("does not warn on unmount during async initial load", async () => {
    const deferredLoad = createDeferred<string | null>();
    asyncStorageMock.getItem.mockImplementation(() => deferredLoad.promise);
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const SnapshotProbe = createSnapshotProbe((snapshot) => {
      latestSnapshot = snapshot;
    });

    let tree: TestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = TestRenderer.create(
        <FavoritesProvider>
          <SnapshotProbe />
        </FavoritesProvider>,
      );
    });

    await act(async () => {
      tree!.unmount();
    });
    deferredLoad.resolve(JSON.stringify(["car-1"]));
    await flushAsync();

    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Can't perform a React state update on an unmounted component"),
    );
    consoleErrorSpy.mockRestore();
  });

  it("does not warn on unmount while persist queue is in-flight", async () => {
    const deferredPersist = createDeferred<void>();
    asyncStorageMock.setItem.mockImplementation(() => deferredPersist.promise);
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const SnapshotProbe = createSnapshotProbe((snapshot) => {
      latestSnapshot = snapshot;
    });

    let tree: TestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = TestRenderer.create(
        <FavoritesProvider>
          <SnapshotProbe />
        </FavoritesProvider>,
      );
    });
    await flushAsync();

    await act(async () => {
      latestSnapshot?.setFavorite("car-1", true);
      await Promise.resolve();
    });

    await act(async () => {
      tree!.unmount();
    });
    deferredPersist.resolve(undefined);
    await flushAsync();

    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Can't perform a React state update on an unmounted component"),
    );
    consoleErrorSpy.mockRestore();
  });
});
