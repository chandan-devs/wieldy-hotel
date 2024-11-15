const jwt = require("jsonwebtoken");

require("dotenv").config();

function guestAuth(req, res, next) {
  try {
    let token = req.headers.token;
    if (!token) {
      return res.status(404).send({
        success: false,
        messages: "Token not found",
        data: null
      });
    }

    jwt.verify(
      token,
      process.env.GUEST_AUTH_KEY,
      (err, decoded) => {
        if (err) {
          return res.status(401).send({
            success: false,
            message: "LOGIN AGAIN",
            data: null
          });
        }
        req.user = req.user || {};
        req.user.id = decoded.userId;
        req.user.permissions = decoded.permissions;
        next();
      }
    );
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: JSON.stringify(error)
    });
  }
}

module.exports = guestAuth;
