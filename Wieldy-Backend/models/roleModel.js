const mongoose = require("mongoose");

const { Schema } = mongoose;

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    // title: {
    //   type: String,
    //   unique: false,
    //   required: true
    // },
    // desc: {
    //   type: String
    // },
    // source: {
    //   type: Schema.Types.ObjectId,
    //   ref: "source"
    // }
  },
  {
    timestamps: true,
    strict: true,
    versionKey: false
  }
);

const Role = mongoose.model("role", RoleSchema);

module.exports = Role;

//i think role is not