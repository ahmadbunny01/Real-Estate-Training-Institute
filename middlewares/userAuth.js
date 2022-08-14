const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const User = require("../models/User");

const userAuth = (req, res, next) => {
  const token = req.cookies.jwttoken;
  if (token) {
    jwt.verify(token, secretKey, (err, decodedToken) => {
      if (err) {
        console.log(err);
      } else {
        const id = decodedToken.userId;
        req.id = id;
        next();
      }
    });
  } else {
    next();
  }
};

module.exports = { userAuth };
