// const axios = require("axios");
// const roomLockId = require("../models/roomLockModel");
// const logger = require("../logger/winstonLogger");
// const querystring = require("querystring");
// const crypto = require("crypto");
// const { encryptData, decryptData } = require("../utils/encryptionDecryption");

// // const property = require("../model/propertyModel");
// //need to change in code becaus eprevios only siteminder now two differents model so need to change based on query or whatever

// const User = require("../models/userModel");
// const RoomLockId = require("../models/roomLockModel");
// const siteminderProperty = require("../src/siteminder/model/SMXHotelModel");
// const cloudBedsHotel = require("../src/cloudbeds/model/cloudBedsHotelModel");
// const TTLOCK_URL1 = "https://euapi.ttlock.com/oauth2/token"; // Changed to token endpoint
// const TTLOCK_CLIENT_ID = "bda38147cd4d4a7fae832aefa8ee3cda";
// const TTLOCK_ACCESS_TOKEN = "4cf690cbfea90d14aa0bc31221281ae6";
// const TTLOCK_CLIENT_SECRET = "821a478fb51f0e080c3a1b3cb63a61c9";
// const TTLOCK_USERNAME = "+447492408673"; // Use the username you used to log in to the TT Lock app
// const TTLOCK_PASSWORD = "Chosentwo100%"; // Use your plain text password
// const TTLOCK_URL = "https://euapi.ttlock.com/v3/lock/unlock";

// const getCurrentTimestamp = () => new Date().getTime();

// async function lockListMap(req, res) {
//   const TTLOCK_CLIENT_ID = "bda38147cd4d4a7fae832aefa8ee3cda";
//   try {
//     const { propertyId, source } = req.query; //also want source
//     let lockListMap;
//     if (source === "Siteminder") {
//       lockListMap = await siteminderProperty
//         .findOne({
//           propertyId: propertyId,
//         })
//         .select("ttLockData.ttLockAccessToken -_id");
//       // console.log("lockListMap", lockListMap);
//       // list = lockListMap.ttLockslist
//     } else if (source === "CloudBeds") {
//       lockListMap = await cloudBedsHotel
//         .findOne({
//           propertyId: propertyId,
//         })
//         .select("ttLockData.ttLockAccessToken -_id");
//     }

//     const URL = "https://euapi.ttlock.com/v3/lock/list";
//     const response = await axios.post(
//       URL,
//       new URLSearchParams({
//         clientId: TTLOCK_CLIENT_ID,
//         accessToken: lockListMap.ttLockData.ttLockAccessToken,
//         // accessToken:
//         //   "d140fb4fa8de2c491c35b1c690fef258",
//         pageNo: 1,
//         pageSize: 20,
//         date: Date.now(),
//       }).toString(),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );
//     let list = response.data.list;
//     // console.log("list", list);
//     let lockMapArr = [];
//     for (let elem of list) {
//       // console.log("elem", elem);
//       const roomLockIdObject = {
//         lockId: elem.lockId,
//         lockAlias: elem.lockAlias,
//         lockName: elem.lockName,
//         roomNumber: elem.lockAlias.match(/\d+/g).join(""),
//         propertyId: propertyId,
//       };

//       lockMap = await roomLockId.create(roomLockIdObject);
//       lockMapArr.push(lockMap);
//     }
//     // console.log("lockMap", lockMap);

//     // console.log(
//     //   "Access Token Response:",
//     //   response.data
//     // );

//     return res.status(200).send({
//       status: true,
//       message: "LockId Map with room sucess",
//       data: lockMapArr,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Internal Server Error",
//       data: JSON.stringify(error),
//     });
//   }
// }

