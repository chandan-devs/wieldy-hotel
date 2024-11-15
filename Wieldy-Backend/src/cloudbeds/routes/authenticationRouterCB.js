const express = require("express");
const authController = require("../controller/authenticationControllerCB");
const reservationDataPage = require("../controller/reservationData");
const ttlockservice = require("../../../services/ttLock/ttLockService");
const guestAuth = require("../../../middleware/guestAuth");

const authRouter = express.Router();




//cloud beds test changes
authRouter.get(
  "/oAuth2O",
  authController.oAuth2O1
);


// getting access and refresh token
authRouter.get("/", authController.displayHomePage);

// getting access and refresh token
authRouter.post(
  "/auth/get_Access_And_Refresh_Token",
  authController.getAccessToken
);

//getting access token
authRouter.post(
  "/auth/getAccessToken",
  authController.exchangeRefershToken
);

//sending our webhook to cloudbeds
authRouter.post(
  "/auth/postWebhook",
  authController.sendWebhook
);

//getting access token
authRouter.post(
  "/receive_booking_request",
  reservationDataPage.processReservation
);


//step 1 button call and make all integration with it
authRouter.get(
  "/api/initial-call",
  authController.buttonCall
);

authRouter.post(
  "/api/checkin",
  guestAuth,
  reservationDataPage.putReservations
);

authRouter.post(
  "/api/post_custom_fields",
  reservationDataPage.postCustomField
);

authRouter.get(
  "/api/get_custom_field",
  reservationDataPage.getCustomField
);

//generate passcode api

authRouter.post(
  "/api/ttlock_passcode_generate",
  ttlockservice.createPasskey
);

//lock list map
authRouter.get(
  "/api/ttlockmap",
  reservationDataPage.lockListMap
);

authRouter.get(
  "/api/getItems",
  guestAuth,
  reservationDataPage.getItems
);

authRouter.post(
  "/api/postItem",
  guestAuth,
  reservationDataPage.postItem
);

// get reservations
// authRouter.get(
//   "/api/getallReservations",
//   guestAuth,
//   reservationDataPage.userAndHotelReservation
// );

// //get reservations by id
// authRouter.get(
//   "/api/getReservationById/:_id",
//   guestAuth,
//   reservationDataPage.userAndHotelReservationById
// );

//get passcode details
authRouter.get(
  "/api/getPasscode",
  guestAuth,
  reservationDataPage.getPasscodeDetails
);



module.exports = authRouter