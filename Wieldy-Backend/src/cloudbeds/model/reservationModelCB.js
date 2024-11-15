const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    status: String,
    isDeleted: {
      default: false,
      type: Boolean,
      required: true
    },
    propertyID: Number,
    guestName: String,
    guestPhone: String,
    guestEmail: String,
    reservationID: {
      type: String,
      unique: true
    },
    total: Number,
    timeSpan: {
      checkInDate: String,
      checkOutDate: String
    },
    guestList: Object,
    balanceDetailed: Object,
    source: {
      sourceName: String,
      sourceID: String
    },
    thirdPartyIdentifier: String,
    assigned: [Object],
    unassigned: [Object],
    customFields: [Object],
    passcodeDetails: String,
    mainDoorPasscode: String,
    dateCreated: String,
    dateModified: String
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const reservationCB = mongoose.model(
  "ReservationCB",
  reservationSchema
);

module.exports = reservationCB;
