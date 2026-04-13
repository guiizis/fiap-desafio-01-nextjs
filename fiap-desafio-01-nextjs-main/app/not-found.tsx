import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "../components/ui/button";
import { HomeFooter } from "./home/_components/home-footer";
import { HomeHeader } from "./home/_components/home-header";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <HomeHeader />

      <main className="flex flex-1 bg-[linear-gradient(180deg,var(--color-primary)_0%,var(--color-background)_72%)]">
        <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center px-4 pb-12 pt-10 text-center md:px-6 md:pt-12">
          <h1 className="text-title-lg font-bold text-black">Ops! Não encontramos a página...</h1>

          <p className="mt-3 max-w-2xl text-body-md text-black">
            E olha que exploramos o universo procurando por ela!
            <br />
            Que tal voltar e tentar novamente?
          </p>

          <Link
            href="/home"
            className={buttonVariants({
              variant: "solid",
              tone: "accent",
              className: "mt-5 px-5",
            })}
          >
            Voltar ao início
          </Link>

          <Image
            src="/errors/not-found.svg"
            alt="Ilustração de erro 404"
            width={473}
            height={354}
            priority
            className="mt-8 h-auto w-full max-w-[473px] md:mt-10"
          />
        </section>
      </main>

      <HomeFooter />
    </div>
  );
}
