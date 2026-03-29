import { describe, expect, it } from "vitest";
import { Button, buttonVariants } from "./button";

describe("buttonVariants", () => {
  it("usa primary + solid por padrao", () => {
    const className = buttonVariants();

    expect(className).toContain("border-primary");
    expect(className).toContain("bg-primary");
    expect(className).toContain("focus-visible:ring-primary");
  });

  it("permite combinacao outline + accent", () => {
    const className = buttonVariants({ variant: "outline", tone: "accent" });

    expect(className).toContain("border-accent");
    expect(className).toContain("text-accent");
    expect(className).toContain("bg-transparent");
    expect(className).toContain("focus-visible:ring-accent");
  });

  it("permite combinacao ghost + error", () => {
    const className = buttonVariants({ variant: "ghost", tone: "error" });

    expect(className).toContain("border-transparent");
    expect(className).toContain("text-error");
    expect(className).toContain("hover:bg-error/10");
    expect(className).toContain("focus-visible:ring-error");
  });

  it("concatena className customizada", () => {
    const className = buttonVariants({ className: "px-6" });

    expect(className).toContain("px-6");
  });
});

describe("Button", () => {
  it("define type='button' por padrao", () => {
    const element = Button({ children: "Ação" });

    expect(element.props.type).toBe("button");
    expect(element.props.className).toContain("border-primary");
  });

  it("respeita type e combinacao informada", () => {
    const element = Button({
      type: "submit",
      variant: "outline",
      tone: "secondary",
      className: "w-full",
      children: "Salvar",
    });

    expect(element.props.type).toBe("submit");
    expect(element.props.className).toContain("border-secondary");
    expect(element.props.className).toContain("text-secondary");
    expect(element.props.className).toContain("w-full");
  });

  it("permite combinacao ghost + error", () => {
    const element = Button({
      variant: "ghost",
      tone: "error",
      children: "Excluir",
    });

    expect(element.props.className).toContain("border-transparent");
    expect(element.props.className).toContain("text-error");
  });
});
