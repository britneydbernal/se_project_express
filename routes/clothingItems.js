const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// READ
router.get("/", auth, getItems);

// CREATE
router.post("/", auth, createItem);

// DELETE
router.delete("/:itemId", auth, deleteItem);

// LIKE
router.put("/:itemId/likes", auth, likeItem);

// UNLIKE
router.delete("/:itemId/likes", auth, unlikeItem);

module.exports = router;
