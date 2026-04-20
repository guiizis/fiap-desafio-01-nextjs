'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '../../../components/ui/button';

type ServiceUnderConstructionModalProps = {
  serviceLabel: string;
  onClose: () => void;
};

export function ServiceUnderConstructionModal({
  serviceLabel,
  onClose,
}: ServiceUnderConstructionModalProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBackToServices = () => {
    onClose();
    router.replace('/dashboard');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-under-construction-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="mx-auto w-full max-w-[620px] rounded-md bg-surface p-5 shadow-xl md:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="service-under-construction-title" className="text-title-xl font-bold text-black">
          Ainda em construção
        </h3>

        <p className="mt-2 text-body-md text-body">
          O serviço {serviceLabel} ainda está sendo preparado.
        </p>

        <Image
          src="/dashboard/under-construction.svg"
          alt="Ilustracao de area em construcao"
          width={960}
          height={600}
          className="mt-5 h-auto w-full rounded-sm border border-border bg-background"
        />

        <div className="mt-5 flex justify-center">
          <Button type="button" variant="solid" tone="accent" onClick={handleBackToServices}>
            Voltar para serviços
          </Button>
        </div>
      </div>
    </div>
  );
}
