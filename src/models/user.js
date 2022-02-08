const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema definition for generic User
const userSchema = new Schema({
  fullName: String,
  identityNo: String,
  mobile: String, // treated as Key attribute (Multiple users not allowed using same login, for now)
  appointmentId: String,
  dosesTaken: Number,
});

module.exports = mongoose.model("User", userSchema);
