import { describe, expect, it } from "vitest";
import { MobileMenuButton } from "./mobile-menu-button";

describe("MobileMenuButton", () => {
  it("renderiza um botao com acessibilidade e icone de menu", () => {
    const element = MobileMenuButton();

    expect(element.type).toBe("button");
    expect(element.props.type).toBe("button");
    expect(String(element.props["aria-label"]).toLowerCase()).toContain("menu");
    expect(element.props.className).toContain("text-secondary");

    const icon = element.props.children;
    expect(icon.type).toBe("svg");
    expect(icon.props.children).toHaveLength(3);
  });
});
