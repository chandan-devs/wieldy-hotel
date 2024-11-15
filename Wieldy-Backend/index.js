const express = require("express");
const app = express();
const connection = require("./config/db");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

//routes import
const logger = require("./logger/winstonLogger");
const siteminderRoutes = require("./src/siteminder/routes/reservationRoutes");
const cloudBedsRoutes = require("./src/cloudbeds/routes/authenticationRouterCB");
const lockRouter = require("./routes/lockRouter");
const guestRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRoutes");

const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);
app.use(bodyParser.text({ type: "application/xml" }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//for user app level make common router and call controller based on source

//test sitmeminder first if the deployed working then go to cloud beds

//base route
app.get("/", async (req, res) => {
  return res.status(200).send({
    sucess: true,
    message: "Weildy Backend Working",
  });
});

//routes
app.use("/siteminder", siteminderRoutes);
app.use("/cloudBeds", cloudBedsRoutes);
app.use("/", lockRouter);
app.use("/guest", guestRouter);
app.use("/admin", adminRouter);

app.listen(process.env.PORT || 3001, async () => {
  try {
    await connection;
    logger.info(`Connected To DataBase`);
  } catch (error) {
    logger.info(`${JSON.stringify({ Error: error.message })}`);
  }
  logger.info(`server is running at ${process.env.PORT || 3001}`);
});
