"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type ModalShellProps = {
  children: ReactNode;
};

export function ModalShell({ children }: ModalShellProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 px-4 py-6" role="dialog" aria-modal="true">
      <div className="mx-auto h-full w-full max-w-[470px] overflow-y-auto bg-[#f3f3f3] shadow-xl">
        <div className="relative px-6 pb-8 pt-4 md:px-10 md:pt-6">
          <button
            type="button"
            aria-label="Fechar cadastro"
            onClick={() => router.back()}
            className="absolute right-4 top-3 inline-flex h-8 w-8 items-center justify-center rounded-sm text-body hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            x
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}