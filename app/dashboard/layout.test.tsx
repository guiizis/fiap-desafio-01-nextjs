import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ServicosLayout from "./layout";

describe("ServicosLayout", () => {
  it("renderiza container da area de servicos com children", () => {
    render(
      <ServicosLayout>
        <main>Conteudo da area de servicos</main>
      </ServicosLayout>
    );

    expect(screen.getByText("Conteudo da area de servicos")).toBeInTheDocument();
  });
});
