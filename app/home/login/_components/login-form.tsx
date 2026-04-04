import Image from "next/image";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

type LoginFormLayout = "page" | "modal";

type LoginFormProps = {
  layout?: LoginFormLayout;
};

export function LoginForm({ layout = "page" }: LoginFormProps) {
  const isModal = layout === "modal";

  return (
    <div className={isModal ? "w-full" : "w-full rounded-lg bg-surface p-6 shadow-sm md:p-8"}>
      <div className="mb-6 flex justify-center">
        <Image
          src="/home/login/login.svg"
          alt="Ilustracao de login"
          width={333}
          height={267}
          className={isModal ? "h-auto w-full max-w-[260px]" : "h-auto w-full max-w-[320px]"}
          priority
        />
      </div>

      <h1 className="mb-6 text-center text-title-lg font-bold text-heading">Login</h1>

      <form className="space-y-4" action="#">
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="Digite seu email"
        />

        <Input
          label="Senha"
          id="senha"
          name="senha"
          type="password"
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
          >
            Acessar
          </Button>
        </div>
      </form>
    </div>
  );
}
