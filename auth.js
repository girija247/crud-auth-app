// errorHandler.js
import { errorTemplate } from "./apiContract.js";

export default function errorHandler(err, req, res, next) {
  console.error(err); // Log for debugging
  res
    .status(500)
    .json(errorTemplate("INTERNAL_SERVER_ERROR", "Something went wrong"));
}
