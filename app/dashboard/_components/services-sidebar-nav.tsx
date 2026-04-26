export type DashboardTabKey =
  | 'home'
  | 'transactions'
  | 'investments'
  | 'other-services'
  | 'my-cards';

type DashboardSidebarItem = {
  key: DashboardTabKey;
  label: string;
  disabled?: boolean;
};

type DashboardSidebarNavProps = {
  items: readonly DashboardSidebarItem[];
  activeItem: DashboardTabKey;
  onChange: (key: DashboardTabKey) => void;
};

export function DashboardSidebarNav({ items, activeItem, onChange }: DashboardSidebarNavProps) {
  return (
    <nav aria-label="Menu de dashboard" className="h-full rounded-md bg-surface px-4 py-5">
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
                  'w-full border-b border-border py-3 text-left text-body-md transition-colors',
                  isActive
                    ? 'font-semibold text-secondary'
                    : isDisabled
                      ? 'cursor-not-allowed font-normal text-menu-disabled'
                      : 'font-normal text-heading hover:text-secondary',
                ].join(' ')}
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
