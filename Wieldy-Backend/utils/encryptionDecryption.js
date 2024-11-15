// const CryptoJS = require("crypto-js");
// require('dotenv').config();
// const crypto = require('crypto');

// // // Function to create the encryption key using SHA256
// // function createKey(secretKey) {
// //     return CryptoJS.SHA256(secretKey).toString(CryptoJS.enc.Hex).substring(0, 16);
// // }

// // Function to create the encryption key using SHA256
// function createKey(secretKey) {
//     return CryptoJS.SHA256(secretKey).toString(CryptoJS.enc.Hex).substring(0, 32);
// }

// // Function to encrypt data with IV handling
// function encryptData(data) {
//     const secretKey = process.env.SECRET_KEY;
//     const key = createKey(secretKey);

//     // Generate a random IV of 16 bytes
//     const iv = crypto.randomBytes(16).toString('base64');

//     // console.log("Iv",iv);

//     // Convert the data to a string if it's not already a string
//     const stringifiedData = (typeof data === 'string') ? data : JSON.stringify(data);

//     // Encrypt the data using AES with CBC mode and the IV
//     const encrypted = CryptoJS.AES.encrypt(stringifiedData, CryptoJS.enc.Utf8.parse(key), {
//         iv: CryptoJS.enc.Base64.parse(iv),
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7,
//     });

//     // Return both the IV and the encrypted data, separated by a colon
//     return iv + ':' + encrypted.toString();
// }
// // Decryption function with IV handling
// function decryptData(encryptedData) {
//     const secretKey = process.env.SECRET_KEY;
//     const key = createKey(secretKey);

//     // Split the IV and the encrypted data
//     const parts = encryptedData.split(':');
//     const iv = Buffer.from(parts[0], 'base64'); // Decode the IV from base64
//     const cipherText = parts[1];

//     // Decrypt the data
//     const bytes = CryptoJS.AES.decrypt(cipherText, CryptoJS.enc.Utf8.parse(key), {
//         iv: CryptoJS.enc.Hex.parse(iv.toString('hex')), // Convert IV to hex for CryptoJS
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7,
//     });

//     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

//     try {
//         return JSON.parse(decryptedData);
//     } catch (e) {
//         return decryptedData;
//     }
// }

// // Function to encrypt JWT token
// function encToken(token) {
//     const secretKey = process.env.SECRET_KEY;
//     const key = createKey(secretKey);

//     // Generate a random IV of 16 bytes
//     const iv = crypto.randomBytes(16).toString('hex').slice(0, 16);

//     // Encrypt the JWT token using AES with CBC mode and the IV
//     const encrypted = CryptoJS.AES.encrypt(token, CryptoJS.enc.Utf8.parse(key), {
//         iv: CryptoJS.enc.Utf8.parse(iv),
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7,
//     });

//     // Return both the encrypted token and the IV
//     return iv + ':' + encrypted.toString();
// }

// // Export the functions so they can be reused across the application
// module.exports = {
//     encryptData,
//     decryptData,
//     encToken
// };
