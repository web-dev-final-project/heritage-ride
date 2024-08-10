import { HttpResponse, HttpStatus } from "../utils/class.js";
import {
  AccessException,
  AuthenticationException,
  NotFoundException,
  ValidationException,
} from "../utils/exceptions.js";
import logger from "../utils/logger.js";

function error(err, req, res, next) {
  logger.error(err.stack);
  if (err instanceof AuthenticationException)
    return res
      .status(400)
      .send(new HttpResponse(err.message, HttpStatus.FAILED));
  if (err instanceof ValidationException)
    return res
      .status(400)
      .send(new HttpResponse(err.message, HttpStatus.FAILED));
  if (err instanceof AccessException)
    return res
      .status(403)
      .send(new HttpResponse(err.message, HttpStatus.FAILED));
  if (err instanceof NotFoundException)
    return res
      .status(404)
      .send(new HttpResponse(err.message, HttpStatus.FAILED));
  res.status(500).send(new HttpResponse(err.message, HttpStatus.FAILED));
  next();
}

export default error;
