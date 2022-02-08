const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema definition for generic Appointment
const appointmentSchema = new Schema({
  appointmentDate: { type: Date },
  appointmentNo: Number,
  fullName: String,
  identityNo: String,
  mobile: String,
  centerId: String,
});

// 7 days timeout between appointments
appointmentSchema.index({ appointmentDate: 1 }, { expireAfterSeconds: 604800 });
module.exports = mongoose.model("Appointment", appointmentSchema);
