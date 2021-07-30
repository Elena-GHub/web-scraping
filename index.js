const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {
  console.log('Empezando a "escrapear"...');

  const browser = await puppeteer.launch({
    //   headless: false,
    //   slowMo: 500,
  });
  const page = await browser.newPage();
  const houses = [];

  await page.goto("https://nextviaje.now.sh/");

  const urls = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(".FilaCasas__cartas a"),
      (node) => node.href
    )
  );

  for (const url of urls) {
    await page.goto(url);

    const houseDetails = await page.evaluate(() => {
      const housePictures = [
        ...document.querySelectorAll(".CasaVista__fotos img"),
      ].map((img) => img.src);

      const houseTitle = document.querySelector(".CasaVista__titulo").innerText;
      const houseLocation = document.querySelector(
        ".CasaVista__titulo + div"
      ).innerText;
      const housePrice = Number(
        document
          .querySelector(".CasaVista__precio")
          .innerText.replace(/[^0-9]/g, "")
      );

      const houseLayout = [
        ...document.querySelectorAll(".CasaVista__cuartos span"),
      ].reduce((cumulator, room) => {
        const [roomQuantity, roomName] = room.innerText.split(" ");
        cumulator[roomName] = Number(roomQuantity);

        return cumulator;
      }, {});

      const houseServices = [
        ...document.querySelectorAll(".CasaVista__extras"),
      ].map((node) => node.innerText.toLowerCase());

      const houseRatingStars = Number(
        document.querySelector(".Opiniones__numero-de-estrellas").innerText
      );

      const houseReviewNumber = Number(
        document
          .querySelector(".Opiniones__numero-de-opiniones")
          .innerText.replace(/[^0-9]/g, "")
      );
      // TASK: scrap the reviews and add to the house details an array of reviews with author, date and text
      const houseReviews = [
        ...document.querySelectorAll(".Opinion__autor"),
        ...document.querySelectorAll(".Opinion div div.Opinion__autor + div"),
        ...document.querySelectorAll(".Opinion__texto"),
      ].map((review) => review.innerText);

      let reviewList = [];
      const reviewListLength = houseReviews.length / 3;
      for (let i = 0; i < reviewListLength; i++) {
        reviewList.push(
          houseReviews[i],
          houseReviews[i + reviewListLength],
          houseReviews[i + 2 * reviewListLength]
        );
      }
      // Splitting the review list into subarrays of one review containing author, review date and text
      // Solution based on https://typeofnan.dev/how-to-split-an-array-into-a-group-of-arrays-in-javascript/
      const groupedReviews = new Array(reviewList.length / 3)
        // Make sure each element isn't empty
        .fill("")
        // For each group, grab the right `slice` of the input array
        .map((_, i) => reviewList.slice(i * 3, (i + 1) * 3));

      return {
        housePictures,
        houseTitle,
        houseLocation,
        housePrice,
        houseLayout,
        houseServices,
        houseRatingStars,
        houseReviewNumber,
        url: window.location.href,
        groupedReviews,
      };
    });

    houses.push(houseDetails);
  }

  const data = JSON.stringify(houses);
  fs.writeFileSync(path.join(__dirname, "houses.json"), data);

  await browser.close();
  process.exit();
})();
