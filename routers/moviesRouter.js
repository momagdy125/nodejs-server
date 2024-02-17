const express = require("express");
const moviesController = require("../controllers/moviesController.js");
const auth = require("../middlewares/auth.js");
const { rule } = require("../Utils/rules.js");

const movieRouter = express.Router();

movieRouter.get("/", moviesController.getAllMovies);

movieRouter.post(
  "/",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  moviesController.createMovie
);

movieRouter.put(
  "/:id",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  moviesController.editMovie
);

movieRouter.delete(
  "/:id",
  auth.verifyToken,
  auth.isAuthorized(rule.ADMIN, rule.OWNER),
  moviesController.deleteMovie
);

module.exports = movieRouter;
