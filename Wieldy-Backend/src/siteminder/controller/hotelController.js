const siteminderProperty = require("../model/SMXHotelModel");
const siteminderValidation = require("../service/siteminderValidations");
const Source = require("../../../models/sourceModel");
const { default: mongoose } = require("mongoose");
const {
  S3Client,
  PutObjectCommand
} = require("@aws-sdk/client-s3");
require("dotenv").config();
const logger = require("../../../logger/winstonLogger");

/**
 * @param {*} req
 * @param {*} res
 */

async function onBoardHotel(req, res) {
  try {
    logger.info(
      `<< Main process start Onboarding Hotels >>`
    );
    const { value, error } =
      siteminderValidation.validateSiteminderHotel(
        req.body
      );
    if (error) {
      return res.status(400).json({
        success: false,
        message: "VALIDATION ERROR",
        data: error
      });
    }

    const checkPropertyName =
      await siteminderProperty.findOne({
        propertyName: value.propertyName
      });
    if (checkPropertyName) {
      return res.status(400).json({
        success: false,
        message: "Property Name is already exist",
        data: null
      });
    }
    const checkPropertyId =
      await siteminderProperty.findOne({
        propertyId: value.propertyId
      });
    if (checkPropertyId) {
      return res.status(400).json({
        success: false,
        message: "Property Id is already exist",
        data: null
      });
    }
    const checkEmail =
      await siteminderProperty.findOne({
        emailId: new RegExp(
          "^" + value.emailId + "$",
          "i"
        )
      });
    if (checkEmail) {
      return res.status(400).json({
        success: false,
        message: "DUPLICATE ENTRY EMAILID",
        data: null
      });
    }
    const checkPhoneNo =
      await siteminderProperty.findOne({
        "phoneNo.number": value.phoneNo.number
      });

    if (checkPhoneNo) {
      return res.status(400).json({
        success: false,
        message: "PHONE NO ALREADY EXIST",
        data: null
      });
    }

    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadImage(
        req.file,
        value.propertyId,
        value.propertyName.replace(/ +/g, "_")
      );

      if (imageUrl === "MAX ALLOWED SIZE") {
        return res.status(413).json({
          message: "MAX ALLOWED SIZE 5 mb"
        });
      } else if (imageUrl === "INVALID FILE") {
        return res
          .status(415)
          .json({ message: "INVALID FILE" });
      }
    }
    //finding PMS Source-----------------
    const sourceExists = await Source.findOne({
      sourceName: value.PMSsource
    }).select("sourceName");

    //  console.log("sourceExists", sourceExists);

    if (sourceExists.sourceName !== value.PMSsource) {
      return res.status(400).json({
        success: false,
        message: "Not a valid Source",
        data: null
      });
    }
    // --------------------------

    const hotelCreateObject = {
      propertyName: value.propertyName,
      propertyId: value.propertyId,
      propertyType: value.propertyType,
      emailId: value.emailId,
      phoneNo: {
        countryCode: value.phoneNo.countryCode,
        number: value.phoneNo.number
      },
      propertyLocation: {
        street: value.propertyLocation.street,
        city: value.propertyLocation.city,
        state: value.propertyLocation.state,
        country: value.propertyLocation.country
      },
      statusBar: "Onboarding",
      PMSsource: new mongoose.Types.ObjectId(
        sourceExists._id
      ),
      propertyPublisherName:
        value.propertyPublisherName,
      PropertyImage: imageUrl,
      defaultTimeZone:
        value.defaultTimeZone || "Asia/Calcutta",
      defaultCheckInTime: value.defaultCheckInTime,
      defaultCheckOutTime: value.defaultCheckOutTime
    };

    const onBoardedHotel =
      await siteminderProperty.create(
        hotelCreateObject
      );
    logger.info(
      `<< Main process end Onboarding Hotels >>`
    );

    return res.status(200).json({
      success: true,
      message: "Hotel Onboarded sucess via Siteminder",
      data: onBoardedHotel
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


//service function need to moved to new service page
async function uploadImage(
  file,
  propertyId,
  newImageName
) {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png"
  ];

  console.log("file", file);
  if (allowedTypes.includes(file.mimetype)) {
    if (file.size < 5000000) {
      // 5MB limit
      const uniqueSuffix =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9);
      const filename = `${newImageName}-${uniqueSuffix}.${file.originalname
        .split(".")
        .pop()}`;
      const filePath = `${process.env.AWSBUCKETURL}hotel/${propertyId}/${filename}`;

      const credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:
          process.env.AWS_SECRET_ACCESS_KEY
      };

      const region = process.env.AWS_REGION;
      const bucketName =
        process.env.AWS_S3_BUCKET_NAME;
      const s3 = new S3Client({ region, credentials });

      const params = {
        Bucket: bucketName,
        Key: `hotel/${propertyId}/${filename}`,
        ContentType: file.mimetype,
        Body: Buffer.from(file.buffer)
      };

      try {
        await s3.send(new PutObjectCommand(params));
        return filePath;
      } catch (err) {
        console.error("Error uploading to S3:", err);
        throw new Error("Error uploading image");
      }
    } else {
      return "MAX ALLOWED SIZE";
    }
  } else {
    return "INVALID FILE";
  }
}

module.exports = {
  onBoardHotel
};
