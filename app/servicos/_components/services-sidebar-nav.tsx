import { useState } from "react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSelectItem = (item: ServicesSidebarItem) => {
    if (item.disabled) {
      return;
    }

    onChange(item.key);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav aria-label="Menu de servicos" className="relative desktop:h-full desktop:w-full">
      <div className="relative mb-2 md:hidden">
        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Fechar menu de servicos" : "Abrir menu de servicos"}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          className="inline-flex h-8 w-8 items-center justify-center text-secondary"
        >
          <span aria-hidden="true" className="text-title-lg leading-none">
            {isMobileMenuOpen ? "×" : "☰"}
          </span>
        </button>

        {isMobileMenuOpen ? (
          <div className="absolute left-0 top-0 z-20 w-[142px] border border-border bg-surface px-3 py-2 shadow-md">
            <button
              type="button"
              aria-label="Fechar menu de servicos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute right-2 top-2 inline-flex h-4 w-4 items-center justify-center text-secondary"
            >
              <span aria-hidden="true">×</span>
            </button>

            <ul className="space-y-0 pr-3">
              {items.map((item) => {
                const isDisabled = Boolean(item.disabled);
                const isActive = item.key === activeItem && !isDisabled;

                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleSelectItem(item)}
                      className={[
                        "w-full border-b border-border py-2 text-left text-body-sm transition-colors",
                        isActive
                          ? "font-semibold text-accent"
                          : isDisabled
                            ? "cursor-not-allowed font-normal text-menu-disabled"
                            : "font-normal text-heading",
                      ].join(" ")}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>

      <ul className="hidden md:flex md:flex-wrap md:items-center md:gap-8 md:border-b md:border-secondary/40 md:pb-2 desktop:h-full desktop:w-full desktop:flex-col desktop:items-stretch desktop:gap-0 desktop:rounded-md desktop:border desktop:border-border desktop:bg-surface desktop:px-5 desktop:py-4 desktop:shadow-sm desktop:border-b-0">
        {items.map((item) => {
          const isDisabled = Boolean(item.disabled);
          const isActive = item.key === activeItem && !isDisabled;

          return (
            <li
              key={item.key}
              className="shrink-0 desktop:w-full desktop:border-b desktop:border-border desktop:last:border-b-0"
            >
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => handleSelectItem(item)}
                className={[
                  "w-auto border-b border-transparent px-0 py-1 text-left text-body-md transition-colors desktop:w-full desktop:border-0 desktop:py-3",
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
