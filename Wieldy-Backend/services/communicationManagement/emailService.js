// const nodemailer = require("nodemailer");
// require("dotenv").config();
// const bcrypt = require("bcrypt");
// const User = require("../../models/userModel");

// //also need to add a scheduler to give email password before 12hrs of checkin
// // Function to send passcode email
// module.exports.sendPasscodeEmail = async function (
//   email,
//   passcode,
//   userContact,
//   // emailType = "account_creation",
//   emailType,
//   // bookingDetails = {}
//   bookingDetails,
//   senderName
// ) {
//   try {
//     // Configure nodemailer transporter
//     if (email === "hxc@gmail.com") {
//       emailBody = `
//       <p>&nbsp;</p>
// <div
//   id="forwardbody1"
//   style="
//     font-size: 10pt;
//     font-family: Verdana, Geneva, sans-serif;
//   "
// >
//   <div id="v1signature"></div>
//   <div
//     id="v1forwardbody1"
//     style="
//       font-size: 10pt;
//       font-family: Verdana, Geneva, sans-serif;
//     "
//   >
//     <div id="v1v1forwardbody1">
//       <div id="v1v1v1_rc_sig"></div>
//       <table
//         style="
//           background-color: #f1f0ee;
//           width: 100%;
//           border-collapse: collapse;
//           border-spacing: 0px;
//           box-sizing: border-box;
//         "
//       >
//         <tbody>
//           <tr>
//             <td>
//               <span style="font-size: 10pt"
//                 >&nbsp;</span
//               >
//             </td>
//             <td style="width: 600px">
//               <span style="font-size: 10pt"
//                 >&nbsp;</span
//               >
//             </td>
//             <td>
//               <span style="font-size: 10pt"
//                 >&nbsp;</span
//               >
//             </td>
//           </tr>
//           <tr>
//             <td>
//               <span style="font-size: 10pt"
//                 >&nbsp;</span
//               >
//             </td>
//             <td style="width: 600px">
//               <table
//                 style="
//                   width: 600px;
//                   border-collapse: collapse;
//                   border-spacing: 0px;
//                   box-sizing: border-box;
//                 "
//                 align="center"
//               >
//                 <tbody>
//                   <tr>
//                     <td
//                       style="
//                         background-color: #ffffff;
//                         width: 100%;
//                       "
//                     >
//                       <div style="padding: 15px">
//                         <p>
//                           <span style="font-size: 14px"
//                             ><img
//                               style="
//                                 width: 600px;
//                                 margin-top: 0px;
//                                 margin-bottom: 0px;
//                               "
//                               src="https://www.metasticworld.com/wp-content/uploads/2024/09/Enjoy-Keyless-Check-in-With-Us.jpg"
//                               width="600"
//                           /></span>
//                         </p>
//                         <div
//                           style="
//                             margin-right: auto;
//                             margin-left: auto;
//                           "
//                         >
//                           <span style="font-size: 14px"
//                             ><br /></span
//                           ><span
//                             style="
//                               font-family: verdana,
//                                 geneva, sans-serif;
//                               font-size: 10pt;
//                               color: #2c363a;
//                               background-color: #ffffff;
//                             "
//                             >Welcome to Wieldy
//                             Digital!</span
//                           ><span
//                             style="font-size: 14px"
//                             ><br /></span
//                           ><span
//                             style="
//                               font-family: verdana,
//                                 geneva, sans-serif;
//                               font-size: 10pt;
//                               color: #2c363a;
//                               background-color: #ffffff;
//                             "
//                             ><br />Thank you for
//                             reservation at ${bookingDetails.propertyName}</span
//                           >
//                           <div
//                             style="
//                               font-family: Verdana,
//                                 Geneva, sans-serif;
//                               font-size: 10pt;
//                             "
//                           >
//                             &nbsp;
//                           </div>
//                           <div
//                             style="
//                               font-family: Verdana,
//                                 Geneva, sans-serif;
//                               font-size: 10pt;
//                             "
//                           >
//                             We have partnered with
//                             ${bookingDetails.propertyName} to
//                             offer you the easiest
//                             check-in and keyless entry
//                             you can imagine!&nbsp;
//                           </div>
//                           <div
//                             style="
//                               font-family: Verdana,
//                                 Geneva, sans-serif;
//                               font-size: 10pt;
//                             "
//                           >
//                             &nbsp;
//                           </div>
//                         </div>
//                         <h3
//                           style="
//                             line-height: 1.5;
//                             margin: 0px auto 16px;
//                             font-family: Lato, Arial,
//                               Helvetica, sans-serif;
//                             font-size: 20px;
//                           "
//                         >
//                           <span style="font-size: 12pt"
//                             >Please follow these 3
//                             steps to access your Mobile
//                             eKey;</span
//                           >
//                         </h3>
//                         <table
//                           style="
//                             text-align: left;
//                             border-radius: 4px;
//                             margin-bottom: 1.4em;
//                             width: 100%;
//                             height: 233.5px;
//                             border-collapse: separate;
//                             border-spacing: 0px;
//                             box-sizing: border-box;
//                             border: 1px solid #c6ceda;
//                           "
//                         >
//                           <tbody>
//                             <tr>
//                               <td
//                                 style="
//                                   text-align: left;
//                                   border-bottom: 1px
//                                     solid #c6ceda;
//                                   width: 100%;
//                                   height: 78.5px;
//                                 "
//                               >
//                                 <div
//                                   style="
//                                     padding: 12px 16px;
//                                   "
//                                 >
//                                   <p
//                                     style="
//                                       text-align: left;
//                                       margin: 0px;
//                                       font-size: 18px;
//                                     "
//                                   >
//                                     <strong
//                                       ><span
//                                         style="
//                                           font-size: 12pt;
//                                         "
//                                         >1. Use your
//                                         email as
//                                         Username&nbsp;</span
//                                       ></strong
//                                     >
//                                   </p>
//                                   <p
//                                     style="
//                                       text-align: left;
//                                       margin: 0px;
//                                     "
//                                   >
//                                     <span
//                                       style="
//                                         font-size: 14px;
//                                       "
//                                       >&nbsp;</span
//                                     >
//                                   </p>
//                                   <p
//                                     style="
//                                       text-align: left;
//                                       margin: 0px;
//                                     "
//                                   >
//                                     <span
//                                       style="
//                                         font-size: 14px;
//                                       "
//                                       >${email}</span
//                                     >
//                                   </p>
//                                 </div>
//                               </td>
//                             </tr>
//                             <tr>
//                               <td
//                                 style="
//                                   text-align: left;
//                                   border-bottom: 1px
//                                     solid #c6ceda;
//                                   width: 100%;
//                                 "
//                               >
//                                 <div
//                                   style="
//                                     padding: 12px 16px;
//                                   "
//                                 >
//                                   <p
//                                     style="
//                                       text-align: left;
//                                       margin: 0px;
//                                       font-size: 18px;
//                                     "
//                                   >
//                                     <strong
//                                       ><span
//                                         style="
//                                           font-size: 12pt;
//                                         "
//                                         >2. Copy the
//                                         below
//                                         Password</span
//                                       ></strong
//                                     >
//                                   </p>
//                                   <p
//                                     style="
//                                       text-align: left;
//                                       margin: 0px;
//                                     "
//                                   >
//                                     <span
//                                       style="
//                                         font-size: 14px;
//                                       "
//                                       >&nbsp;</span
//                                     >
//                                   </p>
//                                   <p
//                                     style="
//                                       text-align: left;
//                                       margin: 0px;
//                                     "
//                                   >
//                                     <span
//                                       style="
//                                         font-size: 14px;
//                                       "
//                                       >${passcode}</span
//                                     >
//                                   </p>
//                                 </div>
//                               </td>
//                             </tr>
//                             <tr>
//                               <td
//                                 style="
//                                   text-align: left;
//                                   width: 100%;
//                                   height: 81px;
//                                 "
//                               >
//                                 <div
//                                   style="
//                                     padding: 12px 16px;
//                                   "
//                                 >
//                                   <p
//                                     style="
//                                       text-align: left;
//                                       margin: 0px;
//                                     "
//                                   >
//                                     <span
//                                       style="
//                                         font-size: 12pt;
//                                       "
//                                       ><strong
//                                         >3. Click on
//                                         below Link to
//                                         enter the
//                                         details</strong
//                                       ></span
//                                     ><span
//                                       style="
//                                         font-size: 14pt;
//                                       "
//                                       ><strong
//                                         ><br /></strong></span
//                                     ><span
//                                       style="
//                                         font-size: 14px;
//                                       "
//                                       ><br /><a
//                                         id="v1v1v1v1OWA75dc1713-15a4-d5fc-192a-a90da23147d2"
//                                         class="v1v1v1v1OWAAutoLink"
//                                         style="
//                                           margin-top: 0px;
//                                           margin-bottom: 0px;
//                                         "
//                                         href="https://app.wieldyportal.co.uk"
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         >https://app.wieldyportal.co.uk</a
//                                       ></span
//                                     >
//                                   </p>
//                                 </div>
//                               </td>
//                             </tr>
//                           </tbody>
//                         </table>
//                         <div
//                           style="
//                             margin-right: auto;
//                             margin-left: auto;
//                           "
//                         >
//                           <div
//                             style="
//                               font-family: Verdana,
//                                 Geneva, sans-serif;
//                               font-size: 14px;
//                             "
//                           >
//                             <span
//                               style="font-size: 10pt"
//                               >Simple! now you are
//                               checked in, please enjoy
//                               your&nbsp;keyless access
//                               to your room. If you need
//                               to share your webkey
//                               to&nbsp;other&nbsp;people
//                               in&nbsp;your&nbsp;party
//                               please use the "share"
//                               facility.</span
//                             >
//                           </div>
//                           <div
//                             style="
//                               font-family: Verdana,
//                                 Geneva, sans-serif;
//                               font-size: 14px;
//                             "
//                           >
//                             &nbsp;
//                           </div>
//                           <h3
//                             style="
//                               line-height: 1.5;
//                               margin: 0px auto 16px;
//                               font-family: Lato, Arial,
//                                 Helvetica, sans-serif;
//                               font-size: 20px;
//                             "
//                           >
//                             <span
//                               style="font-size: 12pt"
//                               >Check-In &amp; Check-Out
//                               Details:</span
//                             >
//                           </h3>
//                           <table
//                             style="
//                               text-align: left;
//                               margin-bottom: 0em;
//                               width: 100%;
//                               border-collapse: separate;
//                               border-spacing: 0px;
//                               box-sizing: border-box;
//                             "
//                           >
//                             <tbody>
//                               <tr>
//                                 <td>
//                                   <table
//                                     style="
//                                       text-align: left;
//                                       border-radius: 4px;
//                                       margin-bottom: 1.4em;
//                                       width: 100%;
//                                       border-collapse: separate;
//                                       border-spacing: 0px;
//                                       box-sizing: border-box;
//                                       border: 1px solid
//                                         #c6ceda;
//                                     "
//                                   >
//                                     <tbody>
//                                       <tr>
//                                         <td
//                                           style="
//                                             text-align: left;
//                                             border-bottom: 1px
//                                               solid
//                                               #c6ceda;
//                                           "
//                                         >
//                                           <div
//                                             style="
//                                               text-align: left;
//                                               padding: 12px
//                                                 16px;
//                                               font-family: Verdana,
//                                                 Geneva,
//                                                 sans-serif;
//                                               font-size: 14px;
//                                             "
//                                           >
//                                             <img
//                                               style="
//                                                 width: 12px;
//                                                 height: 12px;
//                                                 margin-right: 10px;
//                                               "
//                                               src="https://app.littlehotelier.com//legacy-assets/arrow-down.png"
//                                               width="12"
//                                               height="12"
//                                             />&nbsp;Check-in
//                                           </div>
//                                         </td>
//                                       </tr>
//                                       <tr>
//                                         <td>
//                                           <div
//                                             style="
//                                               text-align: left;
//                                               padding: 12px
//                                                 16px;
//                                               font-family: Verdana,
//                                                 Geneva,
//                                                 sans-serif;
//                                             "
//                                           >
//                                             <span
//                                               style="
//                                                 font-size: 18px;
//                                               "
//                                               ><strong
//                                                 >${bookingDetails.checkInDate}</strong
//                                               ><br /></span
//                                             ><span
//                                               style="
//                                                 font-size: 8pt;
//                                               "
//                                               >Time:
//                                               ${bookingDetails.defaultCheckInTime}</span
//                                             >
//                                           </div>
//                                         </td>
//                                       </tr>
//                                     </tbody>
//                                   </table>
//                                 </td>
//                                 <td>
//                                   <table
//                                     style="
//                                       text-align: left;
//                                       border-radius: 4px;
//                                       margin-bottom: 1.4em;
//                                       width: 100%;
//                                       border-collapse: separate;
//                                       border-spacing: 0px;
//                                       box-sizing: border-box;
//                                       border: 1px solid
//                                         #c6ceda;
//                                     "
//                                   >
//                                     <tbody>
//                                       <tr>
//                                         <td
//                                           style="
//                                             text-align: left;
//                                             border-bottom: 1px
//                                               solid
//                                               #c6ceda;
//                                           "
//                                         >
//                                           <div
//                                             style="
//                                               text-align: left;
//                                               padding: 12px
//                                                 16px;
//                                               font-family: Verdana,
//                                                 Geneva,
//                                                 sans-serif;
//                                               font-size: 14px;
//                                             "
//                                           >
//                                             <img
//                                               style="
//                                                 width: 12px;
//                                                 height: 12px;
//                                                 margin-right: 10px;
//                                               "
//                                               src="https://app.littlehotelier.com//legacy-assets/arrow-up.png"
//                                               width="12"
//                                               height="12"
//                                             />&nbsp;Check-out
//                                           </div>
//                                         </td>
//                                       </tr>
//                                       <tr>
//                                         <td>
//                                           <div
//                                             style="
//                                               text-align: left;
//                                               padding: 12px
//                                                 16px;
//                                               font-family: Verdana,
//                                                 Geneva,
//                                                 sans-serif;
//                                             "
//                                           >
//                                             <span
//                                               style="
//                                                 font-size: 18px;
//                                               "
//                                               ><strong
//                                                 >${bookingDetails.checkOutDate}</strong
//                                               ><br /></span
//                                             ><span
//                                               style="
//                                                 font-size: 8pt;
//                                               "
//                                               >Time:
//                                               ${bookingDetails.defaultCheckOutTime}</span
//                                             >
//                                           </div>
//                                         </td>
//                                       </tr>
//                                     </tbody>
//                                   </table>
//                                 </td>
//                               </tr>
//                             </tbody>
//                           </table>
//                         </div>
//                         <div
//                           style="
//                             line-height: 1.3;
//                             font-family: 'Open Sans',
//                               sans-serif;
//                             font-size: 15px;
//                             color: #0a0a0a;
//                           "
//                         >
//                           <span
//                             style="
//                               font-family: verdana,
//                                 geneva, sans-serif;
//                               font-size: 10pt;
//                               color: #3e3c3c;
//                             "
//                             >Please use above
//                             credentials for Keyless
//                             Check-in using Passcode or
//                             Webkey. If you face any
//                             issue while Check-in, you
//                             can mail us at ${bookingDetails.propertyEmail}<br /><strong
//                               ><br />Note:</strong
//                             >
//                             Unlock details only
//                             available on Check-in
//                             Date.</span
//                           ><br /><br /><span
//                             style="
//                               font-family: verdana,
//                                 geneva, sans-serif;
//                               font-size: 10pt;
//                               color: #000000;
//                               background-color: #ffffff;
//                             "
//                             >Have a nice stay!<br /><span
//                               >On behalf of all team at
//                               ${bookingDetails.propertyName}</span
//                             ><br
//                           /></span>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </td>
//             <td>
//               <span style="font-size: 10pt"
//                 >&nbsp;</span
//               >
//             </td>
//           </tr>
//           <tr>
//             <td>
//               <span style="font-size: 10pt"
//                 >&nbsp;</span
//               >
//             </td>
//             <td style="width: 600px">
//               <span style="font-size: 10pt"
//                 >&nbsp;</span
//               >
//             </td>
//             <td>
//               <span style="font-size: 10pt"
//                 >&nbsp;</span
//               >
//             </td>
//           </tr>
//         </tbody>
//       </table>
//       <div id="v1v1v1forwardbody1" dir="ltr">
//         <div
//           id="v1v1v1v1x_forwardbody1"
//           style="
//             font-size: 10pt;
//             font-family: Verdana, Geneva, sans-serif;
//           "
//         >
//           <div
//             id="v1v1v1v1x_v1forwardbody1"
//             style="
//               font-size: 10pt;
//               font-family: Verdana, Geneva, sans-serif;
//             "
//           >
//             <div id="v1v1v1v1x_v1v1forwardbody1">
//               <div
//                 id="v1v1v1v1x_v1v1v1forwardbody1"
//                 style="
//                   font-size: 10pt;
//                   font-family: Verdana, Geneva,
//                     sans-serif;
//                 "
//               >
//                 <div id="v1v1v1v1x_v1v1v1v1signature">
//                   <span style="font-size: 10pt"
//                     ><img
//                       src="https://tracy.srv.wisestamp.com/px/wsid/2ZEVZbjKKajy.png"
//                       alt="__tpx__"
//                   /></span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <style type="text/css">
//         #forwardbody1
//           #forwardbody1
//           #forwardbody1
//           #forwardbody1
//           P {
//           margin-top: 0;
//           margin-bottom: 0;
//         }
//       </style>
//     </div>
//   </div>
// </div>

