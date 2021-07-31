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

// Function to save the houses to the DB
exports.saveHouses = async (houses) => {
  for (const house of houses) {
    try {
      await new House(house).save();
    } catch (error) {
      console.log(
        `A problem occurred when saving the house whose title is ${houseTitle}.`,
        error
      );
    }
  }
};
