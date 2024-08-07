import { ObjectId } from "mongodb";
import { InvalidInputException, InvalidValueException } from "./exceptions.js";
import { Role } from "./extend.js";

class Validator {
  static validateQuery(query) {
    const { make, model, year, category } = query;
    const errors = [];
    // Validate make
    if (make && typeof make !== 'string') {
        errors.push('Make must be a string');
    }
    // Validate model
    if (model && typeof model !== 'string') {
        errors.push('Model must be a string');
    }
    // Validate year
    if (year) {
        const yearNum = parseInt(year, 10);
        if (isNaN(yearNum) || yearNum > new Date().getFullYear()) {
            errors.push('Year must be a valid number less than the current year');
        }
    }
    return errors;
}
  static validateListing(obj) {
    if (!obj || typeof obj !== 'object') {
      throw new InvalidInputException("Listing object must be provided and must be an object.");
    }
    let listing = {
      ...obj,
      title: Validator.nullcheck(obj.title).checkString(),
      description: Validator.nullcheck(obj.description).checkString(),
      price: Validator.nullcheck(obj.price).checkNumber(),
      category: Validator.nullcheck(obj.category).checkString(),
    };
    return listing;
  }

  static validateCar(obj) {
    return obj;
  }

  static validateUser(obj) {
    if (!obj || obj === undefined)
      throw new InvalidInputException("Input must not be empty");
    let user = {
      ...obj,
      firstName: Validator.nullcheck(obj.firstName).checkString(),
      lastName: Validator.nullcheck(obj.lastName).checkString(),
      userName: Validator.nullcheck(obj.userName).checkString(),
      password: Validator.nullcheck(obj.password).checkString(),
      avatar: Validator.nullcheck(obj.avatar).checkString().checkUrl(),
      email: Validator.nullcheck(obj.email).checkString().checkEmail(),
      address: obj.address ? obj.address.checkString() : obj.address,
    };
    return user;
  }
  static validateId(id) {
    let str = id.checkNull().checkString();
    if (!ObjectId.isValid(str)) {
      throw new InvalidValueException("Invalid Id.");
    }
    return str;
  }
  static validateRole(role) {
    const arr = role.checkNull().checkStringArray();
    if (arr.some((item) => !Role.containsValue(item))) {
      throw new InvalidValueException(
        "Invalid role, role must be either user, expert or seller"
      );
    }
    return arr;
  }

  static validatePart(obj) {
    return obj;
  }

  static nullcheck(obj) {
    if (!obj) throw new InvalidInputException("Some inputs are missing");
    return obj;
  }
}

export default Validator;
