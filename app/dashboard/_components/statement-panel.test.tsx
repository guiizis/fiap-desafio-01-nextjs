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
  it("renderiza titulo e lancamentos do extrato e habilita acoes ao selecionar item", () => {
    render(
      <StatementPanel
        entries={[
          { id: "1", month: "Novembro", type: "Deposito", amountInCents: 15000, date: "18/11/2022" },
          { id: "2", month: "Novembro", type: "Transferencia", amountInCents: -50000, date: "21/11/2022" },
        ]}
      />
    );

    const editButton = screen.getByRole("button", { name: "Editar extrato" });
    const deleteButton = screen.getByRole("button", { name: "Excluir extrato" });

    expect(screen.getByRole("heading", { name: "Extrato", level: 2 })).toBeInTheDocument();
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
  });

  it("abre modal de edicao e envia payload completo de tipo, valor e data", () => {
    const onEditEntry = vi.fn(() => ({ ok: true as const }));

    render(
      <StatementPanel
        onEditEntry={onEditEntry}
        entries={[
          { id: "1", month: "Novembro", type: "Deposito", amountInCents: 15000, date: "18/11/2022" },
        ]}
      />
    );

    const entry = screen.getByText("Deposito").closest("li");
    if (!entry) {
      throw new Error("Lancamento nao encontrado");
    }

    fireEvent.click(entry);
    fireEvent.click(screen.getByRole("button", { name: "Editar extrato" }));

    expect(screen.getByRole("heading", { name: "Editar transação" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Tipo de transação" })).toHaveValue("deposito");
    expect(screen.getByRole("textbox", { name: "Valor" })).toHaveValue("150,00");

    fireEvent.change(screen.getByRole("combobox", { name: "Tipo de transação" }), {
      target: { value: "transferencia" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Valor" }), {
      target: { value: "70000" },
    });
    fireEvent.change(screen.getByLabelText("Data"), {
      target: { value: "2026-04-22" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar edição" }));

    expect(onEditEntry).toHaveBeenCalledWith({
      entryId: "1",
      type: "transferencia",
      amountInCents: 70000,
      transactionDate: "2026-04-22",
    });
    expect(screen.queryByRole("heading", { name: "Editar transação" })).not.toBeInTheDocument();
  });

  it("mantem modal aberto e mostra alerta quando a edicao retorna erro", () => {
    const onEditEntry = vi.fn(() => ({
      ok: false as const,
      message: "Saldo insuficiente para concluir a transferência.",
    }));

    render(
      <StatementPanel
        onEditEntry={onEditEntry}
        entries={[
          { id: "1", month: "Novembro", type: "Deposito", amountInCents: 15000, date: "18/11/2022" },
        ]}
      />
    );

    fireEvent.click(screen.getByText("Deposito").closest("li")!);
    fireEvent.click(screen.getByRole("button", { name: "Editar extrato" }));
    fireEvent.change(screen.getByLabelText("Data"), {
      target: { value: "2026-04-21" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar edição" }));

    expect(onEditEntry).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("alert")).toHaveTextContent("Saldo insuficiente");
    expect(screen.getByRole("heading", { name: "Editar transação" })).toBeInTheDocument();
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

    fireEvent.mouseDown(document.body);
    expect(editButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  it("ignora evento global quando target nao eh um Node", () => {
    render(
      <StatementPanel
        entries={[
          { id: "1", month: "Novembro", type: "Deposito", amountInCents: 15000, date: "18/11/2022" },
        ]}
      />
    );

    const event = new MouseEvent("mousedown", { bubbles: true });
    Object.defineProperty(event, "target", {
      value: { arbitrary: true },
      configurable: true,
    });

    document.dispatchEvent(event);

    expect(screen.getByRole("button", { name: "Editar extrato" })).toBeDisabled();
  });

  it("mantem selecao quando o clique acontece dentro do painel", () => {
    render(
      <StatementPanel
        entries={[
          { id: "1", month: "Novembro", type: "Deposito", amountInCents: 15000, date: "18/11/2022" },
        ]}
      />
    );

    const editButton = screen.getByRole("button", { name: "Editar extrato" });
    const entry = screen.getByText("Deposito").closest("li");
    if (!entry) {
      throw new Error("Lancamento nao encontrado");
    }

    fireEvent.click(entry);
    expect(editButton).toBeEnabled();

    fireEvent.mouseDown(screen.getByLabelText("Extrato da conta"));
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

  it("fecha modal com Escape e exclui item selecionado", () => {
    const onDeleteEntry = vi.fn();

    render(
      <StatementPanel
        onDeleteEntry={onDeleteEntry}
        entries={[
          { id: "1", month: "Novembro", type: "Deposito", amountInCents: 15000, date: "18/11/2022" },
        ]}
      />
    );

    fireEvent.click(screen.getByText("Deposito").closest("li")!);
    fireEvent.click(screen.getByRole("button", { name: "Editar extrato" }));
    expect(screen.getByRole("heading", { name: "Editar transação" })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("heading", { name: "Editar transação" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Excluir extrato" }));
    expect(onDeleteEntry).toHaveBeenCalledWith("1");
  });
});
