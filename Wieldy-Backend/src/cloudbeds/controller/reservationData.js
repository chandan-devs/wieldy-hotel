const fs = require("fs");
const axios = require("axios");
const querystring = require("querystring");
const crypto = require("crypto");
const logger = require("../../../logger/winstonLogger");
const property = require("../model/cloudBedsHotelModel");
const {
  checkAccessToken,
  renewAccessToken,
} = require("../controller/authenticationControllerCB");
const authCodeModel = require("../model/authenticationModelCB");
const reservation = require("../model/reservationModelCB");
const roomLockId = require("../../../models/roomLockModel");
const ttlockService = require("../../../services/ttLock/ttLockService");
const userController = require("../../../controller/userController");
const User = require("../../../models/userModel");
const cloudBedsHotel = require("../model/cloudBedsHotelModel");
const reservationCB = require("../model/reservationModelCB");
const Source = require("../../../models/sourceModel");
const reservationSMX = require("../../siteminder/model/reservationModel");
require("dotenv").config();
const {
  sendPasscodeEmail,
} = require("../../../services/communicationManagement/emailService");
const siteminderProperty = require("../../siteminder/model/SMXHotelModel");

async function processReservation(req, res) {
  try {
    //create new user before check acess token and if corect then get all reservation details and work else genereate again
    // {
    //   "reservationID": "3YM6AW9QV",
    //   "propertyID": 6980934886756353,
    //   "propertyID_str": "6980934886756353",
    //   "startDate": "2024-08-16",
    //   "endDate": "2024-08-17",
    //   "version": "1.0",
    //   "event": "reservation/created",
    //   "timestamp": 1723634691.440659
    // }
    //test check api start
    //   {
    //   "reservationID": "C6DBJFZCE",
    //   "propertyID": 6980934886756353,
    //   "propertyID_str": "6980934886756353",
    //   "startDate": "2024-09-17",
    //   "endDate": "2024-09-18",
    //   "version": "1.0",
    //   "event": "reservation/created",
    //   "timestamp": 1726566811.51049
    // }

    //     |   "reservationId": "EFZQ06YPN",
    // 1|index  |   "propertyId": 6980934886756353,
    // 1|index  |   "propertyId_str": "6980934886756353",
    // 1|index  |   "version": "1.0",
    // 1|index  |   "event": "reservation/deleted",
    // 1|index  |   "timestamp": 1727350621.646936
    // 1|index  | }
    logger.info(`<< Reservation receving process start for CloudBeds >>`);
    const reservationData = req.body;
    if (!reservationData) {
      return res.status(400).send({
        success: false,
        message: "Empty payload",
        data: null,
      });
    }
    logger.info(
      `cloudBeds_reservation_request:\n${JSON.stringify(
        reservationData,
        null,
        2
      )}`
    );

    const propertyID =
      reservationData.propertyID_str || reservationData.propertyId_str;
    const reservationID =
      reservationData.reservationID || reservationData.reservationId;
    const event = reservationData.event;

    let propertyActiveCheck = await cloudBedsHotel
      .findOne({
        propertyId: propertyID,
      })
      .select("status -_id");
    if (!propertyActiveCheck.status) {
      logger.info(`<< Disabled Property in Wieldy DB >>`);
      return res.status(400).send({
        success: false,
        message: "Disabled Property in Wieldy DB",
        data: null,
      });
    }

    let access_token = await authCodeModel
      .findOne({
        propertyId: propertyID,
      })
      .select("access_token _id refresh_token");
    const authID = access_token._id;
    const token = access_token.access_token;
    const refreshToken = access_token.refresh_token;
    let tokenCheck = await checkAccessToken(token);
    if (!tokenCheck) {
      console.log(1);
      let newAccessToken = await renewAccessToken(refreshToken);
      // console.log("newAccessToken", newAccessToken);

      let updatedRecord = await authCodeModel.findByIdAndUpdate(
        authID,
        {
          access_token: newAccessToken,
        },
        { new: true }
      );
      if (updatedRecord) {
        console.log("new token updated to db sucess");
      }
    }
    console.log(2);
    let newToken = await authCodeModel
      .findOne({
        propertyId: propertyID,
      })
      .select("access_token");

    const getReservationUrl =
      "https://api.cloudbeds.com/api/v1.2/getReservation";
    // console.log("access_token", newToken.access_token);
    // console.log(
    //   "reservationid",
    //   reservationData.reservationID
    // );

    const response = await axios.get(
      `${getReservationUrl}?reservationID=${reservationID}`,
      {
        headers: {
          Authorization: `Bearer ${newToken.access_token}`,
          Cookie:
            "acessa_session=60fa4d3b5f9ad6406f5087ebcf580f7c7dc995a6; acessa_session_enabled=1; csrf_accessa_cookie=483c6d1ec5ba7b404c99a5f83418a262",
        },
      }
    );

    if (event === "reservation/deleted") {
      await reservation.deleteMany({ reservationID });
      logger.info("Reservation(s) Deleted Successfully");
    }
    if (!response.data.success) {
      // console.log("Response data:", response.data);
      await reservation.deleteMany(
        { reservationID },
        {
          isDeleted: true,
        },
        { new: true }
      );
      logger.info("Reervation Deleted Sucess");
      return res.status(400).send({
        success: true,
        message: "Reervation Deleted Sucess",
      });
    }

    const reservationCreateObj = {
      status: response.data.data.status,
      propertyID: response.data.data.propertyID,
      guestName: response.data.data.guestName,
      guestEmail: response.data.data.guestEmail,
      guestPhone:
        Object.keys(response.data.data.guestList).length > 0
          ? response.data.data.guestList[
              Object.keys(response.data.data.guestList)[0]
            ].guestPhone
          : "",
      reservationID: response.data.data.reservationID,
      total: response.data.data.total,
      timeSpan: {
        checkInDate: response.data.data.startDate,
        checkOutDate: response.data.data.endDate,
      },
      guestList: response.data.data.guestList,
      balanceDetailed: response.data.data.balanceDetailed,
      source: {
        sourceName: response.data.data.source,
        sourceID: response.data.data.sourceID,
      },
      thirdPartyIdentifier: response.data.data.thirdPartyIdentifier,
      assigned: response.data.data.assigned,
      unassigned: response.data.data.unassigned,
      customFields: response.data.data.customFields,
      dateCreated: response.data.data.dateCreated,
      dateModified: response.data.data.dateModified,
    };

    //check exist so modify

    let reservationCheck = await reservation.find({
      reservationID: reservationID,
      isDeleted: false,
    });
    let propertyAccessToken = await cloudBedsHotel
      .findOne({ propertyId: propertyID })
      .select("ttLockData.ttLockAccessToken -_id");
    let ttLockUsername,
      passcode,
      ttLockMD5,
      ttLockpass,
      ttLockpasscodeExpiry,
      ttLockaccessToken,
      ttLockrefreshToken;
    if (reservationCheck.length > 0) {
      console.log(3);
      let updatedReservation = await reservation.updateMany(
        { reservationID },
        reservationCreateObj,
        { new: true }
      );
      console.log("updated reservation", updatedReservation);
      const hasRoomTypeName = Object.values(
        reservationCreateObj.guestList
      ).some((guest) => guest.roomTypeName);
      if (hasRoomTypeName) {
        let roomTypeNames = Object.values(reservationCreateObj.guestList)
          .filter((guest) => guest.assignedRoom) // Only consider guests with an assigned room
          .map((guest) => guest.roomTypeName);
        let frontDoorCheck = await cloudBedsHotel
          .findOne({ propertyId: propertyID })
          .select("isFrontDoor isDoorKeypad -_id");
        if (frontDoorCheck.isFrontDoor) {
          roomTypeNames.push("2024"); //by default 2024 for front door every prop but diff prop id
        }
        let reservation_for_tt = {
          guestName: reservationCreateObj.guestName,
          roomIds: roomTypeNames, //need to be specified
          propertyId: propertyID,
          reservationID: reservationID,
          // reservationID:
          //   reservationCreateObj.reservationID,
          timeSpan: reservationCreateObj.timeSpan,
          source: "CloudBeds",
          propertyAccessToken,
        };
        let passcodeCreation = await ttlockService.createPasskey(
          reservation_for_tt,
          req,
          res
        );
        ttLockUsername = passcodeCreation.username;
        ttLockMD5 = passcodeCreation.md5;
        ttLockpass = passcodeCreation.password;
        ttLockpasscodeExpiry = passcodeCreation.passcodeExpiry;
        ttLockaccessToken = passcodeCreation.accessToken;
        ttLockrefreshToken = passcodeCreation.refreshToken;
        passcode = passcodeCreation.passcodeDetails;
        if (passcodeCreation) {
          console.log("update passkey and room sucess");
        }
        let hotelDetails = await cloudBedsHotel
          .findOne({ propertyId: propertyID })
          .select(
            "propertyName defaultCheckInTime defaultCheckOutTime propertyEmail -_id"
          );
        hotelDetails = hotelDetails.toObject();
        console.log("hotelDetails", hotelDetails);
        // const userData = {
        //   name: reservationCreateObj.guestName,
        //   ttLockUsername: ttLockUsername,
        //   ttLockMD5,
        //   ttLockpass,
        //   ttLockpasscodeExpiry,
        //   ttLockaccessToken,
        //   ttLockrefreshToken,
        //   email: reservationCreateObj.guestEmail,
        //   contact: reservationCreateObj.guestPhone,
        //   passcodeData: passcode,
        //   source: "CloudBeds",
        //   role: "guest",
        //   timeSpan: reservationCreateObj.timeSpan,
        //   hotelDetail: {
        //     propertyName: hotelDetails.propertyName,
        //     defaultCheckInTime:
        //       hotelDetails.defaultCheckInTime,
        //     defaultCheckOutTime:
        //       hotelDetails.defaultCheckOutTime,
        //     propertyEmail: hotelDetails.propertyEmail
        //   }
        // };
        // console.log("userData", userData);
        // const createUserResponse =
        //   await userController.createUser({
        //     body: userData
        //   });

        // const { flag, flag2 } = createUserResponse;

        // if (flag && flag2) {
        //   console.log(
        //     "User created and mail sent successfully"
        //   );
        // } else if (flag && !flag2) {
        //   console.log("User created without mail");
        // } else {
        //   console.log(
        //     "User creation failed or something went wrong"
        //   );
        // }
      }
      logger.info(`<< Reservation receving process end for CloudBeds >>`);
      return res.status(200).send({
        success: response.data.success,
        message: "Reseervation Modified Sucessfully",
        data: response.data.data,
      });
    } else {
      // let ttLockUsername,
      //   passcode,
      //   ttLockMD5,
      //   ttLockpass,
      //   ttLockpasscodeExpiry,
      //   ttLockaccessToken,
      //   ttLockrefreshToken;

      console.log(4);
      const savedReservation = await reservation.create(reservationCreateObj);
      if (savedReservation) {
        console.log("reservation saved sucess", savedReservation);
        const hasRoomTypeName = Object.values(
          reservationCreateObj.guestList
        ).some((guest) => guest.roomTypeName);
        console.log("hasRoomTypeName", hasRoomTypeName);
        if (hasRoomTypeName) {
          //passcode generating
          let roomTypeNames = Array.isArray(reservationCreateObj.assigned)
            ? reservationCreateObj.assigned.map(
                (assignment) => assignment.roomTypeName
              )
            : [];
          let frontDoorCheck = await cloudBedsHotel
            .findOne({ propertyId: propertyID })
            .select("isFrontDoor isDoorKeypad -_id");
          if (frontDoorCheck.isFrontDoor) {
            roomTypeNames.push("2024");
          }
          console.log("roomTypeNames", roomTypeNames);
          let reservation_for_tt = {
            guestName: savedReservation.guestName,
            roomIds: roomTypeNames,
            propertyId: propertyID,
            reservationID: savedReservation.reservationID,
            timeSpan: savedReservation.timeSpan,
            source: "CloudBeds",
            propertyAccessToken,
          };

          const createPasskey = await ttlockService.createPasskey(
            reservation_for_tt
          );
          console.log("createPasskey", createPasskey);
          ttLockUsername = createPasskey.username;
          ttLockMD5 = createPasskey.md5;
          ttLockpass = createPasskey.password;
          ttLockpasscodeExpiry = createPasskey.passcodeExpiry;
          ttLockaccessToken = createPasskey.accessToken;
          ttLockrefreshToken = createPasskey.refreshToken;
          passcode = createPasskey.passcodeDetails;

          if (reservationCreateObj.guestEmail) {
            console.log("ttLockUsername", ttLockUsername);
            let hotelDetails = await cloudBedsHotel
              .findOne({ propertyId: propertyID })
              .select(
                "propertyName defaultCheckInTime defaultCheckOutTime propertyEmail -_id"
              );
            hotelDetails = hotelDetails.toObject();
            console.log("hotelDetailsssss", hotelDetails);
            //create user
            const userData = {
              name: reservationCreateObj.guestName,
              ttLockUsername: ttLockUsername,
              ttLockMD5,
              ttLockpass,
              ttLockpasscodeExpiry,
              ttLockaccessToken,
              ttLockrefreshToken,
              email: reservationCreateObj.guestEmail,
              contact: reservationCreateObj.guestPhone,
              passcodeData: passcode,
              source: "CloudBeds",
              role: "guest",
              timeSpan: reservationCreateObj.timeSpan,
              hotelDetail: {
                propertyName: hotelDetails.propertyName,
                defaultCheckInTime: hotelDetails.defaultCheckInTime,
                defaultCheckOutTime: hotelDetails.defaultCheckOutTime,
                propertyEmail: hotelDetails.propertyEmail,
              },
              emailType: null,
              senderName: null,
            };
            console.log("userDataaaaa", userData);
            const createUserResponse = await userController.createUser({
              body: userData,
            });

            const { flag, flag2 } = createUserResponse;

            if (flag && flag2) {
              console.log("User created and mail sent successfully");
            } else if (flag && !flag2) {
              console.log("User created without mail");
            } else {
              console.log("User creation failed or something went wrong");
            }
          }
        }
        logger.info(`<< Reservation receving process end for CloudBeds >>`);
        return res.status(200).send({
          success: response.data.success,
          message: "Reseervation added Sucessfully",
          data: response.data.data,
        });
      }
    }
  } catch (error) {
    logger.error(error.stack);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: JSON.stringify(error),
    });
  }
}

