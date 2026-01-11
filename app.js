require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db").catch(() => {});

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/", mainRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

//app.use((err, req, res) => {
//const { statusCode = SERVER_ERROR, message } = err;
//res.status(statusCode).send({
//message: statusCode === SERVER_ERROR ? MESSAGES.SERVER_ERROR : message,
//});
//});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
