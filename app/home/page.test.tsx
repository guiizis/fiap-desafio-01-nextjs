import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("renderiza o titulo inicial da rota home", () => {
    render(<HomePage />);

    expect(screen.getByText("Home em construcao")).toBeInTheDocument();
  });
});
