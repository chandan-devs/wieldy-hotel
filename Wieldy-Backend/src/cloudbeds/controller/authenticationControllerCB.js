const logger = require("../../../logger/winstonLogger");
const axios = require("axios");
const CircularJSON = require("circular-json");
const querystring = require("querystring");
const authCodeModel = require("../model/authenticationModelCB");
const emailService = require("../../../services/communicationManagement/emailService");
const property = require("../model/cloudBedsHotelModel");
const Source = require("../../../models/sourceModel");
const mongoose = require("mongoose");
const cloudBedsHotel = require("../model/cloudBedsHotelModel");
require("dotenv").config();

/**
 * Scripts Integration page of CloudBeds.
 * @param {*} req
 * @param {*} res
 */

// monolitihic code with all calls demo version
async function oAuth2O(req, res) {
  try {
    logger.info(
      `<< Main process start CloudBeds Authentication >>`
    );
    logger.info("Req Body", req.body);

    let body = req.body;
    let query = req.query;
    if (req.query.code) {
      const code = req.query.code;
      logger.info(`code => ${JSON.stringify(code)}`);

      //finding PMS Source-----------------
      const sourceExists = await Source.findOne({
        sourceName: "CloudBeds"
      }).select("sourceName");

      logger.info(
        `sourceExists =>${JSON.stringify(
          sourceExists
        )}`
      );

      if (!sourceExists.sourceName) {
        return res.status(400).json({
          success: false,
          message: "Not a valid Source",
          data: null
        });
      }
      // --------------------------
      try {
        // Exchange authorization code for access token and refresh token
        const access_token_url =
          "https://api.cloudbeds.com/api/v1.2/access_token";
        const post_fields = {
          grant_type: "authorization_code", // need to be dynamic
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          redirect_uri: process.env.REDIRECT_URI,
          code: code
        };

        const response_of_refreshToken_resource =
          await axios.post(
            access_token_url,
            querystring.stringify(post_fields),
            {
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded"
              }
            }
          );
        logger.info(
          `response of refresh token 1 =>
          ${JSON.stringify(
            response_of_refreshToken_resource.data
          )}`
        );

        const propertyID =
          response_of_refreshToken_resource.data
            .resources[0].id;
        const refresh_token =
          response_of_refreshToken_resource.data
            .refresh_token;
        const access_token =
          response_of_refreshToken_resource.data
            .access_token;

        logger.info(
          `propertyID =>
          ${JSON.stringify(propertyID)}`
        );

        if (
          refresh_token &&
          access_token &&
          response_of_refreshToken_resource.data
            .resources.length > 0
        ) {
          logger.info("inside");

          //check if same property model exists
          let checkAuthPropertyExist =
            await authCodeModel.find({
              propertyId: propertyID
            });
          //check in property model same is existed or not
          let propertyExistCheck = await property.find(
            {
              propertyId: propertyID
            }
          );
          logger.info(
            `checkAuthPropertyExist => 
            ${JSON.stringify(checkAuthPropertyExist)}`
          );
          logger.info(
            `propertyExistCheck =>
            ${JSON.stringify(propertyExistCheck)}`
          );

          if (
            checkAuthPropertyExist.length > 0 &&
            propertyExistCheck.length === 0
          ) {
            logger.info("only auth data exist");

            //no need to call againmangawa hi daal do
            //   const access_token_url =
            //   "https://api.cloudbeds.com/api/v1.2/access_token";
            // const post_fields = {
            //   grant_type: "authorization_code", // need to be dynamic
            //   client_id: process.env.CLIENT_ID,
            //   client_secret: process.env.CLIENT_SECRET,
            //   redirect_uri: process.env.REDIRECT_URI,
            //   code: code
            // };

            // const response_of_refreshToken_resource =
            //   await axios.post(
            //     access_token_url,
            //     querystring.stringify(post_fields),
            //     {
            //       headers: {
            //         "Content-Type":
            //           "application/x-www-form-urlencoded"
            //       }
            //     }
            //   );
            // logger.info(
            //   "response of refresh token2",
            //   response_of_refreshToken_resource
            // );
            // const refresh_token =
            //   response_of_refreshToken_resource.data
            //     .refresh_token;
            // const access_token =
            //   response_of_refreshToken_resource.data
            //     .access_token;
            let updatedRecord =
              await authCodeModel.findOneAndUpdate(
                { propertyId: propertyID },
                {
                  access_token: access_token,
                  refresh_token: refresh_token
                },
                { new: true }
              );
            if (updatedRecord) {
              logger.info("updated success");
            }

            //then create property
            const userInfo_token_url =
              "https://api.cloudbeds.com/api/v1.2/userinfo";
            const userInfo_response = await axios.get(
              userInfo_token_url,
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                  Cookie:
                    "acessa_session=1e4e93f63ea1b4268f1cb5cc9cef441f7e41df66; acessa_session_enabled=1; csrf_accessa_cookie=483c6d1ec5ba7b404c99a5f83418a262"
                }
              }
            );

            logger.info(
              `userInfo_response =>
              ${JSON.stringify(userInfo_response)}`
            );

            const name = `${userInfo_response.data.first_name}_${userInfo_response.data.last_name}`;
            const email = userInfo_response.data.email;

            const propertyCreateObj = {
              name: name,
              emailId: email,
              propertyId: propertyID,
              app_state: "enabled"
            };
            //disconnect krk connect marta h to update kro yani phle check kro
            try {
              const onBoardedHotel =
                await property.create(
                  propertyCreateObj
                );

              if (onBoardedHotel) {
                logger.info(
                  "property created successfully"
                );
                return res.status(200).send({
                  success: true,
                  message:
                    "Integration with Wieldy successful",
                  data: null
                });
              }
            } catch (err) {
              console.error(
                "Error saving property data:",
                err
              );
              return res.status(500).send({
                success: false,
                message:
                  "Error saving property data 1:",
                data: null
              });
            }
          } else if (
            propertyExistCheck.length > 0 &&
            checkAuthPropertyExist.length === 0
          ) {
            //check access token
            logger.info("only property data exist");
            // let tokenCheckResult =
            //   checkAccessToken(access_token);
            //remaining

            //mat kro check mangawa hi daal do
            // if (!tokenCheckResult) {
            //   let newAccessToken =
            //     await renewAccessToken(
            //       refresh_token //can be caaled from db with match propertyid in future got err
            //     );
            //   logger.info(
            //     "newAccessToken",
            //     newAccessToken
            //   );

            //   let updatedRecord =
            //     await authCodeModel.findOneAndUpdate(
            //       { propertyId: propertyID },
            //       {
            //         access_token: newAccessToken
            //       },
            //       { new: true }
            //     );
            //   if (updatedRecord) {
            //     logger.info(
            //       "new token updated to db sucess"
            //     );
            //   }
            // }

            // let Access_token = await authCodeModel
            //   .find({
            //     propertyId: propertyID
            //   })
            //   .select("access_token");

            //creating auth model because it dosent exist
            const authCreateObj = {
              access_token: access_token,
              refresh_token: refresh_token,
              propertyId: propertyID
            };
            const authDataSaved =
              await authCodeModel.create(
                authCreateObj
              );
            if (authDataSaved) {
              logger.info("auth model created");
            }

            //calling userinfo and update new info
            const userInfo_token_url =
              "https://api.cloudbeds.com/api/v1.2/userinfo";
            const userInfo_response = await axios.get(
              userInfo_token_url,
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                  Cookie:
                    "acessa_session=1e4e93f63ea1b4268f1cb5cc9cef441f7e41df66; acessa_session_enabled=1; csrf_accessa_cookie=483c6d1ec5ba7b404c99a5f83418a262"
                }
              }
            );
            const name = `${userInfo_response.data.first_name}_${userInfo_response.data.last_name}`;
            const email = userInfo_response.data.email;

            //property already exist updated app state

            //check in property model same is existed or not
            //now check app state
            const url =
              "https://api.cloudbeds.com/api/v1.1/getAppState";

            // Data to be sent as query parameters
            const params = querystring.stringify({
              propertyID: propertyID
            });
            logger.info(
              `params =>${JSON.stringify(params)}`
            );

            try {
              const response = await axios.get(
                `${url}?${params}`,
                {
                  headers: {
                    "Content-Type":
                      "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${access_token}`,
                    Cookie:
                      "acessa_session=df98356a844dfbb1b71f13f97c83be1cbe058d8a; acessa_session_enabled=1; csrf_accessa_cookie=483c6d1ec5ba7b404c99a5f83418a262"
                  }
                }
              );

              logger.info(
                "Response data 1:",
                response.data
              );
              let updatedRecord =
                await property.findOneAndUpdate(
                  { propertyId: propertyID },
                  {
                    name: name,
                    emailId: email,
                    app_state:
                      response.data.data.app_state
                  },
                  { new: true }
                );

              if (updatedRecord) {
                logger.info(
                  "property updated successfully"
                );
                return res.status(200).send({
                  success: true,
                  message:
                    "Integration with Wieldy successful, property already exist updated app state",
                  data: null
                });
              }
            } catch (err) {
              console.error(
                "Error fetching app state2:",
                err
              );
            }
          } else if (
            checkAuthPropertyExist.length > 0 &&
            propertyExistCheck.length > 0
          ) {
            //auth part
            logger.info("same existing in model both");
            //dont call mangawa daal update krdo
            // const access_token_url =
            //   "https://api.cloudbeds.com/api/v1.2/access_token";
            // const post_fields = {
            //   grant_type: "authorization_code", // need to be dynamic
            //   client_id: process.env.CLIENT_ID,
            //   client_secret: process.env.CLIENT_SECRET,
            //   redirect_uri: process.env.REDIRECT_URI,
            //   code: code
            // };
            //crash check

            //   const response_of_refreshToken_resource =
            //     await axios.post(
            //       access_token_url,
            //       querystring.stringify(post_fields),
            //       {
            //         headers: {
            //           "Content-Type":
            //             "application/x-www-form-urlencoded"
            //         }
            //       }
            //     );

            const url =
              "https://api.cloudbeds.com/api/v1.1/getAppState";

            // Data to be sent as query parameters
            const params = querystring.stringify({
              propertyID: propertyID
            });

            const response = await axios.get(
              `${url}?${params}`,
              {
                headers: {
                  "Content-Type":
                    "application/x-www-form-urlencoded",
                  Authorization: `Bearer ${access_token}`,
                  Cookie:
                    "acessa_session=df98356a844dfbb1b71f13f97c83be1cbe058d8a; acessa_session_enabled=1; csrf_accessa_cookie=483c6d1ec5ba7b404c99a5f83418a262"
                }
              }
            );
            if (
              response.data.data.app_state ===
              "enabled"
            ) {
              return res.status(400).send({
                sucess: false,
                message:
                  "Please Disconnect before making a new connection",
                data: null
              });
            }
            logger.info(
              `Response data app state: =>
              ${JSON.stringify(
                response.data.data.app_state
              )}`
            );

            // logger.info(
            //   "response of refresh token 3",
            //   response_of_refreshToken_resource
            // );
            // const refresh_token =
            //   response_of_refreshToken_resource.data
            //     .refresh_token;
            // const access_token =
            //   response_of_refreshToken_resource.data
            //     .access_token;
            let updatedRecord =
              await authCodeModel.findOneAndUpdate(
                { propertyId: propertyID },
                {
                  access_token: access_token,
                  refresh_token: refresh_token
                },
                { new: true }
              );
            if (updatedRecord) {
              logger.info(
                "auth model updated success"
              );
            }

            //property part

            //calling userinfo and update new info
            const userInfo_token_url =
              "https://api.cloudbeds.com/api/v1.2/userinfo";
            const userInfo_response = await axios.get(
              userInfo_token_url,
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                  Cookie:
                    "acessa_session=1e4e93f63ea1b4268f1cb5cc9cef441f7e41df66; acessa_session_enabled=1; csrf_accessa_cookie=483c6d1ec5ba7b404c99a5f83418a262"
                }
              }
            );
            const name = `${userInfo_response.data.first_name}_${userInfo_response.data.last_name}`;
            const email = userInfo_response.data.email;
            // get app state logic end

            //call hotel detais
            const requestBody = querystring.stringify({
              propertyID: propertyID
            });

            // Perform the GET request using axios
            const newResponse = await axios.get(
              "https://api.cloudbeds.com/api/v1.2/getHotelDetails",
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                  "Content-Type":
                    "application/x-www-form-urlencoded",
                  propertyID: propertyID
                },
                data: requestBody
              }
            );
            const propertyName =
              newResponse.data.data.propertyName;
            const propertyEmail =
              newResponse.data.data.propertyEmail;
            const propertyType =
              newResponse.data.data.propertyType;
            const propertyPhone =
              newResponse.data.data.propertyPhone;
            const propertyAddress =
              newResponse.data.data.propertyAddress;
            const propertyPolicy =
              newResponse.data.data.propertyPolicy;
            const propertyImage =
              newResponse.data.data.propertyImage;
            const propertyDescription =
              newResponse.data.data
                .propertyDescription;
            const propertyCurrency =
              newResponse.data.data.propertyCurrency;
            try {
              let updatedRecord =
                await property.findOneAndUpdate(
                  { propertyId: propertyID },
                  {
                    propertyName,
                    propertyEmail,
                    propertyPhone,
                    propertyAddress,
                    propertyPolicy,
                    propertyImage,
                    propertyDescription,
                    propertyCurrency,
                    propertyType,
                    name: name,
                    emailId: email,
                    app_state:
                      response.data.data.app_state
                  },
                  { new: true }
                );

              if (updatedRecord) {
                logger.info(
                  "property updated successfully"
                );
                return res.status(200).send({
                  success: true,
                  message:
                    "Integration with Wieldy successful, property already exist updated app state and token",
                  data: null
                });
              }
            } catch (err) {
              console.error(
                "Error fetching app state3:",
                err
              );
            }
          } else {
            logger.info("fresh start");
            //fresh content
            // Save the access token and use it for further API requests make db call or save in db
            const authCreateObj = {
              access_token: access_token,
              refresh_token: refresh_token,
              propertyId: propertyID
            };

            try {
              const authDataSaved =
                await authCodeModel.create(
                  authCreateObj
                );

              if (authDataSaved) {
                let tokenCheckResult =
                  await checkAccessToken(
                    authDataSaved.access_token
                  );
                logger.info(
                  `tokenCheckResult ${tokenCheckResult}`
                );
                if (tokenCheckResult) {
                  try {
                    logger.info(
                      "Register new property"
                    );
                    const userInfo_token_url =
                      "https://api.cloudbeds.com/api/v1.2/userinfo";
                    const userInfo_response =
                      await axios.get(
                        userInfo_token_url,
                        {
                          headers: {
                            Authorization: `Bearer ${authDataSaved.access_token}`,
                            Cookie:
                              "acessa_session=1e4e93f63ea1b4268f1cb5cc9cef441f7e41df66; acessa_session_enabled=1; csrf_accessa_cookie=483c6d1ec5ba7b404c99a5f83418a262"
                          }
                        }
                      );

                    logger.info(
                      `userInfo_response ffs =>
                      ${userInfo_response}`
                    );

                    const name = `${userInfo_response.data.first_name}_${userInfo_response.data.last_name}`;
                    const email =
                      userInfo_response.data.email;

                    // //check in property model same is existed or not
                    // let propertyExistCheck =
                    //   await property.find({
                    //     propertyId: propertyID
                    //   });
                    // if (
                    //   propertyExistCheck.length > 0
                    // ) {
                    //   //now check app state
                    //   const url =
                    //     "https://api.cloudbeds.com/api/v1.1/getAppState";

                    //   // Data to be sent as query parameters
                    //   const params =
                    //     querystring.stringify({
                    //       propertyID: propertyID
                    //     });

                    //   try {
                    //     const response =
                    //       await axios.get(
                    //         `${url}?${params}`,
                    //         {
                    //           headers: {
                    //             "Content-Type":
                    //               "application/x-www-form-urlencoded",
                    //             Authorization: `Bearer ${access_token}`,
                    //             Cookie:
                    //               "acessa_session=df98356a844dfbb1b71f13f97c83be1cbe058d8a; acessa_session_enabled=1; csrf_accessa_cookie=483c6d1ec5ba7b404c99a5f83418a262"
                    //           }
                    //         }
                    //       );

                    //     logger.info(
                    //       "Response data:",
                    //       response.data
                    //     );
                    //   } catch (err) {
                    //     console.error(
                    //       "Error fetching app state:",
                    //       err
                    //     );
                    //   }
                    // }

                    //call hotel detais
                    const requestBody =
                      querystring.stringify({
                        propertyID: propertyID
                      });

                    // Perform the GET request using axios
                    const newResponse =
                      await axios.get(
                        "https://api.cloudbeds.com/api/v1.2/getHotelDetails",
                        {
                          headers: {
                            Authorization: `Bearer ${access_token}`,
                            "Content-Type":
                              "application/x-www-form-urlencoded",
                            propertyID: propertyID
                          },
                          data: requestBody
                        }
                      );
                    logger.info(
                      `proprty api resp frs =>
                      ${JSON.stringify(
                        newResponse.data.data
                      )}`
                    );
                    const propertyName =
                      newResponse.data.data
                        .propertyName || null;
                    const propertyEmail =
                      newResponse.data.data
                        .propertyEmail || null;
                    const propertyType =
                      newResponse.data.data
                        .propertyType || null;
                    const propertyPhone =
                      newResponse.data.data
                        .propertyPhone || null;
                    const propertyAddress =
                      newResponse.data.data
                        .propertyAddress || null;
                    const propertyPolicy =
                      newResponse.data.data
                        .propertyPolicy || null;
                    const propertyImage =
                      newResponse.data.data
                        .propertyImage || null;
                    const propertyDescription =
                      newResponse.data.data
                        .propertyDescription || null;
                    const propertyCurrency =
                      newResponse.data.data
                        .propertyCurrency || null;

                    const propertyCreateObj = {
                      propertyName,
                      propertyEmail,
                      propertyPhone,
                      propertyAddress,
                      propertyPolicy,
                      propertyType,
                      name: name,
                      emailId: email,
                      propertyId: propertyID,
                      propertyImage,
                      propertyDescription,
                      propertyCurrency,
                      app_state: "enabled",
                      PMSsource:
                        new mongoose.Types.ObjectId(
                          sourceExists._id
                        ),
                      statusBar: "Onboarding"
                    };
                    logger.info(
                      `propertyCreateObj=> ${propertyCreateObj}`
                    );
                    //disconnect krk connect marta h to update kro yani phle check kro
                    try {
                      const onBoardedHotel =
                        await property.create(
                          propertyCreateObj
                        );

                      if (onBoardedHotel) {
                        logger.info(
                          "property created successfully"
                        );
                        //email logic
                        let bookingdetail = {
                          email,
                          name,
                          propertyName
                        };
                        const emailResult =
                          await emailService.sendPasscodeEmail(
                            // email,
                            "argalhassan@gmail.com", //for testing
                            null,
                            null,
                            "Property_Registration",
                            bookingdetail
                          );
                        if (emailResult) {
                          logger.info(
                            "mail sent sucessfully"
                          );
                        }
                        return res.status(200).send({
                          success: true,
                          message:
                            "Integration with Wieldy successful",
                          data: null
                        });
                      }
                    } catch (err) {
                      console.error(
                        "Error saving property data4:",
                        err
                      );
                      return res.status(500).send({
                        success: false,
                        message:
                          "Error saving property data4:",
                        data: null
                      });
                    }
                  } catch (err) {
                    console.error(
                      "Error fetching user info:",
                      err
                    );
                    return res.status(500).send({
                      success: false,
                      message:
                        "Error fetching user info",
                      data: null
                    });
                  }
                } else {
                  logger.info(
                    "call refresh token and generate again"
                  );
                  let newAccessToken =
                    await renewAccessToken(
                      refresh_token
                    );
                  logger.info(
                    `newAccessToken => ${newAccessToken}`
                  );

                  let updatedRecord =
                    await authCodeModel.findByIdAndUpdate(
                      authDataSaved._id, // The ID of the record to update
                      {
                        access_token: newAccessToken
                      }, // The new value to set
                      { new: true } // Option to return the updated document
                    );

                  if (updatedRecord) {
                    // Register new property
                    const userInfo_token_url =
                      "https://api.cloudbeds.com/api/v1.2/userinfo";
                    const userInfo_response =
                      await axios.get(
                        userInfo_token_url,
                        {
                          headers: {
                            Authorization: `Bearer ${updatedRecord.access_token}`,
                            Cookie:
                              "acessa_session=1e4e93f63ea1b4268f1cb5cc9cef441f7e41df66; acessa_session_enabled=1; csrf_accessa_cookie=483c6d1ec5ba7b404c99a5f83418a262"
                          }
                        }
                      );
                    const name = `${userInfo_response.data.first_name}_${userInfo_response.data.last_name}`;
                    const email =
                      userInfo_response.data.email;

                    //call hotel detais
                    const requestBody =
                      querystring.stringify({
                        propertyID: propertyID
                      });
                    logger.info(
                      `propertyid rac ${requestBody}`
                    );
                    // Perform the GET request using axios
                    // const newResponse =
                    //   await axios.get(
                    //     "https://api.cloudbeds.com/api/v1.2/getHotelDetails",
                    //     {
                    //       headers: {
                    //         Authorization: `Bearer ${updatedRecord.access_token}`,
                    //         "Content-Type":
                    //           "application/x-www-form-urlencoded",
                    //         propertyID: propertyID
                    //       },
                    //       data: requestBody
                    //     }
                    //   );
                    //   add trycatch for better debug
                    const newResponse =
                      await axios.get(
                        "https://api.cloudbeds.com/api/v1.2/getHotelDetails",
                        {
                          headers: {
                            Authorization: `Bearer ${updatedRecord.access_token}`,
                            "Content-Type":
                              "application/x-www-form-urlencoded"
                          },
                          params: {
                            propertyID: propertyID // Pass propertyID as a query parameter
                          }
                        }
                      );
                    logger.info(
                      `property api response => ${CircularJSON.stringify(
                        newResponse
                      )}`
                    );
                    const propertyName =
                      newResponse.data.data
                        .propertyName;
                    const propertyEmail =
                      newResponse.data.data
                        .propertyEmail;
                    const propertyType =
                      newResponse.data.data
                        .propertyType;
                    const propertyPhone =
                      newResponse.data.data
                        .propertyPhone;
                    const propertyAddress =
                      newResponse.data.data
                        .propertyAddress;
                    const propertyPolicy =
                      newResponse.data.data
                        .propertyPolicy;
                    const propertyImage =
                      newResponse.data.data
                        .propertyImage;
                    const propertyDescription =
                      newResponse.data.data
                        .propertyDescription;
                    const propertyCurrency =
                      newResponse.data.data
                        .propertyCurrency;

                    const propertyCreateObj = {
                      propertyName,
                      propertyEmail,
                      propertyPhone,
                      propertyAddress,
                      propertyPolicy,
                      propertyType,
                      name: name,
                      emailId: email,
                      propertyId: propertyID,
                      propertyImage: propertyImage,
                      propertyDescription:
                        propertyDescription,
                      propertyCurrency:
                        propertyCurrency,
                      app_state: "enabled",
                      PMSsource:
                        new mongoose.Types.ObjectId(
                          sourceExists._id
                        ),
                      statusBar: "Onboarding"
                    };
                    try {
                      const onBoardedHotel =
                        await property.create(
                          propertyCreateObj
                        );

                      if (onBoardedHotel) {
                        logger.info(
                          "property created successfully"
                        );
                        logger.info(
                          `<< Main process end CloudBeds Authentication >>`
                        );
                        return res.status(200).send({
                          success: true,
                          message:
                            "Integration with Wieldy successful",
                          data: null
                        });
                      }
                    } catch (err) {
                      console.error(
                        "Error saving property data:",
                        err
                      );
                      return res.status(500).send({
                        success: false,
                        message:
                          "Error saving property data 7",
                        data: null
                      });
                    }
                  }
                  logger.info("not updated token");
                }
              }
            } catch (err) {
              console.error(
                "Error saving auth data:",
                err
              );
              return res.status(500).send({
                success: false,
                message:
                  "Already Exist/Error saving auth data 8",
                data: null
              });
            }
          }
        } else {
          return res.status(400).send({
            success: false,
            message:
              "Error getting access and refresh token",
            data: null
          });
        }
      } catch (err) {
        console.error(
          "Property Already Registered or disconnect to register again:",
          err
        );
        return res.status(400).send({
          success: false,
          message:
            "Property Already Registered or disconnect to register again",
          data: null
        });
      }
    }

    res.status(400).send({
      message: "some thing is missing",
      "Body Received": body,
      "Query recieved": query,
      data: null
    });
  } catch (error) {
    // logger.error(error.stack);
    return res.status(500).send({
      sucess: false,
      message: "Internal Server Error",
      data: JSON.stringify(error.message)
    });
  }
}

