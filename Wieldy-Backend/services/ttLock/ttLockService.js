const axios = require("axios");
const querystring = require("querystring");
const Reservation = require("../../src/siteminder/model/reservationModel");
const ReseervationCB = require("../../src/cloudbeds/model/reservationModelCB")
const RoomLockId = require("../../models/roomLockModel");
const crypto = require("crypto");
const moment = require("moment-timezone");
const siteminderProperty = require("../../src/siteminder/model/SMXHotelModel");
const cloudBedsHotel = require("../../src/cloudbeds/model/cloudBedsHotelModel");

const TTLOCK_URL = "https://euapi.ttlock.com/v3";
const TTLOCK_CLIENT_ID =
  "bda38147cd4d4a7fae832aefa8ee3cda";
const TTLOCK_CLIENT_SECRET =
  "821a478fb51f0e080c3a1b3cb63a61c9";
const TTLOCK_ACCESS_TOKEN =
  "4cf690cbfea90d14aa0bc31221281ae6"; // needts to be dynamic which property installed only those


//chnage this also timezone from which country booking go db check hotel location find out nad generate acccrodingly take ref from logger code
function getTimestamp (date, hours, minutes) {
  const [year, month, day] = date
    .split("-")
    .map(Number);
  const dateObj = new Date(year, month - 1, day);
  dateObj.setHours(hours, minutes, 0, 0); // Set explicitly to ensure it's AM

  return dateObj.getTime();
};

// Function to map custom time zone string to IANA time zone names
// const timeZoneMapping = {
//   "(GMT+10:00) Sydney": "Australia/Sydney",
//   "(GMT+05:30) Mumbai": "Asia/Kolkata",
//   "(GMT+00:00) London": "Europe/London",
//   // Add more time zones as needed
// };

// const getIanaTimeZone = (customTimeZone) => {
//   return timeZoneMapping[customTimeZone] || 'UTC'; // Default to UTC if not found
// };


// Function to get the timestamp
// const getTimestamp = (
//   date,
//   hours,
//   minutes,
//   timeZone
// ) => {
//   // Parse date and set time
//   const [year, month, day] = date
//     .split("-")
//     .map(Number);

//   // Get IANA time zone name
//   const ianaTimeZone = getIanaTimeZone(timeZone);

//   // Create moment object in the specified time zone
//   const dateTime = moment.tz(
//     {
//       year,
//       month: month - 1,
//       day,
//       hour: hours,
//       minute: minutes,
//       second: 0
//     },
//     ianaTimeZone
//   );

//   return dateTime.valueOf(); // Return timestamp in milliseconds
// };


