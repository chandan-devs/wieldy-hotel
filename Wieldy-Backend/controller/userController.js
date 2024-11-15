// const mongoose = require("mongoose");
// const User = require("../models/userModel");
// const {
//   sendPasscodeEmail
// } = require("../services/communicationManagement/emailService"); // Import sendPasscodeSMS
// const sendPasscodeSMS = require("../services/communicationManagement/smsService")
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const Role = require("../models/roleModel");
// const Source = require("../models/sourceModel");
// const SMXResrvation = require("../src/siteminder/model/reservationModel");
// const CBreservation = require("../src/cloudbeds/model/reservationModelCB");
// const siteminderProperty = require("../src/siteminder/model/SMXHotelModel");
// const cloudBedsHotel = require("../src/cloudbeds/model/cloudBedsHotelModel");
// const authCodeModel = require("../src/cloudbeds/model/authenticationModelCB");
// const {
//   renewAccessToken,
//   checkAccessToken
// } = require("../src/cloudbeds/controller/authenticationControllerCB");
// const axios = require("axios");
// const {
//   encryptData,
//   decryptData
// } = require("../utils/encryptionDecryption");
// const logger = require("../logger/winstonLogger");
// const ttlockService = require("../services/ttLock/ttLockService");
// require("dotenv").config();

// //old
// async function createUser(req, res) {
//   try {
//     const {
//       name,
//       email,
//       contact,
//       ttLockUsername,
//       ttLockMD5,
//       ttLockpass,
//       ttLockpasscodeExpiry,
//       ttLockaccessToken,
//       ttLockrefreshToken,
//       passcodeData,
//       source,
//       role,
//       timeSpan,
//       hotelDetail,
//       emailType,
//       senderName
//     } = req.body;

//     // Check if email or contact is provided
//     if (!email) {
//       return res.status(400).json({
//         message: "email is required."
//       });
//     }
//     // ---------
//     const passcode = Math.random()
//       .toString(36)
//       .slice(-8);

//     let roleId = await Role.findOne({
//       name: role
//     }).select("_id");
//     let sourceId = await Source.findOne({
//       sourceName: source
//     }).select("_id");
//     // console.log(
//     //   "roleId",
//     //   roleId,
//     //   "sourceId",
//     //   sourceId
//     // );

//     // Check if email or contact already exists
//     if (email) {
//       const existingEmailUser = await User.findOne({
//         email
//       });
//       if (existingEmailUser) {
//         // return res
//         //   .status(400)
//         //   .json({ message: "Email already in use." });
//         // -----------
//         // await User.deleteOne({ email });
//         // console.log(
//         //   "User with email already existed, so it was deleted."
//         // );
//         // ------------
//         let updatedUser = await User.findOneAndUpdate(
//           { email },
//           {
//             name: name || null,
//             guestTTLockCredentials: {
//               ttLockUsername: ttLockUsername || null,
//               ttLockMD5Password: ttLockMD5 || null,
//               ttLockAccessToken:
//                 ttLockaccessToken || null, // updated consistent variable name
//               ttLockRefreshToken:
//                 ttLockrefreshToken || null,
//               ttLockPassword: ttLockpass || null,
//               doorPasscode: passcodeData || null,
//               passcodeExpiry:
//                 ttLockpasscodeExpiry || null
//             },
//             contact: contact || null,
//             // password: passcode || null,
//             permissions: {
//               roles: roleId?._id, // ensure safe access in case roleId or sourceId is undefined
//               source: sourceId?._id
//             }
//           },
//           { new: true } // optional: to return the updated user
//         );

//         let flag = false;
//         let flag2 = false;
//         console.log(
//           "User with email already existed, so it was updated."
//         );
//         if (updatedUser) {
//           const { checkInDate, checkOutDate } =
//             timeSpan;
//           const {
//             propertyName,
//             defaultCheckInTime,
//             defaultCheckOutTime,
//             propertyEmail
//           } = hotelDetail;
//           let bookingdetail = {
//             firstName: name,
//             checkInDate: checkInDate,
//             checkOutDate: checkOutDate,
//             propertyName,
//             defaultCheckInTime,
//             defaultCheckOutTime,
//             propertyEmail
//           };
//           console.log("bookingdetail", bookingdetail);

//           //add scheduler here if required
//           const emailResult = await sendPasscodeEmail(
//             email,
//             // passcode, //before this is going passcodeData for room sharing pascodes
//             existingEmailUser.password,
//             contact,
//             emailType || "account_creation",
//             bookingdetail,
//             senderName
//           );
//           if (contact) {
//             console.log("smspasscode1", passcode);
//             const smsResult = await sendPasscodeSMS(
//               contact,
//               name,
//               propertyName,
//               email,
//               existingEmailUser.password
//             );
//           }

//           if (!emailResult.success) {
//             return res.status(500).send({
//               message:
//                 "User created but failed to send passcode email"
//             });
//           }

//           if (emailResult.success) {
//             if (req.url === "/createUser") {
//               return res.status(201).send({
//                 message: "User created successfully",
//                 userId: user._id
//               });
//             }
//             // return true;
//             flag = true;
//             flag2 = true;
//             return { flag, flag2 };
//           }
//         }
//       } else {
//         const user = new User({
//           name: name || null,
//           guestTTLockCredentials: {
//             ttLockUsername: ttLockUsername || null,
//             ttLockMD5Password: ttLockMD5 || null,
//             ttLockAccessToken:
//               ttLockaccessToken || null,
//             ttLockRefreshToken:
//               ttLockrefreshToken || null,
//             ttLockPassword: ttLockpass || null,
//             doorPasscode: passcodeData || null,
//             passcodeExpiry:
//               ttLockpasscodeExpiry || null
//           },
//           email: email || null,
//           contact: contact || null,
//           password: passcode || null,
//           permissions: {
//             roles: roleId._id,
//             source: sourceId._id
//           }
//         });
//         let flag = false;
//         let flag2 = false;
//         // Save the user to the database
//         let saved_user = await user.save();
//         console.log("saved_user", saved_user);
//         if (saved_user._id) {
//           if (req.url === "/createUser") {
//             return res.status(201).send({
//               message:
//                 "User created successfully without email",
//               userId: user._id
//             });
//           }
//           //   return true;
//           flag = true;
//         }
//         if (email) {
//           // Send passcode email
//           const { checkInDate, checkOutDate } =
//             timeSpan;
//           const {
//             propertyName,
//             defaultCheckInTime,
//             defaultCheckOutTime,
//             propertyEmail
//           } = hotelDetail;
//           let bookingdetail = {
//             firstName: name,
//             checkInDate: checkInDate,
//             checkOutDate: checkOutDate,
//             propertyName,
//             defaultCheckInTime,
//             defaultCheckOutTime,
//             propertyEmail
//           };
//           console.log("bookingdetail", bookingdetail);

//           //add scheduler here if required
//           const emailResult = await sendPasscodeEmail(
//             user.email,
//             passcode, //before this is going passcodeData for room sharing pascodes
//             user.contact,
//             emailType || "account_creation",
//             bookingdetail,
//             senderName
//           );
//           if (contact) {
//             const smsResult = await sendPasscodeSMS(
//               contact,
//               name,
//               propertyName,
//               email,
//               passcode
//             );
//           }

//           if (!emailResult.success) {
//             return res.status(500).send({
//               message:
//                 "User created but failed to send passcode email"
//             });
//           }

//           if (emailResult.success) {
//             if (req.url === "/createUser") {
//               return res.status(201).send({
//                 message: "User created successfully",
//                 userId: user._id
//               });
//             }
//             // return true;
//             flag2 = true;
//             return { flag, flag2 };
//           }
//         }
//       }
//     }

//     if (contact) {
//       // const existingContactUser = await User.findOne({
//       //   contact
//       // });
//       // if (existingContactUser) {
//       //   // return res.status(400).json({
//       //   //   message: "Contact number already in use."
//       //   // });
//       //   console.log("contact exist");
//       // }

//     }

//     // const passcode = Math.random()
//     //   .toString(36)
//     //   .slice(-8);

//     // let roleId = await Role.findOne({
//     //   name: role
//     // }).select("_id");
//     // let sourceId = await Source.findOne({
//     //   sourceName: source
//     // }).select("_id");
//     // console.log(
//     //   "roleId",
//     //   roleId,
//     //   "sourceId",
//     //   sourceId
//     // );

//     // const user = new User({
//     //   name: name || null,
//     //   guestTTLockCredentials: {
//     //     ttLockUsername: ttLockUsername || null,
//     //     ttLockMD5Password: ttLockMD5 || null,
//     //     ttLockAccessToken: ttLockaccessToken || null,
//     //     ttLockRefreshToken: ttLockrefreshToken || null,
//     //     ttLockPassword: ttLockpass || null,
//     //     doorPasscode: passcodeData || null,
//     //     passcodeExpiry: ttLockpasscodeExpiry || null
//     //   },
//     //   email: email || null,
//     //   contact: contact || null,
//     //   password: passcode || null,
//     //   permissions: {
//     //     roles: roleId._id,
//     //     source: sourceId._id
//     //   }
//     // });
//     // let flag = false;
//     // let flag2 = false;
//     // // Save the user to the database
//     // let saved_user = await user.save();
//     // console.log("saved_user", saved_user);
//     // if (saved_user._id) {
//     //   if (req.url === "/createUser") {
//     //     return res.status(201).send({
//     //       message:
//     //         "User created successfully without email",
//     //       userId: user._id
//     //     });
//     //   }
//     //   //   return true;
//     //   flag = true;
//     // }
//     // if (email) {
//     //   // Send passcode email
//     //   const { checkInDate, checkOutDate } = timeSpan;
//     //   const {
//     //     propertyName,
//     //     defaultCheckInTime,
//     //     defaultCheckOutTime,
//     //     propertyEmail
//     //   } = hotelDetail;
//     //   let bookingdetail = {
//     //     firstName: name,
//     //     checkInDate: checkInDate,
//     //     checkOutDate: checkOutDate,
//     //     propertyName,
//     //     defaultCheckInTime,
//     //     defaultCheckOutTime,
//     //     propertyEmail
//     //   };
//     //   console.log("bookingdetail", bookingdetail);

//     //   //add scheduler here if required
//     //   const emailResult = await sendPasscodeEmail(
//     //     user.email,
//     //     passcode, //before this is going passcodeData for room sharing pascodes
//     //     user.contact,
//     //     "account_creation",
//     //     bookingdetail
//     //   );

//     //   if (!emailResult.success) {
//     //     return res.status(500).send({
//     //       message:
//     //         "User created but failed to send passcode email"
//     //     });
//     //   }

//     //   if (emailResult.success) {
//     //     if (req.url === "/createUser") {
//     //       return res.status(201).send({
//     //         message: "User created successfully",
//     //         userId: user._id
//     //       });
//     //     }
//     //     // return true;
//     //     flag2 = true;
//     //     return { flag, flag2 };
//     //   }
//     // }

//     // console.error("Error sending email:", emailError);
//     // return res.status(500).json({
//     //   message:
//     //     "User created, but there was an error sending the passcode email.",
//     //   error: emailError
//     // });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).json({
//       message: "Error creating user",
//       error: error.message || error
//     });
//   }
// }

// async function generatePasscode(req, res) {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user)
//       return res
//         .status(404)
//         .json({ message: "User not found" });

//     const passcode = Math.random()
//       .toString(36)
//       .slice(-8);
//     user.passcode = await bcrypt.hash(passcode, 10);
//     user.passcodeExpiry = Date.now() + 3600000; // 1 hour expiry
//     await user.save();

//     const result = await sendPasscodeEmail(
//       user.email,
//       passcode,
//       user.contact,
//       "account_creation"
//     );
//     if (result.success) {
//       res.status(200).json({
//         message: "Passcode sent to the user's email"
//       });
//     } else {
//       res
//         .status(500)
//         .json({ message: "Failed to send passcode" });
//     }
//   } catch (error) {
//     console.error("Error generating passcode:", error);
//     res.status(500).json({
//       message: "Error generating passcode",
//       error
//     });
//   }
// }

// async function updatePassword(req, res) {
//   try {
//     const { userId, passcode, newPassword } = req.body;
//     const user = await User.findById(userId);
//     if (!user)
//       return res
//         .status(404)
//         .json({ message: "User not found" });

//     // const isMatch = await bcrypt.compare(
//     //   passcode,
//     //   user.passcode
//     // );
//     // if (!isMatch || user.passcodeExpiry < Date.now()) {
//     //   return res.status(400).json({
//     //     message: "Invalid or expired passcode"
//     //   });
//     // }

//     user.password = passcode;
//     // user.password = newPassword;
//     // user.passcode = undefined; // Clear passcode after successful update
//     // user.passcodeExpiry = undefined;
//     await user.save();

//     res.status(200).json({
//       message: "Password updated successfully"
//     });
//   } catch (error) {
//     console.error("Error updating password:", error);
//     res.status(500).json({
//       message: "Error updating password",
//       error
//     });
//   }
// }