async function oAuth2O1(req, res) {
  try {
    logger.info(
      `<< Main process start CloudBeds Authentication >>`
    );
    try {
      const code = req.query.code;
      const sourceExists = await Source.findOne({
        sourceName: "CloudBeds"
      }).select("sourceName");
      if (!sourceExists.sourceName) {
        return res.status(400).json({
          success: false,
          message: "Not a valid Source",
          data: null
        });
      }
      const access_token_url =
        "https://api.cloudbeds.com/api/v1.2/access_token";
      const post_fields = {
        grant_type: "authorization_code",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        code: code
      };
      const response_of_refreshToken_resource =
        await axios.post(
          access_token_url,
          querystring.stringify(post_fields),
          {
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded"
            }
          }
        );
      const propertyID =
        response_of_refreshToken_resource.data
          .resources[0].id;
      const refresh_token =
        response_of_refreshToken_resource.data
          .refresh_token;
      const access_token =
        response_of_refreshToken_resource.data
          .access_token;
      const authCreateObj = {
        access_token: access_token,
        refresh_token: refresh_token,
        propertyId: propertyID
      };
      const authFind = await authCodeModel.findOne({
        propertyId: propertyID
      });
      if (!authFind) {
        const authDataSaved =
          await authCodeModel.create(authCreateObj);
      } else {
        const authDataUpdated =
          await authCodeModel.findOneAndUpdate(
            { propertyId: propertyID },
            {
              access_token: access_token,
              refresh_token: refresh_token,
              updatedAt: new Date()
            },
            { new: true }
          );
      }
      const userInfo_response = await axios.get(
        "https://api.cloudbeds.com/api/v1.2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            Cookie:
              "acessa_session=1e4e93f63ea1b4268f1cb5cc9cef441f7e41df66; acessa_session_enabled=1; csrf_accessa_cookie=483c6d1ec5ba7b404c99a5f83418a262"
          }
        }
      );
      const name = `${userInfo_response.data.first_name}_${userInfo_response.data.last_name}`;
      const email = userInfo_response.data.email;
      const requestBody = querystring.stringify({
        propertyID: propertyID
      });
      const newResponse = await axios.get(
        "https://api.cloudbeds.com/api/v1.2/getHotelDetails",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type":
              "application/x-www-form-urlencoded",
            propertyID: propertyID
          },
          data: requestBody
        }
      );
      const propertyName =
        newResponse.data.data.propertyName || null;
      const propertyEmail =
        newResponse.data.data.propertyEmail || null;
      const propertyType =
        newResponse.data.data.propertyType || null;
      const propertyPhone =
        newResponse.data.data.propertyPhone || null;
      const propertyAddress =
        newResponse.data.data.propertyAddress || null;
      const propertyPolicy =
        newResponse.data.data.propertyPolicy || null;
      const propertyImage =
        newResponse.data.data.propertyImage || null;
      const propertyDescription =
        newResponse.data.data.propertyDescription ||
        null;
      const propertyCurrency =
        newResponse.data.data.propertyCurrency || null;

      const propertyCreateObj = {
        propertyName,
        propertyEmail,
        propertyPhone,
        propertyAddress,
        propertyPolicy,
        propertyType,
        name: name,
        emailId: email,
        propertyId: propertyID,
        propertyImage,
        propertyDescription,
        propertyCurrency,
        app_state: "enabled",
        PMSsource: new mongoose.Types.ObjectId(
          sourceExists._id
        ),
        statusBar: "Onboarding"
      };
      const hotelFind = await cloudBedsHotel.findOne({
        propertyId: propertyID
      });
      let onBoardedHotel;
      if (!hotelFind) {
        onBoardedHotel = await property.create(
          propertyCreateObj
        );
      } else {
        onBoardedHotel =
          await cloudBedsHotel.updateOne(
            { propertyId: propertyID },
            { $set: propertyCreateObj },
            { new: true }
          );
      }
      if (onBoardedHotel) {
        let bookingdetail = {
          email,
          name,
          propertyName
        };
        const emailResult =
          await emailService.sendPasscodeEmail(
            email,
            // "argalhassan@gmail.com", //for testing
            null,
            null,
            "Property_Registration",
            bookingdetail
          );
        if (emailResult) {
          logger.info("mail sent sucessfully");
        }
      }
      // return res.status(200).send({
      //   success: true,
      //   message: "Integration with Wieldy successful",
      //   data: null
      // });
      return res.status(200).send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Wieldy App Authentication</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f7f7f7;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      height: 100vh;
                      margin: 0;
                      padding: 25px;
                  }
                  .container {
                      text-align: center;
                      background-color: #fff;
                      padding: 50px;
                      border-radius: 10px;
                      box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
                  }
                  h1 {
                      color: #4CAF50;
                  }
                  p {
                      font-size: 18px;
                      color: #333;
                  }
                  .title {
                      color: #5C6AC4;
                  }
              </style>
          </head>
          <body>

              <div class="container">
                  <h1>Connection Successful</h1>
                  <p>Our Team will contact you for further Mapping within 24 hours.</p>
              </div>

          </body>
          </html>
        `);
    } catch (error) {
      logger.info(`error =>${error}`);
      return res.status(500).send({
        success: false,
        message:
          "Already Exist/Error saving auth data disconnect and aconncet again",
        data: null
      });
    }
  } catch (error) {
    return res.status(500).send({
      sucess: false,
      message: "Internal Server Error",
      data: JSON.stringify(error.message)
    });
  }
}

async function displayHomePage(req, res) {
  try {
    return res.status(200).send({
      success: true,
      message: "Hello from weildy Cloudbeds home page",
      data: { hello: "hello" }
    });
  } catch (error) {
    logger.error(error.stack);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: JSON.stringify(error)
    });
  }
}

//check access token
async function checkAccessToken(token) {
  const url =
    "https://api.cloudbeds.com/api/v1.2/access_token_check";

  try {
    const response = await axios.post(url, null, {
      headers: {
        Authorization: `Bearer ${token}`
        //     Cookie:
        //       "acessa_session=60fa4d3b5f9ad6406f5087ebcf580f7c7dc995a6; acessa_session_enabled=1; csrf_accessa_cookie=483c6d1ec5ba7b404c99a5f83418a262"
      }
    });

    // logger.info(
    //   `Response data cas: ${JSON.stringify(
    //     response.data
    //   )}`
    // );
    return response.data.success || false;
  } catch (err) {
    console.error("Error checking access token:", err);
    return false;
  }
}

