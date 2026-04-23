const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Dark mode to match GitHub profile look
  await page.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: "dark" },
  ]);

  await page.setViewport({ width: 480, height: 600 });

  console.log("Loading Codolio card page...");
  await page.goto("https://codolio.com/profile/1905-abhishek/card", {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  // Wait for the card to fully render
  await new Promise((r) => setTimeout(r, 4000));

  // Find the card element and screenshot just that
  const card = await page.$(".card-container, [class*='card'], main");

  if (card) {
    console.log("Card element found, screenshotting...");
    await card.screenshot({ path: "codolio-card.png" });
  } else {
    console.log("Card element not found, screenshotting full page...");
    await page.screenshot({
      path: "codolio-card.png",
      fullPage: false,
      clip: { x: 0, y: 0, width: 480, height: 420 },
    });
  }

  await browser.close();
  console.log("✅ Screenshot saved as codolio-card.png");
})();
