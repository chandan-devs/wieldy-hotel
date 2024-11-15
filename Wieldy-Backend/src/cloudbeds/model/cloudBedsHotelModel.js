const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const extendSchema = require("mongoose-extend-schema");
const BaseSchema = require("../../../utils/baseSchema");

const propertySchema = extendSchema(
  BaseSchema,
  {
    propertyName: {
      type: String,
      required: false,
      //   unique: true
    },
    propertyEmail: {
      type: String,
      required: false,
    },
    propertyType: {
      type: String,
      required: false,
      // unique: true
    },
    propertyPhone: {
      type: String,
      required: false,
    },
    propertyId: {
      type: String,
      required: false,
      // unique: true
    },
    propertyImage: [Object],
    propertyDescription: [Object],
    propertyCurrency: [Object],
    name: {
      type: String,
      required: false,
      //   unique: true
    },
    emailId: {
      type: String,
      required: false,
      //   unique: true
    },
    app_state: {
      type: String,
      required: false,
      //   unique: true
    },
    propertyAddress: Object,
    defaultTimeZone: {
      type: String,
      required: false,
    },
    propertyPolicy: Object,
    ttLockData: {
      ttLockUserName: String,
      ttLockMD5Password: String,
      ttLockPassword: String,
      ttLockAccessToken: String,
      ttLockRefreshToken: String,
      ttLockslist: [Object],
    },
    isFrontDoor: {
      default: false,
      type: Boolean,
      required: true,
    },
    isDoorKeypad: {
      type: Boolean,
      default: false,
      required: true,
    },
    statusBar: {
      type: String,
      //   required: true,
      enums: ["Onboarding", "Installation", "Testing", "Live"],
    },
    PMSsource: {
      type: Schema.Types.ObjectId,
      ref: "source",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    strict: true,
  }
);

const cloudBedsHotel = model("cloudBedsHotel", propertySchema);
module.exports = cloudBedsHotel;
