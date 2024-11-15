const express = require("express");
const adminRouter = express.Router();
const adminController = require("../controller/adminController");
const authentication = require("../middleware/authentication");



adminRouter.get(
  "/getTotalReservations",
  adminController.getTotalReservations
);

module.exports = adminRouter;