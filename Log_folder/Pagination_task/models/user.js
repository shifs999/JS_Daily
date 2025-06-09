const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    email: String,
    gender: String,
    job_title: String,
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