// //for upsales for only cloud beds dont nee din siteminder
// async function postItem(req, res) {
//   try {
//     const { itemID, itemQuantity, reservationID } =
//       req.query;
//     if (!itemID || !itemQuantity || !reservationID) {
//       return res.status(400).send({
//         success: false,
//         message:
//           "Missing required parameters: itemID, itemQuantity, and reservationID are all mandatory.",
//         data: null
//       });
//     }
//     const data = querystring.stringify({
//       itemID,
//       itemQuantity,
//       reservationID
//     });

//     let propertyId = await CBreservation.findOne({
//       reservationID: reservationID
//     }).select("propertyID -_id");

//     let access_token = await authCodeModel
//       .findOne({
//         propertyId: propertyId.propertyID
//       })
//       .select("access_token _id refresh_token");

//     const authID = access_token._id;
//     const token = access_token.access_token;
//     const refreshToken = access_token.refresh_token;
//     let tokenCheck = await checkAccessToken(token);
//     if (!tokenCheck) {
//       let newAccessToken = await renewAccessToken(
//         refreshToken
//       );
//       // console.log("newAccessToken", newAccessToken);

//       let updatedRecord =
//         await authCodeModel.findByIdAndUpdate(
//           authID,
//           {
//             access_token: newAccessToken
//           },
//           { new: true }
//         );
//       if (updatedRecord) {
//         console.log("new token updated to db sucess");
//       }
//     }
//     let newToken = await authCodeModel
//       .findOne({
//         propertyId: propertyId.propertyID
//       })
//       .select("access_token");

//     const response = await axios.post(
//       "https://api.cloudbeds.com/api/v1.2/postItem",
//       data,
//       {
//         headers: {
//           "Content-Type":
//             "application/x-www-form-urlencoded",
//           Authorization: `Bearer ${newToken.access_token}`
//         }
//       }
//     );
//     if (response.status === 200) {
//       let encryptedData = encryptData(
//         response.data.data
//       );
//       return res.status(200).send({
//         success: response.data.success,
//         message:
//           "Item Sucessfully addded to reservation",
//         data: encryptedData
//       });
//     }
//     return res.status(400).send({
//       success: false,
//       message: "Error in calling API post item",
//       data: null
//     });
//   } catch (error) {
//     logger.info("ERR", error);
//     return res.status(500).send({
//       success: false,
//       message: "Internal Server Error",
//       data: JSON.stringify(error)
//     });
//   }
// }

// async function getPasscodeDetails(req, res) {
//   try {
//     const { reservationId, room } = req.query;
//     // console.log(req.query);

//     if (!reservationId || !room) {
//       return res.status(400).json({
//         message: "reservationId and room are required"
//       });
//     }
//     let source = await Source.findById(
//       req.user.permissions.source
//     ).select("sourceName");

//     const Preservation =
//       source.sourceName === "Siteminder"
//         ? await SMXResrvation.findById(
//             reservationId
//           ).select("passcodeDetails")
//         : source.sourceName === "CloudBeds"
//         ? await CBreservation.findById(
//             reservationId
//           ).select("passcodeDetails")
//         : null;

//     // console.log("Preservation", Preservation);

//     if (!Preservation) {
//       return res
//         .status(404)
//         .json({ message: "Reservation not found" });
//     }

//     // Extract the passcode for the specific room
//     const passcodeDetails =
//       Preservation.passcodeDetails;
//     const passcodeRegex = new RegExp(
//       `${room}=\\s*(\\d+)`
//     );
//     const passcodeMatch =
//       passcodeDetails.match(passcodeRegex);
//     const passcode = passcodeMatch
//       ? passcodeMatch[1]
//       : null;

//     if (!passcode) {
//       return res.status(404).json({
//         message: `Passcode not found for room ${room} in passcodeDetails`
//       });
//     }
//     let encryptedData = encryptData({ passcode });
//     return res.status(200).json(encryptedData);
//   } catch (error) {
//     console.error(
//       "Error fetching passcode details:",
//       error
//     );
//     return res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message
//     });
//   }
// }

// async function login(req, res) {
//   try {
//     const data = req.body.encryptedData;
//     const decryptedData = decryptData(data);
//     const { email, password } = decryptedData;
//     // const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user)
//       return res
//         .status(404)
//         .json({ message: "User not found" });
//     // const isMatch = await User.findOne({password})

//     // const isMatch = await bcrypt.compare(
//     //   password,
//     //   user.password
//     // );
//     // if (!isMatch)
//     //   return res
//     //     .status(400)
//     //     .json({ message: "Invalid credentials" });
//     const isMatch =
//       password === user.password ? true : false;

//     if (!isMatch)
//       return res
//         .status(400)
//         .json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       {
//         userId: user._id,
//         permissions: user.permissions
//       },
//       process.env.GUEST_AUTH_KEY,
//       { expiresIn: "90d" }
//     );

//     /////////
//     const result = {
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email
//       },
//       sourceType: (
//         await Source.findById(user.permissions.source)
//           .select("sourceName -_id")
//           .lean()
//       ).sourceName
//     };
//     let encryptedData = encryptData(result);
//     res.status(200).json(encryptedData);

//     // res.status(200).json({
//     //   token,
//     //   user: {
//     //     id: user._id,
//     //     name: user.name,
//     //     email: user.email
//     //   },
//     //   sourceType: (
//     //     await Source.findById(user.permissions.source)
//     //       .select("sourceName -_id")
//     //       .lean()
//     //   ).sourceName
//     // });
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res
//       .status(500)
//       .json({ message: "Error logging in", error });
//   }
// }

// async function forgotPassword(req, res) {
//   try {
//     const { email, contact } = req.body;

//     if (!email && !contact) {
//       return res.status(400).json({
//         message: "Email or contact number is required."
//       });
//     }

//     let user;
//     if (email) {
//       user = await User.findOne({ email });
//     } else if (contact) {
//       user = await User.findOne({ contact });
//     }

//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "User not found" });
//     }

//     const otp = Math.floor(
//       100000 + Math.random() * 900000
//     ).toString(); // 6-digit OTP
//     user.passcode = await bcrypt.hash(otp, 10);
//     user.passcodeExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
//     await user.save();

//     if (email) {
//       await sendPasscodeEmail(
//         user.email,
//         otp,
//         user.contact,
//         "forgot_password"
//       );
//     } else if (contact) {
//       await sendPasscodeSMS(user.contact, otp); // Implement this in a different file
//     }

//     res
//       .status(200)
//       .json({ message: "OTP sent successfully" });
//   } catch (error) {
//     console.error(
//       "Error in forgot password process:",
//       error
//     );
//     res.status(500).json({
//       message: "Internal server error",
//       error
//     });
//   }
// }

// async function verifyOtp(req, res) {
//   try {
//     const { email, contact, otp } = req.body;

//     if (!email && !contact) {
//       return res.status(400).json({
//         message: "Email or contact number is required."
//       });
//     }

//     let user;
//     if (email) {
//       user = await User.findOne({ email });
//     } else if (contact) {
//       user = await User.findOne({ contact });
//     }

//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(
//       otp,
//       user.passcode
//     );
//     if (!isMatch || user.passcodeExpiry < Date.now()) {
//       return res
//         .status(400)
//         .json({ message: "Invalid or expired OTP" });
//     }

//     // Generate a new passcode for login
//     const newPasscode = Math.random()
//       .toString(36)
//       .slice(-8);
//     user.passcode = await bcrypt.hash(newPasscode, 10);
//     user.passcodeExpiry = Date.now() + 3600000; // 1 hour expiry
//     await user.save();

//     // Send the new passcode to the user
//     if (email) {
//       await sendPasscodeEmail(
//         user.email,
//         newPasscode,
//         user.contact,
//         "account_creation"
//       );
//     }
//     if (contact) {
//       await sendPasscodeSMS(user.contact, newPasscode); // Implement this in a different file
//     }

