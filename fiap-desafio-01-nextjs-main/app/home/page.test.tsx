import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("retorna null porque o fundo da home agora fica no layout", () => {
    const { container } = render(<HomePage />);

    expect(container.firstChild).toBeNull();
    expect(screen.queryByRole("main")).not.toBeInTheDocument();
  });
});
