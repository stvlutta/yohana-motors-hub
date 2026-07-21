import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ServicesSection from "./ServicesSection";

const renderSection = () =>
  render(
    <MemoryRouter>
      <ServicesSection />
    </MemoryRouter>
  );

describe("ServicesSection responsive layout", () => {
  it("renders all six service cards", () => {
    renderSection();
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(6);
    ["Direct Import", "Car Financing", "Duty Free", "Duty Calculator", "Sell Your Car", "Overseas Stock"]
      .forEach((title) => expect(screen.getByText(title)).toBeInTheDocument());
  });

  it("uses a 2-column mobile grid that expands to 3 columns on large screens with equal-height rows", () => {
    const { container } = renderSection();
    const grid = container.querySelector("div.grid") as HTMLElement;
    expect(grid).toBeTruthy();
    // Mobile-first: 2 columns; desktop: 3 columns
    expect(grid.className).toMatch(/\bgrid-cols-2\b/);
    expect(grid.className).toMatch(/\blg:grid-cols-3\b/);
    // Equal-height rows so cards stay proportional across breakpoints
    expect(grid.className).toMatch(/\bauto-rows-fr\b/);
    // Responsive gap scaling
    expect(grid.className).toMatch(/\bgap-3\b/);
    expect(grid.className).toMatch(/\bmd:gap-6\b/);
  });

  it("cards fill their grid row and stack content vertically", () => {
    renderSection();
    const links = screen.getAllByRole("link");
    for (const link of links) {
      expect(link.className).toMatch(/\bh-full\b/);
      expect(link.className).toMatch(/\bflex\b/);
      expect(link.className).toMatch(/\bflex-col\b/);
      // Responsive padding tiers
      expect(link.className).toMatch(/\bp-4\b/);
      expect(link.className).toMatch(/\bmd:p-8\b/);
    }
  });

  it("scales icon container and typography across breakpoints", () => {
    const { container } = renderSection();
    const iconBoxes = container.querySelectorAll("a > div");
    expect(iconBoxes.length).toBe(6);
    iconBoxes.forEach((el) => {
      const cls = (el as HTMLElement).className;
      expect(cls).toMatch(/\bw-11\b/);
      expect(cls).toMatch(/\bmd:w-14\b/);
      expect(cls).toMatch(/\bshrink-0\b/);
    });

    const headings = container.querySelectorAll("a h3");
    headings.forEach((h) => {
      const cls = (h as HTMLElement).className;
      expect(cls).toMatch(/\btext-sm\b/);
      expect(cls).toMatch(/\bmd:text-xl\b/);
    });
  });
});