// async function renewAccessToken(req, res) {
async function renewAccessToken(refreshToken) {
  const url =
    "https://api.cloudbeds.com/api/v1.2/access_token";
  // const refreshToken = req.query.refreshToken;

  // Form data to be sent in the request body
  const postData = querystring.stringify({
    grant_type: "refresh_token",
    client_id: process.env.CLIENT_ID, // Replace with your actual client_id
    client_secret: process.env.CLIENT_SECRET, // Replace with your actual client_secret
    refresh_token: refreshToken // Replace with your actual refresh_token
  });

  try {
    const response = await axios.post(url, postData, {
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
        Cookie:
          "acessa_session=60fa4d3b5f9ad6406f5087ebcf580f7c7dc995a6; acessa_session_enabled=1; csrf_accessa_cookie=483c6d1ec5ba7b404c99a5f83418a262"
      }
    });

    // logger.info(
    //   `Response data ras: ${JSON.stringify(
    //     response.data
    //   )}`
    // );
    let accessToken = response.data.access_token;
    return accessToken;
    // res.send({
    //   accessToken: accessToken
    // });
  } catch (err) {
    console.error(
      "Error refreshing access token:",
      err
    );
    return response.err;
    //  res.send({
    //    err: err
    //  });
  }
}

async function buttonCall(req, res) {
  try {
    const token_url = `https://hotels.cloudbeds.com/api/v1.1/oauth?client_id=${process.env.CLIENT_ID}&redirect_uri=https%3A%2F%2Fcloudbed.wieldyportal.co.uk%2Fwebhook%2Fapi%2Fbodytest&response_type=code&scope=read%3Aroomblock+read%3Acommunication+write%3Acommunication+read%3AcustomFields+write%3AcustomFields+read%3Aguest+write%3Aguest+read%3Areservation+write%3Areservation+read%3Aroom+write%3Aroom`;
    const response = await axios.get(token_url);
    logger.info("response", response);
    if (response.status === 200) {
      logger.info("inside");
      return res.status(200).send({
        success: true,
        message: "got token in redirect uri",
        data: JSON.stringify({
          status: response.status,
          headers: response.headers,
          data: response.data
        })
      });
    }
  } catch (error) {
    return res.status(500).send({
      sucess: false,
      message: "Internal Server Error",
      data: JSON.stringify(error.message)
    });
  }
}