async function getItems(req, res) {
  try {
    const { propertyID, category, itemID } = req.query;
    if (!propertyID) {
      return res.status(400).send({
        sucess: false,
        message: "Property Id Not Found",
        data: null,
      });
    }
    let access_token = await authCodeModel
      .findOne({
        propertyId: propertyID,
      })
      .select("access_token _id refresh_token");

    const authID = access_token._id;
    const token = access_token.access_token;
    const refreshToken = access_token.refresh_token;
    let tokenCheck = await checkAccessToken(token);
    if (!tokenCheck) {
      let newAccessToken = await renewAccessToken(refreshToken);
      // console.log("newAccessToken", newAccessToken);

      let updatedRecord = await authCodeModel.findByIdAndUpdate(
        authID,
        {
          access_token: newAccessToken,
        },
        { new: true }
      );
      if (updatedRecord) {
        console.log("new token updated to db sucess");
      }
    }
    let newToken = await authCodeModel
      .findOne({
        propertyId: propertyID,
      })
      .select("access_token");
    const url = "https://api.cloudbeds.com/api/v1.2/getItems";
    const headers = {
      Authorization: `Bearer ${newToken.access_token}`,
    };

    // Make the GET request
    const response = await axios.get(url, {
      headers: headers,
    });
    // response.data.data = response.data.data.filter(
    //   (el) => {
    //     const categoryRegex = new RegExp(
    //       category,
    //       "i"
    //     );
    //     const isCategoryFound = categoryRegex.test(
    //       el.categoryName
    //     );
    //     const isDigitFound = /^\d/.test(category);
    //     const isItemIDMatch = itemID
    //       ? el.itemID === itemID
    //       : true;

    //     if (
    //       (isCategoryFound || isDigitFound) &&
    //       isItemIDMatch
    //     ) {
    //       return true;
    //     }

    //     return response.data.data.some((item) =>
    //       categoryRegex.test(item.categoryName)
    //     )
    //       ? false
    //       : true;
    //   }
    // );

    //  return res.status(200).send({
    //    sucess: response.data.success,
    //    message:
    //      response.data.data.length > 0
    //        ? "Items records Fetched Success"
    //        : "Records Not Found",
    //    count:
    //      propertyID === "19577"
    //        ? "0"
    //        : response.data.data.length,
    //    data:
    //      propertyID === "19577"
    //        ? " "
    //        : response.data.data
    //  });

    response.data.data = response.data.data.filter((el) => {
      const categoryRegex = new RegExp(category, "i");
      const isCategoryFound = categoryRegex.test(el.categoryName);
      const isDigitFound = /^\d/.test(category);
      const isItemIDMatch = itemID ? el.itemID === itemID : true;

      // If either category is found or the category is a digit, and itemID matches (if provided), return true.
      if ((isCategoryFound || isDigitFound) && isItemIDMatch) {
        return true;
      }

      // Return false if no match is found to exclude the element from the result.
      return false;
    });

    return res.status(200).send({
      sucess: response.data.success,
      message:
        response.data.data.length > 0
          ? "Items records Fetched Sucess"
          : "Records Not Found",
      count: response.data.data.length,
      data: response.data.data,
    });
  } catch (error) {
    logger.info("ERR", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: JSON.stringify(error),
    });
  }
}

