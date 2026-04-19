import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatementPanel } from "./statement-panel";

describe("StatementPanel", () => {
  it("renderiza titulo e lancamentos do extrato, habilita acoes, edita e exclui item selecionado", () => {
    const onDeleteEntry = vi.fn();
    const onEditEntry = vi.fn();

    render(
      <StatementPanel
        onDeleteEntry={onDeleteEntry}
        onEditEntry={onEditEntry}
        entries={[
          { id: "1", month: "Novembro", type: "Deposito", amountInCents: 15000, date: "18/11/2022" },
          { id: "2", month: "Novembro", type: "Transferencia", amountInCents: -50000, date: "21/11/2022" },
        ]}
      />
    );

    const editButton = screen.getByRole("button", { name: "Editar extrato" });
    const deleteButton = screen.getByRole("button", { name: "Excluir extrato" });

    expect(screen.getByRole("heading", { name: "Extrato", level: 2 })).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
    expect(editButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
    expect(screen.getAllByText("Novembro")).toHaveLength(2);
    expect(screen.getByText("Deposito")).toBeInTheDocument();
    expect(screen.getByText("Transferencia")).toBeInTheDocument();

    const firstEntry = screen.getByText("Deposito").closest("li");
    if (!firstEntry) {
      throw new Error("Lancamento nao encontrado");
    }

    fireEvent.click(firstEntry);

    expect(editButton).toBeEnabled();
    expect(deleteButton).toBeEnabled();

    fireEvent.click(editButton);

    const editInput = screen.getByRole("textbox", { name: "Valor do lancamento" });
    fireEvent.change(editInput, { target: { value: "25000" } });
    fireEvent.keyDown(editInput, { key: "Enter" });
    expect(onEditEntry).toHaveBeenCalledWith("1", 25000);

    fireEvent.click(deleteButton);
    expect(onDeleteEntry).toHaveBeenCalledWith("1");
  });

  it("deseleciona lancamento ao clicar fora do painel e bloqueia botoes novamente", () => {
    render(
      <StatementPanel
        entries={[
          { id: "1", month: "Novembro", type: "Deposito", amountInCents: 15000, date: "18/11/2022" },
        ]}
      />
    );

    const editButton = screen.getByRole("button", { name: "Editar extrato" });
    const deleteButton = screen.getByRole("button", { name: "Excluir extrato" });
    const entry = screen.getByText("Deposito").closest("li");

    if (!entry) {
      throw new Error("Lancamento nao encontrado");
    }

    fireEvent.click(entry);
    expect(editButton).toBeEnabled();
    expect(deleteButton).toBeEnabled();

    fireEvent.click(editButton);
    expect(screen.getByRole("textbox", { name: "Valor do lancamento" })).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(editButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
    expect(screen.queryByRole("textbox", { name: "Valor do lancamento" })).not.toBeInTheDocument();
  });
});
