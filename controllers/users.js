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

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({ message: MESSAGES.BAD_REQUEST });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(CONFLICT).send({ message: MESSAGES.CONFLICT });
    }

    const user = await User.create({
      name,
      avatar,
      email,
      password,
    });

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).send({
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        token,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(CONFLICT).send({ message: MESSAGES.CONFLICT });
    }
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: MESSAGES.BAD_REQUEST });
    }
    return res.status(SERVER_ERROR).send({ message: MESSAGES.SERVER_ERROR });
  }
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
      return res.send({ token });
    })
    .catch(() => {
      return res.status(UNAUTHORIZED).send({ message: MESSAGES.UNAUTHORIZED });
    });
};

const getCurrentUser = (req, res) => {
  return User.findById(req.user._id)
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
  return User.findByIdAndUpdate(
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
