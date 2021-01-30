const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    max: 11,
  },
  totalfollowing: {
    type: Number,
    required: true,
  },
  totalfollowers: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  api_key: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Users", UserSchema);
