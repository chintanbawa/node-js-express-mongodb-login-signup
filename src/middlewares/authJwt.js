const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const { HTTP401Error, APIError } = require('../error/index.js');
const HttpStatusCode = require('../error/HttpStatusCode.js');
const db = require('../models');
const User = db.user;

const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) throw new APIError('Not provide', HttpStatusCode.NOT_PROVIDED, true, 'No token provided!');

    if (token.includes('Bearer')) token = token.replace('Bearer ', '');

    try {
      const decode = await jwt.verify(token, config.secret);
      req.user = await User.findById(decode.id);
      next();
    } catch (error) {
      throw new HTTP401Error('Unauthorized!');
    }
  } catch (error) {
    return res.status(error.httpCode).send(error);
  }
};

const authJwt = {
  verifyToken,
};
module.exports = authJwt;
