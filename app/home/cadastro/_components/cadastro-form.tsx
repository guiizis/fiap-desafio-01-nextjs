"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

type CadastroFormLayout = "page" | "modal";

type CadastroFormProps = {
  layout?: CadastroFormLayout;
};

export function CadastroForm({ layout = "page" }: CadastroFormProps) {
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
          src="/home/login/new-account.svg"
          alt="Ilustração de abertura de conta"
          width={355}
          height={262}
          className={isModal ? "h-auto w-full max-w-[280px]" : "h-auto w-full max-w-[320px]"}
          priority
        />
      </div>

      <h1 className="mb-6 text-title-lg font-bold text-heading">
        Preencha os campos abaixo para criar sua conta corrente!
      </h1>

      <form
        className="space-y-4"
        action="#"
        onInput={updateFormValidity}
        onChange={updateFormValidity}
      >
        <Input
          label="Nome"
          id="nome"
          name="nome"
          type="text"
          validationKind="name"
          placeholder="Digite seu nome completo"
        />

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
          inputClassName={isModal ? "max-w-[165px] mobile:max-w-none" : undefined}
        />

        <label className="flex items-start gap-2 pt-1 text-body-sm text-body">
          <input
            type="checkbox"
            name="consentimento"
            className="mt-0.5 h-4 w-4 rounded border-border text-secondary focus:ring-secondary"
          />
          <span>
            Li e estou ciente quanto às condições de tratamento dos meus dados conforme descrito na Política de Privacidade do banco.
          </span>
        </label>

        <div className={isModal ? "flex justify-center pt-2" : "pt-2"}>
          <Button
            type="submit"
            variant="solid"
            tone="accent"
            className="h-11 min-w-[124px] justify-center"
            disabled={!isFormValid}
          >
            Criar conta
          </Button>
        </div>
      </form>
    </div>
  );
}
