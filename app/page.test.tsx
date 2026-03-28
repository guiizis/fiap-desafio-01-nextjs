import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "./page";

describe("Home page component", () => {
  it("renders the starting hint text", () => {
    render(<Home />);

    expect(screen.getByText(/To get started, edit the page.tsx file/i)).toBeInTheDocument();
  });
});
