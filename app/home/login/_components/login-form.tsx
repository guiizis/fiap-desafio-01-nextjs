"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

type LoginFormLayout = "page" | "modal";

type LoginFormProps = {
  layout?: LoginFormLayout;
};

export function LoginForm({ layout = "page" }: LoginFormProps) {
  const isModal = layout === "modal";
  const [isFormValid, setIsFormValid] = useState(false);

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

  const updateFormValidity = (event: FormEvent<HTMLFormElement>) => {
    setIsFormValid(isFormElementValid(event.currentTarget));
  };

  return (
    <div className={isModal ? "w-full" : "w-full rounded-lg bg-surface p-6 shadow-sm md:p-8"}>
      <div className="mb-6 flex justify-center">
        <Image
          src="/home/login/login.svg"
          alt="Ilustração de login"
          width={333}
          height={267}
          className={isModal ? "h-auto w-full max-w-[260px]" : "h-auto w-full max-w-[320px]"}
          priority
        />
      </div>

      <h1 className="mb-6 text-center text-title-lg font-bold text-heading">Login</h1>

      <form
        className="space-y-4"
        action="#"
        onInput={updateFormValidity}
        onChange={updateFormValidity}
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
          id="senha"
          name="senha"
          type="password"
          validationKind="password"
          placeholder="Digite sua senha"
        />

        <a
          href="#"
          className="inline-block text-body-xs font-semibold text-secondary underline hover:text-menu-hover"
        >
          Esqueci a senha!
        </a>

        <div className={isModal ? "flex justify-center pt-2" : "pt-2"}>
          <Button
            type="submit"
            variant="solid"
            tone="accent"
            className="h-11 min-w-[124px] justify-center"
            disabled={!isFormValid}
          >
            Acessar
          </Button>
        </div>
      </form>
    </div>
  );
}
