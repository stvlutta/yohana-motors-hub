#!/usr/bin/env node
/**
 * Responsive visual regression check for the homepage ServicesSection.
 *
 * Captures element screenshots at mobile / tablet / desktop viewports and
 * asserts every card in a row has an equal height (proportional layout).
 *
 * Usage:
 *   node scripts/visual-check-services.mjs [baseUrl]
 * Default baseUrl: http://localhost:8080
 *
 * Screenshots are written to ./visual-snapshots/services-<viewport>.png
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const BASE = process.argv[2] || "http://localhost:8080";
const OUT = resolve("visual-snapshots");
const VIEWPORTS = [
  { name: "mobile-sm", width: 360, height: 1800, expectedCols: 2 },
  { name: "mobile", width: 393, height: 1800, expectedCols: 2 },
  { name: "mobile-lg", width: 430, height: 1800, expectedCols: 2 },
  { name: "tablet", width: 768, height: 1800, expectedCols: 2 },
  { name: "desktop", width: 1280, height: 1800, expectedCols: 3 },
];

const failures = [];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  const heading = page.getByRole("heading", { name: "Our Services" });
  await heading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const section = page.locator("section").filter({ has: heading }).first();
  await section.screenshot({ path: `${OUT}/services-${vp.name}.png` });

  const cards = section.locator("a");
  const count = await cards.count();
  if (count !== 6) failures.push(`[${vp.name}] expected 6 cards, got ${count}`);

  const boxes = [];
  for (let i = 0; i < count; i++) boxes.push(await cards.nth(i).boundingBox());
  const heights = boxes.map((b) => Math.round(b.height));
  const maxDelta = Math.max(...heights) - Math.min(...heights);
  if (maxDelta > 2) failures.push(`[${vp.name}] card heights not equal: ${heights.join(", ")}`);

  // Column count from x positions in the first row
  const firstRowY = boxes[0].y;
  const cols = boxes.filter((b) => Math.abs(b.y - firstRowY) < 4).length;
  if (cols !== vp.expectedCols)
    failures.push(`[${vp.name}] expected ${vp.expectedCols} columns, got ${cols}`);

  console.log(`✓ ${vp.name.padEnd(10)} cards=${count} cols=${cols} heights=${heights.join("/")}`);
  await ctx.close();
}

await browser.close();

if (failures.length) {
  console.error("\nFAILURES:\n" + failures.map((f) => "  - " + f).join("\n"));
  process.exit(1);
}
console.log("\nAll ServicesSection responsive checks passed.");