// monolitihic code with all calls partner version
// async function apibodytest(req, res) {
//   try {
//     logger.info("Req Body", req.body);

//     let body = req.body;
//     let query = req.query;

// //mine
//     // if (req.query.code) {
//     //   const code = req.query.code;
//     //   logger.info("code", code);
//     //   // Exchange authorization code for access token
//     //   const access_token_url =
//     //     "https://api.cloudbeds.com/api/v1.2/access_token";
//     //   const post_fields = {
//     //     grant_type: "authorization_code", // need to be dynamic
//     //     client_id: process.env.CLIENT_ID,
//     //     client_secret: process.env.CLIENT_SECRET,
//     //     redirect_uri: process.env.REDIRECT_URI,
//     //     code: code
//     //   };

//     //   const response_of_refreshToken_resource =
//     //     await axios.post(
//     //       access_token_url,
//     //       querystring.stringify(post_fields),
//     //       {
//     //         headers: {
//     //           "Content-Type":
//     //             "application/x-www-form-urlencoded"
//     //         }
//     //       }
//     //     );
//     //   logger.info(
//     //     "response of refresh token",
//     //     response_of_refreshToken_resource
//     //   );
//     //   const propertyID =
//     //     response_of_refreshToken_resource.resources[0]
//     //       .id;
//     //   // logger.info("response_data", response_data);
//     //   const refresh_token =
//     //     response_of_refreshToken_resource.refresh_token;

