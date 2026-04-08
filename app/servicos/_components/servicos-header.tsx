type ServicosHeaderProps = {
  userName: string;
};

export function ServicosHeader({ userName }: ServicosHeaderProps) {
  return (
    <header className="w-full bg-primary text-surface">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-end gap-4 px-4 py-4 md:px-6">
        <span className="text-body-sm">{userName}</span>
        <button
          type="button"
          aria-label="Perfil do usuario"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-accent text-accent"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
            <circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M5 19c1.8-3 4.2-4.5 7-4.5S17.2 16 19 19"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
