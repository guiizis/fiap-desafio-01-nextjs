import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./statement-panel", () => ({
  StatementPanel: ({
    onDeleteEntry,
    onEditEntry,
  }: {
    onDeleteEntry?: (entryId: string) => void;
    onEditEntry?: (entryId: string, amountInCents: number) => void;
  }) => (
    <div>
      <button type="button" onClick={() => onDeleteEntry?.("entry-inexistente")}>
        Excluir inexistente
      </button>
      <button type="button" onClick={() => onEditEntry?.("entry-inexistente", 12345)}>
        Editar inexistente
      </button>
    </div>
  ),
}));

import { ServicesDashboard } from "./services-dashboard";

const statementEntries = [
  { id: "1", month: "Novembro", type: "Deposito", amountInCents: 15000, date: "18/11/2022" },
] as const;

describe("ServicesDashboard guards", () => {
  it("mantem saldo quando handlers recebem id inexistente para editar e excluir", () => {
    render(
      <ServicesDashboard
        userFirstName="Joana"
        balanceInCents={250000}
        statementEntries={statementEntries}
      />
    );

    expect(screen.getByText("R$ 2.500,00")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Excluir inexistente" }));
    expect(screen.getByText("R$ 2.500,00")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Editar inexistente" }));
    expect(screen.getByText("R$ 2.500,00")).toBeInTheDocument();
  });
});
