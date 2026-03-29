import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("renderiza os dois botoes principais da home", () => {
    render(<HomePage />);

    expect(screen.getByText("Abrir minha conta")).toBeInTheDocument();
    expect(screen.getByText("Já tenho conta")).toBeInTheDocument();
  });
});
