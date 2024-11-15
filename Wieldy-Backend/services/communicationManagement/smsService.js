// // const twilio = require("twilio");
// // require("dotenv").config();

// // const client = twilio(
// //   process.env.TWILIO_SID,
// //   process.env.TWILIO_AUTH_TOKEN
// // );

// // module.exports.sendPasscodeSMS = async function (
// //   contact,
// //   otp
// // ) {
// //   try {
// //     await client.messages.create({
// //       body: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
// //       from: process.env.TWILIO_PHONE_NUMBER,
// //       to: contact
// //     });
// //     return {
// //       success: true,
// //       message: "Passcode SMS sent successfully"
// //     };
// //   } catch (error) {
// //     console.error("Error sending SMS:", error);
// //     return {
// //       success: false,
// //       message: "Failed to send passcode SMS",
// //       error: error.message || error
// //     };
// //   }
// // };

// require("dotenv").config();

// const twilio = require("twilio");
// const client = twilio(
//   "AC7d99e981f5ed5b4c905840417271ccf1",
//   "c16cfab4a2dbca7a5da08b8d4867465e"
// );

// // module.exports.sendReservationSMS = async function (
// //   contact,
// //   guestName,
// //   hotelName
// // ) {
// //   try {
// //     const message = `Dear ${guestName},\nThank you for your reservation at ${hotelName}. We are your Keyless Check-In Partner.\nFollow these 3 steps:\n1. Username: argalhassan@gmail.com\n2. Password: acqh5waa\n3. Click here to Login: https://app.wieldyportal.co.uk\nNote: Unlock details available on Check-in Date.\nEnjoy your stay!\nWieldy Digital - Keyless Guest Check-in App! Digital hospitality made easy!`;

// //     await client.messages.create({
// //       body: message,
// //       from: "+441174565073", // Twilio verified phone number
// //       to: contact // Recipient's phone number
// //     });

// //     return {
// //       success: true,
// //       message: "Reservation SMS sent successfully"
// //     };
// //   } catch (error) {
// //     console.error("Error sending SMS:", error);
// //     return {
// //       success: false,
// //       message: "Failed to send reservation SMS",
// //       error: error.message || error
// //     };
// //   }
// // };

// // // Test the function
// // (async function testSendSMS() {
// //   const result = await sendReservationSMS(
// //     "+919958452918", // Recipient's number
// //     "Hassan", // Guest's name
// //     "Hotel Paradise" // Hotel's name
// //   );

// //   console.log(result); // Log the result to the console
// // })();

// async function sendReservationSMS(
//   contact,
//   guestName,
//   hotelName,
//   username,
//   password
// ) {
//   try {
//    const message = `Dear ${guestName},

// Thank you for your reservation at ${hotelName}. We are your Keyless Check-In Partner.

// Follow these 3 steps for Mobile eKey:
// 1. Username: ${username}
// 2. Password: ${password}
// 3. Click here to Login: https://app.wieldyportal.co.uk

// Note: Unlock details available on Check-in Date.

// Enjoy your stay!

// Wieldy Digital - Keyless Guest Check-in App!`;

//     await client.messages.create({
//       body: message,
//       from: "+447480821184",
//       // from: "WieldyDigital",
//       to: contact
//     });

//     return {
//       success: true,
//       message: "Reservation SMS sent successfully"
//     };
//   } catch (error) {
//     console.error("Error sending SMS:", error);
//     return {
//       success: false,
//       message: "Failed to send reservation SMS",
//       error: error.message || error
//     };
//   }
// };

// module.exports = sendReservationSMS;

// // Test the function
// // (async function testSendSMS() {
// //   const result = await sendReservationSMS(
// //     "+919958452918",
// //     "Hassan",
// //     "Hotel Paradise",
// //     "argalhassan@gmail.com",
// //     "hellopasword"
// //   );

// //   console.log(result); // Log the result to the console
// // })();

// -----------------------------------------------------------------------------------

// // services/communicationManagement/smsService.js

// require("dotenv").config();

// const twilio = require("twilio");
// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// async function sendPasscodeSMS(contact, guestName, hotelName, email, passcode) {
//   try {
//     const message = `Dear ${guestName},

// Thank you for your reservation at ${hotelName}. We are your Keyless Check-In Partner.

// Follow these 3 steps for Mobile eKey:
// 1. Username: ${email}
// 2. Password: ${passcode}
// 3. Click here to Login: https://app.wieldyportal.co.uk

// Note: Unlock details available on Check-in Date.

// Enjoy your stay!

// Wieldy Digital - Keyless Guest Check-in App!`;

//     await client.messages.create({
//       body: message,
//       from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio verified phone number
//       to: contact, // Recipient's phone number
//     });

//     return {
//       success: true,
//       message: "Reservation SMS sent successfully",
//     };
//   } catch (error) {
//     console.error("Error sending SMS:", error);
//     return {
//       success: false,
//       message: "Failed to send reservation SMS",
//       error: error.message || error,
//     };
//   }
// }

// module.exports = sendPasscodeSMS;

// ---------------------------------------------------------------------------------

// services/communicationManagement/smsService.js

require("dotenv").config();

const twilio = require("twilio");

// Temporary debugging statements (Remove these after testing)
console.log("TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN);
console.log("TWILIO_PHONE_NUMBER:", process.env.TWILIO_PHONE_NUMBER);

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendPasscodeSMS(contact, guestName, hotelName, email, passcode) {
  try {
    const message = `Dear ${guestName},

Thank you for your reservation at ${hotelName}. We are your Keyless Check-In Partner.

Follow these 3 steps for Mobile eKey:
1. Username: ${email}
2. Password: ${passcode}
3. Click here to Login: https://app.wieldyportal.co.uk

Note: Unlock details available on Check-in Date.

Enjoy your stay!

Wieldy Digital - Keyless Guest Check-in App!`;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio verified phone number
      to: contact, // Recipient's phone number
    });

    return {
      success: true,
      message: "Reservation SMS sent successfully",
    };
  } catch (error) {
    console.error("Error sending SMS:", error);
    return {
      success: false,
      message: "Failed to send reservation SMS",
      error: error.message || error,
    };
  }
}

module.exports = sendPasscodeSMS;
