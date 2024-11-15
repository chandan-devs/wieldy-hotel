const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const extendSchema = require("mongoose-extend-schema");
const BaseSchema = require("../../../utils/baseSchema");

const authCodeSchema = extendSchema(
  BaseSchema,
  {
    access_token: {
      type: String,
      required: false
    },
    // state: {
    //   type: String,
    //   required: true,
    // },
    refresh_token: {
      type: String,
      required: false
    },
    propertyId: {
      type: String,
      required: false
      //   unique: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const authCodeModel = model(
  "authCodeModel",
  authCodeSchema
);
module.exports = authCodeModel;