//     //   if (
//     //     refresh_token &&
//     //     response_of_refreshToken_resource.resources
//     //       .length > 0
//     //   ) {
//     //     // Save the access token and use it for further API requests make db call or save in db
//     //     logger.info("inside");
//     //     //create  collection with refresh_token and proprty id
//     //     const authCreateObj = {
//     //       refresh_token: refresh_token,
//     //       propertyId: propertyID
//     //     };

//     //     const authDataSaved =
//     //       await authCodeModel.create(authCreateObj);
//     //     if (authDataSaved) {
//     //       //get one time acess token

//     //       const post_fields = {
//     //         grant_type: "refresh_token_exchange", // need to be dynamic
//     //         client_id: process.env.CLIENT_ID,
//     //         client_secret: process.env.CLIENT_SECRET,
//     //         redirect_uri: process.env.REDIRECT_URI,
//     //         refresh_token: refresh_token
//     //       };

//     //       const response_of_cbat = await axios.post(
//     //         access_token_url,
//     //         querystring.stringify(post_fields)
//     //       );
//     //       const cbat_access_token =
//     //         response_of_cbat.data.access_token;
//     //       logger.info(
//     //         "cbat_access_token",
//     //         cbat_access_token
//     //       );

//     //       //register new property
//     //       const userInfo_token_url =
//     //         "https://api.cloudbeds.com/api/v1.2/userinfo";
//     //       const userInfo_response = await axios.get(
//     //         userInfo_token_url,
//     //         {
//     //           headers: {
//     //             Authorization: `Bearer ${cbat_access_token}`, // Use 'Bearer' or your specific authorization scheme
//     //             Cookie:
//     //               "acessa_session=1e4e93f63ea1b4268f1cb5cc9cef441f7e41df66; acessa_session_enabled=1; csrf_accessa_cookie=483c6d1ec5ba7b404c99a5f83418a262"
//     //           }
//     //         }
//     //       );