//       `;
//       let u = await User.find({}).select("email -_id");
//       for (e of u) {
//         let info = await transporter.sendMail({
//           from: `"Wieldy Digital" <${process.env.EMAIL}>`, // sender address
//           to: e.email,
//         //  bcc:"info@metasticworld.com",
//          subject:
//            `Hi ${bookingDetails.firstName}, Here is your Online Check-In Information`,
//            text: emailBody,
//            html: emailBody
//           });
//       }
//        console.log(
//          "Preview URL: %s",
//          nodemailer.getTestMessageUrl(info)
//        );
//     }
//     let transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: 465,
//       secure: true, // true for 465, false for other ports
//       auth: {
//         user: process.env.EMAIL, // sender email address
//         pass: process.env.EMAIL_PASSWORD // sender email password
//       }
//     });

//     let emailBody;
//     if (emailType === "account_creation") {
//       emailBody = `
//       <p>&nbsp;</p>
// <div
//   id="forwardbody1"
//   style="
//     font-size: 10pt;
//     font-family: Verdana, Geneva, sans-serif;
//   "
// >
//   <div id="v1signature"></div>
//   <div
//     id="v1forwardbody1"
//     style="
//       font-size: 10pt;
//       font-family: Verdana, Geneva, sans-serif;
//     "
//   >
//     <div id="v1v1forwardbody1">
//       <div id="v1v1v1_rc_sig"></div>
//       <table
//         style="
//           background-color: #f1f0ee;
//           width: 100%;
//           border-collapse: collapse;
//           border-spacing: 0px;
//           box-sizing: border-box;
//         "
//       >
//         <tbody>
//           <tr>
//             <td>
//               <span style="font-size: 10pt"
//                 >&nbsp;</span
//               >
//             </td>
//             <td style="width: 600px">
//               <span style="font-size: 10pt"
//                 >&nbsp;</span
//               >
//             </td>
//             <td>
//               <span style="font-size: 10pt"
//                 >&nbsp;</span
//               >
//             </td>
//           </tr>
//           <tr>
//             <td>
//               <span style="font-size: 10pt"
//                 >&nbsp;</span
//               >
//             </td>
//             <td style="width: 600px">
//               <table
//                 style="
//                   width: 600px;
//                   border-collapse: collapse;
//                   border-spacing: 0px;
//                   box-sizing: border-box;
//                 "
//                 align="center"
//               >
//                 <tbody>
//                   <tr>
//                     <td
//                       style="
//                         background-color: #ffffff;
//                         width: 100%;
//                       "
//                     >
//                       <div style="padding: 15px">
//                         <p>
//                           <span style="font-size: 14px"
//                             ><img
//                               style="
//                                 width: 600px;
//                                 margin-top: 0px;
//                                 margin-bottom: 0px;
//                               "
//                               src="https://www.metasticworld.com/wp-content/uploads/2024/09/Enjoy-Keyless-Check-in-With-Us.jpg"
//                               width="600"
//                           /></span>
//                         </p>
//                         <div
//                           style="
//                             margin-right: auto;
//                             margin-left: auto;
//                           "
//                         >
//                           <span style="font-size: 14px"
//                             ><br /></span
//                           ><span
//                             style="
//                               font-family: verdana,
//                                 geneva, sans-serif;
//                               font-size: 10pt;
//                               color: #2c363a;
//                               background-color: #ffffff;
//                             "
//                             >Welcome to Wieldy
//                             Digital!</span
//                           ><span
//                             style="font-size: 14px"
//                             ><br /></span
//                           ><span
//                             style="
//                               font-family: verdana,
//                                 geneva, sans-serif;
//                               font-size: 10pt;
//                               color: #2c363a;
//                               background-color: #ffffff;
//                             "
//                             ><br />Thank you for
//                             reservation at ${bookingDetails.propertyName}</span
//                           >
//                           <div
//                             style="
//                               font-family: Verdana,
//                                 Geneva, sans-serif;
//                               font-size: 10pt;
//                             "
//                           >
//                             &nbsp;
//                           </div>
//                           <div
//                             style="
//                               font-family: Verdana,
//                                 Geneva, sans-serif;
//                               font-size: 10pt;
//                             "
//                           >
//                             We have partnered with
//                             ${bookingDetails.propertyName} to
//                             offer you the easiest
//                             check-in and keyless entry
//                             you can imagine!&nbsp;
//                           </div>
//                           <div
//                             style="
//                               font-family: Verdana,
//                                 Geneva, sans-serif;
//                               font-size: 10pt;
//                             "
//                           >
//                             &nbsp;
//                           </div>
//                         </div>
//                         <h3
//                           style="
//                             line-height: 1.5;
//                             margin: 0px auto 16px;
//                             font-family: Lato, Arial,
//                               Helvetica, sans-serif;
//                             font-size: 20px;
//                           "
//                         >
//                           <span style="font-size: 12pt"
//                             >Please follow these 3
//                             steps to access your Mobile
//                             eKey;</span
//                           >
//                         </h3>
//                         <table
//                           style="
//                             text-align: left;
//                             border-radius: 4px;
//                             margin-bottom: 1.4em;
//                             width: 100%;
//                             height: 233.5px;
//                             border-collapse: separate;
//                             border-spacing: 0px;
//                             box-sizing: border-box;
//                             border: 1px solid #c6ceda;
//                           "
//                         >
//                           <tbody>
//                             <tr>
//                               <td
//                                 style="
//                                   text-align: left;
//                                   border-bottom: 1px
//                                     solid #c6ceda;
//                                   width: 100%;
//                                   height: 78.5px;
//                                 "
//                               >
//                                 <div
//                                   style="
//                                     padding: 12px 16px;
//                                   "
//                                 >
//                                   <p
//                                     style="
//                                       text-align: left;
//                                       margin: 0px;
//                                       font-size: 18px;
//                                     "
//                                   >
//                                     <strong
//                                       ><span
//                                         style="
//                                           font-size: 12pt;
//                                         "
//                                         >1. Use your
//                                         email as
//                                         Username&nbsp;</span
//                                       ></strong
//                                     >
//                                   </p>
//                                   <p
//                                     style="
//                                       text-align: left;
//                                       margin: 0px;
//                                     "
//                                   >
//                                     <span
//                                       style="
//                                         font-size: 14px;
//                                       "
//                                       >&nbsp;</span
//                                     >
//                                   </p>
//                                   <p
//                                     style="
//                                       text-align: left;
//                                       margin: 0px;
//                                     "
//                                   >
//                                     <span
//                                       style="
//                                         font-size: 14px;
//                                       "
//                                       >${email}</span
//                                     >
//                                   </p>
//                                 </div>
//                               </td>
//                             </tr>
//                             <tr>
//                               <td
//                                 style="
//                                   text-align: left;
//                                   border-bottom: 1px
//                                     solid #c6ceda;
//                                   width: 100%;
//                                 "
//                               >
//                                 <div
//                                   style="
//                                     padding: 12px 16px;
//                                   "
//                                 >
//                                   <p
//                                     style="
//                                       text-align: left;
//                                       margin: 0px;
//                                       font-size: 18px;
//                                     "
//                                   >
//                                     <strong
//                                       ><span
//                                         style="
//                                           font-size: 12pt;
//                                         "
//                                         >2. Copy the
//                                         below
//                                         Password</span
//                                       ></strong
//                                     >
//                                   </p>
//                                   <p
//                                     style="
//                                       text-align: left;
//                                       margin: 0px;
//                                     "
//                                   >
//                                     <span
//                                       style="
//                                         font-size: 14px;
//                                       "
//                                       >&nbsp;</span
//                                     >
//                                   </p>
//                                   <p
//                                     style="
//                                       text-align: left;
//                                       margin: 0px;
//                                     "
//                                   >
//                                     <span
//                                       style="
//                                         font-size: 14px;
//                                       "
//                                       >${passcode}</span
//                                     >
//                                   </p>
//                                 </div>
//                               </td>
//                             </tr>
//                             <tr>
//                               <td
//                                 style="
//                                   text-align: left;
//                                   width: 100%;
//                                   height: 81px;
//                                 "
//                               >
//                                 <div
//                                   style="
//                                     padding: 12px 16px;
//                                   "
//                                 >
//                                   <p
//                                     style="
//                                       text-align: left;
//                                       margin: 0px;
//                                     "
//                                   >
//                                     <span
//                                       style="
//                                         font-size: 12pt;
//                                       "
//                                       ><strong
//                                         >3. Click on
//                                         below Link to
//                                         enter the
//                                         details</strong
//                                       ></span
//                                     ><span
//                                       style="
//                                         font-size: 14pt;
//                                       "
//                                       ><strong
//                                         ><br /></strong></span
//                                     ><span
//                                       style="
//                                         font-size: 14px;
//                                       "
//                                       ><br /><a
//                                         id="v1v1v1v1OWA75dc1713-15a4-d5fc-192a-a90da23147d2"
//                                         class="v1v1v1v1OWAAutoLink"
//                                         style="
//                                           margin-top: 0px;
//                                           margin-bottom: 0px;
//                                         "
//                                         href="https://app.wieldyportal.co.uk"
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         >https://app.wieldyportal.co.uk</a
//                                       ></span
//                                     >
//                                   </p>
//                                 </div>
//                               </td>
//                             </tr>
//                           </tbody>
//                         </table>
//                         <div
//                           style="
//                             margin-right: auto;
//                             margin-left: auto;
//                           "
//                         >
//                           <div
//                             style="
//                               font-family: Verdana,
//                                 Geneva, sans-serif;
//                               font-size: 14px;
//                             "
//                           >
//                             <span
//                               style="font-size: 10pt"
//                               >Simple! now you are
//                               checked in, please enjoy
//                               your&nbsp;keyless access
//                               to your room. If you need
//                               to share your webkey
//                               to&nbsp;other&nbsp;people
//                               in&nbsp;your&nbsp;party
//                               please use the "share"
//                               facility.</span
//                             >
//                           </div>
//                           <div
//                             style="
//                               font-family: Verdana,
//                                 Geneva, sans-serif;
//                               font-size: 14px;
//                             "
//                           >
//                             &nbsp;
//                           </div>
//                           <h3
//                             style="
//                               line-height: 1.5;
//                               margin: 0px auto 16px;
//                               font-family: Lato, Arial,
//                                 Helvetica, sans-serif;
//                               font-size: 20px;
//                             "
//                           >
//                             <span
//                               style="font-size: 12pt"
//                               >Check-In &amp; Check-Out
//                               Details:</span
//                             >
//                           </h3>
//                           <table
//                             style="
//                               text-align: left;
//                               margin-bottom: 0em;
//                               width: 100%;
//                               border-collapse: separate;
//                               border-spacing: 0px;
//                               box-sizing: border-box;
//                             "
//                           >
//                             <tbody>
//                               <tr>
//                                 <td>
//                                   <table
//                                     style="
//                                       text-align: left;
//                                       border-radius: 4px;
//                                       margin-bottom: 1.4em;
//                                       width: 100%;
//                                       border-collapse: separate;
//                                       border-spacing: 0px;
//                                       box-sizing: border-box;
//                                       border: 1px solid
//                                         #c6ceda;
//                                     "
//                                   >
//                                     <tbody>
//                                       <tr>
//                                         <td
//                                           style="
//                                             text-align: left;
//                                             border-bottom: 1px
//                                               solid
//                                               #c6ceda;
//                                           "
//                                         >
//                                           <div
//                                             style="
//                                               text-align: left;
//                                               padding: 12px
//                                                 16px;
//                                               font-family: Verdana,
//                                                 Geneva,
//                                                 sans-serif;
//                                               font-size: 14px;
//                                             "
//                                           >
//                                             <img
//                                               style="
//                                                 width: 12px;
//                                                 height: 12px;
//                                                 margin-right: 10px;
//                                               "
//                                               src="https://app.littlehotelier.com//legacy-assets/arrow-down.png"
//                                               width="12"
//                                               height="12"
//                                             />&nbsp;Check-in
//                                           </div>
//                                         </td>
//                                       </tr>
//                                       <tr>
//                                         <td>
//                                           <div
//                                             style="
//                                               text-align: left;
//                                               padding: 12px
//                                                 16px;
//                                               font-family: Verdana,
//                                                 Geneva,
//                                                 sans-serif;
//                                             "
//                                           >
//                                             <span
//                                               style="
//                                                 font-size: 18px;
//                                               "
//                                               ><strong
//                                                 >${bookingDetails.checkInDate}</strong
//                                               ><br /></span
//                                             ><span
//                                               style="
//                                                 font-size: 8pt;
//                                               "
//                                               >Time:
//                                               ${bookingDetails.defaultCheckInTime}</span
//                                             >
//                                           </div>
//                                         </td>
//                                       </tr>
//                                     </tbody>
//                                   </table>
//                                 </td>
//                                 <td>
//                                   <table
//                                     style="
//                                       text-align: left;
//                                       border-radius: 4px;
//                                       margin-bottom: 1.4em;
//                                       width: 100%;
//                                       border-collapse: separate;
//                                       border-spacing: 0px;
//                                       box-sizing: border-box;
//                                       border: 1px solid
//                                         #c6ceda;
//                                     "
//                                   >
//                                     <tbody>
//                                       <tr>
//                                         <td
//                                           style="
//                                             text-align: left;
//                                             border-bottom: 1px
//                                               solid
//                                               #c6ceda;
//                                           "
//                                         >
//                                           <div
//                                             style="
//                                               text-align: left;
//                                               padding: 12px
//                                                 16px;
//                                               font-family: Verdana,
//                                                 Geneva,
//                                                 sans-serif;
//                                               font-size: 14px;
//                                             "
//                                           >
//                                             <img
//                                               style="
//                                                 width: 12px;
//                                                 height: 12px;
//                                                 margin-right: 10px;
//                                               "
//                                               src="https://app.littlehotelier.com//legacy-assets/arrow-up.png"
//                                               width="12"
//                                               height="12"
//                                             />&nbsp;Check-out
//                                           </div>
//                                         </td>
//                                       </tr>
//                                       <tr>
//                                         <td>
//                                           <div
//                                             style="
//                                               text-align: left;
//                                               padding: 12px
//                                                 16px;
//                                               font-family: Verdana,
//                                                 Geneva,
//                                                 sans-serif;
//                                             "
//                                           >
//                                             <span
//                                               style="
//                                                 font-size: 18px;
//                                               "
//                                               ><strong
//                                                 >${bookingDetails.checkOutDate}</strong
//                                               ><br /></span
//                                             ><span
//                                               style="
//                                                 font-size: 8pt;
//                                               "
//                                               >Time:
//                                               ${bookingDetails.defaultCheckOutTime}</span
//                                             >
//                                           </div>
//                                         </td>
//                                       </tr>
//                                     </tbody>
//                                   </table>
//                                 </td>
//                               </tr>
//                             </tbody>
//                           </table>
//                         </div>
//                         <div
//                           style="
//                             line-height: 1.3;
//                             font-family: 'Open Sans',
//                               sans-serif;
//                             font-size: 15px;
//                             color: #0a0a0a;
//                           "
//                         >
//                           <span
//                             style="
//                               font-family: verdana,
//                                 geneva, sans-serif;
//                               font-size: 10pt;
//                               color: #3e3c3c;
//                             "
//                             >Please use above
//                             credentials for Keyless
//                             Check-in using Passcode or
//                             Webkey. If you face any
//                             issue while Check-in, you
//                             can mail us at ${bookingDetails.propertyEmail}<br /><strong
//                               ><br />Note:</strong
//                             >
//                             Unlock details only
//                             available on Check-in
//                             Date.</span
//                           ><br /><br /><span
//                             style="
//                               font-family: verdana,
//                                 geneva, sans-serif;
//                               font-size: 10pt;
//                               color: #000000;
//                               background-color: #ffffff;
//                             "
//                             >Have a nice stay!<br /><span
//                               >On behalf of all team at
//                               ${bookingDetails.propertyName}</span
//                             ><br
//                           /></span>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </td>
//             <td>
//               <span style="font-size: 10pt"
//                 >&nbsp;</span
//               >
//             </td>
//           </tr>
//           <tr>
//             <td>
//               <span style="font-size: 10pt"
//                 >&nbsp;</span
//               >
//             </td>
//             <td style="width: 600px">
//               <span style="font-size: 10pt"
//                 >&nbsp;</span
//               >
//             </td>
//             <td>
//               <span style="font-size: 10pt"
//                 >&nbsp;</span
//               >
//             </td>
//           </tr>
//         </tbody>
//       </table>
//       <div id="v1v1v1forwardbody1" dir="ltr">
//         <div
//           id="v1v1v1v1x_forwardbody1"
//           style="
//             font-size: 10pt;
//             font-family: Verdana, Geneva, sans-serif;
//           "
//         >
//           <div
//             id="v1v1v1v1x_v1forwardbody1"
//             style="
//               font-size: 10pt;
//               font-family: Verdana, Geneva, sans-serif;
//             "
//           >
//             <div id="v1v1v1v1x_v1v1forwardbody1">
//               <div
//                 id="v1v1v1v1x_v1v1v1forwardbody1"
//                 style="
//                   font-size: 10pt;
//                   font-family: Verdana, Geneva,
//                     sans-serif;
//                 "
//               >
//                 <div id="v1v1v1v1x_v1v1v1v1signature">
//                   <span style="font-size: 10pt"
//                     ><img
//                       src="https://tracy.srv.wisestamp.com/px/wsid/2ZEVZbjKKajy.png"
//                       alt="__tpx__"
//                   /></span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <style type="text/css">
//         #forwardbody1
//           #forwardbody1
//           #forwardbody1
//           #forwardbody1
//           P {
//           margin-top: 0;
//           margin-bottom: 0;
//         }
//       </style>
//     </div>
//   </div>
// </div>

