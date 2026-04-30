'use client';

import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

type ModalShellProps = {
  children: ReactNode;
  closeLabel?: string;
  panelClassName?: string;
  contentClassName?: string;
};

export function ModalShell({
  children,
  closeLabel = 'Fechar cadastro',
  panelClassName = 'max-w-[470px] bg-[#f3f3f3]',
  contentClassName = 'px-6 pb-8 pt-4 md:px-10 md:pt-6',
}: ModalShellProps) {
  const closeModal = () => {
    redirect('/home');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 px-4 py-6"
      role="dialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <div
        className={`mx-auto h-full w-full overflow-y-auto shadow-xl ${panelClassName}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`relative ${contentClassName}`}>
          <Button
            type="button"
            variant="ghost"
            tone="primary"
            aria-label={closeLabel}
            onClick={closeModal}
            className="absolute right-3 top-3 z-20 h-11 w-11 rounded-sm bg-surface p-0 text-title-lg text-text-heading shadow-sm hover:bg-surface-soft md:right-4 md:h-8 md:w-8 md:text-body"
          >
            x
          </Button>
          {children}
        </div>
      </div>
    </div>
  );
}
