const puppeteer = require("puppeteer");

(async () => {
  console.log('Empezando a "escrapear"...');

  const browser = await puppeteer.launch({
      headless: false,
      slowMo: 500,
  });
  const page = await browser.newPage();

  await page.goto("https://nextviaje.now.sh/");

  
})();
