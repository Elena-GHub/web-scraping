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
    const housePrice = Number(document
      .querySelector(".CasaVista__precio")
      .innerText.replace(/[^0-9]/g, ""));
    
      const houseRooms = [
      ...document.querySelectorAll(".CasaVista__cuartos span"),
    ].reduce((cumulator, room) => {
      const [roomQuantity, roomName] = room.innerText.split(' ');
      cumulator[roomName] = Number(roomQuantity);

      return cumulator
    }, {})

    return {
      housePictures,
      houseTitle,
      houseLocation,
      housePrice,
      houseRooms
    };
  });

  console.log(houseDetails);
})();
