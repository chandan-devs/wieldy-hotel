const axios = require("axios");
const moment = require("moment");
const xml2js = require("xml2js");
// const roomLockId = require("../models/roomLockIdModel");
const Reservation = require("../model/reservationModel");
const siteminderProperty = require("../model/SMXHotelModel");
const source = require("../../../models/sourceModel");
const ttlockService = require("../../../services/ttLock/ttLockService");
// const siteminderValidation = require("../inputValidations/siteminderValidation");
// const siteminderReservation = require("../models/siteminderReservationModal");
// const { default: mongoose } = require("mongoose");
const userController = require("../../../controller/userController");
const { v4: uuidv4 } = require("uuid");
const {
  S3Client,
  PutObjectCommand
} = require("@aws-sdk/client-s3");
const User = require("../../../models/userModel");
require("dotenv").config();
const logger = require("../../../logger/winstonLogger");

/**
 * Reciving reseravations from siteminder
 * @param {*} req
 * @param {*} res
 */

//production
async function recieveBooking(req, res) {
  let echoToken, xmlns, version, xmlnsSoapEnv;
  try {
    logger.info(
      `<< Main process start saving siteminder booking and reservation Data >>`
    );
    const soapRequest = req.body;
    logger.info(`SOAP Data: ${soapRequest}`);

    xml2js.parseString(
      soapRequest,
      {
        explicitArray: true,
        mergeAttrs: true,
        trim: true
      },
      async (err, result) => {
        if (err) {
          logger.error(err.stack);
          return res
            .status(450)
            .send("Unable to process."); // Unable to process (450)
        }

        const header =
          result["soap-env:Envelope"][
            "soap-env:Header"
          ];
        echoToken =
          result?.["soap-env:Envelope"]?.[
            "soap-env:Body"
          ]?.[0]?.OTA_HotelResNotifRQ?.[0].EchoToken;
        xmlnsSoapEnv =
          result?.["soap-env:Envelope"]?.[
            "xmlns:soap-env"
          ];
        xmlns =
          result?.["soap-env:Envelope"]?.[
            "soap-env:Body"
          ]?.[0]?.OTA_HotelResNotifRQ?.[0].xmlns;
        version =
          result?.["soap-env:Envelope"]?.[
            "soap-env:Body"
          ]?.[0]?.OTA_HotelResNotifRQ?.[0].Version;

        if (
          !header?.[0]?.["wsse:Security"]?.[0]?.[
            "wsse:UsernameToken"
          ]
        ) {
          return res
            .status(497)
            .set("Content-Type", "application/xml")
            .send(`
                  <soap-env:Envelope xmlns:soap-env="${xmlnsSoapEnv}">
                      <soap-env:Body>
                          <OTA_HotelResNotifRS xmlns="${xmlns}" Version="${version}" TimeStamp="${new Date().toISOString()}" EchoToken="${echoToken}">
                              <Errors>
                                  <Error Type="6" Code="497">Missing WS-Security header</Error>
                              </Errors>
                          </OTA_HotelResNotifRS>
                      </soap-env:Body>
                  </soap-env:Envelope>
              `);
        }

        const username =
          header?.[0]?.["wsse:Security"]?.[0]?.[
            "wsse:UsernameToken"
          ]?.[0]?.["wsse:Username"]?.[0];
        const password =
          header?.[0]?.["wsse:Security"]?.[0]?.[
            "wsse:UsernameToken"
          ]?.[0]?.["wsse:Password"]?.[0]?._;

        console.log(
          "username",
          username,
          "password",
          password
        );

        if (
          username !== "wieldydigital" ||
          password !== "Wieldy@Metastic2"
        ) {
          return res
            .status(497)
            .set("Content-Type", "application/xml")
            .send(`
      <soap-env:Envelope xmlns:soap-env="${xmlnsSoapEnv}">
          <soap-env:Body>
              <OTA_HotelResNotifRS xmlns="${xmlns}" Version="${version}" TimeStamp="${new Date().toISOString()}" EchoToken="${echoToken}">
                  <Errors>
                      <Error Type="6" Code="497">Invalid Username and/or Password</Error>
                  </Errors>
              </OTA_HotelResNotifRS>
          </soap-env:Body>
      </soap-env:Envelope>
    `);
        }

        const reservationData =
          result?.["soap-env:Envelope"]?.[
            "soap-env:Body"
          ]?.[0]?.OTA_HotelResNotifRQ?.[0]
            ?.HotelReservations?.[0]
            ?.HotelReservation?.[0]
            ?.ResGlobalInfo?.[0] || {};

        // return res.send({
        //   message: "test data",
        //   data: result
        // });
        // logger.info(
        //   `Parsed Data:\n${JSON.stringify(
        //     result,
        //     null,
        //     2
        //   )}`
        // );
        const hotelCode =
          reservationData["BasicPropertyInfo"]?.[0][
            "HotelCode"
          ]?.[0];
        // console.log("hotelCode", hotelCode);

        // const hotelsCodesList = ["819W56UK9"];
        
    let propertyActiveCheck = await siteminderProperty
      .findOne({
        propertyId: hotelCode
      })
      .select("status -_id");
    if (!propertyActiveCheck.status) {
      logger.info(
        `<< Disabled SMX Property in Wieldy DB >>`
      );
      return res.status(400).send({
        success: false,
        message: "Disabled SMX Property in Wieldy DB",
        data: null
      });
    }
         let hotelsCodesList =
           await siteminderProperty.distinct(
             "propertyId"
           );

         console.log(
           "hotelsCodesList",
           hotelsCodesList
         );
        if (
          !hotelCode ||
          !hotelsCodesList.includes(hotelCode)
        ) {
          return res
            .status(400)
            .set("Content-Type", "application/xml")
            .send(`
                <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap-env:Body>
                        <OTA_HotelResNotifRS xmlns="http://www.opentravel.org/OTA/2003/05" Version="1.0" TimeStamp="${new Date().toISOString()}" EchoToken="${echoToken}">
                            <Errors>
                                <Error Type="6" Code="392">Hotel not found for HotelCode=${hotelCode}</Error>
                            </Errors>
                        </OTA_HotelResNotifRS>
                    </soap-env:Body>
                </soap-env:Envelope>
            `);
        }

        const resStatus =
          result?.["soap-env:Envelope"]?.[
            "soap-env:Body"
          ]?.[0]?.OTA_HotelResNotifRQ?.[0]
            ?.HotelReservations?.[0]
            ?.HotelReservation?.[0]?.ResStatus[0];
        // console.log("resStatus", resStatus);

        const acceptedResStatusValues = [
          "Reserved",
          "Waitlisted",
          "Cancelled",
          "No-show",
          "In-house",
          "Checked-Out",
          "Redacted",
          "Confirmed"
        ];

        if (
          !resStatus ||
          !acceptedResStatusValues.includes(resStatus)
        ) {
          return res
            .status(400)
            .set("Content-Type", "application/xml")
            .send(`
        <soap-env:Envelope xmlns:soap-env="${xmlnsSoapEnv}">
            <soap-env:Body>
                <OTA_HotelResNotifRS xmlns="${xmlns}" Version="${version}" TimeStamp="${new Date().toISOString()}" EchoToken="${echoToken}">
                    <Errors>
                        <Error Type="6" Code="400">Invalid ResStatus: ${resStatus}. Must be one of: ${acceptedResStatusValues.join(
            ", "
          )}</Error>
                    </Errors>
                </OTA_HotelResNotifRS>
            </soap-env:Body>
        </soap-env:Envelope>
      `);
        }

        const unique =
          result?.["soap-env:Envelope"]?.[
            "soap-env:Body"
          ]?.[0]?.OTA_HotelResNotifRQ?.[0]
            ?.HotelReservations?.[0]
            ?.HotelReservation?.[0]?.UniqueID[0]
            .ID?.[0];

        // console.log("unique", unique);

        const reservation = {
          status: resStatus,
          pos: result?.["soap-env:Envelope"]?.[
            "soap-env:Body"
          ]?.[0]?.OTA_HotelResNotifRQ?.[0]
            ?.HotelReservations?.[0]
            ?.HotelReservation?.[0]?.POS[0],
          unique: unique,
          total: reservationData?.Total
            ? {
                AmountBeforeTax: reservationData
                  ?.Total[0].AmountBeforeTax
                  ? reservationData.Total[0].AmountBeforeTax.map(
                      (amount) => amount
                    )
                  : undefined,
                AmountAfterTax: reservationData
                  ?.Total[0].AmountAfterTax
                  ? reservationData.Total[0].AmountAfterTax.map(
                      (amount) => amount
                    )
                  : undefined,
                CurrencyCode: reservationData?.Total[0]
                  .CurrencyCode
                  ? reservationData.Total[0].CurrencyCode.map(
                      (code) => code
                    )
                  : undefined
              }
            : undefined,
          reservationId:
            reservationData?.HotelReservationIDs
              ? reservationData.HotelReservationIDs[0].HotelReservationID.map(
                  (id) => id.ResID_Value[0]
                )
              : undefined,
          profileId:
            reservationData?.Profiles?.[0]
              .ProfileInfo?.[0].UniqueID,
          // ? reservationData.Profiles[0].ProfileInfo.map(
          //     (profile) =>
          //       profile.Profile[0].Customer[0]
          //         .UniqueID[0].ID[0]
          //   )
          // : undefined,
          customerData:
            reservationData?.Profiles?.[0]
              ?.ProfileInfo?.[0]?.Profile?.[0]
              ?.Customer,
          // ? reservationData.Profiles[0].ProfileInfo.map(
          //     (profile) =>
          //       profile.Profile[0].Customer[0]
          //   )
          // : undefined,
          companyData:
            reservationData?.Profiles?.[0]
              ?.ProfileInfo?.[1]?.Profile?.[0]
              ?.CompanyInfo || undefined,
          // ? reservationData.Profiles[1].ProfileInfo.map(
          //     (profile) =>
          //       profile.Profile[0].CompanyInfo[0]
          //   )
          // : undefined,
          basicProperty:
            reservationData?.BasicPropertyInfo
              ? reservationData.BasicPropertyInfo.map(
                  (info) => info
                )
              : undefined,
          // passcodeDetails:
          //   reservationData.PasscodeDetails
          //     ? reservationData.PasscodeDetails.map(
          //         (details) => details
          //       )
          //     : undefined,
          services:
            result?.["soap-env:Envelope"]?.[
              "soap-env:Body"
            ]?.[0]?.OTA_HotelResNotifRQ?.[0]
              ?.HotelReservations?.[0]
              ?.HotelReservation?.[0]?.Services?.[0]
              ?.Service,
          roomStays: result?.["soap-env:Envelope"]?.[
            "soap-env:Body"
          ]?.[0]?.OTA_HotelResNotifRQ?.[0]
            ?.HotelReservations?.[0]
            ?.HotelReservation?.[0].RoomStays
            ? result?.["soap-env:Envelope"]?.[
                "soap-env:Body"
              ]?.[0]?.OTA_HotelResNotifRQ?.[0]?.HotelReservations?.[0]?.HotelReservation?.[0].RoomStays[0].RoomStay.map(
                (stay) => ({
                  roomId: stay.RoomTypes
                    ? stay.RoomTypes[0].RoomType.map(
                        (type) => type.RoomID[0]
                      )
                    : undefined,
                  stayDetails: stay
                })
              )
            : undefined,
          resGuests:
            result?.["soap-env:Envelope"]?.[
              "soap-env:Body"
            ]?.[0]?.OTA_HotelResNotifRQ?.[0]
              ?.HotelReservations?.[0]
              ?.HotelReservation?.[0]?.ResGuests?.[0]
              ?.ResGuest || undefined,
          shareAllMarketInd:
            reservationData?.Profiles?.[0]
              ?.ProfileInfo?.[0]?.Profile?.[0]
              ?.ShareAllMarketInd?.[0] || undefined,
          // ? reservationData.Profiles[0].ProfileInfo[0].Profile[0].ShareAllMarketInd.map(
          //     (ind) => ind
          //   )
          // : undefined,
          shareAllOptOutInd:
            reservationData?.Profiles?.[0]
              ?.ProfileInfo?.[0]?.Profile?.[0]
              ?.ShareAllOptOutInd?.[0] || undefined
          // ? reservationData.Profiles[0].ProfileInfo[0].Profile[0].ShareAllOptOutInd.map(
          //     (ind) => ind
          //   )
          // : undefined
        };
        // console.log("reservation stays", reservation.roomStays)
        // res.send({ "reservation stays": reservation.roomStays })
        const today = new Date()
          .toISOString()
          .split("T")[0]; 
        let isPrevious = false; 

        // Iterate over roomStays and check if the start date is greater than today
        reservation.roomStays.forEach((stay) => {
          const startDate =
            stay.stayDetails.TimeSpan[0].Start[0]; // Access Start date from the response

          // Compare startDate with today's date
          if (startDate >= today) {
            isPrevious = true; // Set isPrevious to true if the start date is in the future
          }
        });

        // return res.send({
        //   message: "test data",
        //   data: reservation
        // });
        // console.log("Reservation", reservation);

        // cmnts start
        //updation logic start
        const bookingExist = await Reservation.findOne(
          {
            unique
          }
        );
        //varible declarations for using in both part
        const customer =
          reservationData.Profiles?.[0]
            ?.ProfileInfo?.[0]?.Profile?.[0]?.Customer;

        const email = customer?.[0]?.Email || false;

        const phone =
          customer?.[0]?.Telephone?.[0].PhoneNumber ||
          false;

        const ResID_Value =
          reservationData?.HotelReservationIDs?.[0]
            ?.HotelReservationID?.[0]
            ?.ResID_Value?.[0] || undefined;
        let ttLockUsername,
          passcode,
          ttLockMD5,
          ttLockpass,
          ttLockpasscodeExpiry,
          ttLockaccessToken,
          ttLockrefreshToken,
          timeSpans;

        timeSpans = {
          checkInDate:
            reservationData.TimeSpan[0]?.Start[0],
          checkOutDate:
            reservationData.TimeSpan[0]?.End[0]
        };
        let propertyAccessToken =
          await siteminderProperty
            .findOne({ propertyId: hotelCode })
            .select("ttLockData.ttLockAccessToken -_id");
      
        let reservation_for_tt = {
          guestName:
            customer[0]?.PersonName[0]?.GivenName[0] +
            " " +
            customer[0]?.PersonName[0]?.Surname[0],
          roomIds: reservation.roomStays.map(
            (el) => el.roomId[0]
          ),
          propertyId: hotelCode,
          reservationID: reservation.reservationId[0],
          timeSpan: timeSpans,
          source: "Siteminder",
          propertyAccessToken
        };
         let frontDoorCheck = await siteminderProperty
           .findOne({ propertyId: hotelCode })
           .select("isFrontDoor -_id");
         if (frontDoorCheck.isFrontDoor) {
           reservation_for_tt.roomIds.push("2024");
         }
        //end declarations
        if (bookingExist) {
          // console.log(1);
          let updatedReservation =
            await Reservation.updateOne(
              { unique },
              reservation
            );
          if (updatedReservation) {
            // console.log("isPrevious",isPrevious)
            if (isPrevious) {
              // console.log("hhhhhhh")
              
              let passcodeCreation =
              await ttlockService.createPasskey(
                reservation_for_tt,
                req,
                res
              );
            // console.log(
            //   "passcodeCreation",
            //   passcodeCreation,
            //   "reservation_for_tt",
            //   reservation_for_tt
            // );
            ttLockUsername = passcodeCreation.username;
            ttLockMD5 = passcodeCreation.md5;
            ttLockpass = passcodeCreation.password;
            ttLockpasscodeExpiry =
              passcodeCreation.passcodeExpiry;
              ttLockaccessToken =
              passcodeCreation.accessToken;
            ttLockrefreshToken =
            passcodeCreation.refreshToken;
            passcode =
                passcodeCreation.passcodeDetails;
               let hotelDetails =
                 await siteminderProperty
                   .findOne({ propertyId: hotelCode })
                   .select(
                     "propertyName defaultCheckInTime defaultCheckOutTime emailId -_id"
                   );
                   hotelDetails =
                     hotelDetails.toObject();
            // const userData = {
            //   name: reservation_for_tt.guestName,
            //   ttLockUsername: ttLockUsername,
            //   ttLockMD5,
            //   ttLockpass,
            //   ttLockpasscodeExpiry,
            //   ttLockaccessToken,
            //   ttLockrefreshToken,
            //   email:
            //     email[0]._ || "info@metasticworld.com",
            //   contact: phone[0],
            //   passcodeData: passcode,
            //   source: "Siteminder",
            //   role: "guest",
            //   timeSpan: timeSpans,
            //   hotelDetail: {
            //     propertyName:
            //       hotelDetails.propertyName,
            //     defaultCheckInTime:
            //       hotelDetails.defaultCheckInTime,
            //     defaultCheckOutTime:
            //       hotelDetails.defaultCheckOutTime,
            //     propertyEmail: hotelDetails.emailId
            //   }
            // };
            // // console.log(
            // //   "userData for user create",
            // //   userData
            // // );
            // const createUserResponse =
            // await userController.createUser({
            //   body: userData
            // });
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
            logger.info(
              `Reservation updated successfully: ${JSON.stringify(
                updatedReservation,
                null,
                2
              )}`
            );

            return res
              .status(200)
              .set("Content-Type", "application/xml")
              .send(`
                    <soap-env:Envelope xmlns:soap-env="${xmlnsSoapEnv}">
                        <soap-env:Body>
                            <OTA_HotelResNotifRS xmlns="${xmlns}" Version="${version}" TimeStamp="${new Date().toISOString()}" EchoToken="${echoToken}">
                              <Success>
                                    <Message>Reservation Modified Sucessfully</Message>
                                </Success>
                            </OTA_HotelResNotifRS>
                        </soap-env:Body>
                    </soap-env:Envelope>
                    `);
          }
        } else {
          //fresh booking
          // console.log(2);
          const newReservation = await new Reservation(
            reservation
          ).save();
          if (newReservation) {
            // if (reservation) {
            // console.log(3);
            // const customer =
            //   reservationData.Profiles?.[0]
            //     ?.ProfileInfo?.[0]?.Profile?.[0]
            //     ?.Customer;

            // // console.log("customer", customer);
            // const email =
            //   customer?.[0]?.Email || false;

            // // console.log("email", email);
            // const phone =
            //   customer?.[0]?.Telephone?.[0]
            //     .PhoneNumber || false;
            // // console.log("phone", phone);
            // const ResID_Value =
            //   reservationData?.HotelReservationIDs?.[0]
            //     ?.HotelReservationID?.[0]
            //       ?.ResID_Value?.[0] || undefined;

            //only required for certification
            let warningMessage = "";
            let warningCode = "";
            ({ warningMessage, warningCode } =
              email === false
                ? phone === false
                  ? {
                      warningMessage:
                        "Both email and phone are missing.",
                      warningCode: "400"
                    }
                  : {
                      warningMessage:
                        "Guest Email is missing.",
                      warningCode: "321"
                    }
                : phone === false
                ? {
                    warningMessage:
                      "Guest Phone is missing.",
                    warningCode: "316"
                  }
                : {
                    warningMessage: "",
                    warningCode: ""
                  });

            if (!email) {
              //not a casebecause guest email is always mandatory
              console.log("inside");
              logger.info(
                `Reservation Created successfully`
              );
              return res
                .status(200)
                .set("Content-Type", "application/xml")
                .send(`
                      <soap-env:Envelope xmlns:soap-env="${xmlnsSoapEnv}">
                          <soap-env:Body>
                              <OTA_HotelResNotifRS xmlns="${xmlns}" Version="${version}" TimeStamp="${new Date().toISOString()}" EchoToken="${echoToken}">
                                  <Warnings>
                                        <Warning Type="10" Code="${warningCode}">${warningMessage}</Warning>
                                  </Warnings>
                                   <Success>
                                   <UniqueID ID="${unique}"/>
                                   <HotelReservationID ResID_Type="10" ResID_Value="${ResID_Value}"/>
                                   <Message>Reservation Added Sucessfully</Message>
                                   </Success>
                            </OTA_HotelResNotifRS>
                          </soap-env:Body>
                      </soap-env:Envelope>
                    `);
            }

            //process start for tt lock and user emails
            // let ttLockUsername,
            //   passcode,
            //   ttLockMD5,
            //   ttLockpass,
            //   ttLockpasscodeExpiry,
            //   ttLockaccessToken,
            //   ttLockrefreshToken,
            //   timeSpans;
            // timeSpans = {
            //   checkInDate:
            //     reservationData.TimeSpan[0]?.Start[0],
            //   checkOutDate:
            //     reservationData.TimeSpan[0]?.End[0]
            // };

            // let reservation_for_tt = {
            //   guestName:
            //     customer[0]?.PersonName[0]
            //       ?.GivenName[0] +
            //     " " +
            //     customer[0]?.PersonName[0]?.Surname[0],
            //   roomIds: reservation.roomStays.map(
            //     (el) => el.roomId[0]
            //   ),
            //   propertyId: hotelCode,
            //   reservationID:
            //     reservation.reservationId[0],
            //   timeSpan: timeSpans,
            //   source: "Siteminder"
            // };
            console.log(
              "reservation_for_tt",
              reservation_for_tt
            );
            if (isPrevious) {
              // console.log("hhhhhhh222222");
              let passcodeCreation =
                await ttlockService.createPasskey(
                  reservation_for_tt,
                  req,
                  res
                );
              if (passcodeCreation) {
                ttLockUsername =
                  passcodeCreation.username;
                ttLockMD5 = passcodeCreation.md5;
                ttLockpass = passcodeCreation.password;
                ttLockpasscodeExpiry =
                  passcodeCreation.passcodeExpiry;
                ttLockaccessToken =
                  passcodeCreation.accessToken;
                ttLockrefreshToken =
                  passcodeCreation.refreshToken;
                passcode =
                  passcodeCreation.passcodeDetails;
                 let hotelDetails =
                   await siteminderProperty
                     .findOne({
                       propertyId: hotelCode
                     })
                     .select(
                       "propertyName defaultCheckInTime defaultCheckOutTime emailId -_id"
                     );
                hotelDetails = hotelDetails.toObject();
                const userData = {
                  name: reservation_for_tt.guestName,
                  ttLockUsername: ttLockUsername,
                  ttLockMD5,
                  ttLockpass,
                  ttLockpasscodeExpiry,
                  ttLockaccessToken,
                  ttLockrefreshToken,
                  email: email[0]._,
                  contact: phone[0],
                  passcodeData: passcode,
                  source: "Siteminder",
                  role: "guest",
                  timeSpan: timeSpans,
                  hotelDetail: {
                    propertyName:
                      hotelDetails.propertyName,
                    defaultCheckInTime:
                      hotelDetails.defaultCheckInTime,
                    defaultCheckOutTime:
                      hotelDetails.defaultCheckOutTime,
                    propertyEmail: hotelDetails.emailId
                  },
                  emailType: null,
                  senderName: null
                };
                console.log(
                  "userData for user create",
                  userData
                );
                const createUserResponse =
                  await userController.createUser({
                    body: userData
                  });
                const { flag, flag2 } =
                  createUserResponse;

                if (flag && flag2) {
                  console.log(
                    "User created and mail sent successfully"
                  );
                } else if (flag && !flag2) {
                  console.log(
                    "User created without mail"
                  );
                } else {
                  console.log(
                    "User creation failed or something went wrong"
                  );
                }
              }
            }
            logger.info(
              `Reservation Created successfully`
            );
            return res
              .status(200)
              .set("Content-Type", "application/xml")
              .send(`
                      <soap-env:Envelope xmlns:soap-env="${xmlnsSoapEnv}">
                          <soap-env:Body>
                              <OTA_HotelResNotifRS xmlns="${xmlns}" Version="${version}" TimeStamp="${new Date().toISOString()}" EchoToken="${echoToken}">
                                   <Success>
                                   <UniqueID ID="${unique}"/>
                                   <HotelReservationID ResID_Type="10" ResID_Value="${ResID_Value}"/>
                                   <Message>Reservation Added Sucessfully</Message>
                                   </Success>
                            </OTA_HotelResNotifRS>
                          </soap-env:Body>
                      </soap-env:Envelope>
                    `);
          }
          }
        // cmnts end
      }
    );
    logger.info(
      `<< Main process end saving siteminder booking and reservation Data >>`
    );
  } catch (error) {
    logger.error(`Unhandled error: ${error.stack}`);
    return res
      .status(500)
      .set("Content-Type", "application/xml").send(`
    <soap-env:Envelope xmlns:soap-env="${xmlnsSoapEnv}">
      <soap-env:Body>
        <OTA_HotelResNotifRS xmlns="${xmlns}" Version="${version}" TimeStamp="${new Date().toISOString()}" EchoToken="${echoToken}">
          <Errors>
            <Error Type="6" Code="500">Internal Server Error</Error>
          </Errors>
        </OTA_HotelResNotifRS>
      </soap-env:Body>
    </soap-env:Envelope>
  `);
  }
}

// writting from scratch handling multiple data
// async function handleReservationMessage(req, res) {
//   let echoToken, xmlns, version, xmlnsSoapEnv;
//   try {
//     logger.info(
//       `Main process start handling and saving booking reservation Data >> | ${moment(
//         new Date()
//       ).format("DD-MM-YYYY HH:mm:ss")}`
//     );
//     const soapRequest = req.body;

//     xml2js.parseString(
//       soapRequest,
//       {
//         explicitArray: true,
//         mergeAttrs: true,
//         trim: true
//       },
//       async (err, result) => {
//         if (err) {
//           logger.error(err.stack);
//           return res
//             .status(450)
//             .send("Unable to process."); // Unable to process (450)
//         }

//         const header =
//           result["soap-env:Envelope"][
//             "soap-env:Header"
//           ];
//         echoToken =
//           result?.["soap-env:Envelope"]?.[
//             "soap-env:Body"
//           ]?.[0]?.OTA_HotelResNotifRQ?.[0].EchoToken;
//         xmlnsSoapEnv =
//           result?.["soap-env:Envelope"]?.[
//             "xmlns:soap-env"
//           ];
//         xmlns =
//           result?.["soap-env:Envelope"]?.[
//             "soap-env:Body"
//           ]?.[0]?.OTA_HotelResNotifRQ?.[0].xmlns;
//         version =
//           result?.["soap-env:Envelope"]?.[
//             "soap-env:Body"
//           ]?.[0]?.OTA_HotelResNotifRQ?.[0].Version;

//         !header?.[0]?.["wsse:Security"]?.[0]?.[
//           "wsse:UsernameToken"
//         ]
//           ? res
//               .status(497)
//               .set("Content-Type", "application/xml")
//               .send(`
//                   <soap-env:Envelope xmlns:soap-env="${xmlnsSoapEnv}">
//                       <soap-env:Body>
//                           <OTA_HotelResNotifRS xmlns="${xmlns}" Version="${version}" TimeStamp="${new Date().toISOString()}" EchoToken="${echoToken}">
//                               <Errors>
//                                   <Error Type="6" Code="497">Missing WS-Security header</Error>
//                               </Errors>
//                           </OTA_HotelResNotifRS>
//                       </soap-env:Body>
//                   </soap-env:Envelope>
//               `)
//           : null;

//         const username =
//           header?.[0]?.["wsse:Security"]?.[0]?.[
//             "wsse:UsernameToken"
//           ]?.[0]?.["wsse:Username"]?.[0];
//         const password =
//           header?.[0]?.["wsse:Security"]?.[0]?.[
//             "wsse:UsernameToken"
//           ]?.[0]?.["wsse:Password"]?.[0]?._;

//         console.log(
//           "username",
//           username,
//           "password",
//           password
//         );

//         username !== "test-username" ||
//         password !== "test-password"
//           ? res
//               .status(497)
//               .set("Content-Type", "application/xml")
//               .send(`
//                   <soap-env:Envelope xmlns:soap-env="${xmlnsSoapEnv}">
//                       <soap-env:Body>
//                           <OTA_HotelResNotifRS xmlns="${xmlns}" Version="${version}" TimeStamp="${new Date().toISOString()}" EchoToken="${echoToken}">
//                               <Errors>
//                                   <Error Type="6" Code="497">Invalid Username and/or Password</Error>
//                               </Errors>
//                           </OTA_HotelResNotifRS>
//                       </soap-env:Body>
//                   </soap-env:Envelope>
//               `)
//           : null;

//         const reservationData =
//           result?.["soap-env:Envelope"]?.[
//             "soap-env:Body"
//           ]?.[0]?.OTA_HotelResNotifRQ?.[0]
//             ?.HotelReservations?.[0]
//             ?.HotelReservation?.[0]
//             ?.ResGlobalInfo?.[0] || {};

//         // return res.send({
//         //   message: "test data",
//         //   data: result
//         // });
//         logger.info(
//           `Parsed Data:\n${JSON.stringify(
//             result,
//             null,
//             2
//           )}`
//         );
//         const hotelCode =
//           reservationData["BasicPropertyInfo"]?.[0][
//             "HotelCode"
//           ]?.[0];
//         console.log("hotelCode", hotelCode);

//         !hotelCode || hotelCode !== "819W56UK9"
//           ? res
//               .status(400)
//               .set("Content-Type", "application/xml")
//               .send(`
//         <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
//             <soap-env:Body>
//                 <OTA_HotelResNotifRS xmlns="http://www.opentravel.org/OTA/2003/05" Version="1.0" TimeStamp="${new Date().toISOString()}" EchoToken="${echoToken}">
//                     <Errors>
//                         <Error Type="6" Code="392">Hotel not found for HotelCode=${hotelCode}</Error>
//                     </Errors>
//                 </OTA_HotelResNotifRS>
//             </soap-env:Body>
//         </soap-env:Envelope>
//       `)
//           : null;

//         const resStatus =
//           result?.["soap-env:Envelope"]?.[
//             "soap-env:Body"
//           ]?.[0]?.OTA_HotelResNotifRQ?.[0]
//             ?.HotelReservations?.[0]
//             ?.HotelReservation?.[0]?.ResStatus[0];
//         // console.log("resStatus", resStatus);

//         const acceptedResStatusValues = [
//           "Reserved",
//           "Waitlisted",
//           "Cancelled",
//           "No-show",
//           "In-house",
//           "Checked-Out",
//           "Redacted",
//           "Confirmed"
//         ];

//         !resStatus ||
//         !acceptedResStatusValues.includes(resStatus)
//           ? res
//               .status(400)
//               .set("Content-Type", "application/xml")
//               .send(`
//         <soap-env:Envelope xmlns:soap-env="${xmlnsSoapEnv}">
//             <soap-env:Body>
//                 <OTA_HotelResNotifRS xmlns="${xmlns}" Version="${version}" TimeStamp="${new Date().toISOString()}" EchoToken="${echoToken}">
//                     <Errors>
//                         <Error Type="6" Code="400">Invalid ResStatus: ${resStatus}. Must be one of: ${acceptedResStatusValues.join(
//               ", "
//             )}</Error>
//                     </Errors>
//                 </OTA_HotelResNotifRS>
//             </soap-env:Body>
//         </soap-env:Envelope>
//       `)
//           : null;

//         const unique =
//           result?.["soap-env:Envelope"]?.[
//             "soap-env:Body"
//           ]?.[0]?.OTA_HotelResNotifRQ?.[0]
//             ?.HotelReservations?.[0]
//             ?.HotelReservation?.[0]?.UniqueID[0]
//             .ID?.[0];

//         console.log("unique", unique);

//         const reservation = {
//           status: resStatus,
//           pos: result?.["soap-env:Envelope"]?.[
//             "soap-env:Body"
//           ]?.[0]?.OTA_HotelResNotifRQ?.[0]
//             ?.HotelReservations?.[0]
//             ?.HotelReservation?.[0]?.POS[0],
//           unique: unique,
//           total: reservationData?.Total
//             ? {
//                 AmountBeforeTax: reservationData
//                   ?.Total[0].AmountBeforeTax
//                   ? reservationData.Total[0].AmountBeforeTax.map(
//                       (amount) => amount
//                     )
//                   : undefined,
//                 AmountAfterTax: reservationData
//                   ?.Total[0].AmountAfterTax
//                   ? reservationData.Total[0].AmountAfterTax.map(
//                       (amount) => amount
//                     )
//                   : undefined,
//                 CurrencyCode: reservationData?.Total[0]
//                   .CurrencyCode
//                   ? reservationData.Total[0].CurrencyCode.map(
//                       (code) => code
//                     )
//                   : undefined
//               }
//             : undefined,
//           reservationId:
//             reservationData?.HotelReservationIDs
//               ? reservationData.HotelReservationIDs[0].HotelReservationID.map(
//                   (id) => id.ResID_Value[0]
//                 )
//               : undefined,
//           profileId:
//             reservationData?.Profiles?.[0]
//               .ProfileInfo?.[0].UniqueID,
//           // ? reservationData.Profiles[0].ProfileInfo.map(
//           //     (profile) =>
//           //       profile.Profile[0].Customer[0]
//           //         .UniqueID[0].ID[0]
//           //   )
//           // : undefined,
//           customerData:
//             reservationData?.Profiles?.[0]
//               ?.ProfileInfo?.[0]?.Profile?.[0]
//               ?.Customer,
//           // ? reservationData.Profiles[0].ProfileInfo.map(
//           //     (profile) =>
//           //       profile.Profile[0].Customer[0]
//           //   )
//           // : undefined,
//           companyData:
//             reservationData?.Profiles?.[0]
//               ?.ProfileInfo?.[1]?.Profile?.[0]
//               ?.CompanyInfo || undefined,
//           // ? reservationData.Profiles[1].ProfileInfo.map(
//           //     (profile) =>
//           //       profile.Profile[0].CompanyInfo[0]
//           //   )
//           // : undefined,
//           basicProperty:
//             reservationData?.BasicPropertyInfo
//               ? reservationData.BasicPropertyInfo.map(
//                   (info) => info
//                 )
//               : undefined,
//           // passcodeDetails:
//           //   reservationData.PasscodeDetails
//           //     ? reservationData.PasscodeDetails.map(
//           //         (details) => details
//           //       )
//           //     : undefined,
//           services:
//             result?.["soap-env:Envelope"]?.[
//               "soap-env:Body"
//             ]?.[0]?.OTA_HotelResNotifRQ?.[0]
//               ?.HotelReservations?.[0]
//               ?.HotelReservation?.[0]?.Services?.[0]
//               ?.Service,
//           roomStays: result?.["soap-env:Envelope"]?.[
//             "soap-env:Body"
//           ]?.[0]?.OTA_HotelResNotifRQ?.[0]
//             ?.HotelReservations?.[0]
//             ?.HotelReservation?.[0].RoomStays
//             ? result?.["soap-env:Envelope"]?.[
//                 "soap-env:Body"
//               ]?.[0]?.OTA_HotelResNotifRQ?.[0]?.HotelReservations?.[0]?.HotelReservation?.[0].RoomStays[0].RoomStay.map(
//                 (stay) => ({
//                   roomId: stay.RoomTypes
//                     ? stay.RoomTypes[0].RoomType.map(
//                         (type) => type.RoomID[0]
//                       )
//                     : undefined,
//                   stayDetails: stay
//                 })
//               )
//             : undefined,
//           resGuests:
//             result?.["soap-env:Envelope"]?.[
//               "soap-env:Body"
//             ]?.[0]?.OTA_HotelResNotifRQ?.[0]
//               ?.HotelReservations?.[0]
//               ?.HotelReservation?.[0]?.ResGuests?.[0]
//               ?.ResGuest || undefined,
//           shareAllMarketInd:
//             reservationData?.Profiles?.[0]
//               ?.ProfileInfo?.[0]?.Profile?.[0]
//               ?.ShareAllMarketInd?.[0] || undefined,
//           // ? reservationData.Profiles[0].ProfileInfo[0].Profile[0].ShareAllMarketInd.map(
//           //     (ind) => ind
//           //   )
//           // : undefined,
//           shareAllOptOutInd:
//             reservationData?.Profiles?.[0]
//               ?.ProfileInfo?.[0]?.Profile?.[0]
//               ?.ShareAllOptOutInd?.[0] || undefined
//           // ? reservationData.Profiles[0].ProfileInfo[0].Profile[0].ShareAllOptOutInd.map(
//           //     (ind) => ind
//           //   )
//           // : undefined
//         };

//         // return res.send({
//         //   message: "test data",
//         //   data: reservation
//         // });
//         console.log("Reservation", reservation);

//         //updation logic start
//         const bookingExist = await Reservation.findOne(
//           {
//             unique
//           }
//         );
//         if (bookingExist) {
//           console.log(1);
//           let updatedReservation =
//             await Reservation.updateOne(
//               { unique },
//               reservation
//             );
//           if (updatedReservation) {
//             logger.info(
//               `Reservation updated successfully: ${JSON.stringify(
//                 updatedReservation,
//                 null,
//                 2
//               )}`
//             );

//             res
//               .status(200)
//               .set("Content-Type", "application/xml")
//               .send(`
//                     <soap-env:Envelope xmlns:soap-env="${xmlnsSoapEnv}">
//                         <soap-env:Body>
//                             <OTA_HotelResNotifRS xmlns="${xmlns}" Version="${version}" TimeStamp="${new Date().toISOString()}" EchoToken="${echoToken}">
//                               <Success>
//                                     <Message>Reservation Modified Sucessfully</Message>
//                                 </Success>
//                             </OTA_HotelResNotifRS>
//                         </soap-env:Body>
//                     </soap-env:Envelope>
//                     `);
//           }
//         } else {
//           console.log(2);
//           const newReservation = await new Reservation(
//             reservation
//           ).save();
//           if (newReservation) {
//             console.log(3);
//             const customer =
//               reservationData.Profiles?.[0]
//                 ?.ProfileInfo?.[0]?.Profile?.[0]
//                 ?.Customer;

//             console.log("customer", customer);
//             const email =
//               customer?.[0]?.Email || false;

//             console.log("email", email);
//             const phone =
//               customer?.[0]?.Telephone?.[0]
//                 .PhoneNumber || false;
//             console.log("phone", phone);
//             const ResID_Value =
//               reservationData?.HotelReservationIDs?.[0]
//                 ?.HotelReservationID?.[0]
//                 ?.ResID_Value?.[0] || undefined;

//             let warningMessage = "";
//             let warningCode = "";
//             ({ warningMessage, warningCode } =
//               email === false
//                 ? phone === false
//                   ? {
//                       warningMessage:
//                         "Both email and phone are missing.",
//                       warningCode: "400"
//                     }
//                   : {
//                       warningMessage:
//                         "Guest Email is missing.",
//                       warningCode: "321"
//                     }
//                 : phone === false
//                 ? {
//                     warningMessage:
//                       "Guest Phone is missing.",
//                     warningCode: "316"
//                   }
//                 : {
//                     warningMessage: "",
//                     warningCode: ""
//                   });

//             if (!email || !phone) {
//               console.log("inside");
//               return res
//                 .status(200)
//                 .set("Content-Type", "application/xml")
//                 .send(`
//                       <soap-env:Envelope xmlns:soap-env="${xmlnsSoapEnv}">
//                           <soap-env:Body>
//                               <OTA_HotelResNotifRS xmlns="${xmlns}" Version="${version}" TimeStamp="${new Date().toISOString()}" EchoToken="${echoToken}">
//                                   <Warnings>
//                                         <Warning Type="10" Code="${warningCode}">${warningMessage}</Warning>
//                                   </Warnings>
//                                    <Success>
//                                    <UniqueID ID="${unique}"/>
//                                    <HotelReservationID ResID_Type="10" ResID_Value="${ResID_Value}"/>
//                                    <Message>Reservation Added Sucessfully</Message>
//                                    </Success>
//                             </OTA_HotelResNotifRS>
//                           </soap-env:Body>
//                       </soap-env:Envelope>
//                     `);
//             }
//             return res
//               .status(200)
//               .set("Content-Type", "application/xml")
//               .send(`
//                       <soap-env:Envelope xmlns:soap-env="${xmlnsSoapEnv}">
//                           <soap-env:Body>
//                               <OTA_HotelResNotifRS xmlns="${xmlns}" Version="${version}" TimeStamp="${new Date().toISOString()}" EchoToken="${echoToken}">
//                                    <Success>
//                                    <UniqueID ID="${unique}"/>
//                                    <HotelReservationID ResID_Type="10" ResID_Value="${ResID_Value}"/>
//                                    <Message>Reservation Added Sucessfully</Message>
//                                    </Success>
//                             </OTA_HotelResNotifRS>
//                           </soap-env:Body>
//                       </soap-env:Envelope>
//                     `);
//           }
//         }
//       }
//     );
//   } catch (error) {
//     logger.error(`Unhandled error: ${error.stack}`);
//     return res
//       .status(500)
//       .set("Content-Type", "application/xml").send(`
//     <soap-env:Envelope xmlns:soap-env="${xmlnsSoapEnv}">
//       <soap-env:Body>
//         <OTA_HotelResNotifRS xmlns="${xmlns}" Version="${version}" TimeStamp="${new Date().toISOString()}" EchoToken="${echoToken}">
//           <Errors>
//             <Error Type="6" Code="500">Internal Server Error</Error>
//           </Errors>
//         </OTA_HotelResNotifRS>
//       </soap-env:Body>
//     </soap-env:Envelope>
//   `);
//   }
// }

module.exports = {
  recieveBooking
  //   handleReservationMessage
};
