import {
  AccessException,
  AuthenticationException,
  NotFoundException,
  ValidationException,
} from "../utils/exceptions.js";
import logger from "../utils/logger.js";

function error(err, req, res, next) {
  logger.error(err.stack);
  if (err instanceof ValidationException)
    return res.status(400).send(err.message);
  if (err instanceof AuthenticationException)
    return res.status(401).send(err.message);
  if (err instanceof AccessException) return res.status(403).send(err.message);
  if (err instanceof NotFoundException)
    return res.status(404).send(err.message);
  res.status(500).send(err.message);
  next();
}

export default error;
