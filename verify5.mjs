import { chromium } from "playwright";

const shots = "/private/tmp/claude-501/-Users-yugen-21-Code-Portoflio/51b79b2c-4c65-4026-9b26-83cae64ce5a1/scratchpad";
const browser = await chromium.launch();

const sizes = [
  { width: 1463, height: 734, dpr: 2, label: "user-2x" }, // matches user's exact screenshot
  { width: 1440, height: 900, dpr: 1, label: "std" },
  { width: 1920, height: 1080, dpr: 1, label: "fhd" },
  { width: 1280, height: 600, dpr: 1, label: "short" },
  { width: 1024, height: 768, dpr: 1, label: "narrow" },
];

for (const s of sizes) {
  const page = await browser.newPage({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: s.dpr });
  await page.goto("http://localhost:5199/", { waitUntil: "networkidle" });
  await page.getByText("View work").click();
  await page.waitForTimeout(900);
  const info = await page.evaluate(() => {
    const cover = document.querySelector('[style*="aspect-ratio"]');
    const r = cover ? cover.getBoundingClientRect() : null;
    return {
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      firstCoverLeft: r ? Math.round(r.left) : null,
      firstCoverWidth: r ? Math.round(r.width) : null,
    };
  });
  console.log(`${s.label}@${s.width}x${s.height}:`, JSON.stringify(info));
  await page.screenshot({ path: `${shots}/v5-${s.label}.png` });
  await page.close();
}

await browser.close();
console.log("DONE");
