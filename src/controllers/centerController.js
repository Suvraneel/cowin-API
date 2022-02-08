const mongoose = require("mongoose");
const Center = require("../models/vaccinationCenter");
const Appointment = require("../models/appointment");

// Create a Center
exports.create = function (req, res) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({ msg: "Request body missing." });
  } else {
    // Create new center instance
    var center = new Center();
    // Assign values from request payload
    center.centerName = req.body.centerName;
    center.state = req.body.state;
    center.city = req.body.city;
    center.pinCode = req.body.pinCode;
    center.slotsAvailable = req.body.slotsAvailable;

    // Save center instance
    center.save(function (err, savedCenter) {
      if (!(err))
        res.status(200).send(savedCenter);
      else res.status(500).send({ error: "Unable to create center" });
    });
  }
};

// Deleting a Center
exports.destroy = function (req, res) {
  var id = req.params.id;

  Center.deleteOne({ _id: id }, function (err, centerDetails) {
    if (!(err)) {
      if (centerDetails.deletedCount > 0) {
        Appointment.deleteMany({ centerId: id }, function (errr, aptDocs) {
          if (!(errr))
            res.status(200).send({ msg: "Center deleted, appointments cancelled: " + aptDocs.deletedCount });
          else res.status(500).send({ error: "Unable to delete appointments" });
        });
      } 
      else res.status(400).send({ msg: "Center not found / Invalid Center ID" });
    }
    else res.status(500).send({ error: "Unable to delete center" });
  });
};

// Updating a Center
exports.update = function (req, res) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({ msg: "Request body missing" });
  } else {
    // Change values of existing center with updated values from request payload
    var newCenter = {
      centerName: req.body.centerName,
      state: req.body.state,
      city: req.body.city,
      pinCode: req.body.pinCode,
      slotsAvailable: req.body.slotsAvailable,
    };

    Center.updateOne({ _id: req.params.id }, newCenter, function (err, details) {
      if (!(err))
        res.status(200).send(details);
      else res.status(500).send({ error: "Unable to update center" });
    });
  }
};

// Get a Center by its ID
exports.show = function (req, res) {
  Center.findById(req.params.id, function (err, center) {
    if (!(err)){
      if (center)
        res.status(200).send(center);
      else res.status(400).send({ msg: "No Centers found / Invalid ID" });
    }
    else res.status(500).send({ error: "Unable to fetch center" });
  });
};

// Get a Centers by City
exports.query = function (req, res) {
  var fetchCity = (req.query.city != null);
  if (fetchCity) {
    var city = req.query.city.replace(/\+/g, " ");  // replace + with space
    Center.find({ city: city }, function (err, centers) {
      if (!(err))
        res.status(200).send({ results: centers });
      else res.status(500).send({ error: "Unable to fetch centers" });
    });
  } 
  else res.status(400).send({ msg: "Query parameters missing" });
};
