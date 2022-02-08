const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema definition for generic OTP (One Time Password) instance
const otpSchema = new Schema({
  mobile: String,
  code: Number,
  createdAt: { type: Date, default: Date.now },
});

// OTP expires in 15 minutes
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });
module.exports = mongoose.model("OTP", otpSchema);
