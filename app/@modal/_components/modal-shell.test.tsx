import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ModalShell } from "./modal-shell";

const { replaceMock } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

describe("ModalShell", () => {
  beforeEach(() => {
    replaceMock.mockClear();
  });

  it("renderiza container de dialogo com conteudo", () => {
    render(
      <ModalShell>
        <div>Conteudo do modal</div>
      </ModalShell>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Conteudo do modal")).toBeInTheDocument();
  });

  it("fecha modal chamando router.replace('/home')", () => {
    render(
      <ModalShell>
        <div>Conteudo</div>
      </ModalShell>
    );

    fireEvent.click(screen.getByRole("button", { name: /fechar cadastro/i }));
    expect(replaceMock).toHaveBeenCalledWith("/home");
  });

  it("fecha modal ao clicar no backdrop", () => {
    render(
      <ModalShell>
        <div>Conteudo do modal</div>
      </ModalShell>
    );

    fireEvent.click(screen.getByRole("dialog"));
    expect(replaceMock).toHaveBeenCalledWith("/home");
  });

  it("nao fecha modal ao clicar dentro do conteudo", () => {
    render(
      <ModalShell>
        <div>Conteudo interno</div>
      </ModalShell>
    );

    fireEvent.click(screen.getByText("Conteudo interno"));
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