//     res.status(200).json({
//       message: "New login passcode sent successfully"
//     });
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     res.status(500).json({
//       message: "Internal server error",
//       error
//     });
//   }
// }

// //user level for mobile app
// async function userAndHotelReservation(req, res) {
//   try {
//     let guestEmail = await User.findById(
//       req.user.id
//     ).select("email -_id");

//     let source = await Source.findById(
//       req.user.permissions.source
//     ).select("sourceName");
//     const resultARR = [];

//     if (source.sourceName === "Siteminder") {
//       let guestAllReservations =
//         await SMXResrvation.aggregate([
//           {
//             $match: {
//               "customerData.Email._": guestEmail.email
//             }
//           },
//           {
//             $addFields: {
//               statusPriority: {
//                 $cond: {
//                   if: { $eq: ["$status", "Reserved"] },
//                   then: 1,
//                   else: 2
//                 }
//               }
//             }
//           },
//           {
//             $sort: {
//               statusPriority: 1,
//               _id: 1 // This sorts by _id within the same status, optional
//             }
//           },
//           {
//             $project: {
//               statusPriority: 0
//             }
//           }
//         ]);

//       // Check if reservations exist
//       if (guestAllReservations.length === 0) {
//         return res.status(404).send({
//           success: true,
//           message:
//             "No reservations found for the provided email.",
//           data: null
//         });
//       }
//       // console.log("reservation", guestAllReservations[0].basicProperty[0].HotelCode[0]);
//       // Step 3: Extract all unique HotelCodes from the reservations for different hotels
//       const hotelCodes = [
//         ...new Set(
//           guestAllReservations.flatMap(
//             (reservation) => {
//               return (
//                 reservation.basicProperty || []
//               ).flatMap((property) => {
//                 return (property.HotelCode || []).map(
//                   (code) => code
//                 );
//               });
//             }
//           )
//         )
//       ];

//       // Step 4: Fetch hotel details using the extracted HotelCodes
//       let hotelDetails = await siteminderProperty
//         .find({
//           propertyId: { $in: hotelCodes }
//         })
//         .select("-ttLockData");

//       // Convert hotelDetails to a dictionary for quick lookup
//       const hotelDetailsDict = hotelDetails.reduce(
//         (acc, hotel) => {
//           acc[hotel.propertyId] = hotel;
//           return acc;
//         },
//         {}
//       );
//       // console.log(
//       //   "hotelDetailsDict",
//       //   hotelDetailsDict
//       // );

//       // Step 5: Map the reservations to include the hotelDetails within basicProperty
//       const result = guestAllReservations.map(
//         (reservation) => {
//           // Extract the HotelCode from the basicProperty array if it exists
//           const hotelCode =
//             reservation.basicProperty?.find(
//               (property) => property.HotelCode
//             )?.HotelCode?.[0];

//           // Retrieve the hotel detail from hotelDetailsDict or default to null
//           const hotelDetail =
//             hotelDetailsDict[hotelCode] || null;

//           return {
//             ...reservation,
//             basicProperty: {
//               ...(reservation.basicProperty || []),
//               hotelDetails: hotelDetail
//             }
//           };
//         }
//       );
//       // Extracting guest info, booking info, and hotel info from result
//       result.forEach((reservation) => {
//         // console.log("reser", reservation);
//         const guestinfo = reservation.customerData?.[0]
//           ? {
//               vipIndicator:
//                 reservation.customerData[0]
//                   ?.VIP_Indicator?.[0] || "false",
//               personName: {
//                 givenName:
//                   reservation.customerData[0]
//                     ?.PersonName?.[0]
//                     ?.GivenName?.[0] || "",
//                 surname:
//                   reservation.customerData[0]
//                     ?.PersonName?.[0]?.Surname?.[0] ||
//                   ""
//               },
//               telephone:
//                 reservation.customerData[0]
//                   ?.Telephone?.[0]?.PhoneNumber?.[0] ||
//                 "",
//               email:
//                 reservation.customerData[0]?.Email?.[0]
//                   ?._ || ""
//               //  address: {
//               //    addressLine:
//               //      reservation.customerData[0]
//               //        ?.Address?.[0]?.AddressLine || [],
//               //    cityName:
//               //      reservation.customerData[0]
//               //        ?.Address?.[0]?.CityName?.[0] || "",
//               //    postalCode:
//               //      reservation.customerData[0]
//               //        ?.Address?.[0]?.PostalCode?.[0] || "",
//               //    countryName:
//               //      reservation.customerData[0]
//               //        ?.Address?.[0]?.CountryName?.[0] || ""
//               //  }
//             }
//           : {};

//         const booking = {
//           _id: reservation._id,
//           status: reservation.status,
//           reservationId:
//             reservation.reservationId?.[0] || null,
//           // unique: reservation.unique || null,
//           customerData:
//             reservation.customerData?.map((el) => ({
//               personName: el.PersonName,
//               telephone:
//                 el.Telephone?.[0]?.PhoneNumber[0] ||
//                 "",
//               email: el.Email?.[0]?._ || ""
//             })) || [],
//           totalAmount:
//             reservation.total?.[0]
//               ?.AmountAfterTax?.[0] || null,
//           currencyCode:
//             reservation.total?.[0]
//               ?.CurrencyCode?.[0] || null,
//           checkInDate:
//             reservation.roomStays?.[0]?.stayDetails
//               ?.TimeSpan?.[0]?.Start?.[0] || null,
//           checkOutDate:
//             reservation.roomStays?.[0]?.stayDetails
//               ?.TimeSpan?.[0]?.End?.[0] || null,
//           rooms:
//             reservation.roomStays?.map((roomStay) => ({
//               roomId: roomStay.roomId?.[0] || null,
//               roomType:
//                 roomStay.stayDetails?.RoomTypes?.[0]
//                   ?.RoomType?.[0]?.RoomType?.[0] ||
//                 null,
//               ratePlan:
//                 roomStay.stayDetails?.RatePlans?.[0]
//                   ?.RatePlan?.[0]?.RatePlanName?.[0] ||
//                 null,
//               rateAmount:
//                 roomStay.stayDetails?.RoomRates?.[0]
//                   ?.RoomRate?.[0]?.Rates?.[0]
//                   ?.Rate?.[0]?.Total?.[0]
//                   ?.AmountAfterTax?.[0] || null,
//               currency:
//                 roomStay.stayDetails?.RoomRates?.[0]
//                   ?.RoomRate?.[0]?.Rates?.[0]
//                   ?.Rate?.[0]?.Total?.[0]
//                   ?.CurrencyCode?.[0] || null
//             })) || []
//         };

//         // Extract hotel info from basicProperty

//         const resultobj = {
//           guestDetails: guestinfo,
//           bookingDetails: booking,
//           hotelDetails:
//             reservation.basicProperty.hotelDetails
//         };

//         resultARR.push(resultobj);
//       });
//     } else if (source.sourceName === "CloudBeds") {
//       // console.log("guestEmail", guestEmail);
//       if (!guestEmail) {
//         return res.status(404).send({
//           success: true,
//           message: "User Not found",
//           data: null
//         });
//       }

//       let guestAllReservations =
//         await CBreservation.aggregate([
//           {
//             $match: {
//               guestEmail: guestEmail.email
//             }
//           },
//           {
//             $addFields: {
//               statusPriority: {
//                 $cond: {
//                   if: {
//                     $eq: ["$status", "confirmed"]
//                   },
//                   then: 1,
//                   else: 2
//                 }
//               }
//             }
//           },
//           {
//             $sort: {
//               statusPriority: 1,
//               _id: 1 // This sorts by _id within the same status, optional
//             }
//           },
//           {
//             $project: {
//               statusPriority: 0
//             }
//           }
//         ]);
//       // console.log(
//       //   "guestAllReservations",
//       //   guestAllReservations
//       // );
//       // Check if reservations exist
//       if (guestAllReservations.length === 0) {
//         return res.status(404).send({
//           success: true,
//           message:
//             "No reservations found for the provided email.",
//           data: null
//         });
//       }

//       // Step 4: Fetch hotel details using the extracted HotelCodes
//       let hotelDetails = await cloudBedsHotel
//         .find({
//           propertyId:
//             guestAllReservations[0].propertyID
//         })
//         .select("-ttLockData");

//       // console.log("hotelDetails", hotelDetails);

//       // Convert hotelDetails to a dictionary for quick lookup
//       const hotelDetailsDict = hotelDetails.reduce(
//         (acc, hotel) => {
//           acc[hotel.propertyId] = hotel;
//           return acc;
//         },
//         {}
//       );
//       // console.log(
//       //   "hotelDetailsDict",
//       //   hotelDetailsDict
//       // );

//       // Step 5: Map the reservations to include the hotelDetails within basicProperty
//       // const result = guestAllReservations.map(
//       //   (reservation) => {
//       //     const hotelDetail =
//       //       hotelDetailsDict[reservation.propertyID] ||
//       //       null;
//       //     return {
//       //       ...reservation,
//       //       basicProperty: {
//       //         ...reservation.basicProperty,
//       //         hotelDetails: hotelDetail
//       //       }
//       //     };
//       //   }
//       // );
//       // --------
//       const result = guestAllReservations.map(
//         (reservation) => {
//           const hotelDetail =
//             hotelDetailsDict[reservation.propertyID] ||
//             null;
//           // console.log("hotelDetailll", hotelDetail);
//           return {
//             guestDetails: {
//               vipIndicator: "false", // You can set this value based on your logic
//               personName: {
//                 givenName:
//                   reservation.guestName.split(" ")[0],
//                 surname:
//                   reservation.guestName.split(" ")[1]
//               },
//               telephone: reservation.guestPhone || "",
//               email: reservation.guestEmail
//             },
//             bookingDetails: {
//               _id: reservation._id,
//               status: reservation.status,
//               reservationId: reservation.reservationID,
//               customerData: [
//                 {
//                   personName: [
//                     {
//                       GivenName: [
//                         reservation.guestName.split(
//                           " "
//                         )[0]
//                       ],
//                       Surname: [
//                         reservation.guestName.split(
//                           " "
//                         )[1]
//                       ]
//                     }
//                   ],
//                   telephone:
//                     reservation.guestPhone || "",
//                   email: reservation.guestEmail
//                 }
//               ],
//               totalAmount:
//                 reservation.total.toString(),
//               // currencyCode: "GBP", // Modify based on the correct currency code
//               checkInDate:
//                 reservation.timeSpan.checkInDate,
//               checkOutDate:
//                 reservation.timeSpan.checkOutDate,
//               rooms: reservation.assigned.map(
//                 (room) => ({
//                   roomId: room.roomTypeName,
//                   roomType: room.roomTypeNameShort,
//                   roomName: room.roomName,
//                   ratePlan: room.dailyRates[0].rate,
//                   rateAmount: room.roomTotal,
//                   currency: room.currency
//                 })
//               )
//             },
//             hotelDetails: {
//               propertyLocation: {
//                 street:
//                   hotelDetail?.propertyAddress
//                     .propertyAddress1 ||
//                   hotelDetail?.propertyAddress
//                     .propertyAddress2,
//                 city:
//                   hotelDetail?.propertyAddress
//                     .propertyCity || "",
//                 state:
//                   hotelDetail?.propertyAddress
//                     .propertyState || "",
//                 country:
//                   hotelDetail?.propertyAddress
//                     .propertyCountry || ""
//               },
//               phoneNo: {
//                 // countryCode: "+44", // Replace with dynamic data if needed
//                 number:
//                   hotelDetail?.propertyPhone || ""
//               },
//               // ttLockData: {
//               //   ttLockAccessToken:
//               //     hotelDetail?.ttLockData
//               //       ?.ttLockAccessToken || "",
//               //   ttLockMD5Password:
//               //     hotelDetail?.ttLockData
//               //       ?.ttLockMD5Password || "",
//               //   ttLockPassword:
//               //     hotelDetail?.ttLockData
//               //       ?.ttLockPassword || "",
//               //   ttLockRefreshToken:
//               //     hotelDetail?.ttLockData
//               //       ?.ttLockRefreshToken || "",
//               //   ttLockUserName:
//               //     hotelDetail?.ttLockData
//               //       ?.ttLockUserName || ""
//               // },
//               _id: hotelDetail?._id,
//               status: hotelDetail?.status,
//               isDeleted: hotelDetail?.isDeleted,
//               propertyName: hotelDetail?.propertyName,
//               propertyId: hotelDetail?.propertyId,
//               propertyType: hotelDetail?.propertyType,
//               emailId: hotelDetail?.emailId,
//               statusBar: hotelDetail?.statusBar,
//               propertyImage:
//                 hotelDetail?.propertyImage[0].image ||
//                 hotelDetail?.propertyImage[0].thumb,
//               // defaultTimeZone: "GMT +01:00 London", // Adjust based on your data
//               defaultCheckInTime:
//                 hotelDetail?.propertyPolicy
//                   ?.propertyCheckInTime || "",
//               defaultCheckOutTime:
//                 hotelDetail?.propertyPolicy
//                   ?.propertyCheckOutTime || "",
//               isFrontDoor:
//                 hotelDetail.isFrontDoor || false
//             }
//           };
//         }
//       );
//       //changes here
//       // console.log("result", result);
//       // resultARR.push(result);

//       const today = new Date(); // Get the current date (today)
//       today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero for accurate comparison

//       // Filter reservations with checkInDate today or in the future
//       const filteredReservations = result.filter(
//         (reservation) => {
//           const checkOutDate = new Date(
//             reservation.bookingDetails.checkOutDate
//           ); // Convert check-in date to Date object
//           checkOutDate.setHours(0, 0, 0, 0); // Normalize time to compare only dates

//           // Include reservations whose check-in date is today or later
//           return checkOutDate >= today;
//         }
//       );

//       console.log(
//         "Filtered Reservations:",
//         filteredReservations
//       );

//       resultARR.push(filteredReservations);
//     }

//     const result = {
//       success: true,
//       message: "Records fetched sucess",
//       data: resultARR[0]
//     };

//     let encryptedData = encryptData(result);

//     return res.status(200).json(encryptedData);

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
//     // console.log("hello");
//     const { _id } = req.params;

//     let guestEmail = await User.findById(
//       req.user.id
//     ).select(
//       "guestTTLockCredentials.ttLockAccessToken email -_id"
//     );
//     // console.log("guestEmail", guestEmail);
//     let source = await Source.findById(
//       req.user.permissions.source
//     ).select("sourceName");
//     let resultObj = {};

//     let guestReservation;

//     if (source.sourceName === "CloudBeds") {
//       guestReservation = await CBreservation.findById(
//         _id
//       );
//       // Check if reservations exist
//       if (!guestReservation) {
//         return res.status(404).send({
//           success: true,
//           message:
//             "No reservations found for the provided email.",
//           data: null
//         });
//       }

//       let hotelDetails = await cloudBedsHotel
//         .findOne({
//           propertyId: guestReservation.propertyID
//         })
//         .select("-ttLockData");
//       // console.log("hotelDetails", hotelDetails);
//       if (!hotelDetails) {
//         return res.status(404).send({
//           success: true,
//           message:
//             "No Hotel Found with this Hotel Code",
//           data: null
//         });
//       }
//       guestReservation = guestReservation.toObject();
//       guestReservation.basicProperty =
//         guestReservation.basicProperty || {};
//       guestReservation.basicProperty.hotelDetails =
//         hotelDetails;
//       guestReservation.ttLockAccessToken =
//         guestEmail.guestTTLockCredentials.ttLockAccessToken;
//       //   console.log(
//       //     "guestReservation",
//       //     guestReservation
//       // );
//       resultObj = {
//         guestDetails: {
//           vipIndicator: "false", // Assuming there's no VIP indicator in your data; adjust if needed
//           personName: {
//             givenName:
//               guestReservation.guestName.split(" ")[0],
//             surname:
//               guestReservation.guestName.split(" ")[1]
//           },
//           telephone: guestReservation.guestPhone,
//           email: guestReservation.guestEmail,
//           ttLockAccessToken:
//             guestReservation.ttLockAccessToken
//         },
//         bookingDetails: {
//           _id: guestReservation._id.toString(),
//           status: guestReservation.status,
//           reservationId:
//             guestReservation.reservationID,
//           totalAmount:
//             guestReservation.total.toString(),
//           // currencyCode: "GBP", // Assuming GBP as currency, adjust if needed
//           services: [],
//           customerData: [
//             {
//               personName: [
//                 {
//                   GivenName: [
//                     guestReservation.guestName.split(
//                       " "
//                     )[0]
//                   ],
//                   Surname: [
//                     guestReservation.guestName.split(
//                       " "
//                     )[1]
//                   ]
//                 }
//               ],
//               telephone: guestReservation.guestPhone,
//               email: guestReservation.guestEmail
//             }
//           ],
//           checkInDate:
//             guestReservation.timeSpan.checkInDate,
//           checkOutDate:
//             guestReservation.timeSpan.checkOutDate,
//           rooms: guestReservation.assigned.map(
//             (room) => ({
//               roomId: room.roomTypeName,
//               roomType: room.roomTypeNameShort,
//               ratePlan: room.dailyRates[0].rate,
//               rateAmount: room.roomTotal,
//               roomName: room.roomName,
//               currency: room.currency || ""
//               // currency: "GBP" // Assuming GBP as currency, adjust if needed
//             })
//           ),
//           doorPasscodes:
//             guestReservation.passcodeDetails
//         },
//         hotelDetails: {
//           propertyLocation: {
//             street:
//               hotelDetails.propertyAddress
//                 .propertyAddress1,
//             city: hotelDetails.propertyAddress
//               .propertyCity,
//             state:
//               hotelDetails.propertyAddress
//                 .propertyState,
//             country:
//               hotelDetails.propertyAddress
//                 .propertyCountry
//           },
//           phoneNo: {
//             countryCode:
//               hotelDetails.propertyPhone.split(
//                 " "
//               )[0] || "",
//             number:
//               hotelDetails.propertyPhone.split(
//                 " "
//               )[1] || ""
//           },
//           _id: hotelDetails._id.toString(),
//           status: hotelDetails.status,
//           isDeleted: hotelDetails.isDeleted,
//           propertyName: hotelDetails.propertyName,
//           propertyId: hotelDetails.propertyId,
//           propertyType: hotelDetails.propertyType,
//           emailId: hotelDetails.propertyEmail,
//           statusBar: hotelDetails.statusBar,
//           PMSsource: hotelDetails.PMSsource.toString(),
//           propertyImage:
//             hotelDetails.propertyImage[0]?.image ||
//             hotelDetails.propertyImage[0]?.thumb,
//           // defaultTimeZone: "GMT +01:00 London", // This might need to be dynamically set if available
//           defaultCheckInTime:
//             hotelDetails.propertyPolicy
//               .propertyCheckInTime,
//           defaultCheckOutTime:
//             hotelDetails.propertyPolicy
//               .propertyCheckOutTime,
//           isFrontDoor: hotelDetails.isFrontDoor,
//           createdAt: hotelDetails.createdAt,
//           updatedAt: hotelDetails.updatedAt
//         }
//       };
//     } else if (source.sourceName === "Siteminder") {
//       guestReservation = await SMXResrvation.findById(
//         _id
//       );

//       // Check if reservations exist
//       if (!guestReservation) {
//         return res.status(404).send({
//           success: true,
//           message:
//             "No reservations found for the provided email.",
//           data: null
//         });
//       }
//       // console.log(
//       //   "guestReservation",
//       //   guestReservation
//       // );
//       let hotelDetails = await siteminderProperty
//         .findOne({
//           propertyId:
//             guestReservation.basicProperty[0].HotelCode
//         })
//         .select("-ttLockData");

//       if (!hotelDetails) {
//         return res.status(404).send({
//           success: true,
//           message:
//             "No Hotel Found with this Hotel Code",
//           data: null
//         });
//       }
//       // guestReservation = guestReservation.toObject();
//       // guestReservation.basicProperty.hotelDetails =
//       //   hotelDetails;
//       // guestReservation.ttLockAccessToken =
//       //   guestEmail.guestTTLockCredentials.ttLockAccessToken;
//       // console.log(
//       //   "guestReservation",
//       //   guestReservation
//       // );

//       // Extract guest details
//       const guestData =
//         guestReservation.customerData?.[0] || {};
//       const personName =
//         guestData.PersonName?.[0] || {};

//       const guestDetails = {
//         vipIndicator:
//           guestData.VIP_Indicator?.[0] || "false",
//         personName: {
//           givenName: personName.GivenName?.[0] || "",
//           surname: personName.Surname?.[0] || ""
//         },
//         telephone:
//           guestData.Telephone?.[0]?.PhoneNumber?.[0] ||
//           "",
//         email: guestData.Email?.[0]?._ || "",
//         ttLockAccessToken:
//           guestEmail.guestTTLockCredentials
//             .ttLockAccessToken
//       };

//       // Extract booking details
//       const bookingDetails = {
//         _id: guestReservation._id,
//         status: guestReservation.status,
//         reservationId:
//           guestReservation.reservationId?.[0] || "",
//         totalAmount:
//           guestReservation.total?.[0]
//             ?.AmountAfterTax?.[0] || "",
//         currencyCode:
//           guestReservation.total?.[0]
//             ?.CurrencyCode?.[0] || "",
//         services: guestReservation.services,
//         customerData:
//           guestReservation.customerData?.map((el) => ({
//             personName: el.PersonName,
//             telephone:
//               el.Telephone?.[0]?.PhoneNumber[0] || "",
//             email: el.Email?.[0]?._ || ""
//           })) || [],
//         checkInDate:
//           guestReservation.roomStays?.[0]?.stayDetails
//             ?.RoomRates?.[0]?.RoomRate?.[0]
//             ?.EffectiveDate?.[0] || "",
//         checkOutDate:
//           guestReservation.roomStays?.[0]?.stayDetails
//             ?.RoomRates?.[0]?.RoomRate?.[0]
//             ?.ExpireDate?.[0] || "",
//         rooms:
//           guestReservation.roomStays?.map((room) => ({
//             roomId: room.roomId?.[0] || "",
//             roomType:
//               room.stayDetails?.RoomTypes?.[0]
//                 ?.RoomType?.[0]?.RoomType?.[0] || "",
//             ratePlan:
//               room.stayDetails?.RatePlans?.[0]
//                 ?.RatePlan?.[0]?.RatePlanName?.[0] ||
//               "",
//             rateAmount:
//               room.stayDetails?.RoomRates?.[0]
//                 ?.RoomRate?.[0]?.Rates?.[0]?.Rate?.[0]
//                 ?.Base?.[0]?.AmountAfterTax?.[0] || "",
//             currency:
//               room.stayDetails?.RoomRates?.[0]
//                 ?.RoomRate?.[0]?.Rates?.[0]?.Rate?.[0]
//                 ?.Base?.[0]?.CurrencyCode?.[0] || ""
//           })) || [],
//         doorPasscodes: guestReservation.passcodeDetails
//       };

//       // Prepare hotel details
//       const propertyLocation = {
//         street:
//           hotelDetails.propertyLocation?.street ||
//           "Unknown Street",
//         city:
//           hotelDetails.propertyLocation?.city ||
//           "Unknown City",
//         state:
//           hotelDetails.propertyLocation?.state ||
//           "Unknown State",
//         country:
//           hotelDetails.propertyLocation?.country ||
//           "Unknown Country"
//       };

//       const phoneNo = {
//         countryCode:
//           hotelDetails.phoneNo?.countryCode || "+91",
//         number:
//           hotelDetails.phoneNo?.number || "0000000000"
//       };
//       // console.log("hoteldet", hotelDetails);
//       const hotelInfo = {
//         propertyLocation,
//         phoneNo,
//         _id: hotelDetails._id,
//         status: hotelDetails.status,
//         isDeleted: hotelDetails.isDeleted,
//         propertyName: hotelDetails.propertyName,
//         propertyId: hotelDetails.propertyId,
//         propertyType: hotelDetails.propertyType,
//         emailId: hotelDetails.emailId,
//         statusBar: hotelDetails.statusBar,
//         PMSsource: hotelDetails.PMSsource,
//         propertyPublisherName:
//           hotelDetails.propertyPublisherName,
//         propertyImage: hotelDetails.PropertyImage,
//         defaultTimeZone: hotelDetails.defaultTimeZone,
//         defaultCheckInTime:
//           hotelDetails.defaultCheckInTime,
//         defaultCheckOutTime:
//           hotelDetails.defaultCheckOutTime,
//         createdAt: hotelDetails.createdAt,
//         updatedAt: hotelDetails.updatedAt,
//         isFrontDoor: hotelDetails.isFrontDoor
//       };

//       resultObj.guestDetails = guestDetails;
//       resultObj.bookingDetails = bookingDetails;
//       resultObj.hotelDetails = hotelInfo;
//     }

//     const result = {
//       success: true,
//       message: "Records fetched sucess",
//       data: [resultObj]
//     };

//     let encryptedData = encryptData(result);

//     return res.status(200).json(encryptedData);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Internal Server Error",
//       data: JSON.stringify(error)
//     });
//   }
// }

// async function keySharing(req, res) {
//   try {
//     const { name, email, room, reservationId, propertyId } =
//       req.body;
//     let source = await Source.findById(
//       req.user.permissions.source
//     ).select("sourceName");
//     let ttLockUsername,
//       passcode,
//       ttLockMD5,
//       ttLockpass,
//       ttLockpasscodeExpiry,
//       ttLockaccessToken,
//       ttLockrefreshToken,
//       timeSpans;
//     if (source.sourceName === "Siteminder") {
//       let propertyAccessToken =
//         await siteminderProperty
//           .findOne({ propertyId: propertyId })
//           .select("ttLockData.ttLockAccessToken -_id");
//       let reservationDetails = await SMXResrvation.findOne({ reservationId: reservationId }).select("roomStays.stayDetails.TimeSpan");
//       reservationDetails = reservationDetails.toObject()
//        let frontDoorCheck = await siteminderProperty
//          .findOne({ propertyId: propertyId })
//          .select("isFrontDoor -_id");
//        if (frontDoorCheck.isFrontDoor) {
//          room.push("2024");
//        }
//       let timeSpans = {
//         checkInDate:
//           reservationDetails.roomStays[0].stayDetails
//             .TimeSpan[0].Start[0],
//         checkOutDate:
//           reservationDetails.roomStays[0].stayDetails
//             .TimeSpan[0].End[0]
//       };
//       // console.log("timeSpans", timeSpans);
//       let reservation_for_tt = {
//         guestName:name,
//         roomIds: room,
//         propertyId: propertyId,
//         reservationID: reservationId,
//         timeSpan: timeSpans,
//         source: "Siteminder",
//         propertyAccessToken
//       };
//       let passcodeCreation =
//         await ttlockService.createPasskey(
//           reservation_for_tt,
//           req,
//           res
//         );
//       c
//       if (passcodeCreation) {
//         ttLockUsername = passcodeCreation.username;
//         ttLockMD5 = passcodeCreation.md5;
//         ttLockpass = passcodeCreation.password;
//         ttLockpasscodeExpiry =
//           passcodeCreation.passcodeExpiry;
//         ttLockaccessToken =
//           passcodeCreation.accessToken;
//         ttLockrefreshToken =
//           passcodeCreation.refreshToken;
//         passcode = passcodeCreation.passcodeDetails;
//         let hotelDetails = await siteminderProperty
//           .findOne({
//             propertyId: propertyId
//           })
//           .select(
//             "propertyName defaultCheckInTime defaultCheckOutTime emailId -_id"
//           );
//         hotelDetails = hotelDetails.toObject();
//         // console.log("hhhh", req.user)
//           const userData = {
//             name: reservation_for_tt.guestName,
//             ttLockUsername: ttLockUsername,
//             ttLockMD5,
//             ttLockpass,
//             ttLockpasscodeExpiry,
//             ttLockaccessToken,
//             ttLockrefreshToken,
//             email: email,
//             // contact: phone ? phone : null,
//             passcodeData: passcode,
//             source: "Siteminder",
//             role: "guest",
//             timeSpan: timeSpans,
//             hotelDetail: {
//               propertyName: hotelDetails.propertyName,
//               defaultCheckInTime:
//                 hotelDetails.defaultCheckInTime,
//               defaultCheckOutTime:
//                 hotelDetails.defaultCheckOutTime,
//               propertyEmail: hotelDetails.emailId
//             },
//             emailType: "key_sharing",
//             senderName: (
//               await User.findById({ _id: req.user.id })
//                 .select("name -_id")
//                 .lean()
//             )?.name
//           };
//         console.log("userData", userData);
//         const createUserResponse =
//           await createUser({
//             body: userData
//           });
//         const { flag, flag2 } = createUserResponse;

//         if (flag && flag2) {
//           console.log(
//             "User created and mail sent successfully"
//           );
//         } else if (flag && !flag2) {
//           console.log("User created without mail");
//         } else {
//           console.log(
//             "User creation failed or something went wrong"
//           );
//         }
//         return res.status(200).send({
//           success: true,
//           message: "Key Shared Successfully"
//         });
//       }
//     } else if (source.sourceName === "CloudBeds") {
//        let propertyAccessToken = await cloudBedsHotel
//          .findOne({ propertyId: propertyId })
//          .select("ttLockData.ttLockAccessToken -_id");
//        let reservationDetails =
//          await CBreservation.findOne({
//            reservationID: reservationId
//          }).select("timeSpan");
//          console.log(
//            "reservationDetails",
//            reservationDetails
//          );
//        reservationDetails =
//         reservationDetails.toObject();
//        let frontDoorCheck = await cloudBedsHotel
//          .findOne({ propertyId: propertyId })
//          .select("isFrontDoor -_id");
//        if (frontDoorCheck.isFrontDoor) {
//          room.push("2024");
//        }
//       let reservation_for_tt = {
//         guestName: name,
//         roomIds: room,
//         propertyId: propertyId,
//         reservationID: reservationId,
//         timeSpan: reservationDetails.timeSpan,
//         source: "CloudBeds",
//         propertyAccessToken
//       };
//        const createPasskey =
//          await ttlockService.createPasskey(
//            reservation_for_tt
//         );
//       ttLockUsername = createPasskey.username;
//       ttLockMD5 = createPasskey.md5;
//       ttLockpass = createPasskey.password;
//       ttLockpasscodeExpiry =
//         createPasskey.passcodeExpiry;
//       ttLockaccessToken = createPasskey.accessToken;
//       ttLockrefreshToken = createPasskey.refreshToken;
//       passcode = createPasskey.passcodeDetails;
//       let hotelDetails = await cloudBedsHotel
//         .findOne({ propertyId: propertyId })
//         .select(
//           "propertyName defaultCheckInTime defaultCheckOutTime propertyEmail -_id"
//         );
//       hotelDetails = hotelDetails.toObject();
//       // console.log("hhhh", req.user);
//        const userData = {
//          name: name,
//          ttLockUsername: ttLockUsername,
//          ttLockMD5,
//          ttLockpass,
//          ttLockpasscodeExpiry,
//          ttLockaccessToken,
//          ttLockrefreshToken,
//          email: email,
//          //  contact: reservationCreateObj.guestPhone,
//          passcodeData: passcode,
//          source: "CloudBeds",
//          role: "guest",
//          timeSpan: reservationDetails.timeSpan,
//          hotelDetail: {
//            propertyName: hotelDetails.propertyName,
//            defaultCheckInTime:
//              hotelDetails.defaultCheckInTime,
//            defaultCheckOutTime:
//              hotelDetails.defaultCheckOutTime,
//            propertyEmail: hotelDetails.propertyEmail
//          },
//          emailType: "key_sharing",
//          senderName: (
//            await User.findById({_id:req.user.id})
//              .select("name -_id")
//              .lean()
//          )?.name
//        };
//       // console.log("userDataaaaa", userData);
//        const createUserResponse =
//          await createUser({
//            body: userData
//          });

//        const { flag, flag2 } = createUserResponse;

//        if (flag && flag2) {
//          console.log(
//            "User created and mail sent successfully"
//          );
//        } else if (flag && !flag2) {
//          console.log("User created without mail");
//        } else {
//          console.log(
//            "User creation failed or something went wrong"
//          );
//       }
//       return res.status(200).send({
//         success: true,
//         message: "Key Shared Successfully"
//       });
//     }
//   } catch (error) {
//     logger.info("ERR", error);
//     return res.status(500).send({
//       success: false,
//       message: "Internal Server Error",
//       data: JSON.stringify(error)
//     });
//   }
// }

// module.exports = {
//   verifyOtp,
//   login,
//   createUser,
//   getPasscodeDetails,
//   forgotPassword,
//   postItem,
//   updatePassword,
//   generatePasscode,
//   userAndHotelReservation,
//   userAndHotelReservationById,
//   keySharing
// };

// ---------------------------------------------------------------------------------------

const mongoose = require("mongoose");
const User = require("../models/userModel");
const {
  sendPasscodeEmail,
} = require("../services/communicationManagement/emailService"); // Import sendPasscodeSMS
const sendPasscodeSMS = require("../services/communicationManagement/smsService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Role = require("../models/roleModel");
const Source = require("../models/sourceModel");
const SMXResrvation = require("../src/siteminder/model/reservationModel");
const CBreservation = require("../src/cloudbeds/model/reservationModelCB");
const siteminderProperty = require("../src/siteminder/model/SMXHotelModel");
const cloudBedsHotel = require("../src/cloudbeds/model/cloudBedsHotelModel");
const authCodeModel = require("../src/cloudbeds/model/authenticationModelCB");
const {
  renewAccessToken,
  checkAccessToken,
} = require("../src/cloudbeds/controller/authenticationControllerCB");
const axios = require("axios");
// const {
//   encryptData,
//   decryptData
// } = require("../utils/encryptionDecryption");
const logger = require("../logger/winstonLogger");
const ttlockService = require("../services/ttLock/ttLockService");
require("dotenv").config();

// ------------------------------------------------------------------------------------

//old
// async function createUser(req, res) {
//   try {
//     const {
//       name,
//       email,
//       contact,
//       ttLockUsername,
//       ttLockMD5,
//       ttLockpass,
//       ttLockpasscodeExpiry,
//       ttLockaccessToken,
//       ttLockrefreshToken,
//       passcodeData,
//       source,
//       role,
//       timeSpan,
//       hotelDetail,
//       emailType,
//       senderName,
//     } = req.body;

//     // Check if email or contact is provided
//     if (!email) {
//       return res.status(400).json({
//         message: "email is required.",
//       });
//     }
//     // ---------
//     const passcode = Math.random().toString(36).slice(-8);

//     let roleId = await Role.findOne({
//       name: role,
//     }).select("_id");
//     let sourceId = await Source.findOne({
//       sourceName: source,
//     }).select("_id");
//     // console.log(
//     //   "roleId",
//     //   roleId,
//     //   "sourceId",
//     //   sourceId
//     // );

//     // Check if email or contact already exists
//     if (email) {
//       const existingEmailUser = await User.findOne({
//         email,
//       });
//       if (existingEmailUser) {
//         // return res
//         //   .status(400)
//         //   .json({ message: "Email already in use." });
//         // -----------
//         // await User.deleteOne({ email });
//         // console.log(
//         //   "User with email already existed, so it was deleted."
//         // );
//         // ------------
//         let updatedUser = await User.findOneAndUpdate(
//           { email },
//           {
//             name: name || null,
//             guestTTLockCredentials: {
//               ttLockUsername: ttLockUsername || null,
//               ttLockMD5Password: ttLockMD5 || null,
//               ttLockAccessToken: ttLockaccessToken || null, // updated consistent variable name
//               ttLockRefreshToken: ttLockrefreshToken || null,
//               ttLockPassword: ttLockpass || null,
//               doorPasscode: passcodeData || null,
//               passcodeExpiry: ttLockpasscodeExpiry || null,
//             },
//             contact: contact || null,
//             // password: passcode || null,
//             permissions: {
//               roles: roleId?._id, // ensure safe access in case roleId or sourceId is undefined
//               source: sourceId?._id,
//             },
//           },
//           { new: true } // optional: to return the updated user
//         );

//         let flag = false;
//         let flag2 = false;
//         console.log("User with email already existed, so it was updated.");
//         if (updatedUser) {
//           const { checkInDate, checkOutDate } = timeSpan;
//           const {
//             propertyName,
//             defaultCheckInTime,
//             defaultCheckOutTime,
//             propertyEmail,
//           } = hotelDetail;
//           let bookingdetail = {
//             firstName: name,
//             checkInDate: checkInDate,
//             checkOutDate: checkOutDate,
//             propertyName,
//             defaultCheckInTime,
//             defaultCheckOutTime,
//             propertyEmail,
//           };
//           console.log("bookingdetail", bookingdetail);

//           //add scheduler here if required
//           const emailResult = await sendPasscodeEmail(
//             email,
//             // passcode, //before this is going passcodeData for room sharing pascodes
//             existingEmailUser.password,
//             contact,
//             emailType || "account_creation",
//             bookingdetail,
//             senderName
//           );
//           if (contact) {
//             console.log("smspasscode1", passcode);
//             const smsResult = await sendPasscodeSMS(
//               contact,
//               name,
//               propertyName,
//               email,
//               existingEmailUser.password
//             );
//           }

//           if (!emailResult.success) {
//             return res.status(500).send({
//               message: "User created but failed to send passcode email",
//             });
//           }

//           if (emailResult.success) {
//             if (req.url === "/createUser") {
//               return res.status(201).send({
//                 message: "User created successfully",
//                 userId: user._id,
//               });
//             }
//             // return true;
//             flag = true;
//             flag2 = true;
//             return { flag, flag2 };
//           }
//         }
//       } else {
//         const user = new User({
//           name: name || null,
//           guestTTLockCredentials: {
//             ttLockUsername: ttLockUsername || null,
//             ttLockMD5Password: ttLockMD5 || null,
//             ttLockAccessToken: ttLockaccessToken || null,
//             ttLockRefreshToken: ttLockrefreshToken || null,
//             ttLockPassword: ttLockpass || null,
//             doorPasscode: passcodeData || null,
//             passcodeExpiry: ttLockpasscodeExpiry || null,
//           },
//           email: email || null,
//           contact: contact || null,
//           password: passcode || null,
//           permissions: {
//             roles: roleId._id,
//             source: sourceId._id,
//           },
//         });
//         let flag = false;
//         let flag2 = false;
//         // Save the user to the database
//         let saved_user = await user.save();
//         console.log("saved_user", saved_user);
//         if (saved_user._id) {
//           if (req.url === "/createUser") {
//             return res.status(201).send({
//               message: "User created successfully without email",
//               userId: user._id,
//             });
//           }
//           //   return true;
//           flag = true;
//         }
//         if (email) {
//           // Send passcode email
//           const { checkInDate, checkOutDate } = timeSpan;
//           const {
//             propertyName,
//             defaultCheckInTime,
//             defaultCheckOutTime,
//             propertyEmail,
//           } = hotelDetail;
//           let bookingdetail = {
//             firstName: name,
//             checkInDate: checkInDate,
//             checkOutDate: checkOutDate,
//             propertyName,
//             defaultCheckInTime,
//             defaultCheckOutTime,
//             propertyEmail,
//           };
//           console.log("bookingdetail", bookingdetail);

//           //add scheduler here if required
//           const emailResult = await sendPasscodeEmail(
//             user.email,
//             passcode, //before this is going passcodeData for room sharing pascodes
//             user.contact,
//             emailType || "account_creation",
//             bookingdetail,
//             senderName
//           );
//           if (contact) {
//             const smsResult = await sendPasscodeSMS(
//               contact,
//               name,
//               propertyName,
//               email,
//               passcode
//             );
//           }

//           if (!emailResult.success) {
//             return res.status(500).send({
//               message: "User created but failed to send passcode email",
//             });
//           }

//           if (emailResult.success) {
//             if (req.url === "/createUser") {
//               return res.status(201).send({
//                 message: "User created successfully",
//                 userId: user._id,
//               });
//             }
//             // return true;
//             flag2 = true;
//             return { flag, flag2 };
//           }
//         }
//       }
//     }

//     if (contact) {
//       // const existingContactUser = await User.findOne({
//       //   contact
//       // });
//       // if (existingContactUser) {
//       //   // return res.status(400).json({
//       //   //   message: "Contact number already in use."
//       //   // });
//       //   console.log("contact exist");
//       // }
//     }
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).json({
//       message: "Error creating user",
//       error: error.message || error,
//     });
//   }
// }

// ---------------------------------------------------------------------------------

// Function to generate a random 4-digit numeric password
function generateRandomDigitPassword(length) {
  const digits = "0123456789";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return pass;
}

// Modified createUser function
async function createUser(req, res) {
  try {
    const {
      name,
      email,
      contact,
      ttLockUsername,
      ttLockMD5,
      ttLockpass,
      ttLockpasscodeExpiry,
      ttLockaccessToken,
      ttLockrefreshToken,
      passcodeData,
      source,
      role,
      timeSpan,
      hotelDetail,
      emailType,
      senderName,
    } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({
        message: "email is required.",
      });
    }

    // Generate a random 4-digit numeric password
    const passcode = generateRandomDigitPassword(4);

    let roleId = await Role.findOne({
      name: role,
    }).select("_id");
    let sourceId = await Source.findOne({
      sourceName: source,
    }).select("_id");

    // Check if email already exists
    const existingEmailUser = await User.findOne({
      email,
    });

    if (existingEmailUser) {
      // Update the existing user
      let updatedUser = await User.findOneAndUpdate(
        { email },
        {
          name: name || null,
          guestTTLockCredentials: {
            ttLockUsername: ttLockUsername || null,
            ttLockMD5Password: ttLockMD5 || null,
            ttLockAccessToken: ttLockaccessToken || null,
            ttLockRefreshToken: ttLockrefreshToken || null,
            ttLockPassword: ttLockpass || null,
            doorPasscode: passcodeData || null,
            passcodeExpiry: ttLockpasscodeExpiry || null,
          },
          contact: contact || null,
          password: passcode,
          permissions: {
            roles: roleId?._id,
            source: sourceId?._id,
          },
        },
        { new: true } // To return the updated user
      );

      let flag = false;
      let flag2 = false;
      console.log("User with email already existed, so it was updated.");
      if (updatedUser) {
        const { checkInDate, checkOutDate } = timeSpan;
        const {
          propertyName,
          defaultCheckInTime,
          defaultCheckOutTime,
          propertyEmail,
        } = hotelDetail;
        let bookingdetail = {
          firstName: name,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          propertyName,
          defaultCheckInTime,
          defaultCheckOutTime,
          propertyEmail,
        };
        console.log("bookingdetail", bookingdetail);

        // Send passcode email
        const emailResult = await sendPasscodeEmail(
          email,
          passcode,
          contact,
          emailType || "account_creation",
          bookingdetail,
          senderName
        );

        if (contact) {
          console.log("smspasscode1", passcode);
          const smsResult = await sendPasscodeSMS(
            contact,
            name,
            propertyName,
            email,
            passcode
          );
        }

        if (!emailResult.success) {
          return res.status(500).send({
            message: "User updated but failed to send passcode email",
          });
        }

        if (emailResult.success) {
          if (req.url === "/createUser") {
            return res.status(201).send({
              message: "User updated successfully",
              userId: updatedUser._id,
            });
          }
          flag = true;
          flag2 = true;
          return { flag, flag2 };
        }
      }
    } else {
      // Create a new user
      const user = new User({
        name: name || null,
        guestTTLockCredentials: {
          ttLockUsername: ttLockUsername || null,
          ttLockMD5Password: ttLockMD5 || null,
          ttLockAccessToken: ttLockaccessToken || null,
          ttLockRefreshToken: ttLockrefreshToken || null,
          ttLockPassword: ttLockpass || null,
          doorPasscode: passcodeData || null,
          passcodeExpiry: ttLockpasscodeExpiry || null,
        },
        email: email || null,
        contact: contact || null,
        password: passcode,
        permissions: {
          roles: roleId._id,
          source: sourceId._id,
        },
      });
      let flag = false;
      let flag2 = false;
      // Save the user to the database
      let saved_user = await user.save();
      console.log("saved_user", saved_user);
      if (saved_user._id) {
        if (req.url === "/createUser") {
          return res.status(201).send({
            message: "User created successfully",
            userId: user._id,
          });
        }
        flag = true;
      }
      if (email) {
        const { checkInDate, checkOutDate } = timeSpan;
        const {
          propertyName,
          defaultCheckInTime,
          defaultCheckOutTime,
          propertyEmail,
        } = hotelDetail;
        let bookingdetail = {
          firstName: name,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          propertyName,
          defaultCheckInTime,
          defaultCheckOutTime,
          propertyEmail,
        };
        console.log("bookingdetail", bookingdetail);

        // Send passcode email
        const emailResult = await sendPasscodeEmail(
          email,
          passcode,
          contact,
          emailType || "account_creation",
          bookingdetail,
          senderName
        );

        if (contact) {
          const smsResult = await sendPasscodeSMS(
            contact,
            name,
            propertyName,
            email,
            passcode
          );
        }

        if (!emailResult.success) {
          return res.status(500).send({
            message: "User created but failed to send passcode email",
          });
        }

        if (emailResult.success) {
          if (req.url === "/createUser") {
            return res.status(201).send({
              message: "User created successfully",
              userId: user._id,
            });
          }
          flag2 = true;
          return { flag, flag2 };
        }
      }
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Error creating user",
      error: error.message || error,
    });
  }
}

// --------------------------------------------------------------------------------

// Modified login function (since passwords are not hashed)
// async function login(req, res) {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const isMatch = password === user.password;

//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       {
//         userId: user._id,
//         permissions: user.permissions,
//       },
//       process.env.GUEST_AUTH_KEY,
//       { expiresIn: "90d" }
//     );

//     const result = {
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//       sourceType: (
//         await Source.findById(user.permissions.source)
//           .select("sourceName -_id")
//           .lean()
//       ).sourceName,
//     };

//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(500).json({ message: "Error logging in", error });
//   }
// }

async function login(req, res) {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Identifier and password are required" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { contact: identifier }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = password === user.password;

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        userId: user._id,
        permissions: user.permissions,
      },
      process.env.GUEST_AUTH_KEY,
      { expiresIn: "90d" }
    );

    const result = {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        contact: user.contact,
      },
      sourceType: (
        await Source.findById(user.permissions.source)
          .select("sourceName -_id")
          .lean()
      ).sourceName,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
}

