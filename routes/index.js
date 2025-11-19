const router = require("express").Router();
const userRouter = require("./users");
const clothingItems = require("./clothingItems");
const { NOT_FOUND, MESSAGES } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothingItems);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: MESSAGES.NOT_FOUND });
});

module.exports = router;
