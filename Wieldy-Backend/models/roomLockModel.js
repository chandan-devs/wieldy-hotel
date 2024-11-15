const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const roomLockIdSchema = new Schema(
  {
    lockId: {
      type: String,
      required: true,
      unique: true
    },
    roomNumber: {
      type: String,
      required: true
    },
    lockAlias: {
      type: String,
      required: true
    },
    lockName: {
      type: String,
      required: true
    },
    propertyId: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const RoomLockId = model(
  "RoomLockId",
  roomLockIdSchema
);
module.exports = RoomLockId;
