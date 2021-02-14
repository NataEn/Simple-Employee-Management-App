const express = require("express");
const employeeRoute = express.Router();
const Employee = require("../database/models/Employee.js");

employeeRoute.post("/create", (req, res, next) => {
  const employee = req.body;
  Employee.create(employee, (err, data) => {
    if (err) {
      return next(err);
    }
    res.json(data);
  });
});

employeeRoute.get("/", (req, res, next) => {
  Employee.find((err, data) => {
    if (err) {
      return next(err);
    }
    res.json(data);
  });
});
employeeRoute.get("/:id", (req, res, next) => {
  Employee.findById(req.params.id, (err, data) => {
    if (err) {
      return next(err);
    }
    res.json(data);
  });
});

employeeRoute.put("/update/:id", (req, res, next) => {
  Employee.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (err, data) => {
      if (err) {
        return next(error);
      } else {
        console.log(` employee ${req.params.id} updated successfully`);
        res.json(data);
      }
    }
  );
});
employeeRoute.delete("/delete/:id", (req, res, next) => {
  Employee.findOneAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      console.log(`Employee ${req.params.id} deleted successfully`);
      res.status(200).json({
        msg: data,
      });
    }
  });
});

module.exports = employeeRoute;
