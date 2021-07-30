const mongoose = require("mongoose");

// Connection to DB
mongoose.connect("mongodb://127.0.0.1:27017/nexttrip", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", function (error) {
  console.log("Error while connecting to MongoDB", error);
  process.exit(1); // 1 means the process was executed but an error occurred
});

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
const House = mongoose.model("House", HouseSchema);

// Function to save the houses to the DB
exports.saveHouses = async (houses) => {
  for (const house of houses) {
    try {
      await new House(house).save();
    } catch (error) {
      console.log(
        `A problem occurred when saving the house whose title is ${houseTitle}.`, error
      );
    }
  }
};
