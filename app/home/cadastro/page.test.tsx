import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CadastroPage from "./page";

describe("CadastroPage", () => {
  it("retorna null porque o modal e resolvido no slot @modal", () => {
    const { container } = render(<CadastroPage />);

    expect(container.firstChild).toBeNull();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
