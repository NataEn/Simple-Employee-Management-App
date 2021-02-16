const express = require("express");
const dataRoute = express.Router();
const Data = require("../database/models/Data");

dataRoute.get("/get:procedure", (req, res, next) => {
  Data.find(req.params.procedure, (err, data) => {
    if (err) {
      return next(err);
    }
    res.json(data);
  });
});

module.exports = dataRoute;
