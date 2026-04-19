export type ServicesTabKey =
  | "inicio"
  | "transferencias"
  | "investimentos"
  | "outros-servicos"
  | "meus-cartoes";

type ServicesSidebarItem = {
  key: ServicesTabKey;
  label: string;
  disabled?: boolean;
};

type ServicesSidebarNavProps = {
  items: readonly ServicesSidebarItem[];
  activeItem: ServicesTabKey;
  onChange: (key: ServicesTabKey) => void;
};

export function ServicesSidebarNav({ items, activeItem, onChange }: ServicesSidebarNavProps) {
  return (
    <nav
      aria-label="Menu de servicos"
      className="h-full rounded-none bg-transparent px-0 py-0 xl:rounded-md xl:bg-surface xl:px-4 xl:py-5"
    >
      <ul className="flex flex-wrap items-center gap-4 border-b border-secondary/40 pb-2 md:gap-5 xl:block xl:border-b-0 xl:pb-0">
        {items.map((item) => {
          const isDisabled = Boolean(item.disabled);
          const isActive = item.key === activeItem && !isDisabled;

          return (
            <li key={item.key} className="shrink-0">
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onChange(item.key)}
                className={[
                  "w-auto border-b border-transparent px-0 py-1 text-left text-body-sm transition-colors xl:w-full xl:border-b xl:border-border xl:py-3 xl:text-body-md",
                  isActive
                    ? "font-semibold text-secondary"
                    : isDisabled
                      ? "cursor-not-allowed font-normal text-menu-disabled"
                      : "font-normal text-heading hover:text-secondary",
                ].join(" ")}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
