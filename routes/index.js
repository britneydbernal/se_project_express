const router = require("express").Router();
const userRouter = require("./users");
const clothingItems = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const {
  validateAuthentication,
  validateUserBody,
} = require("../middlewares/validation");
const NotFoundError = require("../errors/NotFoundError");

router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("The server will crash now");
  }, 0);
});

router.post("/signin", validateAuthentication, login);
router.post("/signup", validateUserBody, createUser);

router.use("/users", userRouter);
router.use("/items", clothingItems);

router.use((req, res, next) => {
  next(new NotFoundError("The requested resource was not found"));
});

module.exports = router;
