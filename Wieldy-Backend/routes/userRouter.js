const express = require("express");
const userRouter = express.Router();
const userController = require("../controller/userController");
const guestAuth = require("../middleware/guestAuth");
const {sendPasscodeEmail} = require("../services/communicationManagement/emailService")

//login
userRouter.post(
  "/login",
  userController.login
);

userRouter.get(
  "/user-Hotel-reservations",
  guestAuth,
  userController.userAndHotelReservation
);

userRouter.get(
  "/user-Hotel-reservations/:_id",
  guestAuth,
  userController.userAndHotelReservationById
);

userRouter.get(
  "/getPasscode",
  guestAuth,
  userController.getPasscodeDetails
);

userRouter.post(
  "/postItem",
  guestAuth,
  userController.postItem
);


userRouter.post(
  "/keyShare",
  guestAuth,
  userController.keySharing
);

userRouter.post("/z", sendPasscodeEmail);


module.exports = userRouter;