async function postItem(req, res) {
  try {
    const { itemID, itemQuantity, reservationID } = req.query;
    if (!itemID || !itemQuantity || !reservationID) {
      return res.status(400).send({
        success: false,
        message:
          "Missing required parameters: itemID, itemQuantity, and reservationID are all mandatory.",
        data: null,
      });
    }
    const data = querystring.stringify({
      itemID,
      itemQuantity,
      reservationID,
    });

    let propertyId = await reservation
      .findOne({
        reservationID: reservationID,
      })
      .select("propertyID -_id");

    let access_token = await authCodeModel
      .findOne({
        propertyId: propertyId.propertyID,
      })
      .select("access_token _id refresh_token");

    const authID = access_token._id;
    const token = access_token.access_token;
    const refreshToken = access_token.refresh_token;
    let tokenCheck = await checkAccessToken(token);
    if (!tokenCheck) {
      let newAccessToken = await renewAccessToken(refreshToken);
      // console.log("newAccessToken", newAccessToken);

      let updatedRecord = await authCodeModel.findByIdAndUpdate(
        authID,
        {
          access_token: newAccessToken,
        },
        { new: true }
      );
      if (updatedRecord) {
        console.log("new token updated to db sucess");
      }
    }
    let newToken = await authCodeModel
      .findOne({
        propertyId: propertyId.propertyID,
      })
      .select("access_token");

    const response = await axios.post(
      "https://api.cloudbeds.com/api/v1.2/postItem",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${newToken.access_token}`, // Replace 'mytoken' with your actual token
        },
      }
    );
    if (response.status === 200) {
      return res.status(200).send({
        success: response.data.success,
        message: "Item Sucessfully addded to reservation",
        data: response.data.data,
      });
    }
    return res.status(400).send({
      success: false,
      message: "Error in calling API post item",
      data: null,
    });
  } catch (error) {
    logger.info("ERR", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: JSON.stringify(error),
    });
  }
}

//put reservation and set callback url first
async function putReservations(req, res) {
  try {
    let source = await Source.findById(req.user.permissions.source).select(
      "sourceName"
    );
    if (source.sourceName === "Siteminder") {
      let reservationData = await reservationSMX.findByIdAndUpdate(
        {
          _id: req.body.bookingid,
        },
        {
          status: "In-House",
        },
        {
          new: true,
        }
      );
      let userData = await reservationSMX
        .findOne({ _id: req.body.bookingid })
        .select("customerData -_id");
      userData = userData.toObject();
      let propertyEmail = await siteminderProperty
        .findOne({
          propertyId: req.body.propertyID,
        })
        .select("emailId propertyName -_id");
      propertyEmail = propertyEmail.toObject();
      let bookingdetail = {
        firstName:
          userData.customerData[0].PersonName[0].GivenName +
          " " +
          userData.customerData[0].PersonName[0].Surname,
        customerEmail: userData.customerData[0].Email[0]._,
        propertyEmail: propertyEmail.emailId,
        propertyName: propertyEmail.propertyName,
        reservationid: req.body.reservationid,
      };
      const emailResult = await sendPasscodeEmail(
        null,
        null, //before this is going passcodeData for room sharing pascodes
        null,
        "checkIn_update",
        bookingdetail
      );
      if (emailResult.success) {
        return res.status(200).send({
          message: "Checkin Succesfull and mail sent sucess",
        });
      }
    } else if (source.sourceName === "CloudBeds") {
      let access_token = await authCodeModel
        .findOne({
          propertyId: req.body.propertyID,
        })
        .select("access_token _id refresh_token");

      const authID = access_token._id;
      const token = access_token.access_token;
      const refreshToken = access_token.refresh_token;
      let tokenCheck = await checkAccessToken(token);
      if (!tokenCheck) {
        let newAccessToken = await renewAccessToken(refreshToken);
        console.log("newAccessToken", newAccessToken);

        let updatedRecord = await authCodeModel.findByIdAndUpdate(
          authID,
          {
            access_token: newAccessToken,
          },
          { new: true }
        );
        if (updatedRecord) {
          console.log("new token updated to db sucess");
        }
      }
      let newToken = await authCodeModel
        .findOne({
          propertyId: req.body.propertyID,
        })
        .select("access_token");
      const data = querystring.stringify({
        reservationID: req.body.reservationid,
        status: "checked_in",
      });

      const response = await axios.put(
        "https://api.cloudbeds.com/api/v1.2/putReservation",
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${newToken.access_token}`,
            Cookie: "csrf_accessa_cookie=483c6d1ec5ba7b404c99a5f83418a262",
          },
        }
      );

      // console.log(response.data);

      let accepted_message = {
        balance_message:
          "There is a remaining balance on this reservation. Please collect the full amount prior to checking in the reservation.",
        room_issue_message:
          "One or more rooms cannot be checked in. Please ensure previous reservations have been checked out.",
      };
      let concise_message = {
        balance_message: "Your Payment is due, Kindly pay at Reception.",
        room_issue_message:
          "Room check-in issue. Ensure previous checkouts are complete.",
      };
      const getConciseMessage = (message) => {
        if (message.includes("remaining balance")) {
          return concise_message.balance_message;
        } else if (message.includes("cannot be checked in")) {
          return concise_message.room_issue_message;
        }
        return message;
      };
      let responseMessage = "";
      if (response.data.success) {
        responseMessage = "Check-in successful";
        await reservationCB.findByIdAndUpdate(
          { _id: req.body.bookingid },
          {
            status: "In-House",
          },
          {
            new: true,
          }
        );
        let userData = await reservationCB
          .findOne({ _id: req.body.bookingid })
          .select("guestEmail guestName -_id");
        userData = userData.toObject();
        let propertyEmail = await cloudBedsHotel
          .findOne({
            propertyId: req.body.propertyID,
          })
          .select("propertyEmail propertyName -_id");
        propertyEmail = propertyEmail.toObject();
        let bookingdetail = {
          firstName: userData.guestName,
          customerEmail: userData.guestEmail,
          propertyEmail: propertyEmail.propertyEmail,
          propertyName: propertyEmail.propertyName,
          reservationid: req.body.reservationid,
        };
        const emailResult = await sendPasscodeEmail(
          null,
          null, //before this is going passcodeData for room sharing pascodes
          null,
          "checkIn_update",
          bookingdetail
        );
        if (emailResult.success) {
          responseMessage = "Check-In Succesful";
        }
      } else {
        responseMessage = getConciseMessage(response.data.message);
      }
      return res.status(200).send({
        success: response.data.success,
        message: responseMessage,
        // data: response.data.data
      });
    }
  } catch (error) {
    logger.error(error.stack);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: JSON.stringify(error),
    });
  }
}

