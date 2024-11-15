const express = require("express");
const siteminderRouter = express.Router();
const siteminderController = require("../controller/ReservationController");
const SMXController = require("../controller/hotelController");
const multer = require("multer");
const path = require("path");
const upload = multer({
  storage: multer.memoryStorage()
});
// const authentication = require("../middleware/authentication");
// const guestAuth = require("../middleware/userAuth");

//handling reservations data and posting to DB
// siteminderRouter.post(
//   "/apitest/wieldy",
//   siteminderController.handleReservationMessage
// );

siteminderRouter.post(
  "/listenevents",
  siteminderController.recieveBooking
);

//creating new hotel or onboard new hotel with siteminder
siteminderRouter.post(
  "/hotelRegister",
  upload.single("image"),
  SMXController.onBoardHotel
);

// //get OnBoarded Hotels
// siteminderRouter.get(
//   "/siteminder/onBoardedHotels/list",
//   authentication,
//   siteminderController.getOnBoardedHotels
// );

// // siteminder all reservations
// siteminderRouter.get(
//   "/siteminder/reservations",
//   authentication,
//   siteminderController.getSiteMinderReservation
// );

// siteminderRouter.get(
//   "/siteminder/user-Hotel-reservations",
//   guestAuth,
//   siteminderController.userAndHotelReservation
// );

// siteminderRouter.get(
//   "/siteminder/user-Hotel-reservations/:_id",
//   guestAuth,
//   siteminderController.userAndHotelReservationById
// );

// siteminderRouter.get(
//   "/getPasscode",
//   guestAuth,
//   siteminderController.getPasscodeDetails
// );

// siteminderRouter.get(
//   "/siteminder/mobile-app-logs-check",
//   siteminderController.consoleLogsMobileApp
// );

// siteminderRouter.get(
//   "/siteminder/lock-list-map/:propertyId",
//   siteminderController.lockListMap
// );

module.exports = siteminderRouter;
