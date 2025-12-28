const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db").catch(() => {});

app.use(cors());
app.use(express.json());

const { login, createUser } = require("./controllers/users");
const { getItems } = require("./controllers/clothingItems");
const { SERVER_ERROR, MESSAGES } = require("./utils/errors");

app.post("/signin", login);
app.post("/signup", createUser);
app.get("/items", getItems);

app.use("/", mainRouter);

app.use((err, req, res) => {
  const { statusCode = SERVER_ERROR, message } = err;
  res.status(statusCode).send({
    message: statusCode === SERVER_ERROR ? MESSAGES.SERVER_ERROR : message,
  });
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
