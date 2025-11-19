const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// CREATE
router.post("/", createItem);

// READ
router.get("/", getItems);

// DELETE
router.delete("/:itemId", deleteItem);

// LIKE
router.put("/:itemId/likes", likeItem);

// UNLIKE
router.delete("/:itemId/likes", unlikeItem);

module.exports = router;
