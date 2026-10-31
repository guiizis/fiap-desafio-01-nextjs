'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { bankApi, useLoginMutation } from '@/app/dashboard/_state/bank-api';
import { useAppDispatch } from '@/app/dashboard/_state/hooks';

type LoginFormLayout = 'page' | 'modal';

type LoginFormProps = {
  layout?: LoginFormLayout;
};

export function LoginForm({ layout = 'page' }: LoginFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const isModal = layout === 'modal';
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    variant: 'success' | 'error';
    message: string;
  } | null>(null);

  const isFormElementValid = (formElement: HTMLFormElement) => {
    return Array.from(formElement.elements).every((element) => {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement
      ) {
        return !element.willValidate || element.validity.valid;
      }

      return true;
    });
  };

  const updateFormValidity: FormEventHandler<HTMLFormElement> = (event) => {
    setIsFormValid(isFormElementValid(event.currentTarget));
  };

  const submitLogin = async (formElement: HTMLFormElement) => {
    setIsSubmitting(true);
    setFeedback(null);

    const formData = new FormData(formElement);
    const payload = {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    };

    try {
      const result = await login(payload).unwrap();
      await dispatch(bankApi.util.upsertQueryData('getSession', undefined, { user: result.user }));
      router.push('/dashboard/home');
    } catch (error) {
      const data = typeof error === 'object' && error && 'data' in error ? error.data : null;
      const message =
        typeof data === 'object' && data && 'message' in data && typeof data.message === 'string'
          ? data.message
          : 'Não foi possível realizar o login. Tente novamente.';
      setFeedback({ variant: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    void submitLogin(event.currentTarget);
  };

  const handleAlertClose = () => setFeedback(null);

  return (
    <div className={isModal ? 'w-full' : 'w-full rounded-lg bg-surface p-6 shadow-sm md:p-8'}>
      <div className="mb-6 flex justify-center">
        <Image
          src="/home/login/login.svg"
          alt="Ilustração de login"
          width={333}
          height={267}
          className={isModal ? 'h-auto w-full max-w-[260px]' : 'h-auto w-full max-w-[320px]'}
          priority
        />
      </div>

      <h1 className="mb-6 text-center text-title-lg font-bold text-heading">Login</h1>

      <form
        className="space-y-4"
        noValidate
        onInput={updateFormValidity}
        onChange={updateFormValidity}
        onSubmit={handleSubmit}
      >
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          validationKind="email"
          placeholder="Digite seu email"
        />

        <Input
          label="Senha"
          id="password"
          name="password"
          type="password"
          validationKind="password"
          placeholder="Digite sua senha"
        />

        <a
          href="#"
          className="inline-block text-body-xs font-semibold text-primary underline hover:text-primary-hover"
        >
          Esqueci a senha!
        </a>

        {feedback ? (
          <div className="pt-2">
            <Alert
              variant={feedback.variant}
              message={feedback.message}
              dismissAfterMs={5000}
              onClose={handleAlertClose}
              className="w-full"
            />
          </div>
        ) : null}

        <div className={isModal ? 'flex justify-center pt-2' : 'pt-2'}>
          <Button
            type="submit"
            variant="solid"
            tone="accent"
            className="h-11 min-w-[124px] justify-center"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Entrando...' : 'Acessar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
