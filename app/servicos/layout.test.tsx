import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ServicosLayout from "./layout";

vi.mock("./_components/servicos-header", () => ({
  ServicosHeader: ({ userName }: { userName: string }) => <header>Header {userName}</header>,
}));

describe("ServicosLayout", () => {
  it("renderiza header da area logada e children", () => {
    render(
      <ServicosLayout>
        <main>Conteudo da area de servicos</main>
      </ServicosLayout>
    );

    expect(screen.getByText("Header Joana Fonseca Gomes")).toBeInTheDocument();
    expect(screen.getByText("Conteudo da area de servicos")).toBeInTheDocument();
  });
});
