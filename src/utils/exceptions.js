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
    super(message || `Page not found`);
  }
}
class DataBaseException extends Error {
  constructor(message) {
    super(message || `Something has failed due to server error.`);
  }
}

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
};
