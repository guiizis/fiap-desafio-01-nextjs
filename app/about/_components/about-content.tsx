type AboutContentProps = {
  variant?: 'page' | 'modal';
};

export function AboutContent({ variant = 'page' }: AboutContentProps) {
  const isModal = variant === 'modal';

  return (
    <article
      className={`relative overflow-hidden bg-surface text-text-body ${
        isModal ? 'min-h-full' : 'mx-auto w-full max-w-5xl shadow-lg'
      }`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-surface)_0%,rgba(255,176,0,0.12)_52%,var(--color-surface)_100%)]" />
      <div className="absolute inset-0 bg-[url('/about/about.svg')] bg-contain bg-center bg-no-repeat opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.84)_0%,rgba(255,255,255,0.62)_52%,rgba(255,255,255,0.44)_100%)]" />

      <div
        className={`relative flex min-h-full flex-col ${
          isModal ? 'px-6 py-12 md:px-10' : 'px-6 py-14 md:px-12'
        }`}
      >
        <header className="max-w-2xl space-y-3">
          <p className="text-body-md font-semibold text-secondary">Seu dinheiro em boas patas</p>
          <h1 className="text-title-xl font-bold text-text-heading">Sobre o McIntosh Bank</h1>
        </header>

        <div className="mt-10 flex-1 space-y-5 text-body-md leading-relaxed text-text-body">
          <p>
            O McIntosh Bank une uma experiencia digital fluida com a lealdade de quem cuida de
            cada centavo como se fosse unico.
          </p>
          <p>
            Criamos fluxos baseados em clareza e autonomia, garantindo que seu patrimonio esteja
            sempre em boas patas.
          </p>
        </div>

        <footer className="mt-12 border-t border-border pt-6">
          <p className="text-body-sm font-semibold uppercase text-secondary">
            Primeiro Tech Challenge Engenharia Front-end FIAP 2026
          </p>
          <p className="mt-3 text-body-md leading-relaxed text-text-body">
            O nome McIntosh Bank nasceu de uma homenagem a fiel companheira de um de nossos
            fundadores. E, embora a Mcintosh original se assuste ate com a propria sombra, levamos
            a seguranca do seu patrimonio a serio. Aqui, a lealdade e inspirada por ela, mas a
            protecao dos seus dados e de gente grande.
          </p>
        </footer>
      </div>
    </article>
  );
}
