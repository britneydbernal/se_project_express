const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  SERVER_ERROR,
  MESSAGES,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: MESSAGES.BAD_REQUEST });
      }
      return res.status(SERVER_ERROR).send({ message: MESSAGES.SERVER_ERROR });
    });
};

const getItems = (req, res) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: MESSAGES.SERVER_ERROR });
    });

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => {
      const error = new Error(MESSAGES.NOT_FOUND);
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        res.status(FORBIDDEN).send({ message: MESSAGES.FORBIDDEN });
      } else {
        ClothingItem.deleteOne(item)
          .then(() =>
            res.status(200).send({ message: "Item deleted", data: item })
          )
          .catch(() => {
            res.status(SERVER_ERROR).send({ message: MESSAGES.SERVER_ERROR });
          });
      }
    })
    .catch((err) => {
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: MESSAGES.NOT_FOUND });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: MESSAGES.BAD_REQUEST });
      }
      return res.status(SERVER_ERROR).send({ message: MESSAGES.SERVER_ERROR });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error(MESSAGES.NOT_FOUND);
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: MESSAGES.NOT_FOUND });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: MESSAGES.BAD_REQUEST });
      }
      return res.status(SERVER_ERROR).send({ message: MESSAGES.SERVER_ERROR });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error(MESSAGES.NOT_FOUND);
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: MESSAGES.NOT_FOUND });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: MESSAGES.BAD_REQUEST });
      }
      return res.status(SERVER_ERROR).send({ message: MESSAGES.SERVER_ERROR });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
