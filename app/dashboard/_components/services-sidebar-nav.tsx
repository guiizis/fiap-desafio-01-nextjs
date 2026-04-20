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
    <nav aria-label="Menu de servicos" className="h-full rounded-md bg-surface px-4 py-5">
      <ul className="space-y-0">
        {items.map((item) => {
          const isDisabled = Boolean(item.disabled);
          const isActive = item.key === activeItem && !isDisabled;

          return (
            <li key={item.key}>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onChange(item.key)}
                className={[
                  "w-full border-b border-border py-3 text-left text-body-md transition-colors",
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