//       `;

//       // -------

// //       emailBody = `
// //       <div id="_rc_sig"></div>
// // <table
// //   style="
// //     background-color: #f1f0ee;
// //     width: 100%;
// //     border-collapse: collapse;
// //     border-spacing: 0px;
// //     box-sizing: border-box;
// //   "
// // >
// //   <tbody>
// //     <tr>
// //       <td>
// //         <span style="font-size: 10pt">&nbsp;</span>
// //       </td>
// //       <td style="width: 600px">
// //         <span style="font-size: 10pt">&nbsp;</span>
// //       </td>
// //       <td>
// //         <span style="font-size: 10pt">&nbsp;</span>
// //       </td>
// //     </tr>
// //     <tr>
// //       <td>
// //         <span style="font-size: 10pt">&nbsp;</span>
// //       </td>
// //       <td style="width: 600px">
// //         <table
// //           style="
// //             width: 600px;
// //             border-collapse: collapse;
// //             border-spacing: 0px;
// //             box-sizing: border-box;
// //           "
// //           align="center"
// //         >
// //           <tbody>
// //             <tr>
// //               <td
// //                 style="
// //                   background-color: #ffffff;
// //                   width: 100%;
// //                 "
// //               >
// //                 <div style="padding: 15px">
// //                   <p>
// //                     <span style="font-size: 14px"
// //                       ><img
// //                         style="
// //                           width: 600px;
// //                           margin-top: 0px;
// //                           margin-bottom: 0px;
// //                         "
// //                         src="https://www.metasticworld.com/wp-content/uploads/2024/09/Enjoy-Keyless-Check-in-With-Us.jpg"
// //                         width="600"
// //                     /></span>
// //                   </p>
// //                   <div
// //                     style="
// //                       margin-right: auto;
// //                       margin-left: auto;
// //                     "
// //                   >
// //                     <span style="font-size: 14px"
// //                       ><br /></span
// //                     ><span
// //                       style="
// //                         font-family: verdana, geneva,
// //                           sans-serif;
// //                         font-size: 10pt;
// //                         color: #2c363a;
// //                         background-color: #ffffff;
// //                       "
// //                       >Welcome to Wieldy Digital!</span
// //                     ><span style="font-size: 14px"
// //                       ><br /></span
// //                     ><span
// //                       style="
// //                         font-family: verdana, geneva,
// //                           sans-serif;
// //                         font-size: 10pt;
// //                         color: #2c363a;
// //                         background-color: #ffffff;
// //                       "
// //                       ><br />Thank you, your
// //                       reservation at ${bookingDetails.propertyName}
// //                       has been confirmed.</span
// //                     >
// //                     <div
// //                       style="
// //                         font-family: Verdana, Geneva,
// //                           sans-serif;
// //                         font-size: 10pt;
// //                       "
// //                     >
// //                       &nbsp;
// //                     </div>
// //                     <div
// //                       style="
// //                         font-family: Verdana, Geneva,
// //                           sans-serif;
// //                         font-size: 10pt;
// //                       "
// //                     >
// //                       We have partnered with ${bookingDetails.propertyName} to offer you the easiest
// //                       check-in and keyless entry you
// //                       can imagine! Who needs clunky
// //                       keys and long waits at reception
// //                       these days!
// //                     </div>
// //                     <div
// //                       style="
// //                         font-family: Verdana, Geneva,
// //                           sans-serif;
// //                         font-size: 10pt;
// //                       "
// //                     >
// //                       &nbsp;
// //                     </div>
// //                     <div
// //                       style="
// //                         font-family: Verdana, Geneva,
// //                           sans-serif;
// //                         font-size: 10pt;
// //                       "
// //                     >
// //                       No need to collect a keycard from
// //                       reception, simply check-in online
// //                       and go straight to your room and
// //                       open your door with a webkey on
// //                       your smartphone.
// //                     </div>
// //                   </div>
// //                   <div
// //                     style="
// //                       margin-right: auto;
// //                       margin-left: auto;
// //                       font-size: 14px;
// //                     "
// //                   >
// //                     <br /><br />
// //                   </div>
// //                   <h3
// //                     style="
// //                       line-height: 1.5;
// //                       margin: 0px auto 16px;
// //                       font-family: Lato, Arial,
// //                         Helvetica, sans-serif;
// //                       font-size: 20px;
// //                     "
// //                   >
// //                     <span style="font-size: 14pt"
// //                       >Follow these 3 steps for Keyless
// //                       Check-in:</span
// //                     >
// //                   </h3>
// //                   <table
// //                     style="
// //                       text-align: left;
// //                       border-radius: 4px;
// //                       margin-bottom: 1.4em;
// //                       width: 100%;
// //                       height: 233.5px;
// //                       border-collapse: separate;
// //                       border-spacing: 0px;
// //                       box-sizing: border-box;
// //                       border: 1px solid #c6ceda;
// //                     "
// //                   >
// //                     <tbody>
// //                       <tr>
// //                         <td
// //                           style="
// //                             text-align: left;
// //                             border-bottom: 1px solid
// //                               #c6ceda;
// //                             width: 100%;
// //                             height: 78.5px;
// //                           "
// //                         >
// //                           <div
// //                             style="padding: 12px 16px"
// //                           >
// //                             <p
// //                               style="
// //                                 text-align: left;
// //                                 margin: 0px;
// //                                 font-size: 18px;
// //                               "
// //                             >
// //                               <strong
// //                                 ><span
// //                                   style="
// //                                     font-size: 12pt;
// //                                   "
// //                                   >1. Use your email as
// //                                   Username&nbsp;</span
// //                                 ></strong
// //                               >
// //                             </p>
// //                             <p
// //                               style="
// //                                 text-align: left;
// //                                 margin: 0px;
// //                               "
// //                             >
// //                               <span
// //                                 style="font-size: 14px"
// //                                 >&nbsp;</span
// //                               >
// //                             </p>
// //                             <p
// //                               style="
// //                                 text-align: left;
// //                                 margin: 0px;
// //                               "
// //                             >
// //                               <span
// //                                 style="font-size: 14px"
// //                                 >${email}</span
// //                               >
// //                             </p>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                       <tr>
// //                         <td
// //                           style="
// //                             text-align: left;
// //                             border-bottom: 1px solid
// //                               #c6ceda;
// //                             width: 100%;
// //                           "
// //                         >
// //                           <div
// //                             style="padding: 12px 16px"
// //                           >
// //                             <p
// //                               style="
// //                                 text-align: left;
// //                                 margin: 0px;
// //                                 font-size: 18px;
// //                               "
// //                             >
// //                               <strong
// //                                 ><span
// //                                   style="
// //                                     font-size: 12pt;
// //                                   "
// //                                   >2. Copy the below
// //                                   Password</span
// //                                 ></strong
// //                               >
// //                             </p>
// //                             <p
// //                               style="
// //                                 text-align: left;
// //                                 margin: 0px;
// //                               "
// //                             >
// //                               <span
// //                                 style="font-size: 14px"
// //                                 >&nbsp;</span
// //                               >
// //                             </p>
// //                             <p
// //                               style="
// //                                 text-align: left;
// //                                 margin: 0px;
// //                               "
// //                             >
// //                               <span
// //                                 style="font-size: 14px"
// //                                 >${passcode}</span
// //                               >
// //                             </p>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                       <tr>
// //                         <td
// //                           style="
// //                             text-align: left;
// //                             width: 100%;
// //                             height: 81px;
// //                           "
// //                         >
// //                           <div
// //                             style="padding: 12px 16px"
// //                           >
// //                             <p
// //                               style="
// //                                 text-align: left;
// //                                 margin: 0px;
// //                               "
// //                             >
// //                               <span
// //                                 style="font-size: 12pt"
// //                                 ><strong
// //                                   >3. Click on below
// //                                   Link to enter the
// //                                   details</strong
// //                                 ></span
// //                               ><span
// //                                 style="font-size: 14pt"
// //                                 ><strong
// //                                   ><br /></strong></span
// //                               ><span
// //                                 style="font-size: 14px"
// //                                 ><br /><a
// //                                   id="v1OWA75dc1713-15a4-d5fc-192a-a90da23147d2"
// //                                   class="v1OWAAutoLink"
// //                                   style="
// //                                     margin-top: 0px;
// //                                     margin-bottom: 0px;
// //                                   "
// //                                   href="https://app.wieldyportal.co.uk"
// //                                   target="_blank"
// //                                   rel="noopener noreferrer"
// //                                   >https://app.wieldyportal.co.uk</a
// //                                 ></span
// //                               >
// //                             </p>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     </tbody>
// //                   </table>
// //                   <div
// //                     style="
// //                       margin-right: auto;
// //                       margin-left: auto;
// //                     "
// //                   >
// //                     <div
// //                       style="
// //                         font-family: Verdana, Geneva,
// //                           sans-serif;
// //                         font-size: 14px;
// //                       "
// //                     >
// //                       Simple! now you are checked in,
// //                       please enjoy your&nbsp;keyless
// //                       access to your room. If you need
// //                       to share your webkey
// //                       to&nbsp;other&nbsp;people
// //                       in&nbsp;your&nbsp;party please
// //                       use the "share" facility.
// //                     </div>
// //                     <div
// //                       style="
// //                         font-family: Verdana, Geneva,
// //                           sans-serif;
// //                         font-size: 14px;
// //                       "
// //                     >
// //                       &nbsp;
// //                     </div>
// //                     <h3
// //                       style="
// //                         line-height: 1.5;
// //                         margin: 0px auto 16px;
// //                         font-family: Lato, Arial,
// //                           Helvetica, sans-serif;
// //                         font-size: 20px;
// //                       "
// //                     >
// //                       <span
// //                         style="font-size: 18.6667px"
// //                         >Check-In &amp; Check-Out
// //                         Details:</span
// //                       >
// //                     </h3>
// //                     <table
// //                       style="
// //                         text-align: left;
// //                         margin-bottom: 0em;
// //                         width: 100%;
// //                         border-collapse: separate;
// //                         border-spacing: 0px;
// //                         box-sizing: border-box;
// //                       "
// //                     >
// //                       <tbody>
// //                         <tr>
// //                           <td>
// //                             <table
// //                               style="
// //                                 text-align: left;
// //                                 border-radius: 4px;
// //                                 margin-bottom: 1.4em;
// //                                 width: 100%;
// //                                 border-collapse: separate;
// //                                 border-spacing: 0px;
// //                                 box-sizing: border-box;
// //                                 border: 1px solid
// //                                   #c6ceda;
// //                               "
// //                             >
// //                               <tbody>
// //                                 <tr>
// //                                   <td
// //                                     style="
// //                                       text-align: left;
// //                                       border-bottom: 1px
// //                                         solid #c6ceda;
// //                                     "
// //                                   >
// //                                     <div
// //                                       style="
// //                                         text-align: left;
// //                                         padding: 12px
// //                                           16px;
// //                                         font-family: Verdana,
// //                                           Geneva,
// //                                           sans-serif;
// //                                         font-size: 14px;
// //                                       "
// //                                     >
// //                                       <img
// //                                         style="
// //                                           width: 12px;
// //                                           height: 12px;
// //                                           margin-right: 10px;
// //                                         "
// //                                         src="https://app.littlehotelier.com//legacy-assets/arrow-down.png"
// //                                         width="12"
// //                                         height="12"
// //                                       />&nbsp;Check-in
// //                                     </div>
// //                                   </td>
// //                                 </tr>
// //                                 <tr>
// //                                   <td>
// //                                     <div
// //                                       style="
// //                                         text-align: left;
// //                                         padding: 12px
// //                                           16px;
// //                                         font-family: Verdana,
// //                                           Geneva,
// //                                           sans-serif;
// //                                       "
// //                                     >
// //                                       <span
// //                                         style="
// //                                           font-size: 18px;
// //                                         "
// //                                         ><strong
// //                                           >${bookingDetails.checkInDate}</strong
// //                                         ><br /></span
// //                                       ><span
// //                                         style="
// //                                           font-size: 8pt;
// //                                         "
// //                                         >Time:
// //                                         ${bookingDetails.defaultCheckInTime}</span
// //                                       >
// //                                     </div>
// //                                   </td>
// //                                 </tr>
// //                               </tbody>
// //                             </table>
// //                           </td>
// //                           <td>
// //                             <table
// //                               style="
// //                                 text-align: left;
// //                                 border-radius: 4px;
// //                                 margin-bottom: 1.4em;
// //                                 width: 100%;
// //                                 border-collapse: separate;
// //                                 border-spacing: 0px;
// //                                 box-sizing: border-box;
// //                                 border: 1px solid
// //                                   #c6ceda;
// //                               "
// //                             >
// //                               <tbody>
// //                                 <tr>
// //                                   <td
// //                                     style="
// //                                       text-align: left;
// //                                       border-bottom: 1px
// //                                         solid #c6ceda;
// //                                     "
// //                                   >
// //                                     <div
// //                                       style="
// //                                         text-align: left;
// //                                         padding: 12px
// //                                           16px;
// //                                         font-family: Verdana,
// //                                           Geneva,
// //                                           sans-serif;
// //                                         font-size: 14px;
// //                                       "
// //                                     >
// //                                       <img
// //                                         style="
// //                                           width: 12px;
// //                                           height: 12px;
// //                                           margin-right: 10px;
// //                                         "
// //                                         src="https://app.littlehotelier.com//legacy-assets/arrow-up.png"
// //                                         width="12"
// //                                         height="12"
// //                                       />&nbsp;Check-out
// //                                     </div>
// //                                   </td>
// //                                 </tr>
// //                                 <tr>
// //                                   <td>
// //                                     <div
// //                                       style="
// //                                         text-align: left;
// //                                         padding: 12px
// //                                           16px;
// //                                         font-family: Verdana,
// //                                           Geneva,
// //                                           sans-serif;
// //                                       "
// //                                     >
// //                                       <span
// //                                         style="
// //                                           font-size: 18px;
// //                                         "
// //                                         ><strong
// //                                           >${bookingDetails.checkOutDate}</strong
// //                                         ><br /></span
// //                                       ><span
// //                                         style="
// //                                           font-size: 8pt;
// //                                         "
// //                                         >Time:
// //                                         ${bookingDetails.defaultCheckOutTime}</span
// //                                       >
// //                                     </div>
// //                                   </td>
// //                                 </tr>
// //                               </tbody>
// //                             </table>
// //                           </td>
// //                         </tr>
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                   <div
// //                     style="
// //                       line-height: 1.3;
// //                       font-family: 'Open Sans',
// //                         sans-serif;
// //                       font-size: 15px;
// //                       color: #0a0a0a;
// //                     "
// //                   >
// //                     <span
// //                       style="
// //                         font-family: verdana, geneva,
// //                           sans-serif;
// //                         font-size: 10pt;
// //                         color: #3e3c3c;
// //                       "
// //                       >Please use above credentials for
// //                       Keyless Check-in using Passcode
// //                       or Webkey. If you face any issue
// //                       while Check-in, you can mail us
// //                       at
// //                       <a
// //                         id="v1OWA426e3e68-b105-440d-f57b-67bbcab7ca33"
// //                         class="v1OWAAutoLink"
// //                         style="color: #3e3c3c"
// //                         href="mailto:support@wieldyportal.co.uk"
// //                         rel="noreferrer"
// //                       >
// //                         support@wieldyportal.co.uk</a
// //                       >&nbsp;<br /><strong
// //                         >Note:</strong
// //                       >&nbsp;You can only see your
// //                       unlocking details after check-in
// //                       Date &amp; Time.</span
// //                     ><br /><br /><span
// //                       style="
// //                         font-family: verdana, geneva,
// //                           sans-serif;
// //                         font-size: 10pt;
// //                         color: #000000;
// //                         background-color: #ffffff;
// //                       "
// //                       >Thank you for choosing Wieldy
// //                       Digital. Have a nice stay!</span
// //                     >
// //                   </div>
// //                 </div>
// //               </td>
// //             </tr>
// //           </tbody>
// //         </table>
// //       </td>
// //       <td>
// //         <span style="font-size: 10pt">&nbsp;</span>
// //       </td>
// //     </tr>
// //     <tr>
// //       <td>
// //         <span style="font-size: 10pt">&nbsp;</span>
// //       </td>
// //       <td style="width: 600px">
// //         <span style="font-size: 10pt">&nbsp;</span>
// //       </td>
// //       <td>
// //         <span style="font-size: 10pt">&nbsp;</span>
// //       </td>
// //     </tr>
// //   </tbody>
// // </table>
// // <div id="forwardbody1" dir="ltr">
// //   <div
// //     id="v1x_forwardbody1"
// //     style="
// //       font-size: 10pt;
// //       font-family: Verdana, Geneva, sans-serif;
// //     "
// //   >
// //     <div
// //       id="v1x_v1forwardbody1"
// //       style="
// //         font-size: 10pt;
// //         font-family: Verdana, Geneva, sans-serif;
// //       "
// //     >
// //       <div id="v1x_v1v1forwardbody1">
// //         <div
// //           id="v1x_v1v1v1forwardbody1"
// //           style="
// //             font-size: 10pt;
// //             font-family: Verdana, Geneva, sans-serif;
// //           "
// //         >
// //           <div id="v1x_v1v1v1v1signature">
// //             <span style="font-size: 10pt"
// //               ><img
// //                 src="https://tracy.srv.wisestamp.com/px/wsid/2ZEVZbjKKajy.png"
// //                 alt="__tpx__"
// //             /></span>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   </div>
// // </div>
// // <style type="text/css">
// //   #forwardbody1 P {
// //     margin-top: 0;
// //     margin-bottom: 0;
// //   }
// // </style>
//       //       `;

