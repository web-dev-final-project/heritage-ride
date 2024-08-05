import { ObjectId } from "mongodb";
import { InvalidInputException, InvalidValueException } from "./exceptions.js";
import { Role } from "./extend.js";

class Validator {
  static validateListing(obj) {
    return obj;
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
    let str = this.nullcheck(id).checkString();
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

  static validateExpert(obj) {
    if (!obj || obj === undefined)
      throw new InvalidInputException("Input must not be empty");
    let expert = {
      ...obj,
      userId: Validator.nullcheck(obj.userId).checkString().checkObjectId(),
      bio: Validator.nullcheck(obj.bio).checkString(),
      skills: Validator.nullcheck(obj.skills).checkStringArray(),
      location: Validator.nullcheck(obj.location).checkString(),
      images: Validator.nullcheck(obj.images).checkStringArray(),
    };
    return expert;
  }

  static validateReview(obj) {
    if (!obj || obj === undefined)
      throw new InvalidInputException("Input must not be empty");
    let expert = {
      // ...obj,
      // condition: Validator.nullcheck(obj.condition).checkString(),
      // stars: Validator.nullcheck(obj.stars).checkNumber(),
      // estimateValue: Validator.nullcheck(obj.estimateValue).checkString(),
      // reviewMessage: Validator.nullcheck(obj.reviewMessage).checkString(),
      // reviewDate: Validator.nullcheck(obj.reviewDate).checkDate()
    };
    return expert;
  }
}

export default Validator;
