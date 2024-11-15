const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const extendSchema = require("mongoose-extend-schema");
const BaseSchema = require("../../../utils/baseSchema");

const siteminderPropertySchema = extendSchema(
  BaseSchema,
  {
    propertyName: {
      type: String,
      required: true,
      unique: true
    },
    propertyId: {
      type: String,
      required: true,
      unique: true
    },
    propertyType: {
      type: String,
      required: true
      // unique: true
    },
    emailId: {
      type: String,
      required: true,
      unique: true
    },
    propertyLocation: {
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      }
    },
    phoneNo: {
      countryCode: {
        type: String,
        required: true
      },
      number: {
        type: String,
        required: true,
        unique: true
      }
    },
    statusBar: {
      type: String,
      required: true,
      enums: [
        "Onboarding",
        "Installation",
        "Testing",
        "Live"
      ]
    },
    PMSsource: {
      type: Schema.Types.ObjectId,
      ref: "source",
      required: true
    },
    propertyPublisherName: {
      type: String,
      required: true,
      unique: true
    },
    propertyImage: {
      type: String,
      required: false
    },
    defaultTimeZone: {
      type: String,
      required: false
    },
    defaultCheckInTime: {
      type: String,
      required: true
    },
    defaultCheckOutTime: {
      type: String,
      required: true
    },
    ttLockData: {
      ttLockUserName: String,
      ttLockMD5Password: String,
      ttLockPassword: String,
      ttLockAccessToken: String,
      ttLockRefreshToken: String,
      ttLockslist: [Object]
    },
    isFrontDoor: {
      default: false,
      type: Boolean,
      required: true
    },
    isPasscode: {
      default: true,
      type: Boolean,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const siteminderProperty = model(
  "siteminderProperty",
  siteminderPropertySchema
);
module.exports = siteminderProperty;
