"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ComponentType } from "react";
import type { AuthSession } from "../../lib/auth-session";
import type { AuthSessionStatus } from "../_hooks/use-auth-session";

type WithAuthControlProps = {
  authStatus: AuthSessionStatus;
  session: AuthSession | null;
};

function composeComponentProps<TComponentProps extends { session: AuthSession }>(
  componentProps: Omit<TComponentProps, "session">,
  session: AuthSession
) {
  return {
    ...componentProps,
    session,
  } as TComponentProps;
}

export function withAuth<TComponentProps extends { session: AuthSession }>(
  Component: ComponentType<TComponentProps>
) {
  type ComponentPropsWithoutSession = Omit<TComponentProps, "session">;

  return function AuthGuardedComponent(props: ComponentPropsWithoutSession & WithAuthControlProps) {
    const router = useRouter();
    const { authStatus, session, ...componentProps } = props;

    useEffect(() => {
      if (authStatus === "unauthenticated") {
        router.replace("/home/login");
      }
    }, [authStatus, router]);

    if (authStatus !== "authenticated" || !session) {
      return null;
    }

    const resolvedProps = composeComponentProps(
      componentProps as unknown as ComponentPropsWithoutSession,
      session
    );

    return <Component {...resolvedProps} />;
  };
}
