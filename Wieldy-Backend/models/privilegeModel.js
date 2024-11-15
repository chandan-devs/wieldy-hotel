const mongoose = require("mongoose");
const extendSchema = require("mongoose-extend-schema");
const BaseSchema = require("../utils/baseSchema");

const { Schema } = mongoose;
const PrivilegeSchema = extendSchema(
  BaseSchema,
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    roles: [
      {
        role: {
          type: Schema.Types.ObjectId,
          ref: "role",
          required: true
        },
        createdBy: {
          type: Schema.Types.ObjectId,
          ref: "user"
        },
        updatedBy: {
          type: Schema.Types.ObjectId,
          ref: "user"
        }
      }
    ]
  },
  {
    timestamps: true,
    strict: true,
    versionKey:false
  }
);

const Privilege = mongoose.model(
  "privilege",
  PrivilegeSchema
);

module.exports = Privilege;
