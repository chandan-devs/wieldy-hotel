const winston = require("winston");
require("dotenv").config();
const path = require("path");

function timezone() {
  const date = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Calcutta"
  });

  const [day, month, year] = new Date(date)
    .toLocaleDateString("en-GB")
    .split("/");
  const time = new Date(date).toLocaleTimeString(
    "en-US",
    { hour12: false }
  );

  return `${day}-${month}-${year} ${time}`;
}

const transportDefinitions = {
  file: {
    level: "info",
    filename: "test.log",
    dirname: path.join(__dirname, "../logs/test.log"),
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: winston.format.combine(
      winston.format.timestamp({ format: timezone }),
      winston.format.errors({ stack: true }),
      winston.format.printf((info) => {
        const timestamp = info.timestamp
          ? `[${info.timestamp}]`
          : "";
        return `${timestamp} ${info.level}: ${
          info.message
        }${info.stack ? "\n" + info.stack : ""}`;
      })
    )
  },
  console: {
    level: "info",
    handleExceptions: true,
    json: false,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: timezone }),
      winston.format.printf((info) => {
        const timestamp = info.timestamp
          ? `[${info.timestamp}]`
          : "";
        return `${timestamp} ${info.level}: ${
          info.message
        }${info.stack ? "\n" + info.stack : ""}`;
      })
    )
  }
};

let transportData = [
  new winston.transports.File(
    transportDefinitions.file
  ),
  new winston.transports.Console(
    transportDefinitions.console
  )
];

const logger = winston.createLogger({
  transports: transportData,
  exitOnError: false
});

module.exports = logger;
