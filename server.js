const express = require("express");
const mongoose = require("mongoose");
const House = require("./house");

// Connection to DB
mongoose.connect("mongodb://127.0.0.1:27017/nexttrip", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", function (error) {
  console.log("Error while connecting to MongoDB", error);
  process.exit(1); // 1 means the process was executed but an error occurred
});

const app = express();
const port = 3010;

app.get("/api/houses", async (request, response) => {
  const {
    houseRatingStars,
    houseServices,
    layout,
    layoutNumber,
    minimumPrice,
    maximumPrice,
    numberOfReviews,
    location,
  } = request.query;

  const query = {};

  if (houseRatingStars) {
    query.houseRatingStars = Number(houseRatingStars);
  }

  if (houseServices) {
    const s = houseServices.split(",");
    query.houseServices = { $all: s };
  }

  if (layout && layoutNumber) {
    query[`houseLayout.${layout}`] = Number(layoutNumber);
  }

  if (minimumPrice) {
    query.housePrice = { $gte: Number(minimumPrice) };
  }

  if (maximumPrice) {
    query.housePrice = { $lte: Number(maximumPrice) };
  }

  if (minimumPrice && maximumPrice) {
    query.housePrice = {
      $gte: Number(minimumPrice),
      $lte: Number(maximumPrice),
    };
  }

  if (numberOfReviews) {
    query.houseReviewNumber = { $gte: Number(numberOfReviews) };
  }

  if (location) {
    query.houseLocation = new RegExp(location, "i");
  }

  const results = await House.find(query);

  response.json(results);
});

app.listen(port, () => console.log(`Listening on port: ${port}`));
