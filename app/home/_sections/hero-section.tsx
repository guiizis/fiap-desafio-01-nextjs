import Image from "next/image";

export function HeroSection() {
  return (
    <section className="w-full pt-10 md:pt-14" aria-labelledby="hero-section-title">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-4 lg:flex-row lg:justify-between lg:gap-10 lg:px-6">
        <div className="max-w-xl">
          <h1
            id="hero-section-title"
            className="text-center text-title-xl font-bold leading-tight text-black lg:text-left"
          >
            Experimente mais liberdade no controle da sua vida financeira.
            <br />
            Crie sua conta com a gente!
          </h1>
        </div>

        <Image
          src="/home/hero-img.svg"
          alt="Ilustracao de crescimento financeiro"
          width={590}
          height={408}
          priority
          className="h-auto w-full max-w-[590px]"
        />
      </div>
    </section>
  );
}