//     //       logger.info(
//     //         "userInfo_response",
//     //         userInfo_response
//     //       );

//     //       const name =
//     //         userInfo_response.first_name +
//     //         "_" +
//     //         userInfo_response.last_name;
//     //       const email = userInfo_response.email;
//     //       const hotetOwnerUserid =
//     //         userInfo_response.user_id;

//     //       const propertyCreateObj = {
//     //         name: name,
//     //         emailId: email,
//     //         hotetOwnerUserid: hotetOwnerUserid,
//     //         propertyId: propertyID
//     //       };

//     //       const onBoardedHotel = await property.create(
//     //         propertyCreateObj
//     //       );
//     //       if (onBoardedHotel) {
//     //         logger.info("property created sucess");
//     //         return res.status(200).send({
//     //           sucess: true,
//     //           message:
//     //             "Integration with Wieldy Sucess full",
//     //           data: null
//     //         });
//     //       }
//     //     }
//     //   } else {
//     //     return res.status(400).send({
//     //       sucess: false,
//     //       message:
//     //         "Error getting access and refresh token",
//     //       data: null
//     //     });
//     //   }
//       // }

//       // gpt
//       if (req.query.code) {
//         const code = req.query.code;
//         logger.info("code", code);

//         try {
//           // Exchange authorization code for access token
//           const access_token_url =
//             "https://api.cloudbeds.com/api/v1.2/access_token";
//           const post_fields = {
//             grant_type: "authorization_code", // need to be dynamic
//             client_id: process.env.CLIENT_ID,
//             client_secret: process.env.CLIENT_SECRET,
//             redirect_uri: process.env.REDIRECT_URI,
//             code: code
//           };

//           const response_of_refreshToken_resource =
//             await axios.post(
//               access_token_url,
//               querystring.stringify(post_fields),
//               {
//                 headers: {
//                   "Content-Type":
//                     "application/x-www-form-urlencoded"
//                 }
//               }
//             );
//           logger.info(
//             "response of refresh token",
//             response_of_refreshToken_resource
//           );

