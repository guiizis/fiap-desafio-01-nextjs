import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ServiceUnderConstructionModal } from "./service-under-construction-modal";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

vi.mock("next/image", () => ({
  default: () => <span data-testid="next-image-mock" />,
}));

afterEach(() => {
  replaceMock.mockReset();
});

describe("ServiceUnderConstructionModal", () => {
  it("fecha com tecla Escape e remove listener no unmount", () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <ServiceUnderConstructionModal serviceLabel="Emprestimo" onClose={onClose} />
    );

    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.keyDown(window, { key: "Enter" });

    expect(onClose).toHaveBeenCalledTimes(1);

    unmount();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("fecha ao clicar no backdrop e mantem aberto ao clicar no conteudo interno", () => {
    const onClose = vi.fn();
    render(<ServiceUnderConstructionModal serviceLabel="Emprestimo" onClose={onClose} />);

    fireEvent.click(screen.getByRole("heading", { name: /Ainda em constru/i }));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("executa retorno para /servicos no botao de voltar", () => {
    const onClose = vi.fn();
    render(<ServiceUnderConstructionModal serviceLabel="Emprestimo" onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: /Voltar para servi/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(replaceMock).toHaveBeenCalledWith("/servicos");
  });
});
