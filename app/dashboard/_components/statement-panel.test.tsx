import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatementPanel } from "./statement-panel";

function triggerButtonClickHandler(element: HTMLElement) {
  const reactPropsKey = Object.keys(element).find((key) => key.startsWith("__reactProps$"));
  if (!reactPropsKey) {
    throw new Error("Props internas do React nao encontradas");
  }

  const reactProps = (element as Record<string, unknown>)[reactPropsKey] as {
    onClick?: () => void;
  };
  reactProps.onClick?.();
}

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

  it("mantem selecao ao clicar dentro do painel e ignora evento com target nao DOM Node", () => {
    render(
      <StatementPanel
        entries={[
          { id: "1", month: "Novembro", type: "Deposito", amountInCents: 15000, date: "18/11/2022" },
        ]}
      />
    );

    const panel = screen.getByLabelText("Extrato da conta");
    const editButton = screen.getByRole("button", { name: "Editar extrato" });
    const entry = screen.getByText("Deposito").closest("li");

    if (!entry) {
      throw new Error("Lancamento nao encontrado");
    }

    fireEvent.click(entry);
    expect(editButton).toBeEnabled();

    fireEvent.mouseDown(panel);
    expect(editButton).toBeEnabled();

    const invalidTargetEvent = new MouseEvent("mousedown", { bubbles: true });
    Object.defineProperty(invalidTargetEvent, "target", { value: {}, configurable: true });
    document.dispatchEvent(invalidTargetEvent);
    expect(editButton).toBeEnabled();
  });

  it("cobre guards de edit e delete quando nao ha item selecionado", () => {
    const onDeleteEntry = vi.fn();
    const onEditEntry = vi.fn();

    render(
      <StatementPanel
        onDeleteEntry={onDeleteEntry}
        onEditEntry={onEditEntry}
        entries={[
          { id: "1", month: "Novembro", type: "Deposito", amountInCents: 15000, date: "18/11/2022" },
        ]}
      />
    );

    const editButton = screen.getByRole("button", { name: "Editar extrato" });
    const deleteButton = screen.getByRole("button", { name: "Excluir extrato" });

    triggerButtonClickHandler(editButton);
    triggerButtonClickHandler(deleteButton);

    expect(onEditEntry).not.toHaveBeenCalled();
    expect(onDeleteEntry).not.toHaveBeenCalled();
  });

  it("cancela edicao com Escape, bloqueia valor invalido e encerra edicao ao excluir item", () => {
    const onEditEntry = vi.fn();
    const onDeleteEntry = vi.fn();

    render(
      <StatementPanel
        onDeleteEntry={onDeleteEntry}
        onEditEntry={onEditEntry}
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
    fireEvent.click(editButton);

    const firstInput = screen.getByRole("textbox", { name: "Valor do lancamento" });
    fireEvent.keyDown(firstInput, { key: "Escape" });
    expect(screen.queryByRole("textbox", { name: "Valor do lancamento" })).not.toBeInTheDocument();

    fireEvent.click(editButton);
    const secondInput = screen.getByRole("textbox", { name: "Valor do lancamento" });
    fireEvent.change(secondInput, { target: { value: "0" } });
    fireEvent.keyDown(secondInput, { key: "Enter" });
    expect(onEditEntry).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox", { name: "Valor do lancamento" })).toBeInTheDocument();

    fireEvent.click(deleteButton);
    expect(onDeleteEntry).toHaveBeenCalledWith("1");
    expect(screen.queryByRole("textbox", { name: "Valor do lancamento" })).not.toBeInTheDocument();
  });
});
