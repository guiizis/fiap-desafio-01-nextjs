import { describe, expect, it, vi } from "vitest";

describe("useAuthSession (server snapshot)", () => {
  it("retorna loading quando o snapshot do servidor e usado", async () => {
    vi.resetModules();
    vi.doMock("react", async () => {
      const actual = await vi.importActual<typeof import("react")>("react");

      return {
        ...actual,
        useSyncExternalStore: (
          _subscribe: (onStoreChange: () => void) => () => void,
          _getClientSnapshot: () => string,
          getServerSnapshot: () => string
        ) => getServerSnapshot(),
      };
    });

    const { renderHook } = await import("@testing-library/react");
    const { useAuthSession } = await import("./use-auth-session");

    const { result } = renderHook(() => useAuthSession());

    expect(result.current).toEqual({
      session: null,
      status: "loading",
    });

    vi.doUnmock("react");
    vi.resetModules();
  });
});
