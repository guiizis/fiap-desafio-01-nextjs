import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Select, selectClasses } from "./select";

const options = [
  { value: "deposito", label: "Deposito" },
  { value: "transferencia", label: "Transferencia" },
] as const;

describe("selectClasses", () => {
  it("gera as classes base do select", () => {
    const className = selectClasses();

    expect(className).toContain("appearance-none");
    expect(className).toContain("border-border");
    expect(className).toContain("focus-visible:ring-primary");
  });

  it("concatena className customizada", () => {
    const className = selectClasses({ className: "max-w-[296px]" });

    expect(className).toContain("max-w-[296px]");
  });
});

describe("Select", () => {
  it("usa o name como fallback para htmlFor/id", () => {
    render(
      <Select
        label="Tipo de transacao"
        name="tipo"
        options={options}
        placeholder="Selecione o tipo de transacao"
        defaultValue=""
      />
    );

    const select = screen.getByLabelText("Tipo de transacao");
    expect(select).toHaveAttribute("id", "tipo");
  });

  it("renderiza placeholder e opcoes", () => {
    render(
      <Select
        label="Tipo de transacao"
        id="transaction-type"
        options={options}
        placeholder="Selecione o tipo de transacao"
        defaultValue=""
      />
    );

    expect(screen.getByRole("option", { name: "Selecione o tipo de transacao" })).toHaveAttribute(
      "disabled"
    );
    expect(screen.getByRole("option", { name: "Deposito" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Transferencia" })).toBeInTheDocument();
  });

  it("aplica classe e mensagem de erro quando informado", () => {
    render(
      <Select
        label="Tipo de transacao"
        id="transaction-type"
        options={options}
        hasError
        errorMessage="Campo obrigatorio."
      />
    );

    const select = screen.getByLabelText("Tipo de transacao");
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select.className).toContain("border-error");
    expect(select.getAttribute("aria-describedby")).toContain("transaction-type-error");
    expect(screen.getByText("Campo obrigatorio.")).toHaveAttribute("id", "transaction-type-error");
  });
});
