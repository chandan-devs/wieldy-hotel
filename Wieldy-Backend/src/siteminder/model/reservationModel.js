const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    status: String,
    pos: [Object],
    unique: String,
    total: [Object],
    reservationId: [Object],
    profileId: [Object],
    customerData: [Object],
    companyData: [Object],
    basicProperty: [Object],
    passcodeDetails: String,
    mainDoorPasscode: String,
    roomStays: [Object],
    services: [Object],
    resGuests: [Object],
    shareAllMarketInd: [String],
    shareAllOptOutInd: [String]
    // timeSpan: Object
  },
  {
    versionKey: false,
    timestamps: true,
    strict: true
  }
);

const reservationSMX = mongoose.model(
  "ReservationSMX",
  reservationSchema
);

module.exports = reservationSMX;
