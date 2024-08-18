import logger from "./logger.js";

class NullException extends Error {
  constructor(object) {
    super(`${object} can not be null.`);
  }
}
class ValidationException extends Error {
  constructor(message) {
    super(message || `Invalid input parameters`);
  }
}
class InvalidInputException extends ValidationException {
  constructor(message) {
    super(message);
  }
}
class TypeException extends ValidationException {
  constructor(message) {
    super(message || `Invalid input type`);
  }
}
class InvalidValueException extends ValidationException {
  constructor(message) {
    super(message || `Invalid input value`);
  }
}
class EmptyStringException extends ValidationException {
  constructor(message) {
    super(message || `String should not be empty`);
  }
}
class AuthenticationException extends Error {
  constructor(message) {
    super(message || `Authentication failed`);
  }
}
class AccessException extends Error {
  constructor(message) {
    super(message || `User have no access, please contact admin`);
  }
}
class NotFoundException extends Error {
  constructor(message) {
    super(message || `Result not found`);
  }
}
class PageNotFoundException extends Error {
  constructor() {
    super(`Page not found`);
  }
}
class DataBaseException extends Error {
  constructor(message) {
    super(message || `Something has failed due to server error.`);
  }
}

const databaseExceptionHandler = (e) => {
  logger.error(e.stack);
  if (e instanceof NotFoundException) {
    throw new NotFoundException(e.message);
  }
  if (e instanceof ValidationException) {
    throw new ValidationException(e.message);
  }
  if (e instanceof AccessException) {
    throw new AccessException(e.message);
  }
  if (e instanceof TypeError) {
    throw new Error(e.message);
  }
  throw new DataBaseException("Something has faild during database operation.");
};

export {
  TypeException,
  InvalidValueException,
  InvalidInputException,
  NullException,
  EmptyStringException,
  ValidationException,
  AuthenticationException,
  NotFoundException,
  AccessException,
  DataBaseException,
  PageNotFoundException,
  databaseExceptionHandler,
};
