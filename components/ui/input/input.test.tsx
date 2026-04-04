import { describe, expect, it } from "vitest";
import { Input, inputClasses } from "./input";

describe("inputClasses", () => {
  it("gera as classes base do input", () => {
    const className = inputClasses();

    expect(className).toContain("border-border");
    expect(className).toContain("focus-visible:ring-primary");
    expect(className).toContain("placeholder:text-subtle");
  });

  it("concatena className customizada", () => {
    const className = inputClasses({ className: "max-w-[165px]" });

    expect(className).toContain("max-w-[165px]");
  });
});

describe("Input", () => {
  it("usa o name como fallback para htmlFor/id", () => {
    const element = Input({
      label: "Senha",
      name: "senha",
      placeholder: "Digite sua senha",
    });

    const [labelElement, inputElement] = element.props.children;

    expect(labelElement.props.htmlFor).toBe("senha");
    expect(inputElement.props.id).toBe("senha");
    expect(inputElement.props.placeholder).toBe("Digite sua senha");
  });

  it("respeita id informado e classes customizadas", () => {
    const element = Input({
      label: "Nome",
      id: "nome-completo",
      inputClassName: "max-w-[280px]",
      containerClassName: "pt-2",
    });

    const [_, inputElement] = element.props.children;
    
    console.log(_);

    expect(inputElement.props.id).toBe("nome-completo");
    expect(inputElement.props.className).toContain("max-w-[280px]");
    expect(element.props.className).toContain("pt-2");
  });
});
