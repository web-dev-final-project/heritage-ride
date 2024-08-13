import { HttpResponse, HttpStatus } from "../utils/class.js";
import {
  AccessException,
  AuthenticationException,
  NotFoundException,
  ValidationException,
} from "../utils/exceptions.js";
import logger from "../utils/logger.js";

function error(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  logger.error(err.stack);
  if (err instanceof AuthenticationException)
    res.status(400).send(new HttpResponse(err.message, HttpStatus.FAILED));
  else if (err instanceof ValidationException)
    res.status(400).send(new HttpResponse(err.message, HttpStatus.FAILED));
  else if (err instanceof AccessException)
    res.status(403).send(new HttpResponse(err.message, HttpStatus.FAILED));
  else if (err instanceof NotFoundException)
    res.status(404).send(new HttpResponse(err.message, HttpStatus.FAILED));
  else res.status(500).send(new HttpResponse(err.message, HttpStatus.FAILED));
}

export default error;