async function addTTlockToProperty(req, res) {
  try {
    const { ttLockUsername, ttLockPassword } = req.body;
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: JSON.stringify(error),
    });
  }
}

async function aviabilityCheck(req, res) {
  try {
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: JSON.stringify(error),
    });
  }
}

// async function userAndHotelReservation(req, res) {
//   try {
//     let guestEmail = await User.findById(
//       req.user.id
//     ).select(
//       "guestTTLockCredentials.ttLockAccessToken email -_id"
//     );
//     //also hsare guest accesstoken nad further call api of lock unlock
//     console.log("guestEmail", guestEmail);
//     if (!guestEmail) {
//       return res.status(404).send({
//         success: true,
//         message: "User Not found",
//         data: null
//       });
//     }

//     let guestAllReservations =
//       await reservation.aggregate([
//         {
//           $match: {
//             guestEmail: guestEmail.email
//           }
//         },
//         {
//           $addFields: {
//             statusPriority: {
//               $cond: {
//                 if: { $eq: ["$status", "confirmed"] },
//                 then: 1,
//                 else: 2
//               }
//             }
//           }
//         },
//         {
//           $sort: {
//             statusPriority: 1,
//             _id: 1 // This sorts by _id within the same status, optional
//           }
//         },
//         {
//           $project: {
//             statusPriority: 0
//           }
//         }
//       ]);
//     console.log(
//       "guestAllReservations",
//       guestAllReservations
//     );
//     // Check if reservations exist
//     if (guestAllReservations.length === 0) {
//       return res.status(404).send({
//         success: true,
//         message:
//           "No reservations found for the provided email.",
//         data: null
//       });
//     }

