const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const {
  validateCardBody,
  validateItemId,
} = require("../middlewares/validation");

// READ
router.get("/", auth, getItems);

// CREATE
router.post("/", auth, validateCardBody, createItem);

// DELETE
router.delete("/:itemId", auth, validateItemId, deleteItem);

// LIKE
router.put("/:itemId/likes", auth, validateItemId, likeItem);

// UNLIKE
router.delete("/:itemId/likes", auth, validateItemId, unlikeItem);

module.exports = router;
