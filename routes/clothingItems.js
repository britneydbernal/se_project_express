const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// CREATE
router.post("/", auth, createItem);

// READ
router.get("/", auth, getItems);

// DELETE
router.delete("/:itemId", auth, deleteItem);

// LIKE
router.put("/:itemId/likes", auth, likeItem);

// UNLIKE
router.delete("/:itemId/likes", auth, unlikeItem);

module.exports = router;
