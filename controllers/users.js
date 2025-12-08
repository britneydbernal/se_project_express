const jwt = require("jsonwebtoken");

const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICT,
  UNAUTHORIZED,
  MESSAGES,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({ message: MESSAGES.BAD_REQUEST });
  }

  User.create({
    name,
    avatar,
    email,
    password,
  })

    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(201).send({
        data: {
          _id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          token,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: MESSAGES.CONFLICT });
      }
      return res.status(SERVER_ERROR).send({ message: MESSAGES.SERVER_ERROR });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({ message: MESSAGES.BAD_REQUEST });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(() => {
      res.status(UNAUTHORIZED).send({ message: MESSAGES.UNAUTHORIZED });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: MESSAGES.NOT_FOUND });
      }
      return res.status(SERVER_ERROR).send({ message: MESSAGES.SERVER_ERROR });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: MESSAGES.BAD_REQUEST });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: MESSAGES.NOT_FOUND });
      }
      return res.status(SERVER_ERROR).send({ message: MESSAGES.SERVER_ERROR });
    });
};

module.exports = { createUser, login, getCurrentUser, updateUser };
