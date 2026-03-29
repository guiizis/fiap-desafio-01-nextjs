import Link from "next/link";
import { buttonVariants } from "../../../components/ui/button";
import { Logo } from "../../../components/ui/logo";

export function HomeHeader() {
  return (
    <header className="w-full bg-black">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-8 lg:gap-12">
            <Logo
              size="lg"
              variant="full"
              tone="secondary"
              priority
              alt="McIntosh Bank"
            />
          <nav aria-label="Navegação Header">
            <ul className="flex items-center gap-6">
              <li>
                <Link
                  href="/sobre"
                  className="text-body-md font-semibold text-secondary hover:text-menu-hover"
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  href="/servicos"
                  className="text-body-md font-semibold text-secondary hover:text-menu-hover"
                >
                  Serviços
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/abrir-conta"
            className={buttonVariants({
              variant: "solid",
              tone: "secondary",
              className: "px-6",
            })}
          >
            Abrir minha conta
          </Link>
          <Link
            href="/login"
            className={buttonVariants({
              variant: "outline",
              tone: "secondary",
              className: "px-6",
            })}
          >
            Já tenho conta
          </Link>
        </div>
      </div>
    </header>
  );
}
