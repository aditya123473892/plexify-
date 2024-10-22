const mongoose = require("mongoose");

let userschema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

let User = mongoose.model("User", userschema);

module.exports = User;
