import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NotFound from "./not-found";

vi.mock("./home/_components/home-header", () => ({
  HomeHeader: () => <header>Header da home</header>,
}));

vi.mock("./home/_components/home-footer", () => ({
  HomeFooter: () => <footer>Footer da home</footer>,
}));

describe("NotFound", () => {
  it("renderiza conteudo principal da 404 com CTA e ilustracao", () => {
    render(<NotFound />);

    expect(screen.getByText("Header da home")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Ops!/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Voltar/i })).toHaveAttribute("href", "/home");

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", expect.stringContaining("/errors/not-found.svg"));

    expect(screen.getByText("Footer da home")).toBeInTheDocument();
  });
});
