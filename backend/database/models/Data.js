const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Data = new Schema(
  {
    procedure: {
      type: String,
    },

    value: {
      type: Number,
    },
  },
  {
    collection: "data",
  },
  { timestamps: true }
);
module.exports = mongoose.model("Data", Data);
