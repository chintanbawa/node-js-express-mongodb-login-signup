const jwt = require('jsonwebtoken');

const { handleError, HTTP404Error, HTTP401Error } = require('../error');
const HttpStatusCode = require('../error/HttpStatusCode');
const { authJwt } = require('../middlewares');
const db = require('../models');
const User = db.user;

const signup = async (req, res) => {
  try {
    try {
      let user = new User(req.body);
      user.tokens = user.tokens.concat(user.generateToken());
      user = await (await user.save()).populate('roles');

      return res.status(HttpStatusCode.OK).json(user);
    } catch (error) {
      handleError(error);
    }
  } catch (error) {
    return res.status(error.httpCode).send(error);
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({
      username,
    });

    if (!user) {
      user = await User.findOne({
        email: username,
      });
      if (!user) throw new HTTP404Error('User Not found.');
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new HTTP401Error('Invalid Password!');
    }

    user.tokens = user.tokens.concat(user.generateToken());
    user = await (await user.save()).populate('roles');

    res.status(HttpStatusCode.OK).json(user);
  } catch (error) {
    return res.status(error.httpCode).send(error);
  }
};

const signout = async (req, res) => {
  try {
    const token = req.headers.authorization;
    req.user.tokens = req.user.tokens.filter((t) => t !== token);
    await req.user.save();
    return res.status(HttpStatusCode.OK).send({ message: "You've been signed out!" });
  } catch (error) {
    return res.status(error.httpCode).send(error);
  }
};

const signoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    return res.status(HttpStatusCode.OK).send({ message: "You've been signed out from all devices!" });
  } catch (error) {
    return res.status(error.httpCode).send(error);
  }
};

const authController = {
  signup,
  signin,
  signout,
  signoutAll,
};

module.exports = authController;
