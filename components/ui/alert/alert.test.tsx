import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Alert, alertClasses } from "./alert";

describe("Alert", () => {
  it("usa variant info por padrao", () => {
    render(<Alert message="Mensagem informativa" />);

    const element = screen.getByRole("status");
    expect(element.className).toContain("border-primary/25");
    expect(element).toHaveTextContent("Mensagem informativa");
  });

  it("renderiza role alert no variant error", () => {
    render(<Alert variant="error" message="Erro ao processar" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renderiza botao de fechar e dispara onClose", () => {
    const onClose = vi.fn();
    render(<Alert variant="success" message="Sucesso" onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: /fechar alerta/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("permite personalizar classes extras", () => {
    render(<Alert variant="warning" message="Atencao" className="custom-class" />);

    expect(screen.getByRole("status").className).toContain("custom-class");
  });

  it("usa icone customizado quando informado", () => {
    render(<Alert message="Com icone customizado" icon={<span data-testid="custom-icon">!</span>} />);

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("dispara onClose automaticamente quando dismissAfterMs esta ativo", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Alert variant="success" message="Sucesso" dismissAfterMs={2200} onClose={onClose} />);

    vi.advanceTimersByTime(2200);
    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("nao dispara onClose automaticamente quando dismissAfterMs nao foi informado", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Alert variant="info" message="Info" onClose={onClose} />);

    vi.advanceTimersByTime(3000);
    expect(onClose).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});

describe("alertClasses", () => {
  it("retorna classes esperadas para variant success", () => {
    const classes = alertClasses({
      variant: "success",
      className: "extra",
    });

    expect(classes).toContain("border-success/35");
    expect(classes).toContain("extra");
  });
});
