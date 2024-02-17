const movieModel = require("../models/moviesModel");
const apiError = require("../Utils/apiError");
exports.getAllMovies = (request, response, next) => {
  var Query = querySupportComparisons(request.query);
  Query = querySupportSubstring(Query);
  Query = RemovingFieldsFromQuery(Query, ["limit", "sort", "page"]);

  const DefaultLimit = request.query.limit || 4;
  if (request.query.page) request.query.limit = DefaultLimit;

  movieModel
    .find(Query, { __v: false })
    .sort(request.query.sort)
    .limit(request.query.limit)
    .skip((request.query.page - 1) * DefaultLimit)
    .then((movies) => {
      response.json({
        state: "success",
        length: movies.length,
        result: movies,
      });
    })
    .catch((error) => {
      next(new apiError(error.message, 404));
    });
};
exports.createMovie = (request, response, next) => {
  movieModel
    .create(request.body)
    .then((movie) => {
      response.json({ state: "success", movie: movie });
    })
    .catch((error) => {
      next(new apiError(error.message, 400));
    });
};

exports.editMovie = (request, response, next) => {
  movieModel
    .findByIdAndUpdate(request.params.id, request.body, {
      runValidators: true,
      new: true,
    })
    .then((updatedMovie) => {
      response.status(201).json({
        state: "success",
        UpdatedMovie: updatedMovie,
      });
    })
    .catch((error) => {
      next(new apiError(`cant't find Id ${request.params.id}`, 404));
    });
};
exports.deleteMovie = (request, response, next) => {
  movieModel
    .findByIdAndDelete(request.params.id, { new: true })
    .then((movieDoc) => {
      response.status(200).json({ state: "success", DeletedMovie: movieDoc });
    })
    .catch((error) => {
      next(new apiError(`cant't find Id ${request.params.id}`, 404));
    });
};

function RemovingFieldsFromQuery(query, fieldsToRemove) {
  const modifiedQuery = { ...query };

  fieldsToRemove.forEach((field) => {
    delete modifiedQuery[field];
  });
  return modifiedQuery;
}
function querySupportComparisons(query) {
  //handel comparisons queries
  queryString = JSON.stringify(query);
  queryStringUpdated = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  var advancedQuery = JSON.parse(queryStringUpdated);

  return advancedQuery;
}
function querySupportSubstring(query) {
  if (query.name) {
    query.name = { $regex: query.name, $options: "i" };
  }
  return query;
}
