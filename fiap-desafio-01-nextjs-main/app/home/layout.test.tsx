import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import HomeLayout from "./layout";

vi.mock("./_components/home-header", () => ({
  HomeHeader: () => <header>Header mock</header>,
}));

vi.mock("./_components/home-footer", () => ({
  HomeFooter: () => <footer>Footer mock</footer>,
}));

vi.mock("./_sections/hero-section", () => ({
  HeroSection: () => <section>Hero section mock</section>,
}));

vi.mock("./_sections/benefits-section", () => ({
  BenefitsSection: () => <section>Benefits section mock</section>,
}));

describe("HomeLayout", () => {
  it("renderiza header, fundo da home, overlay children e footer", () => {
    render(
      <HomeLayout>
        <div>Overlay child</div>
      </HomeLayout>
    );

    expect(screen.getByText("Header mock")).toBeInTheDocument();
    expect(screen.getByText("Hero section mock")).toBeInTheDocument();
    expect(screen.getByText("Benefits section mock")).toBeInTheDocument();
    expect(screen.getByText("Overlay child")).toBeInTheDocument();
    expect(screen.getByText("Footer mock")).toBeInTheDocument();
  });
});