//       // -------------

//       // emailBody = `
//       //            <p>Welcome to Wieldy Digital!</p>

//       //             <p>We are your Online Room Check-In Partner. Experience seamless room check-in without any physical key.</p>

//       //             <p>Login with the given link: <a href="https://app.wieldyportal.co.uk/">https://app.wieldyportal.co.uk/</a></p>

//       //             <p>Use the credentials below to login:</p>
//       //             <ul>
//       //               <li>Email: ${email}</li>
//       //               <li>Password: ${passcode}</li>
//       //             </ul>

//       //             <p>Thank you for choosing Wieldy Digital. Have a nice stay!</p>
//       //       `;

//       // ------
//       // emailBody = `
//       //       Welcome to Wieldy Digital!

//       //       We are thrilled to be your online room check-in partner, offering you a seamless and keyless entry experience.

//       //       Your Room Information:
//       //       `;
//       // let roomPasscodes = passcode.split(", ");

//       // roomPasscodes.forEach((entry) => {
//       //   // Split each entry by `|` to handle room-passcode pairs and "LockId"
//       //   let [roomInfo, lockIdInfo] = entry.split("|");

//       //   // Split roomInfo by `=` to get room number and passcode
//       //   let [roomNumber, roomPasscode] =
//       //     roomInfo.split("=");

