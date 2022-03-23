const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      min: [3, "username to short"],
      max: [8, "username to long"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      min: [3, "password to short"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      min: [8, "email to short"],
      max: [50, "email to long"],
      unique: true,
    },
    isAvatarImageSet: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
