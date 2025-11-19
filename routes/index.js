const router = require("express").Router();
const userRouter = require("./users");
const clothingItems = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingItems);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