// -----------------------------------------------------------------------------------

async function generatePasscode(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // const passcode = Math.random().toString(36).slice(-8);
    const passcode = Math.floor(1000 + Math.random() * 9000).toString();
    user.passcode = await bcrypt.hash(passcode, 10);
    user.passcodeExpiry = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    const result = await sendPasscodeEmail(
      user.email,
      passcode,
      user.contact,
      "account_creation"
    );
    if (result.success) {
      res.status(200).json({
        message: "Passcode sent to the user's email",
      });
    } else {
      res.status(500).json({ message: "Failed to send passcode" });
    }
  } catch (error) {
    console.error("Error generating passcode:", error);
    res.status(500).json({
      message: "Error generating passcode",
      error,
    });
  }
}

async function updatePassword(req, res) {
  try {
    const { userId, passcode, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = passcode;
    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({
      message: "Error updating password",
      error,
    });
  }
}

//for upsales for only cloud beds dont nee din siteminder
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

    let propertyId = await CBreservation.findOne({
      reservationID: reservationID,
    }).select("propertyID -_id");

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
          Authorization: `Bearer ${newToken.access_token}`,
        },
      }
    );
    if (response.status === 200) {
      // let encryptedData = encryptData(
      //   response.data.data
      // );
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

async function getPasscodeDetails(req, res) {
  try {
    const { reservationId, room } = req.query;
    // console.log(req.query);

    if (!reservationId || !room) {
      return res.status(400).json({
        message: "reservationId and room are required",
      });
    }
    let source = await Source.findById(req.user.permissions.source).select(
      "sourceName"
    );

    const Preservation =
      source.sourceName === "Siteminder"
        ? await SMXResrvation.findById(reservationId).select("passcodeDetails")
        : source.sourceName === "CloudBeds"
        ? await CBreservation.findById(reservationId).select("passcodeDetails")
        : null;

    // console.log("Preservation", Preservation);

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
    // let encryptedData = encryptData({ passcode });
    return res.status(200).json({ passcode });
  } catch (error) {
    console.error("Error fetching passcode details:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

// async function login(req, res) {
//   try {
//     // const data = req.body.encryptedData;
//     // const decryptedData = decryptData(data);
//     // const { email, password } = decryptedData;
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });
//     // const isMatch = await User.findOne({password})

//     // const isMatch = await bcrypt.compare(
//     //   password,
//     //   user.password
//     // );
//     // if (!isMatch)
//     //   return res
//     //     .status(400)
//     //     .json({ message: "Invalid credentials" });
//     const isMatch = password === user.password ? true : false;
//     // const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       {
//         userId: user._id,
//         permissions: user.permissions,
//       },
//       process.env.GUEST_AUTH_KEY,
//       { expiresIn: "90d" }
//     );

//     /////////
//     const result = {
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//       sourceType: (
//         await Source.findById(user.permissions.source)
//           .select("sourceName -_id")
//           .lean()
//       ).sourceName,
//     };
//     // let encryptedData = encryptData(result);
//     // res.status(200).json(encryptedData);

//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(500).json({ message: "Error logging in", error });
//   }
// }

async function forgotPassword(req, res) {
  try {
    const { email, contact } = req.body;

    if (!email && !contact) {
      return res.status(400).json({
        message: "Email or contact number is required.",
      });
    }

    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (contact) {
      user = await User.findOne({ contact });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    user.passcode = await bcrypt.hash(otp, 10);
    user.passcodeExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    await user.save();

    if (email) {
      await sendPasscodeEmail(user.email, otp, user.contact, "forgot_password");
    } else if (contact) {
      await sendPasscodeSMS(user.contact, otp); // Implement this in a different file
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in forgot password process:", error);
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
}

async function verifyOtp(req, res) {
  try {
    const { email, contact, otp } = req.body;

    if (!email && !contact) {
      return res.status(400).json({
        message: "Email or contact number is required.",
      });
    }

    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (contact) {
      user = await User.findOne({ contact });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(otp, user.passcode);
    if (!isMatch || user.passcodeExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Generate a new passcode for login
    const newPasscode = Math.random().toString(36).slice(-8);
    user.passcode = await bcrypt.hash(newPasscode, 10);
    user.passcodeExpiry = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // Send the new passcode to the user
    if (email) {
      await sendPasscodeEmail(
        user.email,
        newPasscode,
        user.contact,
        "account_creation"
      );
    }
    if (contact) {
      await sendPasscodeSMS(user.contact, newPasscode); // Implement this in a different file
    }

    res.status(200).json({
      message: "New login passcode sent successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
}

//   try {
//     let guestEmail = await User.findById(req.user.id).select("email -_id");

//     let source = await Source.findById(req.user.permissions.source).select(
//       "sourceName"
//     );
//     const resultARR = [];

//     if (source.sourceName === "Siteminder") {
//       let guestAllReservations = await SMXResrvation.aggregate([
//         {
//           $match: {
//             "customerData.Email._": guestEmail.email,
//           },
//         },
//         {
//           $addFields: {
//             statusPriority: {
//               $cond: {
//                 if: { $eq: ["$status", "Reserved"] },
//                 then: 1,
//                 else: 2,
//               },
//             },
//           },
//         },
//         {
//           $sort: {
//             statusPriority: 1,
//             _id: 1, // This sorts by _id within the same status, optional
//           },
//         },
//         {
//           $project: {
//             statusPriority: 0,
//           },
//         },
//       ]);

//       // Check if reservations exist
//       if (guestAllReservations.length === 0) {
//         return res.status(404).send({
//           success: true,
//           message: "No reservations found for the provided email.",
//           data: null,
//         });
//       }
//       // console.log("reservation", guestAllReservations[0].basicProperty[0].HotelCode[0]);
//       // Step 3: Extract all unique HotelCodes from the reservations for different hotels
//       const hotelCodes = [
//         ...new Set(
//           guestAllReservations.flatMap((reservation) => {
//             return (reservation.basicProperty || []).flatMap((property) => {
//               return (property.HotelCode || []).map((code) => code);
//             });
//           })
//         ),
//       ];

//       // Step 4: Fetch hotel details using the extracted HotelCodes
//       let hotelDetails = await siteminderProperty
//         .find({
//           propertyId: { $in: hotelCodes },
//         })
//         .select("-ttLockData");

//       // Convert hotelDetails to a dictionary for quick lookup
//       const hotelDetailsDict = hotelDetails.reduce((acc, hotel) => {
//         acc[hotel.propertyId] = hotel;
//         return acc;
//       }, {});
//       // console.log(
//       //   "hotelDetailsDict",
//       //   hotelDetailsDict
//       // );

//       // Step 5: Map the reservations to include the hotelDetails within basicProperty
//       const result = guestAllReservations.map((reservation) => {
//         // Extract the HotelCode from the basicProperty array if it exists
//         const hotelCode = reservation.basicProperty?.find(
//           (property) => property.HotelCode
//         )?.HotelCode?.[0];

//         // Retrieve the hotel detail from hotelDetailsDict or default to null
//         const hotelDetail = hotelDetailsDict[hotelCode] || null;

//         return {
//           ...reservation,
//           basicProperty: {
//             ...(reservation.basicProperty || []),
//             hotelDetails: hotelDetail,
//           },
//         };
//       });
//       // Extracting guest info, booking info, and hotel info from result
//       result.forEach((reservation) => {
//         // console.log("reser", reservation);
//         const guestinfo = reservation.customerData?.[0]
//           ? {
//               vipIndicator:
//                 reservation.customerData[0]?.VIP_Indicator?.[0] || "false",
//               personName: {
//                 givenName:
//                   reservation.customerData[0]?.PersonName?.[0]
//                     ?.GivenName?.[0] || "",
//                 surname:
//                   reservation.customerData[0]?.PersonName?.[0]?.Surname?.[0] ||
//                   "",
//               },
//               telephone:
//                 reservation.customerData[0]?.Telephone?.[0]?.PhoneNumber?.[0] ||
//                 "",
//               email: reservation.customerData[0]?.Email?.[0]?._ || "",
//               //  address: {
//               //    addressLine:
//               //      reservation.customerData[0]
//               //        ?.Address?.[0]?.AddressLine || [],
//               //    cityName:
//               //      reservation.customerData[0]
//               //        ?.Address?.[0]?.CityName?.[0] || "",
//               //    postalCode:
//               //      reservation.customerData[0]
//               //        ?.Address?.[0]?.PostalCode?.[0] || "",
//               //    countryName:
//               //      reservation.customerData[0]
//               //        ?.Address?.[0]?.CountryName?.[0] || ""
//               //  }
//             }
//           : {};

//         const booking = {
//           _id: reservation._id,
//           status: reservation.status,
//           reservationId: reservation.reservationId?.[0] || null,
//           // unique: reservation.unique || null,
//           customerData:
//             reservation.customerData?.map((el) => ({
//               personName: el.PersonName,
//               telephone: el.Telephone?.[0]?.PhoneNumber[0] || "",
//               email: el.Email?.[0]?._ || "",
//             })) || [],
//           totalAmount: reservation.total?.[0]?.AmountAfterTax?.[0] || null,
//           currencyCode: reservation.total?.[0]?.CurrencyCode?.[0] || null,
//           checkInDate:
//             reservation.roomStays?.[0]?.stayDetails?.TimeSpan?.[0]
//               ?.Start?.[0] || null,
//           checkOutDate:
//             reservation.roomStays?.[0]?.stayDetails?.TimeSpan?.[0]?.End?.[0] ||
//             null,
//           rooms:
//             reservation.roomStays?.map((roomStay) => ({
//               roomId: roomStay.roomId?.[0] || null,
//               roomType:
//                 roomStay.stayDetails?.RoomTypes?.[0]?.RoomType?.[0]
//                   ?.RoomType?.[0] || null,
//               ratePlan:
//                 roomStay.stayDetails?.RatePlans?.[0]?.RatePlan?.[0]
//                   ?.RatePlanName?.[0] || null,
//               rateAmount:
//                 roomStay.stayDetails?.RoomRates?.[0]?.RoomRate?.[0]?.Rates?.[0]
//                   ?.Rate?.[0]?.Total?.[0]?.AmountAfterTax?.[0] || null,
//               currency:
//                 roomStay.stayDetails?.RoomRates?.[0]?.RoomRate?.[0]?.Rates?.[0]
//                   ?.Rate?.[0]?.Total?.[0]?.CurrencyCode?.[0] || null,
//             })) || [],
//         };

//         // Extract hotel info from basicProperty

//         const resultobj = {
//           guestDetails: guestinfo,
//           bookingDetails: booking,
//           hotelDetails: reservation.basicProperty.hotelDetails,
//         };

//         resultARR.push(resultobj);
//       });
//     } else if (source.sourceName === "CloudBeds") {
//       // console.log("guestEmail", guestEmail);
//       if (!guestEmail) {
//         return res.status(404).send({
//           success: true,
//           message: "User Not found",
//           data: null,
//         });
//       }

//       let guestAllReservations = await CBreservation.aggregate([
//         {
//           $match: {
//             guestEmail: guestEmail.email,
//           },
//         },
//         {
//           $addFields: {
//             statusPriority: {
//               $cond: {
//                 if: {
//                   $eq: ["$status", "confirmed"],
//                 },
//                 then: 1,
//                 else: 2,
//               },
//             },
//           },
//         },
//         {
//           $sort: {
//             statusPriority: 1,
//             _id: 1, // This sorts by _id within the same status, optional
//           },
//         },
//         {
//           $project: {
//             statusPriority: 0,
//           },
//         },
//       ]);
//       // console.log(
//       //   "guestAllReservations",
//       //   guestAllReservations
//       // );
//       // Check if reservations exist
//       if (guestAllReservations.length === 0) {
//         return res.status(404).send({
//           success: true,
//           message: "No reservations found for the provided email.",
//           data: null,
//         });
//       }

//       // Step 4: Fetch hotel details using the extracted HotelCodes
//       let hotelDetails = await cloudBedsHotel
//         .find({
//           propertyId: guestAllReservations[0].propertyID,
//         })
//         .select("-ttLockData");

//       // console.log("hotelDetails", hotelDetails);

//       // Convert hotelDetails to a dictionary for quick lookup
//       const hotelDetailsDict = hotelDetails.reduce((acc, hotel) => {
//         acc[hotel.propertyId] = hotel;
//         return acc;
//       }, {});
//       // console.log(
//       //   "hotelDetailsDict",
//       //   hotelDetailsDict
//       // );

//       const result = guestAllReservations.map((reservation) => {
//         const hotelDetail = hotelDetailsDict[reservation.propertyID] || null;
//         // console.log("hotelDetailll", hotelDetail);
//         return {
//           guestDetails: {
//             vipIndicator: "false", // You can set this value based on your logic
//             personName: {
//               givenName: reservation.guestName.split(" ")[0],
//               surname: reservation.guestName.split(" ")[1],
//             },
//             telephone: reservation.guestPhone || "",
//             email: reservation.guestEmail,
//           },
//           bookingDetails: {
//             _id: reservation._id,
//             status: reservation.status,
//             reservationId: reservation.reservationID,
//             customerData: [
//               {
//                 personName: [
//                   {
//                     GivenName: [reservation.guestName.split(" ")[0]],
//                     Surname: [reservation.guestName.split(" ")[1]],
//                   },
//                 ],
//                 telephone: reservation.guestPhone || "",
//                 email: reservation.guestEmail,
//               },
//             ],
//             totalAmount: reservation.total.toString(),
//             // currencyCode: "GBP", // Modify based on the correct currency code
//             checkInDate: reservation.timeSpan.checkInDate,
//             checkOutDate: reservation.timeSpan.checkOutDate,
//             rooms: reservation.assigned.map((room) => ({
//               roomId: room.roomTypeName,
//               roomType: room.roomTypeNameShort,
//               roomName: room.roomName,
//               ratePlan: room.dailyRates[0].rate,
//               rateAmount: room.roomTotal,
//               currency: room.currency,
//             })),
//           },
//           hotelDetails: {
//             propertyLocation: {
//               street:
//                 hotelDetail?.propertyAddress.propertyAddress1 ||
//                 hotelDetail?.propertyAddress.propertyAddress2,
//               city: hotelDetail?.propertyAddress.propertyCity || "",
//               state: hotelDetail?.propertyAddress.propertyState || "",
//               country: hotelDetail?.propertyAddress.propertyCountry || "",
//             },
//             phoneNo: {
//               // countryCode: "+44", // Replace with dynamic data if needed
//               number: hotelDetail?.propertyPhone || "",
//             },
//             _id: hotelDetail?._id,
//             status: hotelDetail?.status,
//             isDeleted: hotelDetail?.isDeleted,
//             propertyName: hotelDetail?.propertyName,
//             propertyId: hotelDetail?.propertyId,
//             propertyType: hotelDetail?.propertyType,
//             emailId: hotelDetail?.emailId,
//             statusBar: hotelDetail?.statusBar,
//             propertyImage:
//               hotelDetail?.propertyImage[0].image ||
//               hotelDetail?.propertyImage[0].thumb,
//             // defaultTimeZone: "GMT +01:00 London", // Adjust based on your data
//             defaultCheckInTime:
//               hotelDetail?.propertyPolicy?.propertyCheckInTime || "",
//             defaultCheckOutTime:
//               hotelDetail?.propertyPolicy?.propertyCheckOutTime || "",
//             isFrontDoor: hotelDetail.isFrontDoor || false,
//           },
//         };
//       });
//       //changes here
//       // console.log("result", result);
//       // resultARR.push(result);

//       const today = new Date(); // Get the current date (today)
//       today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero for accurate comparison

//       // Filter reservations with checkInDate today or in the future
//       const filteredReservations = result.filter((reservation) => {
//         const checkOutDate = new Date(reservation.bookingDetails.checkOutDate); // Convert check-in date to Date object
//         checkOutDate.setHours(0, 0, 0, 0); // Normalize time to compare only dates

//         // Include reservations whose check-in date is today or later
//         return checkOutDate >= today;
//       });

//       console.log("Filtered Reservations:", filteredReservations);

//       resultARR.push(filteredReservations);
//     }

//     const result = {
//       success: true,
//       message: "Records fetched sucess",
//       data: resultARR[0],
//     };

//     // let encryptedData = encryptData(result);

//     return res.status(200).json(result);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Internal Server Error",
//       data: JSON.stringify(error),
//     });
//   }
// }

// --------------------------------------------------------------------------------

async function userAndHotelReservation(req, res) {
  try {
    let guestEmailObj = await User.findById(req.user.id).select("email -_id");

    if (!guestEmailObj || !guestEmailObj.email) {
      return res.status(404).send({
        success: false,
        message: "User email not found",
        data: null,
      });
    }

    const guestEmail = guestEmailObj.email.toLowerCase().trim();
    console.log("Guest Email:", guestEmail);

    let source = await Source.findById(req.user.permissions.source).select(
      "sourceName"
    );

    const resultARR = [];

    if (source.sourceName === "Siteminder") {
      // Keep your existing Siteminder code here
      // ...
    } else if (source.sourceName === "CloudBeds") {
      let guestAllReservations = await CBreservation.aggregate([
        {
          $match: {
            guestEmail: {
              $regex: `^${guestEmail}$`,
              $options: "i",
            },
          },
        },
        {
          $addFields: {
            statusPriority: {
              $cond: {
                if: {
                  $eq: ["$status", "confirmed"],
                },
                then: 1,
                else: 2,
              },
            },
          },
        },
        {
          $sort: {
            statusPriority: 1,
            _id: 1,
          },
        },
        {
          $project: {
            statusPriority: 0,
          },
        },
      ]);

      console.log("Reservations Found:", guestAllReservations);

      if (guestAllReservations.length === 0) {
        return res.status(404).send({
          success: true,
          message: "No reservations found for the provided email.",
          data: null,
        });
      }

      // Process reservations
      const result = guestAllReservations.map((reservation) => {
        // Map reservation data as needed
        return {
          guestDetails: {
            vipIndicator: "false",
            personName: {
              givenName: reservation.guestName.split(" ")[0],
              surname: reservation.guestName.split(" ")[1],
            },
            telephone: reservation.guestPhone || "",
            email: reservation.guestEmail,
          },
          bookingDetails: {
            _id: reservation._id,
            status: reservation.status,
            reservationId: reservation.reservationID,
            totalAmount: reservation.total.toString(),
            checkInDate: reservation.timeSpan.checkInDate,
            checkOutDate: reservation.timeSpan.checkOutDate,
            rooms: reservation.assigned.map((room) => ({
              roomId: room.roomTypeName,
              roomType: room.roomTypeNameShort,
              roomName: room.roomName,
              ratePlan: room.dailyRates[0].rate,
              rateAmount: room.roomTotal,
              currency: room.currency,
            })),
          },
          hotelDetails: {
            // Fetch and include hotel details as needed
          },
        };
      });

      // Correct the date filtering
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filteredReservations = result.filter((reservation) => {
        const checkInDate = new Date(reservation.bookingDetails.checkInDate);
        checkInDate.setHours(0, 0, 0, 0);
        return checkInDate >= today;
      });

      console.log("Filtered Reservations:", filteredReservations);

      resultARR.push(filteredReservations);
    }

    const finalResult = {
      success: true,
      message: "Records fetched successfully",
      data: resultARR[0],
    };

    return res.status(200).json(finalResult);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: JSON.stringify(error),
    });
  }
}

async function userAndHotelReservationById(req, res) {
  try {
    // console.log("hello");
    const { _id } = req.params;

    let guestEmail = await User.findById(req.user.id).select(
      "guestTTLockCredentials.ttLockAccessToken email -_id"
    );
    // console.log("guestEmail", guestEmail);
    let source = await Source.findById(req.user.permissions.source).select(
      "sourceName"
    );
    let resultObj = {};

    let guestReservation;

    if (source.sourceName === "CloudBeds") {
      guestReservation = await CBreservation.findById(_id);
      // Check if reservations exist
      if (!guestReservation) {
        return res.status(404).send({
          success: true,
          message: "No reservations found for the provided email.",
          data: null,
        });
      }

      let hotelDetails = await cloudBedsHotel
        .findOne({
          propertyId: guestReservation.propertyID,
        })
        .select("-ttLockData");
      // console.log("hotelDetails", hotelDetails);
      if (!hotelDetails) {
        return res.status(404).send({
          success: true,
          message: "No Hotel Found with this Hotel Code",
          data: null,
        });
      }
      guestReservation = guestReservation.toObject();
      guestReservation.basicProperty = guestReservation.basicProperty || {};
      guestReservation.basicProperty.hotelDetails = hotelDetails;
      guestReservation.ttLockAccessToken =
        guestEmail.guestTTLockCredentials.ttLockAccessToken;
      //   console.log(
      //     "guestReservation",
      //     guestReservation
      // );
      resultObj = {
        guestDetails: {
          vipIndicator: "false", // Assuming there's no VIP indicator in your data; adjust if needed
          personName: {
            givenName: guestReservation.guestName.split(" ")[0],
            surname: guestReservation.guestName.split(" ")[1],
          },
          telephone: guestReservation.guestPhone,
          email: guestReservation.guestEmail,
          ttLockAccessToken: guestReservation.ttLockAccessToken,
        },
        bookingDetails: {
          _id: guestReservation._id.toString(),
          status: guestReservation.status,
          reservationId: guestReservation.reservationID,
          totalAmount: guestReservation.total.toString(),
          // currencyCode: "GBP", // Assuming GBP as currency, adjust if needed
          services: [],
          customerData: [
            {
              personName: [
                {
                  GivenName: [guestReservation.guestName.split(" ")[0]],
                  Surname: [guestReservation.guestName.split(" ")[1]],
                },
              ],
              telephone: guestReservation.guestPhone,
              email: guestReservation.guestEmail,
            },
          ],
          checkInDate: guestReservation.timeSpan.checkInDate,
          checkOutDate: guestReservation.timeSpan.checkOutDate,
          rooms: guestReservation.assigned.map((room) => ({
            roomId: room.roomTypeName,
            roomType: room.roomTypeNameShort,
            ratePlan: room.dailyRates[0].rate,
            rateAmount: room.roomTotal,
            roomName: room.roomName,
            currency: room.currency || "",
            // currency: "GBP" // Assuming GBP as currency, adjust if needed
          })),
          doorPasscodes: guestReservation.passcodeDetails,
          isDoorKeypad: hotelDetails.isDoorKeypad || false,
        },
        hotelDetails: {
          propertyLocation: {
            street: hotelDetails.propertyAddress.propertyAddress1,
            city: hotelDetails.propertyAddress.propertyCity,
            state: hotelDetails.propertyAddress.propertyState,
            country: hotelDetails.propertyAddress.propertyCountry,
          },
          phoneNo: {
            countryCode: hotelDetails.propertyPhone.split(" ")[0] || "",
            number: hotelDetails.propertyPhone.split(" ")[1] || "",
          },
          _id: hotelDetails._id.toString(),
          status: hotelDetails.status,
          isDeleted: hotelDetails.isDeleted,
          propertyName: hotelDetails.propertyName,
          propertyId: hotelDetails.propertyId,
          propertyType: hotelDetails.propertyType,
          emailId: hotelDetails.propertyEmail,
          statusBar: hotelDetails.statusBar,
          PMSsource: hotelDetails.PMSsource.toString(),
          propertyImage:
            hotelDetails.propertyImage[0]?.image ||
            hotelDetails.propertyImage[0]?.thumb,
          // defaultTimeZone: "GMT +01:00 London", // This might need to be dynamically set if available
          defaultCheckInTime: hotelDetails.propertyPolicy.propertyCheckInTime,
          defaultCheckOutTime: hotelDetails.propertyPolicy.propertyCheckOutTime,
          isFrontDoor: hotelDetails.isFrontDoor,
          isDoorKeypad: hotelDetails.isDoorKeypad || false,
          createdAt: hotelDetails.createdAt,
          updatedAt: hotelDetails.updatedAt,
        },
      };
    } else if (source.sourceName === "Siteminder") {
      guestReservation = await SMXResrvation.findById(_id);

      // Check if reservations exist
      if (!guestReservation) {
        return res.status(404).send({
          success: true,
          message: "No reservations found for the provided email.",
          data: null,
        });
      }
      // console.log(
      //   "guestReservation",
      //   guestReservation
      // );
      let hotelDetails = await siteminderProperty
        .findOne({
          propertyId: guestReservation.basicProperty[0].HotelCode,
        })
        .select("-ttLockData");

      if (!hotelDetails) {
        return res.status(404).send({
          success: true,
          message: "No Hotel Found with this Hotel Code",
          data: null,
        });
      }

      // Extract guest details
      const guestData = guestReservation.customerData?.[0] || {};
      const personName = guestData.PersonName?.[0] || {};

      const guestDetails = {
        vipIndicator: guestData.VIP_Indicator?.[0] || "false",
        personName: {
          givenName: personName.GivenName?.[0] || "",
          surname: personName.Surname?.[0] || "",
        },
        telephone: guestData.Telephone?.[0]?.PhoneNumber?.[0] || "",
        email: guestData.Email?.[0]?._ || "",
        ttLockAccessToken: guestEmail.guestTTLockCredentials.ttLockAccessToken,
      };

      // Extract booking details
      const bookingDetails = {
        _id: guestReservation._id,
        status: guestReservation.status,
        reservationId: guestReservation.reservationId?.[0] || "",
        totalAmount: guestReservation.total?.[0]?.AmountAfterTax?.[0] || "",
        currencyCode: guestReservation.total?.[0]?.CurrencyCode?.[0] || "",
        services: guestReservation.services,
        customerData:
          guestReservation.customerData?.map((el) => ({
            personName: el.PersonName,
            telephone: el.Telephone?.[0]?.PhoneNumber[0] || "",
            email: el.Email?.[0]?._ || "",
          })) || [],
        checkInDate:
          guestReservation.roomStays?.[0]?.stayDetails?.RoomRates?.[0]
            ?.RoomRate?.[0]?.EffectiveDate?.[0] || "",
        checkOutDate:
          guestReservation.roomStays?.[0]?.stayDetails?.RoomRates?.[0]
            ?.RoomRate?.[0]?.ExpireDate?.[0] || "",
        rooms:
          guestReservation.roomStays?.map((room) => ({
            roomId: room.roomId?.[0] || "",
            roomType:
              room.stayDetails?.RoomTypes?.[0]?.RoomType?.[0]?.RoomType?.[0] ||
              "",
            ratePlan:
              room.stayDetails?.RatePlans?.[0]?.RatePlan?.[0]
                ?.RatePlanName?.[0] || "",
            rateAmount:
              room.stayDetails?.RoomRates?.[0]?.RoomRate?.[0]?.Rates?.[0]
                ?.Rate?.[0]?.Base?.[0]?.AmountAfterTax?.[0] || "",
            currency:
              room.stayDetails?.RoomRates?.[0]?.RoomRate?.[0]?.Rates?.[0]
                ?.Rate?.[0]?.Base?.[0]?.CurrencyCode?.[0] || "",
          })) || [],
        doorPasscodes: guestReservation.passcodeDetails,
        isDoorKeypad: hotelDetails.isDoorKeypad || false,
      };

      // Prepare hotel details
      const propertyLocation = {
        street: hotelDetails.propertyLocation?.street || "Unknown Street",
        city: hotelDetails.propertyLocation?.city || "Unknown City",
        state: hotelDetails.propertyLocation?.state || "Unknown State",
        country: hotelDetails.propertyLocation?.country || "Unknown Country",
      };

      const phoneNo = {
        countryCode: hotelDetails.phoneNo?.countryCode || "+91",
        number: hotelDetails.phoneNo?.number || "0000000000",
      };
      // console.log("hoteldet", hotelDetails);
      const hotelInfo = {
        propertyLocation,
        phoneNo,
        _id: hotelDetails._id,
        status: hotelDetails.status,
        isDeleted: hotelDetails.isDeleted,
        propertyName: hotelDetails.propertyName,
        propertyId: hotelDetails.propertyId,
        propertyType: hotelDetails.propertyType,
        emailId: hotelDetails.emailId,
        statusBar: hotelDetails.statusBar,
        PMSsource: hotelDetails.PMSsource,
        propertyPublisherName: hotelDetails.propertyPublisherName,
        propertyImage: hotelDetails.PropertyImage,
        defaultTimeZone: hotelDetails.defaultTimeZone,
        defaultCheckInTime: hotelDetails.defaultCheckInTime,
        defaultCheckOutTime: hotelDetails.defaultCheckOutTime,
        createdAt: hotelDetails.createdAt,
        updatedAt: hotelDetails.updatedAt,
        isFrontDoor: hotelDetails.isFrontDoor,
        isDoorKeypad: hotelDetails.isDoorKeypad || false,
      };

      resultObj.guestDetails = guestDetails;
      resultObj.bookingDetails = bookingDetails;
      resultObj.hotelDetails = hotelInfo;
    }

    const result = {
      success: true,
      message: "Records fetched sucess",
      data: [resultObj],
    };

    // let encryptedData = encryptData(result);

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: JSON.stringify(error),
    });
  }
}

async function keySharing(req, res) {
  try {
    const { name, email, room, reservationId, propertyId } = req.body;
    let source = await Source.findById(req.user.permissions.source).select(
      "sourceName"
    );
    let ttLockUsername,
      passcode,
      ttLockMD5,
      ttLockpass,
      ttLockpasscodeExpiry,
      ttLockaccessToken,
      ttLockrefreshToken,
      timeSpans;
    if (source.sourceName === "Siteminder") {
      let propertyAccessToken = await siteminderProperty
        .findOne({ propertyId: propertyId })
        .select("ttLockData.ttLockAccessToken -_id");
      let reservationDetails = await SMXResrvation.findOne({
        reservationId: reservationId,
      }).select("roomStays.stayDetails.TimeSpan");
      reservationDetails = reservationDetails.toObject();
      let frontDoorCheck = await siteminderProperty
        .findOne({ propertyId: propertyId })
        .select("isFrontDoor -_id");
      if (frontDoorCheck.isFrontDoor) {
        room.push("2024");
      }
      let timeSpans = {
        checkInDate:
          reservationDetails.roomStays[0].stayDetails.TimeSpan[0].Start[0],
        checkOutDate:
          reservationDetails.roomStays[0].stayDetails.TimeSpan[0].End[0],
      };
      // console.log("timeSpans", timeSpans);
      let reservation_for_tt = {
        guestName: name,
        roomIds: room,
        propertyId: propertyId,
        reservationID: reservationId,
        timeSpan: timeSpans,
        source: "Siteminder",
        propertyAccessToken,
      };
      let passcodeCreation = await ttlockService.createPasskey(
        reservation_for_tt,
        req,
        res
      );
      if (passcodeCreation) {
        ttLockUsername = passcodeCreation.username;
        ttLockMD5 = passcodeCreation.md5;
        ttLockpass = passcodeCreation.password;
        ttLockpasscodeExpiry = passcodeCreation.passcodeExpiry;
        ttLockaccessToken = passcodeCreation.accessToken;
        ttLockrefreshToken = passcodeCreation.refreshToken;
        passcode = passcodeCreation.passcodeDetails;
        let hotelDetails = await siteminderProperty
          .findOne({
            propertyId: propertyId,
          })
          .select(
            "propertyName defaultCheckInTime defaultCheckOutTime emailId -_id"
          );
        hotelDetails = hotelDetails.toObject();
        // console.log("hhhh", req.user)
        const userData = {
          name: reservation_for_tt.guestName,
          ttLockUsername: ttLockUsername,
          ttLockMD5,
          ttLockpass,
          ttLockpasscodeExpiry,
          ttLockaccessToken,
          ttLockrefreshToken,
          email: email,
          // contact: phone ? phone : null,
          passcodeData: passcode,
          source: "Siteminder",
          role: "guest",
          timeSpan: timeSpans,
          hotelDetail: {
            propertyName: hotelDetails.propertyName,
            defaultCheckInTime: hotelDetails.defaultCheckInTime,
            defaultCheckOutTime: hotelDetails.defaultCheckOutTime,
            propertyEmail: hotelDetails.emailId,
          },
          emailType: "key_sharing",
          senderName: (
            await User.findById({ _id: req.user.id }).select("name -_id").lean()
          )?.name,
        };
        console.log("userData", userData);
        const createUserResponse = await createUser({
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
        return res.status(200).send({
          success: true,
          message: "Key Shared Successfully",
        });
      }
    } else if (source.sourceName === "CloudBeds") {
      let propertyAccessToken = await cloudBedsHotel
        .findOne({ propertyId: propertyId })
        .select("ttLockData.ttLockAccessToken -_id");
      let reservationDetails = await CBreservation.findOne({
        reservationID: reservationId,
      }).select("timeSpan");
      console.log("reservationDetails", reservationDetails);
      reservationDetails = reservationDetails.toObject();
      let frontDoorCheck = await cloudBedsHotel
        .findOne({ propertyId: propertyId })
        .select("isFrontDoor -_id");
      if (frontDoorCheck.isFrontDoor) {
        room.push("2024");
      }
      let reservation_for_tt = {
        guestName: name,
        roomIds: room,
        propertyId: propertyId,
        reservationID: reservationId,
        timeSpan: reservationDetails.timeSpan,
        source: "CloudBeds",
        propertyAccessToken,
      };
      const createPasskey = await ttlockService.createPasskey(
        reservation_for_tt
      );
      ttLockUsername = createPasskey.username;
      ttLockMD5 = createPasskey.md5;
      ttLockpass = createPasskey.password;
      ttLockpasscodeExpiry = createPasskey.passcodeExpiry;
      ttLockaccessToken = createPasskey.accessToken;
      ttLockrefreshToken = createPasskey.refreshToken;
      passcode = createPasskey.passcodeDetails;
      let hotelDetails = await cloudBedsHotel
        .findOne({ propertyId: propertyId })
        .select(
          "propertyName defaultCheckInTime defaultCheckOutTime propertyEmail -_id"
        );
      hotelDetails = hotelDetails.toObject();
      // console.log("hhhh", req.user);
      const userData = {
        name: name,
        ttLockUsername: ttLockUsername,
        ttLockMD5,
        ttLockpass,
        ttLockpasscodeExpiry,
        ttLockaccessToken,
        ttLockrefreshToken,
        email: email,
        //  contact: reservationCreateObj.guestPhone,
        passcodeData: passcode,
        source: "CloudBeds",
        role: "guest",
        timeSpan: reservationDetails.timeSpan,
        hotelDetail: {
          propertyName: hotelDetails.propertyName,
          defaultCheckInTime: hotelDetails.defaultCheckInTime,
          defaultCheckOutTime: hotelDetails.defaultCheckOutTime,
          propertyEmail: hotelDetails.propertyEmail,
        },
        emailType: "key_sharing",
        senderName: (
          await User.findById({ _id: req.user.id }).select("name -_id").lean()
        )?.name,
      };
      // console.log("userDataaaaa", userData);
      const createUserResponse = await createUser({
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
      return res.status(200).send({
        success: true,
        message: "Key Shared Successfully",
      });
    }
  } catch (error) {
    logger.info("ERR", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: JSON.stringify(error),
    });
  }
}

module.exports = {
  verifyOtp,
  login,
  createUser,
  getPasscodeDetails,
  forgotPassword,
  postItem,
  updatePassword,
  generatePasscode,
  userAndHotelReservation,
  userAndHotelReservationById,
  keySharing,
};