//           const propertyID =
//             response_of_refreshToken_resource.data
//               .resources[0].id;
//           const refresh_token =
//             response_of_refreshToken_resource.data
//               .refresh_token;

//           if (
//             refresh_token &&
//             response_of_refreshToken_resource.data
//               .resources.length > 0
//           ) {
//             logger.info("inside");

//             // Save the access token and use it for further API requests make db call or save in db
//             const authCreateObj = {
//               refresh_token: refresh_token,
//               propertyId: propertyID
//             };

//             try {
//               const authDataSaved =
//                 await authCodeModel.create(
//                   authCreateObj
//                 );

//               if (authDataSaved) {
//                 const post_fields = {
//                   grant_type: "refresh_token_exchange", // need to be dynamic
//                   client_id: process.env.CLIENT_ID,
//                   client_secret:
//                     process.env.CLIENT_SECRET,
//                   redirect_uri:
//                     process.env.REDIRECT_URI,
//                   refresh_token: refresh_token
//                 };

//                 try {
//                   const response_of_cbat =
//                     await axios.post(
//                       access_token_url,
//                       querystring.stringify(
//                         post_fields
//                       )
//                     );
//                   const cbat_access_token =
//                     response_of_cbat.data.access_token;
//                   logger.info(
//                     "cbat_access_token",
//                     cbat_access_token
//                   );

//                   // Register new property
//                   const userInfo_token_url =
//                     "https://api.cloudbeds.com/api/v1.2/userinfo";

//                   try {
//                     const userInfo_response =
//                       await axios.get(
//                         userInfo_token_url,
//                         {
//                           headers: {
//                             Authorization: `Bearer ${cbat_access_token}`,
//                             Cookie:
//                               "acessa_session=1e4e93f63ea1b4268f1cb5cc9cef441f7e41df66; acessa_session_enabled=1; csrf_accessa_cookie=483c6d1ec5ba7b404c99a5f83418a262"
//                           }
//                         }
//                       );

//                     logger.info(
//                       "userInfo_response",
//                       userInfo_response
//                     );

//                     const name = `${userInfo_response.data.first_name}_${userInfo_response.data.last_name}`;
//                     const email =
//                       userInfo_response.data.email;
//                     const hotetOwnerUserid =
//                       userInfo_response.data.user_id;

//                     const propertyCreateObj = {
//                       name: name,
//                       emailId: email,
//                       hotetOwnerUserid:
//                         hotetOwnerUserid,
//                       propertyId: propertyID
//                     };

//                     try {
//                       const onBoardedHotel =
//                         await property.create(
//                           propertyCreateObj
//                         );

//                       if (onBoardedHotel) {
//                         logger.info(
//                           "property created successfully"
//                         );
//                         return res.status(200).send({
//                           success: true,
//                           message:
//                             "Integration with Wieldy successful",
//                           data: null
//                         });
//                       }
//                     } catch (err) {
//                       console.error(
//                         "Error saving property data:",
//                         err
//                       );
//                       return res.status(500).send({
//                         success: false,
//                         message:
//                           "Error saving property data",
//                         data: null
//                       });
//                     }
//                   } catch (err) {
//                     console.error(
//                       "Error fetching user info:",
//                       err
//                     );
//                     return res.status(500).send({
//                       success: false,
//                       message:
//                         "Error fetching user info",
//                       data: null
//                     });
//                   }
//                 } catch (err) {
//                   console.error(
//                     "Error exchanging refresh token:",
//                     err
//                   );
//                   return res.status(500).send({
//                     success: false,
//                     message:
//                       "Error exchanging refresh token",
//                     data: null
//                   });
//                 }
//               }
//             } catch (err) {
//               console.error(
//                 "Error saving auth data:",
//                 err
//               );
//               return res.status(500).send({
//                 success: false,
//                 message: "Error saving auth data",
//                 data: null
//               });
//             }
//           } else {
//             return res.status(400).send({
//               success: false,
//               message:
//                 "Error getting access and refresh token",
//               data: null
//             });
//           }
//         } catch (err) {
//           console.error(
//             "Error exchanging authorization code:",
//             err
//           );
//           return res.status(500).send({
//             success: false,
//             message:
//               "Error exchanging authorization code",
//             data: null
//           });
//         }
//       }

//     res.status(400).send({
//       message: "some thing is missing",
//       "Body Received": body,
//       "Query recieved": query,
//       data: null
//     });
//   } catch (error) {
//     // logger.error(error.stack);
//     return res.status(500).send({
//       sucess: false,
//       message: "Internal Server Error",
//       data: JSON.stringify(error.message)
//     });
//   }
// }

//cloud beds test changes //segregated
// async function apibodytest(req, res) {
//   try {
//     logger.info("Req Body", req.body);

//     let body = req.body;
//     let query = req.query;
//     // logger.info(
//     //   `Request Body: ${JSON.stringify(req.body)}`
//     // );
//     const authCreateObj = {
//       authorization_code: req.query.code,
//       state: req.query.state
//     };

//     const authCodeSaved = await authCodeModel.create(
//       authCreateObj
//     );

//     let dataObj = {
//       authCode_Id: authCodeSaved._id,
//       auth_code:
//         authCodeSaved.authorization_code ||
//         req.query.code
//     };

//     if (authCodeSaved) {
//       let reciveTone = await getAccessToken(
//         req,
//         res,
//         dataObj
//       );
//       if (reciveTone) {
//         res.status(200).send({
//           message: "saved sucess",
//           "Body Received": body,
//           "Query recieved": query,
//           data: authCodeSaved
//         });
//       }
//       //when seprately calling so uncomment
//       //   res.status(200).send({
//       //     message: "saved sucess",
//       //     "Body Received": body,
//       //     "Query recieved": query,
//       //     data: authCodeSaved
//       //   });
//     }
//     res.status(400).send({
//       message: "some thing is missing",
//       "Body Received": body,
//       "Query recieved": query,
//       data: null
//     });
//   } catch (error) {
//     // logger.error(error.stack);
//     return res.status(500).send({
//       sucess: false,
//       message: "Internal Server Error",
//       data: JSON.stringify(error.message)
//     });
//   }
// }

