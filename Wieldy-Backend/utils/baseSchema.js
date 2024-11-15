const mongoose = require("mongoose");

const { Schema } = mongoose;

const BaseSchema = new Schema({
  status: {
    default: true,
    type: Boolean,
    required: true
  },
  isDeleted: {
    default: false,
    type: Boolean,
    required: true
  },
  // createdBy: {
  //   type: Schema.Types.ObjectId,
  //   ref: "user"
  // },
  // updatedBy: {
  //   type: Schema.Types.ObjectId,
  //   ref: "user"
  // }
});
module.exports = BaseSchema;
