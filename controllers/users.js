const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const { JWT_SECRET } = require("../utils/config");

const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ConflictError("Email already exists"));
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
      return next(new ConflictError("Email already exists"));
    }
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data provided"));
    }
    return next(err);
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError("Incorrect email or password"));
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((user) => res.send(user))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
      } else {
        next(err);
      }
    });
};

module.exports = { createUser, login, getCurrentUser, updateUser };
