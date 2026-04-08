export type ServicesTabKey =
  | "inicio"
  | "transferencias"
  | "investimentos"
  | "outros-servicos"
  | "meus-cartoes";

type ServicesSidebarItem = {
  key: ServicesTabKey;
  label: string;
};

type ServicesSidebarNavProps = {
  items: readonly ServicesSidebarItem[];
  activeItem: ServicesTabKey;
  onChange: (key: ServicesTabKey) => void;
};

export function ServicesSidebarNav({ items, activeItem, onChange }: ServicesSidebarNavProps) {
  return (
    <nav aria-label="Menu de servicos" className="rounded-md bg-surface p-4">
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = item.key === activeItem;

          return (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => onChange(item.key)}
                className={[
                  "w-full border-b border-border py-2 text-left text-body-md transition-colors",
                  isActive
                    ? "font-semibold text-secondary"
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
