import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("next/font/google", () => ({
  Geist: (options: { variable?: string }) => ({ variable: options.variable || "--font-geist-sans" }),
  Geist_Mono: (options: { variable?: string }) => ({ variable: options.variable || "--font-geist-mono" }),
}));
