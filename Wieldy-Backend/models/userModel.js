const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // email: {
    //   type: String,
    //   unique: true
    // },
    // contact: {
    //   type: String
    //   // unique: true
    // },
    email: {
      type: String,
      unique: true,
    },
    contact: {
      type: String,
      unique: true,
    },
    permissions: {
      roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "role",
          required: true,
        },
      ],
      source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "source",
        required: true,
      },
    },
    guestTTLockCredentials: {
      ttLockUsername: { type: String },
      ttLockMD5Password: { type: String },
      ttLockAccessToken: { type: String },
      ttLockRefreshToken: { type: String },
      ttLockPassword: { type: String },
      ttLockUsername: { type: String },
      doorPasscode: { type: String }, // Optional, used for password reset
      passcodeExpiry: { type: Date },
    },
    password: { type: String, required: true },
    unlockingRecords: [
      {
        date: { type: Date, required: false },
        record: { type: String, required: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 3);
//   next();
// });

const User = mongoose.model("user", userSchema);

module.exports = User;