//     // Step 3: Extract all unique HotelCodes from the reservations
//     // const hotelCodes = [
//     //   ...new Set(
//     //     guestAllReservations.map(
//     //       (reservation) =>
//     //         reservation.basicProperty.$.HotelCode
//     //     )
//     //   )
//     // ];

//     // Step 4: Fetch hotel details using the extracted HotelCodes
//     let hotelDetails = await property
//       .find({
//         propertyId: guestAllReservations[0].propertyID
//       })
//       .select("-ttLockData");

//     console.log("hotelDetails", hotelDetails);

//     // Convert hotelDetails to a dictionary for quick lookup
//     const hotelDetailsDict = hotelDetails.reduce(
//       (acc, hotel) => {
//         acc[hotel.propertyId] = hotel;
//         return acc;
//       },
//       {}
//     );

//     // Step 5: Map the reservations to include the hotelDetails within basicProperty
//     const result = guestAllReservations.map(
//       (reservation) => {
//         const hotelDetail =
//           hotelDetailsDict[reservation.propertyID] ||
//           null;
//         return {
//           ...reservation,
//           basicProperty: {
//             ...reservation.basicProperty,
//             hotelDetails: hotelDetail
//           },
//           ttLockAccessToken:
//             guestEmail.guestTTLockCredentials
//               .ttLockAccessToken
//         };
//       }
//     );

