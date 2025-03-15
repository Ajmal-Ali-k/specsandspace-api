const JWT = require('jsonwebtoken');
const validator = require('validator');
const dotenv = require("dotenv").config();

 const jwtSecret = "Irshad123"

module.exports = async (req, res, next) => {
  try {
    // Skip token verification for OPTIONS requests
    if (req.method === 'OPTIONS') {
      return next();
    }
    console.log(req.headers['authorization'])
    const token = req.headers['authorization']?.split(" ")[1];
    if (!token) {
      return res.status(401).send({
        message: 'Token not provided',
        success: false
      });
    }

    JWT.verify(token, jwtSecret, (err, decode) => {
      if (err || !validator.isJWT(token)) {
        return res.status(401).send({
          message: 'Auth Failed verify',
          success: false
        });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    res.status(401).send({
      message: "Auth Failed",
      success: false,
    });
  }
};