async function createPasskey(reservation, req, res) {
  // async function createPasskey(req, res) {
  try {
    // const { reservation } = req.body;

    console.log("reservation from tt", reservation);
    //   -------------
    const { checkInDate, checkOutDate } =
      reservation.timeSpan;

    //old logic
    let ct, cih=11, coh=10, cim=0, com=0
    if (reservation.source === "Siteminder") { //remaining for cb 
      ct = await siteminderProperty
        .findOne({
          propertyId: reservation.propertyId
        })
        .select(
          "defaultCheckInTime defaultCheckOutTime defaultTimeZone -_id"
      );
      ct = ct.toObject();
      cih = ct.defaultCheckInTime.split(":")[0];
      cim = ct.defaultCheckInTime.split(":")[1];

      coh = ct.defaultCheckOutTime.split(":")[0];
      com = ct.defaultCheckOutTime.split(":")[1];
    } else if (reservation.source === "CloudBeds") {
       ct = await cloudBedsHotel
         .findOne({
           propertyId: reservation.propertyId
         })
         .select(
           "defaultCheckInTime defaultCheckOutTime defaultTimeZone -_id"
      );
      ct = ct.toObject()
       cih = ct.defaultCheckInTime.split(":")[0];
       cim = ct.defaultCheckInTime.split(":")[1];

       coh = ct.defaultCheckOutTime.split(":")[0];
       com = ct.defaultCheckOutTime.split(":")[1];
    }
    
      // const startDate = getTimestamp(checkInDate, cih, cim); 
      // const endDate = getTimestamp(checkOutDate, coh, com);
      const startDate = getTimestamp(checkInDate, "00", "01"); 
      const endDate = getTimestamp(checkOutDate, "23", "59");

    //new logic
    // let timeZone;
    // if (reservation.source === "Siteminder") {
    //   const property = await siteminderProperty
    //     .findOne({
    //       propertyId: reservation.propertyId
    //     })
    //     .select("defaultTimeZone");
    //     console.log("property", property);
    //   // Extract the time zone information
    //   timeZone = property.defaultTimeZone; // Example format: "(GMT+10:00) Sydney"
    // }
    // console.log("timeZone", timeZone);
    // Ensure timeZone is formatted correctly
    // Convert to a standard IANA time zone string if necessary
    // For example: "(GMT+10:00) Sydney" to "Australia/Sydney"

    // const startDate = getTimestamp(
    //   checkInDate,
    //   11,
    //   0,
    //   timeZone
    // ); // 11 AM on checkInDate
    // const endDate = getTimestamp(
    //   checkOutDate,
    //   10,
    //   0,
    //   timeZone
    // ); // 10 AM on checkOutDate

    // console.log("startDate:", startDate);
    // console.log("endDate:", endDate);
  

    const username = `${
      reservation.guestName ?? "dummy"
    }${generateRandomDigit(4)}`;

    const pass = generateRandomPassword(6);
    const password = crypto
      .createHash("md5")
      .update(pass)
      .digest("hex");

    const userResponse = await axios.post(
      "https://euapi.ttlock.com/v3/user/register",
      querystring.stringify({
        clientId: TTLOCK_CLIENT_ID,
        clientSecret: TTLOCK_CLIENT_SECRET,
        username:
          removeAllExceptLettersAndNumbers(username),
        password: password,
        date: Date.now()
      }),
      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
          Cookie:
            "JSESSIONID=DA78CE9F2E58958F6BA01741C07B6B56"
        }
      }
    );
    // console.log("userResponse", userResponse.data);

    const tokenResponse = await axios.post(
      "https://euapi.ttlock.com/oauth2/token",
      querystring.stringify({
        clientId: TTLOCK_CLIENT_ID,
        clientSecret: TTLOCK_CLIENT_SECRET,
        username: userResponse.data.username,
        password: password
      }),
      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
          Cookie:
            "JSESSIONID=DA78CE9F2E58958F6BA01741C07B6B56"
        }
      }
    );

    // console.log("tokenResponse:", tokenResponse.data);
    // console.log(
    //   "reservation propertyAccessToken",
    //   reservation.propertyAccessToken
    // );

    const lockDetails = await RoomLockId.aggregate([
      {
        $match: {
          propertyId: reservation.propertyId,
          roomNumber: {
            $in: reservation.roomIds
          } // Match room IDs from reservation
        }
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          roomNumber: 1,
          lockId: 1
        }
      }
    ]);

    // console.log("lockDetails=>", lockDetails);
    const passcodeDetails = [];

    for (const lock of lockDetails) {
      const keySendResponse = await axios.post(
        "https://euapi.ttlock.com/v3/key/send",
        querystring.stringify({
          clientId: TTLOCK_CLIENT_ID,
          // accessToken: TTLOCK_ACCESS_TOKEN, //need to be dyanmic call from proprtyid
          accessToken: reservation.propertyAccessToken.ttLockData.ttLockAccessToken, 
          lockId: lock.lockId,
          receiverUsername: userResponse.data.username,
          keyName:
            "Ekey for" + " " + reservation.guestName,
          startDate: startDate,
          endDate: endDate,
          remoteEnable: 1,
          remarks: "Have a nice day.",
          date: Date.now()
        }),
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
            Cookie:
              "JSESSIONID=DA78CE9F2E58958F6BA01741C07B6B56"
          }
        }
      );

      console.log(
        "keySendResponse:",
        keySendResponse.data
      );
      const passcodeData = {
        clientId: TTLOCK_CLIENT_ID,
        // accessToken: TTLOCK_ACCESS_TOKEN,
        accessToken:
          reservation.propertyAccessToken.ttLockData
            .ttLockAccessToken,
        lockId: lock.lockId,
        keyboardPwdType: 3,
        keyboardPwdName: reservation.guestName,
        startDate: startDate,
        endDate: endDate,
        date: Date.now()
      };

      // console.log(
      //   "Requesting keyboard password from TT Lock:",
      //   passcodeData
      // );

      const sendPinRes = await axios.post(
        `https://euapi.ttlock.com/v3/keyboardPwd/get`,
        querystring.stringify(passcodeData),
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded"
          }
        }
      );

      // console.log(
      //   "TT Lock Send Pin Response:",
      //   sendPinRes.data
      // );

      if (sendPinRes.data.keyboardPwd) {
        passcodeDetails.push(
          lock.roomNumber +
            "=" +
            sendPinRes.data.keyboardPwd +
            "|" +
            "LockId" +
            "=" +
            lock.lockId
        );
      } else {
        console.error(
          "Error sending key for lock",
          lock.roomNumber,
          sendPinRes.data
        );
        return res.status(400).send({
          sucess: false,
          message: sendPinRes.data.description
        });
      }
    }
    console.log("passcodeDetails", passcodeDetails);

    let data = {
      username: userResponse.data.username,
      md5: password,
      password: pass,
      passcodeDetails: passcodeDetails.join(", "),
      passcodeExpiry: endDate,
      accessToken: tokenResponse.data.access_token,
      refreshToken: tokenResponse.data.refresh_token
    };
    if (reservation.source === "Siteminder") {
      console.log("hh", reservation.reservationID);
      await Reservation.updateOne(
        {
          reservationId: {
            $in: [reservation.reservationID]
          }
        },
        {
          passcodeDetails: passcodeDetails.join(", ")
        }
      );
    } else if (reservation.source==="CloudBeds") {
      console.log("jj");
      await ReseervationCB.updateOne(
        { reservationID: reservation.reservationID },
        { passcodeDetails: passcodeDetails.join(", ") }
      );
    }
    return data; //for real
    //   return userResponse.username
    // return res.status(200).send({
    //   //for tetsing
    //   sucess: true,
    //   message: "passcode generated success",
    //   data: data
    // });
    //   }
    //   return user
  } catch (error) {
    console.error("Error creating passkey:", error);
    throw error;
  }
}



