import { describe, expect, it, vi } from "vitest";
import { redirect } from "next/navigation";
import Page from "./page";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("Root page", () => {
  it("redireciona / para /home", () => {
    Page();

    expect(redirect).toHaveBeenCalledWith("/home");
  });
});
