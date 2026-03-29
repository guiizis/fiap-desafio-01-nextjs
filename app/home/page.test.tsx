import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("renderiza a estrutura base da pagina home", () => {
    render(<HomePage />);

    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