// async function getAccessToken(req, res) {
//   try {
//     const { TTLOCK_USERNAME, TTLOCK_PASSWORD, propertyId, source } = req.body;
//     if (!TTLOCK_USERNAME || !TTLOCK_PASSWORD || !propertyId) {
//       return res.status(400).send({
//         sucess: false,
//         message: "required ttlockusername ,password and property id",
//         data: null,
//       });
//     }
//     const md5Password = crypto
//       .createHash("md5")
//       .update(TTLOCK_PASSWORD)
//       .digest("hex");
//     const tokenResponse = await axios.post(
//       TTLOCK_URL1,
//       new URLSearchParams({
//         clientId: TTLOCK_CLIENT_ID,
//         clientSecret: TTLOCK_CLIENT_SECRET,
//         username: TTLOCK_USERNAME,
//         password: md5Password,
//       }).toString(),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );
//     console.log("tokenResponse", tokenResponse.data);

//     if (tokenResponse.data.access_token) {
//       //call lock list api and save to db

//       const params = {
//         clientId: TTLOCK_CLIENT_ID,
//         accessToken: tokenResponse.data.access_token,
//         pageNo: 1,
//         pageSize: 50,
//         date: Date.now(),
//       };

//       const lockResponse = await axios.get(
//         "https://euapi.ttlock.com/v3/lock/list",
//         {
//           params,
//           headers: {
//             Cookie: "JSESSIONID=DA78CE9F2E58958F6BA01741C07B6B56",
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//           paramsSerializer: (params) => querystring.stringify(params),
//         }
//       );
//       let ttlockadd;
//       if (source === "CloudBeds") {
//         ttlockadd = await cloudBedsHotel.findOneAndUpdate(
//           {
//             propertyId: propertyId,
//           },
//           {
//             "ttLockData.ttLockUserName": TTLOCK_USERNAME,
//             "ttLockData.ttLockMD5Password": md5Password,
//             "ttLockData.ttLockPassword": TTLOCK_PASSWORD,
//             "ttLockData.ttLockAccessToken": tokenResponse.data.access_token,
//             "ttLockData.ttLockRefreshToken": tokenResponse.data.refresh_token,
//             "ttLockData.ttLockslist": lockResponse.data.list,
//           },
//           { new: true }
//         );
//       } else if (source === "Siteminder") {
//         ttlockadd = await siteminderProperty.findOneAndUpdate(
//           {
//             propertyId: propertyId,
//           },
//           {
//             "ttLockData.ttLockUserName": TTLOCK_USERNAME,
//             "ttLockData.ttLockMD5Password": md5Password,
//             "ttLockData.ttLockPassword": TTLOCK_PASSWORD,
//             "ttLockData.ttLockAccessToken": tokenResponse.data.access_token,
//             "ttLockData.ttLockRefreshToken": tokenResponse.data.refresh_token,
//             "ttLockData.ttLockslist": lockResponse.data.list,
//           },
//           { new: true }
//         );
//       }
//       return res.status(200).send({
//         sucess: true,
//         message: "TT Lock Integration With Property Sucess",
//         data: ttlockadd,
//       });
//     }
//     return res.status(400).send({
//       sucess: false,
//       message: "issue in getting access token",
//       data: null,
//     });

//     // console.log(
//     //   "Access Token Response:",
//     //   response.data
//     // );
//   } catch (error) {
//     console.error("Error obtaining access token:", error);
//     return res.status(500).json({ error: "Error obtaining access token" });
//   }
// }

