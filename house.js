const mongoose = require("mongoose");

// House Schema
const HouseSchema = new mongoose.Schema({
  housePictures: [{ type: String }],
  houseTitle: String,
  houseLocation: String,
  housePrice: Number,
  houseLayout: { habitaciones: Number, camas: Number, baños: Number },
  houseServices: [{ type: String }],
  houseRatingStars: Number,
  houseReviewNumber: Number,
  url: String,
  groupedReviews: [[{ type: String }]],
});

// Transform the Schema into a model
// and we export is as a module
module.exports = mongoose.model("House", HouseSchema);