//     return res.status(200).send({
//       success: true,
//       message: "Records fetched sucess",
//       data: result
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Internal Server Error",
//       data: JSON.stringify(error)
//     });
//   }
// }

// async function userAndHotelReservationById(req, res) {
//   try {
//     console.log("hello");
//     const { _id } = req.params;
//     let guestReservation = await reservation.findById(
//       _id
//     );
//     let guestEmail = await User.findById(
//       req.user.id
//     ).select(
//       "guestTTLockCredentials.ttLockAccessToken email -_id"
//     );

//     // Check if reservations exist
//     if (guestReservation.length === 0) {
//       return res.status(404).send({
//         success: true,
//         message:
//           "No reservations found for the provided email.",
//         data: null
//       });
//     }

//     let hotelDetails = await property
//       .findOne({
//         propertyId: guestReservation.propertyID
//       })
//       .select("-ttLockData");
//     console.log("guestReservation", guestReservation);
//     console.log("hotelDetails", hotelDetails);
//     if (!hotelDetails) {
//       return res.status(404).send({
//         success: true,
//         message: "No Hotel Found with this Hotel Code",
//         data: null
//       });
//     }
//     guestReservation = guestReservation.toObject();
//     guestReservation.basicProperty =
//       guestReservation.basicProperty || {};
//     guestReservation.basicProperty.hotelDetails =
//       hotelDetails;
//     guestReservation.ttLockAccessToken =
//       guestEmail.guestTTLockCredentials.ttLockAccessToken;