//       //   // Only include valid room-passcode pairs in the email
//       //   if (roomNumber && roomPasscode) {
//       //     emailBody += `
//       //       Room Number: ${roomNumber}
//       //       Passcode: ${roomPasscode}

//       //       Enjoy your stay with us!
//       //   `;
//       //   }
//       // });

//       //-----------------

//       //   emailBody = `
//       //      Welcome to Wieldy Digital!

//       //      We are thrilled to be your online room check-in partner, offering you a seamless and keyless entry experience.

//       //     You will receive passcode before 2hr prior check-in time.

//       //      Enjoy your stay with us!

//       //   `;
//     } else if (emailType === "forgot_password") {
//       emailBody = `
//                 Dear User,

//                 We received a request to reset your password. Please use the following One-Time Passcode (OTP) to reset your password:

//                 **OTP:** ${passcode}

//                 This OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email.

//                 Best regards,

//                 The Support Team,
//                 Wieldy
//             `;
//     } else if (emailType === "Property_Registration") {
//       emailBody = `
//                 Dear ${bookingDetails.name},

//                 We have successfully registered your hotel with the Wieldy app.

//                 For further assistance, our team will contact you soon.

//                 Best regards,

//                 The Support Team
//                 Wieldy
//             `;
//     } else if (emailType === "checkIn_update") {
//       emailBody = `
//                 <div
//                   id="forwardbody1"
//                   style="background-color: #f1f0ee"
//                 >
//                   <table
//                     border="0"
//                     width="100%"
//                     cellspacing="0"
//                     cellpadding="0"
//                     bgcolor="#F1F0EE"
//                   >
//                     <tbody>
//                       <tr>
//                         <td>&nbsp;</td>
//                         <td width="600">&nbsp;</td>
//                         <td>&nbsp;</td>
//                       </tr>
//                       <tr>
//                         <td>&nbsp;</td>
//                         <td width="600">
//                           <table
//                             border="0"
//                             width="600"
//                             cellspacing="0"
//                             cellpadding="10"
//                             align="center"
//                           >
//                             <tbody>
//                               <tr>
//                                 <td
//                                   style="padding: 0"
//                                   bgcolor="#FFFFFF"
//                                   width="100%"
//                                 >
//                                   <div
//                                     style="
//                                 padding: 15px;
//                                 font-size: 14px;
//                               "
//                                   >
//                                     <p>
//                                       <img
//                                         class="v1header"
//                                         src="https://www.metasticworld.com/wp-content/uploads/2024/09/Enjoy-Keyless-Check-in-With-Us.jpg"
//                                         width="600px"
//                                       />
//                                     </p>
//                                     <div
//                                       style="
//                                   margin-left: auto !important;
//                                   margin-right: auto !important;
//                                 "
//                                     >
//                                       <img
//                                         style="margin-right: 10px"
//                                         src="https://app.littlehotelier.com//legacy-assets/tick-green.png"
//                                         width="20px"
//                                         height="20px"
//                                       />
//                                       <h2
//                                         style="
//                                     color: inherit;
//                                     font-family: Lato, Arial,
//                                       Helvetica, sans-serif;
//                                     font-weight: bold;
//                                     line-height: 1.5;
//                                     word-wrap: normal;
//                                     font-size: 24px;
//                                     margin: 0 0 12px;
//                                     padding: 0;
//                                     display: inline;
//                                   "
//                                       >
//                                         Guest Check-In
//                                         Confirmation
//                                       </h2>
//                                     </div>
//                                     <p
//                                       style="
//                                   color: #1c1d20;
//                                   font-family: Lato, Arial,
//                                     Helvetica, sans-serif;
//                                   font-weight: normal;
//                                   line-height: 1.5;
//                                   font-size: 14px;
//                                   padding-top: 15px;
//                                 "
//                                     >
//                                       This is to inform you that
//                                       Guest Name:
//                                       <strong>
//                                         ${
//                                           bookingDetails.firstName
//                                         }
//                                       </strong>
//                                       Guest Email:
//                                       <strong>
//                                         ${
//                                           bookingDetails.customerEmail
//                                         }
//                                       </strong>
//                                       whose Booking Reference
//                                       Number is
//                                       <strong>
//                                         ${
//                                           bookingDetails.reservationid
//                                         }
//                                       </strong>
//                                       has just Checked-in at your
//                                       Property:
//                                       <strong>
//                                         ${
//                                           bookingDetails.propertyName
//                                         }
//                                       </strong>
//                                       through Wieldy App.
//                                     </p>
//                                     <br />
//                                     <h3
//                                       style="
//                                   color: inherit;
//                                   font-family: Lato, Arial,
//                                     Helvetica, sans-serif;
//                                   font-weight: bold;
//                                   line-height: 1.5;
//                                   word-wrap: normal;
//                                   font-size: 20px;
//                                   margin: 0 auto 16px;
//                                   padding: 0;
//                                 "
//                                     >
//                                       <span
//                                         style="
//                                     color: inherit;
//                                     background-color: #ffffff;
//                                   "
//                                       >
//                                         Report us
//                                       </span>
//                                     </h3>
//                                     <div
//                                       style="
//                                   color: #0a0a0a;
//                                   font-family: Open Sans,
//                                     sans-serif;
//                                   font-size: 15px;
//                                   line-height: 1.3;
//                                 "
//                                     >
//                                       In case if you found this
//                                       information is incorrect or
//                                       this booking not found in
//                                       your system. Please report
//                                       this booking at
//                                       <a
//                                         href="mailto:info@craigielawgolfclub.com"
//                                         rel="noreferrer"
//                                       >
//                                         support@wieldyportal.co.uk
//                                       </a>
//                                     </div>
//                                   </div>
//                                 </td>
//                               </tr>
//                             </tbody>
//                           </table>
//                         </td>
//                         <td>&nbsp;</td>
//                       </tr>
//                       <tr>
//                         <td>&nbsp;</td>
//                         <td width="600">&nbsp;</td>
//                         <td>&nbsp;</td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>;
//             `;

