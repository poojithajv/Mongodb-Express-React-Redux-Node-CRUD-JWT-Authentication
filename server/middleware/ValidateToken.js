const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const logger=require('../util/logger')

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWTSECRETKEY, (err, decoded) => {
      if (err) {
        res.status(401)
        logger.error("User is not authorized")
        return res.json({message:"User is not authorized"});
      }
      req.user = decoded.user;
      next();
    });

    if (!token) {
      logger.error("User is not authorized or token is missing")
      return res.status(401).send({message:"User is not authorized or token is missing"})
    }
  }
});

module.exports = validateToken;