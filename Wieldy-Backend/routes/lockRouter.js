const express = require("express");
const lockRouter = express.Router();
const {
  unlockStateDoor,
  getAccessToken,
  queryLockOpenState,
  lockListMap
} = require("../controller/lockController");
// const {
//   createPasskey
// } = require("../services/ttLockService");
const guestAuth = require("../middleware/guestAuth");



lockRouter.post("/ttlockmap", lockListMap);
// Route to unlock a lock
lockRouter.post(
  "/unlockDoor",
  guestAuth,
  unlockStateDoor
);

// Route to query the open state of a lock
lockRouter.get("/lock-openState", queryLockOpenState);

lockRouter.get("/ttlock-access-token", getAccessToken);

// //testing create passkey
// lockRouter.post(
//   "/ttlock-createpasskey",
//   createPasskey
// );


// Route to query the open state of a lock
// lockRouter.get('/lock-openState', lockController.queryLockOpenState);

lockRouter.get('/ttlock-access-token', getAccessToken);

module.exports = lockRouter;









module.exports = lockRouter;
