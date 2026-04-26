import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RegisterPage from "./page";

describe("RegisterPage", () => {
  it("retorna null porque o modal e resolvido no slot @modal", () => {
    const { container } = render(<RegisterPage />);

    expect(container.firstChild).toBeNull();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
