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

  await page.goto(urls[0]);
  const houseDetails = await page.evaluate(() => {
    const housePictures = [
      ...document.querySelectorAll(".CasaVista__fotos img"),
    ].map((img) => img.src);

    const houseTitle = document.querySelector(".CasaVista__titulo").innerText;
    const houseLocation = document.querySelector(
      ".CasaVista__titulo + div"
    ).innerText;

    return {
      housePictures,
      houseTitle,
      houseLocation,
    };
  });

  console.log(houseDetails);
})();
