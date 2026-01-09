const router = require("express").Router();
const userRouter = require("./users");
const clothingItems = require("./clothingItems");
const NotFoundError = require("../errors/NotFoundError");

router.use("/users", userRouter);
router.use("/items", clothingItems);

router.use((req, res, next) => {
  next(new NotFoundError("The requested resource was not found"));
});

module.exports = router;
