const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");

const houses = JSON.parse(fs.readFileSync("./houses.json"));

const fields = [
  "houseTitle",
  "houseLocation",
  "housePrice",
  "houseRatingStars",
  "houseReviewNumber",
  "url",
  {
    label: "baños",
    value: (row, field) => {
      return row["houseLayout"]["baños"] || field.default;
    },
    default: "NULL",
  },
  {
    label: "habitaciones",
    value: (row, field) => {
      return row["houseLayout"]["habitaciones"] || field.default;
    },
    default: "NULL",
  },
  {
    label: "camas",
    value: (row, field) => {
      return row["houseLayout"]["camas"] || field.default;
    },
    default: "NULL",
  },
  "houseServices"
];

const json2csvParser = new Parser({ fields: fields });
const csv = json2csvParser.parse(houses);

fs.writeFileSync(path.join(__dirname, "houses.csv"), csv);
