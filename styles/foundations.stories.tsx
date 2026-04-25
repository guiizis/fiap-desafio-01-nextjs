import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Styles/Foundations"
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const colorTokens = [
  ["background", "bg-background"],
  ["surface", "bg-surface"],
  ["surface-muted", "bg-surface-muted"],
  ["surface-soft", "bg-surface-soft"],
  ["primary", "bg-primary"],
  ["secondary", "bg-secondary"],
  ["accent", "bg-accent"],
  ["menu.active", "bg-menu-active"],
  ["menu.hover", "bg-menu-hover"],
  ["menu.disabled", "bg-menu-disabled"]
] as const;

export const Overview: Story = {
  render: () => (
    <div className="space-y-10">
      <section className="surface-panel space-y-2 p-6">
        <h1 className="text-title-xl font-semibold text-heading">Foundations</h1>
        <p className="text-body-sm text-subtle">
          Story inicial para validar tokens de cor, tipografia, spacing e radius.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {colorTokens.map(([name, className]) => (
          <div key={name} className="surface-panel overflow-hidden">
            <div className={`h-24 ${className}`} />
            <div className="space-y-1 p-4">
              <p className="text-body-md font-medium text-heading">{name}</p>
              <p className="text-body-sm text-subtle">{className}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="surface-panel grid gap-4 p-6 md:grid-cols-3">
        <div className="rounded-sm border border-border bg-surface-soft p-4 text-body-sm">
          Radius sm
        </div>
        <div className="rounded-md border border-border bg-surface-soft p-4 text-body-sm">
          Radius md
        </div>
        <div className="rounded-lg border border-border bg-surface-soft p-4 text-body-sm">
          Radius lg
        </div>
      </section>

      <section className="surface-panel grid gap-2 p-6">
        <p className="text-title-xl font-semibold text-heading">text-title-xl</p>
        <p className="text-title-lg font-semibold text-heading">text-title-lg</p>
        <p className="text-body-md text-body">text-body-md</p>
        <p className="text-body-sm text-subtle">text-body-sm</p>
      </section>
    </div>
  )
};
