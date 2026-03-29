import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("next/font/google", () => ({
  Inter: (options: { variable?: string }) => ({
    variable: options.variable || "--font-inter"
  })
}));
