const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const auth = require("./middlewares/auth");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db").catch(() => {
  console.error("Error connecting to the database");
});

app.use(cors());
app.use(express.json());

const { login, createUser } = require("./controllers/users");
const { SERVER_ERROR, MESSAGES } = require("./utils/errors");

app.post("/signin", login);
app.post("/signup", createUser);

app.use(auth);
app.use(mainRouter);

app.use((err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;
  res.status(statusCode).send({
    message: statusCode === SERVER_ERROR ? MESSAGES.SERVER_ERROR : message,
  });
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}
