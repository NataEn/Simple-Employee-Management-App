const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Data = new Schema(
  {
    procedure: {
      type: String,
    },
    timestamp: true,
    value: {
      type: Number,
    },
  },
  {
    collection: "data",
  }
);
module.exports = mongoose.model("Data", Data);
