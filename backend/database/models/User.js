require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SALT = 10;

const Schema = mongoose.Schema;
const User = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email field is required!"],
      trim: true,
      unique: 1,
    },
    password: {
      type: String,
      required: [true, "Password field is required!"],
      trim: true,
      minlength: 5,
    },
    token: {
      type: String,
    },
  },
  {
    collection: "users",
  }
);
//saving user data

User.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    //checking if password field is available and modified
    bcrypt.genSalt(SALT, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

//for comparing the users entered password with database during login
User.methods.comparePassword = function (candidatePassword, callBack) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return callBack(err);
    callBack(null, isMatch);
  });
};
//for generating token when logged-in
User.methods.generateToken = function (callBack) {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), process.env.SECRETE);
  user.token = token;
  user.save(function (err, user) {
    if (err) return callBack(err);
    callBack(null, user);
  });
};
//validating token for auth routes middleware
User.statics.findByToken = function (token, callBack) {
  const user = this;
  jwt.verify(token, process.env.SECRETE, function (err, decode) {
    //this decode must give user_id if token is valid .ie decode=user_id

    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) return callBack(err);
      callBack(null, user);
    });
  });
};
module.exports = mongoose.model("User", User);
