const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    salt: { type: String },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");
  this.salt = salt;
  this.password = createHmac("sha256", salt).update(this.password).digest("hex");

  next();
});

// Custom static method for password validation
UserSchema.statics.matchPasswordAndGenerateToken = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");

  const userProvidedHash = createHmac("sha256", user.salt).update(password).digest("hex");

  if (user.password !== userProvidedHash) {
    throw new Error("Error Cannot match Password");
  }

  return user;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
