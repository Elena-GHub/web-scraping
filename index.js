const puppeteer = require("puppeteer");

(async () => {
  console.log('Empezando a "escrapear"...');

  const browser = await puppeteer.launch({
    //   headless: false,
    //   slowMo: 500,
  });
  const page = await browser.newPage();

  await page.goto("https://nextviaje.now.sh/");

  const urls = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(".FilaCasas__cartas a"),
      (node) => node.href
    )
  );

  console.log(urls);
})();