//     } else if (emailType === "key_sharing") {
//       emailBody = `
//       <div id="_rc_sig"></div>
// <table
//   style="
//     background-color: #f1f0ee;
//     width: 100%;
//     border-collapse: collapse;
//     border-spacing: 0px;
//     box-sizing: border-box;
//   "
// >
//   <tbody>
//     <tr>
//       <td>
//         <span style="font-size: 10pt">&nbsp;</span>
//       </td>
//       <td style="width: 600px">
//         <span style="font-size: 10pt">&nbsp;</span>
//       </td>
//       <td>
//         <span style="font-size: 10pt">&nbsp;</span>
//       </td>
//     </tr>
//     <tr>
//       <td>
//         <span style="font-size: 10pt">&nbsp;</span>
//       </td>
//       <td style="width: 600px">
//         <table
//           style="
//             width: 600px;
//             border-collapse: collapse;
//             border-spacing: 0px;
//             box-sizing: border-box;
//           "
//           align="center"
//         >
//           <tbody>
//             <tr>
//               <td
//                 style="
//                   background-color: #ffffff;
//                   width: 100%;
//                 "
//               >
//                 <div style="padding: 15px">
//                   <p>
//                     <span style="font-size: 14px"
//                       ><img
//                         style="
//                           width: 600px;
//                           margin-top: 0px;
//                           margin-bottom: 0px;
//                         "
//                         src="https://www.metasticworld.com/wp-content/uploads/2024/09/Enjoy-Keyless-Check-in-With-Us.jpg"
//                         width="600"
//                     /></span>
//                   </p>
//                   <div
//                     style="
//                       margin-right: auto;
//                       margin-left: auto;
//                     "
//                   >
//                     <span style="font-size: 14px"
//                       ><br /></span
//                     ><span
//                       style="
//                         font-family: verdana, geneva,
//                           sans-serif;
//                         font-size: 10pt;
//                         color: #2c363a;
//                         background-color: #ffffff;
//                       "
//                       >Welcome to Wieldy Digital!</span
//                     ><span style="font-size: 14px"
//                       ><br /></span
//                     ><span
//                       style="
//                         font-family: verdana, geneva,
//                           sans-serif;
//                         font-size: 10pt;
//                         color: #2c363a;
//                         background-color: #ffffff;
//                       "
//                       ><br />Hi ${bookingDetails.firstName}
//                       <br/>
//                           ${senderName} has shared you the Booking Details for Keyless Check-in</span
//                     >
//                     <div
//                       style="
//                         font-family: Verdana, Geneva,
//                           sans-serif;
//                         font-size: 10pt;
//                       "
//                     >
//                       &nbsp;
//                     </div>
//                     <div
//                       style="
//                         font-family: Verdana, Geneva,
//                           sans-serif;
//                         font-size: 10pt;
//                       "
//                     >
//                       We have partnered with ${bookingDetails.propertyName} to offer you the easiest
//                       check-in and keyless entry you
//                       can imagine! Who needs clunky
//                       keys and long waits at reception
//                       these days!
//                     </div>
//                     <div
//                       style="
//                         font-family: Verdana, Geneva,
//                           sans-serif;
//                         font-size: 10pt;
//                       "
//                     >
//                       &nbsp;
//                     </div>
//                     <div
//                       style="
//                         font-family: Verdana, Geneva,
//                           sans-serif;
//                         font-size: 10pt;
//                       "
//                     >
//                       No need to collect a keycard from
//                       reception, simply check-in online
//                       and go straight to your room and
//                       open your door with a webkey on
//                       your smartphone.
//                     </div>
//                   </div>
//                   <div
//                     style="
//                       margin-right: auto;
//                       margin-left: auto;
//                       font-size: 14px;
//                     "
//                   >
//                     <br /><br />
//                   </div>
//                   <h3
//                     style="
//                       line-height: 1.5;
//                       margin: 0px auto 16px;
//                       font-family: Lato, Arial,
//                         Helvetica, sans-serif;
//                       font-size: 20px;
//                     "
//                   >
//                     <span style="font-size: 14pt"
//                       >Follow these 3 steps for Keyless
//                       Check-in:</span
//                     >
//                   </h3>
//                   <table
//                     style="
//                       text-align: left;
//                       border-radius: 4px;
//                       margin-bottom: 1.4em;
//                       width: 100%;
//                       height: 233.5px;
//                       border-collapse: separate;
//                       border-spacing: 0px;
//                       box-sizing: border-box;
//                       border: 1px solid #c6ceda;
//                     "
//                   >
//                     <tbody>
//                       <tr>
//                         <td
//                           style="
//                             text-align: left;
//                             border-bottom: 1px solid
//                               #c6ceda;
//                             width: 100%;
//                             height: 78.5px;
//                           "
//                         >
//                           <div
//                             style="padding: 12px 16px"
//                           >
//                             <p
//                               style="
//                                 text-align: left;
//                                 margin: 0px;
//                                 font-size: 18px;
//                               "
//                             >
//                               <strong
//                                 ><span
//                                   style="
//                                     font-size: 12pt;
//                                   "
//                                   >1. Use your email as
//                                   Username&nbsp;</span
//                                 ></strong
//                               >
//                             </p>
//                             <p
//                               style="
//                                 text-align: left;
//                                 margin: 0px;
//                               "
//                             >
//                               <span
//                                 style="font-size: 14px"
//                                 >&nbsp;</span
//                               >
//                             </p>
//                             <p
//                               style="
//                                 text-align: left;
//                                 margin: 0px;
//                               "
//                             >
//                               <span
//                                 style="font-size: 14px"
//                                 >${email}</span
//                               >
//                             </p>
//                           </div>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td
//                           style="
//                             text-align: left;
//                             border-bottom: 1px solid
//                               #c6ceda;
//                             width: 100%;
//                           "
//                         >
//                           <div
//                             style="padding: 12px 16px"
//                           >
//                             <p
//                               style="
//                                 text-align: left;
//                                 margin: 0px;
//                                 font-size: 18px;
//                               "
//                             >
//                               <strong
//                                 ><span
//                                   style="
//                                     font-size: 12pt;
//                                   "
//                                   >2. Copy the below
//                                   Password</span
//                                 ></strong
//                               >
//                             </p>
//                             <p
//                               style="
//                                 text-align: left;
//                                 margin: 0px;
//                               "
//                             >
//                               <span
//                                 style="font-size: 14px"
//                                 >&nbsp;</span
//                               >
//                             </p>
//                             <p
//                               style="
//                                 text-align: left;
//                                 margin: 0px;
//                               "
//                             >
//                               <span
//                                 style="font-size: 14px"
//                                 >${passcode}</span
//                               >
//                             </p>
//                           </div>
//                         </td>
//                       </tr>
//                       <tr>
//                         <td
//                           style="
//                             text-align: left;
//                             width: 100%;
//                             height: 81px;
//                           "
//                         >
//                           <div
//                             style="padding: 12px 16px"
//                           >
//                             <p
//                               style="
//                                 text-align: left;
//                                 margin: 0px;
//                               "
//                             >
//                               <span
//                                 style="font-size: 12pt"
//                                 ><strong
//                                   >3. Click on below
//                                   Link to enter the
//                                   details</strong
//                                 ></span
//                               ><span
//                                 style="font-size: 14pt"
//                                 ><strong
//                                   ><br /></strong></span
//                               ><span
//                                 style="font-size: 14px"
//                                 ><br /><a
//                                   id="v1OWA75dc1713-15a4-d5fc-192a-a90da23147d2"
//                                   class="v1OWAAutoLink"
//                                   style="
//                                     margin-top: 0px;
//                                     margin-bottom: 0px;
//                                   "
//                                   href="https://app.wieldyportal.co.uk"
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   >https://app.wieldyportal.co.uk</a
//                                 ></span
//                               >
//                             </p>
//                           </div>
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                   <div
//                     style="
//                       margin-right: auto;
//                       margin-left: auto;
//                     "
//                   >
//                     <div
//                       style="
//                         font-family: Verdana, Geneva,
//                           sans-serif;
//                         font-size: 14px;
//                       "
//                     >
//                       Simple! now you are checked in,
//                       please enjoy your&nbsp;keyless
//                       access to your room. If you need
//                       to share your webkey
//                       to&nbsp;other&nbsp;people
//                       in&nbsp;your&nbsp;party please
//                       use the "share" facility.
//                     </div>
//                     <div
//                       style="
//                         font-family: Verdana, Geneva,
//                           sans-serif;
//                         font-size: 14px;
//                       "
//                     >
//                       &nbsp;
//                     </div>
//                     <h3
//                       style="
//                         line-height: 1.5;
//                         margin: 0px auto 16px;
//                         font-family: Lato, Arial,
//                           Helvetica, sans-serif;
//                         font-size: 20px;
//                       "
//                     >
//                       <span
//                         style="font-size: 18.6667px"
//                         >Check-In &amp; Check-Out
//                         Details:</span
//                       >
//                     </h3>
//                     <table
//                       style="
//                         text-align: left;
//                         margin-bottom: 0em;
//                         width: 100%;
//                         border-collapse: separate;
//                         border-spacing: 0px;
//                         box-sizing: border-box;
//                       "
//                     >
//                       <tbody>
//                         <tr>
//                           <td>
//                             <table
//                               style="
//                                 text-align: left;
//                                 border-radius: 4px;
//                                 margin-bottom: 1.4em;
//                                 width: 100%;
//                                 border-collapse: separate;
//                                 border-spacing: 0px;
//                                 box-sizing: border-box;
//                                 border: 1px solid
//                                   #c6ceda;
//                               "
//                             >
//                               <tbody>
//                                 <tr>
//                                   <td
//                                     style="
//                                       text-align: left;
//                                       border-bottom: 1px
//                                         solid #c6ceda;
//                                     "
//                                   >
//                                     <div
//                                       style="
//                                         text-align: left;
//                                         padding: 12px
//                                           16px;
//                                         font-family: Verdana,
//                                           Geneva,
//                                           sans-serif;
//                                         font-size: 14px;
//                                       "
//                                     >
//                                       <img
//                                         style="
//                                           width: 12px;
//                                           height: 12px;
//                                           margin-right: 10px;
//                                         "
//                                         src="https://app.littlehotelier.com//legacy-assets/arrow-down.png"
//                                         width="12"
//                                         height="12"
//                                       />&nbsp;Check-in
//                                     </div>
//                                   </td>
//                                 </tr>
//                                 <tr>
//                                   <td>
//                                     <div
//                                       style="
//                                         text-align: left;
//                                         padding: 12px
//                                           16px;
//                                         font-family: Verdana,
//                                           Geneva,
//                                           sans-serif;
//                                       "
//                                     >
//                                       <span
//                                         style="
//                                           font-size: 18px;
//                                         "
//                                         ><strong
//                                           >${bookingDetails.checkInDate}</strong
//                                         ><br /></span
//                                       ><span
//                                         style="
//                                           font-size: 8pt;
//                                         "
//                                         >Time:
//                                         ${bookingDetails.defaultCheckInTime}</span
//                                       >
//                                     </div>
//                                   </td>
//                                 </tr>
//                               </tbody>
//                             </table>
//                           </td>
//                           <td>
//                             <table
//                               style="
//                                 text-align: left;
//                                 border-radius: 4px;
//                                 margin-bottom: 1.4em;
//                                 width: 100%;
//                                 border-collapse: separate;
//                                 border-spacing: 0px;
//                                 box-sizing: border-box;
//                                 border: 1px solid
//                                   #c6ceda;
//                               "
//                             >
//                               <tbody>
//                                 <tr>
//                                   <td
//                                     style="
//                                       text-align: left;
//                                       border-bottom: 1px
//                                         solid #c6ceda;
//                                     "
//                                   >
//                                     <div
//                                       style="
//                                         text-align: left;
//                                         padding: 12px
//                                           16px;
//                                         font-family: Verdana,
//                                           Geneva,
//                                           sans-serif;
//                                         font-size: 14px;
//                                       "
//                                     >
//                                       <img
//                                         style="
//                                           width: 12px;
//                                           height: 12px;
//                                           margin-right: 10px;
//                                         "
//                                         src="https://app.littlehotelier.com//legacy-assets/arrow-up.png"
//                                         width="12"
//                                         height="12"
//                                       />&nbsp;Check-out
//                                     </div>
//                                   </td>
//                                 </tr>
//                                 <tr>
//                                   <td>
//                                     <div
//                                       style="
//                                         text-align: left;
//                                         padding: 12px
//                                           16px;
//                                         font-family: Verdana,
//                                           Geneva,
//                                           sans-serif;
//                                       "
//                                     >
//                                       <span
//                                         style="
//                                           font-size: 18px;
//                                         "
//                                         ><strong
//                                           >${bookingDetails.checkOutDate}</strong
//                                         ><br /></span
//                                       ><span
//                                         style="
//                                           font-size: 8pt;
//                                         "
//                                         >Time:
//                                         ${bookingDetails.defaultCheckOutTime}</span
//                                       >
//                                     </div>
//                                   </td>
//                                 </tr>
//                               </tbody>
//                             </table>
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                   <div
//                     style="
//                       line-height: 1.3;
//                       font-family: 'Open Sans',
//                         sans-serif;
//                       font-size: 15px;
//                       color: #0a0a0a;
//                     "
//                   >
//                     <span
//                       style="
//                         font-family: verdana, geneva,
//                           sans-serif;
//                         font-size: 10pt;
//                         color: #3e3c3c;
//                       "
//                       >Please use above credentials for
//                       Keyless Check-in using Passcode
//                       or Webkey. If you face any issue
//                       while Check-in, you can mail us
//                       at
//                       <a
//                         id="v1OWA426e3e68-b105-440d-f57b-67bbcab7ca33"
//                         class="v1OWAAutoLink"
//                         style="color: #3e3c3c"
//                         href="mailto:support@wieldyportal.co.uk"
//                         rel="noreferrer"
//                       >
//                         support@wieldyportal.co.uk</a
//                       >&nbsp;<br /><strong
//                         >Note:</strong
//                       >&nbsp;You can only see your
//                       unlocking details after check-in
//                       Date &amp; Time.</span
//                     ><br /><br /><span
//                       style="
//                         font-family: verdana, geneva,
//                           sans-serif;
//                         font-size: 10pt;
//                         color: #000000;
//                         background-color: #ffffff;
//                       "
//                       >Thank you for choosing Wieldy
//                       Digital. Have a nice stay!</span
//                     >
//                   </div>
//                 </div>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </td>
//       <td>
//         <span style="font-size: 10pt">&nbsp;</span>
//       </td>
//     </tr>
//     <tr>
//       <td>
//         <span style="font-size: 10pt">&nbsp;</span>
//       </td>
//       <td style="width: 600px">
//         <span style="font-size: 10pt">&nbsp;</span>
//       </td>
//       <td>
//         <span style="font-size: 10pt">&nbsp;</span>
//       </td>
//     </tr>
//   </tbody>
// </table>
// <div id="forwardbody1" dir="ltr">
//   <div
//     id="v1x_forwardbody1"
//     style="
//       font-size: 10pt;
//       font-family: Verdana, Geneva, sans-serif;
//     "
//   >
//     <div
//       id="v1x_v1forwardbody1"
//       style="
//         font-size: 10pt;
//         font-family: Verdana, Geneva, sans-serif;
//       "
//     >
//       <div id="v1x_v1v1forwardbody1">
//         <div
//           id="v1x_v1v1v1forwardbody1"
//           style="
//             font-size: 10pt;
//             font-family: Verdana, Geneva, sans-serif;
//           "
//         >
//           <div id="v1x_v1v1v1v1signature">
//             <span style="font-size: 10pt"
//               ><img
//                 src="https://tracy.srv.wisestamp.com/px/wsid/2ZEVZbjKKajy.png"
//                 alt="__tpx__"
//             /></span>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
// <style type="text/css">
//   #forwardbody1 P {
//     margin-top: 0;
//     margin-bottom: 0;
//   }
// </style>
//       `;