async function updatePasskey(reservation) {
  try {
    console.log(
      "Updating passkey for reservation:",
      reservation
    );
    await createPasskey(reservation);
  } catch (error) {
    console.error("Error updating passkey:", error);
    throw error;
  }
}

function generateRandomPassword(length = 6) {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return result;
}

function removeAllExceptLettersAndNumbers(string) {
  return string.replace(/[^a-zA-Z0-9]/g, "");
}

function generateRandomDigit(length = 2) {
  const characters = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return result;
}

async function lockListMap(req, res) {
  const TTLOCK_CLIENT_ID =
    "bda38147cd4d4a7fae832aefa8ee3cda";
  try {
    const { propertyId } = req.query;

    const URL =
      "https://euapi.ttlock.com/v3/lock/list";
    const response = await axios.post(
      URL,
      new URLSearchParams({
        clientId: TTLOCK_CLIENT_ID,
        accessToken: reservation.propertyAccessToken.ttLockData.ttLockAccessToken,
        pageNo: 1,
        pageSize: 20,
        date: Date.now()
      }).toString(),
      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded"
        }
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
        roomNumber: elem.lockAlias
          .match(/\d+/g)
          .join(""),
        propertyId: propertyId
      };

      lockMap = await roomLockId.create(
        roomLockIdObject
      );
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
      data: lockMapArr
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: JSON.stringify(error)
    });
  }
}



module.exports = {
  createPasskey,
    updatePasskey,
  lockListMap
};
