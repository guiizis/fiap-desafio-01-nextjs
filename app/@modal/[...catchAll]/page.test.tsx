import { describe, expect, it } from "vitest";
import ModalCatchAll from "./page";

describe("ModalCatchAll", () => {
  it("retorna null para fechar o slot de modal em rotas nao mapeadas", () => {
    expect(ModalCatchAll()).toBeNull();
  });
});
