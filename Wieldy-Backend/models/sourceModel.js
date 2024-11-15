const mongoose = require("mongoose");
const { model } = mongoose;
const extendSchema = require("mongoose-extend-schema");
const BaseSchema = require("../utils/baseSchema");

const sourceSchema = extendSchema(
  BaseSchema,
  {
    sourceName: {
      type: String,
      required: true,
      unique: true
    },
    website: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true,
    strict: true
  }
);

const source = model("source", sourceSchema);
module.exports = source;
