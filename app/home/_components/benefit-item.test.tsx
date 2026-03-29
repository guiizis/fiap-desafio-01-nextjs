import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BenefitItem } from "./benefit-item";

describe("BenefitItem", () => {
  it("renderiza icone, titulo e descricao", () => {
    render(
      <BenefitItem
        iconSrc="/home/gift.svg"
        iconAlt="Icone de presente"
        title="Conta e cartao gratuitos"
        description="Descricao do beneficio"
      />
    );

    expect(screen.getByRole("img", { name: "Icone de presente" })).toBeInTheDocument();
    expect(screen.getByText("Conta e cartao gratuitos")).toBeInTheDocument();
    expect(screen.getByText("Descricao do beneficio")).toBeInTheDocument();
  });
});
