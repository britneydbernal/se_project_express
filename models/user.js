const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: { validator: validator.isEmail, message: "Enter a valid email" },
  },
  password: { type: String, required: true, select: false },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: { validator: validator.isURL, message: "Enter a valid URL" },
  },
});

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.statics.findUserByCredentials = async function findUserByCredentials(
  email,
  password
) {
  const user = await this.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Incorrect email or password");
  }
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) throw new Error("Incorrect email or password");
  return user;
};

module.exports = mongoose.model("user", userSchema);
