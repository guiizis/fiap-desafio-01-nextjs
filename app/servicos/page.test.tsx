import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ServicosPage from "./page";

vi.mock("./_components/services-dashboard", () => ({
  ServicesDashboard: () => <section>Dashboard de servicos</section>,
}));

describe("ServicosPage", () => {
  it("renderiza main com dashboard", () => {
    render(<ServicosPage />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByText("Dashboard de servicos")).toBeInTheDocument();
  });
});
