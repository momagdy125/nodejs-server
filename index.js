const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const movieRouter = require("./routers/moviesRouter");
const userRouter = require("./routers/userRouter");
const favoriteRouter = require("./routers/favoriteRouter");
const mongoose = require("mongoose");
const globalErrorHandler = require("./middlewares/globalErrorhandler");
const ApiError = require("./Utils/apiError");

dotenv.config({ path: "./config.env" });
connectToDatabase();
const app = express();
Listen();
middlewareParsing();

// //using routes
app.use("/api/movies/", movieRouter);
app.use("/auth", userRouter);
app.use("/favorites", favoriteRouter);
app.all("*", (req, res, next) => {
  return next(new ApiError(`can't find ${req.url}`, 404));
});
app.use(globalErrorHandler);
function middlewareParsing() {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}
function Listen() {
  var port = process.env.port || 8000;

  app.listen(port, () => {
    console.log(`listening at ${port}`);
  });
}
function connectToDatabase() {
  mongoose
    .connect(process.env.connect_url)
    .then(console.log("connected to Database"))
    .catch((error) => {
      console.log("error has been occurred");
    });
}
