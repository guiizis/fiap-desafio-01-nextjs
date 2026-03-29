import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BenefitsSection } from "./benefits-section";

describe("BenefitsSection", () => {
  it("renderiza titulo e quatro beneficios", () => {
    render(<BenefitsSection />);

    expect(
      screen.getByRole("heading", { name: "Vantagens do nosso banco:", level: 2 })
    ).toBeInTheDocument();
    expect(screen.getByText("Conta e cartao gratuitos")).toBeInTheDocument();
    expect(screen.getByText("Saques sem custo")).toBeInTheDocument();
    expect(screen.getByText("Programa de pontos")).toBeInTheDocument();
    expect(screen.getByText("Seguro Dispositivos")).toBeInTheDocument();
  });
});
