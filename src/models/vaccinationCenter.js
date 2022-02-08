const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema definition for generic Vaccination Center
const centerSchema = new Schema({
  centerName: String,
  state: String,
  city: String,
  pinCode: Number,
  slotsAvailable: Number, //daily availability
});

module.exports = mongoose.model("Center", centerSchema);
