class NullException extends Error {
  constructor(object) {
    super(`${object} can not be null.`);
  }
}
class InvalidInputException extends Error {}
class TypeException extends TypeError {}
class InvalidValueException extends Error {}
class EmptyStringException extends Error {}
class ValidationException extends Error {}
class AuthenticationException extends Error {}
class AccessException extends Error {}
class NotFoundException extends Error {}

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
};
