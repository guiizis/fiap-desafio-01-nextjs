import { describe, expect, it } from "vitest";
import ModalPage from "./page";

describe("ModalPage", () => {
  it("retorna null como estado base do slot de modal", () => {
    expect(ModalPage()).toBeNull();
  });
});