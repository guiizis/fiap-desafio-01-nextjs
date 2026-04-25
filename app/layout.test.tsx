import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Layout from "./layout";

describe("Layout component", () => {
  it("renders children content", () => {
    render(
      <Layout>
        <div>children content</div>
      </Layout>
    );

    expect(screen.getByText("children content")).toBeInTheDocument();
  });
});