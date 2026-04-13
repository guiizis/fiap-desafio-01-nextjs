import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatementPanel } from "./statement-panel";

describe("StatementPanel", () => {
  it("renderiza titulo e lancamentos do extrato", () => {
    render(
      <StatementPanel
        entries={[
          { id: "1", month: "Novembro", type: "Deposito", amountInCents: 15000, date: "18/11/2022" },
          { id: "2", month: "Novembro", type: "Transferencia", amountInCents: -50000, date: "21/11/2022" },
        ]}
      />
    );

    expect(screen.getByRole("heading", { name: "Extrato", level: 2 })).toBeInTheDocument();
    expect(screen.getAllByText("Novembro")).toHaveLength(2);
    expect(screen.getByText("Deposito")).toBeInTheDocument();
    expect(screen.getByText("Transferencia")).toBeInTheDocument();
  });
});
