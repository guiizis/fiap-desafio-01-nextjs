export function MobileMenuButton() {
  return (
    <button
      type="button"
      aria-label="Abrir menu de navegação"
      className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-secondary hover:bg-secondary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer disabled:cursor-not-allowed"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M5 7h14" />
        <path d="M5 12h14" />
        <path d="M5 17h14" />
      </svg>
    </button>
  );
}
