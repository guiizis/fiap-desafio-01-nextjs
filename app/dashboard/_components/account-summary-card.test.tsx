import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AccountSummaryCard } from "./account-summary-card";

describe("AccountSummaryCard", () => {
  it("renderiza dados principais do resumo da conta", () => {
    render(
      <AccountSummaryCard
        name="Joana"
        dateLabel="Quinta-feira, 08/09/2024"
        balanceLabel="Saldo"
        accountLabel="Conta corrente"
        balanceInCents={250000}
        isBalanceVisible
        onToggleBalanceVisibility={() => {}}
      />
    );

    expect(screen.getByRole("heading", { name: /Ol[a\u00e1], Joana! :\)/i })).toBeInTheDocument();
    expect(screen.getByText("Quinta-feira, 08/09/2024")).toBeInTheDocument();
    expect(screen.getByText("Saldo")).toBeInTheDocument();
    expect(screen.getByText("Conta corrente")).toBeInTheDocument();
    expect(screen.getByText("R$ 2.500,00")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ocultar saldo" })).toBeInTheDocument();
  });
});
