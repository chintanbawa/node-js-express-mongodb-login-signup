const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const config = require('../config/auth.config');
const Role = require('./role.model');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
  ],
  tokens: { type: Array },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_WORK_FACTOR));
    this.password = await bcrypt.hash(this.password, salt);
    this.roles = await Role.find({ name: 'user' });
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, config.secret, {
    expiresIn: 86400, // 24 hours
  });
};

UserSchema.methods.toJSON = function () {
  var obj = this.toObject();
  //remove following props from response
  delete obj.password;
  delete obj.__v;

  return obj;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
