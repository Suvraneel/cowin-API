const mongoose = require("mongoose");
const User = require("../models/user");
const Center = require("../models/vaccinationCenter").default;
const OTP = require("../models/otp").default;
const Appointment = require("../models/appointment");
const Cities = require("../../cities");

/*  Developer Endpoints */
//  The following functions can be used while developing, testing, or demonstrating the API.

// Wipes all data from the Database
exports.wipe = function (req, res) {
  User.deleteMany({}, function (err) {
    if (err)
      res.status(500).send({ error: "Unable to delete users" });
  });

  Center.deleteMany({}, function (err) {
    if (err)
      res.status(500).send({ error: "Unable to delete centers" });
  });

  OTP.deleteMany({}, function (err) {
    if (err)
      res.status(500).send({ error: "Unable to delete OTPs" });
  });

  Appointment.deleteMany({}, (err) => {
    if (err)
      res.status(500).send({ error: "Unable to delete appointments" });
  });

  OTP.collection.dropIndexes();
  Appointment.collection.dropIndexes();
  res.status(200).send({ msg: "Database cleared" });
};

// Creates dummy centers for all cities
exports.fill = function (req, res) {
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));

  const type = ["Hospital", "Hospital", "Center", "Clinic", "Healthcenter", "School"];

  for (let ct of Cities.DB) {
    var state = ct.state;

    for (let centr of ct.cities) {
      // Two centers for each city (T/V/C)
      for (let k = 0; k < 2; k++) {
        var city = centr;
        var pin = Math.floor(Math.random() * 899999) + 100000;
        var name =
          alphabet[Math.floor(Math.random() * 26)] +
          alphabet[Math.floor(Math.random() * 26)] +
          alphabet[Math.floor(Math.random() * 26)] +
          " " +
          type[Math.floor(Math.random() * 6)];

        // New center instance
        var center = new Center();
        center.centerName = name;
        center.state = state;
        center.city = city;
        center.pinCode = pin;
        center.slotsAvailable = 100;
        console.log(center);
      }
    }
  }

  res.status(200).send({ msg: "Done" });
};
