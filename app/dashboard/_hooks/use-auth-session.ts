"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  AUTH_SESSION_CHANGED_EVENT,
  AUTH_SESSION_STORAGE_KEY,
  parseAuthSession,
  setAuthSession,
  type AuthSession,
} from "../../lib/auth-session";

export type AuthSessionStatus = "loading" | "authenticated" | "unauthenticated";

type UseAuthSessionResult = {
  session: AuthSession | null;
  status: AuthSessionStatus;
};

const SERVER_SNAPSHOT = "__server_snapshot__";
const EMPTY_SNAPSHOT = "__empty_snapshot__";

function subscribe(onStoreChange: () => void) {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.storageArea !== window.sessionStorage) {
      return;
    }

    if (event.key && event.key !== AUTH_SESSION_STORAGE_KEY) {
      return;
    }

    onStoreChange();
  };

  const handleSessionChangedEvent = () => onStoreChange();

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChangedEvent);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, handleSessionChangedEvent);
  };
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

function getClientSnapshot() {
  return window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY) ?? EMPTY_SNAPSHOT;
}

export function useAuthSession(): UseAuthSessionResult {
  const serializedSession = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const session =
    serializedSession === SERVER_SNAPSHOT || serializedSession === EMPTY_SNAPSHOT
      ? null
      : parseAuthSession(serializedSession);

  useEffect(() => {
    if (!session || serializedSession === SERVER_SNAPSHOT || serializedSession === EMPTY_SNAPSHOT) {
      return;
    }

    const normalizedSerializedSession = JSON.stringify(session);

    if (normalizedSerializedSession !== serializedSession) {
      setAuthSession(session);
    }
  }, [serializedSession, session]);

  if (serializedSession === SERVER_SNAPSHOT) {
    return {
      session: null,
      status: "loading",
    };
  }

  if (serializedSession === EMPTY_SNAPSHOT || !session) {
    return {
      session: null,
      status: "unauthenticated",
    };
  }

  return {
    session,
    status: "authenticated",
  };
}
