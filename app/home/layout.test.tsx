import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import HomeLayout from "./layout";

vi.mock("./_components/home-header", () => ({
  HomeHeader: () => <header>Header mock</header>,
}));

vi.mock("./_components/home-footer", () => ({
  HomeFooter: () => <footer>Footer mock</footer>,
}));

describe("HomeLayout", () => {
  it("renderiza header, children e footer", () => {
    render(
      <HomeLayout>
        <main>Conteudo da home</main>
      </HomeLayout>
    );

    expect(screen.getByText("Header mock")).toBeInTheDocument();
    expect(screen.getByText("Conteudo da home")).toBeInTheDocument();
    expect(screen.getByText("Footer mock")).toBeInTheDocument();
  });
});
