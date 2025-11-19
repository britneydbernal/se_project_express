const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  MESSAGES,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(SERVER_ERROR).send({ message: MESSAGES.SERVER_ERROR }));
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: MESSAGES.BAD_REQUEST });
      } else {
        res.status(SERVER_ERROR).send({ message: MESSAGES.SERVER_ERROR });
      }
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: MESSAGES.NOT_FOUND });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: MESSAGES.BAD_REQUEST });
      }
      return res.status(SERVER_ERROR).send({ message: MESSAGES.SERVER_ERROR });
    });
};

module.exports = { getUsers, createUser, getUser };
