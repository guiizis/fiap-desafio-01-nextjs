import { describe, expect, it } from "vitest";
import ModalDefault from "./default";

describe("ModalDefault", () => {
  it("retorna null para manter o slot de modal fechado", () => {
    expect(ModalDefault()).toBeNull();
  });
});