//Step 1 get access and refresh token in the exchange of authorization code
async function getAccessToken(req, res, dataObj) {
  try {
    const { auth_code, authCode_Id } = dataObj;
    logger.info("dataobj", dataObj);
    // logger.info("req.query", req.query.code)
    // if (auth_code||req.query.code ) {
    if (auth_code || req.query.code) {
      // const code =  auth_code ||req.query.code ;
      const code = auth_code || req.query.code;
      logger.info("code", code);
      // Exchange authorization code for access token
      const token_url =
        "https://api.cloudbeds.com/api/v1.2/access_token";
      const post_fields = {
        grant_type: "authorization_code", // need to be dynamic
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        code: code
      };

      const response = await axios.post(
        token_url,
        querystring.stringify(post_fields),
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded"
          }
        }
      );
      logger.info("response", response);
      const response_data = response.data;
      let propertyID = response_data.resources[0].id;
      logger.info("response_data", response_data);

      if (
        response_data.refresh_token &&
        response_data.resources.length > 0
      ) {
        // Save the access token and use it for further API requests make db call or save in db
        logger.info("inside");
        let updatedRecord =
          await authCodeModel.findByIdAndUpdate(
            authCode_Id, // The ID of the record to update
            {
              refresh_token:
                response_data.refresh_token,
              propertyId: propertyID
            }, // The new value to set
            { new: true } // Option to return the updated document
          );

        //register new property
        const token_url =
          "https://api.cloudbeds.com/api/v1.2/userinfo";
        const authToken = await exchangeRefershToken(
          req,
          res,
          response_data.refresh_token
        );

        const response = await axios.get(token_url, {
          headers: {
            Authorization: `Bearer ${authToken}`, // Use 'Bearer' or your specific authorization scheme
            Cookie:
              "acessa_session=1e4e93f63ea1b4268f1cb5cc9cef441f7e41df66; acessa_session_enabled=1; csrf_accessa_cookie=483c6d1ec5ba7b404c99a5f83418a262"
          }
        });

        const name =
          response.first_name +
          "_" +
          response.last_name;
        const email = response.email;
        const hotetOwnerUserid = response.user_id;

        const propertyCreateObj = {
          propertyName: propertyName
            ? propertyName
            : null,
          name: name,
          emailId: email,
          hotetOwnerUserid: hotetOwnerUserid,
          propertyId: propertyID
        };

        const onBoardedHotel = await property.create(
          propertyCreateObj
        );
        if (onBoardedHotel) {
          logger.info("property created sucess");
        }
        if (updatedRecord) {
          logger.info("update sucess");
          return true;
          //   return res.status(200).send({
          //     sucess: true,
          //     message:
          //       "Access and refresh Token Fetched Sucess and updated into db ",
          //     data: {
          //       access_token:
          //         response_data.access_token,
          //       refresh_token:
          //         response_data.refresh_token,
          //       token_type: response_data.token_type,
          //       expires_in: response_data.expires_in,
          //       resources: response_data.resources
          //     }
          //   });
        }

        //when seprately calling so uncomment
        // return res.status(200).send({
        //   sucess: true,
        //   message:
        //     "Access and refresh Token Fetched Sucess",
        //   data: {
        //     access_token: response_data.access_token,
        //     refresh_token: response_data.refresh_token,
        //     token_type: response_data.token_type,
        //     expires_in: response_data.expires_in,
        //     resources: response_data.resources
        //   }
        // });
      } else {
        return res.status(400).send({
          sucess: false,
          message: "Error fetching access token",
          data: null
        });
      }
    } else {
      return res.status(404).send({
        sucess: false,
        message: "Authorization code not received",
        data: null
      });
    }
  } catch (error) {
    logger.error(error.stack);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: JSON.stringify(error)
    });
  }
}

// Step 2 Exchange Refresh Token for cbat access token one time use for every api hit needs to exchange
async function exchangeRefershToken(
  req,
  res,
  refreshToken
) {
  try {
    if (refreshToken || req.query.refresh_token) {
      const refresh_token =
        refreshToken || req.query.refresh_token;
      const token_url =
        "https://api.cloudbeds.com/api/v1.2/access_token";
      const post_fields = {
        grant_type: "refresh_token_exchange", // need to be dynamic
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        refresh_token: refresh_token
      };

      const response = await axios.post(
        token_url,
        querystring.stringify(post_fields)
      );
      const response_data = response.data;
      logger.info(response_data);

      if (response_data.access_token) {
        return response_data.access_token;
        // Save the access token and use it for further API requests make db call or save in db
        // return res.status(200).send({
        //   sucess: true,
        //   message: "Access Token Fetched Sucess",
        //     data: {
        //     response:response_data,
        //     access_token: response_data.access_token
        //   }
        // });
      } else {
        return res.status(400).send({
          sucess: false,
          message: "Error fetching access token",
          data: null
        });
      }
    } else {
      return res.status(404).send({
        sucess: false,
        message: "Refresh Token not received",
        data: null
      });
    }
  } catch (error) {
    logger.error(error.stack);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: JSON.stringify(error)
    });
  }
}

// posting our webhook/url for listening reservations data
async function sendWebhook(req, res) {
  try {
    if (!req.query.access_token) {
      return res.status(400).send({
        success: false,
        message: "Access token not recived",
        data: null
      });
    }
    const access_token = req.query.access_token;
    // Create a URL-encoded string from the data
    const postData = querystring.stringify({
      object: "reservation",
      action: "created",
      endpointUrl:
        "https://cloudbed.wieldyportal.co.uk/webhook/receive_booking_request"
    });

    // Make the POST request using axios
    const response = await axios.post(
      "https://api.cloudbeds.com/api/v1.2/postWebhook",
      postData,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type":
            "application/x-www-form-urlencoded",
          Cookie:
            "acessa_session_enabled=1; acessa_session=dc2f8b8f8e5bc04567bced6d56a934756e7bd444"
        },
        maxRedirects: 10,
        timeout: 0,
        followRedirect: true
      }
    );

    if (response.success) {
      // Log the response data
      logger.info(
        `Response Data: \n${JSON.stringify(
          response.data,
          null,
          2
        )}`
      );

      return res.status(200).send({
        success: true,
        message: "Web Hook posted Sucess",
        data: {
          subscriptionID: response.data.subscriptionID
        }
      });
    }

    logger.info(
      `Response Data: \n${JSON.stringify(
        response.data,
        null,
        2
      )}`
    );

    return res.status(400).send({
      success: false,
      message: "Error posting webhook",
      data: null
    });
  } catch (error) {
    logger.error(error.stack);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: JSON.stringify(error)
    });
  }
}

module.exports = {
  oAuth2O,
  oAuth2O1,
  sendWebhook,
  buttonCall,
  checkAccessToken,
  renewAccessToken,
  displayHomePage,
  getAccessToken,
  exchangeRefershToken
};