// const unlockLock = async (lockId, date, guestToken) => {
//   try {
//     const response = await axios.post(
//       "https://euapi.ttlock.com/v3/lock/unlock",
//       null,
//       {
//         params: {
//           clientId: TTLOCK_CLIENT_ID,
//           accessToken: TTLOCK_ACCESS_TOKEN,
//           // accessToken: guestToken,
//           lockId,
//           date,
//         },
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     return {
//       errcode: error.response ? error.response.data.errcode : 500,
//       errmsg: error.response
//         ? error.response.data.errmsg
//         : "Internal Server Error",
//     };
//   }
// };

// const queryLockOpenState = async (lockId, date, guestToken) => {
//   // const queryLockOpenState = async (
//   //   req,
//   //   res,
//   // ) => {
//   //   const { guestToken, lockId } = req.body;
//   try {
//     const response = await axios.get(
//       "https://euapi.ttlock.com/v3/lock/queryOpenState",
//       {
//         params: {
//           clientId: TTLOCK_CLIENT_ID,
//           // accessToken: TTLOCK_ACCESS_TOKEN,
//           accessToken: guestToken,
//           lockId,
//           date: Date.now(),
//         },
//       }
//     );
//     console.log("responseopen state", response.data);
//     return response.data;
//   } catch (error) {
//     return {
//       state: error.response ? error.response.data.state : 2, // Assuming 2 is unknown state
//     };
//   }
// };

// //require middleware
// //change also according to guest acestoken ryt now developer token is using
// const unlockStateDoor = async (req, res) => {
//   const {
//     // lockId = LOCK_ID,
//     room,
//     date = getCurrentTimestamp(),
//   } = req.body;
//   if (!room) {
//     return res.status.send({
//       sucess: false,
//       message: "room is required",
//       data: null,
//     });
//   }

//   let guestToken = await User.findById(req.user.id).select(
//     "guestTTLockCredentials.ttLockAccessToken email -_id"
//   );
//   guestToken = guestToken.guestTTLockCredentials.ttLockAccessToken;

//   let findLockid = await RoomLockId.findOne({
//     roomNumber: room,
//   }).select("lockId");

//   console.log("findLockid", findLockid.lockId);
//   let unlockResponse = await unlockLock(findLockid.lockId, date, guestToken);
//   console.log("unlockResponse", unlockResponse);

//   if (unlockResponse.errcode === 0) {
//     let stateResponse = await queryLockOpenState(
//       findLockid.lockId,
//       date,
//       guestToken
//     );
//     console.log("stateResponse", stateResponse);
//     if (stateResponse.state === 1) {
//       console.log("1");
//       //unlocked senario
//       let findUser = await User.findOneAndUpdate(
//         { _id: req.user.id },
//         {
//           $push: {
//             unlockingRecords: {
//               date: new Date(),
//               record: "unlocked",
//             },
//           },
//         },
//         { new: true } // Return the updated document
//       );
//       //call PUT api and update the response to checkin for that reservation

//       return res.status(200).send({
//         sucess: true,
//         message: "Currently Unlocked",
//         data: unlockResponse,
//       });
//     }
//     console.log("2");
//     let findUser = await User.findOneAndUpdate(
//       { _id: req.user.id },
//       {
//         $push: {
//           unlockingRecords: {
//             date: new Date(),
//             record: "locked",
//           },
//         },
//       },
//       { new: true } // Return the updated document
//     );
//     let encryptedData = encryptData(stateResponse);
//     return res.status(400).send({
//       sucess: true,
//       message: "Currently Locked",
//       data: encryptedData,
//     });
//   } else {
//     return res.status(400).send({
//       sucess: false,
//       message: "Currently Unknow State of lock",
//       data: unlockResponse,
//     });
//   }
// };

// module.exports = {
//   lockListMap,
//   getAccessToken,
//   queryLockOpenState,
//   unlockStateDoor,
// };

// ---------------------------------------------------------------------------------------------

// controller/lockController.js

const axios = require("axios");
const roomLockId = require("../models/roomLockModel");
const logger = require("../logger/winstonLogger");
const querystring = require("querystring");
const crypto = require("crypto");
// Removed the import of encryptData and decryptData
// const { encryptData, decryptData } = require("../utils/encryptionDecryption");

const User = require("../models/userModel");
const RoomLockId = require("../models/roomLockModel");
const siteminderProperty = require("../src/siteminder/model/SMXHotelModel");
const cloudBedsHotel = require("../src/cloudbeds/model/cloudBedsHotelModel");
const TTLOCK_URL1 = "https://euapi.ttlock.com/oauth2/token"; // Changed to token endpoint
const TTLOCK_CLIENT_ID = "bda38147cd4d4a7fae832aefa8ee3cda";
const TTLOCK_ACCESS_TOKEN = "4cf690cbfea90d14aa0bc31221281ae6";
const TTLOCK_CLIENT_SECRET = "821a478fb51f0e080c3a1b3cb63a61c9";
const TTLOCK_USERNAME = "+447492408673"; // Use the username you used to log in to the TT Lock app
const TTLOCK_PASSWORD = "Chosentwo100%"; // Use your plain text password
const TTLOCK_URL = "https://euapi.ttlock.com/v3/lock/unlock";

const getCurrentTimestamp = () => new Date().getTime();

async function lockListMap(req, res) {
  const TTLOCK_CLIENT_ID = "bda38147cd4d4a7fae832aefa8ee3cda";
  try {
    const { propertyId, source } = req.query; // also want source
    let lockListMap;
    if (source === "Siteminder") {
      lockListMap = await siteminderProperty
        .findOne({
          propertyId: propertyId,
        })
        .select("ttLockData.ttLockAccessToken -_id");
      // console.log("lockListMap", lockListMap);
      // list = lockListMap.ttLockslist
    } else if (source === "CloudBeds") {
      lockListMap = await cloudBedsHotel
        .findOne({
          propertyId: propertyId,
        })
        .select("ttLockData.ttLockAccessToken -_id");
    }

    const URL = "https://euapi.ttlock.com/v3/lock/list";
    const response = await axios.post(
      URL,
      new URLSearchParams({
        clientId: TTLOCK_CLIENT_ID,
        accessToken: lockListMap.ttLockData.ttLockAccessToken,
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
    // console.log("list", list);
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
      message: "LockId Map with room success",
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

async function getAccessToken(req, res) {
  try {
    const { TTLOCK_USERNAME, TTLOCK_PASSWORD, propertyId, source } = req.body;
    if (!TTLOCK_USERNAME || !TTLOCK_PASSWORD || !propertyId) {
      return res.status(400).send({
        success: false,
        message: "Required ttlockusername, password, and property id",
        data: null,
      });
    }
    const md5Password = crypto
      .createHash("md5")
      .update(TTLOCK_PASSWORD)
      .digest("hex");
    const tokenResponse = await axios.post(
      TTLOCK_URL1,
      new URLSearchParams({
        clientId: TTLOCK_CLIENT_ID,
        clientSecret: TTLOCK_CLIENT_SECRET,
        username: TTLOCK_USERNAME,
        password: md5Password,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("tokenResponse", tokenResponse.data);

    if (tokenResponse.data.access_token) {
      // Call lock list API and save to db

      const params = {
        clientId: TTLOCK_CLIENT_ID,
        accessToken: tokenResponse.data.access_token,
        pageNo: 1,
        pageSize: 50,
        date: Date.now(),
      };

      const lockResponse = await axios.get(
        "https://euapi.ttlock.com/v3/lock/list",
        {
          params,
          headers: {
            Cookie: "JSESSIONID=DA78CE9F2E58958F6BA01741C07B6B56",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          paramsSerializer: (params) => querystring.stringify(params),
        }
      );
      let ttlockadd;
      if (source === "CloudBeds") {
        ttlockadd = await cloudBedsHotel.findOneAndUpdate(
          {
            propertyId: propertyId,
          },
          {
            "ttLockData.ttLockUserName": TTLOCK_USERNAME,
            "ttLockData.ttLockMD5Password": md5Password,
            "ttLockData.ttLockPassword": TTLOCK_PASSWORD,
            "ttLockData.ttLockAccessToken": tokenResponse.data.access_token,
            "ttLockData.ttLockRefreshToken": tokenResponse.data.refresh_token,
            "ttLockData.ttLockslist": lockResponse.data.list,
          },
          { new: true }
        );
      } else if (source === "Siteminder") {
        ttlockadd = await siteminderProperty.findOneAndUpdate(
          {
            propertyId: propertyId,
          },
          {
            "ttLockData.ttLockUserName": TTLOCK_USERNAME,
            "ttLockData.ttLockMD5Password": md5Password,
            "ttLockData.ttLockPassword": TTLOCK_PASSWORD,
            "ttLockData.ttLockAccessToken": tokenResponse.data.access_token,
            "ttLockData.ttLockRefreshToken": tokenResponse.data.refresh_token,
            "ttLockData.ttLockslist": lockResponse.data.list,
          },
          { new: true }
        );
      }
      return res.status(200).send({
        success: true,
        message: "TT Lock Integration With Property Success",
        data: ttlockadd,
      });
    }
    return res.status(400).send({
      success: false,
      message: "Issue in getting access token",
      data: null,
    });

    // console.log(
    //   "Access Token Response:",
    //   response.data
    // );
  } catch (error) {
    console.error("Error obtaining access token:", error);
    return res.status(500).json({ error: "Error obtaining access token" });
  }
}

const unlockLock = async (lockId, date, guestToken) => {
  try {
    const response = await axios.post(
      "https://euapi.ttlock.com/v3/lock/unlock",
      null,
      {
        params: {
          clientId: TTLOCK_CLIENT_ID,
          accessToken: TTLOCK_ACCESS_TOKEN,
          // accessToken: guestToken,
          lockId,
          date,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error) {
    return {
      errcode: error.response ? error.response.data.errcode : 500,
      errmsg: error.response
        ? error.response.data.errmsg
        : "Internal Server Error",
    };
  }
};

const queryLockOpenState = async (lockId, date, guestToken) => {
  try {
    const response = await axios.get(
      "https://euapi.ttlock.com/v3/lock/queryOpenState",
      {
        params: {
          clientId: TTLOCK_CLIENT_ID,
          // accessToken: TTLOCK_ACCESS_TOKEN,
          accessToken: guestToken,
          lockId,
          date: Date.now(),
        },
      }
    );
    console.log("response open state", response.data);
    return response.data;
  } catch (error) {
    return {
      state: error.response ? error.response.data.state : 2, // Assuming 2 is unknown state
    };
  }
};

// Require middleware
// Change also according to guest access token; right now developer token is using
const unlockStateDoor = async (req, res) => {
  const {
    // lockId = LOCK_ID,
    room,
    date = getCurrentTimestamp(),
  } = req.body;
  if (!room) {
    return res.status(400).send({
      success: false,
      message: "Room is required",
      data: null,
    });
  }

  let guestData = await User.findById(req.user.id).select(
    "guestTTLockCredentials.ttLockAccessToken email -_id"
  );
  let guestToken = guestData.guestTTLockCredentials.ttLockAccessToken;

  let findLockid = await RoomLockId.findOne({
    roomNumber: room,
  }).select("lockId");

  console.log("findLockid", findLockid.lockId);
  let unlockResponse = await unlockLock(findLockid.lockId, date, guestToken);
  console.log("unlockResponse", unlockResponse);

  if (unlockResponse.errcode === 0) {
    let stateResponse = await queryLockOpenState(
      findLockid.lockId,
      date,
      guestToken
    );
    console.log("stateResponse", stateResponse);
    if (stateResponse.state === 1) {
      console.log("1");
      // Unlocked scenario
      let findUser = await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $push: {
            unlockingRecords: {
              date: new Date(),
              record: "unlocked",
            },
          },
        },
        { new: true } // Return the updated document
      );
      // Call PUT API and update the response to check-in for that reservation

      return res.status(200).send({
        success: true,
        message: "Currently Unlocked",
        data: unlockResponse,
      });
    }
    console.log("2");
    let findUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        $push: {
          unlockingRecords: {
            date: new Date(),
            record: "locked",
          },
        },
      },
      { new: true } // Return the updated document
    );
    // Removed encryption here
    return res.status(400).send({
      success: true,
      message: "Currently Locked",
      data: stateResponse,
    });
  } else {
    return res.status(400).send({
      success: false,
      message: "Currently Unknown State of lock",
      data: unlockResponse,
    });
  }
};

module.exports = {
  lockListMap,
  getAccessToken,
  queryLockOpenState,
  unlockStateDoor,
};