//     }
//       console.log("email type=>", emailType);
//     console.log(
//       "property email=>",
//       bookingDetails.propertyEmail
//     );
//     // Send email with appropriate body
//     let info = await transporter.sendMail({
//       from: `"Wieldy Digital" <${process.env.EMAIL}>`, // sender address
//       to:
//         emailType === "checkIn_update"
//           ? bookingDetails.propertyEmail
//           : email,
//       bcc:
//         emailType === "checkIn_update"
//           ? ["notification@wieldyportal.co.uk"]
//           : [
//               "notification@wieldyportal.co.uk",
//               bookingDetails.propertyEmail
//             ],
//       subject:
//         emailType === "account_creation"
//           ? `Hi ${bookingDetails.firstName}, Here is your Online Check-In Information`
//           : emailType === "Property_Registration"
//           ? "Registration Successful - Wieldy"
//           : emailType === "key_sharing"
//           ? `Hi ${bookingDetails.firstName}, Here is your Online Check-In Information`
//           : emailType === "checkIn_update"
//           ? `${bookingDetails.firstName} has successfuly checked In`
//           : "Password Reset Request",
//       text: emailBody,
//       html: emailBody
//     });

//     console.log("Message sent: %s", info.messageId);
//     console.log(
//       "Preview URL: %s",
//       nodemailer.getTestMessageUrl(info)
//     );
//     return {
//       success: true,
//       message: "Email sent successfully"
//     };
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return {
//       success: false,
//       message: "Failed to send email",
//       error: error.message || error
//     };
//   }
// };

// // Function to generate and send OTP for password reset
// module.exports.generateEmailOtp = async function (
//   req,
//   res
// ) {
//   try {
//     const useremail = req.body.email;
//     const user = await User.findOne({
//       email: useremail
//     });
//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "User does not exist" });
//     }

//     if (user.status === "Inactive") {
//       return res
//         .status(401)
//         .json({ message: "Inactive user" });
//     }

//     const otp =
//       Math.floor(Math.random() * 900000) + 100000; // 6-digit OTP
//     const expiration = Date.now() + 10 * 60 * 1000; // 10 minutes expiration
//     user.passcode = await bcrypt.hash(
//       otp.toString(),
//       10
//     );
//     user.passcodeExpiry = expiration;
//     await user.save();

//     const result =
//       await module.exports.sendPasscodeEmail(
//         useremail,
//         otp.toString(),
//         user.contact,
//         "forgot_password"
//       );
//     if (result.success) {
//       res
//         .status(200)
//         .json({ message: "OTP sent successfully" });
//     } else {
//       res
//         .status(500)
//         .json({ message: "Failed to send OTP" });
//     }
//   } catch (error) {
//     console.error(
//       "Error generating email OTP:",
//       error
//     );
//     res
//       .status(500)
//       .json({ message: "Internal server error" });
//   }
// };

// ------------------------------------------------------------------------------------

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const User = require("../../models/userModel");

dotenv.config();

module.exports.sendPasscodeEmail = async function (
  email,
  passcode,
  userContact,
  emailType,
  bookingDetails,
  senderName
) {
  try {
    // Create a transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let emailBody = "";

    // Account Creation Email Template
    if (emailType === "account_creation") {
      emailBody = `
      <html>
      <head>
        <style>
          /* Your CSS styles here */
          body {
            font-family: Arial, sans-serif;
            color: #333;
          }
          /* Additional styles... */
        </style>
      </head>
      <body>
        <p>Dear ${bookingDetails.firstName},</p>
        <p>
          Your digital key is ready and attached to this email, you can check-in now.
        </p>
        <p>
          Please use your email <strong>${email}</strong> and the passcode <strong>${passcode}</strong> to login to the app and check-in.
        </p>
        <p>
          Here are your booking details:
        </p>
        <ul>
          <li>Check-in: ${bookingDetails.checkInDate}</li>
          <li>Check-out: ${bookingDetails.checkOutDate}</li>
          <li>Property: ${bookingDetails.propertyName}</li>
          <li>Check-in Time: ${bookingDetails.defaultCheckInTime}</li>
          <li>Check-out Time: ${bookingDetails.defaultCheckOutTime}</li>
        </ul>
        <p>
          We look forward to your stay!
        </p>
        <p>Best regards,<br/>${bookingDetails.propertyName} Team</p>
      </body>
      </html>
      `;
    }

    // Forgot Password Email Template
    else if (emailType === "forgot_password") {
      emailBody = `
      <html>
      <head>
        <style>
          /* Your CSS styles here */
        </style>
      </head>
      <body>
        <p>Dear User,</p>
        <p>
          You have requested to reset your password. Please use the following OTP to reset your password:
        </p>
        <p>
          <strong>${passcode}</strong>
        </p>
        <p>
          This OTP is valid for 10 minutes.
        </p>
        <p>
          If you did not request a password reset, please ignore this email.
        </p>
        <p>Best regards,<br/>Support Team</p>
      </body>
      </html>
      `;
    }

    // Key Sharing Email Template
    else if (emailType === "key_sharing") {
      emailBody = `
      <html>
      <head>
        <style>
          /* Your CSS styles here */
        </style>
      </head>
      <body>
        <p>Dear ${bookingDetails.firstName},</p>
        <p>
          A key has been shared with you.
        </p>
        <p>
          Please use your email <strong>${email}</strong> and the passcode <strong>${passcode}</strong> to login to the app and access the key.
        </p>
        <p>
          Here are your booking details:
        </p>
        <ul>
          <li>Check-in: ${bookingDetails.checkInDate}</li>
          <li>Check-out: ${bookingDetails.checkOutDate}</li>
          <li>Property: ${bookingDetails.propertyName}</li>
          <li>Check-in Time: ${bookingDetails.defaultCheckInTime}</li>
          <li>Check-out Time: ${bookingDetails.defaultCheckOutTime}</li>
        </ul>
        <p>
          We look forward to your stay!
        </p>
        <p>Best regards,<br/>${
          senderName || bookingDetails.propertyName
        } Team</p>
      </body>
      </html>
      `;
    }

    // Add other email types if necessary

    // Set up email data
    let mailOptions = {
      from: process.env.EMAIL, // sender address
      to: email, // list of receivers
      subject: "Your Account Information", // Subject line
      html: emailBody, // html body
    };

    // Send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
