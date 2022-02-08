const mongoose = require("mongoose");
const Cities = require("../../cities");

// Get states of India
exports.show = function (req, res) {
  var states = [];
  for (let city of Cities.DB) {
    states.push(city.state);
  }
  res.status(200).send({ states: states });
};

// Get Cities of a state
exports.query = function (req, res) {
  const state = req.params.state.replace(/\+/g, " "); // replace + with space // g implies global
  var i = 0, exists = false;
  for (i; i < Cities.DB.length; i++) {
    if (Cities.DB[i].state.toUpperCase() === state.toUpperCase()) { // toUpperCase() converts all names to uppercase in order to avoid conflicts
      exists = true;
      break;
    }
  }

  if (exists)
    res.status(200).send({ cities: Cities.DB[i].cities });
  else res.status(404).send({ msg: "Invalid state name" });
};
