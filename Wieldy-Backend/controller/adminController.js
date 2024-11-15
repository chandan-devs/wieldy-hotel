const logger = require("../logger/winstonLogger");
const SMXResrvation = require("../src/siteminder/model/reservationModel");
const CBreservation = require("../src/cloudbeds/model/reservationModelCB");

async function getTotalReservations(req, res) {
  try {
    return res.status(200).send({
      message: "Records fetched Success",
      data: await Promise.all([
        SMXResrvation.find({}), 
        CBreservation.find({}) 
      ]).then(([SMXResrvation, CBreservation]) => ({
        SMXResrvation,
        CBreservation
      }))
    });
  } catch (error) {
    logger.info("ERR", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: JSON.stringify(error)
    });
  }
}

module.exports = {
  getTotalReservations
};