//     return res.status(200).send({
//       success: true,
//       message: "Records fetched sucess",
//       data: [guestReservation]
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Internal Server Error",
//       data: JSON.stringify(error)
//     });
//   }
// }

async function getPasscodeDetails(req, res) {
  try {
    const { reservationId, room } = req.query;
    console.log(req.query);

    if (!reservationId || !room) {
      return res.status(400).json({
        message: "reservationId and room are required",
      });
    }

    const Preservation = await reservation
      .findOne({
        reservationID: reservationId,
      })
      .select("passcodeDetails");
    console.log("Preservation", Preservation);

    if (!Preservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Extract the passcode for the specific room
    const passcodeDetails = Preservation.passcodeDetails;
    const passcodeRegex = new RegExp(`${room}=\\s*(\\d+)`);
    const passcodeMatch = passcodeDetails.match(passcodeRegex);
    const passcode = passcodeMatch ? passcodeMatch[1] : null;

    if (!passcode) {
      return res.status(404).json({
        message: `Passcode not found for room ${room} in passcodeDetails`,
      });
    }

    return res.status(200).json({ passcode });
  } catch (error) {
    console.error("Error fetching passcode details:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function lockListMap(req, res) {
  const TTLOCK_CLIENT_ID = "bda38147cd4d4a7fae832aefa8ee3cda";
  try {
    const { propertyId } = req.query;

    const URL = "https://euapi.ttlock.com/v3/lock/list";
    const response = await axios.post(
      URL,
      new URLSearchParams({
        clientId: TTLOCK_CLIENT_ID,
        accessToken: "d140fb4fa8de2c491c35b1c690fef258",
        pageNo: 1,
        pageSize: 20,
        date: Date.now(),
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    let list = response.data.list;
    console.log("list", list);
    let lockMapArr = [];
    for (let elem of list) {
      // console.log("elem", elem);
      const roomLockIdObject = {
        lockId: elem.lockId,
        lockAlias: elem.lockAlias,
        lockName: elem.lockName,
        roomNumber: elem.lockAlias.match(/\d+/g).join(""),
        propertyId: propertyId,
      };

      lockMap = await roomLockId.create(roomLockIdObject);
      lockMapArr.push(lockMap);
    }
    // console.log("lockMap", lockMap);

    // console.log(
    //   "Access Token Response:",
    //   response.data
    // );

    return res.status(200).send({
      status: true,
      message: "LockId Map with room sucess",
      data: lockMapArr,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: JSON.stringify(error),
    });
  }
}

async function postCustomField(req, res) {
  try {
    const {
      name,
      shortcode,
      isPersonal,
      propertyID,
      applyTo,
      required,
      maxCharacters,
      type,
      displayed,
    } = req.query;
    // Check if all required fields are present
    if (
      !name ||
      !shortcode ||
      typeof isPersonal === "undefined" ||
      !propertyID
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields. Ensure that name, shortcode, isPersonal, and propertyID are provided.",
      });
    }

    let isPersonalBoolean;
    if (isPersonal === "true") {
      isPersonalBoolean = true;
    } else if (isPersonal === "false") {
      isPersonalBoolean = false;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid value for isPersonal. Must be "true" or "false".',
      });
    }
    let access_token = await authCodeModel
      .findOne({
        propertyId: propertyID,
      })
      .select("access_token _id refresh_token");
    if (!access_token) {
      return res.status(400).send({
        sucess: true,
        message: "Property Not Found. Either deleted or not registered",
        data: null,
      });
    }
    const authID = access_token._id;
    const token = access_token.access_token;
    const refreshToken = access_token.refresh_token;
    let tokenCheck = await checkAccessToken(token);
    if (!tokenCheck) {
      console.log(1);
      let newAccessToken = await renewAccessToken(refreshToken);
      console.log("newAccessToken", newAccessToken);

      let updatedRecord = await authCodeModel.findByIdAndUpdate(
        authID,
        {
          access_token: newAccessToken,
        },
        { new: true }
      );
      if (updatedRecord) {
        console.log("new token updated to db sucess");
      }
    }

    let newToken = await authCodeModel
      .findOne({
        propertyId: propertyID,
      })
      .select("access_token");

    // Prepare the request data
    const data = querystring.stringify({
      name,
      shortcode,
      isPersonal: isPersonalBoolean,
      propertyID,
      applyTo,
      required,
      maxCharacters,
      type,
      displayed,
    });

    // Define the request headers
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${newToken.access_token}`,
      Cookie: "csrf_accessa_cookie=483c6d1ec5ba7b404c99a5f83418a262",
    };
    const response = await axios.post(
      "https://api.cloudbeds.com/api/v1.1/postCustomField",
      data,
      { headers }
    );
    if (response.data.success) {
      return res.status(200).send({
        sucess: true,
        message: "Custom Field Creation Success",
        data: response.data.data,
      });
    }
    return res.status(400).send({
      sucess: false,
      message: response.data.message,
      data: null,
    });
    //   return response;
  } catch (error) {
    logger.error(error.stack);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: JSON.stringify(error),
    });
  }
}

async function getCustomField(req, res) {
  try {
    const { propertyID } = req.query;

    if (!propertyID) {
      return res.status(400).json({
        success: false,
        message: "Missing required field. Ensure that propertyID is provided.",
      });
    }
    let access_token = await authCodeModel
      .findOne({
        propertyId: propertyID,
      })
      .select("access_token _id refresh_token");
    if (!access_token) {
      return res.status(400).send({
        sucess: true,
        message: "Property Not Found. Either deleted or not registered",
        data: null,
      });
    }
    const authID = access_token._id;
    const token = access_token.access_token;
    const refreshToken = access_token.refresh_token;
    let tokenCheck = await checkAccessToken(token);
    if (!tokenCheck) {
      console.log(1);
      let newAccessToken = await renewAccessToken(refreshToken);
      console.log("newAccessToken", newAccessToken);

      let updatedRecord = await authCodeModel.findByIdAndUpdate(
        authID,
        {
          access_token: newAccessToken,
        },
        { new: true }
      );
      if (updatedRecord) {
        console.log("new token updated to db sucess");
      }
    }

    let newToken = await authCodeModel
      .findOne({
        propertyId: propertyID,
      })
      .select("access_token");
    const headers = {
      Authorization: `Bearer ${newToken.access_token}`,
      Cookie: "csrf_accessa_cookie=483c6d1ec5ba7b404c99a5f83418a262",
    };

    // Make the GET request using axios
    const response = await axios.get(
      "https://api.cloudbeds.com/api/v1.1/getCustomFields",
      { headers }
    );
    if (response.data.success) {
      return res.status(200).send({
        sucess: true,
        message: "Custom Field Records Fetched Sucess",
        count: response.data.data.length,
        data: response.data.data,
      });
    }
    return res.status(400).send({
      sucess: false,
      message: response.data.message,
      data: null,
    });
  } catch (error) {
    logger.error(error.stack);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: JSON.stringify(error),
    });
  }
}

async function cloudbeds_request(url, method, postdata = null) {
  const config = {
    method: method,
    url: url,
    headers: {
      Authorization: `Bearer ${cloudbeds_token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    maxRedirects: 10,
    timeout: 0, // No timeout
    httpsAgent: new (require("https").Agent)({
      rejectUnauthorized: false, // Equivalent to CURLOPT_SSL_VERIFYPEER and CURLOPT_SSL_VERIFYHOST
    }),
  };

  if (postdata) {
    const params = new URLSearchParams();
    for (const key in postdata) {
      params.append(key, postdata[key]);
    }
    config.data = params.toString(); // Equivalent to CURLOPT_POSTFIELDS
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error making Cloudbeds request:", error);
    throw error;
  }
}

async function ttlock_request(url, postFields) {
  const options = {
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: new URLSearchParams(postFields),
  };

  const response = await axios(options);
  return response.data;
}

function generateRandomPassword(length) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

function generateRandomdigit(length) {
  const digits = "0123456789";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return pass;
}

function md5(string) {
  return crypto.createHash("md5").update(string).digest("hex");
}

function removeAllExceptLettersAndNumbers(string) {
  return string.replace(/[^a-zA-Z0-9]/g, "");
}

module.exports = {
  processReservation,
  lockListMap,
  putReservations,
  postCustomField,
  getCustomField,
  aviabilityCheck,
  getItems,
  postItem,
  //   userAndHotelReservation,
  //   userAndHotelReservationById,
  getPasscodeDetails,
};
