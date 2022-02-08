const mongoose = require("mongoose");

const User = require("../models/user");
const Appointment = require("../models/appointment");
const Center = require("../models/vaccinationCenter");

// Book an appointment slot
exports.create = (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({ msg: "Request body Missing" });
  }

  const mobile = req.body.mobile;
  const centerId = req.body.centerId;
  const date = req.body.date;

  // Check if user recently booked slot
  var recentlyBooked = function (aId) {
    var booked = true;
    if (aId.length > 0) {
      Appointment.findById(aId, function (err, appointment) {
        if (!(err)){
          if (appointment != null)
            booked = true;
          else booked = false;
        }
        else res.status(500).send({ error: "Unable to fetch appointments" });
      });
    } else {
      booked = false;
    }

    return booked;
  };

  // Find if user exists
  User.findOne({ mobile: mobile }, function (err, user) {
    if (!(err)){
      if (user) {
        if (user.identityNo.length > 0) {
          // Check if the user has already booked an appointment recently
          if (!recentlyBooked(user.appointmentId)) {
            Center.findById(centerId, function (errr, center) {
              if (errr){
                if (center != null) {
                  // Validate Date
                  const appointmentDate = new Date(date);
                  const now = new Date();

                  if (appointmentDate <= now) {
                    // Cannot book appointment on the same day
                    res.status(400).send({ msg: "Invalid Date" });
                  } else if ((appointmentDate - now) / (1000 * 3600 * 24) > 14) {
                    res.status(400).send({ msg: "Invalid Date" });
                  } else {
                    // Count the number of appointments of that center on the given date
                    Appointment.find(
                      { appointmentDate: appointmentDate, centerId: center._id },
                      function (errrr, appointments) {
                        if (!(errrr)) {
                          // Check appointment availability on the given date
                          if (appointments.length < center.slotsAvailable){
                            // Book an appointment

                            // Create an Appointment Instance
                            var appointment = new Appointment();
                            appointment.appointmentDate = appointmentDate;
                            appointment.appointmentNo = appointments.length + 1;
                            appointment.fullName = user.fullName;
                            appointment.identityNo = user.identityNo;
                            appointment.mobile = user.mobile;
                            appointment.centerId = center._id;

                            // Save Appointment Instance
                            appointment.save(function (errrrr, bookAppointment) {
                              if (!(errrrr)){
                                user.appointmentId = bookAppointment._id;
                                user.save();
                                res.status(200).send(bookAppointment);
                              }
                              else res.status(500).send({ error: "Unable to save appointment" });
                            });
                          }
                          else res.status(400).send({ msg: "No slots available on selected date" });
                        }
                        else res.status(500).send({ error: "Unable to fetch appointments" });
                      }
                    );
                  }
                } 
                else res.status(400).send({ msg: "Center not Found" });
              }
              else res.status(500).send({ error: "Fetching Centers Failed" });
            });
          }
          else res.status(400).send({ msg: "You have already booked an appointment within last 7 days" });
        } 
        else res.status(400).send({ msg: "User not registered" });
      } else res.status(400).send({ msg: "Unregistered mobile number" });
    }
    else res.status(500).send({ error: "Fetching Users Failed" });
  });
};

// Find appointment by id
exports.show = function (req, res) {
  var id = req.params.id;
  Appointment.findById(id, function (err, appointment) {
    if (!(err)) {
      if (appointment != null) {
        res.status(200).send(appointment);
      } 
      else res.status(400).send({ msg: "Appointment not found/expired" });
    }
    else res.status(500).send({ error: "Unable to fetch appointments" });
  });
};

// Get Appointments by Center ID
exports.query = function (req, res) {
  var center = (req.query.centerId != null);
  if (center) {
    var centerId = req.query.centerId;
    Appointment.find({ centerId: centerId }, function (err, appointments) {
      if (!(err))
        res.status(200).send({ results: appointments });
      else res.status(400).send({ error: "Unable to fetch appointments" });
    });
  }
  else res.status(400).send({ msg: "Query Parameters Missing" });
};

// Handles deletion of appointment
var deleteAppointment = (isCompleted) => {
  return (req, res) => {
    const id = req.params.id;
    Appointment.deleteOne({ _id: id }, function (err, aptDocs) {
      if (!(err)) {
        if (aptDocs.deletedCount > 0) {
          User.findOne({ appointmentId: id }, function (errr, user) {
            if (!(errr)) {
              if (user != null) {
                // Not necessary, appointmentId is updated during booking and appointments expire automatically.
                // Redundant measure (if MongoDB Indexes do not work as expected)
                user.appointmentId = "";

                if (isCompleted) {
                  user.dosesTaken += 1;
                }

                user.save(function (errrr) {
                  if (!(errrr))
                    res.status(200).send({ msg: "Appointment " + (isCompleted ? "completed" : "deleted") });
                  else res.status(400).send({ msg: "Unable to save user" });
                });
              } 
              else res.status(500).send({ error: "User already deleted" });
              // On user deletion, database cascading - all corresponding appointments deleted
            }
            else res.status(500).send({ error: "Unable to fetch user" });
          });
        } 
        else res.status(400).send({ msg: "No Appointment found / Invalid ID" });
      }
      else res.status(500).send({ error: "Unable to delete appointment" });
    });
  };
};

// Cancel Appointment by ID
exports.destroy = deleteAppointment(false);

// Complete Appointment by ID
exports.complete = deleteAppointment(true);
